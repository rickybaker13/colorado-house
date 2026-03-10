import { getServiceClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

/**
 * Telegram Bot Webhook — handles inline button callbacks for booking approvals.
 *
 * Setup: Set the webhook URL in Telegram:
 *   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
 *
 * The bot sends booking notifications with "Approve" / "Deny" inline buttons.
 * When tapped, Telegram POSTs a callback_query here.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

async function editTelegramMessage(
  chatId: number | string,
  messageId: number,
  text: string
) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "Markdown",
    }),
  });
}

async function answerCallback(callbackQueryId: string, text: string) {
  await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    }
  );
}

export async function POST(request: NextRequest) {
  // Verify the webhook secret if configured
  if (WEBHOOK_SECRET) {
    const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
    if (headerSecret !== WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const body = await request.json();

    // We only handle callback_query (inline button presses)
    const callback = body.callback_query;
    if (!callback) {
      return Response.json({ ok: true });
    }

    const data = callback.data as string; // e.g. "approve:abc-123" or "deny:abc-123"
    const [action, bookingId] = data.split(":");
    if (!bookingId || !["approve", "deny"].includes(action)) {
      await answerCallback(callback.id, "Unknown action");
      return Response.json({ ok: true });
    }

    const supabase = getServiceClient();

    // Fetch the booking
    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchErr || !booking) {
      await answerCallback(callback.id, "Booking not found");
      return Response.json({ ok: true });
    }

    if (booking.status !== "pending_approval") {
      await answerCallback(
        callback.id,
        `Already ${booking.status} — no change made`
      );
      return Response.json({ ok: true });
    }

    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;

    if (action === "approve") {
      const newStatus =
        booking.square_payment_id && booking.deposit_amount > 0
          ? "confirmed"
          : "requested";
      const paymentStatus =
        booking.square_payment_id && booking.deposit_amount > 0
          ? "deposit_paid"
          : "pending";

      await supabase
        .from("bookings")
        .update({ status: newStatus, payment_status: paymentStatus })
        .eq("id", bookingId);

      const nights =
        (new Date(booking.check_out).getTime() -
          new Date(booking.check_in).getTime()) /
        (1000 * 60 * 60 * 24);

      const updatedMsg = `✅ *APPROVED*

👤 ${booking.guest_name}
📅 ${booking.check_in} → ${booking.check_out} (${nights} nights)
👥 ${booking.num_guests} guests
💵 $${booking.final_total}
💳 ${booking.payment_method}${booking.deposit_amount > 0 ? `\n✅ Deposit: $${booking.deposit_amount}` : ""}

Status: ${newStatus === "confirmed" ? "Confirmed (deposit paid)" : "Approved — awaiting payment"}`;

      await editTelegramMessage(chatId, messageId, updatedMsg);
      await answerCallback(callback.id, "Booking approved!");
    } else {
      // Deny
      await supabase
        .from("bookings")
        .update({ status: "denied" })
        .eq("id", bookingId);

      const updatedMsg = `❌ *DENIED*

👤 ${booking.guest_name}
📅 ${booking.check_in} → ${booking.check_out}
💵 $${booking.final_total}

This booking was denied.`;

      await editTelegramMessage(chatId, messageId, updatedMsg);
      await answerCallback(callback.id, "Booking denied");

      // TODO: If deposit was already charged via Square, you may want to
      // issue a refund here. For now, handle refunds manually.
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return Response.json({ ok: true }); // Always return 200 to Telegram
  }
}
