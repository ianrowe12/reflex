"use client";

import type { Recommendation } from "@/types";
import { PriorityBadge, TriggerPill } from "@/components/ui/StatusBadge";

const borderColor: Record<string, string> = {
  critical: "border-red-500",
  high: "border-amber-500",
  medium: "border-blue-500",
  advisory: "border-gray-400",
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAddConstraint: () => void;
}

export function RecommendationCard({
  recommendation,
  onAddConstraint,
}: RecommendationCardProps) {
  return (
    <div
      className={`bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-l-4 ${borderColor[recommendation.priority] ?? "border-gray-400"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap px-4 pt-4 pb-2">
        <PriorityBadge priority={recommendation.priority} />
        <span className="font-mono tabular-nums text-xs text-[#4B5563]">
          {recommendation.timestamp}
        </span>
        <TriggerPill type={recommendation.triggerType} />
      </div>

      {/* Summary */}
      <p className="text-sm font-body text-[#4B5563] leading-relaxed px-4 pb-3">
        {recommendation.summary}
      </p>

      {/* Delta table */}
      <div className="px-4 pb-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#F3F4F6]">
              <th className="text-left py-1.5 font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Parameter
              </th>
              <th className="text-right py-1.5 font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Current
              </th>
              <th className="text-right py-1.5 font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Recommended
              </th>
              <th className="text-right py-1.5 font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Delta
              </th>
            </tr>
          </thead>
          <tbody>
            {recommendation.deltas.map((d, i) => (
              <tr
                key={i}
                className={`border-b border-[#F3F4F6] last:border-0 ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}
              >
                <td className="py-1.5 text-[#111827] font-body">
                  {d.parameter}
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums text-[#4B5563]">
                  {d.current}
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums text-[#111827] font-medium">
                  {d.recommended}
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums text-[#0D9488] font-medium">
                  {d.delta ?? "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 pb-4 pt-1">
        <button
          type="button"
          className="px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wide bg-[#0D9488] text-white hover:bg-[#0F766E] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-1"
        >
          Acknowledge
        </button>
        <button
          type="button"
          onClick={onAddConstraint}
          className="px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wide border border-[#0D9488] text-[#0D9488] hover:bg-[#F0FDFA] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-1"
        >
          Add Constraint
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded text-xs font-headline font-medium uppercase tracking-wide text-[#9CA3AF] hover:text-[#4B5563] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9CA3AF] focus:ring-offset-1"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
