import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "mandahnar15@gmail.com";

// /admin/products 하위 전체(목록/등록/수정)를 관리자 계정으로만 제한
export default async function AdminProductsLayout({ children, params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-6 text-base font-medium text-ink">{dict.admin.adminOnly}</p>
        <Link
          href={`/${locale}/login`}
          className="inline-flex h-12 items-center rounded-[30px] bg-ink px-8 text-sm font-medium text-white"
        >
          {dict.admin.login}
        </Link>
      </main>
    );
  }

  return children;
}
