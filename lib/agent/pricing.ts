import { getServiceClient } from '@/lib/supabase';
import { stayNights } from './dates';
import { bitcoinEnabled } from '@/lib/payments/methods';

export interface RentalConfig {
  defaultNightlyRate: number;
  cleaningFee: number;
  petFee: number;
  maxGuests: number;
  maxPets: number;
  minNights: number;
  btcDiscountPercent: number;
  /** Newest first: when ranges overlap, the most recent edit wins. */
  seasonalRates: { start_date: string; end_date: string; nightly_rate: number }[];
}

// Same fallbacks the website's /api/pricing route uses.
export async function getRentalConfig(): Promise<RentalConfig> {
  const supabase = getServiceClient();
  const [{ data: rows, error: e1 }, { data: rates, error: e2 }] = await Promise.all([
    supabase.from('site_config').select('key, value'),
    supabase
      .from('pricing')
      .select('start_date, end_date, nightly_rate, created_at')
      .order('created_at', { ascending: false }),
  ]);
  // Never quote from fallback numbers: a wrong price is worse than no price.
  if (e1 || e2 || !rows || !rates) throw new Error(`Pricing unavailable: ${(e1 ?? e2)?.message ?? 'no data'}`);
  const cfg: Record<string, number> = {};
  for (const r of rows) {
    const n = Number(r.value);
    if (!Number.isNaN(n)) cfg[r.key] = n;
  }
  return {
    defaultNightlyRate: cfg.default_nightly_rate || 250,
    cleaningFee: cfg.cleaning_fee || 275,
    petFee: cfg.pet_fee || 200,
    maxGuests: cfg.max_guests || 10,
    maxPets: cfg.max_pets || 2,
    minNights: cfg.min_nights || 3,
    btcDiscountPercent: cfg.btc_discount_percent || 15,
    seasonalRates: rates.map((r) => ({ start_date: r.start_date, end_date: r.end_date, nightly_rate: Number(r.nightly_rate) })),
  };
}

// Bitcoin is offered only once a real receiving address is configured.
export { bitcoinEnabled };

// Direct nightly rates are set 15% below Airbnb's (Airbnb charges the host a
// 15% fee and shows guests the full price), so Airbnb's price for the same
// night is the direct rate / 0.85. Cleaning and pet fees are the same.
export const DIRECT_DISCOUNT = 0.15;
export const airbnbNightlyTotal = (directNightlyTotal: number) => Math.round(directNightlyTotal / (1 - DIRECT_DISCOUNT));

export interface Quote {
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  pets: number;
  currency: 'USD';
  /** Consecutive nights at the same rate. */
  nightly_breakdown: { first_night: string; last_night: string; nights: number; rate: number }[];
  nightly_total: number;
  cleaning_fee: number;
  pet_fee: number;
  subtotal: number;
  fees_note: string;
  deposit_due_at_booking: number;
  balance_due_before_arrival: number;
  bitcoin_option?: { discount_percent: number; discount: number; total: number };
  estimated_airbnb_total_for_comparison: number;
}

export function buildQuote(
  cfg: RentalConfig,
  checkIn: string,
  checkOut: string,
  guests: number,
  pets: number,
): Quote {
  const breakdown: Quote['nightly_breakdown'] = [];
  for (const night of stayNights(checkIn, checkOut)) {
    const season = cfg.seasonalRates.find((s) => night >= s.start_date && night <= s.end_date);
    const rate = season ? season.nightly_rate : cfg.defaultNightlyRate;
    const last = breakdown[breakdown.length - 1];
    if (last && last.rate === rate) {
      last.last_night = night;
      last.nights++;
    } else {
      breakdown.push({ first_night: night, last_night: night, nights: 1, rate });
    }
  }
  const nightlyTotal = breakdown.reduce((s, g) => s + g.rate * g.nights, 0);
  const petFee = pets > 0 ? cfg.petFee : 0;
  const subtotal = nightlyTotal + cfg.cleaningFee + petFee;
  const deposit = Math.round(subtotal * 0.5 * 100) / 100;

  const quote: Quote = {
    check_in: checkIn,
    check_out: checkOut,
    nights: breakdown.reduce((s, g) => s + g.nights, 0),
    guests,
    pets,
    currency: 'USD',
    nightly_breakdown: breakdown,
    nightly_total: nightlyTotal,
    cleaning_fee: cfg.cleaningFee,
    pet_fee: petFee,
    subtotal,
    fees_note:
      'Subtotal is what the direct-booking website charges: nightly rates 15% below the same nights on Airbnb, the same cleaning fee, and no booking or service fee. Lodging taxes are not itemized; the owner confirms the final amount when approving the request.',
    deposit_due_at_booking: deposit,
    balance_due_before_arrival: Math.round((subtotal - deposit) * 100) / 100,
    estimated_airbnb_total_for_comparison: airbnbNightlyTotal(nightlyTotal) + cfg.cleaningFee + petFee,
  };
  if (bitcoinEnabled()) {
    const discount = Math.round(subtotal * (cfg.btcDiscountPercent / 100));
    quote.bitcoin_option = {
      discount_percent: cfg.btcDiscountPercent,
      discount,
      total: subtotal - discount,
    };
  }
  return quote;
}
