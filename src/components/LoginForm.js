"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// 로그인 폼 (Supabase 이메일/비밀번호 로그인)
export default function LoginForm({ dict, locale }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error: signInError } = await signIn(email, password);

    setIsSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(`/${locale}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.auth.loginTitle}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">{dict.auth.email}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">{dict.auth.password}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 border-b border-hairline bg-transparent px-1 text-base text-ink focus:border-ink focus:outline-none"
          />
        </label>

        {error && <p className="text-sm font-medium text-sale">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-[30px] bg-ink text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.auth.loginSubmit}
        </button>
      </form>

      <p className="mt-6 text-sm font-medium text-mute">
        {dict.auth.noAccount}{" "}
        <Link href={`/${locale}/signup`} className="text-ink underline">
          {dict.auth.goSignup}
        </Link>
      </p>
    </main>
  );
}
