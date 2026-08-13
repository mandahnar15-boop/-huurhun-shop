"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/currency";
import { localizeProduct } from "@/lib/localize";

// 장바구니에 담긴 상품 목록 + 수량 조절 + 삭제 + 합계 (localStorage 상태를 쓰는 클라이언트 컴포넌트)
export default function CartView({ dict, locale }) {
  const { items, updateQty, removeItem } = useCart();

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      const unitPrice = product.salePrice ?? product.price;
      return { ...item, product, unitPrice };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

  if (lines.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 text-sm font-medium text-mute">{dict.cart.empty}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex h-12 items-center rounded-[30px] bg-ink px-6 text-sm font-medium text-white"
        >
          {dict.hero.cta}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.cart.title}</h1>

      <div className="flex flex-col gap-6">
        {lines.map((line) => {
          const { displayName: name } = localizeProduct(line.product, locale);

          return (
            <div key={`${line.id}-${line.color}`} className="flex gap-4 border-b border-hairline pb-6">
              <div className="relative h-24 w-24 shrink-0 bg-soft-cloud">
                {line.product.image ? (
                  <Image src={line.product.image} alt={name} fill sizes="96px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">{line.product.emoji}</div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-medium text-ink">{name}</p>
                    <span
                      className="h-3 w-3 rounded-full ring-1 ring-hairline"
                      style={{ backgroundColor: line.color }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.id, line.color)}
                    className="text-sm font-medium text-mute hover:text-ink"
                  >
                    {dict.cart.remove}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-28 items-center justify-between rounded-[30px] border border-hairline px-3">
                    <button
                      type="button"
                      aria-label="-"
                      onClick={() => updateQty(line.id, line.color, line.qty - 1)}
                      className="text-ink"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-ink">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => updateQty(line.id, line.color, line.qty + 1)}
                      className="text-ink"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-base font-medium text-ink">
                    {formatPrice(line.unitPrice * line.qty, locale)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-end gap-3">
        <p className="text-lg font-medium text-ink">
          {dict.cart.subtotal} {formatPrice(subtotal, locale)}
        </p>
        <Link
          href={`/${locale}/checkout`}
          className="flex h-12 w-full max-w-xs items-center justify-center rounded-[30px] bg-ink text-sm font-medium text-white sm:w-auto sm:px-10"
        >
          {dict.cart.checkout}
        </Link>
      </div>
    </main>
  );
}
