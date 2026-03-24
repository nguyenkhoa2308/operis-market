"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";
import { Shield, FileText, RotateCcw } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  updatedDate: string;
  icon?: "privacy" | "terms" | "refund";
  sections: Section[];
  children: React.ReactNode;
}

const iconMap = {
  privacy: Shield,
  terms: FileText,
  refund: RotateCcw,
};

export default function LegalPageLayout({
  title,
  subtitle,
  updatedDate,
  icon = "terms",
  sections,
  children,
}: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const visibleIds = useRef(new Set<string>());
  const Icon = iconMap[icon];

  const childArray = Children.toArray(children).filter(isValidElement);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.current.add(entry.target.id);
          } else {
            visibleIds.current.delete(entry.target.id);
          }
        }
        for (const section of sections) {
          if (visibleIds.current.has(section.id)) {
            setActiveId(section.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleTocClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero banner */}
      <div className="relative overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 to-emerald-800 dark:from-emerald-800 dark:to-emerald-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.2),transparent_60%)]" />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          {/* Icon badge */}
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Icon className="size-8 text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
            {subtitle}
          </p>

          {/* Date badge */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-white/70 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-300" />
            Cập nhật lần cuối: {updatedDate}
          </div>
        </div>
      </div>

      {/* Content with sidebar TOC */}
      <div className="mx-auto flex max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:px-8">
        {/* Sidebar TOC */}
        <nav className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-20">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Nội dung
            </p>
            <ul className="space-y-0.5 border-l border-border">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTocClick(section.id);
                    }}
                    className={`group flex items-center gap-2.5 border-l-2 py-2.5 pl-4 text-sm transition-all ${
                      activeId === section.id
                        ? "border-emerald-500 font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-medium ${
                        activeId === section.id
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : "text-muted-foreground/50 group-hover:text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <article className="min-w-0 flex-1 [&_section_h2]:hidden [&_section_p]:text-[15px] [&_section_p]:leading-7 [&_section_p]:text-muted-foreground [&_section_ul]:text-[15px] [&_section_ul]:leading-7 [&_section_ul]:text-muted-foreground [&_section_ol]:text-[15px] [&_section_ol]:leading-7 [&_section_ol]:text-muted-foreground [&_section_li]:py-0.5">
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-20"
              >
                {/* Numbered title */}
                <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground">
                  {i + 1}. {section.title}
                </h2>
                {/* Section content */}
                {childArray[i]}
              </div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}
