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
      className={`bg-surface-card rounded border border-surface-border shadow-card border-l-4 ${borderColor[recommendation.priority] ?? "border-gray-400"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap px-4 pt-4 pb-2">
        <PriorityBadge priority={recommendation.priority} />
        <span className="font-mono tabular-nums text-xs text-text-secondary">
          {recommendation.timestamp}
        </span>
        <TriggerPill type={recommendation.triggerType} />
      </div>

      {/* Summary */}
      <p className="text-sm font-body text-text-secondary leading-relaxed px-4 pb-3">
        {recommendation.summary}
      </p>

      {/* Delta table */}
      <div className="px-4 pb-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border-subtle">
              <th className="text-left py-1.5 font-headline uppercase tracking-wider text-text-muted font-medium">
                Parameter
              </th>
              <th className="text-right py-1.5 font-headline uppercase tracking-wider text-text-muted font-medium">
                Current
              </th>
              <th className="text-right py-1.5 font-headline uppercase tracking-wider text-text-muted font-medium">
                Recommended
              </th>
              <th className="text-right py-1.5 font-headline uppercase tracking-wider text-text-muted font-medium">
                Delta
              </th>
            </tr>
          </thead>
          <tbody>
            {recommendation.deltas.map((d, i) => (
              <tr
                key={i}
                className={`border-b border-surface-border-subtle last:border-0 ${i % 2 === 1 ? "bg-surface-hover" : ""}`}
              >
                <td className="py-1.5 text-text-primary font-body">
                  {d.parameter}
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums text-text-secondary">
                  {d.current}
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums text-text-primary font-medium">
                  {d.recommended}
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums text-accent font-medium">
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
          className="px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wide bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
        >
          Acknowledge
        </button>
        <button
          type="button"
          onClick={onAddConstraint}
          className="px-3 py-1.5 rounded text-xs font-headline font-semibold uppercase tracking-wide border border-accent text-accent hover:bg-accent-muted transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
        >
          Add Constraint
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded text-xs font-headline font-medium uppercase tracking-wide text-text-muted hover:text-text-secondary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-text-muted focus:ring-offset-1"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
