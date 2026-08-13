import LoginForm from "@/components/LoginForm";
import { getDictionary } from "@/dictionaries";

export default async function LoginPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <LoginForm dict={dict} locale={locale} />;
}
