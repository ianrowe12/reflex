"use client";

import Link from "next/link";
import { KPICard } from "@/components/ui/KPICard";
import type { KPICardData } from "@/types";
import {
  sankeyNodes,
  sankeyLinks,
  refineryUnits,
} from "@/data/mock-data";
import ReactECharts from "echarts-for-react";
import { useChartTheme } from "@/lib/chart-theme";
import { useIsDark } from "@/lib/theme";

/* ------------------------------------------------------------------ */
/* KPI strip                                                          */
/* ------------------------------------------------------------------ */

const kpis: KPICardData[] = [
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
    label: "Plant Feed Rate",
    value: 105,
    unit: "K BPD",
    precision: 0,
    trend: 1.5,
    trendLabel: "vs plan",
  },
];

/* ------------------------------------------------------------------ */
/* Page component                                                     */
/* ------------------------------------------------------------------ */

export default function RefineryFlowPage() {
  const t = useChartTheme();
  const isDark = useIsDark();

  const colorForRatio = (ratio: number): string => {
    if (ratio < 0.9) return t.critical;
    if (ratio < 0.98) return t.warning;
    if (ratio <= 1.05) return t.healthy;
    if (ratio <= 1.1) return t.warning;
    return t.critical;
  };

  const sankeyOption: Record<string, unknown> = {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      textStyle: {
        color: t.tooltipText,
        fontFamily: t.fontMono,
        fontSize: 12,
      },
      formatter: (params: {
        dataType?: string;
        name?: string;
        data: {
          source?: string;
          target?: string;
          value?: number;
          target_value?: number;
          name?: string;
        };
      }) => {
        if (params.dataType === "edge") {
          const { source, target, value, target_value } = params.data;
          const actual = value ?? 0;
          const planned = target_value ?? 0;
          const pct = planned > 0 ? Math.round((actual / planned) * 100) : 0;
          return `${source} → ${target}<br/>${actual} / ${planned} kbpd <span style="color:${t.textMuted}">(${pct}%)</span>`;
        }
        return `<b>${params.name ?? params.data?.name ?? ""}</b>`;
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
          curveness: 0.5,
        },
        label: {
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 11,
          color: t.text,
        },
        itemStyle: {
          color: t.accent,
          borderColor: t.tooltipBorder,
        },
        data: sankeyNodes,
        links: sankeyLinks.map((link) => ({
          ...link,
          lineStyle: {
            color: colorForRatio(link.value / link.target_value),
            opacity: t.sankeyLinkOpacity,
            curveness: 0.5,
          },
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-text-primary">
            Refinery Flow
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-accent-muted text-accent border border-accent-light">
            All Units Online
          </span>
        </div>
        <span className="text-xs font-mono text-text-muted">Synced 12s ago</span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Sankey chart card */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
            Material Flow Network
          </h2>
          <div className="flex items-center gap-3 text-[10px] font-headline uppercase tracking-wider text-text-muted">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-accent" />
              On target
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-status-warning" />
              ±2–10%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-status-critical" />
              Off target
            </span>
          </div>
        </div>
        <ReactECharts
          key={isDark ? "d" : "l"}
          option={sankeyOption}
          style={{ height: "400px", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>

      {/* Unit Status section header */}
      <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
        Unit Status
      </h2>

      {/* Unit Status grid */}
      <div className="grid grid-cols-3 gap-3">
        {refineryUnits.map((unit) => (
          <Link
            key={unit.slug}
            href={`/units/${unit.slug}`}
            className={`block bg-surface-card rounded border border-surface-border shadow-card p-4 border-l-4 hover:shadow-card-hover hover:border-text-muted transition-all ${
              unit.status === "Caution"
                ? "border-l-status-warning"
                : "border-l-accent"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-headline font-semibold text-text-primary">
                {unit.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    unit.status === "Caution"
                      ? "bg-status-warning"
                      : "bg-accent"
                  }`}
                />
                <span
                  className={`text-xs font-body ${
                    unit.status === "Caution"
                      ? "text-status-warning"
                      : "text-accent"
                  }`}
                >
                  {unit.status}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs font-body text-text-muted">
                  Throughput
                </span>
                <span className="text-xs font-mono text-text-primary">
                  {unit.throughput} K BPD{" "}
                  <span className="text-text-muted">
                    (target: {unit.throughputTarget})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-body text-text-muted">
                  Temperature
                </span>
                <span className="text-xs font-mono text-text-primary">
                  {unit.temp} °F
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-body text-text-muted">
                  Pressure
                </span>
                <span className="text-xs font-mono text-text-primary">
                  {unit.pressure} psi
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
