import ProductFormFields from "@/components/admin/ProductFormFields";
import { getDictionary } from "@/dictionaries";
import { createProduct } from "../actions";

export default async function NewProductPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.admin.newProductsTitle}</h1>

      <form action={createProduct.bind(null, locale)} className="flex flex-col gap-6">
        <ProductFormFields dict={dict} />
        <button type="submit" className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white">
          {dict.admin.register}
        </button>
      </form>
    </main>
  );
}
