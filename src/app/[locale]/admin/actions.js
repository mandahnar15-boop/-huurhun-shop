"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// 관리자 계정만 주문 상태를 바꿀 수 있음 (DB의 RLS 정책이 실제 보안 경계, 여기선 한 번 더 확인)
const ADMIN_EMAIL = "mandahnar15@gmail.com";

export async function updateOrderStatus(orderId, status, locale) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath(`/${locale}/admin`);
}

export async function deleteOrder(orderId, locale) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  await supabase.from("orders").delete().eq("id", orderId);
  revalidatePath(`/${locale}/admin`);
}
