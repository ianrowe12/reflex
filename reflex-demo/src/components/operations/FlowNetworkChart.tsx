"use client";

import ReactECharts from "echarts-for-react";
import { flowNetworkData } from "@/data/mock-data";

export function FlowNetworkChart() {
  const option = {
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
      backgroundColor: "#111827",
      borderColor: "#111827",
      borderRadius: 4,
      textStyle: {
        color: "#FFFFFF",
        fontFamily: "var(--font-ibm-plex-mono), monospace",
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
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: 11,
        color: "#9CA3AF",
      },
    },
    yAxis: {
      type: "value" as const,
      min: 70,
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: 11,
        color: "#9CA3AF",
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: {
          type: "dashed" as const,
          color: "#F3F4F6",
        },
      },
    },
    series: [
      {
        type: "bar" as const,
        data: flowNetworkData.map((d) => d.performance),
        itemStyle: {
          color: "#0D9488",
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 36,
      },
    ],
  };

  return (
    <div>
      <ReactECharts
        option={option}
        style={{ height: "220px", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
      <div className="flex items-center gap-2 px-1 mt-1">
        <span className="text-xs font-mono text-[#9CA3AF]">
          Network Health Index:
        </span>
        <span className="text-xs font-mono font-semibold text-[#0D9488]">
          94.5
        </span>
      </div>
    </div>
  );
}
