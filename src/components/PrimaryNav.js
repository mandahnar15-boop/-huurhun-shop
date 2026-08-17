"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { locales } from "@/dictionaries";

const localeLabels = { ko: "한국어", en: "EN", mn: "MN" };

// 메인 네비게이션 — 로고, 카테고리 링크, 검색창, 위시리스트/장바구니 아이콘, 언어 전환
// 좁은 화면에서는 카테고리가 햄버거 버튼 → 왼쪽에서 슬라이드되는 드로어로 들어감
export default function PrimaryNav({ locale, dict }) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 지금 페이지의 언어 부분만 바꿔서 같은 페이지의 다른 언어 버전으로 이동
  function handleLocaleChange(event) {
    const nextLocale = event.target.value;
    const nextPath = pathname.replace(/^\/(ko|en|mn)/, `/${nextLocale}`);
    router.push(nextPath);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsMenuOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <nav className="border-b border-hairline-soft bg-canvas">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {/* 햄버거 버튼 — 모바일에서만 보임 */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href={`/${locale}`} className="font-display text-2xl uppercase tracking-wide text-ink">
            HUURHUN SHOP
          </Link>
        </div>

        <div className="flex items-center gap-3">
        {/* 언어 전환 */}
        <select
          aria-label="Language"
          value={locale}
          onChange={handleLocaleChange}
          className="cursor-pointer bg-transparent text-sm font-medium text-mute hover:text-ink focus:outline-none"
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {localeLabels[l]}
            </option>
          ))}
        </select>

        {/* 검색 필 */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden h-10 items-center gap-2 rounded-[24px] bg-soft-cloud px-4 sm:flex"
        >
          <button type="submit" aria-label={dict.searchPlaceholder} className="text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-24 bg-transparent text-sm text-ink placeholder:text-mute focus:outline-none"
          />
        </form>

        {/* 위시리스트 */}
        <Link
          href={`/${locale}/wishlist`}
          aria-label={dict.wishlistLabel}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4.5 4 8.5C19 16.65 12 21 12 21z" />
          </svg>
          {wishlistCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-white">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* 장바구니 */}
        <Link
          href={`/${locale}/cart`}
          aria-label={dict.cartLabel}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {totalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-white">
              {totalCount}
            </span>
          )}
        </Link>
        </div>
      </div>

      {/* 카테고리 줄 — 데스크톱에서만, 항목이 많아서 가로 스크롤 */}
      <ul className="hidden items-center gap-6 overflow-x-auto whitespace-nowrap border-t border-hairline-soft px-6 py-2 text-sm font-medium md:flex">
        {categories.map(({ slug }) => {
          const href = `/${locale}/category/${slug}`;
          const isActive = pathname === href;
          const label = dict.nav[slug];

          return (
            <li key={slug} className="shrink-0">
              <Link
                href={href}
                className={
                  isActive
                    ? "border-b-2 border-ink pb-1 text-ink"
                    : slug === "sale"
                      ? "text-sale hover:text-sale-deep"
                      : "text-ink hover:text-mute"
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 모바일 드로어 — 뒷배경 */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* 모바일 드로어 — 카테고리 + 검색 + 언어 */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[80vw] flex-col gap-8 bg-canvas px-6 py-6 transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xl uppercase tracking-wide text-ink">HUURHUN SHOP</span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex h-10 items-center gap-2 rounded-[24px] bg-soft-cloud px-4"
        >
          <button type="submit" aria-label={dict.searchPlaceholder} className="text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.searchPlaceholder}
            className="w-full bg-transparent text-sm text-ink placeholder:text-mute focus:outline-none"
          />
        </form>

        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto text-base font-medium">
          {categories.map(({ slug }) => {
            const href = `/${locale}/category/${slug}`;
            const isActive = pathname === href;
            const label = dict.nav[slug];

            return (
              <li key={slug}>
                <Link
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2.5 ${
                    isActive
                      ? "text-ink"
                      : slug === "sale"
                        ? "text-sale"
                        : "text-ink"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-hairline pt-6">
          <select
            aria-label="Language"
            value={locale}
            onChange={handleLocaleChange}
            className="w-full cursor-pointer bg-transparent text-sm font-medium text-ink focus:outline-none"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeLabels[l]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
