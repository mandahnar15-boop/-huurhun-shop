import SignupForm from "@/components/SignupForm";
import { getDictionary } from "@/dictionaries";

export default async function SignupPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <SignupForm dict={dict} locale={locale} />;
}
