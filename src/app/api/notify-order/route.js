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
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    // 알림 실패해도 주문 자체는 이미 저장됐으니 무시
  }

  return Response.json({ ok: true });
}
