// 최상단 얇은 유틸리티 바 (매장/고객센터/가입/로그인 링크)
export default function UtilityBar({ dict }) {
  return (
    <div className="hidden h-9 items-center justify-end gap-6 bg-soft-cloud px-6 text-xs font-medium text-ink sm:flex">
      {dict.utilityLinks.map((link) => (
        <a key={link} href="#" className="hover:underline">
          {link}
        </a>
      ))}
    </div>
  );
}
