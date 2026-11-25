'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import SquareCardForm, { type SquareCardFormHandle } from '@/components/booking/SquareCardForm';

export default function PayByCard({ bookingId, token, amount }: { bookingId: string; token: string; amount: number }) {
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
        body: JSON.stringify({ sourceId: tok.token, bookingId, token }),
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
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="w-full py-3 rounded-xl bg-stone text-charcoal font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        Pay ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} deposit
      </button>
    </div>
  );
}
