// Lightning deposits via Nostr Wallet Connect (NWC). The server holds a
// RECEIVE-ONLY connection string (make_invoice + lookup_invoice), so it can
// create invoices and see when they're paid but can never spend funds.
// Works with Alby Hub (e.g. on an Umbrel), or any NWC wallet.
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { NWCClient } from '@getalby/sdk/nwc';

const INVOICE_TTL_SECONDS = 15 * 60;

export function lightningEnabled(): boolean {
  return Boolean((process.env.PAY_LIGHTNING_NWC_URL || '').trim());
}

async function withClient<T>(fn: (c: NWCClient) => Promise<T>): Promise<T> {
  const client = new NWCClient({ nostrWalletConnectUrl: process.env.PAY_LIGHTNING_NWC_URL!.trim() });
  try {
    return await fn(client);
  } finally {
    client.close();
  }
}

/** BTC/USD spot price; null if it can't be fetched (then no invoice is made). */
export async function btcUsd(): Promise<number | null> {
  try {
    const res = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', { next: { revalidate: 60 } });
    const n = Number((await res.json())?.data?.amount);
    return n > 0 ? n : null;
  } catch {
    return null;
  }
}

/* ── Ticket: signs (booking, payment hash, amount, expiry) so we need no DB
   table. Used as the L402 "macaroon" (an opaque bearer credential) and by
   the booking page to poll for payment. ── */

interface TicketData { b: string; h: string; s: number; e: number }

function key(): string {
  const s = process.env.BOOKING_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error('BOOKING_LINK_SECRET is not configured');
  return s;
}

export function signTicket(d: TicketData): string {
  const body = Buffer.from(JSON.stringify(d)).toString('base64url');
  const sig = createHmac('sha256', key()).update(`ln:${body}`).digest('base64url');
  return `${body}.${sig}`;
}

export function readTicket(ticket: string | null | undefined): TicketData | null {
  if (!ticket) return null;
  const [body, sig] = ticket.split('.');
  if (!body || !sig) return null;
  const want = Buffer.from(createHmac('sha256', key()).update(`ln:${body}`).digest('base64url'));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const d = JSON.parse(Buffer.from(body, 'base64url').toString()) as TicketData;
    return typeof d.b === 'string' && /^[0-9a-f]{64}$/.test(d.h) && d.s > 0 ? d : null;
  } catch {
    return null;
  }
}

export function preimageMatches(preimageHex: string, paymentHash: string): boolean {
  if (!/^[0-9a-f]{64}$/i.test(preimageHex)) return false;
  return createHash('sha256').update(Buffer.from(preimageHex, 'hex')).digest('hex') === paymentHash.toLowerCase();
}

export interface DepositInvoice {
  invoice: string;
  paymentHash: string;
  sats: number;
  usd: number;
  rate: number;
  expiresAt: number;
  ticket: string;
}

export async function createDepositInvoice(bookingId: string, usd: number, reference: string): Promise<DepositInvoice> {
  const rate = await btcUsd();
  if (!rate) throw new Error('BTC price unavailable');
  const sats = Math.ceil((usd / rate) * 1e8);
  const tx = await withClient((c) =>
    c.makeInvoice({ amount: sats * 1000, description: `Purgatory Townhouse deposit (${reference})`, expiry: INVOICE_TTL_SECONDS })
  );
  const expiresAt = tx.expires_at || Math.floor(Date.now() / 1000) + INVOICE_TTL_SECONDS;
  return {
    invoice: tx.invoice,
    paymentHash: tx.payment_hash,
    sats,
    usd,
    rate,
    expiresAt,
    ticket: signTicket({ b: bookingId, h: tx.payment_hash, s: sats, e: expiresAt }),
  };
}

/** Ask the wallet whether an invoice is paid (and for at least the amount). */
export async function invoicePaid(paymentHash: string, sats: number): Promise<boolean> {
  const tx = await withClient((c) => c.lookupInvoice({ payment_hash: paymentHash }));
  return tx.state === 'settled' && tx.amount >= sats * 1000;
}
