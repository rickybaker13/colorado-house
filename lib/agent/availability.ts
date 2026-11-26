import { getServiceClient } from '@/lib/supabase';
import { addDays, lastBookableNight, stayNights } from './dates';

// Booking statuses that hold the dates (same set the website uses).
export const HOLDING_STATUSES = ['confirmed', 'requested', 'pending_approval'];

type AirbnbEvent = { nights: string[]; reserved: boolean };

/**
 * Airbnb's export has two kinds of events: "Reserved" (a real Airbnb guest)
 * and "Airbnb (Not available)" (dates blocked on Airbnb, which includes
 * dates Airbnb imported back from this website's own calendar).
 */
function parseICal(icalText: string): AirbnbEvent[] {
  const out: AirbnbEvent[] = [];
  const events = icalText.split('BEGIN:VEVENT');
  for (let i = 1; i < events.length; i++) {
    const start = events[i].match(/DTSTART(?:;VALUE=DATE)?:(\d{4})(\d{2})(\d{2})/);
    const end = events[i].match(/DTEND(?:;VALUE=DATE)?:(\d{4})(\d{2})(\d{2})/);
    if (!start || !end) continue;
    const summary = (events[i].match(/SUMMARY:([^\r\n]*)/)?.[1] ?? '').trim();
    // iCal DTEND is exclusive, so the nights are start..end-1
    out.push({
      nights: stayNights(`${start[1]}-${start[2]}-${start[3]}`, `${end[1]}-${end[2]}-${end[3]}`),
      reserved: !/not available/i.test(summary),
    });
  }
  return out;
}

/**
 * Read the Airbnb calendar. `fresh` skips every cache; use it whenever a
 * decision depends on the answer (accepting a request, charging a card,
 * approving a booking). Returns null if the calendar could not be read.
 */
export async function fetchAirbnbEvents(fresh = false): Promise<AirbnbEvent[] | null> {
  const icalUrl = process.env.AIRBNB_ICAL_URL;
  if (!icalUrl) return null;
  try {
    const res = await fetch(icalUrl, fresh ? { cache: 'no-store' } : { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const text = await res.text();
    // A real export always has the calendar wrapper; anything else is an error page.
    if (!text.includes('BEGIN:VCALENDAR')) return null;
    return parseICal(text);
  } catch (err) {
    console.error('Failed to fetch Airbnb iCal:', err);
    return null;
  }
}

/**
 * All blocked nights: Airbnb calendar, direct bookings that hold dates,
 * and dates the owner blocked manually. Each entry is a night (the date
 * a guest would sleep there), as YYYY-MM-DD.
 */
export async function getBlockedNights(opts: { fresh?: boolean } = {}): Promise<{ nights: Set<string>; airbnbSynced: boolean }> {
  const nights = new Set<string>();
  const airbnb = await fetchAirbnbEvents(opts.fresh);
  airbnb?.forEach((e) => e.nights.forEach((d) => nights.add(d)));

  const supabase = getServiceClient();
  const [{ data: bookings, error: e1 }, { data: manual, error: e2 }] = await Promise.all([
    supabase.from('bookings').select('check_in, check_out').in('status', HOLDING_STATUSES),
    supabase.from('blocked_dates').select('start_date, end_date'),
  ]);

  // Never report dates as open when the booking data could not be read.
  if (e1 || e2 || !bookings || !manual) throw new Error(`Calendar unavailable: ${(e1 ?? e2)?.message ?? 'no data'}`);
  for (const b of bookings) stayNights(b.check_in, b.check_out).forEach((d) => nights.add(d));
  // Manual blocks are inclusive of end_date
  for (const m of manual) stayNights(m.start_date, addDays(m.end_date, 1)).forEach((d) => nights.add(d));

  // Past the booking horizon nothing is open (Airbnb's feed ends there too).
  stayNights(addDays(lastBookableNight(), 1), addDays(lastBookableNight(), 400)).forEach((d) => nights.add(d));

  return { nights, airbnbSynced: airbnb !== null };
}

export type ConflictCheck = {
  /** False if the Airbnb calendar could not be read; treat as "not safe to proceed". */
  airbnbChecked: boolean;
  /** Human-readable reasons the dates are taken; empty if they are free. */
  conflicts: string[];
};

/**
 * Check one stay against everything, reading Airbnb fresh.
 *
 * - For a NEW request, every Airbnb block counts (strict).
 * - When APPROVING an existing request (`excludeBookingId`), only real Airbnb
 *   reservations count, because Airbnb's "Not available" blocks include this
 *   same request echoed back from the website's calendar. Other direct
 *   bookings count only once they are confirmed or approved.
 */
export async function checkStay(
  checkIn: string,
  checkOut: string,
  opts: { excludeBookingId?: string } = {},
): Promise<ConflictCheck> {
  const stay = new Set(stayNights(checkIn, checkOut));
  const overlaps = (nights: string[]) => nights.filter((d) => stay.has(d));
  const conflicts: string[] = [];
  const approving = Boolean(opts.excludeBookingId);

  const airbnb = await fetchAirbnbEvents(true);
  for (const e of airbnb ?? []) {
    if (approving && !e.reserved) continue;
    const hit = overlaps(e.nights);
    if (hit.length) conflicts.push(`Airbnb ${e.reserved ? 'reservation' : 'block'} on ${hit[0]}${hit.length > 1 ? ` to ${hit[hit.length - 1]}` : ''}`);
  }

  const supabase = getServiceClient();
  let q = supabase
    .from('bookings')
    .select('id, check_in, check_out, status')
    .in('status', approving ? ['confirmed', 'requested'] : HOLDING_STATUSES)
    .lt('check_in', checkOut)
    .gt('check_out', checkIn);
  if (opts.excludeBookingId) q = q.neq('id', opts.excludeBookingId);
  const [{ data: bookings, error: e1 }, { data: manual, error: e2 }] = await Promise.all([
    q,
    supabase.from('blocked_dates').select('start_date, end_date').lte('start_date', checkOut).gte('end_date', checkIn),
  ]);
  if (e1 || e2 || !bookings || !manual) throw new Error(`Calendar unavailable: ${(e1 ?? e2)?.message ?? 'no data'}`);

  for (const b of bookings) conflicts.push(`Website booking ${b.check_in} to ${b.check_out} (${b.status})`);
  for (const m of manual) {
    if (overlaps(stayNights(m.start_date, addDays(m.end_date, 1))).length) conflicts.push(`Blocked dates ${m.start_date} to ${m.end_date}`);
  }

  return { airbnbChecked: airbnb !== null, conflicts };
}
