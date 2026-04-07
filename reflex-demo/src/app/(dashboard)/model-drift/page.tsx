"use client";

import Link from "next/link";
import { useState } from "react";
import { KPICard } from "@/components/ui/KPICard";
import { DriftChart } from "@/components/analytics/DriftChart";
import {
  modelDriftByEquipment,
  modelDriftKPIs,
  type ModelDriftEquipmentRow,
} from "@/data/mock-data";

const statusBadge: Record<ModelDriftEquipmentRow["status"], string> = {
  ok: "bg-accent-muted text-accent border border-accent-light",
  watch: "bg-amber-50 dark:bg-amber-500/10 text-status-warning border border-amber-200 dark:border-amber-500/30",
  drift: "bg-red-50 dark:bg-red-500/10 text-status-critical border border-red-200 dark:border-red-500/30",
};

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 18;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`
    )
    .join(" ");
  return (
    <svg width={w} height={h} className="inline-block align-middle">
      <polyline points={points} fill="none" stroke="currentColor" className="text-status-warning" strokeWidth="1.5" />
    </svg>
  );
}

export default function ModelDriftPage() {
  const [activeArea, setActiveArea] = useState<string>(
    modelDriftByEquipment[0].area
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header + breadcrumb */}
      <div>
        <Link
          href="/analytics"
          className="text-xs font-mono text-text-muted hover:text-accent transition-colors"
        >
          ← Back to Reports
        </Link>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="font-headline text-xl font-bold text-text-primary">
            Model Drift Detail
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-status-warning border border-amber-200 dark:border-amber-500/30">
            Drift Detected
          </span>
        </div>
        <p className="text-xs font-body text-text-muted mt-0.5">
          LP coefficient relationships diverging from real plant behavior
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {modelDriftKPIs.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Two-column: table + chart */}
      <div className="grid grid-cols-[55fr_45fr] gap-4">
        {/* Equipment-area breakdown */}
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
          <h3 className="text-sm font-headline font-semibold text-text-primary mb-3">
            Equipment-Area Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border">
                  {["Area", "Predicted", "Actual", "Δ", "Δ %", "7-Day", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {modelDriftByEquipment.map((row) => {
                  const isActive = activeArea === row.area;
                  const deltaColor =
                    row.delta < 0 ? "text-status-warning" : "text-accent";
                  return (
                    <tr
                      key={row.area}
                      onClick={() => setActiveArea(row.area)}
                      className={`border-b border-surface-border-subtle last:border-0 cursor-pointer transition-colors ${
                        isActive ? "bg-accent-muted" : "hover:bg-surface-hover"
                      }`}
                    >
                      <td className="py-2 font-body text-text-primary">{row.area}</td>
                      <td className="py-2 font-mono text-text-secondary">
                        {row.predicted}{" "}
                        <span className="text-text-muted">{row.unit}</span>
                      </td>
                      <td className="py-2 font-mono text-text-secondary">{row.actual}</td>
                      <td className={`py-2 font-mono ${deltaColor}`}>
                        {row.delta > 0 ? "+" : ""}
                        {row.delta}
                      </td>
                      <td className={`py-2 font-mono ${deltaColor}`}>
                        {row.deltaPct > 0 ? "+" : ""}
                        {row.deltaPct.toFixed(2)}%
                      </td>
                      <td className="py-2">
                        <Sparkline data={row.trend7d} />
                      </td>
                      <td className="py-2">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider ${
                            statusBadge[row.status]
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drift over time */}
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-4 flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between mb-3 gap-3">
            <h3 className="text-sm font-headline font-semibold text-text-primary truncate">
              Predicted vs Actual — {activeArea}
            </h3>
            <select
              value={activeArea}
              onChange={(e) => setActiveArea(e.target.value)}
              className="text-xs font-mono border border-surface-border rounded px-2 py-1 text-text-secondary bg-surface-card shrink-0"
            >
              {modelDriftByEquipment.map((r) => (
                <option key={r.area} value={r.area}>
                  {r.area}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-h-[260px]">
            <DriftChart equipmentArea={activeArea} hideHeader />
          </div>
        </div>
      </div>

      {/* Inline explainer */}
      <div className="bg-accent-muted border border-accent-light rounded p-4">
        <h4 className="text-xs font-headline font-bold uppercase tracking-wider text-accent mb-2">
          What is model drift?
        </h4>
        <p className="text-sm font-body text-text-secondary leading-relaxed">
          Model drift means the LP&apos;s coefficient relationships have diverged
          from real plant behavior — the model&apos;s predictions no longer match
          what the sensors observe. Pumps and valves are usually <em>not</em> the
          culprit. Drift typically lives in <strong>reactors</strong> (catalyst
          aging), <strong>heat exchangers</strong> (fouling),{" "}
          <strong>fractionators</strong> (composition shifts), and{" "}
          <strong>blenders</strong> (component property drift). When drift exceeds
          ~3% in a critical area, the LP should be recalibrated.
        </p>
      </div>
    </div>
  );
}
