// Server-side price for a website or agent booking. The browser's numbers
// are never trusted for what gets charged or stored.
import { buildQuote, getRentalConfig, type Quote } from '@/lib/agent/pricing';
import { validateStay } from '@/lib/agent/dates';
import type { MethodId } from './methods';

export interface PricedStay {
  quote: Quote;
  btcDiscount: number;
  finalTotal: number;
  /** 50% of the final total, in dollars (cents precision). */
  deposit: number;
  depositCents: bigint;
  /** Refundable damage deposit (not part of finalTotal). */
  damageDeposit: number;
}

export class StayError extends Error {}

export async function priceStay(input: {
  checkIn: string;
  checkOut: string;
  guests: number;
  pets: number;
  method: MethodId;
}): Promise<PricedStay> {
  const cfg = await getRentalConfig();
  const invalid = validateStay(input.checkIn, input.checkOut, cfg.minNights);
  if (invalid) throw new StayError(invalid);
  if (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > cfg.maxGuests) {
    throw new StayError(`The townhouse sleeps up to ${cfg.maxGuests} guests.`);
  }
  if (!Number.isInteger(input.pets) || input.pets < 0 || input.pets > cfg.maxPets) {
    throw new StayError(`Up to ${cfg.maxPets} pets are allowed.`);
  }
  const quote = buildQuote(cfg, input.checkIn, input.checkOut, input.guests, input.pets);
  const btcDiscount = input.method === 'bitcoin' ? Math.round(quote.subtotal * (cfg.btcDiscountPercent / 100)) : 0;
  const finalTotal = quote.subtotal - btcDiscount;
  const depositCents = BigInt(Math.round(finalTotal * 50)); // 50% of dollars, in cents
  return { quote, btcDiscount, finalTotal, deposit: Number(depositCents) / 100, depositCents, damageDeposit: cfg.damageDeposit };
}
