import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { getDictionary } from "@/dictionaries";

function getProductsForSlug(slug) {
  if (slug === "new") return products.filter((p) => p.badge === "NEW");
  if (slug === "sale") return products.filter((p) => Boolean(p.salePrice));
  return products.filter((p) => p.type === slug);
}

export default async function CategoryPage({ params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  const label = dict.nav[slug];
  const filteredProducts = getProductsForSlug(slug);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <p className="mb-2 text-sm font-medium text-mute">
        <Link href={`/${locale}`} className="hover:text-ink">
          {dict.breadcrumbHome}
        </Link>{" "}
        / {label}
      </p>
      <h1 className="mb-8 text-[32px] font-medium text-ink">{label}</h1>

      {filteredProducts.length === 0 ? (
        <p className="text-sm font-medium text-mute">{dict.emptyCategory}</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </main>
  );
}
