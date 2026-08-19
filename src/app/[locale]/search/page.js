import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/dictionaries";
import { localizeProduct } from "@/lib/localize";
import { getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export default async function SearchPage({ params, searchParams }) {
  const { locale } = await params;
  const { q } = await searchParams;
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">
        {dict.search.resultsFor} &ldquo;{q}&rdquo;
      </h1>

      {results.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.search.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </main>
  );
}
