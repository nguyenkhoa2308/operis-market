"use client";

import { useMemo, useState } from "react";
import { Search, ArrowDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePricingList } from "@/hooks/use-models";
import { USD_TO_VND, pricingCategoryTabs } from "@/data/pricing";
import type { PricingCategory } from "@/data/pricing";

const categoryBadgeColors: Record<PricingCategory, string> = {
  chat: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  video: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  image: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  music: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

interface FlatRow {
  key: string;
  model: string;
  category: PricingCategory;
  provider: string;
  unit: string;
  inputPrice: number;
  outputPrice: number | null;
  inputOfficial: number | null;
  outputOfficial: number | null;
}

function formatUSD(price: number): string {
  return `$${price}`;
}

function formatVND(usd: number): string {
  const vnd = Math.round(usd * USD_TO_VND);
  return vnd.toLocaleString("vi-VN") + "đ";
}

function calcDiscount(ourPrice: number, officialPrice: number | null): string | null {
  if (officialPrice === null || officialPrice === 0) return null;
  const pct = Math.round(((officialPrice - ourPrice) / officialPrice) * 100);
  return `~${pct}%`;
}

function PaginationBar({
  rowsPerPage,
  onRowsPerPageChange,
  start,
  end,
  total,
  page,
  totalPages,
  onPageChange,
  getPageNumbers,
}: {
  rowsPerPage: number;
  onRowsPerPageChange: (val: number) => void;
  start: number;
  end: number;
  total: number;
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
          {start}-{end} / {total}
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
            <span key={`dots-${i}`} className="px-1 text-xs text-muted-foreground">
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
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const { data, isLoading } = usePricingList({
    category: activeCategory === "all" ? undefined : activeCategory,
    q: debouncedSearch || undefined,
    page,
    limit: rowsPerPage,
  });

  const categoryCounts = data?.counts || { all: 0, chat: 0, video: 0, image: 0, music: 0 };

  // Flatten models → rows (1 row per model+tier)
  const rows: FlatRow[] = useMemo(() => {
    if (!data?.models) return [];
    const flat: FlatRow[] = [];
    for (const model of data.models) {
      if (model.prices.length === 0) {
        flat.push({
          key: model.id,
          model: model.name,
          category: model.category as PricingCategory,
          provider: model.provider,
          unit: "1M tokens",
          inputPrice: 0,
          outputPrice: null,
          inputOfficial: null,
          outputOfficial: null,
        });
      } else {
        for (const tier of model.prices) {
          flat.push({
            key: `${model.id}-${tier.id}`,
            model: model.prices.length > 1 ? `${model.name} (${tier.name})` : model.name,
            category: (tier.category || model.category) as PricingCategory,
            provider: tier.provider || model.provider,
            unit: tier.unit,
            inputPrice: tier.inputPrice,
            outputPrice: tier.outputPrice,
            inputOfficial: tier.inputOfficial,
            outputOfficial: tier.outputOfficial,
          });
        }
      }
    }
    return flat;
  }, [data]);

  const total = data?.pagination?.total || rows.length;
  const apiTotalPages = data?.pagination?.totalPages || 1;
  const safePageNum = Math.min(page, apiTotalPages);
  const displayStart = total === 0 ? 0 : (safePageNum - 1) * rowsPerPage + 1;
  const displayEnd = Math.min(safePageNum * rowsPerPage, total);

  const handleCategoryChange = (cat: "all" | PricingCategory) => {
    setActiveCategory(cat);
    setPage(1);
  };
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (apiTotalPages <= 7) {
      for (let i = 1; i <= apiTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePageNum > 3) pages.push("...");
      const s = Math.max(2, safePageNum - 1);
      const e = Math.min(apiTotalPages - 1, safePageNum + 1);
      for (let i = s; i <= e; i++) pages.push(i);
      if (safePageNum < apiTotalPages - 2) pages.push("...");
      pages.push(apiTotalPages);
    }
    return pages;
  };

  const isChat = (m: FlatRow) => m.category === "chat";

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Bảng giá</h1>
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
                <span className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
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
      {apiTotalPages > 1 && (
        <div className="mb-4">
          <PaginationBar
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(1); }}
            start={displayStart}
            end={displayEnd}
            total={total}
            page={safePageNum}
            totalPages={apiTotalPages}
            onPageChange={setPage}
            getPageNumbers={getPageNumbers}
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Desktop Table */}
      {!isLoading && (
        <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Model</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Input (Operis)</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Output (Operis)</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Input Official</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Output Official</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Rẻ hơn (Input)</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Rẻ hơn (Output)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((m) => {
                const inputDiscount = calcDiscount(m.inputPrice, m.inputOfficial);
                const outputDiscount = isChat(m) && m.outputPrice ? calcDiscount(m.outputPrice, m.outputOfficial) : null;
                return (
                  <tr key={m.key} className="transition-colors hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-foreground">{m.model}</span>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${categoryBadgeColors[m.category] || ""}`}>
                            {m.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{m.provider}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-500">{formatVND(m.inputPrice)} <span className="text-xs font-normal text-muted-foreground">/ {m.unit}</span></span>
                        <span className="text-xs text-muted-foreground">{formatUSD(m.inputPrice)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isChat(m) && m.outputPrice ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-emerald-500">{formatVND(m.outputPrice)} <span className="text-xs font-normal text-muted-foreground">/ {m.unit}</span></span>
                          <span className="text-xs text-muted-foreground">{formatUSD(m.outputPrice)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {m.inputOfficial !== null ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">{formatUSD(m.inputOfficial)}</span>
                          <span className="text-[11px] text-muted-foreground/60">/ {m.unit}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isChat(m) && m.outputOfficial !== null ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">{formatUSD(m.outputOfficial)}</span>
                          <span className="text-[11px] text-muted-foreground/60">/ {m.unit}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inputDiscount ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500">
                          <ArrowDown className="size-3" />
                          {inputDiscount}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {outputDiscount ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500">
                          <ArrowDown className="size-3" />
                          {outputDiscount}
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
        </div>
      )}

      {/* Mobile Cards */}
      {!isLoading && (
        <div className="space-y-3 md:hidden">
          {rows.map((m) => {
            const inputDiscount = calcDiscount(m.inputPrice, m.inputOfficial);
            const outputDiscount = isChat(m) && m.outputPrice ? calcDiscount(m.outputPrice, m.outputOfficial) : null;
            return (
              <div key={m.key} className="overflow-hidden rounded-xl border border-border">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{m.model}</span>
                    <span className="text-[11px] text-muted-foreground">{m.provider} · / {m.unit}</span>
                  </div>
                  <span className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-medium ${categoryBadgeColors[m.category] || ""}`}>
                    {m.category}
                  </span>
                </div>
                <div className="space-y-2 px-4 py-3">
                  {/* Input */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Input</span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-500">{formatVND(m.inputPrice)}</div>
                        <div className="text-[10px] text-muted-foreground">{formatUSD(m.inputPrice)}</div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">vs {m.inputOfficial !== null ? formatUSD(m.inputOfficial) : "N/A"}</span>
                      {inputDiscount && (
                        <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-500">
                          <ArrowDown className="size-2.5" />
                          {inputDiscount}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Output (chat only) */}
                  {isChat(m) && m.outputPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Output</span>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-500">{formatVND(m.outputPrice)}</div>
                          <div className="text-[10px] text-muted-foreground">{formatUSD(m.outputPrice)}</div>
                        </div>
                        <span className="text-[10px] text-muted-foreground">vs {m.outputOfficial !== null ? formatUSD(m.outputOfficial) : "N/A"}</span>
                        {outputDiscount && (
                          <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-500">
                            <ArrowDown className="size-2.5" />
                            {outputDiscount}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && rows.length === 0 && (
        <div className="flex items-center justify-center rounded-xl border border-border py-20">
          <p className="text-sm text-muted-foreground">Không tìm thấy model nào.</p>
        </div>
      )}

      {/* Bottom pagination */}
      <div className="mt-4">
        <PaginationBar
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(1); }}
          start={displayStart}
          end={displayEnd}
          total={total}
          page={safePageNum}
          totalPages={apiTotalPages}
          onPageChange={setPage}
          getPageNumbers={getPageNumbers}
        />
      </div>
    </div>
  );
}
