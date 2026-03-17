"use client";

import { useMemo, useState } from "react";
import { Search, Info, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
// TODO: Replace with API hook when BE adds a bulk pricing endpoint (GET /pricing)
// Currently no single endpoint returns all models with their pricing tiers
import { pricingGroups, pricingCategoryTabs } from "@/data/pricing";
import type { PricingCategory } from "@/data/pricing";

const categoryBadgeColors: Record<PricingCategory, string> = {
  chat: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  video: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  image: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  music: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

function formatPrice(price: number): string {
  return `$${price}`;
}

function calcDiscount(ourPrice: number, marketPrice: number | null): string | null {
  if (marketPrice === null || marketPrice === 0) return null;
  const pct = ((ourPrice - marketPrice) / marketPrice) * 100;
  return `${pct.toFixed(1)}%`;
}

function PaginationBar({
  rowsPerPage,
  onRowsPerPageChange,
  tierStart,
  tierEnd,
  totalTiers,
  page,
  totalPages,
  onPageChange,
  getPageNumbers,
}: {
  rowsPerPage: number;
  onRowsPerPageChange: (val: number) => void;
  tierStart: number;
  tierEnd: number;
  totalTiers: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  getPageNumbers: () => (number | "...")[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Số dòng:</span>
        <select
          title="Rows per page"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="cursor-pointer rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          {ROWS_PER_PAGE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="ml-2 text-xs text-muted-foreground">
          {tierStart}-{tierEnd} of {totalTiers}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          title="Previous page"
          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="px-1 text-xs text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`size-8 cursor-pointer rounded-lg text-xs font-medium transition-colors ${
                page === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          title="Next page"
          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | PricingCategory>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Count tiers per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const group of pricingGroups) {
      for (const tier of group.tiers) {
        counts.all = (counts.all || 0) + 1;
        counts[tier.category] = (counts[tier.category] || 0) + 1;
      }
    }
    return counts;
  }, []);

  // Filter groups + their tiers
  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase();
    const result: { id: string; model: string; tiers: typeof pricingGroups[0]["tiers"] }[] = [];

    for (const group of pricingGroups) {
      let tiers = group.tiers;
      if (activeCategory !== "all") {
        tiers = tiers.filter((t) => t.category === activeCategory);
      }
      if (q) {
        const matchModel = group.model.toLowerCase().includes(q);
        if (!matchModel) {
          tiers = tiers.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.provider.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }
      }
      if (tiers.length > 0) {
        result.push({ id: group.id, model: group.model, tiers });
      }
    }
    return result;
  }, [activeCategory, search]);

  // Total tier count across all filtered groups
  const totalTiers = filteredGroups.reduce((sum, g) => sum + g.tiers.length, 0);

  // Paginate by groups, accumulating tier count up to rowsPerPage
  const { pageGroups, totalPages, tierStart, tierEnd } = useMemo(() => {
    // Build pages: each page accumulates groups until tier count >= rowsPerPage
    const pages: typeof filteredGroups[] = [];
    let current: typeof filteredGroups = [];
    let currentTierCount = 0;

    for (const group of filteredGroups) {
      // If adding this group would exceed limit AND we already have some groups, start new page
      if (currentTierCount > 0 && currentTierCount + group.tiers.length > rowsPerPage) {
        pages.push(current);
        current = [group];
        currentTierCount = group.tiers.length;
      } else {
        current.push(group);
        currentTierCount += group.tiers.length;
      }
    }
    if (current.length > 0) pages.push(current);
    if (pages.length === 0) pages.push([]);

    const tp = pages.length;
    const safePage = Math.min(page, tp);
    const pg = pages[safePage - 1] || [];

    // Calculate tier range for display
    let start = 0;
    for (let i = 0; i < safePage - 1; i++) {
      start += pages[i].reduce((s, g) => s + g.tiers.length, 0);
    }
    const end = start + pg.reduce((s, g) => s + g.tiers.length, 0);

    return { pageGroups: pg, totalPages: tp, tierStart: start + 1, tierEnd: end };
  }, [filteredGroups, rowsPerPage, page]);

  const safePageNum = Math.min(page, totalPages);

  // Reset page on filter/search change
  const handleCategoryChange = (cat: "all" | PricingCategory) => {
    setActiveCategory(cat);
    setPage(1);
  };
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Page numbers
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePageNum > 3) pages.push("...");
      const start = Math.max(2, safePageNum - 1);
      const end = Math.min(totalPages - 1, safePageNum + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePageNum < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Bảng giá
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Các model AI hàng đầu thế giới, mức giá cực kỳ hợp lý.
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {pricingCategoryTabs.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
                <span
                  className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo model, loại hoặc nhà cung cấp..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Top pagination */}
      {totalPages > 1 && (
        <div className="mb-4">
          <PaginationBar
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(1); }}
            tierStart={tierStart}
            tierEnd={tierEnd}
            totalTiers={totalTiers}
            page={safePageNum}
            totalPages={totalPages}
            onPageChange={setPage}
            getPageNumbers={getPageNumbers}
          />
        </div>
      )}

      {/* Grouped pricing cards */}
      <div className="space-y-4">
        {pageGroups.map((group) => (
          <div
            key={group.id}
            className="overflow-hidden rounded-xl border border-border"
          >
            {/* Group header */}
            <div className="flex items-center gap-3 border-b border-border px-6 py-3.5">
              <span className="text-base font-bold text-foreground">
                {group.model}
              </span>
              <span className="text-xs font-medium text-primary">
                {group.tiers.length} mức giá
              </span>
            </div>

            {/* Desktop Table */}
            <table className="hidden w-full md:table">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-6 py-2 text-left text-xs font-medium text-muted-foreground">
                    Model &amp; Loại
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      Credits / Lần
                      <Info className="size-3 text-muted-foreground/50" />
                    </span>
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-muted-foreground">
                    Giá của chúng tôi (USD)
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-muted-foreground">
                    Giá thị trường (USD)
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      GIẢM GIÁ
                      <Info className="size-3 text-muted-foreground/50" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {group.tiers.map((tier, idx) => {
                  const discount = calcDiscount(tier.ourPrice, tier.marketPrice);
                  return (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-muted/10"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-foreground">
                            {tier.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${categoryBadgeColors[tier.category]}`}
                            >
                              {tier.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {tier.provider}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {tier.credits}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {tier.creditUnit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm font-bold text-emerald-500">
                          {formatPrice(tier.ourPrice)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        {tier.marketPrice !== null ? (
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(tier.marketPrice)}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {discount ? (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500">
                            {discount}
                            <ArrowDown className="size-3" />
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="divide-y divide-border md:hidden">
              {group.tiers.map((tier, idx) => {
                const discount = calcDiscount(tier.ourPrice, tier.marketPrice);
                return (
                  <div key={idx} className="space-y-2 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{tier.name}</span>
                      <span
                        className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${categoryBadgeColors[tier.category]}`}
                      >
                        {tier.category}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{tier.provider}</div>
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/20 px-3 py-2">
                      <div>
                        <div className="text-[10px] text-muted-foreground">Credits</div>
                        <div className="text-xs font-semibold text-foreground">{tier.credits}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Giá</div>
                        <div className="text-xs font-bold text-emerald-500">{formatPrice(tier.ourPrice)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">Giảm</div>
                        {discount ? (
                          <div className="flex items-center gap-0.5 text-xs font-semibold text-rose-500">
                            {discount}
                            <ArrowDown className="size-2.5" />
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">—</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {pageGroups.length === 0 && (
          <div className="flex items-center justify-center rounded-xl border border-border py-20">
            <p className="text-sm text-muted-foreground">
              Không tìm thấy model nào.
            </p>
          </div>
        )}
      </div>

      {/* Bottom pagination */}
      <div className="mt-4">
        <PaginationBar
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(1); }}
          tierStart={tierStart}
          tierEnd={tierEnd}
          totalTiers={totalTiers}
          page={safePageNum}
          totalPages={totalPages}
          onPageChange={setPage}
          getPageNumbers={getPageNumbers}
        />
      </div>
    </div>
  );
}
