import {
  Coins,
  FlaskConical,
  Plug,
  Gauge,
  ShieldCheck,
  LifeBuoy,
} from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";

const features = [
  {
    id: 1,
    icon: Coins,
    title: "Giá cả hợp lý với hệ thống Credit",
    description:
      "Hệ thống trả theo lượt sử dụng linh hoạt. Chỉ trả cho những gì bạn dùng — tiết kiệm cho startup, agency và doanh nghiệp.",
  },
  {
    id: 2,
    icon: FlaskConical,
    title: "Dùng thử miễn phí trên Playground",
    description:
      "Thử nghiệm bất kỳ API nào miễn phí trên Playground trước khi tích hợp. Thử prompt, điều chỉnh tham số và xem trước kết quả.",
  },
  {
    id: 3,
    icon: Plug,
    title: "Tích hợp API đơn giản",
    description:
      "Tài liệu rõ ràng và ví dụ từng bước. Thêm AI vào sản phẩm của bạn chỉ trong vài phút.",
  },
  {
    id: 4,
    icon: Gauge,
    title: "Hiệu suất nhanh & mở rộng được",
    description:
      "99.9% uptime, phản hồi độ trễ thấp và xử lý đồng thời cao. Ổn định từ prototype đến production.",
  },
  {
    id: 5,
    icon: ShieldCheck,
    title: "Bảo mật dữ liệu vững chắc",
    description:
      "Công nghệ mã hoá đảm bảo thông tin của bạn luôn an toàn. Dữ liệu không bị lộ hay xâm phạm.",
  },
  {
    id: 6,
    icon: LifeBuoy,
    title: "Giám sát & Hỗ trợ 24/7",
    description:
      "Giám sát và hỗ trợ khách hàng xuyên suốt. Đội ngũ kỹ thuật luôn sẵn sàng trợ giúp bạn.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 lg:py-24">
      {/* Gradient blob — bottom left */}
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-[400px] rounded-full bg-blue-400/5 blur-3xl dark:bg-blue-500/10" />

      {/* Gradient blob — top right */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-[350px] rounded-full bg-purple-400/5 blur-3xl dark:bg-purple-500/8" />

      {/* Grid line pattern */}
      <div className="bg-grid-lines pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" />

      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="mb-12 text-center text-2xl font-semibold md:text-4xl lg:mb-20">
            Tại sao chọn Operis Market
          </h2>
        </FadeIn>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.id} delay={i * 100}>
                <div className="flex flex-col">
                  <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
