"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, Activity, Key, BarChart3, Shield, Zap, Calendar } from "lucide-react";
import { useAccountUsage, useKeyUsage } from "@/hooks/use-logs";

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

const ModelPieChart = dynamic(
  () => import("@/components/dashboard/ModelPieChart"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  },
);

function StatCard({
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

function BudgetProgress({ spent, max }: { spent: number; max: number }) {
  const pct = max > 0 ? Math.min((spent / max) * 100, 100) : 0;
  const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-primary";

  return (
    <div className="rounded-lg bg-muted/30 px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Budget Used</span>
        <span className="font-medium text-foreground">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {spent.toLocaleString("vi-VN")}đ / {max.toLocaleString("vi-VN")}đ
      </p>
    </div>
  );
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return "—";
  }
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return "—";
  }
}

function getDefaultDates() {
  const to = new Date();
  const from = new Date(Date.now() - 30 * 86400000);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

function PerAccountTab() {
  const defaults = useMemo(getDefaultDates, []);
  const [startDate, setStartDate] = useState(defaults.from);
  const [endDate, setEndDate] = useState(defaults.to);
  const { data, isLoading } = useAccountUsage(startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalCostVnd = data?.totalCostVnd ?? 0;
  const maxBudgetVnd = data?.maxBudgetVnd;
  const totalRequests = data?.totalRequests ?? 0;
  const totalPromptTokens = data?.totalPromptTokens ?? 0;
  const totalCompletionTokens = data?.totalCompletionTokens ?? 0;
  const dailyUsage = data?.dailyUsage ?? [];
  const modelUsage = data?.modelUsage ?? [];
  const avgCost = totalRequests > 0 ? totalCostVnd / totalRequests : 0;

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="flex flex-wrap items-center gap-3">
        <Calendar className="size-4 text-muted-foreground" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        />
        <span className="text-sm text-muted-foreground">—</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Chi phi (VND)" value={totalCostVnd.toLocaleString("vi-VN") + "d"} />
        <StatCard icon={Activity} label="Total Requests" value={totalRequests.toLocaleString()} />
        <StatCard icon={Zap} label="Avg Cost/Request" value={avgCost.toLocaleString("vi-VN", { maximumFractionDigits: 2 }) + "d"} />
        <StatCard icon={BarChart3} label="Prompt Tokens" value={totalPromptTokens.toLocaleString()} />
        <StatCard icon={BarChart3} label="Completion Tokens" value={totalCompletionTokens.toLocaleString()} />
        {maxBudgetVnd != null && (
          <StatCard icon={Shield} label="Max Budget" value={maxBudgetVnd.toLocaleString("vi-VN") + "d"} />
        )}
      </div>

      {/* Budget Progress */}
      {maxBudgetVnd != null && maxBudgetVnd > 0 && (
        <BudgetProgress spent={totalCostVnd} max={maxBudgetVnd} />
      )}

      {/* Charts row: Daily Cost + Model Pie */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Chi phi hang ngay (VND)</h3>
          {dailyUsage.length > 0 ? (
            <UsageBarChart data={dailyUsage.map((d) => ({ date: d.date, costVnd: d.costVnd, spend: 0, requests: d.requests }))} mode="costVnd" />
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No usage data yet
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Chi phi theo Model</h3>
          {modelUsage.length > 0 ? (
            <ModelPieChart data={modelUsage.map((m) => ({ name: m.model, value: m.costVnd }))} />
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No model usage yet
            </div>
          )}
        </div>
      </div>

      {/* Daily Request Count Chart */}
      <div className="rounded-xl border border-border p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Requests hang ngay</h3>
        {dailyUsage.length > 0 ? (
          <UsageBarChart
            data={dailyUsage.map((d) => ({ date: d.date, costVnd: d.costVnd, spend: 0, requests: d.requests }))}
            mode="requests"
            height={200}
          />
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No usage data yet
          </div>
        )}
      </div>

      {/* Model Breakdown Table */}
      <div className="rounded-xl border border-border p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Breakdown by Model</h3>
        {modelUsage.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Model</th>
                  <th className="pb-2 text-right font-medium">Requests</th>
                  <th className="pb-2 text-right font-medium">Prompt Tokens</th>
                  <th className="pb-2 text-right font-medium">Completion Tokens</th>
                  <th className="pb-2 text-right font-medium">Token Ratio</th>
                  <th className="pb-2 text-right font-medium">Avg Cost</th>
                  <th className="pb-2 text-right font-medium">Chi phi (VND)</th>
                </tr>
              </thead>
              <tbody>
                {modelUsage.map((m) => {
                  const totalTokens = m.promptTokens + m.completionTokens;
                  const promptPct = totalTokens > 0 ? (m.promptTokens / totalTokens) * 100 : 0;
                  const avgModelCost = m.requests > 0 ? m.costVnd / m.requests : 0;

                  return (
                    <tr key={m.model} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 font-mono text-xs text-foreground/80">{m.model}</td>
                      <td className="py-2.5 text-right text-foreground/80">{m.requests.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-foreground/80">{m.promptTokens.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-foreground/80">{m.completionTokens.toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        {totalTokens > 0 ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${promptPct}%` }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{promptPct.toFixed(0)}%</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-foreground/60">
                        {avgModelCost.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}d
                      </td>
                      <td className="py-2.5 text-right font-medium text-foreground">{m.costVnd.toLocaleString("vi-VN")}d</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No model usage recorded yet.</p>
        )}
      </div>
    </div>
  );
}

function PerKeyTab() {
  const { data: keys, isLoading } = useKeyUsage();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const keyList = keys ?? [];

  return (
    <div className="rounded-xl border border-border p-4 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">API Key Usage</h3>
      {keyList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-2 text-left font-medium">Key</th>
                <th className="pb-2 text-left font-medium">Alias</th>
                <th className="pb-2 text-right font-medium">Spend (VND)</th>
                <th className="pb-2 text-right font-medium">Max Budget</th>
                <th className="pb-2 text-right font-medium">RPM</th>
                <th className="pb-2 text-right font-medium">TPM</th>
                <th className="pb-2 text-right font-medium">Last Active</th>
                <th className="pb-2 text-right font-medium">Expires</th>
                <th className="pb-2 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {keyList.map((k, i) => (
                <tr key={k.keyHash ?? i} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5">
                    {k.keyPrefix ? (
                      <code className="rounded bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-foreground/70">
                        {k.keyPrefix}...
                      </code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-2.5 text-foreground/80">{k.keyAlias ?? "—"}</td>
                  <td className="py-2.5 text-right font-medium text-foreground">
                    {k.spend.toLocaleString("vi-VN")}d
                  </td>
                  <td className="py-2.5 text-right text-foreground/80">
                    {k.maxBudget != null ? `${k.maxBudget.toLocaleString("vi-VN")}d` : "—"}
                  </td>
                  <td className="py-2.5 text-right text-foreground/80">
                    {k.rpmLimit != null ? k.rpmLimit.toLocaleString() : "—"}
                  </td>
                  <td className="py-2.5 text-right text-foreground/80">
                    {k.tpmLimit != null ? k.tpmLimit.toLocaleString() : "—"}
                  </td>
                  <td className="py-2.5 text-right text-foreground/60">
                    {formatDateTime(k.lastActive)}
                  </td>
                  <td className="py-2.5 text-right text-foreground/60">
                    {formatDate(k.expiresAt)}
                  </td>
                  <td className="py-2.5 text-right text-foreground/60">
                    {formatDate(k.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Key className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No API keys with usage data found.</p>
          <p className="text-xs text-muted-foreground/60">
            Create an API key and make requests to see usage here.
          </p>
        </div>
      )}
    </div>
  );
}

type Tab = "account" | "key";

export default function ApiUsagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:pt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">API Usage</h1>
      </div>

      <div className="mb-6 border-b border-border">
        <div className="flex gap-0">
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`cursor-pointer border-b-2 px-4 pb-2.5 pt-3 text-sm font-medium transition-colors ${
              activeTab === "account"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Per Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("key")}
            className={`cursor-pointer border-b-2 px-4 pb-2.5 pt-3 text-sm font-medium transition-colors ${
              activeTab === "key"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Per API Key
          </button>
        </div>
      </div>

      {activeTab === "account" ? <PerAccountTab /> : <PerKeyTab />}
    </div>
  );
}
