"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Calendar, ChevronDown, Clock } from "lucide-react";
import { DatePicker, ConfigProvider, theme as antTheme } from "antd";
import dayjs, { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const quickPresets: { label: string; value: "week" | "month" | "7d" | "14d" | "30d" }[] = [
  { label: "Tuần này", value: "week" },
  { label: "Tháng này", value: "month" },
  { label: "7 ngày qua", value: "7d" },
  { label: "14 ngày qua", value: "14d" },
  { label: "30 ngày qua", value: "30d" },
];

function getPresetRange(key: string): [Dayjs, Dayjs] {
  const now = dayjs();
  switch (key) {
    case "week": return [now.startOf("week"), now];
    case "month": return [now.startOf("month"), now];
    case "7d": return [now.subtract(6, "day"), now];
    case "14d": return [now.subtract(13, "day"), now];
    case "30d": return [now.subtract(29, "day"), now];
    default: return [now.subtract(13, "day"), now];
  }
}

export default function DateRangePicker() {
  const { resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("14d");
  const [range, setRange] = useState<[Dayjs, Dayjs]>(getPresetRange("14d"));
  const [customMode, setCustomMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";

  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 250);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;
      if (target.closest(".ant-picker-dropdown")) return;
      closeSheet();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const displayRange = `${range[0].format("MMM D")} - ${range[1].format("MMM D")}`;
  const selectedDays = range[1].diff(range[0], "day") + 1;

  const handlePreset = (key: string) => {
    const r = getPresetRange(key);
    setRange(r);
    setSelectedPreset(key);
    setCustomMode(false);
    closeSheet();
  };

  const antConfig = {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: { colorPrimary: "#3b82f6", borderRadius: 8, fontSize: 13 },
  };

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates?.[0] && dates?.[1]) {
      setRange([dates[0], dates[1]]);
      setSelectedPreset("");
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:px-5"
      >
        <Calendar className="size-4 text-muted-foreground" />
        {displayRange}
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* ── Mobile bottom sheet ── */}
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              className={`absolute inset-0 bg-black/50 transition-opacity duration-250 ${closing ? "opacity-0" : "animate-in fade-in duration-200"}`}
              onClick={closeSheet}
            />
            <div
              ref={mobileSheetRef}
              className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-background shadow-xl transition-transform duration-250 ease-out ${closing ? "translate-y-full" : "animate-in slide-in-from-bottom duration-300 ease-out"}`}
            >
              {/* Quick Select */}
              <div className="p-4 pb-2">
                <p className="mb-3 text-sm font-bold text-foreground">Quick Select</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPresets.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handlePreset(opt.value)}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        !customMode && selectedPreset === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomMode(true)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      customMode
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                    }`}
                  >
                    <Clock className="size-3" />
                    Custom Range
                  </button>
                </div>
                <div className="mt-3 space-y-0.5 text-[11px] text-muted-foreground">
                  <p>Max Range: 31 days</p>
                  <p>Selected: {selectedDays} days</p>
                </div>
              </div>

              {/* Custom Date Range (inline) — grid trick for smooth height */}
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${customMode ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Custom Date Range</p>
                      <button
                        type="button"
                        onClick={() => setCustomMode(false)}
                        className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">Selected: {selectedDays} days</p>
                    <ConfigProvider theme={antConfig}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <p className="mb-1 text-[11px] text-muted-foreground">Từ ngày</p>
                          <DatePicker
                            value={range[0]}
                            onChange={(date) => {
                              if (date) {
                                setRange([date, range[1].isBefore(date) ? date : range[1]]);
                                setSelectedPreset("");
                              }
                            }}
                            disabledDate={(current) => current && current.isAfter(dayjs(), "day")}
                            className="w-full"
                            placeholder="Từ ngày"
                            format="DD/MM/YYYY"
                          />
                        </div>
                        <span className="mt-4 text-xs text-muted-foreground">→</span>
                        <div className="flex-1">
                          <p className="mb-1 text-[11px] text-muted-foreground">Đến ngày</p>
                          <DatePicker
                            value={range[1]}
                            onChange={(date) => {
                              if (date) {
                                setRange([range[0].isAfter(date) ? date : range[0], date]);
                                setSelectedPreset("");
                              }
                            }}
                            disabledDate={(current) => current && (current.isAfter(dayjs(), "day") || current.isBefore(range[0], "day"))}
                            className="w-full"
                            placeholder="Đến ngày"
                            format="DD/MM/YYYY"
                          />
                        </div>
                      </div>
                    </ConfigProvider>
                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setRange(getPresetRange("14d"));
                          setSelectedPreset("14d");
                          setCustomMode(false);
                        }}
                        className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear Selection
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCustomMode(false); closeSheet(); }}
                        className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Apply Range
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safe area padding */}
              <div className="h-4" />
            </div>
          </div>

          {/* ── Desktop dropdown ── */}
          <div className="absolute right-0 top-full z-50 mt-2 hidden overflow-hidden rounded-xl border border-border bg-background shadow-xl sm:flex">
            {/* Left — Quick Select */}
            <div className="w-[180px] border-r border-border p-4">
              <p className="mb-3 text-sm font-bold text-foreground">Chọn nhanh</p>
              <div className="space-y-0.5">
                {quickPresets.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePreset(opt.value)}
                    className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      !customMode && selectedPreset === opt.value
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="my-3 border-t border-border" />

              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  customMode
                    ? "border-primary bg-primary/5 font-medium text-primary"
                    : "border-transparent text-foreground hover:bg-muted/50"
                }`}
              >
                <Clock className="size-4" />
                Tuỳ chọn
              </button>
              <p className="mt-2 px-3 text-[11px] text-muted-foreground">Tối đa: 31 ngày</p>
            </div>

            {/* Right — Calendar or placeholder */}
            <div className="w-[380px] p-4">
              {customMode ? (
                <ConfigProvider theme={antConfig}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Tuỳ chọn khoảng thời gian</p>
                      <button
                        type="button"
                        onClick={() => setCustomMode(false)}
                        className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                      >
                        Huỷ
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Nhấn vào ô ngày để mở lịch</p>
                    <RangePicker
                      value={range}
                      onChange={handleRangeChange}
                      disabledDate={(current) => current && current.isAfter(dayjs(), "day")}
                      className="w-full"
                      placeholder={["Từ ngày", "Đến ngày"]}
                      format="DD/MM/YYYY"
                    />
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setRange(getPresetRange("14d"));
                          setSelectedPreset("14d");
                        }}
                        className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                      >
                        Xoá lựa chọn
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCustomMode(false); setOpen(false); }}
                        className="cursor-pointer rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </ConfigProvider>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-8 py-8 text-center">
                  <Calendar className="mb-3 size-12 text-muted-foreground/30" strokeWidth={1} />
                  <p className="text-sm text-muted-foreground">
                    Chọn &quot;Tuỳ chọn&quot; để chọn khoảng thời gian cụ thể
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
