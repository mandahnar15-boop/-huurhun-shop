"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// 품절 상품에서 이메일을 남기면 Supabase에 저장 — 재입고되면 관리자가 직접 연락함 (자동 발송 아님)
export default function RestockNotifyForm({ productId, dict }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase
      .from("restock_requests")
      .insert({ product_id: productId, email: email.trim() });

    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <p className="flex h-12 flex-1 items-center justify-center rounded-[30px] border border-hairline text-sm font-medium text-ink">
        {dict.product.restockRequested}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={dict.product.restockEmailPlaceholder}
        className="h-12 flex-1 min-w-0 border-b border-hairline bg-transparent px-1 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="h-12 shrink-0 rounded-[30px] bg-ink px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {dict.product.restockNotify}
      </button>
    </form>
  );
}
