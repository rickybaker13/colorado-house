// Payments after the booking deposit: the 50% balance (due 30 days before
// check-in) and the refundable damage deposit.
//
// Card guests: the card used for the booking deposit is saved on file (they
// agree to this when paying). The daily job charges the balance from it and,
// on arrival day, places a $500 hold. Square holds lapse after 7 days, so
// stays of 5+ nights are charged and refunded instead. Three days after
// checkout the deposit is released automatically unless the owners claim some
// of it in Telegram. The hold is placed the morning of check-in (hours before
// the 4 PM arrival) so it lasts as far past checkout as possible.
//
// Everyone else: the damage deposit is sent with the balance (Venmo, Cash App,
// crypto) and returned by hand; Telegram reminds the owners.
import { randomUUID } from 'crypto';
import { addDays, nightsBetween, todayAtProperty } from '@/lib/agent/dates';
import { squareClient, squareLocationId } from '@/lib/payments/square';
import { bookingStatusUrl } from '@/lib/payments/link';
import { methodLabel } from '@/lib/payments/methods';
import { getServiceClient } from '@/lib/supabase';
import { sendTelegramText } from '@/lib/notify';

/** Stays this long or shorter get a card hold; longer stays are charged and refunded. */
export const MAX_HOLD_NIGHTS = 4;
/** Days after checkout before an unclaimed deposit is released automatically. */
export const RELEASE_AFTER_DAYS = 3;
export const BALANCE_DAYS_BEFORE = 30;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Booking = Record<string, any>;

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const cents = (n: number) => BigInt(Math.round(n * 100));
const round2 = (n: number) => Math.round(n * 100) / 100;

export const depositOf = (b: Booking) => round2(Number(b.final_total) * 0.5);
export const balanceOf = (b: Booking) => round2(Number(b.final_total) - depositOf(b));
export const balanceDueDate = (b: Booking) => addDays(b.check_in, -BALANCE_DAYS_BEFORE);
export const releaseDate = (b: Booking) => addDays(b.check_out, RELEASE_AFTER_DAYS);
export const isCard = (b: Booking) => b.payment_method === 'credit_card';

/** How the card damage deposit will be taken for this stay. */
export const cardDamageMethod = (b: Booking): 'hold' | 'charge' =>
  nightsBetween(b.check_in, b.check_out) <= MAX_HOLD_NIGHTS ? 'hold' : 'charge';

/**
 * Last day the daily job can safely act on a card hold: it's placed on the
 * check-in morning and Square voids it 7 days later at about the same time.
 */
export const holdLastDay = (b: Booking) =>
  addDays(b.damage_collected_at ? propertyDate(b.damage_collected_at) : b.check_in, 6);

/** Calendar date at the property (Mountain Time) for a timestamp. */
export function propertyDate(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}

/** The day an unclaimed deposit is released automatically. */
export const autoReleaseDate = (b: Booking) =>
  b.damage_method === 'hold' && holdLastDay(b) < releaseDate(b) ? holdLastDay(b) : releaseDate(b);

const who = (b: Booking) => `${b.guest_name}, ${b.check_in} → ${b.check_out}`;

async function update(id: string, fields: Record<string, unknown>) {
  const { error } = await getServiceClient().from('bookings').update(fields).eq('id', id);
  if (error) throw new Error(`Booking update failed: ${error.message}`);
}

// ── Card on file ─────────────────────────────────────────────────────────────

/**
 * Save the card behind a recent payment for later balance and damage-deposit
 * charges. Best-effort: if Square won't save it, the guest pays those on their
 * booking page instead. Returns the card ID or null.
 */
export async function saveCardFromPayment(b: Booking, paymentId: string): Promise<string | null> {
  if (b.square_card_id) return b.square_card_id;
  try {
    let customerId: string | undefined = b.square_customer_id || undefined;
    if (!customerId) {
      const [given, ...rest] = String(b.guest_name || '').trim().split(/\s+/);
      const { customer } = await squareClient.customers.create({
        idempotencyKey: `customer-${b.id}`,
        givenName: given || undefined,
        familyName: rest.join(' ') || undefined,
        emailAddress: b.guest_email || undefined,
        referenceId: `booking-${b.id}`,
        note: 'Purgatory Townhouse direct booking guest',
      });
      customerId = customer?.id;
      if (!customerId) throw new Error('no customer id');
    }
    const { card } = await squareClient.cards.create({
      idempotencyKey: `card-${b.id}-${paymentId}`.slice(0, 45),
      sourceId: paymentId,
      card: { customerId, cardholderName: b.guest_name || undefined, referenceId: `booking-${b.id}` },
    });
    if (!card?.id) throw new Error('no card id');
    await update(b.id, { square_customer_id: customerId, square_card_id: card.id });
    b.square_customer_id = customerId;
    b.square_card_id = card.id;
    return card.id;
  } catch (err) {
    console.error('Could not save card on file for booking', b.id, err);
    return null;
  }
}

