"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "mandahnar15@gmail.com";

// 최상단 얇은 유틸리티 바 — 매장/고객센터 링크 + 로그인 상태에 따른 회원가입/로그인/로그아웃
export default function UtilityBar({ dict, locale }) {
  const { user, isLoaded, signOut } = useAuth();

  return (
    <div className="hidden h-9 items-center justify-end gap-6 bg-soft-cloud px-6 text-xs font-medium text-ink sm:flex">
      {dict.utilityLinks.map((link) => (
        <a key={link} href="#" className="hover:underline">
          {link}
        </a>
      ))}

      {isLoaded && (
        <>
          {user ? (
            <>
              {user.email === ADMIN_EMAIL && (
                <Link href={`/${locale}/admin`} className="hover:underline">
                  주문 관리
                </Link>
              )}
              <Link href={`/${locale}/mypage`} className="hover:underline">
                {dict.mypage.title}
              </Link>
              <span>
                {dict.auth.greetingPrefix}, {user.email}
              </span>
              <button type="button" onClick={() => signOut()} className="hover:underline">
                {dict.auth.logout}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/signup`} className="hover:underline">
                {dict.auth.signup}
              </Link>
              <Link href={`/${locale}/login`} className="hover:underline">
                {dict.auth.login}
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}
