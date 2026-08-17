import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { getDictionary } from "@/dictionaries";
import { formatPrice } from "@/lib/currency";

export default async function OrderCompletePage({ params, searchParams }) {
  const { locale } = await params;
  const { order, total } = await searchParams;
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-2xl text-white">
        ✓
      </div>

      <h1 className="mb-3 text-[32px] font-medium text-ink">{dict.orderComplete.title}</h1>
      <p className="mb-8 text-sm font-medium text-mute">{dict.orderComplete.message}</p>

      <div className="mb-10 flex w-full flex-col gap-3 border-y border-hairline py-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mute">{dict.orderComplete.orderNumber}</span>
          <CopyButton text={order} dict={dict} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mute">{dict.orderComplete.total}</span>
          <span className="text-sm font-medium text-ink">
            {formatPrice(Number(total || 0), locale)}
          </span>
        </div>
      </div>

      <Link
        href={`/${locale}`}
        className="inline-flex h-12 items-center rounded-[30px] bg-ink px-8 text-sm font-medium text-white"
      >
        {dict.orderComplete.continueShopping}
      </Link>
    </main>
  );
}
