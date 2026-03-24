export type PricingCategory = "chat" | "video" | "image" | "music";

export const USD_TO_VND = 26000;

export const pricingCategoryTabs: { id: "all" | PricingCategory; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "chat", label: "Chat" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "music", label: "Music" },
];
