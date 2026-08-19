// 이용약관 / 개인정보처리방침처럼 "제목 + 번호 섹션(문단 또는 목록)" 형태인 법적 문서 공통 레이아웃
export default function LegalDocument({ title, subtitle, sections, footnote }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-[32px] font-medium text-ink">{title}</h1>
      {subtitle && <p className="mb-10 text-sm font-medium text-mute">{subtitle}</p>}

      <div className="flex flex-col">
        {sections.map((section) => (
          <div key={section.heading} className="border-b border-hairline py-6">
            <h2 className="mb-2 text-base font-medium text-ink">{section.heading}</h2>
            {section.intro && (
              <p className="mb-2 text-sm font-medium leading-6 text-mute">{section.intro}</p>
            )}
            {section.body && <p className="text-sm font-medium leading-6 text-mute">{section.body}</p>}
            {section.list && (
              <ul className="flex flex-col gap-1.5 text-sm font-medium leading-6 text-mute">
                {section.list.map((item, i) => (
                  <li key={i} className="pl-4 -indent-4">
                    · {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {footnote && <p className="mt-6 text-xs italic leading-5 text-mute">{footnote}</p>}
    </main>
  );
}
