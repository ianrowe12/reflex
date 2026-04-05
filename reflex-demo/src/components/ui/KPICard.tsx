"use client";

import type { KPICardData } from "@/types";
import { AnimatedMetric } from "./AnimatedMetric";

export function KPICard({ data }: { data: KPICardData }) {
  return (
    <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-1">
      <span className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF]">
        {data.label}
      </span>
      <div className="flex items-baseline gap-2">
        <AnimatedMetric
          value={data.value}
          prefix={data.prefix}
          precision={data.precision ?? 1}
          className="text-2xl font-semibold text-[#111827]"
        />
        {data.unit && (
          <span className="text-xs font-body uppercase tracking-wider text-[#9CA3AF]">
            {data.unit}
          </span>
        )}
      </div>
      {data.trend !== undefined && (
        <span className="text-xs font-mono text-[#0D9488]">
          {data.trend > 0 ? "+" : ""}{data.trend}% {data.trendLabel}
        </span>
      )}
      {data.sparkline && (
        <div className="flex items-end gap-px h-4 mt-1">
          {data.sparkline.map((v, i) => {
            const max = Math.max(...data.sparkline!);
            const min = Math.min(...data.sparkline!);
            const range = max - min || 1;
            const height = ((v - min) / range) * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-[#0D9488]/20 rounded-t"
                style={{ height: `${Math.max(height, 10)}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
