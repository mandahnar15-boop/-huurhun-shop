"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// 컬러 선택 + 수량 조절 + 장바구니 담기/바로 구매 버튼 (클릭 상태가 필요해서 클라이언트 컴포넌트)
export default function ProductActions({ product, dict, locale }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [selectedColor, setSelectedColor] = useState(product.swatches[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product.id, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product.id, selectedColor, qty);
    router.push(`/${locale}/checkout`);
  }

  return (
    <>
      {/* 컬러 스와치 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">{dict.product.color}</p>
        <div className="flex gap-2">
          {product.swatches.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              onClick={() => setSelectedColor(color)}
              className="h-7 w-7 rounded-full ring-1 ring-hairline outline outline-2 outline-offset-2"
              style={{
                backgroundColor: color,
                outlineColor: selectedColor === color ? "var(--color-ink)" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* 수량 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">{dict.product.quantity}</p>
        <div className="flex h-12 w-32 items-center justify-between rounded-[30px] border border-hairline px-4">
          <button
            type="button"
            aria-label="-"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="text-lg text-ink"
          >
            −
          </button>
          <span className="text-sm font-medium text-ink">{qty}</span>
          <button
            type="button"
            aria-label="+"
            onClick={() => setQty((q) => q + 1)}
            className="text-lg text-ink"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="h-12 flex-1 rounded-[30px] border border-ink text-sm font-medium text-ink"
        >
          {added ? dict.product.added : dict.product.addToCart}
        </button>

        <button
          type="button"
          onClick={() => toggleItem(product.id)}
          aria-label={dict.wishlistLabel}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-hairline text-ink"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4.5 4 8.5C19 16.65 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={handleBuyNow}
        className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white"
      >
        {dict.product.buyNow}
      </button>
    </>
  );
}
