"use client";

import { createContext, useContext, useEffect, useState } from "react";

const RecentlyViewedContext = createContext(null);
const STORAGE_KEY = "huurhun-recently-viewed";
const MAX_ITEMS = 10;

function readStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 최근 본 상품 id 목록(최신순)을 localStorage에 보관 — 로그인/DB 없이 이 브라우저에서만 유지됨
// 상품 페이지가 마운트되자마자 addView를 호출하므로, 별도의 "로드 완료" effect를 두면
// 그 effect가 나중에 실행되면서 방금 기록한 값을 빈 배열로 덮어쓰는 경합이 생김 —
// 그래서 useState 지연 초기화로 처음 렌더부터 localStorage 값을 곧장 사용함
export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useState(readStored);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  function addView(id) {
    setIds((prev) => [id, ...prev.filter((existing) => existing !== id)].slice(0, MAX_ITEMS));
  }

  return (
    <RecentlyViewedContext.Provider value={{ ids, addView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
