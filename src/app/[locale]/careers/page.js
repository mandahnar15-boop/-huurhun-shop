import InfoSections from "@/components/InfoSections";
import { getDictionary } from "@/dictionaries";

export default async function CareersPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <InfoSections title={dict.pages.careers.title} sections={dict.pages.careers.sections} />;
}
