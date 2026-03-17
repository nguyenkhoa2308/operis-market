import type { LucideIcon } from "lucide-react";

export type ModelCategory = "video" | "image" | "music" | "chat";

export interface Model {
  id: string;
  name: string;
  slug: string;
  provider: string;
  description: string;
  category: ModelCategory;
  tags: string[];
  taskTags: string[];
  pricing: string;
  image?: string;
  gradient: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface BannerSlide {
  id: string;
  modelName: string;
  description: string;
  tags: string[];
  image?: string;
  href: string;
  gradient: string;
}

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}
