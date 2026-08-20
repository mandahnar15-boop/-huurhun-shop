import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";
import { getDictionary } from "@/dictionaries";

// 로그인한 손님 본인의 주문 내역만 보여주는 페이지 (관리자 페이지와 달리 상태 변경 불가, 읽기 전용)
export default async function MyPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 text-base font-medium text-ink">{dict.mypage.loginRequired}</p>
        <Link
          href={`/${locale}/login`}
          className="inline-flex h-12 items-center rounded-[30px] bg-ink px-8 text-sm font-medium text-white"
        >
          {dict.auth.login}
        </Link>
      </main>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.mypage.title}</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.mypage.empty}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-3 border border-hairline p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-base font-medium text-ink">{order.order_number}</span>
                <span className="text-sm font-medium text-mute">
                  {dict.orderStatus[order.status] ?? order.status}
                </span>
              </div>

              {order.status === "pending" && (
                <p className="text-xs font-medium text-mute">{dict.mypage.pendingNote}</p>
              )}

              <div className="flex flex-col gap-1 border-t border-hairline pt-3 text-sm">
                {order.items.map((item, i) => (
                  <p key={i} className="text-ink">
                    {item.name} {item.size ? `(${item.size})` : ""} × {item.qty}
                  </p>
                ))}
                <p className="mt-1 font-medium text-ink">
                  {dict.mypage.total} {formatPrice(order.subtotal, order.locale)}
                </p>
              </div>

              <div className="flex flex-col gap-1 border-t border-hairline pt-3 text-sm">
                <p className="text-ink">
                  <span className="text-mute">{dict.checkout.name} </span>
                  {order.customer_name}
                </p>
                <p className="text-ink">
                  <span className="text-mute">{dict.checkout.phone} </span>
                  {order.phone}
                </p>
                <p className="text-ink">
                  <span className="text-mute">{dict.checkout.address} </span>
                  {order.address}
                </p>
                {order.memo && (
                  <p className="text-ink">
                    <span className="text-mute">{dict.checkout.memo} </span>
                    {order.memo}
                  </p>
                )}
              </div>

              <p className="text-xs font-medium text-mute">
                {new Date(order.created_at).toLocaleString("ko-KR")}
              </p>

              <p className="border-t border-hairline pt-3 text-xs font-medium text-mute">
                {dict.mypage.changeAddressNote.replace("{orderNumber}", order.order_number)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
