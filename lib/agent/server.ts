import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { getServiceClient } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/notify';
import { getBlockedNights, HOLDING_STATUSES } from './availability';
import { addDays, stayNights, todayAtProperty, validateStay } from './dates';
import { logAgentCall } from './log';
import { buildQuote, getRentalConfig } from './pricing';
import { ALL_METHOD_IDS, enabledMethods, isEnabled, methodLabel } from '@/lib/payments/methods';
import { bookingStatusUrl, bookingToken } from '@/lib/payments/link';
import { lightningEnabled } from '@/lib/payments/lightning';
import { getPhotos, PROPERTY, SITE_URL } from './property';

type ToolResult = { content: { type: 'text'; text: string }[]; structuredContent?: Record<string, unknown>; isError?: boolean };

class Rejection extends Error {}

function ok(data: Record<string, unknown>): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], structuredContent: data };
}

/** Runs a tool body, turns Rejections into helpful tool errors, and logs every call. */
function instrument<A extends Record<string, unknown>>(
  tool: string,
  request: Request | undefined,
  body: (args: A) => Promise<Record<string, unknown>>,
) {
  return async (args: A): Promise<ToolResult> => {
    const started = Date.now();
    try {
      const data = await body(args);
      await logAgentCall({ tool, args, outcome: 'ok', durationMs: Date.now() - started, request });
      return ok(data);
    } catch (err) {
      const rejected = err instanceof Rejection;
      const message = rejected ? err.message : 'Something went wrong on our side. Please try again in a minute.';
      if (!rejected) console.error(`MCP tool ${tool} failed:`, err);
      await logAgentCall({
        tool,
        args,
        outcome: rejected ? 'rejected' : 'error',
        detail: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - started,
        request,
      });
      return { content: [{ type: 'text', text: message }], isError: true };
    }
  };
}


const date = (what: string) => z.string().describe(`${what} date, YYYY-MM-DD (e.g. 2027-01-15)`);

