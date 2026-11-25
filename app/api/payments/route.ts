// Card deposits via Square.
//
// 1. New website request: { sourceId, checkIn, checkOut, guests, pets, ... }
//    Checks availability, prices the stay on the server, and places a HOLD
//    (authorization) for 50%. Nothing is charged until the owner taps
//    Approve in Telegram; Deny releases the hold. Square voids an unused
//    hold automatically after 7 days.
// 2. Already-approved request paying by card: { sourceId, bookingId, token }
//    (agent bookings, or a hold that expired). Charges the 50% deposit now.
import { randomUUID } from "crypto";
import { checkStay } from "@/lib/agent/availability";
import { ISO_DATE } from "@/lib/agent/dates";
import { cardEnabled } from "@/lib/payments/methods";
import { priceStay, StayError } from "@/lib/payments/price";
import { squareClient, squareErrorMessage, squareLocationId } from "@/lib/payments/square";
import { verifyBookingToken } from "@/lib/payments/link";
import { getServiceClient } from "@/lib/supabase";
import { sendTelegramText } from "@/lib/notify";

interface Body {
  sourceId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  pets?: number;
  guestName?: string;
  guestEmail?: string;
  bookingId?: string;
  token?: string;
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.sourceId) return json({ error: "Payment token is missing. Please try again." }, 400);
    if (!cardEnabled()) return json({ error: "Card payments are not available right now. Please choose another method." }, 503);
    return body.bookingId ? payApprovedBooking(body) : holdNewRequest(body);
  } catch (err) {
    console.error("Square payment error:", err);
    return json({ error: squareErrorMessage(err, "Payment failed. Please check your card details and try again.") }, 400);
  }
}

async function holdNewRequest(body: Body) {
  const checkIn = body.checkIn || "";
  const checkOut = body.checkOut || "";
  if (!ISO_DATE.test(checkIn) || !ISO_DATE.test(checkOut)) return json({ error: "Missing or invalid dates." }, 400);

  let priced;
  try {
    priced = await priceStay({ checkIn, checkOut, guests: Number(body.guests), pets: Number(body.pets ?? 0), method: "credit_card" });
  } catch (e) {
    if (e instanceof StayError) return json({ error: e.message }, 400);
    throw e;
  }

  // Never hold a card for dates that are taken (fresh read of Airbnb too).
  const availability = await checkStay(checkIn, checkOut);
  if (availability.conflicts.length) {
    return json({ error: "These dates are no longer available. Your card was not charged. Please select different dates." }, 409);
  }
  if (!availability.airbnbChecked) {
    return json({ error: "We couldn't confirm availability just now. Your card was not charged. Please try again in a few minutes." }, 503);
  }

  const { payment } = await squareClient.payments.create({
    sourceId: body.sourceId!,
    idempotencyKey: randomUUID(),
    locationId: squareLocationId(),
    amountMoney: { amount: priced.depositCents, currency: "USD" },
    autocomplete: false, // hold only; captured when the owner approves
    note: `Purgatory Townhouse deposit hold: ${body.guestName ?? ""}, ${checkIn} to ${checkOut}`.slice(0, 500),
    buyerEmailAddress: body.guestEmail,
  });

  if (payment?.id && payment.status === "APPROVED") {
    return json({ success: true, paymentId: payment.id, status: payment.status, depositAmount: priced.deposit, held: true });
  }
  console.error("Square hold not approved:", payment?.status);
  return json({ error: "Your card was declined. Please check the details or try another card." }, 400);
}

async function payApprovedBooking(body: Body) {
  if (!verifyBookingToken(body.bookingId!, body.token)) return json({ error: "This payment link is not valid." }, 403);
  const supabase = getServiceClient();
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", body.bookingId!).single();
  if (!booking) return json({ error: "Booking not found." }, 404);
  if (booking.status !== "requested" || booking.payment_status !== "pending") {
    return json({ error: "This booking doesn't have a card payment due." }, 409);
  }

  const depositCents = BigInt(Math.round(Number(booking.final_total) * 50));
  const { payment } = await squareClient.payments.create({
    sourceId: body.sourceId!,
    idempotencyKey: `deposit-${booking.id}`, // one deposit per booking, even on double-click
    locationId: squareLocationId(),
    amountMoney: { amount: depositCents, currency: "USD" },
    autocomplete: true,
    note: `Purgatory Townhouse deposit: ${booking.guest_name}, ${booking.check_in} to ${booking.check_out}`.slice(0, 500),
    buyerEmailAddress: booking.guest_email,
  });
  if (!payment?.id || payment.status !== "COMPLETED") {
    return json({ error: "Your card was declined. Please check the details or try another card." }, 400);
  }

  const deposit = Number(depositCents) / 100;
  await supabase
    .from("bookings")
    .update({ status: "confirmed", payment_status: "deposit_paid", square_payment_id: payment.id, deposit_amount: deposit, payment_method: "credit_card" })
    .eq("id", booking.id);
  await sendTelegramText(
    `💳 DEPOSIT PAID BY CARD\n${booking.guest_name}, ${booking.check_in} → ${booking.check_out}\n$${deposit} charged. Booking is now confirmed.\nSquare payment: ${payment.id}`
  ).catch((e) => console.error("Telegram alert failed:", e));
  return json({ success: true, paymentId: payment.id, depositAmount: deposit, confirmed: true });
}
