// Private link to a booking's status and payment page. The token is an HMAC
// of the booking id, so no extra database column is needed and links can't
// be guessed.
import { createHmac, timingSafeEqual } from 'crypto';
import { SITE_URL } from '@/lib/agent/property';

function secret(): string {
  const s = process.env.BOOKING_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error('BOOKING_LINK_SECRET is not configured');
  return s;
}

export function bookingToken(id: string): string {
  return createHmac('sha256', secret()).update(`booking:${id}`).digest('base64url').slice(0, 32);
}

export function verifyBookingToken(id: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const a = Buffer.from(bookingToken(id));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function bookingStatusUrl(id: string): string {
  return `${SITE_URL}/booking/status/${id}?t=${bookingToken(id)}`;
}
