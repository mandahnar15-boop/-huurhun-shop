import { categories } from "@/data/categories";

// "new"/"sale"는 실제 상품 카테고리가 아니라 배지/할인가로 계산되는 가상 목록이라 선택지에서 제외
const TYPE_OPTIONS = categories.filter((c) => c.slug !== "new" && c.slug !== "sale");

const fieldClass =
  "h-12 border-b border-hairline bg-transparent px-1 text-base text-ink placeholder:text-mute focus:border-ink focus:outline-none";

// 상품 등록/수정 폼에서 공통으로 쓰는 입력 필드들 (product가 있으면 수정 모드로 값 채움)
export default function ProductFormFields({ product, dict }) {
  const { form } = dict.admin;

  return (
    <>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.category}</span>
        <select name="type" required defaultValue={product?.type ?? ""} className={fieldClass}>
          <option value="" disabled>
            {form.selectCategory}
          </option>
          {TYPE_OPTIONS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {dict.nav[c.slug]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.nameKo}</span>
        <input type="text" name="name" required defaultValue={product?.name ?? ""} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.nameEn}</span>
        <input type="text" name="nameEn" required defaultValue={product?.nameEn ?? ""} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.nameMn}</span>
        <input type="text" name="nameMn" required defaultValue={product?.nameMn ?? ""} className={fieldClass} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">{form.price}</span>
          <input
            type="number"
            name="price"
            required
            min="0"
            defaultValue={product?.price ?? ""}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">{form.salePrice}</span>
          <input
            type="number"
            name="salePrice"
            min="0"
            defaultValue={product?.salePrice ?? ""}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.badge}</span>
        <input type="text" name="badge" defaultValue={product?.badge ?? ""} className={fieldClass} />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="soldOut" defaultChecked={product?.isSoldOut ?? false} />
        <span className="text-sm font-medium text-ink">{form.soldOut}</span>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.swatches}</span>
        <input
          type="text"
          name="swatches"
          defaultValue={(product?.swatches ?? []).join(", ")}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.sizes}</span>
        <input
          type="text"
          name="sizes"
          defaultValue={(product?.sizes ?? []).join(", ")}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.emoji}</span>
        <input type="text" name="emoji" defaultValue={product?.emoji ?? ""} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">{form.images}</span>

        {product?.images?.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {product.images.map((url, i) => (
              <div key={url + i} className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-20 object-cover" />
                <label className="flex items-center gap-1 text-xs text-mute">
                  <input type="checkbox" name="keepImages" value={url} defaultChecked />
                  {form.keepImage}
                </label>
              </div>
            ))}
          </div>
        )}

        <input type="file" name="images" accept="image/*" multiple className="text-sm text-ink" />
        <span className="text-xs font-medium text-mute">{form.imagesNote}</span>
      </label>
    </>
  );
}
