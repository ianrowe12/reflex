"use client";

import { optimizationQueue } from "@/data/mock-data";

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return (
      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm" aria-label="Trending up">
        &#9650;
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="text-red-500 dark:text-red-400 font-mono text-sm" aria-label="Trending down">
        &#9660;
      </span>
    );
  }
  return (
    <span className="text-text-muted font-mono text-sm" aria-label="Stable">
      &mdash;
    </span>
  );
}

export function OptimizationQueue() {
  return (
    <div className="bg-surface-card rounded border border-surface-border shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-border">
        <h3 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
          Optimization Queue
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
                Asset ID
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
                Name
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
                Stability %
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
                Trend
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-text-muted font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {optimizationQueue.map((item, i) => (
              <tr
                key={item.assetId}
                className={`border-b border-surface-border-subtle last:border-0 ${i % 2 === 1 ? "bg-surface-hover" : ""}`}
              >
                <td className="px-4 py-2.5 font-mono tabular-nums text-text-primary text-xs">
                  {item.assetId}
                </td>
                <td className="px-4 py-2.5 font-body text-text-secondary">
                  {item.name}
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-text-primary">
                  {item.stability.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 text-center">
                  <TrendIndicator trend={item.trend} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    className="px-3 py-1 rounded text-xs font-headline font-semibold uppercase tracking-wide border border-accent text-accent hover:bg-accent-muted transition-colors cursor-pointer"
                  >
                    Optimize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
