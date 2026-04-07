"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { marginWaterfallByWindow, type WaterfallWindow } from "@/data/mock-data";
import { useChartTheme } from "@/lib/chart-theme";
import { useIsDark } from "@/lib/theme";

const timeRanges: WaterfallWindow[] = ["1d", "7d", "30d"];
const modes = ["rate", "cumulative"] as const;
type Mode = (typeof modes)[number];

export function WaterfallChart() {
  // Default $/day + 7d: rate is the primary view per LP-planner feedback;
  // 7d is the natural middle of the new short-horizon range.
  const [activeRange, setActiveRange] = useState<WaterfallWindow>("7d");
  const [mode, setMode] = useState<Mode>("rate");
  const t = useChartTheme();
  const isDark = useIsDark();

  const windowDays = activeRange === "1d" ? 1 : activeRange === "7d" ? 7 : 30;
  const w = marginWaterfallByWindow[activeRange];
  const scale = (rate: number) => (mode === "rate" ? rate : rate * windowDays);

  const fmtVal = (v: number) =>
    mode === "rate"
      ? `$${v.toFixed(1)}K/day`
      : v >= 1000
        ? `$${(v / 1000).toFixed(2)}M`
        : `$${Math.round(v)}K`;

  const summaryCategories = ["Margin Captured", "Additional Opportunity"];
  const summaryValues = [scale(w.capturedRatePerDay), scale(w.opportunityRatePerDay)];
  const summaryColors = [t.accent, t.neutralBar];

  const unitCategories = w.units.map((u) => u.name);
  const unitValues = w.units.map((u) => scale(u.ratePerDay));

  const allCategories = [...summaryCategories, "", ...unitCategories];
  const allValues = [...summaryValues, 0, ...unitValues];
  const allColors = [
    ...summaryColors,
    "transparent",
    ...unitCategories.map(() => t.accent),
  ];

  const option: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: {
      top: 20,
      right: 56,
      bottom: 24,
      left: 140,
      containLabel: false,
    },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: t.splitLine, type: "dashed" as const },
      },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
        formatter: (v: number) => fmtVal(v),
      },
    },
    yAxis: {
      type: "category",
      data: allCategories,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      textStyle: {
        color: t.tooltipText,
        fontFamily: t.fontMono,
        fontSize: 12,
      },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const item = params[0];
        if (!item || !item.name) return "";
        if (item.name === "Margin Captured") return `${fmtVal(item.value)} captured`;
        if (item.name === "Additional Opportunity") return `${fmtVal(item.value)} additional opportunity`;
        return `${item.name}: ${fmtVal(item.value)}`;
      },
    },
    series: [
      {
        type: "bar",
        data: allValues.map((v, i) => ({
          value: v,
          itemStyle: { color: allColors[i], borderRadius: [0, 2, 2, 0] },
        })),
        barWidth: 20,
        label: {
          show: true,
          position: "right" as const,
          fontFamily: t.fontMono,
          fontSize: 11,
          color: t.textMuted,
          formatter: (p: { value: number; dataIndex: number }) => {
            if (p.dataIndex === 2) return "";
            return fmtVal(p.value);
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h3 className="text-sm font-headline font-semibold text-text-primary">
          Margin Waterfall{" "}
          <span className="text-xs font-mono text-text-muted">
            · {mode === "rate" ? "$/day" : "Cumulative"}
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                  mode === m
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-text-muted hover:text-text-secondary"
                }`}
              >
                {m === "rate" ? "$/day" : "Cumulative"}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-surface-border" />
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                  activeRange === range
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-text-muted hover:text-text-secondary"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ReactECharts
          key={isDark ? "d" : "l"}
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
          notMerge
        />
      </div>
    </div>
  );
}
