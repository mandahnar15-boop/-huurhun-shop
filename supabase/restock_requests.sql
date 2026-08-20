-- 품절 상품 "재입고 알림 신청" 기능용 테이블.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 그대로 실행하세요. 여러 번 실행해도 안전합니다.

create table if not exists public.restock_requests (
  id uuid primary key default gen_random_uuid(),
  product_id bigint not null references public.products(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.restock_requests enable row level security;

-- 누구나(로그인 안 해도) 재입고 알림을 신청할 수 있음
drop policy if exists "Anyone can request restock notification" on public.restock_requests;
create policy "Anyone can request restock notification"
  on public.restock_requests for insert
  to anon, authenticated
  with check (true);

-- 관리자 계정만 신청자 목록을 볼 수 있음
drop policy if exists "Admin can view restock requests" on public.restock_requests;
create policy "Admin can view restock requests"
  on public.restock_requests for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'mandahnar15@gmail.com');

-- 연락을 마친 신청 건은 관리자가 지울 수 있음
drop policy if exists "Admin can delete restock requests" on public.restock_requests;
create policy "Admin can delete restock requests"
  on public.restock_requests for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'mandahnar15@gmail.com');
