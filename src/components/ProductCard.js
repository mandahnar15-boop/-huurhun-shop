"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/currency";
import { localizeProduct } from "@/lib/localize";

// 상품 하나를 카드 형태로 보여주는 컴포넌트 (Nike 스타일: 각 없음, 그림자 없음)
// 클릭하면 상품 상세 페이지(/[locale]/product/[id])로 이동
export default function ProductCard({ product, locale, dict }) {
  const { id, price, salePrice, badge, image, emoji, swatches } = product;
  const { displayName, displayCategory } = localizeProduct(product, locale);
  const { isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(id);
  const isSale = Boolean(salePrice);
  const percentOff = isSale ? Math.round((1 - salePrice / price) * 100) : 0;

  function handleWishlistClick(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleItem(id);
  }

  return (
    <Link href={`/${locale}/product/${id}`} className="flex flex-col bg-canvas text-ink">
      {/* 상품 이미지 자리 — image가 있으면 실제 사진, 없으면 이모지로 대체 */}
      <div className="relative flex aspect-square items-center justify-center bg-soft-cloud text-6xl">
        {badge && (
          <span className="absolute left-0 top-0 z-10 rounded-[30px] border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-ink">
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={dict.wishlistLabel}
          className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={wishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4.5 4 8.5C19 16.65 12 21 12 21z" />
          </svg>
        </button>

        {image ? (
          <Image
            src={image}
            alt={displayName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          emoji
        )}
      </div>

      <div className="flex flex-col gap-2 pt-3">
        {/* 컬러 스와치 */}
        <div className="flex gap-1.5">
          {swatches.map((color, i) => (
            <span
              key={color + i}
              className="h-3 w-3 rounded-full ring-1 ring-hairline"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <p className="text-base font-medium text-ink">{displayName}</p>
        <p className="text-sm font-medium text-mute">{displayCategory}</p>

        {isSale ? (
          <p className="text-base font-medium">
            <span className="text-sale">{formatPrice(salePrice, locale)}</span>{" "}
            <span className="text-mute line-through">{formatPrice(price, locale)}</span>{" "}
            <span className="text-sale">{percentOff}{dict.product.percentOffSuffix}</span>
          </p>
        ) : (
          <p className="text-base font-medium text-ink">
            {formatPrice(price, locale)}
          </p>
        )}
      </div>
    </Link>
  );
}
