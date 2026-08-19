-- 품절 상품 표시 기능을 위한 컬럼 추가.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 그대로 실행하세요. 여러 번 실행해도 안전합니다.

alter table public.products add column if not exists is_sold_out boolean not null default false;