async function chargeSavedCard(b: Booking, amount: number, opts: { key: string; note: string; hold?: boolean; sourceId?: string }) {
  const { payment } = await squareClient.payments.create({
    sourceId: opts.sourceId ?? b.square_card_id,
    ...(opts.sourceId ? {} : { customerId: b.square_customer_id }),
    idempotencyKey: opts.key,
    locationId: squareLocationId(),
    amountMoney: { amount: cents(amount), currency: 'USD' },
    autocomplete: !opts.hold,
    ...(opts.hold ? { delayAction: 'CANCEL' } : {}),
    note: opts.note.slice(0, 500),
    buyerEmailAddress: b.guest_email || undefined,
  });
  const ok = opts.hold ? payment?.status === 'APPROVED' : payment?.status === 'COMPLETED';
  if (!payment?.id || !ok) throw new Error(`Square payment ${payment?.status ?? 'missing'}`);
  return payment.id;
}

// ── Balance ──────────────────────────────────────────────────────────────────

/** Daily job: collect the balance once it's due. One automatic card attempt; after that the guest pays on their page. */
export async function processBalance(b: Booking): Promise<string> {
  const balance = balanceOf(b);
  const extra = Number(b.damage_deposit) > 0 && !isCard(b) ? Number(b.damage_deposit) : 0;

  if (isCard(b) && b.square_card_id && b.balance_status === 'due') {
    try {
      const paymentId = await chargeSavedCard(b, balance, {
        key: `balance-${b.id}`,
        note: `Purgatory Townhouse balance: ${who(b)}`,
      });
      await update(b.id, { balance_status: 'charged', balance_payment_id: paymentId, balance_paid_at: new Date().toISOString(), payment_status: 'paid_in_full' });
      await sendTelegramText(`💳 BALANCE CHARGED\n${who(b)}\n${money(balance)} charged to the card on file. Paid in full.`);
      return 'balance charged';
    } catch (err) {
      console.error('Balance charge failed', b.id, err);
      await update(b.id, { balance_status: 'failed' });
      await sendTelegramText(
        `⚠️ BALANCE CARD CHARGE FAILED\n${who(b)}\n${money(balance)} couldn't be charged to the saved card.\n` +
          `The guest can pay it by card on their booking page; email them this link:\n${bookingStatusUrl(b.id)}`,
        receivedKeyboard(b.id, 'Balance received another way'),
      );
      return 'balance failed';
    }
  }

  if (b.balance_status === 'due') {
    await update(b.id, { balance_status: 'reminded' });
    const total = round2(balance + extra);
    await sendTelegramText(
      `📅 BALANCE DUE\n${who(b)}\nBalance ${money(balance)}${extra ? ` + ${money(extra)} refundable damage deposit = ${money(total)}` : ''} by ${methodLabel(b.payment_method)}.\n` +
        `Their booking page shows how to pay; email them this link as a reminder:\n${bookingStatusUrl(b.id)}\n\nTap below once it arrives.`,
      receivedKeyboard(b.id, extra ? 'Balance + damage deposit received' : 'Balance received'),
    );
    return 'balance reminder sent';
  }
  return 'balance already handled';
}

export function receivedKeyboard(bookingId: string, label: string) {
  return { inline_keyboard: [[{ text: `💰 ${label}`, callback_data: `balpaid:${bookingId}` }]] };
}

/** Owner confirmed an off-card balance (and damage deposit) arrived. */
export async function markBalanceReceived(b: Booking): Promise<string> {
  const fields: Record<string, unknown> = { balance_status: 'paid', balance_paid_at: new Date().toISOString(), payment_status: 'paid_in_full' };
  let note = `Balance ${money(balanceOf(b))} received. Paid in full.`;
  if (Number(b.damage_deposit) > 0 && b.damage_status === 'due' && !isCard(b)) {
    Object.assign(fields, { damage_status: 'collected', damage_method: 'offline', damage_collected_at: new Date().toISOString() });
    note += ` Damage deposit ${money(Number(b.damage_deposit))} received; you'll be asked about it after checkout.`;
  }
  await update(b.id, fields);
  return note;
}

