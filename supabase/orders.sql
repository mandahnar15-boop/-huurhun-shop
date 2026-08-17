-- 주문 저장용 테이블. Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 그대로 실행하세요.
-- 여러 번 실행해도 안전하게 처리됩니다.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  memo text,
  items jsonb not null,
  subtotal integer not null,
  locale text not null default 'ko',
  status text not null default 'pending', -- pending | confirmed | shipped | cancelled
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- 손님(로그인 안 해도 됨)이 주문을 새로 만드는 건 누구나 가능
drop policy if exists "Anyone can create an order" on public.orders;
create policy "Anyone can create an order"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- 관리자 계정만 전체 주문 목록을 볼 수 있음
drop policy if exists "Admin can view all orders" on public.orders;
create policy "Admin can view all orders"
  on public.orders for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'mandahnar15@gmail.com');

-- 관리자 계정만 주문 상태(입금확인/배송 등)를 바꿀 수 있음
drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
  on public.orders for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'mandahnar15@gmail.com')
  with check (auth.jwt() ->> 'email' = 'mandahnar15@gmail.com');
