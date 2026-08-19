"use client";

import Image from "next/image";
import { useState } from "react";

// 상품 사진 여러 장을 큰 이미지 + 썸네일 목록으로 보여줌 (사진이 없으면 이모지로 대체)
export default function ProductGallery({ images, alt, emoji }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center bg-soft-cloud text-[120px]">
        {emoji}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-soft-cloud">
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 bg-soft-cloud ${
                i === activeIndex ? "ring-2 ring-ink" : "ring-1 ring-hairline"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
