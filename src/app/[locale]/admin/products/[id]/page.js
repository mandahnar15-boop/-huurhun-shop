import { notFound } from "next/navigation";
import ProductFormFields from "@/components/admin/ProductFormFields";
import { getDictionary } from "@/dictionaries";
import { getProductById } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();
  const product = await getProductById(supabase, Number(id));

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.admin.editProductsTitle}</h1>

      <form action={updateProduct.bind(null, product.id, locale)} className="flex flex-col gap-6">
        <ProductFormFields product={product} dict={dict} />
        <button type="submit" className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white">
          {dict.admin.save}
        </button>
      </form>
    </main>
  );
}
