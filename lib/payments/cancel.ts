// Cancellation refunds, by the same policy as Airbnb and the booking page:
//   - within 24 hours of booking: full refund
//   - 30+ days before check-in: full refund
//   - 7 to 30 days before check-in: 50% of the total
//   - under 7 days: no refund
// The refund is capped at what the guest actually paid. Card payments are
// refunded through Square (balance payment first, then the deposit); anything
// paid by Venmo, Cash App or crypto is refunded by hand.
import { randomUUID } from 'crypto';
import { nightsBetween, todayAtProperty } from '@/lib/agent/dates';
import { squareClient } from '@/lib/payments/square';
import { methodLabel } from '@/lib/payments/methods';
import { getServiceClient } from '@/lib/supabase';
import { sendTelegramText } from '@/lib/notify';
import { releaseDamageOnCancel, type Booking } from '@/lib/payments/stay';

const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

export interface RefundPreview {
  rule: string;
  percent: number;
  paid: number;
  policyRefund: number;
  /** How much of the refund can go back through Square automatically. */
  byCard: number;
  /** How much the owners would send back by hand. */
  byHand: number;
  method: string;
}

/** Card payments that can be refunded through Square, balance first. */
function cardPayments(b: Booking): { id: string; amount: number; label: string }[] {
  const total = Number(b.final_total);
  const deposit = Number(b.deposit_amount) || round2(total / 2);
  const out: { id: string; amount: number; label: string }[] = [];
  if (b.balance_payment_id && ['charged', 'paid'].includes(b.balance_status)) out.push({ id: b.balance_payment_id, amount: round2(total - deposit), label: 'balance' });
  if (b.square_payment_id && ['deposit_paid', 'paid_in_full'].includes(b.payment_status)) out.push({ id: b.square_payment_id, amount: deposit, label: 'deposit' });
  // Earlier refunds come off the most recent payment first.
  let already = Number(b.refunded_amount || 0);
  for (const p of out) {
    const used = Math.min(already, p.amount);
    p.amount = round2(p.amount - used);
    already = round2(already - used);
  }
  return out.filter((p) => p.amount > 0);
}

/** What the guest has paid toward the stay (not the damage deposit). */
export function amountPaid(b: Booking): number {
  let paid = 0;
  if (['deposit_paid', 'paid_in_full'].includes(b.payment_status)) paid += Number(b.deposit_amount) || round2(Number(b.final_total) / 2);
  if (['charged', 'paid'].includes(b.balance_status)) paid += round2(Number(b.final_total) - (Number(b.deposit_amount) || round2(Number(b.final_total) / 2)));
  return round2(paid - Number(b.refunded_amount || 0));
}

export function previewRefund(b: Booking, now = new Date(), today = todayAtProperty()): RefundPreview {
  const total = Number(b.final_total);
  const daysOut = nightsBetween(today, b.check_in);
  const withinDay = now.getTime() - new Date(b.created_at).getTime() <= 24 * 3600 * 1000;
  let percent: number;
  let rule: string;
  if (withinDay) { percent = 100; rule = 'Cancelled within 24 hours of booking: full refund'; }
  else if (daysOut >= 30) { percent = 100; rule = `${daysOut} days before check-in (30+): full refund`; }
  else if (daysOut >= 7) { percent = 50; rule = `${daysOut} days before check-in (7 to 30): 50% refund`; }
  else { percent = 0; rule = `${Math.max(daysOut, 0)} days before check-in (under 7): no refund`; }
  const paid = amountPaid(b);
  const policyRefund = Math.min(paid, round2((total * percent) / 100));
  const split = splitRefund(b, policyRefund);
  return { rule, percent, paid, policyRefund, ...split, method: methodLabel(b.payment_method) };
}

function splitRefund(b: Booking, amount: number) {
  const card = cardPayments(b).reduce((s, p) => s + p.amount, 0);
  const byCard = round2(Math.min(amount, card));
  return { byCard, byHand: round2(amount - byCard) };
}

async function refund(paymentId: string, amount: number, reason: string) {
  const { refund } = await squareClient.refunds.refundPayment({
    idempotencyKey: randomUUID(),
    paymentId,
    amountMoney: { amount: BigInt(Math.round(amount * 100)), currency: 'USD' },
    reason: reason.slice(0, 192),
  });
  if (!refund || !['COMPLETED', 'PENDING', 'APPROVED'].includes(refund.status ?? '')) throw new Error(`refund ${refund?.status ?? 'missing'}`);
}

/**
 * Cancel a booking and refund `amount` (defaults to the policy amount).
 * Card money goes back through Square; the rest is reported for a manual refund.
 */
export async function cancelWithRefund(b: Booking, amount?: number): Promise<string> {
  const p = previewRefund(b);
  const want = round2(Math.max(0, Math.min(amount ?? p.policyRefund, p.paid)));
  const notes: string[] = [];
  let refunded = 0;

  // Card payments: the balance payment first, then the deposit.
  let left = want;
  for (const { id, amount: cap, label } of cardPayments(b)) {
    if (left <= 0) break;
    const part = Math.min(left, cap);
    try {
      await refund(id, part, 'Booking cancelled');
      refunded = round2(refunded + part);
      left = round2(left - part);
    } catch (err) {
      console.error(`Refund of ${label} failed`, b.id, err);
      notes.push(`⚠️ Couldn't refund ${money(part)} of the ${label} automatically. Refund it in the Square dashboard.`);
    }
  }
  if (refunded > 0) notes.push(`💸 Refunded ${money(refunded)} to the guest's card.`);
  const byHand = round2(want - splitRefund(b, want).byCard);
  if (byHand > 0) {
    notes.push(`↩️ Send ${money(byHand)} back to the guest by ${p.method} (paid outside Square).`);
  }
  if (want === 0) notes.push(p.percent === 0 ? 'No refund under the cancellation policy.' : 'Nothing was paid, so nothing to refund.');

  const damage = await releaseDamageOnCancel(b);
  await getServiceClient()
    .from('bookings')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), refunded_amount: round2(Number(b.refunded_amount || 0) + refunded) })
    .eq('id', b.id);

  const summary = `${p.rule}.\n${notes.join('\n')}${damage}`;
  await sendTelegramText(`🚫 CANCELLED\n${b.guest_name}, ${b.check_in} → ${b.check_out}\n${summary}`).catch(() => {});
  return summary;
}