/** Guest paid the balance by card on their booking page (after a failed charge, or by choice). */
export async function payBalanceWithCard(b: Booking, sourceId: string): Promise<number> {
  const balance = balanceOf(b);
  const paymentId = await chargeSavedCard(b, balance, {
    key: `balance-page-${b.id}-${randomUUID().slice(0, 8)}`,
    sourceId,
    note: `Purgatory Townhouse balance: ${who(b)}`,
  });
  // A card guest now; the damage deposit follows the card flow too.
  await update(b.id, { balance_status: 'charged', balance_payment_id: paymentId, balance_paid_at: new Date().toISOString(), payment_status: 'paid_in_full', payment_method: 'credit_card' });
  await saveCardFromPayment(b, paymentId);
  await sendTelegramText(`💳 BALANCE PAID BY CARD (booking page)\n${who(b)}\n${money(balance)} charged. Paid in full.`);
  return balance;
}

/** Guest placed the damage deposit by card on their booking page. */
export async function payDamageWithCard(b: Booking, sourceId: string): Promise<{ amount: number; method: 'hold' | 'charge' }> {
  const amount = Number(b.damage_deposit);
  const method = cardDamageMethod(b);
  const paymentId = await chargeSavedCard(b, amount, {
    key: `damage-page-${b.id}-${randomUUID().slice(0, 8)}`,
    sourceId,
    hold: method === 'hold',
    note: `Purgatory Townhouse refundable damage deposit (${method}): ${who(b)}`,
  });
  const collectedAt = new Date().toISOString();
  await update(b.id, { damage_status: method === 'hold' ? 'held' : 'charged', damage_method: method, damage_payment_id: paymentId, damage_collected_at: collectedAt });
  await sendTelegramText(
    `🛡️ DAMAGE DEPOSIT ${method === 'hold' ? 'HELD' : 'CHARGED'} (booking page)\n${who(b)}\n${money(amount)}. Released automatically on ${autoReleaseDate({ ...b, damage_method: method, damage_collected_at: collectedAt })} unless you claim damage.`,
  );
  return { amount, method };
}

/** The booking page offers the damage-deposit card form from 2 days before arrival. */
export const damageFormOpen = (b: Booking, today = todayAtProperty()) =>
  b.status === 'confirmed' && ['due', 'failed'].includes(b.damage_status) && Number(b.damage_deposit) > 0 &&
  today >= addDays(b.check_in, -2) && today < b.check_out;

/** The booking page offers the balance card form once it's due, or after a failed charge. */
export const balanceFormOpen = (b: Booking, today = todayAtProperty()) =>
  b.status === 'confirmed' && b.payment_status === 'deposit_paid' && ['due', 'failed', 'reminded'].includes(b.balance_status) &&
  (b.balance_status !== 'due' || today >= balanceDueDate(b)) && today < b.check_out;

// ── Damage deposit ───────────────────────────────────────────────────────────

/** Daily job, the morning of arrival: hold (or charge) the damage deposit on the saved card. */
export async function collectCardDamage(b: Booking): Promise<string> {
  const amount = Number(b.damage_deposit);
  const method = cardDamageMethod(b);
  if (!b.square_card_id) {
    await update(b.id, { damage_status: 'failed' });
    await sendTelegramText(
      `⚠️ DAMAGE DEPOSIT NOT ON FILE\n${who(b)}\nNo saved card, so the ${money(amount)} hold couldn't be placed. The guest can add it on their booking page:\n${bookingStatusUrl(b.id)}`,
    );
    return 'damage: no saved card';
  }
  try {
    const paymentId = await chargeSavedCard(b, amount, {
      key: `damage-${b.id}`,
      hold: method === 'hold',
      note: `Purgatory Townhouse refundable damage deposit (${method}): ${who(b)}`,
    });
    await update(b.id, { damage_status: method === 'hold' ? 'held' : 'charged', damage_method: method, damage_payment_id: paymentId, damage_collected_at: new Date().toISOString() });
    await sendTelegramText(
      `🛡️ DAMAGE DEPOSIT ${method === 'hold' ? 'HELD' : 'CHARGED'}\n${who(b)}\n${money(amount)} ${method === 'hold' ? 'held on the card (not charged)' : 'charged to the card (stay is too long for a hold); refunded after checkout'}.\n` +
        `Released automatically on ${autoReleaseDate({ ...b, damage_method: method })} unless you claim damage.`,
    );
    return `damage ${method}`;
  } catch (err) {
    console.error('Damage deposit failed', b.id, err);
    await update(b.id, { damage_status: 'failed' });
    await sendTelegramText(
      `⚠️ DAMAGE DEPOSIT CARD FAILED\n${who(b)}\nThe ${money(amount)} ${method} on the saved card was declined. The guest can add it on their booking page; email them:\n${bookingStatusUrl(b.id)}`,
    );
    return 'damage failed';
  }
}

