import WishlistView from "@/components/WishlistView";
import { getDictionary } from "@/dictionaries";

export default async function WishlistPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <WishlistView dict={dict} locale={locale} />;
}
