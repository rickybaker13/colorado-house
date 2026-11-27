'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import SquareCardForm, { type SquareCardFormHandle } from '@/components/booking/SquareCardForm';

export default function PayByCard({
  bookingId,
  token,
  amount,
  purpose = 'deposit',
}: {
  bookingId: string;
  token: string;
  amount: number;
  purpose?: 'deposit' | 'balance' | 'damage';
}) {
  const ref = useRef<SquareCardFormHandle>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    if (!ref.current || busy) return;
    setBusy(true);
    setError('');
    const tok = await ref.current.tokenize();
    if ('error' in tok) {
      setError(tok.error);
      setBusy(false);
      return;
    }
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: tok.token, bookingId, token, purpose }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Payment failed. Please try again.');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <SquareCardForm ref={ref} disabled={busy} />
      {purpose !== 'damage' && (
        <p className="text-[11px] leading-relaxed text-white/40">
          By paying by card, you authorize us to keep this card on file with Square for this stay&apos;s remaining balance and refundable damage deposit hold.
        </p>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="w-full py-3 rounded-xl bg-stone text-charcoal font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {purpose === 'damage'
          ? `Add $${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} damage deposit`
          : `Pay $${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${purpose === 'balance' ? 'balance' : 'deposit'}`}
      </button>
    </div>
  );
}
