// Record a received deposit and confirm the booking. Safe to call twice:
// it only changes a booking that is approved and still awaiting payment.
import { getServiceClient } from '@/lib/supabase';
import { sendTelegramText } from '@/lib/notify';

export async function confirmDeposit(
  bookingId: string,
  opts: { via: string; reference: string },
): Promise<'confirmed' | 'already_paid' | 'not_payable'> {
  const supabase = getServiceClient();
  const { data: b } = await supabase.from('bookings').select('*').eq('id', bookingId).single();
  if (!b) return 'not_payable';
  if (b.payment_status === 'deposit_paid') return 'already_paid';
  if (b.status !== 'requested' || b.payment_status !== 'pending') return 'not_payable';

  const deposit = Math.round(Number(b.final_total) * 50) / 100;
  const note = `${new Date().toISOString().slice(0, 10)}: deposit $${deposit} via ${opts.via} (${opts.reference})`;
  const { data: updated } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      payment_status: 'deposit_paid',
      deposit_amount: deposit,
      owner_notes: b.owner_notes ? `${b.owner_notes}\n${note}` : note,
    })
    .eq('id', bookingId)
    .eq('status', 'requested')
    .eq('payment_status', 'pending')
    .select('id');
  if (!updated?.length) return 'already_paid'; // another request settled it first

  await sendTelegramText(
    `⚡ DEPOSIT RECEIVED via ${opts.via}\n${b.guest_name}, ${b.check_in} → ${b.check_out}\n$${deposit}. Booking is now confirmed.\nRef: ${opts.reference}`
  ).catch((e) => console.error('Telegram alert failed:', e));
  return 'confirmed';
}
