export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const diagnostics = {
    tokenExists: !!token,
    tokenLength: token ? token.length : 0,
    tokenPrefix: token ? token.substring(0, 6) + "..." : "NOT SET",
    chatId: chatId || "NOT SET",
  };

  if (!token) {
    return Response.json({
      error: "TELEGRAM_BOT_TOKEN is not set",
      diagnostics,
    }, { status: 500 });
  }

  if (!chatId) {
    return Response.json({
      error: "TELEGRAM_CHAT_ID is not set",
      diagnostics,
    }, { status: 500 });
  }

  // Step 1: Verify the bot token by calling getMe
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json();
    diagnostics.botInfo = meData;

    if (!meData.ok) {
      return Response.json({
        error: "Bot token is invalid",
        diagnostics,
      }, { status: 500 });
    }
  } catch (err) {
    return Response.json({
      error: "Failed to reach Telegram API: " + err.message,
      diagnostics,
    }, { status: 500 });
  }

  // Step 2: Try sending a test message
  try {
    const sendRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Test message from Colorado House booking system. Telegram integration is working!",
        }),
      }
    );

    const sendData = await sendRes.json();
    diagnostics.sendResult = sendData;

    if (!sendData.ok) {
      return Response.json({
        error: `Failed to send message: ${sendData.description}`,
        hint: sendData.description?.includes("chat not found")
          ? "The TELEGRAM_CHAT_ID is wrong, or the bot hasn't been added to this chat. Send /start to your bot first."
          : sendData.description?.includes("bot was blocked")
          ? "The bot was blocked by the user. Unblock it in Telegram."
          : "Check the error description above.",
        diagnostics,
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Test message sent successfully! Check your Telegram.",
      diagnostics,
    });
  } catch (err) {
    return Response.json({
      error: "Failed to send test message: " + err.message,
      diagnostics,
    }, { status: 500 });
  }
}
