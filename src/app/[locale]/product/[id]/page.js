import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { getDictionary } from "@/dictionaries";

export default async function ProductPage({ params }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const product = products.find((p) => p.id === Number(id));

  if (!product) notFound();

  const { name, nameEn, category, categoryEn, price, salePrice, image, emoji, swatches, type } = product;
  const displayName = locale === "en" ? nameEn : name;
  const displayCategory = locale === "en" ? categoryEn : category;
  const isSale = Boolean(salePrice);
  const percentOff = isSale ? Math.round((1 - salePrice / price) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <p className="mb-6 text-sm font-medium text-mute">
        <Link href={`/${locale}`} className="hover:text-ink">
          {dict.breadcrumbHome}
        </Link>{" "}
        /{" "}
        <Link href={`/${locale}/category/${type}`} className="hover:text-ink">
          {displayCategory}
        </Link>{" "}
        / {displayName}
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* 상품 이미지 자리 — image가 있으면 실제 사진, 없으면 이모지로 대체 */}
        <div className="relative flex aspect-square items-center justify-center bg-soft-cloud text-[120px]">
          {image ? (
            <Image
              src={image}
              alt={displayName}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            emoji
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-mute">{displayCategory}</p>
            <h1 className="text-[32px] font-medium leading-tight text-ink">{displayName}</h1>

            {isSale ? (
              <p className="text-2xl font-medium">
                <span className="text-sale">{salePrice.toLocaleString("ko-KR")}원</span>{" "}
                <span className="text-mute line-through">{price.toLocaleString("ko-KR")}원</span>{" "}
                <span className="text-sale">{percentOff}{dict.product.percentOffSuffix}</span>
              </p>
            ) : (
              <p className="text-2xl font-medium text-ink">
                {price.toLocaleString("ko-KR")}원
              </p>
            )}
          </div>

          {/* 컬러 스와치 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-ink">{dict.product.color}</p>
            <div className="flex gap-2">
              {swatches.map((color, i) => (
                <span
                  key={color + i}
                  className="h-5 w-5 rounded-full ring-1 ring-hairline"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white">
            {dict.product.addToCart}
          </button>

          {/* 상세 정보 아코디언 */}
          <div className="border-t border-hairline">
            {dict.disclosures.map((item) => (
              <details key={item.title} className="border-b border-hairline py-6">
                <summary className="cursor-pointer text-base font-medium text-ink">
                  {item.title}
                </summary>
                <p className="mt-3 text-sm font-medium text-mute">{item.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
