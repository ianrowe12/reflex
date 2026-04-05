"use client";

import ReactECharts from "echarts-for-react";
import { driftData } from "@/data/mock-data";

export function DriftChart() {
  const driftStartIndex = driftData.findIndex(
    (d) => d.predicted - d.actual > 0.15
  );

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
      data: driftData.map((d) => d.date),
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        color: "#9CA3AF",
        interval: 29,
      },
    },
    yAxis: {
      type: "value",
      min: 7.4,
      max: 8.2,
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
        formatter: (v: number) => `${v.toFixed(1)}%`,
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#111827",
      borderColor: "#111827",
      textStyle: {
        color: "#F9FAFB",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 12,
      },
      formatter: (params: Array<{ seriesName: string; value: number; axisValue: string }>) => {
        const lines = params.map(
          (p) => `${p.seriesName}: ${Number(p.value).toFixed(2)}%`
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
        data: driftData.map((d) => d.predicted),
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#0D9488", width: 2 },
        itemStyle: { color: "#0D9488" },
        markArea:
          driftStartIndex >= 0
            ? {
                silent: true,
                data: [
                  [
                    {
                      xAxis: driftData[driftStartIndex].date,
                      itemStyle: {
                        color: "rgba(217, 119, 6, 0.08)",
                      },
                    },
                    { xAxis: driftData[driftData.length - 1].date },
                  ],
                ],
              }
            : undefined,
      },
      {
        name: "Actual",
        type: "line",
        data: driftData.map((d) => Number(d.actual.toFixed(3))),
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#9CA3AF", width: 2, type: "dashed" as const },
        itemStyle: { color: "#9CA3AF" },
      },
    ],
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-headline font-semibold text-[#111827]">
          Model Drift — Yield Prediction
        </h3>
        <div className="flex items-center gap-4 text-xs font-mono text-[#9CA3AF]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-[#0D9488]" />
            Predicted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-[#9CA3AF] border-t border-dashed border-[#9CA3AF]" />
            Actual
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
        {driftStartIndex >= 0 && (
          <div
            className="absolute top-2 right-8 px-2 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A]"
          >
            Drift Detected
          </div>
        )}
      </div>
    </div>
  );
}
