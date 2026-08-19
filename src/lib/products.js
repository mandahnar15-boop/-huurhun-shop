// Supabase products 테이블의 snake_case 컬럼을 기존 화면 컴포넌트가 쓰던 camelCase 모양으로 변환
function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    nameMn: row.name_mn,
    category: row.category,
    categoryEn: row.category_en,
    categoryMn: row.category_mn,
    type: row.type,
    price: row.price,
    salePrice: row.sale_price,
    badge: row.badge,
    images: row.images ?? [],
    emoji: row.emoji,
    swatches: row.swatches ?? [],
    sizes: row.sizes ?? [],
  };
}

export async function getProducts(supabase) {
  const { data } = await supabase.from("products").select("*").order("id", { ascending: true });
  return (data ?? []).map(mapProductRow);
}

export async function getProductById(supabase, id) {
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  return data ? mapProductRow(data) : null;
}

export async function getProductsByIds(supabase, ids) {
  if (ids.length === 0) return [];
  const { data } = await supabase.from("products").select("*").in("id", ids);
  return (data ?? []).map(mapProductRow);
}
