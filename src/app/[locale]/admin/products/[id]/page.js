import { notFound } from "next/navigation";
import ProductFormFields from "@/components/admin/ProductFormFields";
import { getDictionary } from "@/dictionaries";
import { getProductById } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { deleteRestockRequest, updateProduct } from "../actions";

export default async function EditProductPage({ params }) {
  const { locale, id } = await params;
  const dict = getDictionary(locale);
  const supabase = await createClient();
  const product = await getProductById(supabase, Number(id));

  if (!product) notFound();

  const { data: restockRequests } = await supabase
    .from("restock_requests")
    .select("*")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.admin.editProductsTitle}</h1>

      <form action={updateProduct.bind(null, product.id, locale)} className="flex flex-col gap-6">
        <ProductFormFields product={product} dict={dict} />
        <button type="submit" className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white">
          {dict.admin.save}
        </button>
      </form>

      <div className="mt-10 border-t border-hairline pt-6">
        <h2 className="mb-4 text-base font-medium text-ink">
          {dict.admin.restockRequestsTitle} ({restockRequests?.length ?? 0})
        </h2>

        {!restockRequests || restockRequests.length === 0 ? (
          <p className="text-sm font-medium text-mute">{dict.admin.noRestockRequests}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {restockRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-ink">{request.email}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-mute">
                    {new Date(request.created_at).toLocaleDateString("ko-KR")}
                  </span>
                  <form action={deleteRestockRequest.bind(null, request.id, product.id, locale)}>
                    <button type="submit" className="text-xs font-medium text-mute hover:text-ink">
                      {dict.admin.delete}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
