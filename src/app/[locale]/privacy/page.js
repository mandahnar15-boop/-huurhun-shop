import LegalDocument from "@/components/LegalDocument";
import { privacy } from "@/data/legal/privacy";

// 개인정보처리방침 — 몽골 법률에 근거한 문서라 UI 언어와 무관하게 항상 몽골어 원문으로 표시
export default function PrivacyPage() {
  return <LegalDocument {...privacy} />;
}
