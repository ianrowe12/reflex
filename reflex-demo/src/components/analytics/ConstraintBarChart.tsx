"use client";

import ReactECharts from "echarts-for-react";
import { constraintPatterns } from "@/data/mock-data";

export function ConstraintBarChart() {
  const categories = constraintPatterns.map((c) => c.name);
  const values = constraintPatterns.map((c) => c.count);
  const maxVal = Math.max(...values);
  const topPattern = constraintPatterns[0];

  const option: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: {
      top: 10,
      right: 60,
      bottom: 10,
      left: 10,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: "#F3F4F6", type: "dashed" as const },
      },
      axisLabel: { show: false },
      max: maxVal + 3,
    },
    yAxis: {
      type: "category",
      data: categories,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        color: "#9CA3AF",
        width: 180,
        overflow: "truncate" as const,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "#111827",
      borderColor: "#111827",
      textStyle: {
        color: "#F9FAFB",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 12,
      },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const item = params[0];
        return `${item.name}: ${item.value} occurrences`;
      },
    },
    series: [
      {
        type: "bar",
        data: values.map((v, i) => ({
          value: v,
          itemStyle: {
            color: i === 0 ? "#D97706" : "#D1D5DB",
            borderRadius: [0, 2, 2, 0],
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: "right" as const,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 11,
          color: "#4B5563",
          formatter: (p: { value: number }) => String(p.value),
        },
      },
    ],
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-headline font-semibold text-[#111827]">
          Recurring Constraint Patterns
        </h3>
      </div>
      <div className="flex-1 min-h-0">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
      {topPattern?.annotation && (
        <p className="text-xs font-mono text-[#D97706] mt-2">
          {topPattern.annotation}
        </p>
      )}
      <div className="flex gap-2 mt-3">
        <button className="px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wider bg-[#0D9488] text-white hover:bg-[#0F766E] transition-colors">
          Implement Change
        </button>
        <button className="px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wider text-[#9CA3AF] border border-[#D1D5DB] hover:border-[#9CA3AF] transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}
