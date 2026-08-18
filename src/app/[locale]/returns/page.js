import InfoSections from "@/components/InfoSections";
import { getDictionary } from "@/dictionaries";

export default async function ReturnsPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <InfoSections title={dict.pages.returns.title} sections={dict.pages.returns.sections} />;
}
