import CartView from "@/components/CartView";
import { getDictionary } from "@/dictionaries";

export default async function CartPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <CartView dict={dict} locale={locale} />;
}
