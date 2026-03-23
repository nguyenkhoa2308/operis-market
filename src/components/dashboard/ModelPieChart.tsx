"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name?: string; value?: number }[] }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground">{name}</p>
      <p className="text-sm font-bold text-foreground">{(value ?? 0).toLocaleString("vi-VN")}đ</p>
    </div>
  );
}

export default function ModelPieChart({
  data,
  height = 300,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  // Show top 7 models + group the rest as "Other"
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 7);
  const rest = sorted.slice(7);
  const chartData = rest.length > 0
    ? [...top, { name: "Other", value: rest.reduce((s, d) => s + d.value, 0) }]
    : top;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          animationDuration={600}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value: string) => <span className="text-xs text-foreground/80">{value}</span>}
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
