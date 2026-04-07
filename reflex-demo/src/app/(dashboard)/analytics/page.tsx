"use client";

import Link from "next/link";
import { KPICard } from "@/components/ui/KPICard";
import { WaterfallChart } from "@/components/analytics/WaterfallChart";
import { DriftChart } from "@/components/analytics/DriftChart";
import { SensorHealthMatrix } from "@/components/analytics/SensorHealthMatrix";
import { ConstraintBarChart } from "@/components/analytics/ConstraintBarChart";
import { analyticsKPIs, modelDriftByEquipment } from "@/data/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-text-primary">
            Financial &amp; Model Health
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-accent-muted text-accent border border-accent-light">
            System Normal
          </span>
        </div>
        <span className="text-xs font-mono text-text-muted">
          Synced 12s ago
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-5 gap-3">
        {analyticsKPIs.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* 2x2 chart grid: 55/45 split */}
      <div className="grid grid-cols-[55fr_45fr] grid-rows-[360px_360px] gap-4">
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
          <WaterfallChart />
        </div>
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/model-drift"
              className="text-sm font-headline font-semibold text-text-primary hover:text-accent transition-colors"
            >
              Model Drift — by Equipment
            </Link>
            <Link
              href="/model-drift"
              className="text-xs font-mono text-accent hover:underline"
            >
              View detail →
            </Link>
          </div>
          <div className="flex-1 min-h-0">
            <DriftChart hideHeader />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {modelDriftByEquipment.map((row) => {
              const deltaColor =
                row.status === "drift"
                  ? "text-status-critical"
                  : row.status === "watch"
                    ? "text-status-warning"
                    : "text-accent";
              return (
                <div
                  key={row.area}
                  className="flex flex-col gap-0.5 rounded border border-surface-border-subtle bg-surface-hover px-2 py-1.5"
                >
                  <span className="text-[10px] font-headline uppercase tracking-wider text-text-muted truncate">
                    {row.area}
                  </span>
                  <span className="font-mono text-[11px] text-text-secondary">
                    {row.predicted}→{row.actual}
                  </span>
                  <span className={`font-mono text-[11px] ${deltaColor}`}>
                    {row.delta > 0 ? "+" : ""}
                    {row.delta} ({row.deltaPct > 0 ? "+" : ""}
                    {row.deltaPct.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
          <SensorHealthMatrix />
        </div>
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
          <ConstraintBarChart />
        </div>
      </div>
    </div>
  );
}
