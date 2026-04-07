"use client";

import ReactECharts from "echarts-for-react";
import { KPICard } from "@/components/ui/KPICard";
import { emissionsKPIs, equipmentEmissions } from "@/data/mock-data";

export default function EmissionsPage() {
  const rows = [...equipmentEmissions]
    .map((e) => ({ ...e, pctOfLimit: (e.hour1Rolling / e.epaLimit) * 100 }))
    .sort((a, b) => b.pctOfLimit - a.pctOfLimit);

  const colorFor = (pct: number) =>
    pct >= 90 ? "#DC2626" : pct >= 70 ? "#D97706" : "#0D9488";

  const chartOption = {
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
        const p = params[0];
        return `<span style="font-weight:600">${p.name}</span><br/>${p.value.toFixed(1)}% of EPA limit`;
      },
    },
    grid: { top: 12, right: 48, bottom: 24, left: 8, containLabel: true },
    xAxis: {
      type: "value" as const,
      min: 0,
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
        lineStyle: { type: "dashed" as const, color: "#F3F4F6" },
      },
    },
    yAxis: {
      type: "category" as const,
      data: rows.map((r) => r.equipment),
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "var(--font-ibm-plex-sans), sans-serif",
        fontSize: 12,
        color: "#4B5563",
        width: 180,
        overflow: "truncate",
      },
    },
    series: [
      {
        type: "bar" as const,
        data: rows.map((r) => ({
          value: r.pctOfLimit,
          itemStyle: {
            color: colorFor(r.pctOfLimit),
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barMaxWidth: 28,
        label: {
          show: true,
          position: "right" as const,
          formatter: (p: { value: number }) => `${p.value.toFixed(0)}%`,
          color: "#4B5563",
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 11,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-[#111827]">
          Emissions
        </h1>
        <span className="text-sm font-body text-[#4B5563]">
          Equipment-level pollutant rates and EPA limit utilization
        </span>
      </div>

      {/* Hero KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {emissionsKPIs.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Equipment table */}
      <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="px-4 py-3 border-b border-[#E5E7EB]">
          <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
            Equipment Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr className="text-left text-xs font-headline uppercase tracking-wider text-[#9CA3AF]">
                <th className="px-4 py-2 font-medium">Equipment</th>
                <th className="px-4 py-2 font-medium">Pollutant</th>
                <th className="px-4 py-2 font-medium text-right">Current</th>
                <th className="px-4 py-2 font-medium text-right">1h avg</th>
                <th className="px-4 py-2 font-medium text-right">24h avg</th>
                <th className="px-4 py-2 font-medium text-right">7d avg</th>
                <th className="px-4 py-2 font-medium text-right">365d avg</th>
                <th className="px-4 py-2 font-medium text-right">EPA limit</th>
                <th className="px-4 py-2 font-medium text-right">% of limit ↓</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB]"
                >
                  <td className="px-4 py-3 font-body text-[#111827]">{r.equipment}</td>
                  <td className="px-4 py-3 font-body text-[#4B5563]">{r.pollutant}</td>
                  <td className="px-4 py-3 font-mono text-right text-[#111827]">{r.currentRate.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-[#4B5563]">{r.hour1Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-[#4B5563]">{r.hour24Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-[#4B5563]">{r.day7Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-[#4B5563]">{r.day365Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-[#4B5563]">{r.epaLimit.toFixed(1)}</td>
                  <td
                    className="px-4 py-3 font-mono text-right font-semibold"
                    style={{ color: colorFor(r.pctOfLimit) }}
                  >
                    {r.pctOfLimit.toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 border-t border-[#F3F4F6] text-xs font-body text-[#9CA3AF]">
            All rates in lb/hr. % of limit computed against 1-hour rolling average.
          </div>
        </div>
      </div>

      {/* Limit utilization chart */}
      <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
          EPA Limit Utilization (1-hour rolling)
        </h2>
        <ReactECharts
          option={chartOption}
          style={{ height: "240px", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
        <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#9CA3AF]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[#0D9488]" /> &lt; 70%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[#D97706]" /> 70–90%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[#DC2626]" /> &gt; 90%
          </span>
        </div>
      </div>

      {/* Why this matters callout */}
      <div className="bg-[#F0FDFA] border border-[#0D9488]/20 rounded p-4 flex gap-3">
        <div className="w-1 self-stretch bg-[#0D9488] rounded-full" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-headline uppercase tracking-wider text-[#0D9488] font-semibold">
            Why this matters
          </span>
          <p className="text-sm font-body text-[#4B5563]">
            EPA emissions limits act as hard constraints inside the LP model.
            Exceeding 1-hour or 365-day rolling averages incurs fines and
            consent-decree exposure, so the optimizer must know how close each
            emitter is to its caps before it can recommend a yield or
            throughput change. The closer a unit is to its cap, the less
            headroom the LP has to push that unit harder.
          </p>
        </div>
      </div>
    </div>
  );
}
