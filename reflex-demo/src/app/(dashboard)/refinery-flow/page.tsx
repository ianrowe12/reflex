"use client";

import { KPICard } from "@/components/ui/KPICard";
import type { KPICardData } from "@/types";
import ReactECharts from "echarts-for-react";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

const kpis: KPICardData[] = [
  {
    label: "Total Throughput",
    value: 412.8,
    unit: "MBPD",
    precision: 1,
    trend: 2.1,
    trendLabel: "vs yesterday",
  },
  {
    label: "Network Efficiency",
    value: 94.5,
    unit: "%",
    precision: 1,
    trend: 0.8,
    trendLabel: "vs target",
  },
  {
    label: "Active Units",
    value: 6,
    unit: "/6",
    precision: 0,
  },
  {
    label: "Feed Rate",
    value: 105,
    unit: "K BPD",
    precision: 0,
    trend: 1.5,
    trendLabel: "vs plan",
  },
];

const units = [
  { name: "CDU", status: "Online" as const, throughput: 105, temp: 725, pressure: 42 },
  { name: "FCC", status: "Online" as const, throughput: 38, temp: 985, pressure: 28 },
  { name: "HCU", status: "Caution" as const, throughput: 28, temp: 780, pressure: 165 },
  { name: "Reformer", status: "Online" as const, throughput: 22, temp: 925, pressure: 350 },
  { name: "Blend", status: "Online" as const, throughput: 17, temp: 180, pressure: 15 },
  { name: "Storage", status: "Online" as const, throughput: 85, temp: 95, pressure: 2 },
];

/* ------------------------------------------------------------------ */
/* Sankey chart option                                                */
/* ------------------------------------------------------------------ */

const sankeyOption: Record<string, unknown> = {
  tooltip: {
    trigger: "item",
    triggerOn: "mousemove",
    backgroundColor: "#111827",
    borderColor: "#111827",
    textStyle: {
      color: "#F9FAFB",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 12,
    },
  },
  animation: true,
  animationDuration: 600,
  series: [
    {
      type: "sankey",
      layout: "none",
      emphasis: { focus: "adjacency" },
      nodeAlign: "justify",
      nodeGap: 12,
      nodeWidth: 20,
      lineStyle: {
        color: "gradient",
        curveness: 0.5,
      },
      label: {
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 11,
        color: "#111827",
      },
      data: [
        { name: "Crude Feed", itemStyle: { color: "#0D9488" } },
        { name: "CDU", itemStyle: { color: "#0D9488" } },
        { name: "FCC", itemStyle: { color: "#0D9488" } },
        { name: "HCU", itemStyle: { color: "#0D9488" } },
        { name: "Reformer", itemStyle: { color: "#14B8A6" } },
        { name: "Blend", itemStyle: { color: "#14B8A6" } },
        { name: "Gasoline Pool", itemStyle: { color: "#5EEAD4" } },
        { name: "LPG", itemStyle: { color: "#5EEAD4" } },
        { name: "Diesel Pool", itemStyle: { color: "#5EEAD4" } },
        { name: "Naphtha", itemStyle: { color: "#5EEAD4" } },
        { name: "Reformate", itemStyle: { color: "#5EEAD4" } },
        { name: "H2", itemStyle: { color: "#5EEAD4" } },
        { name: "Product Out", itemStyle: { color: "#5EEAD4" } },
      ],
      links: [
        { source: "Crude Feed", target: "CDU", value: 105 },
        { source: "CDU", target: "FCC", value: 38 },
        { source: "CDU", target: "HCU", value: 28 },
        { source: "CDU", target: "Reformer", value: 22 },
        { source: "CDU", target: "Blend", value: 17 },
        { source: "FCC", target: "Gasoline Pool", value: 32 },
        { source: "FCC", target: "LPG", value: 6 },
        { source: "HCU", target: "Diesel Pool", value: 24 },
        { source: "HCU", target: "Naphtha", value: 4 },
        { source: "Reformer", target: "Reformate", value: 18 },
        { source: "Reformer", target: "H2", value: 4 },
        { source: "Blend", target: "Product Out", value: 17 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Page component                                                     */
/* ------------------------------------------------------------------ */

export default function RefineryFlowPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">
            Refinery Flow
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]">
            All Units Online
          </span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">Synced 12s ago</span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Sankey chart card */}
      <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
          Material Flow Network
        </h2>
        <ReactECharts
          option={sankeyOption}
          style={{ height: "400px", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>

      {/* Unit Status section header */}
      <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
        Unit Status
      </h2>

      {/* Unit Status grid */}
      <div className="grid grid-cols-3 gap-3">
        {units.map((unit) => (
          <div
            key={unit.name}
            className={`bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 border-l-4 ${
              unit.status === "Caution"
                ? "border-l-[#D97706]"
                : "border-l-[#0D9488]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-headline font-semibold text-[#111827]">
                {unit.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    unit.status === "Caution"
                      ? "bg-[#D97706]"
                      : "bg-[#0D9488]"
                  }`}
                />
                <span
                  className={`text-xs font-body ${
                    unit.status === "Caution"
                      ? "text-[#D97706]"
                      : "text-[#0D9488]"
                  }`}
                >
                  {unit.status}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs font-body text-[#9CA3AF]">
                  Throughput
                </span>
                <span className="text-xs font-mono text-[#111827]">
                  {unit.throughput} K BPD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-body text-[#9CA3AF]">
                  Temperature
                </span>
                <span className="text-xs font-mono text-[#111827]">
                  {unit.temp} °F
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-body text-[#9CA3AF]">
                  Pressure
                </span>
                <span className="text-xs font-mono text-[#111827]">
                  {unit.pressure} psi
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
