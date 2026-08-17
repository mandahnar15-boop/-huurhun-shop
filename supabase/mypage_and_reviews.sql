-- 마이페이지(내 주문 조회) + 상품 리뷰 기능용 테이블/정책
-- Supabase 대시보드 → SQL Editor 에서 실행하세요. 여러 번 실행해도 안전합니다.

-- 1) 주문에 로그인한 회원을 연결 (비회원 주문도 가능하도록 nullable)
alter table public.orders add column if not exists user_id uuid references auth.users(id);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- 2) 상품 리뷰
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id integer not null,
  user_id uuid not null references auth.users(id),
  user_email text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table public.reviews enable row level security;

-- 리뷰는 누구나 볼 수 있음
drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews for select
  to anon, authenticated
  using (true);

-- 로그인한 사람만 자기 이름으로 리뷰 작성 가능
drop policy if exists "Users can create own review" on public.reviews;
create policy "Users can create own review"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 본인 리뷰만 삭제 가능
drop policy if exists "Users can delete own review" on public.reviews;
create policy "Users can delete own review"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);
