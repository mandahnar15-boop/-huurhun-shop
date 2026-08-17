import ResetPasswordForm from "@/components/ResetPasswordForm";
import { getDictionary } from "@/dictionaries";

export default async function ResetPasswordPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return <ResetPasswordForm dict={dict} locale={locale} />;
}
