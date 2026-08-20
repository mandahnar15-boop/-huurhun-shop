"use client";

import { useEffect, useState } from "react";
import ProductStrip from "@/components/ProductStrip";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { getProductsByIds } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

// 현재 보고 있는 상품(excludeId)을 뺀 최근 본 상품 목록을 불러와서 보여줌
export default function RecentlyViewedSection({ excludeId, dict, locale }) {
  const { ids } = useRecentlyViewed();
  const [products, setProducts] = useState([]);
  const otherIds = ids.filter((id) => id !== excludeId).slice(0, 4);
  const idsKey = otherIds.join(",");

  useEffect(() => {
    if (!idsKey) {
      setProducts([]);
      return;
    }
    const order = idsKey.split(",").map(Number);
    const supabase = createClient();
    getProductsByIds(supabase, order).then((fetched) => {
      // 최근 본 순서 그대로 정렬 (fetch 결과는 순서가 보장되지 않음)
      const sorted = order.map((id) => fetched.find((p) => p.id === id)).filter(Boolean);
      setProducts(sorted);
    });
  }, [idsKey]);

  return <ProductStrip title={dict.product.recentlyViewed} products={products} locale={locale} dict={dict} />;
}
