"use client";

import ReactECharts from "echarts-for-react";
import { flowNetworkData } from "@/data/mock-data";
import { useChartTheme } from "@/lib/chart-theme";
import { useIsDark } from "@/lib/theme";

export function FlowNetworkChart() {
  const t = useChartTheme();
  const isDark = useIsDark();

  const option = {
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      borderRadius: 4,
      textStyle: {
        color: t.tooltipText,
        fontFamily: t.fontMono,
        fontSize: 12,
      },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const item = params[0];
        return `<span style="font-weight:600">${item.name}</span><br/>Performance: ${item.value}%`;
      },
    },
    grid: {
      top: 12,
      right: 12,
      bottom: 24,
      left: 36,
      containLabel: false,
    },
    xAxis: {
      type: "category" as const,
      data: flowNetworkData.map((d) => d.unit),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
      },
    },
    yAxis: {
      type: "value" as const,
      min: 70,
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: {
          type: "dashed" as const,
          color: t.splitLine,
        },
      },
    },
    series: [
      {
        type: "bar" as const,
        data: flowNetworkData.map((d) => d.performance),
        itemStyle: {
          color: t.accent,
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 36,
      },
    ],
  };

  return (
    <div>
      <ReactECharts
        key={isDark ? "d" : "l"}
        option={option}
        style={{ height: "220px", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
      <div className="flex items-center gap-2 px-1 mt-1">
        <span className="text-xs font-mono text-text-muted">
          Network Health Index:
        </span>
        <span className="text-xs font-mono font-semibold text-accent">
          94.5
        </span>
      </div>
    </div>
  );
}
