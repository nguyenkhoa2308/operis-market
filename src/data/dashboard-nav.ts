import {
  Store,
  Bell,
  CreditCard,
  Receipt,
  ScrollText,
  Key,
  BarChart3,
  BookOpen,
  MessageSquarePlus,
} from "lucide-react";
import type { SidebarNavItem } from "@/types/market";

export const sidebarNavItems: SidebarNavItem[] = [
  { id: "market", label: "Market", href: "/market", icon: Store },
  { id: "updates", label: "Cập nhật", href: "/updates", icon: Bell },
  { id: "pricing", label: "Bảng giá", href: "/pricing", icon: CreditCard },
  { id: "billing", label: "Thanh toán", href: "/billing", icon: Receipt },
  { id: "logs", label: "Nhật ký", href: "/logs", icon: ScrollText },
  { id: "api-keys", label: "API Keys", href: "/api-keys", icon: Key },
  { id: "usage", label: "API Usage", href: "/usage", icon: BarChart3 },
  { id: "docs", label: "Docs", href: "/docs", icon: BookOpen, external: true },
  { id: "feedback", label: "Góp ý", href: "/feedback", icon: MessageSquarePlus },
];
