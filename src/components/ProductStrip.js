import ProductCard from "@/components/ProductCard";

// "최근 본 상품" / "함께 구매하면 좋은 상품" 처럼 제목 + 작은 그리드로 상품을 보여주는 섹션
// products가 비어있으면 아무것도 렌더링하지 않음
export default function ProductStrip({ title, products, locale, dict }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <h2 className="mb-6 text-xl font-medium text-ink">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
        ))}
      </div>
    </section>
  );
}
