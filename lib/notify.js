// Telegram notification for new booking requests (website and AI agents).

const escapeHtml = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const TEXT_FIELDS = ["source_label", "guest_name", "guest_email", "guest_phone", "guest_message", "payment_method"];

export async function sendTelegramNotification(raw) {
  // Guest-entered text is escaped once, here, because the message is HTML.
  const booking = { ...raw };
  for (const f of TEXT_FIELDS) if (booking[f]) booking[f] = escapeHtml(booking[f]);
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

  const isDepositHeld = booking.payment_status === "deposit_held" && booking.deposit_amount > 0;
  const isDepositPaid = booking.payment_status === "deposit_paid" && booking.deposit_amount > 0;

  const message = [
    `🏔️ <b>NEW BOOKING — APPROVAL NEEDED</b>`,
    booking.source_label ? `🤖 <b>Source:</b> ${booking.source_label}` : null,
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
    isDepositHeld ? `💳 <b>Deposit on hold:</b> $${booking.deposit_amount} (charged when you approve, released if you deny)` : null,
    isDepositPaid ? `💳 <b>Deposit charged:</b> $${booking.deposit_amount}` : null,
    !isDepositHeld && !isDepositPaid ? `💳 <b>Nothing collected yet.</b> The guest gets payment details after you approve.` : null,
    booking.square_payment_id ? `🆔 <b>Square ID:</b> ${booking.square_payment_id}` : null,
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

// Plain-text alert to the owners' Telegram group (no buttons, no formatting).
// Optional replyMarkup adds inline buttons.
export async function sendTelegramText(text, replyMarkup) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });
  if (!res.ok) console.error("Telegram alert error:", res.status, await res.text());
}
