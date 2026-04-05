"use client";

import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { waterfallData } from "@/data/mock-data";

const timeRanges = ["30d", "90d", "YTD"] as const;

export function WaterfallChart() {
  const [activeRange, setActiveRange] = useState<(typeof timeRanges)[number]>("90d");

  const summaryCategories = ["Margin Captured", "Additional Opportunity"];
  const summaryValues = [1240, 280];
  const summaryColors = ["#0D9488", "#D1D5DB"];

  const unitCategories = waterfallData.map((d) => d.name);
  const unitValues = waterfallData.map((d) => d.value);

  const allCategories = [...summaryCategories, "", ...unitCategories];
  const allValues = [...summaryValues, 0, ...unitValues];
  const allColors = [
    ...summaryColors,
    "transparent",
    ...unitCategories.map(() => "#0D9488"),
  ];

  const option: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: {
      top: 20,
      right: 40,
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
        lineStyle: { color: "#F3F4F6", type: "dashed" as const },
      },
      axisLabel: {
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        color: "#9CA3AF",
        formatter: (v: number) => `$${v}K`,
      },
    },
    yAxis: {
      type: "category",
      data: allCategories,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        color: "#9CA3AF",
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
        if (!item || !item.name) return "";
        if (item.name === "Margin Captured") return `$${(item.value / 1000).toFixed(2)}M captured`;
        if (item.name === "Additional Opportunity") return `$${item.value}K additional opportunity`;
        return `${item.name}: $${item.value}K`;
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
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 11,
          color: "#4B5563",
          formatter: (p: { value: number; dataIndex: number }) => {
            if (p.dataIndex === 2) return "";
            if (p.dataIndex === 0) return `$${(p.value / 1000).toFixed(2)}M`;
            return `$${p.value}K`;
          },
        },
      },
    ],
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-headline font-semibold text-[#111827]">
          Margin Waterfall
        </h3>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                activeRange === range
                  ? "bg-[#0D9488] text-white"
                  : "bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#4B5563]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
}
