import Image from "next/image";
import Link from "next/link";

// 상품 하나를 카드 형태로 보여주는 컴포넌트 (Nike 스타일: 각 없음, 그림자 없음)
// 클릭하면 상품 상세 페이지(/[locale]/product/[id])로 이동
export default function ProductCard({ product, locale, dict }) {
  const { id, name, nameEn, category, categoryEn, price, salePrice, badge, image, emoji, swatches } = product;
  const displayName = locale === "en" ? nameEn : name;
  const displayCategory = locale === "en" ? categoryEn : category;
  const isSale = Boolean(salePrice);
  const percentOff = isSale ? Math.round((1 - salePrice / price) * 100) : 0;

  return (
    <Link href={`/${locale}/product/${id}`} className="flex flex-col bg-canvas text-ink">
      {/* 상품 이미지 자리 — image가 있으면 실제 사진, 없으면 이모지로 대체 */}
      <div className="relative flex aspect-square items-center justify-center bg-soft-cloud text-6xl">
        {badge && (
          <span className="absolute left-0 top-0 z-10 rounded-[30px] border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-ink">
            {badge}
          </span>
        )}
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
            <span className="text-sale">{salePrice.toLocaleString("ko-KR")}원</span>{" "}
            <span className="text-mute line-through">{price.toLocaleString("ko-KR")}원</span>{" "}
            <span className="text-sale">{percentOff}{dict.product.percentOffSuffix}</span>
          </p>
        ) : (
          <p className="text-base font-medium text-ink">
            {price.toLocaleString("ko-KR")}원
          </p>
        )}
      </div>
    </Link>
  );
}
