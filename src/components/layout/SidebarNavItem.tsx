"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem as NavItem } from "@/types/market";

interface SidebarNavItemProps {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export default function SidebarNavItem({
  item,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive =
    !item.external && (pathname === item.href || pathname.startsWith(item.href + "/"));
  const Icon = item.icon;

  const cls = `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
    isActive
      ? "bg-primary/10 text-primary shadow-sm"
      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
  }`;

  const content = (
    <>
      <Icon className={`size-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
      <span
        className={`truncate whitespace-nowrap transition-[width,opacity] duration-300 ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}
      >
        {item.label}
      </span>
      {item.badge && (
        <span
          className={`ml-auto whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground transition-all duration-300 ${collapsed ? "w-0 overflow-hidden px-0 opacity-0" : "opacity-100"}`}
        >
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={cls}
        title={collapsed ? item.label : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cls}
      title={collapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
}
