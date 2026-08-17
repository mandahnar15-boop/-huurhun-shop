"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// 이메일의 "비밀번호 재설정" 링크를 클릭하고 온 사람이 새 비밀번호를 입력하는 폼
// 링크를 누르면 Supabase가 이 브라우저에 임시 로그인 세션을 만들어주고, 그 상태에서 새 비밀번호를 설정함
export default function ResetPasswordForm({ dict, locale }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setIsDone(true);
    setTimeout(() => router.push(`/${locale}`), 1500);
  }

  if (isDone) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-base font-medium text-ink">{dict.auth.resetPasswordSuccess}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{dict.auth.resetPasswordTitle}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink">{dict.auth.newPassword}</span>
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
          {dict.auth.resetPasswordSubmit}
        </button>
      </form>
    </main>
  );
}
