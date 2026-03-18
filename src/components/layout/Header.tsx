"use client";

import Link from "next/link";
import {
  ChevronDown,
  Video,
  Clapperboard,
  Film,
  ImageIcon,
  Sparkles,
  Paintbrush,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import HeaderActions from "./HeaderActions";
import MobileNav from "./MobileNav";

const navLinks = [
  { id: 1, label: "Thị trường API", href: "/market" },
  { id: 2, label: "Bảng giá", href: "/pricing" },
  {
    id: 3,
    label: "API Video AI",
    children: [
      {
        id: 1,
        label: "Sora 2.0",
        description: "Mô hình tạo video của OpenAI",
        href: "/sora-2",
        icon: Video,
      },
      {
        id: 2,
        label: "Veo 3 API",
        description: "Video điện ảnh từ Google DeepMind",
        href: "/veo-3-api",
        icon: Clapperboard,
      },
      {
        id: 3,
        label: "Runway Aleph",
        description: "Chỉnh sửa video theo ngữ cảnh",
        href: "/runway-aleph",
        icon: Film,
      },
    ],
  },
  {
    id: 4,
    label: "API Hình ảnh AI",
    children: [
      {
        id: 1,
        label: "4o Image API",
        description: "Tạo hình ảnh chất lượng cao từ GPT-4o",
        href: "/4o-image",
        icon: ImageIcon,
      },
      {
        id: 2,
        label: "Flux Kontext",
        description: "Tạo ảnh nhất quán chủ thể",
        href: "/flux-kontext",
        icon: Sparkles,
      },
      {
        id: 3,
        label: "Nano Banana",
        description: "Chỉnh sửa ảnh AI nhanh chóng",
        href: "/nano-banana",
        icon: Paintbrush,
      },
    ],
  },
  { id: 5, label: "Cập nhật", href: "/updates" },
  { id: 6, label: "API Docs", href: "/docs" },
];

export default function Header() {
  const [hiddenDropdown, setHiddenDropdown] = useState<number | null>(null);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <Link
          href="/"
          className="flex items-center text-base font-bold sm:text-xl"
        >
          <Image
            src="/images/logo.webp"
            alt="Operis Market"
            width={42}
            height={42}
            className="size-8 sm:size-[42px]"
          />
          <span className="hidden sm:inline">
            Operis<span className="text-blue-400">Market</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.id} className="group relative" onMouseLeave={() => setHiddenDropdown(null)}>
                  <button
                    type="button"
                    aria-haspopup="true"
                    className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium text-foreground-muted transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                    <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180 group-has-[:focus-visible]:rotate-180" />
                  </button>

                  {/* Dropdown */}
                  <div className={`invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 ${hiddenDropdown === link.id ? "" : "group-hover:visible group-hover:opacity-100"} group-has-[:focus-visible]:visible group-has-[:focus-visible]:opacity-100`}>
                    <div className="rounded-xl border border-border bg-popover p-2 shadow-xl">
                      {link.children.map((child) => {
                        const Icon = child.icon;
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={() => setHiddenDropdown(link.id)}
                            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                          >
                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                              <Icon className="size-4 text-foreground-muted" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {child.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {child.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-[15px] font-medium text-foreground-muted transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <HeaderActions />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
