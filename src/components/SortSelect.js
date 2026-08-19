"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 정렬 드롭다운 — 선택하면 현재 URL의 ?sort= 쿼리만 바꿔서 서버 컴포넌트가 다시 정렬해서 내려줌
export default function SortSelect({ dict }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  function handleChange(event) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", event.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      aria-label={dict.sort.newest}
      value={currentSort}
      onChange={handleChange}
      className="cursor-pointer bg-transparent text-sm font-medium text-mute hover:text-ink focus:outline-none"
    >
      <option value="newest">{dict.sort.newest}</option>
      <option value="priceAsc">{dict.sort.priceAsc}</option>
      <option value="priceDesc">{dict.sort.priceDesc}</option>
      <option value="popular">{dict.sort.popular}</option>
    </select>
  );
}
