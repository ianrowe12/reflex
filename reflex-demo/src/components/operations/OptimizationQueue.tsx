"use client";

import { optimizationQueue } from "@/data/mock-data";

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return (
      <span className="text-emerald-600 font-mono text-sm" aria-label="Trending up">
        &#9650;
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="text-red-500 font-mono text-sm" aria-label="Trending down">
        &#9660;
      </span>
    );
  }
  return (
    <span className="text-[#9CA3AF] font-mono text-sm" aria-label="Stable">
      &mdash;
    </span>
  );
}

export function OptimizationQueue() {
  return (
    <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
          Optimization Queue
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="text-left px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Asset ID
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Name
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Stability %
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Trend
              </th>
              <th className="text-right px-4 py-2.5 text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {optimizationQueue.map((item, i) => (
              <tr
                key={item.assetId}
                className={`border-b border-[#F3F4F6] last:border-0 ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}
              >
                <td className="px-4 py-2.5 font-mono tabular-nums text-[#111827] text-xs">
                  {item.assetId}
                </td>
                <td className="px-4 py-2.5 font-body text-[#4B5563]">
                  {item.name}
                </td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-[#111827]">
                  {item.stability.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 text-center">
                  <TrendIndicator trend={item.trend} />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    className="px-3 py-1 rounded text-xs font-headline font-semibold uppercase tracking-wide border border-[#0D9488] text-[#0D9488] hover:bg-[#F0FDFA] transition-colors cursor-pointer"
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
