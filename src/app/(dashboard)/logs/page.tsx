"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import dynamic from "next/dynamic";
import {
  RefreshCw,
  Search,
  Info,
  X,
  ChevronDown,
  Copy,
  Image,
  RotateCcw,
  Filter,
} from "lucide-react";
import { useLogs, type LogEntry } from "@/hooks/use-logs";

const DateRangePicker = dynamic(
  () => import("@/components/dashboard/DateRangePicker"),
  { ssr: false },
);

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: LogEntry["status"] }) {
  const config = {
    success: { dot: "bg-green-400", text: "text-green-400", label: "success" },
    failed: { dot: "bg-red-400", text: "text-red-400", label: "failed" },
    processing: { dot: "bg-yellow-400", text: "text-yellow-400", label: "processing" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.text}`}>
      <span className={`size-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

/* ─── Model badge ─── */
function ModelBadge({ model }: { model: string }) {
  return (
    <span className="inline-block rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
      {model}
    </span>
  );
}

const modelTabs = ["Market", "Runway", "Suno", "4o Image", "Flux Kontext", "Veo", "Midjourney", "Runway Aleph", "Luma Modify"];

/* ─── Page ─── */
export default function LogsPage() {
  const [activeTab, setActiveTab] = useState("Market");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const debouncedModel = useDebounce(searchModel);
  const [searchTaskId, setSearchTaskId] = useState("");
  const debouncedTaskId = useDebounce(searchTaskId);
  const [showAlert, setShowAlert] = useState(true);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const { data: logsData, isLoading, refetch } = useLogs({
    model: debouncedModel || undefined,
    status: statusFilter || undefined,
    page: 1,
    limit: 50,
  });
  const logEntries = logsData?.data ?? [];

  // Client-side filter for task ID only (model + status handled by API)
  const filtered = debouncedTaskId
    ? logEntries.filter((log) => log.taskId.toLowerCase().includes(debouncedTaskId.toLowerCase()))
    : logEntries;

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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tổng quan các request gần đây của bạn
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {/* Search inputs row */}
          <div className="flex items-center gap-2">
            {/* Search model */}
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

            {/* Search task ID */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Task ID..."
                value={searchTaskId}
                onChange={(e) => setSearchTaskId(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-auto"
              />
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2">
            <DateRangePicker />

            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="text-xs">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Retention alert */}
      {showAlert && (
        <div className="relative mb-6 flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-blue-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Chính sách lưu trữ Log</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              File media (hình ảnh, video, audio, v.v.) được lưu giữ trong 14 ngày, dữ liệu log được lưu giữ trong 2 tháng.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Dữ liệu vượt quá các thời hạn trên sẽ bị xoá vĩnh viễn. Vui lòng sao lưu các file hoặc log quan trọng trước.
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
              onClick={() => { setStatusFilter(""); setStatusDropdownOpen(false); }}
              className={`w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${!statusFilter ? "text-primary font-medium" : "text-foreground"}`}
            >
              Tất cả
            </button>
            {(["success", "failed", "processing"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setStatusFilter(s); setStatusDropdownOpen(false); }}
                className={`w-full cursor-pointer px-3 py-2 text-left text-sm capitalize transition-colors hover:bg-accent ${statusFilter === s ? "text-primary font-medium" : "text-foreground"}`}
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
          <div key={log.id} className="rounded-xl border border-border p-4">
            {/* Top row: model badge + status */}
            <div className="flex items-center justify-between gap-2">
              <ModelBadge model={log.model} />
              <StatusBadge status={log.status} />
            </div>

            {/* Meta row */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{log.date} {log.time}</span>
              <span className="text-border">|</span>
              <span>{log.duration}s</span>
              <span className="text-border">|</span>
              <span className="font-medium text-foreground">{Number(log.costVnd).toLocaleString('vi-VN')}đ</span>
            </div>

            {/* Task ID */}
            <div className="mt-2 flex items-center gap-1.5">
              <code className="truncate text-[11px] text-muted-foreground/70">{log.taskId}</code>
              <button
                type="button"
                title="Copy Task ID"
                className="shrink-0 cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Copy className="size-3" />
              </button>
            </div>

            {/* Param preview */}
            <div className="mt-2 truncate rounded-lg bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
              {log.input}
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2">
              {log.hasResult && (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Image className="size-3.5" />
                  Result
                </button>
              )}
              <button
                type="button"
                title="Copy params"
                className="cursor-pointer rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Copy className="size-3.5" />
              </button>
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
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-12 px-4 py-3" aria-label="Chọn tất cả">
                <input
                  type="checkbox"
                  title="Chọn tất cả"
                  checked={selectedRows.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="size-4 cursor-pointer rounded border-border accent-primary"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Model & Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                param
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Chi phí (VND)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Task ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Results
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                Retry Callback
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr
                key={log.id}
                className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/20"
              >
                {/* Checkbox */}
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    title="Chọn dòng"
                    checked={selectedRows.has(log.id)}
                    onChange={() => toggleRow(log.id)}
                    className="size-4 cursor-pointer rounded border-border accent-primary"
                  />
                </td>

                {/* Model & Details */}
                <td className="px-4 py-4">
                  <ModelBadge model={log.model} />
                  <div className="mt-2 text-xs text-muted-foreground">
                    {log.date}
                  </div>
                  <div className="text-xs text-muted-foreground">{log.time}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground/60">
                    Duration: {log.duration}
                  </div>
                </td>

                {/* Param */}
                <td className="max-w-[260px] px-4 py-4">
                  <div className="text-xs text-foreground">
                    <span className="font-semibold">input: </span>
                    <span className="text-muted-foreground">{log.input}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-foreground">
                    <span className="font-semibold">model: </span>
                    <span className="text-muted-foreground">{log.model}</span>
                  </div>
                  <button
                    type="button"
                    title="Copy params"
                    className="mt-1.5 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <StatusBadge status={log.status} />
                </td>

                {/* Chi phí */}
                <td className="px-4 py-4 text-center text-sm text-foreground">
                  {Number(log.costVnd).toLocaleString('vi-VN')}đ
                </td>

                {/* Task ID */}
                <td className="px-4 py-4">
                  <code className="text-xs text-muted-foreground">{log.taskId}</code>
                </td>

                {/* Results */}
                <td className="px-4 py-4">
                  {log.hasResult ? (
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Image className="size-3.5" />
                      Result
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                  {log.hasResult && (
                    <button
                      type="button"
                      title="Copy result"
                      className="ml-2 cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  )}
                </td>

                {/* Retry */}
                <td className="px-4 py-4 text-center text-xs text-muted-foreground">
                  -
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Không tìm thấy log nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
