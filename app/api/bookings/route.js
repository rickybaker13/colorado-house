// Website booking requests. Prices are computed here, never taken from the
// browser. Card requests must carry a Square hold for exactly the 50% deposit.
import { getServiceClient } from "@/lib/supabase";
import { sendTelegramNotification, sendTelegramText } from "@/lib/notify";
import { checkStay } from "@/lib/agent/availability";
import { isEnabled, normalizeMethod } from "@/lib/payments/methods";
import { priceStay, StayError } from "@/lib/payments/price";
import { squareClient } from "@/lib/payments/square";
import { bookingStatusUrl } from "@/lib/payments/link";
import { saveCardFromPayment } from "@/lib/payments/stay";

const json = (body, status = 200) => Response.json(body, { status });

async function releaseHold(paymentId) {
  try {
    await squareClient.payments.cancel({ paymentId });
  } catch (e) {
    console.error("Could not release card hold", paymentId, e);
    await sendTelegramText(`⚠️ Could not release a card hold automatically. Cancel it in the Square dashboard: ${paymentId}`).catch(() => {});
  }
}

export async function POST(request) {
  let heldPaymentId = null;
  try {
    const body = await request.json();

    for (const field of ["guest_name", "guest_email", "check_in", "check_out", "num_guests", "payment_method"]) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.guest_email))) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    const method = normalizeMethod(body.payment_method);
    if (!method || !isEnabled(method)) {
      return json({ error: "That payment method isn't available. Please choose another." }, 400);
    }
    heldPaymentId = method === "credit_card" ? body.square_payment_id || null : null;

    let priced;
    try {
      priced = await priceStay({
        checkIn: body.check_in,
        checkOut: body.check_out,
        guests: Number(body.num_guests),
        pets: Number(body.num_pets || 0),
        method,
      });
    } catch (e) {
      if (heldPaymentId) await releaseHold(heldPaymentId);
      if (e instanceof StayError) return json({ error: e.message }, 400);
      throw e;
    }

    // Card requests: the hold must exist, be unused, and match the deposit.
    if (method === "credit_card") {
      if (!heldPaymentId) return json({ error: "Card details are missing. Please try again." }, 400);
      const { payment } = await squareClient.payments.get({ paymentId: heldPaymentId });
      const ok =
        payment?.status === "APPROVED" &&
        payment.amountMoney?.amount === priced.depositCents &&
        payment.amountMoney?.currency === "USD";
      if (!ok) {
        console.error("Card hold mismatch", heldPaymentId, payment?.status, payment?.amountMoney);
        if (payment?.status === "APPROVED") await releaseHold(heldPaymentId);
        return json({ error: "We couldn't verify the card hold. Nothing was charged. Please try again." }, 400);
      }
      const supabase = getServiceClient();
      const { data: reused } = await supabase.from("bookings").select("id").eq("square_payment_id", heldPaymentId).limit(1);
      if (reused?.length) return json({ error: "This card hold was already used. Please try again." }, 409);
    }

    // Check against Airbnb (read fresh), manual blocks, and other bookings.
    const availability = await checkStay(body.check_in, body.check_out);
    if (availability.conflicts.length || !availability.airbnbChecked) {
      if (heldPaymentId) await releaseHold(heldPaymentId);
      return json(
        availability.conflicts.length
          ? { error: "These dates are no longer available. Nothing was charged. Please select different dates." }
          : { error: "We couldn't confirm availability just now. Nothing was charged. Please try again in a few minutes." },
        availability.conflicts.length ? 409 : 503
      );
    }

    const { quote, btcDiscount, finalTotal, deposit, damageDeposit } = priced;
    const supabase = getServiceClient();
    const row = {
      guest_name: String(body.guest_name).slice(0, 200),
      guest_email: String(body.guest_email).slice(0, 200),
      guest_phone: body.guest_phone ? String(body.guest_phone).slice(0, 50) : null,
      guest_message: body.guest_message ? String(body.guest_message).slice(0, 2000) : null,
      check_in: body.check_in,
      check_out: body.check_out,
      num_guests: quote.guests,
      num_pets: quote.pets,
      nightly_total: quote.nightly_total,
      cleaning_fee: quote.cleaning_fee,
      pet_fee: quote.pet_fee,
      subtotal: quote.subtotal,
      btc_discount: btcDiscount,
      final_total: finalTotal,
      payment_method: method,
      status: "pending_approval",
      payment_status: method === "credit_card" ? "deposit_held" : "pending",
      square_payment_id: heldPaymentId,
      deposit_amount: method === "credit_card" ? deposit : 0,
      damage_deposit: damageDeposit,
      damage_status: damageDeposit > 0 ? "due" : "none",
    };
    const { data: booking, error } = await supabase.from("bookings").insert(row).select().single();
    if (error) {
      console.error("Supabase insert error:", error);
      if (heldPaymentId) await releaseHold(heldPaymentId);
      return json({ error: "Failed to save booking. Nothing was charged. Please try again." }, 500);
    }
    const savedFrom = heldPaymentId;
    heldPaymentId = null; // the booking owns the hold now

    // Keep the card for the balance and damage hold (the guest agreed to this
    // on the payment form). If Square won't save it from a hold, it's retried
    // when the deposit is captured.
    if (savedFrom) await saveCardFromPayment(booking, savedFrom);

    try {
      await sendTelegramNotification({ ...row, id: booking.id });
    } catch (err) {
      console.error("Telegram notification error:", err);
    }

    return json(
      {
        success: true,
        bookingId: booking.id,
        statusUrl: bookingStatusUrl(booking.id),
        finalTotal,
        deposit,
        message:
          method === "credit_card"
            ? "Request received. Your card has a hold for the 50% deposit; it's only charged if the owner approves."
            : "Request received. Nothing is due until the owner approves; payment details will be on your booking page.",
      },
      201
    );
  } catch (error) {
    console.error("Booking API error:", error);
    if (heldPaymentId) await releaseHold(heldPaymentId);
    return json({ error: "An unexpected error occurred. Nothing was charged. Please try again." }, 500);
  }
}
