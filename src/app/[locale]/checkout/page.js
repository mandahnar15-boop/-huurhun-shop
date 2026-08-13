import CheckoutForm from "@/components/CheckoutForm";
import { getDictionary } from "@/dictionaries";

export default async function CheckoutPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <CheckoutForm dict={dict} locale={locale} />;
}
