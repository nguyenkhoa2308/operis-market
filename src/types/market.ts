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
  pricingDisplay?: string;
  image?: string;
  gradient: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface ModelFieldOption {
  id: string;
  label: string;
  value: string;
}

export interface ModelPlaygroundField {
  id: string;
  name: string;
  label: string;
  type: "textarea" | "select" | "options" | "toggle" | "file" | "number";
  description: string | null;
  required: boolean;
  placeholder: string | null;
  defaultValue: string | null;
  sortOrder: number;
  modelFieldOptions: ModelFieldOption[];
}

export interface ModelPricingTier {
  id: string;
  name: string;
  category: string;
  provider: string;
  credits: number;
  creditUnit: string;
  ourPrice: number;
  marketPrice: number | null;
}

export interface ModelDetail extends Model {
  modelPlaygroundFields: ModelPlaygroundField[];
  modelPricingTiers: ModelPricingTier[];
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
