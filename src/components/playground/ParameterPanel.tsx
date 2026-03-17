"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import type { PlaygroundParams } from "@/hooks/use-playground";
import type { Model } from "@/types/market";

interface ParameterPanelProps {
  params: PlaygroundParams;
  onChange: (p: Partial<PlaygroundParams>) => void;
  models: Model[];
  modelsLoading: boolean;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-mono text-foreground">
          {format ? format(value) : value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer appearance-none rounded-full h-1.5 outline-none"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${pct}%, hsl(var(--border)) ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

export default function ParameterPanel({
  params,
  onChange,
  models,
  modelsLoading,
}: ParameterPanelProps) {
  const defaults: PlaygroundParams = {
    model: models[0]?.slug ?? "",
    systemPrompt: "",
    temperature: 1,
    maxTokens: 1024,
    topP: 1,
  };

  const handleReset = () => onChange(defaults);

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-5 border-l border-border bg-background-secondary p-5 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Tham số</h2>
        <button
          type="button"
          onClick={handleReset}
          title="Reset về mặc định"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <RotateCcw className="size-3" />
          Reset
        </button>
      </div>

      {/* Model selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Model</label>
        <div className="relative">
          <select
            value={params.model}
            onChange={(e) => onChange({ model: e.target.value })}
            disabled={modelsLoading}
            className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            {modelsLoading ? (
              <option value="">Đang tải...</option>
            ) : models.length === 0 ? (
              <option value="">Không có model</option>
            ) : (
              models.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
        {params.model && models.find((m) => m.slug === params.model) && (
          <p className="text-xs text-muted-foreground">
            {models.find((m) => m.slug === params.model)?.provider}
          </p>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Sliders */}
      <Slider
        label="Temperature"
        value={params.temperature}
        min={0}
        max={2}
        step={0.01}
        onChange={(v) => onChange({ temperature: v })}
        format={(v) => v.toFixed(2)}
      />
      <Slider
        label="Max Tokens"
        value={params.maxTokens}
        min={256}
        max={4096}
        step={64}
        onChange={(v) => onChange({ maxTokens: v })}
      />
      <Slider
        label="Top P"
        value={params.topP}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => onChange({ topP: v })}
        format={(v) => v.toFixed(2)}
      />

      <div className="h-px bg-border" />

      {/* Info box */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 space-y-1.5 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Lưu ý</p>
        <p>Credit sẽ bị trừ sau mỗi lần gọi API dựa trên số token sử dụng.</p>
        <p>Trang Playground chỉ dành để thử nghiệm. Để tích hợp vào sản phẩm, hãy dùng <span className="text-foreground font-medium">API Keys</span>.</p>
      </div>
    </aside>
  );
}
