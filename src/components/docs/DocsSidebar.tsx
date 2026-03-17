"use client";

import { useEffect, useState } from "react";

export interface DocSection {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

interface DocsSidebarProps {
  sections: DocSection[];
}

export default function DocsSidebar({ sections }: DocsSidebarProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const allIds = sections.flatMap((s) => [s.id, ...(s.children?.map((c) => c.id) ?? [])]);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0% -70% 0%", threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="space-y-1">
      {sections.map((section) => (
        <div key={section.id}>
          <button
            type="button"
            onClick={() => handleClick(section.id)}
            className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
              activeId === section.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {section.label}
          </button>
          {section.children?.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => handleClick(child.id)}
              className={`w-full text-left rounded-lg pl-6 pr-3 py-1.5 text-xs transition-colors ${
                activeId === child.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {child.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}
