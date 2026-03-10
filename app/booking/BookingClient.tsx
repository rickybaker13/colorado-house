'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  PawPrint,
  Plus,
  Minus,
  CreditCard,
  Copy,
  Check,
  Star,
  Clock,
  Ban,
  Volume2,
  Shield,
  Droplets,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import SquareCardForm, { type SquareCardFormHandle } from '@/components/booking/SquareCardForm';

/* ─────────────────────── types ─────────────────────── */

interface PricingConfig {
  defaultNightlyRate: number;
  cleaningFee: number;
  petFee: number;
  maxGuests: number;
  maxPets: number;
  minNights: number;
  btcDiscountPercent: number;
  seasonalRates: SeasonalRate[];
}

interface SeasonalRate {
  start_date: string;
  end_date: string;
  nightly_rate: number;
  label: string;
}

interface ChainInfo {
  chain: string;
  token: string;
  address: string;
}

interface PaymentMethod {
  id: string;
  label: string;
  note?: string;
  badge?: string;
  address: string;
  chains?: ChainInfo[];
}

/* ─────────────────────── helpers ─────────────────────── */

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateRange(start: Date, end: Date): Date[] {
  const arr: Date[] = [];
  const cur = new Date(start);
  while (cur < end) {
    arr.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return arr;
}

function rateForDate(
  dateStr: string,
  seasonalRates: SeasonalRate[],
  defaultRate: number,
): { rate: number; label: string } {
  for (const sr of seasonalRates) {
    if (dateStr >= sr.start_date && dateStr <= sr.end_date) {
      return { rate: sr.nightly_rate, label: sr.label };
    }
  }
  return { rate: defaultRate, label: 'Standard' };
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const AIRBNB_SERVICE_FEE_RATE = 0.14;

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'credit_card', label: 'Credit / Debit Card', note: '50% deposit charged securely via Square', address: '' },
  { id: 'bitcoin', label: 'Bitcoin', badge: 'SAVE 15%', address: 'bc1q_YOUR_BTC_ADDRESS_HERE' },
  {
    id: 'stablecoin',
    label: 'Stablecoin',
    note: 'USDC & USDT',
    address: '',
    chains: [
      { chain: 'Base', token: 'USDC', address: '0x_YOUR_BASE_ADDRESS_HERE' },
      { chain: 'Ethereum', token: 'USDC / USDT', address: '0x_YOUR_ETH_ADDRESS_HERE' },
      { chain: 'Arbitrum', token: 'USDC / USDT', address: '0x_YOUR_ARBITRUM_ADDRESS_HERE' },
      { chain: 'Avalanche', token: 'USDC / USDT', address: '0x_YOUR_AVAX_ADDRESS_HERE' },
      { chain: 'Solana', token: 'USDC / USDT', address: 'YOUR_SOLANA_ADDRESS_HERE' },
    ],
  },
  { id: 'venmo', label: 'Venmo', address: '@YourVenmoHandle' },
  { id: 'cashapp', label: 'Cash App', address: '$YourCashAppTag' },
  { id: 'zelle', label: 'Zelle', address: 'your-email@example.com' },
];

const REVIEWS = [
  { name: 'Sarah & Family', location: 'Dallas, TX', date: 'January 2026', stars: 5, text: 'Absolutely perfect mountain getaway! The townhouse was spotless, spacious, and the kids loved being steps from the ski lift. We\'re already planning our summer trip back.' },
  { name: 'Mike & Jennifer', location: 'Phoenix, AZ', date: 'December 2025', stars: 5, text: 'The views from this place are unreal. Woke up every morning to snow-capped peaks. Hot tub after skiing was the highlight. Communication with the host was excellent.' },
  { name: 'The Rodriguez Family', location: 'Albuquerque, NM', date: 'October 2025', stars: 5, text: 'Came for the fall colors and were blown away. The townhouse is even better than the photos. Four bedrooms meant everyone had their own space. Durango is only 25 min away for dinners.' },
  { name: 'Chris & Group', location: 'Austin, TX', date: 'August 2025', stars: 5, text: 'Brought a group of 8 for a hiking trip. Purgatory in summer is incredible \u2014 wildflowers everywhere, 70\u00b0 days. The place was perfect as a home base. Already recommended to friends.' },
];

