"use client";

import ReactECharts from "echarts-for-react";
import { driftData, driftDataByEquipment } from "@/data/mock-data";
import { useChartTheme } from "@/lib/chart-theme";
import { useIsDark } from "@/lib/theme";

interface DriftChartProps {
  /** If set, use the per-equipment series from driftDataByEquipment instead of the default driftData. */
  equipmentArea?: string;
  /** Hide the internal header so the parent card can own the title and toolbar. */
  hideHeader?: boolean;
}

export function DriftChart({ equipmentArea, hideHeader }: DriftChartProps = {}) {
  const t = useChartTheme();
  const isDark = useIsDark();

  const series = equipmentArea
    ? (driftDataByEquipment[equipmentArea] ?? driftData)
    : driftData;

  const driftStartIndex = series.findIndex(
    (d) => d.predicted - d.actual > 0.15
  );

  // Y-axis bounds adapt to whichever series is being plotted so non-percent
  // areas (e.g. Heat Exchanger °F) render with sensible padding.
  const allVals = series.flatMap((d) => [d.predicted, d.actual]);
  const dataMin = Math.min(...allVals);
  const dataMax = Math.max(...allVals);
  const padY = (dataMax - dataMin) * 0.15 || 0.5;
  const yMin = dataMin - padY;
  const yMax = dataMax + padY;

  const valueSuffix = equipmentArea ? "" : "%";

  const driftZoneFill = isDark
    ? "rgba(245, 158, 11, 0.12)"
    : "rgba(217, 119, 6, 0.08)";

  const option: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50,
    },
    xAxis: {
      type: "category",
      data: series.map((d) => d.date),
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
        interval: Math.max(Math.floor(series.length / 4) - 1, 0),
      },
    },
    yAxis: {
      type: "value",
      min: yMin,
      max: yMax,
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
        formatter: (v: number) => `${v.toFixed(1)}${valueSuffix}`,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      textStyle: {
        color: t.tooltipText,
        fontFamily: t.fontMono,
        fontSize: 12,
      },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string }>) => {
        const lines = params.map(
          (p) => `${p.seriesName}: ${Number(p.value).toFixed(2)}${valueSuffix}`
        );
        return `${params[0].axisValue}<br/>${lines.join("<br/>")}`;
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Predicted",
        type: "line",
        data: series.map((d) => d.predicted),
        smooth: true,
        symbol: "none",
        lineStyle: { color: t.accent, width: 2 },
        itemStyle: { color: t.accent },
        markArea:
          driftStartIndex >= 0
            ? {
                silent: true,
                data: [
                  [
                    {
                      xAxis: series[driftStartIndex].date,
                      itemStyle: {
                        color: driftZoneFill,
                      },
                    },
                    { xAxis: series[series.length - 1].date },
                  ],
                ],
              }
            : undefined,
      },
      {
        name: "Actual",
        type: "line",
        data: series.map((d) => Number(d.actual.toFixed(3))),
        smooth: true,
        symbol: "none",
        lineStyle: { color: t.textMuted, width: 2, type: "dashed" as const },
        itemStyle: { color: t.textMuted },
      },
    ],
  };

  return (
    <div className="flex flex-col h-full relative">
      {!hideHeader && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-headline font-semibold text-text-primary">
            Model Drift — Yield Prediction
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-0.5 bg-accent" />
              Predicted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-0.5 bg-text-muted border-t border-dashed border-text-muted" />
              Actual
            </span>
          </div>
        </div>
      )}
      <div className="flex-1 min-h-0 relative">
        <ReactECharts
          key={isDark ? "d" : "l"}
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
          notMerge
        />
        {driftStartIndex >= 0 && (
          <div
            className="absolute top-2 right-8 px-2 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider text-status-warning bg-amber-50 border border-amber-200 dark:bg-amber-500/15 dark:border-amber-500/30"
          >
            Drift Detected
          </div>
        )}
      </div>
    </div>
  );
}
