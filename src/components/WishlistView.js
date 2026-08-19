"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { getProductsByIds } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

// 위시리스트에 담긴 상품들을 상품 카드 그리드로 보여줌 (localStorage 상태를 쓰는 클라이언트 컴포넌트)
export default function WishlistView({ dict, locale }) {
  const { ids } = useWishlist();
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!idsKey) {
      setWishlistedProducts([]);
      setIsLoaded(true);
      return;
    }
    setIsLoaded(false);
    const supabase = createClient();
    getProductsByIds(supabase, idsKey.split(",").map(Number)).then((fetched) => {
      setWishlistedProducts(fetched);
      setIsLoaded(true);
    });
  }, [idsKey]);

  if (!isLoaded) return null;

  if (wishlistedProducts.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 text-sm font-medium text-mute">{dict.wishlist.empty}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex h-12 items-center rounded-[30px] bg-ink px-6 text-sm font-medium text-white"
        >
          {dict.hero.cta}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.wishlist.title}</h1>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
        ))}
      </div>
    </main>
  );
}