export function damageKeyboard(bookingId: string) {
  return {
    inline_keyboard: [
      [{ text: '✅ No damage: release deposit', callback_data: `dmgrel:${bookingId}` }],
      [
        { text: 'Keep $100', callback_data: `dmg100:${bookingId}` },
        { text: 'Keep $250', callback_data: `dmg250:${bookingId}` },
        { text: 'Keep all', callback_data: `dmgall:${bookingId}` },
      ],
    ],
  };
}

/** Checkout day: ask the owners about damage. */
export async function notifyCheckout(b: Booking): Promise<string> {
  const amount = Number(b.damage_deposit);
  const auto = autoReleaseDate(b);
  await sendTelegramText(
    `🏁 CHECKOUT TODAY: damage deposit\n${who(b)}\n${money(amount)} ${b.damage_method === 'hold' ? 'card hold' : b.damage_method === 'charge' ? 'charged to card' : `received by ${methodLabel(b.payment_method)}`}.\n\n` +
      `After the cleaners look the place over, tap below. If you do nothing, it's released automatically on ${auto}` +
      (auto < releaseDate(b) ? ' (card holds expire after 7 days, so this stay gets a shorter window)' : '') +
      `.\nFor another amount, use the Bookings page in admin.`,
    damageKeyboard(b.id),
  );
  await update(b.id, { checkout_notified_at: new Date().toISOString() });
  return 'checkout notice sent';
}

/**
 * Keep `claim` dollars (0 = release everything). Card hold: capture it and
 * refund the rest. Card charge: refund the rest. Off-card: tell the owners
 * what to send back.
 */
export async function settleDamage(b: Booking, claim: number, reason: string): Promise<string> {
  const amount = Number(b.damage_deposit);
  claim = Math.max(0, Math.min(amount, round2(claim)));
  const refund = round2(amount - claim);
  const closed = { damage_claimed: claim, damage_closed_at: new Date().toISOString(), damage_status: claim > 0 ? 'claimed' : 'released' };

  if (!['held', 'charged', 'collected'].includes(b.damage_status)) {
    return `Nothing to settle (deposit is ${b.damage_status}).`;
  }

  if (b.damage_status === 'collected') {
    // Received by Venmo/Cash App/crypto: the owners send the refund by hand.
    await update(b.id, { ...closed, damage_status: refund > 0 ? 'return_due' : 'claimed' });
    return refund > 0
      ? `Send ${money(refund)} back to ${b.guest_name} by ${methodLabel(b.payment_method)}${claim ? ` (keeping ${money(claim)})` : ''}, then tap "Returned".`
      : `Keeping the full ${money(amount)}.`;
  }

  if (b.damage_status === 'held') {
    const { payment: current } = await squareClient.payments.get({ paymentId: b.damage_payment_id });
    if (current?.status === 'CANCELED') {
      await update(b.id, { ...closed, damage_claimed: 0, damage_status: 'released' });
      return claim > 0
        ? `The card hold had already expired, so nothing could be kept. The guest was never charged.`
        : `Card hold of ${money(amount)} had already expired. The guest was never charged.`;
    }
    if (claim === 0) {
      await squareClient.payments.cancel({ paymentId: b.damage_payment_id });
      await update(b.id, closed);
      return `Card hold of ${money(amount)} released. The guest was never charged.`;
    }
    const { payment } = await squareClient.payments.complete({ paymentId: b.damage_payment_id });
    if (payment?.status !== 'COMPLETED') throw new Error(`capture ${payment?.status}`);
    if (refund > 0) await refundPart(b, refund, reason);
    await update(b.id, closed);
    return `Kept ${money(claim)} of the ${money(amount)} hold${refund > 0 ? `; the other ${money(refund)} is refunded` : ''}.`;
  }

  // charged
  if (refund > 0) await refundPart(b, refund, reason);
  await update(b.id, closed);
  return claim > 0 ? `Kept ${money(claim)}; refunded ${money(refund)}.` : `Refunded the full ${money(amount)}.`;
}

