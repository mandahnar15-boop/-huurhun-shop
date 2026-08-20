// 새 주문이 들어오면 사장님 Telegram으로 알림을 보냄 (Telegram Bot API, 무료)
// TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID 환경변수가 없으면 조용히 아무것도 안 함
export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return Response.json({ skipped: true });
  }

  const { orderNumber, amountText, customerName } = await request.json();

  const text = `📦 새 주문이 들어왔어요!\n주문번호: ${orderNumber}\n금액: ${amountText}\n입금자: ${customerName}\n\n계좌 확인해주세요.`;

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error("Telegram notify failed:", telegramResult);
      return Response.json({ ok: false, telegramError: telegramResult }, { status: 502 });
    }
  } catch (error) {
    console.error("Telegram notify request failed:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 502 });
  }

  return Response.json({ ok: true });
}
