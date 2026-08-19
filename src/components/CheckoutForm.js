"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bankAccount } from "@/data/bankAccount";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/currency";
import { localizeProduct } from "@/lib/localize";
import { getProductsByIds } from "@/lib/products";

function makeOrderNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `HH${random}`;
}

// 1단계: 배송 정보 입력 → 2단계: 계좌이체 안내 + "입금 완료" 확인
// 실제 결제 게이트웨이는 없고, 계좌이체 후 셀러가 수동으로 입금을 확인하는 방식
// "입금 완료했어요"를 누르면 Supabase orders 테이블에 주문이 저장됨
export default function CheckoutForm({ dict, locale }) {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState("shipping");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState({ name: "", phone: "", address: "", memo: "" });
  const [productsById, setProductsById] = useState({});
  const idsKey = [...new Set(items.map((item) => item.id))].join(",");

  useEffect(() => {
    if (!idsKey) {
      setProductsById({});
      return;
    }
    const supabase = createClient();
    getProductsByIds(supabase, idsKey.split(",").map(Number)).then((fetched) => {
      setProductsById(Object.fromEntries(fetched.map((p) => [p.id, p])));
    });
  }, [idsKey]);

  const lines = items
    .map((item) => {
      const product = productsById[item.id];
      if (!product) return null;
      const unitPrice = product.salePrice ?? product.price;
      return { ...item, product, unitPrice };
    })
    .filter(Boolean);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);

  function updateField(field, value) {
    setShipping((prev) => ({ ...prev, [field]: value }));
  }

  function handleShippingSubmit(event) {
    event.preventDefault();
    setStep("payment");
  }

  async function handlePaymentConfirm() {
    setIsConfirming(true);
    setError("");

    const orderNumber = makeOrderNumber();
    const orderItems = lines.map((line) => ({
      id: line.id,
      name: localizeProduct(line.product, locale).displayName,
      color: line.color,
      size: line.size,
      qty: line.qty,
      unitPrice: line.unitPrice,
    }));

    const supabase = createClient();
    const { error: insertError } = await supabase.from("orders").insert({
      order_number: orderNumber,
      customer_name: shipping.name,
      phone: shipping.phone,
      address: shipping.address,
      memo: shipping.memo || null,
      items: orderItems,
      subtotal,
      locale,
      user_id: user?.id ?? null,
    });

    if (insertError) {
      setIsConfirming(false);
      setError(dict.auth.error);
      return;
    }

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

        {error && <p className="mt-4 text-sm font-medium text-sale">{error}</p>}

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
              value={shipping.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.phone}</span>
            <input
              type="tel"
              required
              value={shipping.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.address}</span>
            <input
              type="text"
              required
              placeholder={dict.checkout.addressPlaceholder}
              value={shipping.address}
              onChange={(event) => updateField("address", event.target.value)}
              className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink placeholder:text-mute focus:border-ink focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{dict.checkout.memo}</span>
            <input
              type="text"
              value={shipping.memo}
              onChange={(event) => updateField("memo", event.target.value)}
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
