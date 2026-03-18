"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedModels } from "@/hooks/use-models";
import BannerSlide from "./BannerSlide";

export default function FeaturedBanner() {
  const { data: featuredSlides = [], isLoading } = useFeaturedModels();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 8000, stopOnInteraction: true, stopOnMouseEnter: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  const total = featuredSlides.length;

  if (isLoading) {
    return (
      <div className="h-[220px] animate-pulse rounded-xl bg-accent sm:h-[260px] md:h-[300px]" />
    );
  }

  if (total === 0) return null;

  return (
    <div className="group/banner relative overflow-hidden rounded-xl">
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {featuredSlides.map((slide) => (
            <div
              key={slide.id}
              className="h-[220px] w-full shrink-0 grow-0 basis-full sm:h-[260px] md:h-[300px]"
            >
              <BannerSlide slide={slide} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black/60 group-hover/banner:opacity-100 sm:left-4 sm:size-10"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
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
              onClick={() => scrollTo(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all sm:h-2 ${
                i === selectedIndex
                  ? "w-5 bg-white sm:w-6"
                  : "w-1.5 bg-white/40 hover:bg-white/60 sm:w-2"
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
