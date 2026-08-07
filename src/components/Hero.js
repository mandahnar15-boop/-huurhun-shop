// 캠페인 히어로 — 큰 타이포가 이미지 위에 얹히는 형태
// 실제 사진 대신 어두운 배경으로 대체 (나중에 캠페인 사진으로 교체 가능)
export default function Hero({ dict }) {
  return (
    <section className="relative flex h-[70vh] min-h-[420px] items-end overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />

      <div className="relative flex w-full flex-col gap-6 px-6 pb-12 sm:pb-16">
        <h1 className="font-display text-[48px] uppercase leading-[0.9] text-white sm:text-[64px] lg:text-[96px]">
          {dict.hero.line1}
          <br />
          {dict.hero.line2}
        </h1>
        <a
          href="#products"
          className="inline-flex h-12 w-fit items-center rounded-[30px] bg-canvas px-6 text-sm font-medium text-ink"
        >
          {dict.hero.cta}
        </a>
      </div>
    </section>
  );
}
