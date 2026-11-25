import { getServiceClient } from "@/lib/supabase";
import { sendTelegramNotification, sendTelegramText } from "@/lib/notify";
import { checkStay } from "@/lib/agent/availability";

export async function POST(request) {
  try {
    const body = await request.json();

    const required = [
      "guest_name", "guest_email", "check_in", "check_out",
      "num_guests", "nightly_total", "cleaning_fee", "subtotal",
      "final_total", "payment_method",
    ];

    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const checkIn = new Date(body.check_in);
    const checkOut = new Date(body.check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return Response.json({ error: "Check-in date cannot be in the past" }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return Response.json({ error: "Check-out must be after check-in" }, { status: 400 });
    }

    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (nights < 2) {
      return Response.json({ error: "Minimum 2-night stay required" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Check against Airbnb (read fresh), manual blocks, and other bookings.
    const availability = await checkStay(body.check_in, body.check_out);
    if (availability.conflicts.length || !availability.airbnbChecked) {
      if (body.square_payment_id) {
        // Rare race: the card was charged moments ago, then the dates were taken.
        await sendTelegramText(
          `⚠️ REFUND NEEDED\n${body.guest_name} (${body.guest_email}) was charged a $${body.deposit_amount} deposit for ${body.check_in} → ${body.check_out}, but the dates were taken before the request was saved.\nSquare payment: ${body.square_payment_id}\nReason: ${availability.conflicts.join("; ") || "Airbnb calendar unreadable"}`
        ).catch((e) => console.error("Telegram alert failed:", e));
      }
      return Response.json(
        availability.conflicts.length
          ? { error: "These dates are no longer available. Please select different dates." }
          : { error: "We couldn't confirm availability just now. Please try again in a few minutes." },
        { status: availability.conflicts.length ? 409 : 503 }
      );
    }

    // All bookings start as pending_approval — must be approved via Telegram
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        guest_name: body.guest_name,
        guest_email: body.guest_email,
        guest_phone: body.guest_phone || null,
        guest_message: body.guest_message || null,
        check_in: body.check_in,
        check_out: body.check_out,
        num_guests: body.num_guests,
        num_pets: body.num_pets || 0,
        nightly_total: body.nightly_total,
        cleaning_fee: body.cleaning_fee,
        pet_fee: body.pet_fee || 0,
        subtotal: body.subtotal,
        btc_discount: body.btc_discount || 0,
        final_total: body.final_total,
        payment_method: body.payment_method,
        status: "pending_approval",
        payment_status: "pending",
        square_payment_id: body.square_payment_id || null,
        deposit_amount: body.deposit_amount || 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: "Failed to save booking. Please try again." }, { status: 500 });
    }

    console.log("Booking created successfully, id:", booking.id, "— sending Telegram notification");

    try {
      await sendTelegramNotification({
        ...body,
        id: booking.id,
        square_payment_id: body.square_payment_id || null,
        deposit_amount: body.deposit_amount || 0,
      });
    } catch (err) {
      console.error("Telegram notification error:", err);
    }

    const hasDeposit = body.square_payment_id && body.deposit_amount > 0;

    return Response.json(
      {
        success: true,
        bookingId: booking.id,
        message: hasDeposit
          ? "Your deposit has been processed. We'll confirm your booking shortly after checking availability."
          : "Booking request received! We'll confirm availability and get back to you shortly.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return Response.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
