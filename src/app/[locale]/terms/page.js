import LegalDocument from "@/components/LegalDocument";
import { terms } from "@/data/legal/terms";

// 이용약관 — 몽골 법률에 근거한 문서라 UI 언어와 무관하게 항상 몽골어 원문으로 표시
export default function TermsPage() {
  return <LegalDocument {...terms} />;
}
