import { getServiceClient } from "@/lib/supabase";

async function sendTelegramNotification(booking) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

  const nights =
    (new Date(booking.check_out) - new Date(booking.check_in)) /
    (1000 * 60 * 60 * 24);

  const message = `
🏔️ *NEW BOOKING REQUEST*

👤 *Guest:* ${booking.guest_name}
📧 *Email:* ${booking.guest_email}
📱 *Phone:* ${booking.guest_phone || "Not provided"}

📅 *Check-in:* ${booking.check_in}
📅 *Check-out:* ${booking.check_out}
🌙 *Nights:* ${nights}
👥 *Guests:* ${booking.num_guests}
🐾 *Pets:* ${booking.num_pets}

💰 *Nightly Total:* $${booking.nightly_total}
🧹 *Cleaning Fee:* $${booking.cleaning_fee}
🐾 *Pet Fee:* $${booking.pet_fee}
${booking.btc_discount > 0 ? `₿ *BTC Discount:* -$${booking.btc_discount}\n` : ""}💵 *Final Total:* $${booking.final_total}

💳 *Payment Method:* ${booking.payment_method}

${booking.guest_message ? `💬 *Message:* ${booking.guest_message}` : ""}

⏳ Status: Awaiting your confirmation
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Telegram API error:", err);
    }
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

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
      .in("status", ["confirmed", "requested"])
      .lt("check_in", body.check_out)
      .gt("check_out", body.check_in);

    if (conflicts && conflicts.length > 0) {
      return Response.json(
        { error: "These dates are no longer available. Please select different dates." },
        { status: 409 }
      );
    }

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
        status: "requested",
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: "Failed to save booking. Please try again." }, { status: 500 });
    }

    sendTelegramNotification({ ...body, id: booking.id }).catch((err) =>
      console.error("Telegram notification error:", err)
    );

    return Response.json(
      { success: true, bookingId: booking.id, message: "Booking request received! We'll confirm availability shortly." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return Response.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
