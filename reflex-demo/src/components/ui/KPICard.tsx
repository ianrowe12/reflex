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
    "bg-surface-card rounded border border-surface-border shadow-card p-4 flex flex-col gap-1 h-full",
    href &&
      "cursor-pointer hover:border-accent/40 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all",
  );

  const inner = (
    <>
      <span className="text-xs font-headline uppercase tracking-wider text-text-muted">
        {data.label}
      </span>
      <div className="flex items-baseline gap-2">
        <AnimatedMetric
          value={data.value}
          prefix={data.prefix}
          precision={data.precision ?? 1}
          className="text-2xl font-semibold text-text-primary"
        />
        {data.unit && (
          <span className="text-xs font-body uppercase tracking-wider text-text-muted">
            {data.unit}
          </span>
        )}
      </div>
      {data.caption && (
        <span className="text-xs font-body text-text-muted mt-0.5">
          {data.caption}
        </span>
      )}
      {data.trend !== undefined && (
        <span className="text-xs font-mono text-accent">
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
                  className="flex-1 bg-accent/30 rounded-t"
                  style={{ height: `${Math.max(height, 10)}%` }}
                />
              );
            })}
          </div>
          {sparklineLabel && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-0.5">
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
