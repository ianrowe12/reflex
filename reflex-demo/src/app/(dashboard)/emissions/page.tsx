"use client";

import ReactECharts from "echarts-for-react";
import { KPICard } from "@/components/ui/KPICard";
import { emissionsKPIs, equipmentEmissions } from "@/data/mock-data";
import { useChartTheme } from "@/lib/chart-theme";
import { useIsDark } from "@/lib/theme";

export default function EmissionsPage() {
  const t = useChartTheme();
  const isDark = useIsDark();

  const rows = [...equipmentEmissions]
    .map((e) => ({ ...e, pctOfLimit: (e.hour1Rolling / e.epaLimit) * 100 }))
    .sort((a, b) => b.pctOfLimit - a.pctOfLimit);

  const colorFor = (pct: number) =>
    pct >= 90 ? t.critical : pct >= 70 ? t.warning : t.accent;

  const chartOption = {
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
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
        formatter: "{value}%",
      },
      splitLine: {
        lineStyle: { type: "dashed" as const, color: t.splitLine },
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
        color: t.textMuted,
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
          color: t.textMuted,
          fontFamily: t.fontMono,
          fontSize: 11,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-headline font-bold text-text-primary">
          Emissions
        </h1>
        <span className="text-sm font-body text-text-secondary">
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
      <div className="bg-surface-card rounded border border-surface-border shadow-card">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
            Equipment Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-hover border-b border-surface-border">
              <tr className="text-left text-xs font-headline uppercase tracking-wider text-text-muted">
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
                  className="border-b border-surface-border-subtle last:border-b-0 hover:bg-surface-hover"
                >
                  <td className="px-4 py-3 font-body text-text-primary">{r.equipment}</td>
                  <td className="px-4 py-3 font-body text-text-secondary">{r.pollutant}</td>
                  <td className="px-4 py-3 font-mono text-right text-text-primary">{r.currentRate.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-text-secondary">{r.hour1Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-text-secondary">{r.hour24Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-text-secondary">{r.day7Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-text-secondary">{r.day365Rolling.toFixed(1)}</td>
                  <td className="px-4 py-3 font-mono text-right text-text-secondary">{r.epaLimit.toFixed(1)}</td>
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
          <div className="px-4 py-2 border-t border-surface-border-subtle text-xs font-body text-text-muted">
            All rates in lb/hr. % of limit computed against 1-hour rolling average.
          </div>
        </div>
      </div>

      {/* Limit utilization chart */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
        <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">
          EPA Limit Utilization (1-hour rolling)
        </h2>
        <ReactECharts
          key={isDark ? "d" : "l"}
          option={chartOption}
          style={{ height: "240px", width: "100%" }}
          opts={{ renderer: "canvas" }}
        />
        <div className="flex items-center gap-4 mt-2 text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-accent" /> &lt; 70%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-status-warning" /> 70–90%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-status-critical" /> &gt; 90%
          </span>
        </div>
      </div>

      {/* Why this matters callout */}
      <div className="bg-accent-muted border border-accent/20 rounded p-4 flex gap-3">
        <div className="w-1 self-stretch bg-accent rounded-full" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-headline uppercase tracking-wider text-accent font-semibold">
            Why this matters
          </span>
          <p className="text-sm font-body text-text-secondary">
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
