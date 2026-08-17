import Link from "next/link";
import ko from "@/dictionaries/ko";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";
import { updateOrderStatus } from "./actions";

const ADMIN_EMAIL = "mandahnar15@gmail.com";

const STATUS_COLOR = {
  pending: "text-sale",
  confirmed: "text-success",
  shipped: "text-ink",
  cancelled: "text-mute",
};

// 관리자 전용 주문 목록 페이지 — mandahnar15@gmail.com 계정으로 로그인해야 보임
// (다국어 대상 아님 — 사장님만 쓰는 내부 페이지라 한국어로 고정)
export default async function AdminPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 text-base font-medium text-ink">관리자만 볼 수 있는 페이지예요.</p>
        <Link
          href={`/${locale}/login`}
          className="inline-flex h-12 items-center rounded-[30px] bg-ink px-8 text-sm font-medium text-white"
        >
          로그인
        </Link>
      </main>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">주문 관리</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-sm font-medium text-mute">아직 주문이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-4 border border-hairline p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-ink">{order.order_number}</span>
                  <span className={`text-sm font-medium ${STATUS_COLOR[order.status]}`}>
                    {ko.orderStatus[order.status] ?? order.status}
                  </span>
                </div>
                <span className="text-xs font-medium text-mute">
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm font-medium sm:grid-cols-2">
                <p className="text-ink">
                  <span className="text-mute">이름 </span>
                  {order.customer_name}
                </p>
                <p className="text-ink">
                  <span className="text-mute">연락처 </span>
                  {order.phone}
                </p>
                <p className="text-ink sm:col-span-2">
                  <span className="text-mute">주소 </span>
                  {order.address}
                </p>
                {order.memo && (
                  <p className="text-ink sm:col-span-2">
                    <span className="text-mute">메모 </span>
                    {order.memo}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 border-t border-hairline pt-3 text-sm">
                {order.items.map((item, i) => (
                  <p key={i} className="text-ink">
                    {item.name} × {item.qty}
                  </p>
                ))}
                <p className="mt-1 font-medium text-ink">
                  합계 {formatPrice(order.subtotal, order.locale)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <form action={updateOrderStatus.bind(null, order.id, "confirmed", locale)}>
                    <button
                      type="submit"
                      className="h-9 rounded-[30px] bg-ink px-4 text-xs font-medium text-white"
                    >
                      입금 확인 처리
                    </button>
                  </form>
                )}
                {order.status === "confirmed" && (
                  <form action={updateOrderStatus.bind(null, order.id, "shipped", locale)}>
                    <button
                      type="submit"
                      className="h-9 rounded-[30px] bg-ink px-4 text-xs font-medium text-white"
                    >
                      배송 시작 처리
                    </button>
                  </form>
                )}
                {order.status !== "cancelled" && order.status !== "shipped" && (
                  <form action={updateOrderStatus.bind(null, order.id, "cancelled", locale)}>
                    <button
                      type="submit"
                      className="h-9 rounded-[30px] border border-hairline px-4 text-xs font-medium text-ink"
                    >
                      주문 취소
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
