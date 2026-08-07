import { NextResponse } from "next/server";
import { defaultLocale, locales } from "@/dictionaries";

// "/" 나 "/category/top" 처럼 언어 코드가 없는 주소로 들어오면
// 기본 언어(ko)를 붙여서 "/ko/category/top" 으로 보내줌
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|products|.*\\..*).*)"],
};
