"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatedMetric } from "@/components/ui/AnimatedMetric";
import { KPICard } from "@/components/ui/KPICard";
import { RecommendationCard } from "@/components/operations/RecommendationCard";
import { FlowNetworkChart } from "@/components/operations/FlowNetworkChart";
import { ConstraintPanel } from "@/components/operations/ConstraintPanel";
import { OptimizationQueue } from "@/components/operations/OptimizationQueue";
import { ConstraintWizard } from "@/components/constraint-wizard/ConstraintWizard";
import { heroKPIs, recommendations, SITE } from "@/data/mock-data";

function useToast(duration = 3000) {
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => {
    setVisible(true);
  }, []);
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(id);
  }, [visible, duration]);
  return [visible, show] as const;
}

export default function OperationsPage() {
  const router = useRouter();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [optimizeToast, showOptimizeToast] = useToast();
  const [exportToast, showExportToast] = useToast();

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === "all") return;
    router.push(`/units/${v}`);
  };

  const projection30 = (SITE.marginRatePerDay * 30) / 1_000_000;
  const projectionAnnual = (SITE.marginRatePerDay * 365) / 1_000_000;

  return (
    <div className="flex flex-col gap-5">
      {/* ================================================================ */}
      {/* TOP SECTION: Hero metrics + KPI row                              */}
      {/* ================================================================ */}
      <div className="flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between">
          {/* Left: Total Realized Opportunity */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF]">
              Total Realized Opportunity
            </span>
            <div className="flex items-baseline gap-3">
              <AnimatedMetric
                value={SITE.marginRatePerDay / 1_000_000}
                prefix="$"
                suffix="M / day"
                precision={1}
                className="text-4xl font-bold text-[#111827]"
              />
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-mono bg-[#F0FDFA] text-[#0D9488]">
                +{SITE.marginTrend}%
              </span>
            </div>
            <span className="text-xs font-body text-[#9CA3AF] mt-1">
              30-day projection: ${projection30.toFixed(0)}M
              {" · "}
              Annual projection: ${projectionAnnual.toFixed(0)}M
            </span>
          </div>

          {/* Right: Unit selector + action buttons */}
          <div className="flex items-center gap-3">
            <select
              defaultValue="all"
              onChange={handleUnitChange}
              className="px-3 py-2 rounded text-sm font-body border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#0D9488] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] cursor-pointer"
              aria-label="Scope dashboard to unit"
            >
              <option value="all">All Units (Plant View)</option>
              <option value="cdu">CDU</option>
              <option value="fcc">FCC</option>
              <option value="hcu">HCU</option>
              <option value="reformer">Reformer</option>
            </select>
            <button
              type="button"
              onClick={showOptimizeToast}
              className="px-4 py-2 rounded text-sm font-headline font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] transition-colors cursor-pointer"
            >
              Optimize Run
            </button>
            <button
              type="button"
              onClick={showExportToast}
              className="px-4 py-2 rounded text-sm font-headline font-medium text-[#9CA3AF] hover:text-[#4B5563] transition-colors cursor-pointer"
            >
              Export Log
            </button>
          </div>
        </div>

        {/* KPI cards row */}
        <div className="grid grid-cols-3 gap-4">
          {heroKPIs.map((kpi) => (
            <KPICard
              key={kpi.label}
              data={kpi}
              href={kpi.label === "Emissions" ? "/emissions" : undefined}
              sparklineLabel={kpi.label === "Throughput" ? "daily avg" : undefined}
            />
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* MIDDLE SECTION: Recommendations + Flow Network / Constraints     */}
      {/* ================================================================ */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "55% 45%" }}>
        {/* Left column: Recommendation Feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
              Recommendation Feed
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDFA] text-[#0D9488]">
              {recommendations.length} active
            </span>
          </div>
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAddConstraint={() => setWizardOpen(true)}
            />
          ))}
        </div>

        {/* Right column: Flow Network + Constraint Panel */}
        <div className="flex flex-col gap-5">
          {/* Flow Network chart */}
          <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
            <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
              Refinery Flow Network
            </h2>
            <FlowNetworkChart />
          </div>

          {/* Constraint Panel */}
          <ConstraintPanel />
        </div>
      </div>

      {/* ================================================================ */}
      {/* BOTTOM SECTION: Optimization Queue                               */}
      {/* ================================================================ */}
      <OptimizationQueue />

      {/* Constraint Wizard Modal */}
      <ConstraintWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />

      {/* Toast notifications */}
      {optimizeToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0D9488] text-white px-4 py-3 rounded shadow-elevated font-body text-sm animate-[fadeIn_0.2s_ease-out]">
          Optimization run queued. Estimated completion: 2.3s
        </div>
      )}
      {exportToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-3 rounded shadow-elevated font-body text-sm animate-[fadeIn_0.2s_ease-out]">
          Export started. File will download shortly.
        </div>
      )}
    </div>
  );
}
