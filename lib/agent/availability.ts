import { getServiceClient } from '@/lib/supabase';
import { addDays, stayNights } from './dates';

// Booking statuses that hold the dates (same set the website uses).
export const HOLDING_STATUSES = ['confirmed', 'requested', 'pending_approval'];

function parseICalDates(icalText: string): string[] {
  const blocked: string[] = [];
  const events = icalText.split('BEGIN:VEVENT');
  for (let i = 1; i < events.length; i++) {
    const start = events[i].match(/DTSTART(?:;VALUE=DATE)?:(\d{4})(\d{2})(\d{2})/);
    const end = events[i].match(/DTEND(?:;VALUE=DATE)?:(\d{4})(\d{2})(\d{2})/);
    if (!start || !end) continue;
    // iCal DTEND is exclusive, so the nights are start..end-1
    blocked.push(...stayNights(`${start[1]}-${start[2]}-${start[3]}`, `${end[1]}-${end[2]}-${end[3]}`));
  }
  return blocked;
}

/**
 * All blocked nights: Airbnb calendar, direct bookings that hold dates,
 * and dates the owner blocked manually. Each entry is a night (the date
 * a guest would sleep there), as YYYY-MM-DD.
 */
export async function getBlockedNights(): Promise<{ nights: Set<string>; airbnbSynced: boolean }> {
  const nights = new Set<string>();
  let airbnbSynced = false;

  const icalUrl = process.env.AIRBNB_ICAL_URL;
  if (icalUrl) {
    try {
      const res = await fetch(icalUrl, { next: { revalidate: 900 } });
      if (res.ok) {
        parseICalDates(await res.text()).forEach((d) => nights.add(d));
        airbnbSynced = true;
      }
    } catch (err) {
      console.error('Failed to fetch Airbnb iCal:', err);
    }
  }

  const supabase = getServiceClient();
  const [{ data: bookings, error: e1 }, { data: manual, error: e2 }] = await Promise.all([
    supabase.from('bookings').select('check_in, check_out').in('status', HOLDING_STATUSES),
    supabase.from('blocked_dates').select('start_date, end_date'),
  ]);

  // Never report dates as open when the booking data could not be read.
  if (e1 || e2 || !bookings || !manual) throw new Error(`Calendar unavailable: ${(e1 ?? e2)?.message ?? 'no data'}`);
  for (const b of bookings) stayNights(b.check_in, b.check_out).forEach((d) => nights.add(d));
  // Manual blocks are inclusive of end_date
  for (const m of manual) stayNights(m.start_date, addDays(m.end_date, 1)).forEach((d) => nights.add(d));

  return { nights, airbnbSynced };
}
