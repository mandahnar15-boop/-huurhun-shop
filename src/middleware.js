import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { defaultLocale, locales } from "@/dictionaries";

// "/" 나 "/category/top" 처럼 언어 코드가 없는 주소로 들어오면
// 기본 언어(ko)를 붙여서 "/ko/category/top" 으로 보내주고,
// 언어 코드가 있는 요청은 Supabase 로그인 세션을 최신 상태로 갱신해줌
export async function middleware(request) {
  const { pathname, search } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 만료된 세션이면 여기서 자동으로 갱신됨
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|products|.*\\..*).*)"],
};
