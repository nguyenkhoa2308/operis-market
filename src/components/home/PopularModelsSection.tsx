import Link from "next/link";
import { Video, Image, Music, ExternalLink } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";

const models = [
  {
    id: 1,
    name: "Google Veo 3.1",
    description:
      "Model video AI mới nhất của Google DeepMind với chuyển động điện ảnh, tuân thủ prompt tốt và âm thanh đồng bộ ở độ phân giải 1080p.",
    category: "Tạo Video",
    icon: Video,
    href: "/market/veo-3-1",
  },
  {
    id: 2,
    name: "Runway Aleph",
    description:
      "Model video in-context của Runway cho phép chỉnh sửa đa tác vụ — thêm/xoá vật thể, đổi ánh sáng, thay góc quay bằng prompt.",
    category: "Tạo Video",
    icon: Video,
    href: "/market/runway-aleph",
  },
  {
    id: 3,
    name: "Suno API",
    description:
      "Tạo nhạc nâng cao với giọng hát chân thực, căn chỉnh lời-nhạc chính xác và sản xuất đa thể loại chất lượng cao.",
    category: "Tạo Nhạc",
    icon: Music,
    href: "/market/suno-api",
  },
  {
    id: 4,
    name: "4o Image API",
    description:
      "Model ảnh GPT-4o của OpenAI cho hình ảnh chất lượng cao với render chữ chính xác và kiểm soát phong cách linh hoạt.",
    category: "Tạo Ảnh",
    icon: Image,
    href: "/market/4o-image",
  },
  {
    id: 5,
    name: "Flux.1 Kontext",
    description:
      "Model ảnh của Black Forest Labs cho cảnh sống động, mạch lạc với tính nhất quán chủ thể cao và kết quả lặp lại được.",
    category: "Tạo Ảnh",
    icon: Image,
    href: "/market/flux-kontext",
  },
  {
    id: 6,
    name: "Nano Banana",
    description:
      "Tạo và chỉnh sửa ảnh AI nhanh, chính xác với tính nhất quán hình ảnh mạnh và mô phỏng vật lý chân thực.",
    category: "Tạo Ảnh",
    icon: Image,
    href: "/market/nano-banana",
  },
];

export default function PopularModelsSection() {
  return (
    <section className="relative w-full overflow-hidden py-10 lg:py-16">
      {/* Gradient blob — center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/3 blur-3xl dark:bg-blue-500/6" />

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
