"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "huurhun-cart";

function readStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 장바구니 상태를 앱 전체에서 쓸 수 있게 해주는 컨텍스트
// 아직 로그인/DB가 없어서 이 브라우저의 localStorage에만 저장됨
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  function addItem(id, color, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id && item.color === color);
      if (existing) {
        return prev.map((item) =>
          item.id === id && item.color === color ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { id, color, qty }];
    });
  }

  function updateQty(id, color, qty) {
    setItems((prev) => {
      if (qty < 1) return prev.filter((item) => !(item.id === id && item.color === color));
      return prev.map((item) => (item.id === id && item.color === color ? { ...item, qty } : item));
    });
  }

  function removeItem(id, color) {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.color === color)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
