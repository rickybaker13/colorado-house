// Lightning deposit for the guest's booking page.
//   POST { bookingId, token }  -> new invoice (+ ticket to poll with)
//   GET  ?ticket=...           -> { paid } ; confirms the booking once paid
import { getServiceClient } from '@/lib/supabase';
import { verifyBookingToken } from '@/lib/payments/link';
import { createDepositInvoice, invoicePaid, lightningEnabled, readTicket } from '@/lib/payments/lightning';
import { confirmDeposit } from '@/lib/payments/settle';

export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (!lightningEnabled()) return json({ error: 'Lightning payments are not enabled.' }, 503);
  const { bookingId, token } = (await request.json().catch(() => ({}))) as { bookingId?: string; token?: string };
  if (!bookingId || !verifyBookingToken(bookingId, token)) return json({ error: 'Invalid booking link.' }, 403);

  const { data: b } = await getServiceClient().from('bookings').select('status, payment_status, final_total').eq('id', bookingId).single();
  if (!b || b.status !== 'requested' || b.payment_status !== 'pending') return json({ error: 'This booking is not awaiting a deposit.' }, 409);

  try {
    const inv = await createDepositInvoice(bookingId, Math.round(Number(b.final_total) * 50) / 100, `booking ${bookingId.slice(0, 8)}`);
    return json({ invoice: inv.invoice, sats: inv.sats, usd: inv.usd, rate: inv.rate, expiresAt: inv.expiresAt, ticket: inv.ticket });
  } catch (err) {
    console.error('Lightning invoice error:', err);
    return json({ error: 'Could not create a Lightning invoice right now. Please try again shortly.' }, 503);
  }
}

export async function GET(request: Request) {
  const t = readTicket(new URL(request.url).searchParams.get('ticket'));
  if (!t) return json({ error: 'Invalid ticket.' }, 400);
  const paid = await invoicePaid(t.h, t.s).catch(() => false);
  if (paid) await confirmDeposit(t.b, { via: 'Lightning', reference: `payment hash ${t.h}` });
  return json({ paid, expired: !paid && Date.now() / 1000 > t.e });
}
