import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";

export default function CTASection() {
  return (
    <section className="w-full py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn duration={800} distance={32}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-16 text-center sm:px-12 lg:py-24">
            <div className="relative z-[1]">
              <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-white md:text-4xl">
                Sẵn sàng xây dựng với các Model AI hàng đầu?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-blue-100 md:text-lg">
                Bắt đầu tích hợp tạo video, ảnh và nhạc vào ứng dụng của bạn
                ngay hôm nay. Bao gồm credit dùng thử miễn phí.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-blue-700 transition-opacity hover:opacity-90"
                >
                  Bắt đầu miễn phí
                  <ArrowRight className="size-4" />
                </Link>
                {/* <Link
                href="/docs"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Xem tài liệu
              </Link> */}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute right-1/4 top-1/3 size-32 rounded-full bg-white/3 blur-2xl" />

            {/* Wave SVG overlay — subtle at bottom */}
            <Image
              src="/images/home/bg_cta_waves.svg"
              alt=""
              width={1200}
              height={400}
              loading="lazy"
              className="pointer-events-none absolute inset-x-0 -bottom-4 w-full opacity-30"
              aria-hidden="true"
            />

            {/* Grid dots */}
            <div className="bg-grid-dots pointer-events-none absolute inset-0 text-white opacity-[0.04]" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
