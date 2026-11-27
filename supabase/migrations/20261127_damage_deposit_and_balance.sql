-- Refundable damage deposit and automatic balance collection for direct bookings.
--
-- damage_status:
--   none        no deposit required (older bookings)
--   due         required, not collected yet
--   held        card authorization hold (released by cancelling it)
--   charged     card charged (released by refunding it)
--   collected   received off-card (Venmo, Cash App, crypto) with the balance
--   failed      automatic card hold/charge failed; guest can pay on their booking page
--   return_due  off-card deposit owed back to the guest (owner returns it by hand)
--   released    returned in full
--   claimed     some or all kept for damage (damage_claimed says how much)
--
-- balance_status: due | charged | failed | reminded | paid
alter table public.bookings
  add column if not exists square_customer_id text,
  add column if not exists square_card_id text,
  add column if not exists balance_status text not null default 'due',
  add column if not exists balance_payment_id text,
  add column if not exists balance_paid_at timestamptz,
  add column if not exists damage_deposit numeric not null default 0,
  add column if not exists damage_status text not null default 'none',
  add column if not exists damage_method text,
  add column if not exists damage_payment_id text,
  add column if not exists damage_collected_at timestamptz,
  add column if not exists damage_claimed numeric not null default 0,
  add column if not exists damage_closed_at timestamptz,
  add column if not exists checkout_notified_at timestamptz;

insert into public.site_config (key, value)
values ('damage_deposit', '500')
on conflict (key) do nothing;
