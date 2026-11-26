// Sends Instagram drafts to the owners' Telegram group for Post / Skip.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

async function call(method: string, body: FormData | Record<string, unknown>) {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string; result?: { message_id: number } };
  if (!json.ok) throw new Error(`Telegram ${method} failed: ${json.description}`);
  return json.result;
}

/**
 * Sends the photo, then the full caption with Post / Skip buttons.
 * Returns the message id of the caption message (the one with buttons).
 */
export async function sendDraftForApproval(postId: string, photos: Buffer | Buffer[], caption: string, note: string) {
  if (!TOKEN || !CHAT_ID) throw new Error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
  const list = Array.isArray(photos) ? photos : [photos];
  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  if (list.length === 1) {
    form.append("photo", new Blob([new Uint8Array(list[0])], { type: "image/jpeg" }), "photo.jpg");
    form.append("caption", "📸 Instagram draft");
    await call("sendPhoto", form);
  } else {
    // Carousel: show every slide, in order, as one album.
    const media = list.map((_, i) => ({
      type: "photo",
      media: `attach://p${i}`,
      ...(i === 0 ? { caption: `📸 Instagram carousel draft (${list.length} photos, swipe order)` } : {}),
    }));
    form.append("media", JSON.stringify(media));
    list.forEach((buf, i) => form.append(`p${i}`, new Blob([new Uint8Array(buf)], { type: "image/jpeg" }), `p${i}.jpg`));
    await call("sendMediaGroup", form);
  }

  const msg = await call("sendMessage", {
    chat_id: CHAT_ID,
    text: `${caption}\n\n— ${note}\nPost goes out at the next publishing time (10am or 4pm MT) if approved.`,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Post", callback_data: `post:${postId}` },
          { text: "⏭ Skip", callback_data: `skip:${postId}` },
        ],
      ],
    },
  });
  return msg?.message_id ?? null;
}
