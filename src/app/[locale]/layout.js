import { Bebas_Neue, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PrimaryNav from "@/components/PrimaryNav";
import UtilityBar from "@/components/UtilityBar";
import { getDictionary, locales } from "@/dictionaries";
import "../globals.css";

// 캠페인 헤드라인용 — Nike의 Futura ND 대체 폰트
const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

// 본문/버튼/네비 등 UI 전반에 쓰는 폰트 — Helvetica Now 대체 폰트
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "HUURHUN SHOP",
  description: "HUURHUN SHOP - Women's Fashion",
};

// /ko, /en 처럼 언어 코드가 붙은 모든 페이지의 진짜 최상위 레이아웃
// 유틸리티 바 + 메인 네비 + 푸터가 모든 페이지에 공통으로 나오게 여기서 감싸줌
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${bebasNeue.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans">
        <UtilityBar dict={dict} />
        <PrimaryNav locale={locale} dict={dict} />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
