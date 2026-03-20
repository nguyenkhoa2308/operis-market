"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyUsage } from "@/hooks/use-logs";

type MetricMode = "spend" | "costVnd";

/* ─── Custom Tooltip ─── */
function CustomTooltip(props: { mode: MetricMode } & Record<string, unknown>) {
  const { active, payload, label, mode } = props as {
    active?: boolean;
    payload?: { value?: number }[];
    label?: string;
    mode: MetricMode;
  };
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;
  const fmt = mode === "spend" ? `$${val}` : `${val.toLocaleString("vi-VN")}đ`;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{fmt}</p>
    </div>
  );
}

export default function UsageBarChart({
  data,
  mode,
  height = 280,
  compact = false,
}: {
  data: DailyUsage[];
  mode: MetricMode;
  height?: number;
  compact?: boolean;
}) {
  const dataKey = mode === "spend" ? "spend" : "costVnd";
  const fmt = (v: number) => (mode === "spend" ? `$${v}` : `${v.toLocaleString("vi-VN")}đ`);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: compact ? -10 : -5, bottom: 0 }}
        barCategoryGap="20%"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--color-border)"
          strokeOpacity={0.4}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: compact ? 10 : 11, fill: "var(--color-muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmt}
          width={50}
        />
        <Tooltip
          content={<CustomTooltip mode={mode} />}
          cursor={{ fill: "var(--color-muted)", opacity: 0.15, radius: 4 }}
        />
        <Bar
          dataKey={dataKey}
          fill="url(#barGradient)"
          radius={[6, 6, 0, 0]}
          maxBarSize={36}
          animationDuration={600}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
