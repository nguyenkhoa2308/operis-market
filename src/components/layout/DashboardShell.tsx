"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../shared/ThemeToggle";
import DashboardSidebar from "./DashboardSidebar";
import ScrollToTop from "../shared/ScrollToTop";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="min-w-0 flex-1">
        {/* Sticky mobile header */}
        <div className="sticky top-0 z-40 flex items-center border-b border-border bg-background px-4 py-2.5 lg:hidden">
          <button
            type="button"
            title="Menu"
            onClick={() => setMobileOpen(true)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/" className="ml-2 flex items-center text-base font-bold">
            <Image src="/images/logo.webp" alt="Operis Market" width={32} height={32} className="size-8" />
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {children}
      </main>

      <ScrollToTop />
    </div>
  );
}
