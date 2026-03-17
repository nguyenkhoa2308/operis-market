"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Settings,
  LogOut,
  LogIn,
  X,
} from "lucide-react";
import { sidebarNavItems } from "@/data/dashboard-nav";
import SidebarNavItem from "./SidebarNavItem";
import SidebarUserProfile from "./SidebarUserProfile";
import Image from "next/image";
import { useUser, useLogout } from "@/hooks/use-auth";

interface DashboardSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function DashboardSidebar({ mobileOpen, setMobileOpen }: DashboardSidebarProps) {
  const { data: user, isSuccess: isLoggedIn } = useUser();
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);

  const [closing, setClosing] = useState(false);

  const closeMobile = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setClosing(false);
    }, 250);
  }, [setMobileOpen]);

  // Scroll lock
  useEffect(() => {
    if (mobileOpen) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [mobileOpen]);

  const sidebarContent = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-5 py-5">
        <Link
          href="/"
          className={`flex items-center whitespace-nowrap text-xl font-bold text-foreground transition-all duration-300 ${collapsed ? "pointer-events-none w-0 opacity-0" : "w-auto opacity-100"}`}
        >
          <Image
            src="/images/logo.webp"
            alt="Operis Market"
            width={38}
            height={38}
            className="shrink-0"
          />
          <span>
            Operis<span className="text-blue-400">Market</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>
      </div>

      {/* User profile — only when logged in */}
      {isLoggedIn && user && <SidebarUserProfile collapsed={collapsed} user={user} />}

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {sidebarNavItems.map((item) => (
          <SidebarNavItem key={item.id} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-1 border-t border-border px-3 py-4">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title={collapsed ? "Hồ sơ" : undefined}
        >
          <User className="size-5 shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}
          >
            Hồ sơ
          </span>
        </Link>
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title={collapsed ? "Cài đặt" : undefined}
        >
          <Settings className="size-5 shrink-0" />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}
          >
            Cài đặt
          </span>
        </Link>

        {/* Login / Logout */}
        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => { onNavigate?.(); logout.mutate(); }}
            className="flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
            title={collapsed ? "Đăng xuất" : undefined}
          >
            <LogOut className="size-5 shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}
            >
              Đăng xuất
            </span>
          </button>
        ) : (
          <Link
            href="/login"
            onClick={onNavigate}
            className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title={collapsed ? "Đăng nhập" : undefined}
          >
            <LogIn className="size-5 shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"}`}
            >
              Đăng nhập
            </span>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {(mobileOpen || closing) && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-250 ${closing ? "opacity-0" : "animate-in fade-in duration-300"}`}
            onClick={closeMobile}
          />
          <aside className={`relative h-full w-[280px] border-r border-border bg-background-secondary transition-transform duration-250 ${closing ? "-translate-x-full" : "animate-in slide-in-from-left duration-300"}`}>
            <button
              type="button"
              onClick={closeMobile}
              title="Close"
              className="absolute right-4 top-5 cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            {sidebarContent(closeMobile)}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-border bg-background-secondary transition-all duration-300 lg:block ${
          collapsed ? "w-[80px]" : "w-[280px]"
        }`}
      >
        {sidebarContent()}
      </aside>
    </>
  );
}
