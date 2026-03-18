"use client";

import { useState } from "react";
import { Search, Clock, Tag, ChevronDown } from "lucide-react";
import { useUpdates, useUpdateTags } from "@/hooks/use-updates";
import { useDebounce } from "@/hooks/useDebounce";

export default function ApiUpdatesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedTag, setSelectedTag] = useState("All APIs");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  const { data: updatesData, isLoading } = useUpdates({ limit: 100 });
  const { data: tagsData } = useUpdateTags();
  const allUpdates = updatesData?.data ?? [];
  const apiTags = ["All APIs", ...(tagsData?.map((t) => t.name) ?? [])];

  const filtered = allUpdates.filter((update) => {
    if (selectedTag !== "All APIs" && update.tag !== selectedTag) return false;
    if (debouncedSearch && !update.title.toLowerCase().includes(debouncedSearch.toLowerCase()) && !update.content.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">API Updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cập nhật mới nhất về các thay đổi và cải tiến API
        </p>
      </div>

      {/* Search + Filter */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm cập nhật... (Enter để tìm)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background-secondary pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Tag filter dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background-secondary px-4 text-sm text-foreground transition-colors hover:bg-accent sm:w-[200px]"
          >
            <span>{selectedTag}</span>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${tagDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {tagDropdownOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-full overflow-hidden rounded-xl border border-border bg-background shadow-lg sm:w-[200px]">
              {apiTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setSelectedTag(tag); setTagDropdownOpen(false); }}
                  className={`w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent ${
                    selectedTag === tag ? "font-medium text-primary" : "text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update cards */}
      <div className="space-y-6">
        {filtered.map((update) => (
          <article
            key={update.id}
            className="rounded-xl border border-border bg-background-secondary p-6 transition-colors"
          >
            {/* Date + Tag */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>{update.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="size-3.5 text-primary" />
                <span className="text-sm font-medium text-primary">{update.tag}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-lg font-bold text-foreground">
              {update.title}
            </h2>

            {/* Content */}
            <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {update.content.split("\n").map((line, i) => {
                // Detect links
                const linkMatch = line.match(/(https?:\/\/\S+)/);
                if (linkMatch) {
                  const parts = line.split(linkMatch[1]);
                  return (
                    <p key={i}>
                      {parts[0]}
                      <a
                        href={linkMatch[1]}
                        className="text-primary underline decoration-primary/30 hover:decoration-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {linkMatch[1]}
                      </a>
                      {parts[1]}
                    </p>
                  );
                }

                // Bold section headers (lines starting with emoji + text with no bullet)
                if (line.match(/^[✨🔥🎬🖌️🎵🚀] /)) {
                  return (
                    <p key={i} className="mt-3 font-semibold text-foreground">
                      {line}
                    </p>
                  );
                }

                // Bullet points
                if (line.startsWith("• ")) {
                  return (
                    <p key={i} className="ml-2">
                      {line}
                    </p>
                  );
                }

                // Empty lines
                if (line.trim() === "") {
                  return <br key={i} />;
                }

                return <p key={i}>{line}</p>;
              })}
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Không tìm thấy cập nhật nào
          </div>
        )}
      </div>
    </div>
  );
}
