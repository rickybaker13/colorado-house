import { getServiceClient } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { checkStay } from "@/lib/agent/availability";
import { sendTelegramText } from "@/lib/notify";
import { squareClient } from "@/lib/payments/square";
import { bookingStatusUrl } from "@/lib/payments/link";
import { methodLabel } from "@/lib/payments/methods";

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


// Plain text (guest names can contain characters Markdown would mangle).
async function editTelegramMessage(
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: unknown
) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });
}

function paidKeyboard(bookingId: string) {
  return { inline_keyboard: [[{ text: "💰 Deposit received", callback_data: `paid:${bookingId}` }]] };
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handlePostDecision(callback: any, action: "post" | "skip", postId: string) {
  const supabase = getServiceClient();
  const { data: post } = await supabase
    .from("social_posts")
    .select("id, status, content, hashtags")
    .eq("id", postId)
    .single();

  if (!post) {
    await answerCallback(callback.id, "Post not found");
    return Response.json({ ok: true });
  }
  if (post.status !== "draft") {
    await answerCallback(callback.id, `Already ${post.status}, no change made`);
    return Response.json({ ok: true });
  }

  const status = action === "post" ? "approved" : "rejected";
  await supabase.from("social_posts").update({ status }).eq("id", postId);

  const who = callback.from?.first_name ? ` by ${callback.from.first_name}` : "";
  const header =
    action === "post"
      ? `✅ APPROVED${who}: goes out at the next publishing time (10am or 4pm MT).`
      : `⏭ SKIPPED${who}: this one won't be posted.`;
  // Plain text (no parse_mode) so captions with * or _ can't break the edit.
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      text: `${header}\n\n${post.content}\n\n${post.hashtags ?? ""}`.slice(0, 4000),
    }),
  });
  await answerCallback(callback.id, action === "post" ? "Approved" : "Skipped");
  return Response.json({ ok: true });
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

    // "/chatid" command: replies with this chat's ID so it can be set as
    // TELEGRAM_CHAT_ID (e.g. after creating a group for both owners).
    const msg = body.message;
    const text: string = msg?.text ?? "";
    if (msg && /^\/chatid(@\w+)?\b/.test(text)) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: `This chat's ID is ${msg.chat.id}. Set TELEGRAM_CHAT_ID to this value to send booking and post alerts here.`,
        }),
      });
      return Response.json({ ok: true });
    }

    // Otherwise we only handle callback_query (inline button presses)
    const callback = body.callback_query;
    if (!callback) {
      return Response.json({ ok: true });
    }

    // Only accept button taps from the configured owners' chat.
    const allowedChat = process.env.TELEGRAM_CHAT_ID;
    if (allowedChat && String(callback.message?.chat?.id) !== allowedChat) {
      await answerCallback(callback.id, "This chat isn't authorized to manage bookings.");
      return Response.json({ ok: true });
    }

    const data = callback.data as string; // e.g. "approve:<id>", "deny:<id>", "paid:<id>"
    const [action, bookingId] = data.split(":");

    // Instagram drafts: "post:<id>" approves, "skip:<id>" rejects.
    if (action === "post" || action === "skip") {
      return handlePostDecision(callback, action, bookingId);
    }

    if (!bookingId || !["approve", "deny", "paid"].includes(action)) {
      await answerCallback(callback.id, "Unknown action");
      return Response.json({ ok: true });
    }

    const supabase = getServiceClient();
    const { data: booking, error: fetchErr } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
    if (fetchErr || !booking) {
      await answerCallback(callback.id, "Booking not found");
      return Response.json({ ok: true });
    }

    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const nights = Math.round((Date.parse(booking.check_out) - Date.parse(booking.check_in)) / 86_400_000);
    const summary = `👤 ${booking.guest_name} (${booking.guest_email})
📅 ${booking.check_in} → ${booking.check_out} (${nights} nights)
👥 ${booking.num_guests} guests${booking.num_pets ? `, ${booking.num_pets} pets` : ""}
💵 Total $${booking.final_total}
💳 ${methodLabel(booking.payment_method)}`;

    // ── Mark a non-card deposit as received ──
    if (action === "paid") {
      if (booking.status !== "requested" || booking.payment_status !== "pending") {
        await answerCallback(callback.id, `Already ${booking.status} / ${booking.payment_status}`);
        return Response.json({ ok: true });
      }
      const deposit = Math.round(Number(booking.final_total) * 50) / 100;
      await supabase.from("bookings").update({ status: "confirmed", payment_status: "deposit_paid", deposit_amount: deposit }).eq("id", bookingId);
      await editTelegramMessage(chatId, messageId, `✅ CONFIRMED (deposit received)\n\n${summary}\n💰 Deposit $${deposit} received. Balance $${(Number(booking.final_total) - deposit).toFixed(2)} due 30 days before check-in.`);
      await answerCallback(callback.id, "Marked as paid. Booking confirmed.");
      return Response.json({ ok: true });
    }

    if (booking.status !== "pending_approval") {
      await answerCallback(callback.id, `Already ${booking.status}, no change made`);
      return Response.json({ ok: true });
    }

    if (action === "approve") {
      // Last line of defense against double booking: re-check Airbnb (read
      // fresh) and every other booking right before confirming.
      const check = await checkStay(booking.check_in, booking.check_out, { excludeBookingId: bookingId });
      if (check.conflicts.length || !check.airbnbChecked) {
        const why = check.conflicts.length
          ? `Conflicts with: ${check.conflicts.join("; ")}`
          : "The Airbnb calendar could not be read just now, so the dates could not be verified.";
        await answerCallback(callback.id, check.conflicts.length ? "Not approved: dates conflict" : "Not approved: try again in a minute");
        await sendTelegramText(
          `⛔ NOT APPROVED: ${booking.guest_name}, ${booking.check_in} → ${booking.check_out}\n${why}\n` +
            (check.conflicts.length
              ? "Tap Deny on the request to release the dates (and any card hold)."
              : "Tap Approve again in a minute.")
        );
        return Response.json({ ok: true });
      }

      const statusUrl = bookingStatusUrl(bookingId);

      // Card on hold: charge it now.
      if (booking.payment_status === "deposit_held" && booking.square_payment_id) {
        try {
          const { payment } = await squareClient.payments.complete({ paymentId: booking.square_payment_id });
          if (payment?.status !== "COMPLETED") throw new Error(`status ${payment?.status}`);
          await supabase.from("bookings").update({ status: "confirmed", payment_status: "deposit_paid" }).eq("id", bookingId);
          await editTelegramMessage(chatId, messageId, `✅ APPROVED & CONFIRMED\n\n${summary}\n💳 Deposit $${booking.deposit_amount} charged. Balance due 30 days before check-in.\n\nGuest's booking page: ${statusUrl}`);
          await answerCallback(callback.id, "Approved. Deposit charged.");
        } catch (err) {
          console.error("Square capture failed:", err);
          await supabase.from("bookings").update({ status: "requested", payment_status: "pending", deposit_amount: 0 }).eq("id", bookingId);
          await editTelegramMessage(
            chatId,
            messageId,
            `✅ APPROVED, but the card hold couldn't be charged (it may have expired after 7 days).\n\n${summary}\n\nThe dates are held. Send the guest their booking page so they can pay the deposit:\n${statusUrl}`,
            paidKeyboard(bookingId)
          );
          await answerCallback(callback.id, "Approved, but the card couldn't be charged");
        }
        return Response.json({ ok: true });
      }

      // Older requests where the deposit was already charged.
      if (booking.payment_status === "deposit_paid") {
        await supabase.from("bookings").update({ status: "confirmed" }).eq("id", bookingId);
        await editTelegramMessage(chatId, messageId, `✅ APPROVED & CONFIRMED\n\n${summary}\n💳 Deposit $${booking.deposit_amount} already paid.\n\nGuest's booking page: ${statusUrl}`);
        await answerCallback(callback.id, "Approved");
        return Response.json({ ok: true });
      }

      // Nothing collected yet (Venmo, Zelle, crypto, or an agent request).
      const deposit = Math.round(Number(booking.final_total) * 50) / 100;
      await supabase.from("bookings").update({ status: "requested", payment_status: "pending" }).eq("id", bookingId);
      await editTelegramMessage(
        chatId,
        messageId,
        `✅ APPROVED, awaiting deposit of $${deposit}\n\n${summary}\n\nEmail the guest this link. It shows how to pay by ${methodLabel(booking.payment_method)}${booking.payment_method === "credit_card" ? "" : " (or by card)"}:\n${statusUrl}\n\nCard payments confirm automatically. For anything else, tap "Deposit received" once it arrives.`,
        paidKeyboard(bookingId)
      );
      await answerCallback(callback.id, "Approved. Send the guest their link.");
      return Response.json({ ok: true });
    }

    // ── Deny: release a card hold, or refund an older charged deposit ──
    let paymentNote = "";
    if (booking.square_payment_id && booking.payment_status === "deposit_held") {
      try {
        await squareClient.payments.cancel({ paymentId: booking.square_payment_id });
        paymentNote = `\n💳 Card hold of $${booking.deposit_amount} released. The guest was never charged.`;
      } catch (err) {
        console.error("Square cancel failed:", err);
        paymentNote = "\n⚠️ Couldn't release the card hold automatically. Cancel it in the Square dashboard (it also lapses on its own after 7 days).";
      }
    } else if (booking.square_payment_id && booking.deposit_amount > 0) {
      try {
        const { refund } = await squareClient.refunds.refundPayment({
          idempotencyKey: randomUUID(),
          paymentId: booking.square_payment_id,
          amountMoney: { amount: BigInt(Math.round(booking.deposit_amount * 100)), currency: "USD" },
          reason: "Booking denied by host",
        });
        paymentNote = refund && ["COMPLETED", "PENDING", "APPROVED"].includes(refund.status ?? "")
          ? `\n💸 Deposit of $${booking.deposit_amount} refunded (${refund.status})`
          : `\n⚠️ Refund status: ${refund?.status || "unknown"}. Check the Square dashboard.`;
      } catch (refundErr) {
        console.error("Square refund failed:", refundErr);
        paymentNote = "\n⚠️ Auto-refund failed. Refund manually in the Square dashboard.";
      }
    }

    await supabase
      .from("bookings")
      .update({ status: "denied", payment_status: booking.payment_status === "deposit_held" ? "released" : booking.payment_status })
      .eq("id", bookingId);
    await editTelegramMessage(chatId, messageId, `❌ DENIED\n\n${summary}${paymentNote}`);
    await answerCallback(callback.id, "Booking denied");
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return Response.json({ ok: true }); // Always return 200 to Telegram
  }
}
