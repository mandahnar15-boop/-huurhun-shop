"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "huurhun-wishlist";

function readStoredWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 위시리스트에 담긴 상품 id 목록 — 장바구니와 마찬가지로 이 브라우저의 localStorage에만 저장됨
export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIds(readStoredWishlist());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, isLoaded]);

  function toggleItem(id) {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function isWishlisted(id) {
    return ids.includes(id);
  }

  return (
    <WishlistContext.Provider value={{ ids, toggleItem, isWishlisted, totalCount: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
