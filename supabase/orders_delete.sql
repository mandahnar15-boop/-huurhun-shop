-- 관리자 페이지에서 주문을 삭제할 수 있도록 delete 권한 추가.
-- Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 그대로 실행하세요. 여러 번 실행해도 안전합니다.

drop policy if exists "Admin can delete orders" on public.orders;
create policy "Admin can delete orders"
  on public.orders for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'mandahnar15@gmail.com');
