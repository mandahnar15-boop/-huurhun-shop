import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/dictionaries";
import { getProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();
  const products = await getProducts(supabase);

  return (
    <>
      <Hero dict={dict} />

      <main id="products" className="mx-auto w-full max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-[32px] font-medium text-ink">{dict.home.heading}</h2>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      </main>
    </>
  );
}
