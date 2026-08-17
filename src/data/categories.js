// 상단 네비게이션 카테고리 — slug는 URL(/[locale]/category/[slug])에 쓰임
// 화면에 보이는 이름은 dictionaries의 nav 텍스트를 slug로 찾아서 씀
// types가 있으면 그 안에 속한 product.type 값들을 전부 모아서 보여주는 "상위 카테고리"
export const categories = [
  { slug: "new" },
  { slug: "top" },
  { slug: "longsleeve" },
  { slug: "tshirts" },
  { slug: "tops", types: ["tops", "top", "tshirts", "longsleeve", "shirts", "knitwears"] },
  { slug: "bottom", types: ["bottom", "pantsdenim", "shorts"] },
  { slug: "dressskirts" },
  { slug: "pantsdenim" },
  { slug: "shorts" },
  { slug: "outerwear", types: ["outerwear", "hoodies", "jackets"] },
  { slug: "hoodies" },
  { slug: "jackets" },
  { slug: "knitwears" },
  { slug: "shirts" },
  { slug: "sale" },
  { slug: "other" },
  { slug: "accessories" },
  { slug: "bags" },
  { slug: "hatscaps" },
  { slug: "underwear" },
  { slug: "beyondsoft" },
  { slug: "uncategorized" },
];
