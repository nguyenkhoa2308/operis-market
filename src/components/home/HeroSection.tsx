import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";
import CountUp from "@/components/shared/CountUp";

const stats = [
  { value: "99.9%", label: "Thời gian hoạt động" },
  { value: "25.1s", label: "Thời gian phản hồi" },
  { value: "24/7", label: "Hỗ trợ kỹ thuật" },
  { value: "100%", label: "Mã hóa dữ liệu" },
];

export default function HeroSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center py-10 pt-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent dark:from-blue-600/15" />

      {/* Gradient blob — top left */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-[500px] rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/15" />

      {/* Gradient blob — top right */}
      <div className="pointer-events-none absolute -right-32 -top-20 size-[400px] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10" />

      {/* Grid dot pattern */}
      <div className="bg-grid-dots pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" />

      {/* Decorative SVG — rotating diamonds */}
      <Image
        src="/images/home/bg_hero.svg"
        alt=""
        width={650}
        height={650}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.3] opacity-25 dark:opacity-45"
        aria-hidden="true"
        priority
      />

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <FadeIn delay={0} duration={700}>
            <h1 className="mx-auto bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text pt-4 text-center text-3xl font-semibold !leading-[130%] tracking-tight text-transparent dark:from-foreground dark:to-foreground-muted sm:text-4xl md:text-5xl lg:max-w-5xl lg:text-6xl">
              Truy cập các Model AI Video, Ảnh & Nhạc hàng đầu trong một API
            </h1>
          </FadeIn>

          <FadeIn delay={150}>
            <p className="mx-auto text-center font-normal leading-7 text-muted-foreground text-base lg:max-w-2xl">
              Tất cả API AI cho video, ảnh, nhạc và chat — chi phí thấp, tốc độ
              nhanh, thân thiện với lập trình viên.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:gap-4 md:flex-row">
              <Link
                href="/market"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:h-14 sm:px-6"
              >
                Khám phá AI API
              </Link>
              {/* <Link
                href="/docs"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground-muted transition-colors hover:bg-accent sm:h-14 sm:px-6"
              >
                Tài liệu API
                <span className="flex size-7 items-center justify-center rounded-full bg-muted">
                  <ArrowRight className="size-4" />
                </span>
              </Link> */}
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-24" />

        <div className="grid w-full grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={400 + i * 100}>
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
                  <CountUp value={stat.value} delay={400 + i * 100} />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
