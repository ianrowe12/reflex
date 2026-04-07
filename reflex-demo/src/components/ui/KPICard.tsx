"use client";

import Link from "next/link";
import clsx from "clsx";
import type { KPICardData } from "@/types";
import { AnimatedMetric } from "./AnimatedMetric";

interface KPICardProps {
  data: KPICardData;
  href?: string;
  sparklineLabel?: string;
}

export function KPICard({ data, href, sparklineLabel }: KPICardProps) {
  const cardClasses = clsx(
    "bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-1 h-full",
    href &&
      "cursor-pointer hover:border-[#0D9488]/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] transition-all",
  );

  const inner = (
    <>
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
      {data.caption && (
        <span className="text-xs font-body text-[#9CA3AF] mt-0.5">
          {data.caption}
        </span>
      )}
      {data.trend !== undefined && (
        <span className="text-xs font-mono text-[#0D9488]">
          {data.trend > 0 ? "+" : ""}{data.trend}% {data.trendLabel}
        </span>
      )}
      {data.sparkline && (
        <>
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
          {sparklineLabel && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] mt-0.5">
              {sparklineLabel}
            </span>
          )}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {inner}
      </Link>
    );
  }
  return <div className={cardClasses}>{inner}</div>;
}
