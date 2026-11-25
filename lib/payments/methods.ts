// Payment methods offered to guests and agents. Each method is turned on by
// setting its environment variable(s) in Vercel; a method with no real
// details is never shown. Payment details (addresses, handles) are only
// shown to a guest after the owner approves their request.

export type MethodId = 'credit_card' | 'bitcoin' | 'stablecoin' | 'venmo' | 'cashapp' | 'zelle';

export const ALL_METHOD_IDS: MethodId[] = ['credit_card', 'bitcoin', 'stablecoin', 'venmo', 'cashapp', 'zelle'];

export interface PublicMethod {
  id: MethodId;
  label: string;
  note?: string;
  badge?: string;
}

export interface MethodDetail {
  label: string;
  value: string;
}

const env = (k: string) => (process.env[k] || '').trim();

export function cardEnabled(): boolean {
  return Boolean(env('SQUARE_ACCESS_TOKEN') && (env('SQUARE_LOCATION_ID') || env('NEXT_PUBLIC_SQUARE_LOCATION_ID')));
}

export function bitcoinEnabled(): boolean {
  return Boolean(env('PAY_BITCOIN_ADDRESS') || env('PAY_BITCOIN_LIGHTNING') || env('PAY_LIGHTNING_NWC_URL'));
}

function stablecoinChains(): MethodDetail[] {
  const out: MethodDetail[] = [];
  const evm = env('PAY_STABLECOIN_EVM_ADDRESS');
  if (evm) {
    const chains = (env('PAY_STABLECOIN_EVM_CHAINS') || 'Base,Ethereum,Arbitrum')
      .split(',').map((c) => c.trim()).filter(Boolean);
    for (const c of chains) out.push({ label: `USDC or USDT on ${c}`, value: evm });
  }
  const sol = env('PAY_STABLECOIN_SOLANA_ADDRESS');
  if (sol) out.push({ label: 'USDC or USDT on Solana', value: sol });
  return out;
}

export function isEnabled(id: string): id is MethodId {
  switch (id) {
    case 'credit_card': return cardEnabled();
    case 'bitcoin': return bitcoinEnabled();
    case 'stablecoin': return stablecoinChains().length > 0;
    case 'venmo': return Boolean(env('PAY_VENMO_HANDLE'));
    case 'cashapp': return Boolean(env('PAY_CASHAPP_TAG'));
    case 'zelle': return Boolean(env('PAY_ZELLE'));
    default: return false;
  }
}

const LABELS: Record<MethodId, PublicMethod> = {
  credit_card: { id: 'credit_card', label: 'Credit / Debit Card', note: 'Held, not charged, until approved' },
  bitcoin: { id: 'bitcoin', label: 'Bitcoin', badge: 'SAVE {btc}%' },
  stablecoin: { id: 'stablecoin', label: 'Stablecoin', note: 'USDC & USDT' },
  venmo: { id: 'venmo', label: 'Venmo' },
  cashapp: { id: 'cashapp', label: 'Cash App' },
  zelle: { id: 'zelle', label: 'Zelle' },
};

/** Methods to show on the booking page and to agents, card first. No addresses. */
export function enabledMethods(btcDiscountPercent: number): PublicMethod[] {
  return ALL_METHOD_IDS.filter(isEnabled).map((id) => {
    const m = { ...LABELS[id] };
    if (m.badge) m.badge = m.badge.replace('{btc}', String(btcDiscountPercent));
    return m;
  });
}

export function methodLabel(id: string): string {
  return (LABELS as Record<string, PublicMethod>)[id]?.label ?? id;
}

/** Where to send money. Only shown after the owner approves a request. */
export function methodDetails(id: MethodId): MethodDetail[] {
  switch (id) {
    case 'bitcoin': {
      const d: MethodDetail[] = [];
      if (env('PAY_BITCOIN_ADDRESS')) d.push({ label: 'Bitcoin address (on-chain)', value: env('PAY_BITCOIN_ADDRESS') });
      if (env('PAY_BITCOIN_LIGHTNING')) d.push({ label: 'Lightning address', value: env('PAY_BITCOIN_LIGHTNING') });
      return d;
    }
    case 'stablecoin': return stablecoinChains();
    case 'venmo': return [{ label: 'Venmo', value: env('PAY_VENMO_HANDLE') }];
    case 'cashapp': return [{ label: 'Cash App', value: env('PAY_CASHAPP_TAG') }];
    case 'zelle': {
      const d = [{ label: 'Zelle (email or phone)', value: env('PAY_ZELLE') }];
      if (env('PAY_ZELLE_NAME')) d.push({ label: 'Name on the account', value: env('PAY_ZELLE_NAME') });
      return d;
    }
    default: return [];
  }
}

/** Normalize what older rows and clients stored ("credit / debit card", "cash app"). */
export function normalizeMethod(raw: string | null | undefined): MethodId | null {
  const s = (raw || '').toLowerCase().replace(/[^a-z]/g, '');
  if (s.startsWith('credit') || s === 'card' || s.includes('debit')) return 'credit_card';
  if (s.startsWith('bitcoin') || s === 'btc') return 'bitcoin';
  if (s.startsWith('stablecoin') || s.startsWith('usdc') || s.startsWith('usdt')) return 'stablecoin';
  if (s.startsWith('venmo')) return 'venmo';
  if (s.startsWith('cashapp')) return 'cashapp';
  if (s.startsWith('zelle')) return 'zelle';
  return null;
}
