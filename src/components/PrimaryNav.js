"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

// 메인 네비게이션 — 로고, 카테고리 링크, 검색창, 위시리스트/장바구니 아이콘, 언어 전환
export default function PrimaryNav({ locale, dict }) {
  const pathname = usePathname();
  const otherLocale = locale === "ko" ? "en" : "ko";
  // 지금 페이지의 언어 부분만 바꿔서 같은 페이지의 다른 언어 버전으로 이동
  const otherLocalePath = pathname.replace(/^\/(ko|en)/, `/${otherLocale}`);

  return (
    <nav className="flex h-14 items-center justify-between border-b border-hairline-soft bg-canvas px-6">
      <Link href={`/${locale}`} className="font-display text-2xl uppercase tracking-wide text-ink">
        HUURHUN SHOP
      </Link>

      <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
        {categories.map(({ slug }) => {
          const href = `/${locale}/category/${slug}`;
          const isActive = pathname === href;
          const label = dict.nav[slug];

          return (
            <li key={slug}>
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

      <div className="flex items-center gap-3">
        {/* 언어 전환 */}
        <Link
          href={otherLocalePath}
          className="text-sm font-medium text-mute hover:text-ink"
        >
          {otherLocale === "ko" ? "한국어" : "EN"}
        </Link>

        {/* 검색 필 */}
        <div className="hidden h-10 items-center gap-2 rounded-[24px] bg-soft-cloud px-4 sm:flex">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={dict.searchPlaceholder}
            className="w-24 bg-transparent text-sm text-ink placeholder:text-mute focus:outline-none"
          />
        </div>

        {/* 위시리스트 */}
        <button
          aria-label={dict.wishlistLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4.5 4 8.5C19 16.65 12 21 12 21z" />
          </svg>
        </button>

        {/* 장바구니 */}
        <button
          aria-label={dict.cartLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-cloud text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
