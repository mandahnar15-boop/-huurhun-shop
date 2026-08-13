// 상품의 name/category를 현재 언어에 맞는 필드로 골라줌 (nameEn, nameMn 처럼 언어별 필드를 둠)
export function localizeProduct(product, locale) {
  const suffix = locale === "ko" ? "" : locale.charAt(0).toUpperCase() + locale.slice(1);
  return {
    displayName: suffix ? product[`name${suffix}`] : product.name,
    displayCategory: suffix ? product[`category${suffix}`] : product.category,
  };
}
