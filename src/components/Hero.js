// 캠페인 히어로 — 큰 타이포가 배경 영상 위에 얹히는 형태
// public/hero.mp4 를 자동재생 배경 영상으로 사용 (소리 없이 반복 재생)
export default function Hero({ dict }) {
  return (
    <section className="relative flex h-[70vh] min-h-[420px] items-end overflow-hidden bg-ink">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

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
