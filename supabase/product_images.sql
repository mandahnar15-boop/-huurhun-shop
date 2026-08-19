-- 상품 사진을 1장이 아니라 여러 장 등록할 수 있도록 image(단일) 컬럼을 images(배열) 컬럼으로 교체.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 그대로 실행하세요. 여러 번 실행해도 안전합니다.

alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;

-- 기존에 image 컬럼에 있던 사진 1장을 images 배열로 옮겨줌
update public.products
set images = jsonb_build_array(image)
where image is not null and images = '[]'::jsonb;

alter table public.products drop column if exists image;
