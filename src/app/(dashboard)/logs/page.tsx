"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import dynamic from "next/dynamic";
import {
  RefreshCw,
  Info,
  X,
  ChevronDown,
  Copy,
  Image,
  RotateCcw,
  Filter,
  Check,
  Clock,
  DollarSign,
  Download,
} from "lucide-react";
import { useLogs, type LogEntry } from "@/hooks/use-logs";
import Link from "next/link";

const DateRangePicker = dynamic(
  () => import("@/components/dashboard/DateRangePicker"),
  { ssr: false },
);

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: LogEntry["status"] }) {
  const config = {
    success: {
      dot: "bg-emerald-400",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      label: "Success",
    },
    failed: {
      dot: "bg-red-400",
      bg: "bg-red-500/10",
      text: "text-red-500 dark:text-red-400",
      label: "Failed",
    },
    processing: {
      dot: "bg-yellow-400 animate-pulse",
      bg: "bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      label: "Processing",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ─── Model badge ─── */
function ModelBadge({ model }: { model: string }) {
  return (
    <span className="inline-block rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      {model}
    </span>
  );
}

/* ─── Result button (no popup inside — popup rendered at page level) ─── */
function ResultButton({
  log,
  onHover,
}: {
  log: LogEntry;
  onHover: (url: string | null, rect?: DOMRect) => void;
}) {
  if (!log.hasResult) {
    return <span className="text-xs text-muted-foreground/40">-</span>;
  }

  const resultUrl = log.taskId;

  return (
    <div
      className="inline-flex items-center gap-2"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover(resultUrl, rect);
      }}
      onMouseLeave={() => onHover(null)}
    >
      <Link
        href={resultUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Image className="size-3.5" />
        Result
      </Link>
      <a
        href={resultUrl}
        download
        className="cursor-pointer rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        title="Download"
      >
        <Download className="size-3.5" />
      </a>
    </div>
  );
}

const modelTabs = [
  "Market",
  "Runway",
  "Suno",
  "4o Image",
  "Flux Kontext",
  "Veo",
  "Midjourney",
  "Runway Aleph",
  "Luma Modify",
];

/* ─── Copy helper ─── */
function CopyButton({ text, title }: { text: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title={title ?? "Copy"}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

/* ─── Format duration ─── */
function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/* ─── Format date/time to VN (UTC+7) ─── */
function formatVnDateTime(date: string, time: string) {
  const utc = new Date(`${date}T${time}Z`);
  const day = utc.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hour = utc.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { day, hour };
}

/* ─── Page ─── */
export default function LogsPage() {
  const [activeTab, setActiveTab] = useState("Market");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const debouncedModel = useDebounce(searchModel);
  const [showAlert, setShowAlert] = useState(true);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<{ url: string; x: number; y: number } | null>(null);

  const handlePreview = useCallback((url: string | null, rect?: DOMRect) => {
    if (url && rect) {
      setPreview({ url, x: rect.left + rect.width / 2, y: rect.top });
    } else {
      setPreview(null);
    }
  }, []);

  const {
    data: logsData,
    isLoading,
    refetch,
  } = useLogs({
    model: debouncedModel || undefined,
    status: statusFilter || undefined,
    page: 1,
    limit: 50,
  });
  const filtered = logsData?.data ?? [];

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map((l) => l.id)));
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tổng quan các request gần đây của bạn
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tên model..."
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-auto"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DateRangePicker />
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RefreshCw
                className={`size-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-xs">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Retention alert */}
      {showAlert && (
        <div className="relative mb-6 flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              Chính sách lưu trữ Log
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              File media (hình ảnh, video, audio, v.v.) được lưu giữ trong 14
              ngày, dữ liệu log được lưu giữ trong 2 tháng.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Dữ liệu vượt quá các thời hạn trên sẽ bị xoá vĩnh viễn. Vui lòng
              sao lưu các file hoặc log quan trọng trước.
            </p>
          </div>
          <button
            type="button"
            title="Đóng"
            onClick={() => setShowAlert(false)}
            className="absolute right-3 top-3 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Model tabs + Batch Callback */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:gap-2 sm:px-0">
          {modelTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RotateCcw className="size-4" />
          Batch Callback
        </button>
      </div>

      {/* Status filter */}
      <div className="relative mb-4 inline-block">
        <button
          type="button"
          onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          <Filter className="size-4 text-muted-foreground" />
          {statusFilter ? (
            <span className="capitalize">{statusFilter}</span>
          ) : (
            <span className="text-muted-foreground">Chọn Status</span>
          )}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
        {statusDropdownOpen && (
          <div className="absolute left-0 top-full z-30 mt-1 w-[160px] overflow-hidden rounded-lg border border-border bg-background shadow-lg">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("");
                setStatusDropdownOpen(false);
              }}
              className={`w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${!statusFilter ? "font-medium text-primary" : "text-foreground"}`}
            >
              Tất cả
            </button>
            {(["success", "failed", "processing"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  setStatusDropdownOpen(false);
                }}
                className={`w-full cursor-pointer px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-accent ${statusFilter === s ? "font-medium text-primary" : "text-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile card list ── */}
      <div className="space-y-3 md:hidden">
        {filtered.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between gap-2">
              <ModelBadge model={log.model} />
              <StatusBadge status={log.status} />
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {(() => {
                const vn = formatVnDateTime(log.date, log.time);
                return (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {vn.day} · {vn.hour}
                  </span>
                );
              })()}
              <span className="text-border">|</span>
              <span>{formatDuration(log.duration)}</span>
              <span className="text-border">|</span>
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <DollarSign className="size-3" />
                {Number(log.costVnd).toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="mt-2 line-clamp-2 rounded-lg bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
              {log.input}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <ResultButton log={log} onHover={handlePreview} />
              <CopyButton
                text={JSON.stringify({
                  input: log.input,
                  model: log.model,
                })}
                title="Copy params"
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Không tìm thấy log nào
          </div>
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-10 px-3 py-3.5" aria-label="Chọn tất cả">
                <input
                  type="checkbox"
                  title="Chọn tất cả"
                  checked={
                    selectedRows.size === filtered.length && filtered.length > 0
                  }
                  onChange={toggleAll}
                  className="size-4 cursor-pointer rounded border-border accent-primary"
                />
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Model
              </th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Input
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Chi phí
              </th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Result
              </th>
              <th className="w-16 px-3 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Retry
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((log) => (
              <tr
                key={log.id}
                className={`transition-colors hover:bg-muted/20 ${selectedRows.has(log.id) ? "bg-primary/5" : ""}`}
              >
                {/* Checkbox */}
                <td className="px-3 py-3.5">
                  <input
                    type="checkbox"
                    title="Chọn dòng"
                    checked={selectedRows.has(log.id)}
                    onChange={() => toggleRow(log.id)}
                    className="size-4 cursor-pointer rounded border-border accent-primary"
                  />
                </td>

                {/* Model & Details */}
                <td className="px-4 py-3.5">
                  {(() => {
                    const vn = formatVnDateTime(log.date, log.time);
                    return (
                      <>
                        <ModelBadge model={log.model} />
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{vn.day} · {vn.hour}</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground/60">
                          {formatDuration(log.duration)}
                        </div>
                      </>
                    );
                  })()}
                </td>

                {/* Input */}
                <td className="max-w-[260px] px-4 py-3.5">
                  <div className="group/param relative">
                    <div className="cursor-default">
                      <p className="truncate text-xs text-foreground">
                        <span className="font-semibold">input: </span>
                        <span className="text-muted-foreground">
                          {log.input}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-foreground">
                        <span className="font-semibold">model: </span>
                        <span className="text-muted-foreground">
                          {log.model}
                        </span>
                      </p>
                      <CopyButton
                        text={JSON.stringify({
                          input: log.input,
                          model: log.model,
                        })}
                        title="Copy params"
                      />
                    </div>

                    {/* Hover tooltip */}
                    <div className="pointer-events-none absolute left-full top-0 z-50 ml-2 w-[420px] origin-left scale-95 rounded-xl border border-border bg-background p-4 opacity-0 shadow-xl transition-all group-hover/param:pointer-events-auto group-hover/param:scale-100 group-hover/param:opacity-100">
                      <p className="text-xs leading-relaxed text-foreground">
                        <span className="font-bold">input: </span>
                        <span className="text-muted-foreground">
                          {log.input}
                        </span>
                      </p>
                      <p className="mt-3 text-xs text-foreground">
                        <span className="font-bold">model: </span>
                        <span className="text-muted-foreground">
                          {log.model}
                        </span>
                      </p>
                      <div className="mt-2">
                        <CopyButton
                          text={JSON.stringify({
                            input: log.input,
                            model: log.model,
                          })}
                          title="Copy params"
                        />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 text-center">
                  <StatusBadge status={log.status} />
                </td>

                {/* Cost */}
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {Number(log.costVnd).toLocaleString("vi-VN")}đ
                  </span>
                </td>

                {/* Results */}
                <td className="px-4 py-3.5 text-center">
                  <ResultButton log={log} onHover={handlePreview} />
                </td>

                {/* Retry */}
                <td className="px-3 py-3.5 text-center">
                  <button
                    type="button"
                    title="Retry"
                    className="cursor-pointer rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-16 text-center text-sm text-muted-foreground"
                >
                  Không tìm thấy log nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed preview popup — rendered outside table to avoid overflow issues */}
      {preview && (
        <div
          className="pointer-events-none fixed z-[200] w-[280px] -translate-x-1/2 rounded-xl border border-border bg-background p-3 shadow-xl"
          style={{ top: preview.y - 8, left: preview.x, transform: `translate(-50%, -100%)` }}
        >
          <p className="mb-2 text-xs font-semibold text-foreground">
            Result Preview:
          </p>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.url}
              alt="Result preview"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
