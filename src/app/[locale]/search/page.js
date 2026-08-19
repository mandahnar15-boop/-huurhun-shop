import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { getDictionary } from "@/dictionaries";
import { localizeProduct } from "@/lib/localize";
import { getProducts, getReviewCounts, sortProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export default async function SearchPage({ params, searchParams }) {
  const { locale } = await params;
  const { q, sort } = await searchParams;
  const dict = getDictionary(locale);
  const query = (q ?? "").trim().toLowerCase();
  const supabase = await createClient();
  const products = query ? await getProducts(supabase) : [];

  const results = query
    ? products.filter((product) => {
        const { displayName, displayCategory } = localizeProduct(product, locale);
        return (
          displayName.toLowerCase().includes(query) ||
          displayCategory.toLowerCase().includes(query)
        );
      })
    : [];

  const popularityMap =
    sort === "popular" ? await getReviewCounts(supabase, results.map((p) => p.id)) : {};
  const sortedResults = sortProducts(results, sort ?? "newest", popularityMap);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-medium text-ink">
          {dict.search.resultsFor} &ldquo;{q}&rdquo;
        </h1>
        {sortedResults.length > 0 && <SortSelect dict={dict} />}
      </div>

      {sortedResults.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.search.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sortedResults.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </main>
  );
}
