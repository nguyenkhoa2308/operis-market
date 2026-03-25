"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { useDebounce } from "@/hooks/useDebounce";
import { Search, X, SlidersHorizontal } from "lucide-react";
import FadeIn from "@/components/shared/FadeIn";
import { useModels, useFilters } from "@/hooks/use-models";
import ModelCard from "./ModelCard";
import ModelCardSkeleton from "./ModelCardSkeleton";

type FilterTab = "tasks" | "providers";

const categoryColors: Record<
  string,
  { text: string; activeBg: string; activeBorder: string }
> = {
  "video-generation": {
    text: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-500 text-white border-emerald-500",
    activeBorder: "border-emerald-500/40",
  },
  "image-generation": {
    text: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-500 text-white border-emerald-500",
    activeBorder: "border-emerald-500/40",
  },
  "music-generation": {
    text: "text-orange-400",
    activeBg: "bg-orange-500 text-white border-orange-500",
    activeBorder: "border-orange-500/40",
  },
  chat: {
    text: "text-violet-400",
    activeBg: "bg-violet-500 text-white border-violet-500",
    activeBorder: "border-violet-500/40",
  },
};

const categoryLabels: Record<string, string> = {
  // video: "Video",
  image: "Image",
  // music: "Music",
  chat: "Chat",
};

const PAGE_SIZE = 12;

