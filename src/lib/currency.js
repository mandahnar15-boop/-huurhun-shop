// 상품 가격은 원화(KRW) 기준으로 저장되어 있음
// 몽골어 화면에서는 대략적인 환율로 투그릭(MNT)으로 환산해서 보여줌 (실시간 환율 아님, 데모용 고정 환율)
const KRW_TO_MNT_RATE = 2.6;

export function formatPrice(amountKrw, locale) {
  if (locale === "mn") {
    const amountMnt = Math.round(amountKrw * KRW_TO_MNT_RATE);
    return `${amountMnt.toLocaleString("mn-MN")}₮`;
  }
  return `${amountKrw.toLocaleString("ko-KR")}원`;
}
