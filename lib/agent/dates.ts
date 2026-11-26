// Date helpers that work purely on YYYY-MM-DD strings in UTC,
// so results never shift with the server's time zone.

const DAY_MS = 86_400_000;

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parseISODate(s: string): Date {
  return new Date(`${s}T00:00:00Z`);
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(s: string, n: number): string {
  return toISODate(new Date(parseISODate(s).getTime() + n * DAY_MS));
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((parseISODate(checkOut).getTime() - parseISODate(checkIn).getTime()) / DAY_MS);
}

/** Every night of a stay: check-in date up to, not including, check-out date. */
export function stayNights(checkIn: string, checkOut: string): string[] {
  const out: string[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Today's date at the property (Mountain Time). */
export function todayAtProperty(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Denver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Validates a stay's dates; returns an error message or null. */
export function validateStay(checkIn: string, checkOut: string, minNights: number): string | null {
  if (!ISO_DATE.test(checkIn) || !ISO_DATE.test(checkOut)) {
    return 'Dates must be in YYYY-MM-DD format, e.g. 2027-01-15.';
  }
  const isReal = (s: string) => !Number.isNaN(parseISODate(s).getTime()) && toISODate(parseISODate(s)) === s;
  if (!isReal(checkIn) || !isReal(checkOut)) {
    return 'One of the dates is not a real calendar date.';
  }
  if (checkIn < todayAtProperty()) {
    return `Check-in ${checkIn} is in the past. Today at the property is ${todayAtProperty()}.`;
  }
  if (checkOut <= checkIn) return 'check_out must be after check_in.';
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < minNights) {
    return `Minimum stay is ${minNights} nights; ${checkIn} to ${checkOut} is ${nights}. Try check_out ${addDays(checkIn, minNights)} or later.`;
  }
  if (nights > 90) return 'Stays longer than 90 nights must be arranged with the owner directly.';
  if (addDays(checkOut, -1) > lastBookableNight()) {
    return `The calendar is open through ${lastBookableNight()}, matching Airbnb. Choose dates on or before then.`;
  }
  return null;
}

/**
 * Last night that can be booked: one year out, the furthest Airbnb ever
 * opens a calendar and the end of its calendar feed. Nights Airbnb itself
 * has closed inside that year arrive as blocks in the feed.
 */
export function lastBookableNight(): string {
  return addDays(todayAtProperty(), 365);
}
