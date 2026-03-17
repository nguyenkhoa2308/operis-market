import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";

const useCases = [
  {
    id: 1,
    title: "API Tạo Video bằng AI",
    description:
      "Tạo video chất lượng cao với Veo 3.1, Veo 3.1 Fast và Runway Aleph. Chuyển động mượt mà, cảnh thực tế, âm thanh đồng bộ và điều khiển camera chính xác.",
    image: "/images/home/use_01.webp",
    reverse: false,
  },
  {
    id: 2,
    title: "API Tạo Ảnh bằng AI",
    description:
      "Tạo ảnh chất lượng cao, đa phong cách với 4o Image API, Flux Kontext API và Nano Banana API. Render chân thực, nhân vật nhất quán và kiểm soát sáng tạo.",
    image: "/images/home/use_02.webp",
    reverse: true,
  },
  {
    id: 3,
    title: "API Tạo Nhạc bằng AI",
    description:
      "Tạo nhạc chất lượng cao với Suno API hỗ trợ V3.5, V4 và V4.5. Giọng hát nâng cao, âm thanh phong phú và prompt thông minh — dài tới 8 phút.",
    image: "/images/home/use_03.webp",
    reverse: false,
  },
  {
    id: 4,
    title: "API LLM & AI Chat",
    description:
      "Tích hợp LLM và AI Chat API tiên tiến cho hội thoại tự nhiên, hỗ trợ lập trình và trả lời dựa trên tri thức.",
    image: "/images/home/use_04.webp",
    reverse: true,
  },
];

export default function UseCasesSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 lg:py-24">
      {/* Decorative SVG — fan lines (left side) */}
      <Image
        src="/images/home/bg_cover_01.svg"
        alt=""
        width={919}
        height={796}
        className="pointer-events-none absolute left-[10%] top-[30%] w-[45%] opacity-15 dark:opacity-30 rotate-35"
        aria-hidden="true"
      />

      {/* Gradient blob — right */}
      <div className="pointer-events-none absolute -right-40 top-1/4 size-[500px] rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-500/10" />

      {/* Gradient blob — left */}
      <div className="pointer-events-none absolute -left-32 top-2/3 size-[400px] rounded-full bg-indigo-400/5 blur-3xl dark:bg-indigo-500/8" />

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="mb-12 text-center text-2xl font-semibold md:text-4xl lg:mb-20">
            API AI cho mọi dự án
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-10 lg:gap-16">
          {useCases.map((item) => (
            <FadeIn
              key={item.id}
              direction={item.reverse ? "left" : "right"}
              distance={32}
            >
              <div
                className={`flex flex-col gap-4 ${item.reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="w-full md:w-1/2">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1280}
                    height={720}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="aspect-video w-full rounded-md border border-border object-cover"
                  />
                </div>
                <div
                  className={`md:flex md:w-1/2 md:items-center ${item.reverse ? "md:pr-10" : "md:pl-10"}`}
                >
                  <div>
                    <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                      {item.title}
                    </h3>
                    <p className="text-base leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                    <Link
                      href="/market"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                      Lấy API Key
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