export default function MarketContent() {
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => {
      const param = searchParams.get("category") || "";
      return new Set(param ? param.split(",").filter(Boolean) : []);
    },
  );
  const [activeTab, setActiveTab] = useState<FilterTab>("tasks");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const categoryValue =
    selectedCategories.size > 0 ? [...selectedCategories].join(",") : undefined;

  const { data: modelsData, isLoading: modelsLoading } = useModels({
    q: debouncedSearch || undefined,
    category: categoryValue,
    taskTags: selectedTags.size > 0 ? [...selectedTags].join(",") : undefined,
    provider:
      selectedProviders.size > 0 ? [...selectedProviders].join(",") : undefined,
    page,
    limit: PAGE_SIZE,
  });
  const { data: filtersData } = useFilters();
  const allModels = modelsData?.data ?? [];

  const pagination = modelsData?.pagination;
  const taskCategories = filtersData?.categories ?? [];
  const providerList = filtersData?.providers ?? [];

  const handleTagToggle = useCallback((tagId: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
    setPage(1);
  }, []);

  const handleProviderToggle = useCallback((provider: string) => {
    setSelectedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(provider)) next.delete(provider);
      else next.add(provider);
      return next;
    });
    setPage(1);
  }, []);

  const handleCategoryToggle = useCallback((key: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setPage(1);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedTags(new Set());
    setSelectedProviders(new Set());
    setPage(1);
  }, []);

  const taskCount = taskCategories.reduce(
    (sum, cat) => sum + cat.options.length,
    0,
  );

  const hasFilters = selectedTags.size > 0 || selectedProviders.size > 0;

  const filteredModels = allModels;

  return (
    <div className="flex gap-6">
      {/* Sidebar filter */}
      <FadeIn
        direction="left"
        distance={20}
        duration={400}
        className="hidden lg:block"
      >
        <div className="w-[300px] shrink-0 space-y-4 self-start lg:sticky lg:top-6">
          {/* Category card */}
          <div className="rounded-2xl border border-border p-5">
            <h4 className="mb-3 text-sm font-bold text-foreground">Danh mục</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories(new Set());
                  setPage(1);
                }}
                className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                  selectedCategories.size === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                Tất cả
              </button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryToggle(key)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                    selectedCategories.has(key)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks/Providers card */}
          <div className="rounded-2xl border border-border p-5">
            {/* Tabs */}
            <div className="mb-6 inline-flex rounded-full border border-border p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab("tasks")}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === "tasks"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tasks ({taskCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("providers")}
                className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === "providers"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Providers ({providerList.length})
              </button>
            </div>

            {/* Tasks tab */}
            {activeTab === "tasks" && (
              <nav className="space-y-6">
                {taskCategories.map((category) => {
                  const colors = categoryColors[category.id];
                  return (
                    <div key={category.id}>
                      <h4
                        className={`mb-3 text-sm font-bold ${colors?.text ?? "text-foreground"}`}
                      >
                        {category.label}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.options.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleTagToggle(option.id)}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                              selectedTags.has(option.id)
                                ? (colors?.activeBg ??
                                  "border-primary bg-primary text-primary-foreground")
                                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </nav>
            )}

            {/* Providers tab */}
            {activeTab === "providers" && (
              <div className="flex flex-wrap gap-2">
                {providerList.map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => handleProviderToggle(provider)}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                      selectedProviders.has(provider)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            )}

            {/* Clear all */}
            {hasFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-6 cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Xoá bộ lọc
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Header + Filter button + Search */}
        <div className="mb-5 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {selectedCategories.size > 0
                  ? `${[...selectedCategories].map((c) => categoryLabels[c] ?? c).join(", ")} Models`
                  : "Tất cả Models"}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Tìm thấy {pagination?.total ?? filteredModels.length} model
              </p>
            </div>
            {/* Filter button — inline on mobile */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent lg:hidden"
            >
              <SlidersHorizontal className="size-4" />
              Bộ lọc
              {hasFilters && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {selectedTags.size + selectedProviders.size}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm model..."
              className="h-10 w-full rounded-full border border-border bg-background-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Category chips */}
        {selectedCategories.size > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Danh mục:</span>
            {[...selectedCategories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryToggle(cat)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
              >
                {categoryLabels[cat] ?? cat}
                <X className="size-3.5" />
              </button>
            ))}
          </div>
        )}

        {/* Active filter chips (mobile) */}
        {hasFilters && (
          <div className="mb-3 flex flex-wrap gap-1.5 lg:hidden">
            {[...selectedTags].map((tagId) => {
              const label = taskCategories
                .flatMap((c) => c.options)
                .find((o) => o.id === tagId)?.label;
              return label ? (
                <button
                  key={tagId}
                  type="button"
                  onClick={() => handleTagToggle(tagId)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                >
                  {label}
                  <X className="size-3" />
                </button>
              ) : null;
            })}
            {[...selectedProviders].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderToggle(p)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
              >
                {p}
                <X className="size-3" />
              </button>
            ))}
            <button
              type="button"
              title="Xoá tất cả bộ lọc"
              onClick={handleClearAll}
              className="cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium text-primary"
            >
              Xoá tất cả
            </button>
          </div>
        )}

        {/* Mobile filter sheet */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setMobileFilterOpen(false)}
              role="button"
              tabIndex={-1}
              aria-label="Close filters"
              onKeyDown={(e) =>
                e.key === "Escape" && setMobileFilterOpen(false)
              }
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-5 shadow-xl animate-in slide-in-from-bottom duration-300">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Bộ lọc</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {}
                  <X className="size-5" />
                </button>
              </div>

              {/* Tasks */}
              <div className="space-y-4">
                {taskCategories.map((category) => {
                  const colors = categoryColors[category.id];
                  return (
                    <div key={category.id}>
                      <h4
                        className={`mb-2 text-sm font-bold ${colors?.text ?? "text-foreground"}`}
                      >
                        {category.label}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {category.options.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleTagToggle(option.id)}
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                              selectedTags.has(option.id)
                                ? (colors?.activeBg ??
                                  "border-primary bg-primary text-primary-foreground")
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Providers */}
              <div className="mt-5 border-t border-border pt-4">
                <h4 className="mb-2 text-sm font-bold text-foreground">
                  Providers
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {providerList.map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => handleProviderToggle(provider)}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedProviders.has(provider)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex-1 cursor-pointer rounded-full border border-border py-2.5 text-sm font-medium text-foreground"
                  >
                    Xoá bộ lọc
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 cursor-pointer rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Xem {filteredModels.length} kết quả
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {modelsLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <ModelCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Không tìm thấy model nào
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dot-${i}`} className="px-1 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
