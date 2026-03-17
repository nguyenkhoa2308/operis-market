import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import UseCasesSection from "@/components/home/UseCasesSection";
import PopularModelsSection from "@/components/home/PopularModelsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "Operis Market — Marketplace API cho các model AI tạo video, hình ảnh, nhạc và chat. Một API, hơn 10 model hàng đầu.",
  alternates: { canonical: "/" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Operis Market",
    url: "https://operis.market",
    description:
      "Marketplace API cho các model AI tạo video, hình ảnh, nhạc và chat.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://operis.market/market?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Operis Market là gì?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Operis Market là nền tảng API marketplace thống nhất, nơi bạn có thể truy cập các model AI hàng đầu cho video, ảnh, nhạc và chat thông qua một API duy nhất, thân thiện với lập trình viên.",
        },
      },
      {
        "@type": "Question",
        name: "Thanh toán hoạt động như thế nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chúng tôi cung cấp hình thức trả theo lượt sử dụng linh hoạt. Bạn chỉ trả cho các lượt gọi API đã dùng, không có phí tối thiểu hàng tháng hay phí ẩn. Giảm giá theo khối lượng cho khách hàng sử dụng nhiều.",
        },
      },
      {
        "@type": "Question",
        name: "Tôi có thể dùng thử trước khi mua không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Có! Mỗi tài khoản mới đều nhận credit dùng thử miễn phí để bạn có thể test bất kỳ model nào trước khi quyết định. Không cần thẻ tín dụng để bắt đầu.",
        },
      },
      {
        "@type": "Question",
        name: "Tốc độ phản hồi API nhanh cỡ nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hạ tầng của chúng tôi được tối ưu cho tốc độ. Thời gian phản hồi trung bình dưới 25 giây cho tạo video và dưới 5 giây cho tạo ảnh, với cam kết uptime 99.9%.",
        },
      },
      {
        "@type": "Question",
        name: "Dữ liệu của tôi có an toàn không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hoàn toàn. Chúng tôi sử dụng mã hoá end-to-end, không lưu trữ nội dung bạn tạo ra. API key của bạn được mã hoá khi lưu trữ.",
        },
      },
      {
        "@type": "Question",
        name: "Có hỗ trợ kỹ thuật không?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Có, chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua chat và email. Khách hàng doanh nghiệp còn được phân account manager riêng và kênh hỗ trợ ưu tiên.",
        },
      },
    ],
  },
];

export default function Home() {
  return (
    <main className="flex w-full flex-col overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <UseCasesSection />
      <PopularModelsSection />
      <WhyChooseSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
