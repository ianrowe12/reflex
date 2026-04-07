"use client";

import { KPICard } from "@/components/ui/KPICard";
import type { KPICardData } from "@/types";
import ReactECharts from "echarts-for-react";
import { useChartTheme } from "@/lib/chart-theme";
import { useIsDark } from "@/lib/theme";

/* ── Mock Data ────────────────────────────────────────────────── */

const kpis: KPICardData[] = [
  { label: "Active Risks", value: 4, precision: 0 },
  { label: "Critical", value: 1, precision: 0, status: "warning" },
  { label: "Avg Risk Score", value: 6.1, precision: 1, unit: "/ 10" },
  {
    label: "Mitigated This Month",
    value: 3,
    precision: 0,
    trend: 2,
    trendLabel: "vs last month",
  },
];

const impactLabels = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];
const likelihoodLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];

// [impact(x), likelihood(y), score]
const heatmapPoints: [number, number, number][] = [
  [4, 3, 9.2],  // RSK-041 — Catastrophic × Possible
  [4, 2, 6.9],  // RSK-033 — Catastrophic × Unlikely
  [1, 3, 5.1],  // RSK-030 — Minor × Possible
  [3, 1, 3.2],  // RSK-025 — Major × Rare
];

type RiskCategory = "Operational" | "Financial" | "Safety" | "Environmental";

interface Risk {
  id: string;
  description: string;
  category: RiskCategory;
  score: number;
  owner: string;
  status: "Open" | "Mitigating" | "Monitoring";
}

const risks: Risk[] = [
  { id: "RSK-041", description: "FCC regenerator catalyst attrition above threshold", category: "Operational", score: 9.2, owner: "M. Chen", status: "Open" },
  { id: "RSK-033", description: "Approaching 365-day SOX emissions cap — may force switch to lower-sulfur crude slate", category: "Environmental", score: 6.9, owner: "L. Garcia", status: "Mitigating" },
  { id: "RSK-030", description: "Reformer tube wall thinning above forecast", category: "Operational", score: 5.1, owner: "T. Nguyen", status: "Monitoring" },
  { id: "RSK-025", description: "CDU overhead corrosion rate exceeding inspection plan", category: "Operational", score: 3.2, owner: "M. Chen", status: "Monitoring" },
];

