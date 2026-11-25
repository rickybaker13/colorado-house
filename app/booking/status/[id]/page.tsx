// Private booking page for a guest (or their AI agent): status, amounts,
// and, once the owners approve, how to pay the deposit.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceClient } from '@/lib/supabase';
import { verifyBookingToken } from '@/lib/payments/link';
import { cardEnabled, isEnabled, methodDetails, methodLabel, normalizeMethod } from '@/lib/payments/methods';
import { addDays } from '@/lib/agent/dates';
import PayByCard from './PayByCard';
import PayByLightning from './PayByLightning';
import { btcUsd, lightningEnabled } from '@/lib/payments/lightning';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your booking | Purgatory Townhouse', robots: { index: false, follow: false } };

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const longDate = (s: string) =>
  new Date(`${s}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const STATUS: Record<string, { title: string; body: string; tone: string }> = {
  pending_approval: { title: 'Request received', body: 'The owners are reviewing your request, usually within a day. Your dates are held while they decide.', tone: 'text-stone-light' },
  requested: { title: 'Approved: deposit due', body: 'Your request is approved. Pay the 50% deposit below to confirm the booking.', tone: 'text-amber-300' },
  confirmed: { title: 'Confirmed', body: 'Your booking is confirmed. See you in the mountains!', tone: 'text-green-400' },
  denied: { title: 'Not available', body: "Sorry, the owners couldn't accept this request. Nothing was charged; any card hold has been released.", tone: 'text-red-300' },
  cancelled: { title: 'Cancelled', body: 'This booking was cancelled.', tone: 'text-red-300' },
};

export default async function BookingStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !verifyBookingToken(id, t)) notFound();

  const { data: b } = await getServiceClient().from('bookings').select('*').eq('id', id).single();
  if (!b) notFound();

  const total = Number(b.final_total);
  const deposit = Math.round(total * 50) / 100;
  const balance = Math.round((total - deposit) * 100) / 100;
  const balanceDue = addDays(b.check_in, -30);
  const method = normalizeMethod(b.payment_method);
  const st = STATUS[b.status] ?? { title: b.status, body: '', tone: 'text-snow' };
  const awaitingDeposit = b.status === 'requested' && b.payment_status === 'pending';
  const details = awaitingDeposit && method && method !== 'credit_card' && isEnabled(method) ? methodDetails(method) : [];
  const price = method === 'bitcoin' && awaitingDeposit ? await btcUsd() : null;
  const showLightning = awaitingDeposit && method === 'bitcoin' && lightningEnabled();
  const reference = `Purgatory ${id.slice(0, 8)}`;

  return (
    <div className="min-h-screen bg-charcoal pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 space-y-6 font-sans">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40">Purgatory Townhouse booking</p>
          <h1 className={`font-display text-display-md mt-2 ${st.tone}`}>{st.title}</h1>
          <p className="text-white/60 mt-3">{st.body}</p>
        </div>

        <section className="bg-charcoal-light rounded-2xl p-6 border border-white/5 space-y-3 text-sm">
          <Row k="Guest" v={b.guest_name} />
          <Row k="Check-in" v={`${longDate(b.check_in)}, after 4:00 PM`} />
          <Row k="Check-out" v={`${longDate(b.check_out)}, before 10:00 AM`} />
          <Row k="Guests" v={`${b.num_guests}${b.num_pets ? `, ${b.num_pets} pet${b.num_pets > 1 ? 's' : ''}` : ''}`} />
          <Row k="Payment method" v={methodLabel(b.payment_method)} />
          <div className="border-t border-white/10 pt-3 space-y-2">
            <Row k="Total" v={usd(total)} strong />
            {Number(b.btc_discount) > 0 && <Row k="Includes Bitcoin discount" v={`-${usd(Number(b.btc_discount))}`} />}
            <Row
              k={b.payment_status === 'deposit_paid' ? 'Deposit (paid)' : b.payment_status === 'deposit_held' ? 'Deposit (card hold, charged on approval)' : 'Deposit (50%)'}
              v={usd(Number(b.deposit_amount) || deposit)}
            />
            <Row k={`Balance, due by ${longDate(balanceDue)}`} v={usd(balance)} />
          </div>
        </section>

        {showLightning && (
          <section className="bg-charcoal-light rounded-2xl p-6 border border-amber-400/20 space-y-3 text-sm">
            <h2 className="font-display text-xl text-snow">Pay the deposit with Lightning ⚡</h2>
            <p className="text-white/60">Fastest option: pay {usd(deposit)} in bitcoin from any Lightning wallet. Your booking confirms the moment it arrives.</p>
            <PayByLightning bookingId={id} token={t!} />
          </section>
        )}

        {awaitingDeposit && details.length > 0 && (
          <section className="bg-charcoal-light rounded-2xl p-6 border border-amber-400/20 space-y-4 text-sm">
            <h2 className="font-display text-xl text-snow">{showLightning ? 'Or send bitcoin on-chain' : `Pay the deposit by ${methodLabel(b.payment_method)}`}</h2>
            <p className="text-white/70">
              Send <strong className="text-snow">{usd(deposit)}</strong>
              {method === 'bitcoin' && price ? (
                <> (about <strong className="text-snow">{(deposit / price).toFixed(6)} BTC</strong> at today&apos;s rate of {usd(Math.round(price))}/BTC)</>
              ) : null}
              {method === 'stablecoin' ? ' in USDC or USDT' : ''} to:
            </p>
            <div className="space-y-2">
              {details.map((d) => (
                <div key={d.label + d.value} className="px-4 py-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50">{d.label}</p>
                  <code className="text-stone-light break-all">{d.value}</code>
                </div>
              ))}
            </div>
            <p className="text-white/50">
              Include <strong className="text-snow">{reference}</strong> in the note or memo if the app allows it.
              {method === 'stablecoin' && ' Double-check the network before sending; tokens sent on the wrong network can be lost.'}
              {' '}The owners confirm the booking when the payment arrives.
            </p>
          </section>
        )}

        {awaitingDeposit && cardEnabled() && (
          <section className="bg-charcoal-light rounded-2xl p-6 border border-white/5 space-y-3 text-sm">
            <h2 className="font-display text-xl text-snow">{method === 'credit_card' ? 'Pay the deposit by card' : 'Or pay by card'}</h2>
            <p className="text-white/60">Charges {usd(deposit)} now and confirms your booking right away.</p>
            <PayByCard bookingId={id} token={t!} amount={deposit} />
          </section>
        )}

        <section className="text-xs text-white/40 space-y-2">
          <p>
            Cancellation: full refund within 24 hours of booking, or 30 or more days before check-in; 50% refund 7 to 30 days before check-in; no refund within 7 days.
          </p>
          <p>Questions? Reply to the owners&apos; email or contact us through skipurgatoryhouse.com. Booking reference: {reference}.</p>
        </section>
      </div>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50">{k}</span>
      <span className={strong ? 'text-stone font-semibold text-base' : 'text-snow text-right'}>{v}</span>
    </div>
  );
}
