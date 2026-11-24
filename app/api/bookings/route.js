import { getServiceClient } from "@/lib/supabase";
import { sendTelegramNotification } from "@/lib/notify";

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
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id, check_in, check_out")
      .in("status", ["confirmed", "requested", "pending_approval"])
      .lt("check_in", body.check_out)
      .gt("check_out", body.check_in);

    if (conflicts && conflicts.length > 0) {
      return Response.json(
        { error: "These dates are no longer available. Please select different dates." },
        { status: 409 }
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
