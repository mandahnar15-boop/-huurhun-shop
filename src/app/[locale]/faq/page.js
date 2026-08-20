import InfoSections from "@/components/InfoSections";
import { getDictionary } from "@/dictionaries";

export default async function FaqPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <InfoSections title={dict.pages.faq.title} sections={dict.pages.faq.sections} />;
}
