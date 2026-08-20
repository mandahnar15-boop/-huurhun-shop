import InfoSections from "@/components/InfoSections";
import { getDictionary } from "@/dictionaries";

export default async function BrandStoryPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <InfoSections title={dict.pages.brandStory.title} sections={dict.pages.brandStory.sections} />;
}