/* ────────────────── copy‑to‑clipboard ────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 p-1.5 rounded-md transition-colors duration-200 hover:bg-white/10"
      title="Copy"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-stone-light" />}
    </button>
  );
}

/* ──────────────────── counter widget ──────────────────── */

function Counter({ label, value, min, max, onChange, note }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; note?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="font-sans text-sm text-snow">{label}</span>
        {note && <p className="text-xs text-stone-light mt-0.5">{note}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-snow disabled:opacity-30 hover:border-stone transition-colors">
          <Minus size={14} />
        </button>
        <span className="w-6 text-center font-sans text-snow">{value}</span>
        <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-snow disabled:opacity-30 hover:border-stone transition-colors">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */

export default function BookingClient() {
  /* ── api state ── */
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  /* ── calendar state ── */
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  /* ── form state ── */
  const [guests, setGuests] = useState(1);
  const [pets, setPets] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  /* ── square card ref ── */
  const squareCardRef = useRef<SquareCardFormHandle>(null);

  /* ── submit state ── */
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [depositPaid, setDepositPaid] = useState<number | null>(null);

  /* ── fetch data ── */
  useEffect(() => {
    async function load() {
      try {
        const [calRes, priceRes] = await Promise.all([
          fetch('/api/calendar/airbnb'),
          fetch('/api/pricing'),
        ]);
        const calData = await calRes.json();
        const priceData = await priceRes.json();
        setBlockedDates(new Set(calData.blockedDates || []));
        setPricing(priceData);
      } catch (err) {
        console.error('Failed to load booking data', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cfg = pricing ?? {
    defaultNightlyRate: 250,
    cleaningFee: 275,
    petFee: 200,
    maxGuests: 10,
    maxPets: 2,
    minNights: 2,
    btcDiscountPercent: 15,
    seasonalRates: [],
  };

  /* ── calendar helpers ── */
  const isBlocked = useCallback((d: Date) => blockedDates.has(fmt(d)), [blockedDates]);

  const rangeHasBlock = useCallback(
    (start: Date, end: Date) => {
      const cur = new Date(start);
      while (cur < end) {
        if (blockedDates.has(fmt(cur))) return true;
        cur.setDate(cur.getDate() + 1);
      }
      return false;
    },
    [blockedDates],
  );

  const handleDateClick = useCallback(
    (d: Date) => {
      if (isBlocked(d) || d < today) return;
      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(d);
        setCheckOut(null);
        return;
      }
      if (d <= checkIn) {
        setCheckIn(d);
        setCheckOut(null);
        return;
      }
      const nightCount = Math.round((d.getTime() - checkIn.getTime()) / 86400000);
      if (nightCount < cfg.minNights) return;
      if (rangeHasBlock(checkIn, d)) return;
      setCheckOut(d);
    },
    [checkIn, checkOut, isBlocked, rangeHasBlock, today, cfg.minNights],
  );

  function isInRange(d: Date): boolean {
    if (!checkIn) return false;
    const end = checkOut ?? hoverDate;
    if (!end || end <= checkIn) return false;
    return d > checkIn && d < end;
  }

  /* ── pricing calc ── */
  const nightlyBreakdown = useMemo(() => {
    if (!checkIn || !checkOut) return [];
    const nights = dateRange(checkIn, checkOut);
    const grouped: Record<string, { rate: number; label: string; count: number }> = {};
    for (const nd of nights) {
      const { rate, label } = rateForDate(fmt(nd), cfg.seasonalRates, cfg.defaultNightlyRate);
      const key = `${label}-${rate}`;
      if (!grouped[key]) grouped[key] = { rate, label, count: 0 };
      grouped[key].count++;
    }
    return Object.values(grouped);
  }, [checkIn, checkOut, cfg]);

  const nightlyTotal = nightlyBreakdown.reduce((s, g) => s + g.rate * g.count, 0);
  const cleaningFee = cfg.cleaningFee;
  const petFee = pets > 0 ? cfg.petFee : 0;
  const subtotal = nightlyTotal + cleaningFee + petFee;
  const airbnbTotal = Math.round(subtotal * (1 + AIRBNB_SERVICE_FEE_RATE));
  const directSavings = airbnbTotal - subtotal;
  const btcDiscount = Math.round(subtotal * (cfg.btcDiscountPercent / 100));
  const btcTotal = subtotal - btcDiscount;
  const totalNights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0;

  /* ── submit ── */
  const canSubmit = checkIn && checkOut && name.trim() && email.trim() && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !checkIn || !checkOut) return;
    setSubmitting(true);
    setSubmitError('');

    const selectedMethod = PAYMENT_METHODS.find(p => p.id === paymentMethod);
    const isBtc = paymentMethod === 'bitcoin';
    const isCard = paymentMethod === 'credit_card';
    const finalTotal = isBtc ? btcTotal : subtotal;

    try {
      let squarePaymentId: string | null = null;
      let depositAmount = 0;

      // For credit card: tokenize and charge 50% deposit via Square
      if (isCard) {
        if (!squareCardRef.current) {
          setSubmitError('Card form is not ready. Please wait a moment and try again.');
          setSubmitting(false);
          return;
        }

        // Tokenize the card
        const tokenResult = await squareCardRef.current.tokenize();
        if ('error' in tokenResult) {
          setSubmitError(tokenResult.error);
          setSubmitting(false);
          return;
        }

        // Process payment (50% deposit)
        const paymentRes = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: tokenResult.token,
            amount: finalTotal,
            guestName: name.trim(),
            guestEmail: email.trim(),
            checkIn: fmt(checkIn),
            checkOut: fmt(checkOut),
          }),
        });
        const paymentData = await paymentRes.json();

        if (!paymentRes.ok || !paymentData.success) {
          setSubmitError(paymentData.error || 'Payment failed. Please try again.');
          setSubmitting(false);
          return;
        }

        squarePaymentId = paymentData.paymentId;
        depositAmount = paymentData.depositAmount;
      }

      // Create booking record
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_name: name.trim(),
          guest_email: email.trim(),
          guest_phone: phone.trim() || null,
          guest_message: message.trim() || null,
          check_in: fmt(checkIn),
          check_out: fmt(checkOut),
          num_guests: guests,
          num_pets: pets,
          nightly_total: nightlyTotal,
          cleaning_fee: cleaningFee,
          pet_fee: petFee,
          subtotal,
          btc_discount: isBtc ? btcDiscount : 0,
          final_total: finalTotal,
          payment_method: selectedMethod?.label.toLowerCase() ?? paymentMethod,
          // Square payment fields (only present for card payments)
          ...(squarePaymentId && {
            square_payment_id: squarePaymentId,
            deposit_amount: depositAmount,
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong.');
        setSubmitting(false);
        return;
      }
      setBookingId(data.bookingId);
      if (depositAmount > 0) setDepositPaid(depositAmount);
      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ── calendar grid ── */
  function renderCalendar(month: number, year: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: React.ReactNode[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = fmt(date);
      const blocked = isBlocked(date);
      const past = date < today;
      const disabled = blocked || past;
      const isCheckIn = checkIn && isSameDay(date, checkIn);
      const isCheckOut = checkOut && isSameDay(date, checkOut);
      const inRange = isInRange(date);
      const { rate } = rateForDate(dateStr, cfg.seasonalRates, cfg.defaultNightlyRate);

      let bg = '';
      let text = 'text-snow';
      if (disabled) { text = 'text-white/20'; bg = ''; }
      else if (isCheckIn || isCheckOut) { bg = 'bg-stone'; text = 'text-charcoal'; }
      else if (inRange) { bg = 'bg-stone/20'; }

      cells.push(
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => !disabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          className={`relative flex flex-col items-center justify-center rounded-lg py-1.5 transition-all duration-150 ${bg} ${text} ${disabled ? 'cursor-not-allowed line-through' : 'cursor-pointer hover:bg-stone/30'}`}
          style={{ minHeight: '52px' }}
        >
          <span className="text-sm font-sans">{d}</span>
          {!disabled && (
            <span className="text-[10px] font-sans opacity-60">${rate}</span>
          )}
        </button>,
      );
    }
    return cells;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  /* ──────────── render ──────────── */

  if (submitted) {
    return (
      <div className="min-h-screen bg-charcoal pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <h1 className="font-display text-display-md text-snow mb-4">
              Booking Request Received
            </h1>
            <p className="font-sans text-body-lg text-white/60 mb-10">
              {depositPaid
                ? `Your 50% deposit of $${depositPaid.toLocaleString()} has been charged. We're reviewing your request and will confirm shortly.`
                : "We're reviewing your request and will confirm availability shortly."}
            </p>
            <div className="bg-stone/10 rounded-xl p-4 mb-6 border border-stone/20">
              <p className="font-sans text-sm text-stone-light">
                All bookings are reviewed to ensure availability with our calendar. You&apos;ll receive a confirmation email once approved.
              </p>
            </div>

            <div className="bg-charcoal-light rounded-2xl p-8 text-left space-y-4 border border-white/5">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-white/50">Booking ID</span>
                <span className="text-stone-light font-mono">#{bookingId}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-white/50">Check-in</span>
                <span className="text-snow">{checkIn?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-white/50">Check-out</span>
                <span className="text-snow">{checkOut?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-white/50">Guests</span>
                <span className="text-snow">{guests} {guests === 1 ? 'guest' : 'guests'}{pets > 0 ? `, ${pets} ${pets === 1 ? 'pet' : 'pets'}` : ''}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-white/50">Payment</span>
                <span className="text-snow">{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="font-sans font-medium text-snow">Total</span>
                <span className="font-sans font-semibold text-stone text-lg">${paymentMethod === 'bitcoin' ? btcTotal.toLocaleString() : subtotal.toLocaleString()}</span>
              </div>
              {depositPaid && (
                <>
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-green-400 font-medium">Deposit Paid</span>
                    <span className="text-green-400 font-medium">${depositPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-white/50">Remaining (due 30 days before check-in)</span>
                    <span className="text-snow">${((paymentMethod === 'bitcoin' ? btcTotal : subtotal) - depositPaid).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            <p className="text-sm text-white/40 mt-6 font-sans">We&apos;ll send a confirmation to {email} once your booking is approved</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal">
      {/* ─── Hero / Header ─── */}
      <div className="relative pt-28 pb-12 px-4 text-center" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d3f 100%)' }}>
        <h1 className="font-display text-display-lg text-snow mb-3">Book Your Stay</h1>
        <p className="font-sans text-body-lg text-white/50">Purgatory Townhouse &middot; Durango, Colorado</p>
      </div>

      {/* ─── Why Book Direct Banner ─── */}
      <div className="border-y border-white/5" style={{ background: 'rgba(196,149,106,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            'No Airbnb service fees',
            'Save 15% with Bitcoin',
            'Direct owner communication',
            'Flexible payment options',
          ].map((b) => (
            <span key={b} className="flex items-center gap-2 text-sm font-sans text-stone-light">
              <Check size={14} className="text-stone" />
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Loading ─── */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-stone" />
          <span className="ml-3 text-white/50 font-sans">Loading availability&hellip;</span>
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ════════ LEFT: calendar + form ════════ */}
            <div className="lg:col-span-2 space-y-10">

              {/* ── Calendar ── */}
              <section className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <button type="button" onClick={prevMonth} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <ChevronLeft size={20} className="text-white/60" />
                  </button>
                  <h2 className="font-display text-display-md text-snow">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h2>
                  <button type="button" onClick={nextMonth} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <ChevronRight size={20} className="text-white/60" />
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-2">
                  {DAY_LABELS.map((l) => (
                    <div key={l} className="text-center text-caption-sm font-sans text-white/30 uppercase py-2">{l}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar(viewMonth, viewYear)}
                </div>
                {checkIn && !checkOut && (
                  <p className="text-xs text-white/40 font-sans mt-4 text-center">Select a check-out date ({cfg.minNights}-night minimum)</p>
                )}
              </section>

              {/* ── Guests & Pets ── */}
              <section className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5">
                <h3 className="font-display text-xl text-snow mb-4">Guests &amp; Pets</h3>
                <Counter label="Guests" value={guests} min={1} max={cfg.maxGuests} onChange={setGuests} />
                <div className="border-t border-white/5" />
                <Counter label="Pets" value={pets} min={0} max={cfg.maxPets} onChange={setPets} note={pets > 0 ? `$${cfg.petFee} pet fee applies` : 'Pets welcome'} />
              </section>

              {/* ── Payment Method ── */}
              <section className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5">
                <h3 className="font-display text-xl text-snow mb-5">Payment Method</h3>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => {
                    const sel = paymentMethod === pm.id;
                    return (
                      <div key={pm.id}>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 border transition-all duration-200 text-left ${sel ? 'border-stone bg-stone/10' : 'border-white/10 hover:border-white/20'}`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sel ? 'border-stone' : 'border-white/30'}`}>
                            {sel && <div className="w-2 h-2 rounded-full bg-stone" />}
                          </div>
                          <span className="font-sans text-sm text-snow flex-1">{pm.label}</span>
                          {pm.badge && (
                            <span className="text-[10px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{pm.badge}</span>
                          )}
                          {pm.note && !pm.badge && (
                            <span className="text-xs font-sans text-white/40">{pm.note}</span>
                          )}
                        </button>
                        <AnimatePresence>
                          {sel && pm.id === 'credit_card' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <SquareCardForm ref={squareCardRef} disabled={submitting} />
                            </motion.div>
                          )}
                          {sel && pm.address && !pm.chains && pm.id !== 'credit_card' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="flex items-center gap-2 mt-2 ml-12 px-4 py-2.5 bg-white/5 rounded-lg">
                                <code className="text-xs font-mono text-stone-light break-all flex-1">{pm.address}</code>
                                <CopyButton text={pm.address} />
                              </div>
                            </motion.div>
                          )}
                          {sel && pm.chains && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="mt-2 ml-12 space-y-2">
                                {pm.chains.map((c) => (
                                  <div key={c.chain} className="px-4 py-2.5 bg-white/5 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-sans text-white/50">{c.chain} <span className="text-white/30">&middot; {c.token}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <code className="text-xs font-mono text-stone-light break-all flex-1">{c.address}</code>
                                      <CopyButton text={c.address} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── Guest Info ── */}
              <section className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5">
                <h3 className="font-display text-xl text-snow mb-5">Guest Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-sans text-white/50 uppercase tracking-wider mb-2">Full Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-snow font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-stone transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-sans text-white/50 uppercase tracking-wider mb-2">Email *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-snow font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-stone transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-sans text-white/50 uppercase tracking-wider mb-2">Phone (optional)</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-snow font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-stone transition-colors" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans text-white/50 uppercase tracking-wider mb-2">Message / Special Requests (optional)</label>
                    <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Let us know if you have any special requests..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-snow font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-stone transition-colors resize-none" />
                  </div>
                </div>
              </section>

              {/* ── Submit (mobile) ── */}
              <div className="lg:hidden">
                {submitError && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-sans text-red-300">{submitError}</p>
                    <button type="button" onClick={() => setSubmitError('')} className="ml-auto"><X size={14} className="text-red-400" /></button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-4 rounded-full bg-stone text-charcoal font-sans font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-stone-light disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> {paymentMethod === 'credit_card' ? 'Processing Payment\u2026' : 'Submitting\u2026'}</>
                    : paymentMethod === 'credit_card' ? 'Pay Deposit & Book' : 'Request Booking'}
                </button>
              </div>
            </div>

            {/* ════════ RIGHT: sticky sidebar ════════ */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Price card */}
                <div className="bg-charcoal-light rounded-2xl p-6 border border-white/5">
                  <h3 className="font-display text-xl text-snow mb-5">Price Breakdown</h3>

                  {totalNights > 0 ? (
                    <div className="space-y-3 text-sm font-sans">
                      {nightlyBreakdown.map((g) => (
                        <div key={g.label + g.rate} className="flex justify-between">
                          <span className="text-white/60">${g.rate} &times; {g.count} {g.count === 1 ? 'night' : 'nights'} <span className="text-white/30">({g.label})</span></span>
                          <span className="text-snow">${(g.rate * g.count).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <span className="text-white/60">Cleaning fee</span>
                        <span className="text-snow">${cleaningFee}</span>
                      </div>
                      {petFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Pet fee</span>
                          <span className="text-snow">${petFee}</span>
                        </div>
                      )}

                      <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                        <span className="text-snow font-medium">Book Direct</span>
                        <span className="text-stone text-lg font-semibold">${subtotal.toLocaleString()}</span>
                      </div>

                      {/* Airbnb comparison */}
                      <div className="bg-white/5 rounded-xl p-4 space-y-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-white/40 text-xs">Airbnb total <span className="text-white/20">(+14% fee)</span></span>
                          <span className="text-white/40 line-through text-xs">${airbnbTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-400 text-xs font-medium">You save booking direct</span>
                          <span className="text-green-400 text-xs font-semibold">${directSavings.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* BTC bonus */}
                      <div className="bg-stone/10 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-stone-light text-xs font-medium">Pay with Bitcoin</span>
                          <span className="text-stone font-semibold">${btcTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/30 text-xs">Total savings vs Airbnb</span>
                          <span className="text-green-400 text-xs font-semibold">${(airbnbTotal - btcTotal).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-white/30 font-sans text-center py-4">Select dates to see pricing</p>
                  )}
                </div>

                {/* Submit (desktop) */}
                <div className="hidden lg:block space-y-4">
                  {submitError && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm font-sans text-red-300">{submitError}</p>
                      <button type="button" onClick={() => setSubmitError('')} className="ml-auto"><X size={14} className="text-red-400" /></button>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full py-4 rounded-full bg-stone text-charcoal font-sans font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-stone-light disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting
                      ? <><Loader2 size={18} className="animate-spin" /> {paymentMethod === 'credit_card' ? 'Processing Payment\u2026' : 'Submitting\u2026'}</>
                      : paymentMethod === 'credit_card' ? 'Pay Deposit & Book' : 'Request Booking'}
                  </button>
                  <p className="text-[11px] text-white/25 text-center font-sans">
                    {paymentMethod === 'credit_card'
                      ? 'Your card will be charged 50% now as a deposit'
                      : 'No charge today \u2014 we\u0027ll confirm availability first'}
                  </p>
                </div>

                {/* Selected dates summary */}
                {checkIn && (
                  <div className="bg-charcoal-light rounded-2xl p-5 border border-white/5 text-sm font-sans space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/50">Check-in</span>
                      <span className="text-snow">{checkIn.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    {checkOut && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-white/50">Check-out</span>
                          <span className="text-snow">{checkOut.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Nights</span>
                          <span className="text-snow">{totalNights}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-white/50">Guests</span>
                      <span className="text-snow">{guests}{pets > 0 ? ` + ${pets} pet${pets > 1 ? 's' : ''}` : ''}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════════ BOTTOM SECTIONS ════════ */}
          <div className="max-w-5xl mx-auto px-4 pb-20 space-y-16">

            {/* ── Cancellation Policy ── */}
            <section>
              <h2 className="font-display text-display-md text-snow mb-6">Cancellation Policy</h2>
              <div className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5 space-y-5 font-sans text-sm">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-snow font-medium">Within 24 hours of booking</p>
                    <p className="text-white/50">Full refund, no questions asked.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-stone shrink-0 mt-0.5" />
                  <div>
                    <p className="text-snow font-medium">Cancel 30+ days before check-in</p>
                    <p className="text-white/50">Full refund.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-stone-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-snow font-medium">Cancel 7&ndash;30 days before check-in</p>
                    <p className="text-white/50">50% refund.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-white/20 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-snow font-medium">Cancel less than 7 days before check-in</p>
                    <p className="text-white/50">No refund.</p>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-5 flex items-start gap-3">
                  <CreditCard size={18} className="text-stone shrink-0 mt-0.5" />
                  <div>
                    <p className="text-snow font-medium">Payment schedule</p>
                    <p className="text-white/50">50% of the booking total is due at the time of booking. The remaining 50% is due 30 days before check-in.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-stone-light shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/50">Check-in date changes may be possible &mdash; contact us to discuss.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── House Rules ── */}
            <section>
              <h2 className="font-display text-display-md text-snow mb-6">House Rules</h2>
              <div className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans text-sm">
                  <Rule icon={<Clock size={16} />} title="Check-in: 4:00 PM (flexible) / Check-out: 10:00 AM" />
                  <Rule icon={<Ban size={16} />} title="No smoking, vaping, or e-cigarettes" subtitle="$500 fee + cleaning remediation" />
                  <Rule icon={<Ban size={16} />} title="No parties or events" />
                  <Rule icon={<Ban size={16} />} title="No commercial photography or filming" />
                  <Rule icon={<PawPrint size={16} />} title="Pets welcome (max 2, $200 fee)" subtitle="Must be disclosed & house-trained. No pets on furniture/beds. $150/night penalty for undisclosed pets." />
                  <Rule icon={<Droplets size={16} />} title="Hot tub rules" subtitle="5 person max. Shower before entering. No soaps, dyes, or glass. Cover when not in use. Under 18 must be supervised. Guests accept all risk." />
                  <Rule icon={<Volume2 size={16} />} title="Quiet hours: 10 PM \u2013 7 AM" />
                  <Rule icon={<Users size={16} />} title="Maximum guests: 10" />
                </div>
              </div>
            </section>

            {/* ── Guest Reviews ── */}
            <section>
              <h2 className="font-display text-display-md text-snow mb-6">Guest Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {REVIEWS.map((r) => (
                  <div key={r.name} className="bg-charcoal-light rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: r.stars }).map((_, i) => (
                        <Star key={i} size={14} className="text-stone fill-stone" />
                      ))}
                    </div>
                    <p className="font-sans text-sm text-white/70 leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                    <div className="font-sans">
                      <p className="text-sm text-snow font-medium">{r.name}</p>
                      <p className="text-xs text-white/40">{r.location} &middot; {r.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Prefer Airbnb? ── */}
            <section className="bg-charcoal-light rounded-2xl p-6 md:p-8 border border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-display text-xl text-snow mb-1">Prefer to book on Airbnb?</h3>
                  <p className="font-sans text-sm text-white/40">Same property, same host &mdash; Airbnb service fees apply (~14%)</p>
                </div>
                <a
                  href="https://www.airbnb.com/rooms/1205985906587842742"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 font-sans text-sm text-white/70 hover:text-snow hover:border-white/30 transition-all duration-300"
                >
                  Book on Airbnb
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </section>

            {/* ── Footer ── */}
            <div className="text-center pt-8 border-t border-white/5">
              <p className="font-sans text-xs text-white/25">Book direct for the best rate &mdash; no service fees</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── small subcomponent ── */
function Rule({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-stone shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-snow">{title}</p>
        {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