async function refundPart(b: Booking, amount: number, reason: string) {
  const { refund } = await squareClient.refunds.refundPayment({
    idempotencyKey: randomUUID(),
    paymentId: b.damage_payment_id,
    amountMoney: { amount: cents(amount), currency: 'USD' },
    reason: reason.slice(0, 192),
  });
  if (!refund || !['COMPLETED', 'PENDING', 'APPROVED'].includes(refund.status ?? '')) {
    throw new Error(`refund ${refund?.status ?? 'missing'}`);
  }
}

/** Release a deposit when a booking is cancelled or denied. Never throws. */
export async function releaseDamageOnCancel(b: Booking): Promise<string> {
  if (!['held', 'charged', 'collected'].includes(b.damage_status)) return '';
  try {
    return '\n🛡️ ' + (await settleDamage(b, 0, 'Booking cancelled'));
  } catch (err) {
    console.error('Damage release on cancel failed', b.id, err);
    return '\n⚠️ Could not release the damage deposit automatically. Check the Square dashboard.';
  }
}

// ── Daily job ────────────────────────────────────────────────────────────────

export async function runDailyPayments(today = todayAtProperty()): Promise<string[]> {
  const supabase = getServiceClient();
  const log: string[] = [];
  const run = async (label: string, b: Booking, fn: () => Promise<string>) => {
    try {
      log.push(`${label} ${b.id.slice(0, 8)}: ${await fn()}`);
    } catch (err) {
      console.error(label, b.id, err);
      log.push(`${label} ${b.id.slice(0, 8)}: error ${err instanceof Error ? err.message : err}`);
      await sendTelegramText(`⚠️ Payment step "${label}" failed for ${who(b)}: ${err instanceof Error ? err.message : err}. Check the Square dashboard.`).catch(() => {});
    }
  };

  // 1. Balance: confirmed, deposit paid, within 30 days of arrival.
  const { data: balances } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .eq('payment_status', 'deposit_paid')
    .eq('balance_status', 'due')
    .lte('check_in', addDays(today, BALANCE_DAYS_BEFORE))
    .gt('check_out', today);
  for (const b of balances ?? []) await run('balance', b, () => processBalance(b));

  // 2. Card damage deposit: the morning of arrival (or later, if missed).
  const { data: arriving } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .eq('payment_method', 'credit_card')
    .eq('damage_status', 'due')
    .lte('check_in', today)
    .gt('check_out', today);
  for (const b of arriving ?? []) await run('damage', b, () => collectCardDamage(b));

  // 3. Checkout day: ask about damage.
  const { data: leaving } = await supabase
    .from('bookings')
    .select('*')
    .in('damage_status', ['held', 'charged', 'collected'])
    .is('checkout_notified_at', null)
    .lte('check_out', today);
  for (const b of leaving ?? []) await run('checkout', b, () => notifyCheckout(b));

  // 4. Automatic release: 3 days after checkout (sooner for card holds that would lapse first).
  const { data: open } = await supabase
    .from('bookings')
    .select('*')
    .in('damage_status', ['held', 'charged', 'collected'])
    .lte('check_out', today);
  for (const b of open ?? []) {
    const due = today >= autoReleaseDate(b);
    if (!due) continue;
    await run('release', b, async () => {
      const note = await settleDamage(b, 0, 'No damage reported');
      await sendTelegramText(
        `🛡️ DAMAGE DEPOSIT AUTO-RELEASED\n${who(b)}\n${note}`,
        b.damage_status === 'collected' ? returnedKeyboard(b.id) : undefined,
      );
      return note;
    });
  }
  return log;
}

export function returnedKeyboard(bookingId: string) {
  return { inline_keyboard: [[{ text: '↩️ Returned to guest', callback_data: `dmgret:${bookingId}` }]] };
}

export async function markDamageReturned(b: Booking): Promise<string> {
  if (b.damage_status !== 'return_due') return `Deposit is ${b.damage_status}; no change.`;
  await update(b.id, { damage_status: Number(b.damage_claimed) > 0 ? 'claimed' : 'released' });
  return 'Marked as returned to the guest.';
}