const categoryColor: Record<RiskCategory, { bg: string; text: string; border: string }> = {
  Operational: { bg: "bg-blue-50 dark:bg-blue-500/15", text: "text-blue-700 dark:text-blue-300", border: "border-l-blue-500" },
  Financial: { bg: "bg-amber-50 dark:bg-amber-500/15", text: "text-amber-700 dark:text-amber-300", border: "border-l-amber-500" },
  Safety: { bg: "bg-red-50 dark:bg-red-500/15", text: "text-red-700 dark:text-red-300", border: "border-l-red-500" },
  Environmental: { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300", border: "border-l-emerald-500" },
};

const statusPill: Record<string, string> = {
  Open: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  Mitigating: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Monitoring: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

const trendMonths = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const trendScores = [52, 49, 51, 48, 46, 50, 47, 44, 43, 45, 42, 40];

/* ── Page Component ───────────────────────────────────────────── */

export default function RiskAssessmentPage() {
  const t = useChartTheme();
  const isDark = useIsDark();

  /* Heatmap chart */
  const heatmapOption: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: { top: 20, right: 20, bottom: 40, left: 100 },
    xAxis: {
      type: "category",
      data: impactLabels,
      position: "bottom",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 10,
        color: t.textMuted,
      },
      splitArea: { show: true, areaStyle: { color: [t.splitAreaA, t.splitAreaB] } },
    },
    yAxis: {
      type: "category",
      data: likelihoodLabels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 10,
        color: t.textMuted,
      },
      splitArea: { show: true, areaStyle: { color: [t.splitAreaA, t.splitAreaB] } },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: false,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      show: false,
      inRange: {
        color: t.heatmapScale,
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      textStyle: {
        color: t.tooltipText,
        fontFamily: t.fontMono,
        fontSize: 12,
      },
      formatter: (params: { value: [number, number, number] }) => {
        const [x, y, score] = params.value;
        return `Impact: ${impactLabels[x]}<br/>Likelihood: ${likelihoodLabels[y]}<br/>Score: ${score.toFixed(1)}`;
      },
    },
    series: [
      {
        type: "heatmap",
        data: heatmapPoints,
        label: {
          show: true,
          fontFamily: t.fontMono,
          fontSize: 11,
          color: isDark ? "#F3F4F6" : "#111827",
          formatter: (params: { value: [number, number, number] }) =>
            params.value[2].toFixed(1),
        },
        emphasis: {
          itemStyle: { shadowBlur: 6, shadowColor: "rgba(0,0,0,0.4)" },
        },
        itemStyle: {
          borderColor: isDark ? "#151B23" : "#FFFFFF",
          borderWidth: 3,
          borderRadius: 4,
        },
      },
    ],
  };

  /* Trend chart */
  const trendOption: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: { top: 16, right: 20, bottom: 24, left: 50 },
    xAxis: {
      type: "category",
      data: trendMonths,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: t.splitLine, type: "dashed" as const } },
      axisLabel: {
        fontFamily: t.fontMono,
        fontSize: 11,
        color: t.textMuted,
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
      formatter: (params: Array<{ name: string; value: number }>) =>
        `${params[0].name}: ${params[0].value} total risk score`,
    },
    series: [
      {
        type: "line",
        data: trendScores,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { color: t.accent, width: 2 },
        itemStyle: { color: t.accent },
        areaStyle: { color: t.accentSoft },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-text-primary">Risk Assessment</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-500/15 text-status-warning border border-amber-200 dark:border-amber-500/30">
            4 Active Risks
          </span>
        </div>
        <span className="text-xs font-mono text-text-muted">Synced 12s ago</span>
      </div>

      {/* Scope note */}
      <p className="text-xs font-body text-text-secondary -mt-2">
        This view focuses on risks that affect LP model planning. Safety, HR, and compliance risks are tracked separately by their respective departments.
      </p>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Two-column: Heatmap + Risk Table */}
      <div className="grid grid-cols-[55fr_45fr] gap-4">
        {/* Left: Heatmap */}
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
          <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">
            Risk Heatmap
          </h2>
          <ReactECharts
            key={isDark ? "d" : "l"}
            option={heatmapOption}
            style={{ height: 320, width: "100%" }}
            opts={{ renderer: "svg" }}
          />
        </div>

        {/* Right: Risk Table */}
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
          <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">
            Active Risks
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">ID</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Description</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Category</th>
                <th className="text-right py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Score</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Owner</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-surface-border-subtle last:border-0 border-l-4 ${categoryColor[r.category].border} ${i % 2 === 1 ? "bg-surface-hover" : ""}`}
                >
                  <td className="py-2 px-1 font-mono text-xs text-text-primary">{r.id}</td>
                  <td className="py-2 px-1 font-body text-xs text-text-secondary max-w-[180px] truncate">{r.description}</td>
                  <td className="py-2 px-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-wide ${categoryColor[r.category].bg} ${categoryColor[r.category].text}`}>
                      {r.category}
                    </span>
                  </td>
                  <td className="py-2 px-1 text-right font-mono text-xs text-text-primary">{r.score.toFixed(1)}</td>
                  <td className="py-2 px-1 font-body text-xs text-text-secondary">{r.owner}</td>
                  <td className="py-2 px-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-wide ${statusPill[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Risk Trend */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
        <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">
          Risk Trend — Total Score (12 Months)
        </h2>
        <ReactECharts
          key={isDark ? "d" : "l"}
          option={trendOption}
          style={{ height: 200, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
}
