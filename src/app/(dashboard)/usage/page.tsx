"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Download, TrendingUp, Activity } from "lucide-react";
import { useUsage } from "@/hooks/use-logs";

const UsageBarChart = dynamic(
  () => import("@/components/dashboard/UsageBarChart"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

const DateRangePicker = dynamic(
  () => import("@/components/dashboard/DateRangePicker"),
  { ssr: false },
);

type MetricMode = "spend" | "credits";

/* ─── Toggle pill ─── */
function MetricToggle({
  mode,
  onChange,
}: {
  mode: MetricMode;
  onChange: (m: MetricMode) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted/30 p-0.5">
      <button
        type="button"
        onClick={() => onChange("spend")}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
          mode === "spend"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Total Spend
      </button>
      <button
        type="button"
        onClick={() => onChange("credits")}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
          mode === "credits"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Total Credits
      </button>
    </div>
  );
}

/* ─── Stat card ─── */
function StatHighlight({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function ApiUsagePage() {
  const [overallMode, setOverallMode] = useState<MetricMode>("spend");
  const [endpointMode, setEndpointMode] = useState<MetricMode>("spend");
  const [keyMode, setKeyMode] = useState<MetricMode>("spend");

  const { data: usage, isLoading } = useUsage();
  const dailyUsage = usage?.dailyUsage ?? [];
  const endpointUsage = usage?.endpointUsage ?? [];
  const keyUsage = usage?.keyUsage ?? [];
  const totalSpend = dailyUsage.reduce((s, d) => s + d.spend, 0);
  const totalCredits = dailyUsage.reduce((s, d) => s + d.credits, 0);

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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          API Usage
        </h1>
        <div className="flex items-center gap-3">
          <DateRangePicker />
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary p-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-5 sm:py-2"
            title="Export"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Total Spend / Credits */}
        <div className="rounded-xl border border-border p-4 sm:p-6">
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {overallMode === "spend" ? "Total Spend" : "Total Credits"}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {overallMode === "spend" ? `$${totalSpend.toFixed(2)}` : totalCredits.toLocaleString()}
              </p>
            </div>
            <MetricToggle mode={overallMode} onChange={setOverallMode} />
          </div>

          {/* Quick stats */}
          <div className="mb-6 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatHighlight
              icon={TrendingUp}
              label="Chi cao nhất"
              value={overallMode === "spend"
                ? `$${dailyUsage.length ? Math.max(...dailyUsage.map(d => d.spend)).toFixed(2) : "0.00"}`
                : (dailyUsage.length ? Math.max(...dailyUsage.map(d => d.credits)).toLocaleString() : "0")}
            />
            <StatHighlight
              icon={Activity}
              label="Ngày hoạt động"
              value={`${dailyUsage.filter(d => d.spend > 0 || d.credits > 0).length} / ${dailyUsage.length}`}
            />
            <StatHighlight
              icon={TrendingUp}
              label="Trung bình / ngày"
              value={overallMode === "spend"
                ? `$${dailyUsage.length ? (totalSpend / dailyUsage.length).toFixed(2) : "0.00"}`
                : (dailyUsage.length ? Math.round(totalCredits / dailyUsage.length).toLocaleString() : "0")}
            />
            <StatHighlight
              icon={Activity}
              label="Tổng requests"
              value={totalCredits.toLocaleString()}
            />
          </div>

          <UsageBarChart data={dailyUsage} mode={overallMode} />
        </div>

        {/* API Endpoints */}
        <div className="rounded-xl border border-border p-4 sm:p-6">
          <div className="mb-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">API Endpoints</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Top 10 endpoints có lượng sử dụng cao nhất trong khoảng thời gian đã chọn
              </p>
            </div>
            <MetricToggle mode={endpointMode} onChange={setEndpointMode} />
          </div>

          {/* Tab */}
          <div className="mb-6 border-b border-border">
            <button
              type="button"
              className="cursor-pointer border-b-2 border-primary px-1 pb-2.5 pt-4 text-sm font-medium text-primary"
            >
              Usage Overview
            </button>
          </div>

          <div className="space-y-5">
            {endpointUsage.map((ep) => (
              <div key={ep.name} className="rounded-xl border border-border p-3 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{ep.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {endpointMode === "spend"
                        ? `$${ep.totalSpend.toFixed(2)} total spend`
                        : `${ep.totalCredits.toLocaleString()} total credits`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                    <span className="size-1.5 rounded-full bg-primary" />
                    <span className="text-[11px] font-medium text-primary">Active</span>
                  </div>
                </div>
                <UsageBarChart data={ep.daily} mode={endpointMode} height={200} compact />
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-xl border border-border p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">API Keys</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Thống kê sử dụng cho các key có tiêu thụ thực tế trong khoảng thời gian đã chọn
              </p>
            </div>
            <MetricToggle mode={keyMode} onChange={setKeyMode} />
          </div>

          <div className="space-y-5">
            {keyUsage.map((k) => (
              <div key={k.keyHash} className="rounded-xl border border-border p-3 sm:p-5">
                {/* Key header */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-foreground">{k.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <code className="rounded-md bg-muted/60 px-2.5 py-1 font-mono text-[11px] text-foreground/70">
                      {k.keyHash}
                    </code>
                    <span className="text-border">|</span>
                    <span>Created {k.createdAt}</span>
                    <span className="text-border">|</span>
                    <span>Last used {k.lastUsed}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="font-medium text-foreground">
                      {keyMode === "spend"
                        ? `$${k.totalSpend.toFixed(2)} total spend`
                        : `${k.totalCredits.toLocaleString()} total credits`}
                    </span>
                  </p>
                </div>

                <UsageBarChart data={k.daily} mode={keyMode} height={240} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
