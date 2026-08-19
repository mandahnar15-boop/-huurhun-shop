import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { categories } from "@/data/categories";
import { getDictionary } from "@/dictionaries";
import { getProducts, getReviewCounts, sortProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

function getProductsForSlug(category, products) {
  if (category.slug === "new") return products.filter((p) => p.badge === "NEW");
  if (category.slug === "sale") return products.filter((p) => Boolean(p.salePrice));
  // types가 있는 상위 카테고리는 그 안에 속한 하위 type들을 전부 모아서 보여줌
  const matchTypes = category.types ?? [category.slug];
  return products.filter((p) => matchTypes.includes(p.type));
}

export default async function CategoryPage({ params, searchParams }) {
  const { locale, slug } = await params;
  const { sort } = await searchParams;
  const dict = getDictionary(locale);
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const supabase = await createClient();
  const products = await getProducts(supabase);
  const label = dict.nav[slug];
  const filteredProducts = getProductsForSlug(category, products);

  const popularityMap =
    sort === "popular" ? await getReviewCounts(supabase, filteredProducts.map((p) => p.id)) : {};
  const sortedProducts = sortProducts(filteredProducts, sort ?? "newest", popularityMap);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <p className="mb-2 text-sm font-medium text-mute">
        <Link href={`/${locale}`} className="hover:text-ink">
          {dict.breadcrumbHome}
        </Link>{" "}
        / {label}
      </p>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-medium text-ink">{label}</h1>
        {sortedProducts.length > 0 && <SortSelect dict={dict} />}
      </div>

      {sortedProducts.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.emptyCategory}</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </main>
  );
}
