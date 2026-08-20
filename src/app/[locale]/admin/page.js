import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/currency";
import { deleteOrder, updateOrderStatus } from "./actions";

const ADMIN_EMAIL = "mandahnar15@gmail.com";
const PENDING_ALERT_HOURS = 3;

const STATUS_COLOR = {
  pending: "text-sale",
  confirmed: "text-success",
  shipped: "text-ink",
  cancelled: "text-mute",
};

function getPendingHours(createdAt) {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}

// 관리자 전용 주문 목록 페이지 — mandahnar15@gmail.com 계정으로 로그인해야 보임
export default async function AdminPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 text-base font-medium text-ink">{dict.admin.adminOnly}</p>
        <Link
          href={`/${locale}/login`}
          className="inline-flex h-12 items-center rounded-[30px] bg-ink px-8 text-sm font-medium text-white"
        >
          {dict.admin.login}
        </Link>
      </main>
    );
  }

  const { data: fetchedOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // 오래 대기 중인 미확인 주문을 사장님이 놓치지 않도록 맨 위로 올림
  const orders = [...(fetchedOrders ?? [])].sort((a, b) => {
    const aDelayed = a.status === "pending" && getPendingHours(a.created_at) >= PENDING_ALERT_HOURS;
    const bDelayed = b.status === "pending" && getPendingHours(b.created_at) >= PENDING_ALERT_HOURS;
    if (aDelayed === bDelayed) return 0;
    return aDelayed ? -1 : 1;
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center gap-6">
        <h1 className="text-[32px] font-medium text-ink">{dict.admin.ordersNav}</h1>
        <Link href={`/${locale}/admin/products`} className="text-sm font-medium text-mute hover:text-ink">
          {dict.admin.productsNav}
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.admin.noOrders}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const pendingHours = order.status === "pending" ? getPendingHours(order.created_at) : 0;
            const isDelayed = pendingHours >= PENDING_ALERT_HOURS;

            return (
            <div
              key={order.id}
              className={`flex flex-col gap-4 border p-5 ${isDelayed ? "border-sale" : "border-hairline"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-ink">{order.order_number}</span>
                  <span className={`text-sm font-medium ${STATUS_COLOR[order.status]}`}>
                    {dict.orderStatus[order.status] ?? order.status}
                  </span>
                  {isDelayed && (
                    <span className="rounded-[30px] bg-sale px-3 py-1 text-xs font-medium text-white">
                      {dict.admin.pendingAlert.replace("{hours}", Math.floor(pendingHours))}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-mute">
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm font-medium sm:grid-cols-2">
                <p className="text-ink">
                  <span className="text-mute">{dict.admin.name} </span>
                  {order.customer_name}
                </p>
                <p className="text-ink">
                  <span className="text-mute">{dict.admin.phone} </span>
                  {order.phone}
                </p>
                <p className="text-ink sm:col-span-2">
                  <span className="text-mute">{dict.admin.address} </span>
                  {order.address}
                </p>
                {order.memo && (
                  <p className="text-ink sm:col-span-2">
                    <span className="text-mute">{dict.admin.memo} </span>
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
                  {dict.admin.total} {formatPrice(order.subtotal, order.locale)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <form action={updateOrderStatus.bind(null, order.id, "confirmed", locale)}>
                    <button
                      type="submit"
                      className="h-9 rounded-[30px] bg-ink px-4 text-xs font-medium text-white"
                    >
                      {dict.admin.confirmPayment}
                    </button>
                  </form>
                )}
                {order.status === "confirmed" && (
                  <form action={updateOrderStatus.bind(null, order.id, "shipped", locale)}>
                    <button
                      type="submit"
                      className="h-9 rounded-[30px] bg-ink px-4 text-xs font-medium text-white"
                    >
                      {dict.admin.startShipping}
                    </button>
                  </form>
                )}
                {order.status !== "cancelled" && order.status !== "shipped" && (
                  <form action={updateOrderStatus.bind(null, order.id, "cancelled", locale)}>
                    <button
                      type="submit"
                      className="h-9 rounded-[30px] border border-hairline px-4 text-xs font-medium text-ink"
                    >
                      {dict.admin.cancelOrder}
                    </button>
                  </form>
                )}
                <form action={deleteOrder.bind(null, order.id, locale)}>
                  <button
                    type="submit"
                    className="h-9 rounded-[30px] border border-hairline px-4 text-xs font-medium text-sale"
                  >
                    {dict.admin.delete}
                  </button>
                </form>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