export function createRentalServer(request?: Request): McpServer {
  const server = new McpServer(
    { name: 'purgatory-townhouse', version: '0.1.0' },
    {
      instructions:
        'Direct booking for Purgatory Townhouse, a 4-bedroom, 10-guest townhouse across the highway from the Purgatory Resort entrance near Durango, Colorado, on the free on-demand ski shuttle line. ' +
        'Typical flow: townhouse_check_availability or townhouse_get_calendar, then townhouse_get_quote, then townhouse_request_booking once the traveler approves. ' +
        'Requests are reviewed by the owner before confirmation. Booking direct is 15% below Airbnb nightly prices.',
    },
  );

  const RO = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

  server.registerTool(
    'townhouse_check_availability',
    {
      title: 'Check availability',
      description:
        'Check whether the townhouse is open for specific dates. Returns available true/false, any blocked nights in the range, and the minimum stay.',
      inputSchema: z.strictObject({ check_in: date('Arrival'), check_out: date('Departure') }),
      annotations: RO,
    },
    instrument('townhouse_check_availability', request, async ({ check_in, check_out }) => {
      const cfg = await getRentalConfig();
      const invalid = validateStay(check_in, check_out, cfg.minNights);
      if (invalid) throw new Rejection(invalid);
      const { nights, airbnbSynced } = await getBlockedNights();
      const blocked = stayNights(check_in, check_out).filter((d) => nights.has(d));
      return {
        check_in,
        check_out,
        available: blocked.length === 0,
        blocked_nights: blocked,
        min_nights: cfg.minNights,
        calendar_complete: airbnbSynced,
        ...(airbnbSynced ? {} : { note: 'The Airbnb calendar could not be read just now, so availability will be double-checked by the owner.' }),
        next_step: blocked.length === 0 ? 'Call townhouse_get_quote for the exact price.' : 'Try townhouse_get_calendar to find open dates nearby.',
      };
    }),
  );

  server.registerTool(
    'townhouse_get_calendar',
    {
      title: 'Get calendar',
      description:
        'List open and blocked nights for a date window (up to 120 days). Use this when the traveler has flexible dates. A night is the date the guest sleeps there.',
      inputSchema: z.strictObject({
        start: date('First date to show').optional().describe('First date to show, YYYY-MM-DD. Defaults to today.'),
        days: z.number().int().min(1).max(120).default(60).describe('How many days to show (1-120).'),
      }),
      annotations: RO,
    },
    instrument('townhouse_get_calendar', request, async ({ start, days }) => {
      const today = todayAtProperty();
      let from = start ?? today;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) throw new Rejection('start must be YYYY-MM-DD.');
      if (from < today) from = today;
      const [{ nights }, cfg] = await Promise.all([getBlockedNights(), getRentalConfig()]);
      const window = stayNights(from, addDays(from, days));
      // Collapse open nights into ranges so agents can read them at a glance.
      const openRanges: { first_night: string; last_night: string; nights: number; latest_check_out: string }[] = [];
      for (const d of window) {
        if (nights.has(d)) continue;
        const last = openRanges[openRanges.length - 1];
        if (last && addDays(last.last_night, 1) === d) {
          last.last_night = d;
          last.nights++;
          last.latest_check_out = addDays(d, 1);
        } else {
          openRanges.push({ first_night: d, last_night: d, nights: 1, latest_check_out: addDays(d, 1) });
        }
      }
      return {
        window_start: from,
        window_end: addDays(from, days - 1),
        min_nights: cfg.minNights,
        open_ranges: openRanges.filter((r) => r.nights >= cfg.minNights),
        blocked_nights: window.filter((d) => nights.has(d)),
      };
    }),
  );

  server.registerTool(
    'townhouse_get_quote',
    {
      title: 'Get price quote',
      description:
        'Exact price for a stay: nightly rates by season, cleaning fee, pet fee, total, deposit, and an estimate of what the same stay costs on Airbnb. Also confirms the dates are open.',
      inputSchema: z.strictObject({
        check_in: date('Arrival'),
        check_out: date('Departure'),
        guests: z.number().int().min(1).describe('Number of guests, including children.'),
        pets: z.number().int().min(0).default(0).describe('Number of pets.'),
      }),
      annotations: RO,
    },
    instrument('townhouse_get_quote', request, async ({ check_in, check_out, guests, pets }) => {
      const cfg = await getRentalConfig();
      const invalid = validateStay(check_in, check_out, cfg.minNights);
      if (invalid) throw new Rejection(invalid);
      if (guests > cfg.maxGuests) throw new Rejection(`The townhouse sleeps up to ${cfg.maxGuests} guests.`);
      if (pets > cfg.maxPets) throw new Rejection(`Up to ${cfg.maxPets} pets are allowed.`);
      const { nights } = await getBlockedNights();
      const blocked = stayNights(check_in, check_out).filter((d) => nights.has(d));
      return {
        ...buildQuote(cfg, check_in, check_out, guests, pets),
        available: blocked.length === 0,
        blocked_nights: blocked,
        payment_methods: enabledMethods(cfg.btcDiscountPercent).map((m) => m.id),
        next_step:
          blocked.length === 0
            ? 'If the traveler approves this price, call townhouse_request_booking.'
            : 'These dates are not open. Use townhouse_get_calendar to find alternatives.',
      };
    }),
  );

  server.registerTool(
    'townhouse_get_property_info',
    {
      title: 'Get property details',
      description:
        'Facts about the townhouse: capacity, rooms, amenities, location and ski access, check-in and check-out times, and policies. Fields the owner has not published are null; do not guess them.',
      inputSchema: z.strictObject({
        section: z
          .enum(['all', 'overview', 'rooms', 'amenities', 'location', 'policies'])
          .default('all')
          .describe('Which part to return.'),
      }),
      annotations: RO,
    },
    instrument('townhouse_get_property_info', request, async ({ section }) => {
      const { name, website, booking_page, summary, capacity, rooms, amenities, location, policies } = PROPERTY;
      const overview = { name, website, booking_page, summary, capacity };
      switch (section) {
        case 'overview': return overview;
        case 'rooms': return { name, capacity, rooms };
        case 'amenities': return { name, amenities };
        case 'location': return { name, location };
        case 'policies': return { name, policies };
        default: return { ...overview, rooms, amenities, location, policies };
      }
    }),
  );

  server.registerTool(
    'townhouse_get_photos',
    {
      title: 'Get photos',
      description:
        'Photo URLs with a description of what each shows. Category "area" is scenery near the townhouse, not the townhouse itself (shows_the_property is false).',
      inputSchema: z.strictObject({
        category: z
          .enum(['all', 'exterior', 'living', 'kitchen_dining', 'bedrooms', 'bathrooms', 'details', 'area'])
          .default('all')
          .describe('Which photos to return.'),
      }),
      annotations: RO,
    },
    instrument('townhouse_get_photos', request, async ({ category }) => {
      const photos = getPhotos(category);
      return { count: photos.length, photos };
    }),
  );

  server.registerTool(
    'townhouse_request_booking',
    {
      title: 'Request a booking',
      description:
        'Submit a booking request for the traveler. Only call this after the traveler has seen the quote and approved sending the request. ' +
        'The owner reviews every request (usually within a day); the dates are held while it is pending. Nothing is charged by this call. ' +
        'Once approved, the traveler pays the 50% deposit from the private booking page this call returns (card, or the chosen method). ' +
        'Payment methods available: see payment_methods in townhouse_get_quote.',
      inputSchema: z.strictObject({
        check_in: date('Arrival'),
        check_out: date('Departure'),
        guests: z.number().int().min(1).describe('Number of guests, including children.'),
        pets: z.number().int().min(0).default(0).describe('Number of pets.'),
        guest_name: z.string().min(2).max(100).describe("Traveler's full name."),
        guest_email: z.email().describe("Traveler's email; the owner sends confirmation and payment details here."),
        guest_phone: z.string().max(30).optional().describe("Traveler's phone number (optional)."),
        payment_method: z
          .enum(ALL_METHOD_IDS as [string, ...string[]])
          .default('credit_card')
          .describe('How the traveler plans to pay the deposit. Must be one of payment_methods from townhouse_get_quote. Bitcoin gets a discount.'),
        message: z.string().max(1000).optional().describe('Questions or notes for the owner (arrival time, special requests).'),
        agent_name: z.string().max(100).describe('Name of the AI agent or app submitting this, e.g. "Claude" or "TripPlanner".'),
        traveler_approved: z
          .literal(true)
          .describe('Must be true: confirms the traveler saw the quote and asked you to send this request.'),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    instrument('townhouse_request_booking', request, async (a) => {
      const cfg = await getRentalConfig();
      const invalid = validateStay(a.check_in, a.check_out, cfg.minNights);
      if (invalid) throw new Rejection(invalid);
      if (a.guests > cfg.maxGuests) throw new Rejection(`The townhouse sleeps up to ${cfg.maxGuests} guests.`);
      if (a.pets > cfg.maxPets) throw new Rejection(`Up to ${cfg.maxPets} pets are allowed.`);
      if (!isEnabled(a.payment_method)) {
        const options = enabledMethods(cfg.btcDiscountPercent).map((m) => m.id);
        throw new Rejection(`Payment method "${a.payment_method}" is not available. Choose one of: ${options.join(', ')}.`);
      }

      const { nights, airbnbSynced } = await getBlockedNights({ fresh: true });
      if (!airbnbSynced) {
        throw new Rejection('The Airbnb calendar could not be checked just now, so the request was not sent. Try again in a few minutes.');
      }
      const blocked = stayNights(a.check_in, a.check_out).filter((d) => nights.has(d));
      if (blocked.length) {
        throw new Rejection(`These dates are no longer open (blocked: ${blocked.join(', ')}). Use townhouse_get_calendar to find alternatives.`);
      }

      const supabase = getServiceClient();
      // One pending request per traveler keeps a stray loop from holding the whole calendar.
      const { data: pending } = await supabase
        .from('bookings')
        .select('id')
        .ilike('guest_email', a.guest_email.replace(/[\\%_]/g, (c) => `\\${c}`))
        .in('status', HOLDING_STATUSES)
        .gte('check_out', todayAtProperty())
        .limit(1);
      if (pending?.length) {
        throw new Rejection('This traveler already has a pending or confirmed booking. The owner will follow up by email; contact them through the website to change it.');
      }

      const quote = buildQuote(cfg, a.check_in, a.check_out, a.guests, a.pets);
      const btc = a.payment_method === 'bitcoin' ? quote.bitcoin_option : undefined;
      const finalTotal = btc ? btc.total : quote.subtotal;
      const note = `[Requested via AI agent: ${a.agent_name}]${a.message ? `\n${a.message}` : ''}`;

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          guest_name: a.guest_name,
          guest_email: a.guest_email,
          guest_phone: a.guest_phone ?? null,
          guest_message: note,
          check_in: a.check_in,
          check_out: a.check_out,
          num_guests: a.guests,
          num_pets: a.pets,
          nightly_total: quote.nightly_total,
          cleaning_fee: quote.cleaning_fee,
          pet_fee: quote.pet_fee,
          subtotal: quote.subtotal,
          btc_discount: btc ? btc.discount : 0,
          final_total: finalTotal,
          payment_method: a.payment_method,
          status: 'pending_approval',
          payment_status: 'pending',
          deposit_amount: 0,
        })
        .select('id')
        .single();
      if (error || !booking) throw new Error(`Booking insert failed: ${error?.message}`);

      try {
        await sendTelegramNotification({
          id: booking.id,
          source_label: `AI agent (${a.agent_name})`,
          guest_name: a.guest_name,
          guest_email: a.guest_email,
          guest_phone: a.guest_phone || null,
          guest_message: note,
          check_in: a.check_in,
          check_out: a.check_out,
          num_guests: a.guests,
          num_pets: a.pets,
          nightly_total: quote.nightly_total,
          cleaning_fee: quote.cleaning_fee,
          pet_fee: quote.pet_fee,
          btc_discount: btc ? btc.discount : 0,
          final_total: finalTotal,
          payment_method: a.payment_method,
          deposit_amount: 0,
        });
      } catch (err) {
        console.error('Telegram notification error:', err);
      }

      return {
        request_id: booking.id,
        status: 'pending_owner_approval',
        check_in: a.check_in,
        check_out: a.check_out,
        total: finalTotal,
        deposit_due_after_approval: Math.round(finalTotal * 50) / 100,
        payment_method: a.payment_method,
        booking_page: bookingStatusUrl(booking.id),
        ...(lightningEnabled()
          ? {
              lightning_l402_deposit_url: `${SITE_URL}/api/l402/deposit/${booking.id}?t=${bookingToken(booking.id)}`,
              lightning_note:
                'After the owner approves, an agent with a Lightning wallet can pay the deposit itself: GET this URL, pay the invoice in the 402 response, and retry with "Authorization: L402 <macaroon>:<preimage>". Before approval it returns 409.',
            }
          : {}),
        what_happens_next:
          `The owner reviews the request, usually within a day, and emails ${a.guest_email}. ` +
          `Once approved, the booking page shows how to pay the 50% deposit by ${methodLabel(a.payment_method)} (or by card), and card payments confirm the booking instantly. ` +
          'The remaining 50% is due 30 days before check-in. The dates are held while the request is pending. Nothing has been charged. ' +
          'Give the traveler the booking_page link; it is private to them.',
      };
    }),
  );

  return server;
}
