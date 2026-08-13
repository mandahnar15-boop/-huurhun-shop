"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// 회원가입 폼 (Supabase 이메일/비밀번호 가입 — 기본적으로 이메일 인증 필요)
export default function SignupForm({ dict, locale }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error: signUpError } = await signUp(email, password);

    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setIsDone(true);
  }

  if (isDone) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-base font-medium text-ink">{dict.auth.signupSuccess}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.auth.signupTitle}</h1>

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
            minLength={6}
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
          {dict.auth.signupSubmit}
        </button>
      </form>

      <p className="mt-6 text-sm font-medium text-mute">
        {dict.auth.hasAccount}{" "}
        <Link href={`/${locale}/login`} className="text-ink underline">
          {dict.auth.goLogin}
        </Link>
      </p>
    </main>
  );
}
