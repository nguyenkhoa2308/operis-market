"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";

const faqs = [
  {
    question: "Operis Market là gì?",
    answer:
      "Operis Market là nền tảng API marketplace thống nhất, nơi bạn có thể truy cập các model AI hàng đầu cho video, ảnh, nhạc và chat thông qua một API duy nhất, thân thiện với lập trình viên.",
  },
  {
    question: "Thanh toán hoạt động như thế nào?",
    answer:
      "Chúng tôi cung cấp hình thức trả theo lượt sử dụng linh hoạt. Bạn chỉ trả cho các lượt gọi API đã dùng, không có phí tối thiểu hàng tháng hay phí ẩn. Giảm giá theo khối lượng cho khách hàng sử dụng nhiều.",
  },
  {
    question: "Tôi có thể dùng thử trước khi mua không?",
    answer:
      "Có! Mỗi tài khoản mới đều nhận credit dùng thử miễn phí để bạn có thể test bất kỳ model nào trước khi quyết định. Không cần thẻ tín dụng để bắt đầu.",
  },
  {
    question: "Tốc độ phản hồi API nhanh cỡ nào?",
    answer:
      "Hạ tầng của chúng tôi được tối ưu cho tốc độ. Thời gian phản hồi trung bình dưới 25 giây cho tạo video và dưới 5 giây cho tạo ảnh, với cam kết uptime 99.9%.",
  },
  {
    question: "Dữ liệu của tôi có an toàn không?",
    answer:
      "Hoàn toàn. Chúng tôi sử dụng mã hoá end-to-end, không lưu trữ nội dung bạn tạo ra. API key của bạn được mã hoá khi lưu trữ.",
  },
  {
    question: "Có hỗ trợ kỹ thuật không?",
    answer:
      "Có, chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua chat và email. Khách hàng doanh nghiệp còn được phân account manager riêng và kênh hỗ trợ ưu tiên.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full overflow-hidden py-10 lg:py-16">
      {/* Decorative SVG — flowing spiral curves */}
      <Image
        src="/images/home/bg_faq.svg"
        alt=""
        width={1000}
        height={800}
        loading="lazy"
        className="pointer-events-none absolute -left-[5%] bottom-0 w-[65%] opacity-20 dark:opacity-40"
        aria-hidden="true"
      />

      {/* Gradient blob — bottom left glow */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-[350px] rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />

      <div className="relative z-[1] mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="mb-12 text-center text-2xl font-semibold md:text-4xl lg:mb-20">
            Câu hỏi thường gặp
          </h2>
        </FadeIn>

        <div className="divide-y divide-border">
          {faqs.map((faq, index) => (
            <FadeIn key={index} delay={index * 80}>
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
              >
                <span className="text-base font-medium md:text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
