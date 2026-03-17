"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedModels } from "@/hooks/use-models";
import BannerSlide from "./BannerSlide";

export default function FeaturedBanner() {
  const { data: featuredSlides = [], isLoading } = useFeaturedModels();
  const [current, setCurrent] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const total = featuredSlides.length;

  const resetTimer = useCallback(() => setResetKey((k) => k + 1), []);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
    resetTimer();
  }, [total, resetTimer]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
    resetTimer();
  }, [total, resetTimer]);

  const goTo = useCallback(
    (i: number) => {
      setCurrent(i);
      resetTimer();
    },
    [resetTimer],
  );

  // Auto-advance — resets when user interacts
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 8000);
    return () => clearInterval(timer);
  }, [total, resetKey]);

  if (isLoading) {
    return <div className="h-[220px] animate-pulse rounded-xl bg-accent sm:h-[260px] md:h-[300px]" />;
  }

  if (featuredSlides.length === 0) return null;

  return (
    <div className="group/banner relative overflow-hidden rounded-xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {featuredSlides.map((slide) => (
          <div
            key={slide.id}
            className="h-[220px] w-full shrink-0 sm:h-[260px] md:h-[300px]"
          >
            <BannerSlide slide={slide} />
          </div>
        ))}
      </div>

      {/* Arrows — hidden on mobile, visible on hover for desktop */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black/60 group-hover/banner:opacity-100 sm:left-4 sm:size-10"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black/60 group-hover/banner:opacity-100 sm:right-4 sm:size-10"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4 sm:gap-2">
          {featuredSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all sm:h-2 ${
                i === current ? "w-5 bg-white sm:w-6" : "w-1.5 bg-white/40 hover:bg-white/60 sm:w-2"
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
