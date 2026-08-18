import InfoSections from "@/components/InfoSections";
import { getDictionary } from "@/dictionaries";

export default async function ShippingPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <InfoSections title={dict.pages.shipping.title} sections={dict.pages.shipping.sections} />;
}
