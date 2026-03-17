"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  User,
  Key,
  CreditCard,
  Settings,
  LogOut,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import ThemeToggle from "../shared/ThemeToggle";
import { useUser, useLogout } from "@/hooks/use-auth";

const menuItems = [
  {
    label: "Hồ sơ",
    href: "/profile",
    icon: User,
  },
  {
    label: "Market",
    href: "/market",
    icon: ShoppingCart,
  },
  {
    label: "API Keys",
    href: "/api-keys",
    icon: Key,
  },
  {
    label: "Thanh toán",
    href: "/billing",
    icon: CreditCard,
  },
  {
    label: "Cài đặt",
    href: "/settings",
    icon: Settings,
  },
];

export default function HeaderActions() {
  const { data: user, isSuccess: isLoggedIn, isLoading } = useUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const avatarSrc =
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? "")}&background=random&color=fff&size=64&bold=true`;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      {isLoading ? (
        <div className="size-8 animate-pulse rounded-full bg-muted" />
      ) : isLoggedIn ? (
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="cursor-pointer overflow-hidden rounded-full transition-opacity hover:opacity-90 flex items-center"
          >
            <Image
              src={avatarSrc}
              alt={user?.name ?? ""}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          </button>

          {/* User dropdown */}
          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-xl">
              {/* User info */}
              <div className="border-b border-border px-3 py-2.5">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    logout.mutate();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-accent"
                >
                  <LogOut className="size-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/register"
          className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 lg:inline-flex"
        >
          Bắt đầu
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
