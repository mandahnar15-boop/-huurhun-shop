"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ko from "@/dictionaries/ko";
import en from "@/dictionaries/en";
import mn from "@/dictionaries/mn";

// 관리자 계정만 상품을 등록/수정/삭제할 수 있음 (DB의 RLS 정책이 실제 보안 경계, 여기선 한 번 더 확인)
const ADMIN_EMAIL = "mandahnar15@gmail.com";

async function requireAdmin(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
}

function parseListField(value) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function uploadImages(supabase, files) {
  const urls = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

function buildFields(formData, type) {
  const salePriceRaw = formData.get("salePrice");

  return {
    name: formData.get("name"),
    name_en: formData.get("nameEn"),
    name_mn: formData.get("nameMn"),
    category: ko.nav[type] ?? type,
    category_en: en.nav[type] ?? type,
    category_mn: mn.nav[type] ?? type,
    type,
    price: Number(formData.get("price")),
    sale_price: salePriceRaw ? Number(salePriceRaw) : null,
    badge: formData.get("badge") || null,
    is_sold_out: formData.get("soldOut") === "on",
    emoji: formData.get("emoji") || null,
    swatches: parseListField(formData.get("swatches")),
    sizes: parseListField(formData.get("sizes")),
  };
}

export async function createProduct(locale, formData) {
  const supabase = await createClient();
  await requireAdmin(supabase);

  const type = formData.get("type");
  const images = await uploadImages(supabase, formData.getAll("images"));
  const fields = buildFields(formData, type);

  const { error } = await supabase.from("products").insert({ ...fields, images });
  if (error) throw error;

  revalidatePath(`/${locale}/admin/products`);
  redirect(`/${locale}/admin/products`);
}

export async function updateProduct(id, locale, formData) {
  const supabase = await createClient();
  await requireAdmin(supabase);

  const type = formData.get("type");
  const keepImages = formData.getAll("keepImages");
  const newImages = await uploadImages(supabase, formData.getAll("images"));
  const fields = buildFields(formData, type);
  const images = [...keepImages, ...newImages];

  const { error } = await supabase.from("products").update({ ...fields, images }).eq("id", id);
  if (error) throw error;

  revalidatePath(`/${locale}/admin/products`);
  redirect(`/${locale}/admin/products`);
}

export async function deleteProduct(id, locale) {
  const supabase = await createClient();
  await requireAdmin(supabase);

  await supabase.from("products").delete().eq("id", id);
  revalidatePath(`/${locale}/admin/products`);
}

export async function deleteRestockRequest(id, productId, locale) {
  const supabase = await createClient();
  await requireAdmin(supabase);

  await supabase.from("restock_requests").delete().eq("id", id);
  revalidatePath(`/${locale}/admin/products/${productId}`);
}
