"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { TrendingUp, Activity, Key, BarChart3 } from "lucide-react";
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

function PerAccountTab() {
  const { data, isLoading } = useAccountUsage();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const totalSpend = data?.totalSpend ?? 0;
  const totalRequests = data?.totalRequests ?? 0;
  const dailyUsage = data?.dailyUsage ?? [];
  const modelUsage = data?.modelUsage ?? [];
  const chartData = dailyUsage.map((d) => ({ date: d.date, spend: d.spend, credits: 0 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Spend" value={`$${totalSpend.toFixed(4)}`} />
        <StatCard icon={Activity} label="Total Requests" value={totalRequests.toLocaleString()} />
        <StatCard
          icon={BarChart3}
          label="Prompt Tokens"
          value={(data?.totalPromptTokens ?? 0).toLocaleString()}
        />
        <StatCard
          icon={BarChart3}
          label="Completion Tokens"
          value={(data?.totalCompletionTokens ?? 0).toLocaleString()}
        />
      </div>

      <div className="rounded-xl border border-border p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Daily Spend (USD)</h3>
        {chartData.length > 0 ? (
          <UsageBarChart data={chartData} mode="spend" />
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No usage data yet
          </div>
        )}
      </div>

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
                  <th className="pb-2 text-right font-medium">Spend (USD)</th>
                </tr>
              </thead>
              <tbody>
                {modelUsage.map((m) => (
                  <tr key={m.model} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 font-mono text-xs text-foreground/80">{m.model}</td>
                    <td className="py-2.5 text-right text-foreground/80">{m.requests.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-foreground/80">{m.promptTokens.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-foreground/80">{m.completionTokens.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-medium text-foreground">${m.spend.toFixed(6)}</td>
                  </tr>
                ))}
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
                <th className="pb-2 text-right font-medium">Spend (USD)</th>
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
                  <td className="py-2.5 text-right font-medium text-foreground">${k.spend.toFixed(6)}</td>
                  <td className="py-2.5 text-right text-foreground/60">
                    {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "—"}
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
