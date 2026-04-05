"use client";

import { KPICard } from "@/components/ui/KPICard";
import { WaterfallChart } from "@/components/analytics/WaterfallChart";
import { DriftChart } from "@/components/analytics/DriftChart";
import { SensorHealthMatrix } from "@/components/analytics/SensorHealthMatrix";
import { ConstraintBarChart } from "@/components/analytics/ConstraintBarChart";
import { analyticsKPIs } from "@/data/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">
            Financial &amp; Model Health
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]">
            System Normal
          </span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">
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
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <WaterfallChart />
        </div>
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <DriftChart />
        </div>
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <SensorHealthMatrix />
        </div>
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <ConstraintBarChart />
        </div>
      </div>
    </div>
  );
}
