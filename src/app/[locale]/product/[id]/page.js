import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import ReviewSection from "@/components/ReviewSection";
import { getDictionary } from "@/dictionaries";
import { formatPrice } from "@/lib/currency";
import { localizeProduct } from "@/lib/localize";
import { getProductById } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export default async function ProductPage({ params }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();
  const product = await getProductById(supabase, Number(id));

  if (!product) notFound();

  const { price, salePrice, images, emoji, type } = product;
  const { displayName, displayCategory } = localizeProduct(product, locale);
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
        <ProductGallery images={images} alt={displayName} emoji={emoji} />

        {/* 상품 정보 */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-mute">{displayCategory}</p>
            <h1 className="text-[32px] font-medium leading-tight text-ink">{displayName}</h1>

            {isSale ? (
              <p className="text-2xl font-medium">
                <span className="text-sale">{formatPrice(salePrice, locale)}</span>{" "}
                <span className="text-mute line-through">{formatPrice(price, locale)}</span>{" "}
                <span className="text-sale">{percentOff}{dict.product.percentOffSuffix}</span>
              </p>
            ) : (
              <p className="text-2xl font-medium text-ink">
                {formatPrice(price, locale)}
              </p>
            )}

            {product.isSoldOut && (
              <span className="inline-flex w-fit rounded-[30px] bg-ink px-3 py-1 text-xs font-medium text-white">
                {dict.product.soldOut}
              </span>
            )}
          </div>

          <ProductActions product={product} dict={dict} locale={locale} />

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

          <ReviewSection productId={product.id} dict={dict} />
        </div>
      </div>
    </main>
  );
}
