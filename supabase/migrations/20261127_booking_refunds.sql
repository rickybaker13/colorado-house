-- Refunds issued when a booking is cancelled (see lib/payments/cancel.ts).
alter table public.bookings
  add column if not exists refunded_amount numeric not null default 0,
  add column if not exists cancelled_at timestamptz;
