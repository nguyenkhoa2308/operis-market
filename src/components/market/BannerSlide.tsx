import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BannerSlide as BannerSlideType } from "@/types/market";

interface BannerSlideProps {
  slide: BannerSlideType;
}

export default function BannerSlide({ slide }: BannerSlideProps) {
  return (
    <div
      className={`relative flex h-full items-center overflow-hidden rounded-xl bg-gradient-to-r from-black/60 via-black/30 to-transparent`}
    >
      {/* Background image */}
      {slide.image && (
        <Image
          src={slide.image}
          alt={slide.modelName}
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-[1] flex h-full flex-col justify-end px-5 pb-10 pt-5 sm:px-8 md:px-12">
        {/* Tags */}
        <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
          {slide.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm sm:px-3 sm:py-1 sm:text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Model name */}
        <h2 className="mb-1.5 text-xl font-bold text-white sm:mb-3 sm:text-2xl md:text-3xl">
          {slide.modelName}
        </h2>

        {/* Description */}
        <p className="mb-3 line-clamp-2 max-w-lg text-xs leading-relaxed text-white/80 sm:mb-5 sm:line-clamp-3 sm:text-sm md:text-base">
          {slide.description}
        </p>

        {/* CTA */}
        <Link
          href={slide.href}
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Xem chi tiết
          <ArrowRight className="size-3.5 sm:size-4" />
        </Link>
      </div>
    </div>
  );
}
