"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

const navLinks = [
  { id: 1, label: "Thị trường API", href: "/market" },
  { id: 2, label: "Bảng giá", href: "/pricing" },
  {
    id: 3,
    label: "API Video AI",
    children: [
      { id: 1, label: "Sora 2.0", href: "/market/sora-2" },
      { id: 2, label: "Veo 3 API", href: "/market/veo-3-api" },
      { id: 3, label: "Runway Aleph", href: "/market/runway-aleph" },
    ],
  },
  {
    id: 4,
    label: "API Hình ảnh AI",
    children: [
      { id: 1, label: "4o Image API", href: "/market/4o-image" },
      { id: 2, label: "Flux Kontext", href: "/market/flux-kontext" },
      { id: 3, label: "Nano Banana", href: "/market/nano-banana" },
    ],
  },
  { id: 5, label: "Cập nhật", href: "/updates" },
  { id: 6, label: "API Docs", href: "/docs" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const close = () => {
    setOpen(false);
    setExpandedId(null);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
      >
        <Menu className="size-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 animate-in fade-in duration-300 bg-black/50 backdrop-blur-sm"
            onClick={close}
            onKeyDown={(e) => e.key === "Escape" && close()}
            role="button"
            tabIndex={-1}
            aria-label="Close menu"
          />

          {/* Panel */}
          <nav className="relative z-10 flex h-full w-72 flex-col bg-background shadow-xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-bold text-foreground">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navLinks.map((link) =>
                  link.children ? (
                    <li key={link.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expandedId === link.id ? null : link.id)
                        }
                        className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-4 text-muted-foreground transition-transform duration-200 ${
                            expandedId === link.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedId === link.id && (
                        <ul className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                          {link.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.href}
                                onClick={close}
                                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Auth buttons */}
            <div className="border-t border-border p-4 space-y-2">
              <Link
                href="/login"
                onClick={close}
                className="block w-full rounded-lg border border-border py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Đăng ký
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
