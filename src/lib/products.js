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
    isSoldOut: row.is_sold_out ?? false,
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

// 상품별 리뷰 개수를 세서 "인기순" 정렬의 기준으로 씀
export async function getReviewCounts(supabase, productIds) {
  if (productIds.length === 0) return {};
  const { data } = await supabase.from("reviews").select("product_id").in("product_id", productIds);
  const counts = {};
  for (const row of data ?? []) {
    counts[row.product_id] = (counts[row.product_id] ?? 0) + 1;
  }
  return counts;
}

// 상/하의를 서로 짝지어 "함께 구매하면 좋은 상품"을 추천 — 실제 판매 데이터가 없어서 카테고리 궁합으로 대신함
const TOP_TYPES = ["tops", "top", "tshirts", "longsleeve", "shirts", "knitwears", "hoodies", "jackets", "outerwear"];
const BOTTOM_TYPES = ["bottom", "pantsdenim", "shorts", "dressskirts"];
const ACCESSORY_TYPES = ["accessories", "bags", "hatscaps", "underwear"];

export function getRelatedProducts(allProducts, product, limit = 4) {
  const others = allProducts.filter((p) => p.id !== product.id && !p.isSoldOut);

  let pairedTypes = [];
  if (TOP_TYPES.includes(product.type)) pairedTypes = [...BOTTOM_TYPES, ...ACCESSORY_TYPES];
  else if (BOTTOM_TYPES.includes(product.type)) pairedTypes = [...TOP_TYPES, ...ACCESSORY_TYPES];

  const paired = others.filter((p) => pairedTypes.includes(p.type));
  const rest = others.filter((p) => !pairedTypes.includes(p.type));

  return [...paired, ...rest].slice(0, limit);
}

export function sortProducts(products, sort, popularityMap = {}) {
  const sorted = [...products];

  switch (sort) {
    case "priceAsc":
      sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case "priceDesc":
      sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case "popular":
      sorted.sort((a, b) => (popularityMap[b.id] ?? 0) - (popularityMap[a.id] ?? 0));
      break;
    case "newest":
    default:
      sorted.sort((a, b) => b.id - a.id);
  }

  return sorted;
}
