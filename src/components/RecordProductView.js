"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

// 화면에 아무것도 그리지 않고, 상품 페이지에 들어오면 "최근 본 상품" 목록에 기록만 함
export default function RecordProductView({ productId }) {
  const { addView } = useRecentlyViewed();

  useEffect(() => {
    addView(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return null;
}
