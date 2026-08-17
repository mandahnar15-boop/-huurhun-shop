"use client";

import { useState } from "react";

// 클릭하면 text를 클립보드에 복사하고, 잠깐 체크 아이콘으로 바뀌는 버튼
export default function CopyButton({ text, dict }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없는 환경이면 조용히 무시 (주문번호는 화면에 이미 보임)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={dict.orderComplete.copy}
      className="flex items-center gap-1 text-sm font-medium text-ink"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {dict.orderComplete.copied}
        </>
      ) : (
        <>
          {text}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </>
      )}
    </button>
  );
}
