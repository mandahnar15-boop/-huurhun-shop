// 배송 안내 / 교환·반품 같은 "제목 + 섹션 목록" 형태의 안내 페이지 공통 레이아웃
export default function InfoSections({ title, sections }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="mb-8 text-[32px] font-medium text-ink">{title}</h1>

      <div className="flex flex-col">
        {sections.map((section) => (
          <div key={section.heading} className="border-b border-hairline py-6">
            <h2 className="mb-2 text-base font-medium text-ink">{section.heading}</h2>
            <p className="text-sm font-medium leading-6 text-mute">{section.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
