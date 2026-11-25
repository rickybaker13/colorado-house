// L402 (Lightning HTTP 402) deposit endpoint for AI agents.
//
//   GET /api/l402/deposit/<bookingId>?t=<booking token>
//     -> 402 Payment Required
//        WWW-Authenticate: L402 macaroon="<credential>", invoice="<bolt11>"
//   Pay the invoice, then retry with
//        Authorization: L402 <credential>:<preimage hex>
//     -> 200 with the confirmation.
//
// Works for a booking the owner has approved that is still awaiting its
// 50% deposit. The credential is an HMAC-signed token committing to the
// invoice's payment hash, used as an opaque L402 macaroon.
import { getServiceClient } from '@/lib/supabase';
import { verifyBookingToken } from '@/lib/payments/link';
import { createDepositInvoice, invoicePaid, lightningEnabled, preimageMatches, readTicket } from '@/lib/payments/lightning';
import { confirmDeposit } from '@/lib/payments/settle';

export const dynamic = 'force-dynamic';

const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

async function handle(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);
  if (!lightningEnabled()) return json({ error: 'Lightning payments are not enabled.' }, 503);
  if (!verifyBookingToken(id, url.searchParams.get('t'))) return json({ error: 'Invalid booking link.' }, 403);

  const supabase = getServiceClient();
  const { data: b } = await supabase.from('bookings').select('id, status, payment_status, final_total, check_in, check_out').eq('id', id).single();
  if (!b) return json({ error: 'Booking not found.' }, 404);

  // ── Step 2: the client paid and presents credential:preimage ──
  const auth = request.headers.get('authorization') || '';
  const m = auth.match(/^(?:L402|LSAT)\s+([^:\s]+):([0-9a-fA-F]{64})$/);
  if (m) {
    const t = readTicket(m[1]);
    if (!t || t.b !== id) return json({ error: 'Credential is not valid for this booking.' }, 401);
    if (!preimageMatches(m[2], t.h)) return json({ error: 'Preimage does not match the invoice.' }, 401);
    // The preimage proves payment; also confirm the amount with the wallet.
    if (!(await invoicePaid(t.h, t.s).catch(() => false))) {
      return json({ error: 'The wallet has not seen this payment settle yet. Retry in a few seconds.' }, 409);
    }
    const result = await confirmDeposit(id, { via: 'Lightning (L402)', reference: `payment hash ${t.h}` });
    if (result === 'not_payable') return json({ error: 'This booking is not awaiting a deposit.' }, 409);
    return json(
      {
        status: 'confirmed',
        booking_id: id,
        check_in: b.check_in,
        check_out: b.check_out,
        deposit_paid_sats: t.s,
        message: 'Deposit received. The booking is confirmed; the remaining 50% is due 30 days before check-in.',
      },
      200
    );
  }

  // ── Step 1: issue the challenge ──
  if (b.payment_status === 'deposit_paid') return json({ status: 'confirmed', message: 'The deposit is already paid.' }, 200);
  if (b.status === 'pending_approval') {
    return json({ status: 'pending_owner_approval', message: 'The owner has not approved this request yet. Try again after approval.' }, 409);
  }
  if (b.status !== 'requested' || b.payment_status !== 'pending') {
    return json({ status: b.status, message: 'This booking is not awaiting a deposit.' }, 409);
  }

  const usd = Math.round(Number(b.final_total) * 50) / 100;
  let inv;
  try {
    inv = await createDepositInvoice(id, usd, `booking ${id.slice(0, 8)}`);
  } catch (err) {
    console.error('L402 invoice error:', err);
    return json({ error: 'Could not create a Lightning invoice right now. Try again shortly.' }, 503);
  }
  return json(
    {
      status: 'payment_required',
      amount_sats: inv.sats,
      amount_usd: usd,
      btc_usd_rate: inv.rate,
      invoice: inv.invoice,
      expires_at: new Date(inv.expiresAt * 1000).toISOString(),
      how_to_pay: 'Pay the invoice, then repeat this request with header "Authorization: L402 <macaroon>:<preimage hex>".',
    },
    402,
    { 'WWW-Authenticate': `L402 macaroon="${inv.ticket}", invoice="${inv.invoice}"` }
  );
}

export const GET = handle;
export const POST = handle;
