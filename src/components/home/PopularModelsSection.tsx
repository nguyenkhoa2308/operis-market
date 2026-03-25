import Link from "next/link";
import { MessageSquare, Image, Code, ExternalLink } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";

const models = [
  {
    id: 1,
    name: "Gemini 3 Pro",
    description:
      "Model mạnh nhất của Google với khả năng suy luận, lập trình và hiểu ngữ cảnh dài lên đến 1M tokens.",
    category: "Chat AI",
    icon: MessageSquare,
    href: "/market/gemini-3-pro",
  },
  {
    id: 2,
    name: "Kimi K2 Thinking",
    description:
      "Model suy luận chain-of-thought của Moonshot, chuyên giải quyết các bài toán phức tạp với độ chính xác cao.",
    category: "Chat AI",
    icon: MessageSquare,
    href: "/market/kimi-k2-thinking",
  },
  {
    id: 3,
    name: "Kimi K2.5",
    description:
      "Model đa ngôn ngữ của Moonshot với cửa sổ ngữ cảnh 256K, hỗ trợ lập trình và hiểu văn bản xuất sắc.",
    category: "Chat AI",
    icon: MessageSquare,
    href: "/market/kimi-k2.5",
  },
  {
    id: 4,
    name: "ByteDance Seed Code",
    description:
      "Model chuyên biệt cho lập trình của ByteDance — tối ưu cho sinh code, auto-complete và debug hiệu quả.",
    category: "Lập trình",
    icon: Code,
    href: "/market/bytedance-seed-code",
  },
  {
    id: 5,
    name: "Grok Imagine",
    description:
      "Tạo ảnh AI phong cách nghệ thuật độc đáo từ xAI, hiểu prompt phức tạp và cho kết quả sáng tạo.",
    category: "Tạo Ảnh",
    icon: Image,
    href: "/market/grok-imagine",
  },
  {
    id: 6,
    name: "Nano Banana Pro",
    description:
      "Phiên bản Pro với độ phân giải cao và photorealism vượt trội, phù hợp cho thiết kế chuyên nghiệp.",
    category: "Tạo Ảnh",
    icon: Image,
    href: "/market/nano-banana-pro",
  },
];

export default function PopularModelsSection() {
  return (
    <section className="relative w-full overflow-hidden py-10 lg:py-16">
      {/* Gradient blob — center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/3 blur-3xl dark:bg-emerald-500/6" />

      {/* Dot pattern */}
      <div className="bg-grid-dots pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" />

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="mb-12 text-center text-2xl font-semibold md:text-4xl lg:mb-20">
            Các Model AI phổ biến bạn có thể dùng ngay
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model, i) => {
            const Icon = model.icon;
            return (
              <FadeIn key={model.id} delay={i * 100}>
                <Link
                  href={model.href}
                  className="group flex min-h-[160px] flex-col items-start rounded-xl border border-border bg-background p-6 shadow-sm transition duration-500 hover:border-primary hover:shadow-md"
                >
                  <div className="mb-4 flex w-full items-center justify-between gap-2">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-5" />
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-primary">
                      <Icon className="size-4" />
                      <span>{model.category}</span>
                    </div>
                  </div>
                  <h3 className="mb-1 text-base font-semibold md:text-lg">
                    {model.name}
                  </h3>
                  <p className="text-sm leading-snug text-muted-foreground md:text-base">
                    {model.description}
                  </p>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={600}>
          <div className="mt-6 flex w-full items-center justify-center">
            <Link
              href="/market"
              className="group inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Xem tất cả
              <ExternalLink className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
