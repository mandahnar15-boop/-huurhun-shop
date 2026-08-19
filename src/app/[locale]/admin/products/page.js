import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { formatPrice } from "@/lib/currency";
import { localizeProduct } from "@/lib/localize";
import { getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "./actions";

// 관리자 전용 상품 목록 페이지 — 등록/수정/삭제
export default async function AdminProductsPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();
  const products = await getProducts(supabase);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-[32px] font-medium text-ink">{dict.admin.productsNav}</h1>
          <Link href={`/${locale}/admin`} className="text-sm font-medium text-mute hover:text-ink">
            {dict.admin.ordersNav}
          </Link>
        </div>
        <Link
          href={`/${locale}/admin/products/new`}
          className="inline-flex h-11 items-center rounded-[30px] bg-ink px-6 text-sm font-medium text-white"
        >
          {dict.admin.addProduct}
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.admin.noProducts}</p>
      ) : (
        <div className="flex flex-col">
          {products.map((product) => {
            const { displayName, displayCategory } = localizeProduct(product, locale);
            return (
              <div key={product.id} className="flex flex-wrap items-center gap-4 border-b border-hairline py-4">
                <div className="relative h-16 w-16 shrink-0 bg-soft-cloud">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={displayName} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">{product.emoji}</div>
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-medium text-ink">{displayName}</p>
                  <p className="text-xs font-medium text-mute">
                    {displayCategory} · {formatPrice(product.salePrice ?? product.price, locale)}
                  </p>
                </div>

                <Link
                  href={`/${locale}/admin/products/${product.id}`}
                  className="flex h-9 items-center rounded-[30px] border border-hairline px-4 text-xs font-medium text-ink"
                >
                  {dict.admin.edit}
                </Link>

                <form action={deleteProduct.bind(null, product.id, locale)}>
                  <button
                    type="submit"
                    className="h-9 rounded-[30px] border border-hairline px-4 text-xs font-medium text-sale"
                  >
                    {dict.admin.delete}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
