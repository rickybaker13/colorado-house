import { getServiceClient } from "@/lib/supabase";

async function sendTelegramNotification(booking) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("Telegram config check — token exists:", !!token, "chatId:", chatId);

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured, skipping notification");
    return;
  }

  const nights =
    (new Date(booking.check_out) - new Date(booking.check_in)) /
    (1000 * 60 * 60 * 24);

  const isDepositPaid = booking.square_payment_id && booking.deposit_amount > 0;

  const message = [
    `🏔️ <b>NEW BOOKING — APPROVAL NEEDED</b>`,
    ``,
    `👤 <b>Guest:</b> ${booking.guest_name}`,
    `📧 <b>Email:</b> ${booking.guest_email}`,
    `📱 <b>Phone:</b> ${booking.guest_phone || "Not provided"}`,
    ``,
    `📅 <b>Check-in:</b> ${booking.check_in}`,
    `📅 <b>Check-out:</b> ${booking.check_out}`,
    `🌙 <b>Nights:</b> ${nights}`,
    `👥 <b>Guests:</b> ${booking.num_guests}`,
    `🐾 <b>Pets:</b> ${booking.num_pets}`,
    ``,
    `💰 <b>Nightly Total:</b> $${booking.nightly_total}`,
    `🧹 <b>Cleaning Fee:</b> $${booking.cleaning_fee}`,
    `🐾 <b>Pet Fee:</b> $${booking.pet_fee}`,
    booking.btc_discount > 0 ? `₿ <b>BTC Discount:</b> -$${booking.btc_discount}` : null,
    `💵 <b>Final Total:</b> $${booking.final_total}`,
    ``,
    `💳 <b>Payment Method:</b> ${booking.payment_method}`,
    isDepositPaid ? `💳 <b>Deposit Charged:</b> $${booking.deposit_amount} (50% via Square)` : null,
    isDepositPaid ? `🆔 <b>Square ID:</b> ${booking.square_payment_id}` : null,
    booking.guest_message ? `` : null,
    booking.guest_message ? `💬 <b>Message:</b> ${booking.guest_message}` : null,
    ``,
    `⏳ <b>Tap below to approve or deny this booking.</b>`,
  ].filter(line => line !== null).join("\n");

  // Inline keyboard with Approve / Deny buttons
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: "✅ Approve", callback_data: `approve:${booking.id}` },
        { text: "❌ Deny", callback_data: `deny:${booking.id}` },
      ],
    ],
  };

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          reply_markup: inlineKeyboard,
        }),
      }
    );

    const responseText = await response.text();
    if (!response.ok) {
      console.error("Telegram API error:", response.status, responseText);
    } else {
      console.log("Telegram notification sent successfully:", responseText);
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
