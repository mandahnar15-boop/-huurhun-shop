"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { bankAccount } from "@/data/bankAccount";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/currency";

function makeOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HH${random}`;
}

// 1단계: 배송 정보 입력 → 2단계: 계좌이체 안내 + "입금 완료" 확인
// 실제 결제 게이트웨이는 없고, 계좌이체 후 셀러가 수동으로 입금을 확인하는 방식
export default function CheckoutForm({ dict, locale }) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState("shipping");
  const [isConfirming, setIsConfirming] = useState(false);

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      const unitPrice = product.salePrice ?? product.price;
      return { ...item, product, unitPrice };
    })
    .filter(Boolean);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

  function handleShippingSubmit(event) {
    event.preventDefault();
    setStep("payment");
  }

  function handlePaymentConfirm() {
    setIsConfirming(true);

    const orderNumber = makeOrderNumber();
    clearCart();

    const query = new URLSearchParams({
      order: orderNumber,
      total: String(subtotal),
    });
    router.push(`/${locale}/order-complete?${query.toString()}`);
  }

  if (step === "payment") {
    return (
      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.checkout.bankTransfer.title}</h1>

        <div className="flex flex-col gap-3 border-y border-hairline py-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-mute">{dict.checkout.bankTransfer.bankName}</span>
            <span className="text-sm font-medium text-ink">{bankAccount.bankName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-mute">{dict.checkout.bankTransfer.accountNumber}</span>
            <span className="text-sm font-medium text-ink">{bankAccount.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-mute">{dict.checkout.bankTransfer.accountHolder}</span>
            <span className="text-sm font-medium text-ink">{bankAccount.accountHolder}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-mute">{dict.checkout.bankTransfer.amount}</span>
            <span className="text-base font-medium text-ink">{formatPrice(subtotal, locale)}</span>
          </div>
        </div>

        <p className="mt-6 text-sm font-medium text-mute">{dict.checkout.bankTransfer.instruction}</p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handlePaymentConfirm}
            disabled={isConfirming}
            className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dict.checkout.bankTransfer.confirm}
          </button>
          <button
            type="button"
            onClick={() => setStep("shipping")}
            className="h-12 w-full rounded-[30px] border border-hairline text-sm font-medium text-ink"
          >
            {dict.checkout.bankTransfer.back}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.checkout.title}</h1>

      <form onSubmit={handleShippingSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.name}</span>
            <input
              type="text"
              required
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.phone}</span>
            <input
              type="tel"
              required
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.address}</span>
            <input
              type="text"
              required
              placeholder={dict.checkout.addressPlaceholder}
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink placeholder:text-mute focus:border-ink focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.memo}</span>
            <input
              type="text"
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
            />
          </label>
        </div>

        <p className="border-t border-hairline pt-6 text-base font-medium text-ink">
          {dict.cart.subtotal} {formatPrice(subtotal, locale)}
        </p>

        <button
          type="submit"
          disabled={lines.length === 0}
          className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.checkout.next}
        </button>
      </form>
    </main>
  );
}
