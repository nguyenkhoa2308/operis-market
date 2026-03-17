import type { Metadata } from "next";
import FeaturedBanner from "@/components/market/FeaturedBanner";
import MarketContent from "@/components/market/MarketContent";

export const metadata: Metadata = {
  title: "Market",
  description:
    "Khám phá và so sánh các model AI cho video, hình ảnh, nhạc và chat. Lọc theo task, provider và tìm kiếm nhanh.",
};

export default function MarketPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:pt-8">
      <FeaturedBanner />
      <MarketContent />
    </div>
  );
}
