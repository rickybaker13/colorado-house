'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { Loader2 } from 'lucide-react';

interface Invoice { invoice: string; sats: number; usd: number; rate: number; expiresAt: number; ticket: string }

export default function PayByLightning({ bookingId, token }: { bookingId: string; token: string }) {
  const router = useRouter();
  const [inv, setInv] = useState<Invoice | null>(null);
  const [qr, setQr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function create() {
    setBusy(true);
    setError('');
    setExpired(false);
    try {
      const res = await fetch('/api/lightning/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create an invoice.');
      setInv(data);
      setQr(await QRCode.toDataURL(`lightning:${data.invoice}`.toUpperCase(), { margin: 1, width: 260 }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create an invoice.');
    } finally {
      setBusy(false);
    }
  }

  // Poll every 3 seconds until paid or expired.
  useEffect(() => {
    if (!inv) return;
    timer.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/lightning/invoice?ticket=${encodeURIComponent(inv.ticket)}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.paid) {
          if (timer.current) clearInterval(timer.current);
          router.refresh();
        } else if (data.expired) {
          if (timer.current) clearInterval(timer.current);
          setExpired(true);
        }
      } catch {
        /* keep polling */
      }
    }, 3000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [inv, router]);

  if (!inv || expired) {
    return (
      <div className="space-y-2">
        {expired && <p className="text-amber-300">That invoice expired before it was paid. Make a new one.</p>}
        {error && <p className="text-red-300">{error}</p>}
        <button type="button" onClick={create} disabled={busy} className="w-full py-3 rounded-xl bg-stone text-charcoal font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
          {busy && <Loader2 size={16} className="animate-spin" />}
          Show Lightning invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {qr && <img src={qr} alt="Lightning invoice QR code" className="mx-auto rounded-lg bg-white p-2" width={260} height={260} />}
      <p className="text-snow">
        {inv.sats.toLocaleString()} sats <span className="text-white/50">(${inv.usd.toLocaleString()} at ${Math.round(inv.rate).toLocaleString()}/BTC)</span>
      </p>
      <div className="flex gap-2 justify-center">
        <a href={`lightning:${inv.invoice}`} className="px-4 py-2 rounded-lg bg-stone text-charcoal font-semibold">Open in wallet</a>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(inv.invoice); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="px-4 py-2 rounded-lg border border-white/20 text-snow"
        >
          {copied ? 'Copied' : 'Copy invoice'}
        </button>
      </div>
      <p className="text-white/40 text-xs flex items-center justify-center gap-2">
        <Loader2 size={12} className="animate-spin" /> Waiting for payment. This page updates on its own. The invoice is valid for 15 minutes.
      </p>
    </div>
  );
}
