"use client";

import { useMemo } from "react";
import { useIsDark } from "./theme";

export interface ChartTheme {
  /** Primary text — axis labels, legends, headlines inside SVG */
  text: string;
  /** Muted text — tick labels, secondary axis text */
  textMuted: string;
  /** Subtle dashed gridlines */
  splitLine: string;
  /** Tooltip background fill */
  tooltipBg: string;
  /** Tooltip border */
  tooltipBorder: string;
  /** Tooltip text */
  tooltipText: string;
  /** Alternating heatmap split-area bands */
  splitAreaA: string;
  splitAreaB: string;
  /** Brand teal — used for primary series */
  accent: string;
  /** Brand teal with alpha — used for area fills */
  accentSoft: string;
  /** Status palette — same hue, brightness-tuned per mode */
  healthy: string;
  warning: string;
  critical: string;
  info: string;
  normal: string;
  /** Neutral grey for "other" series next to a highlighted bar */
  neutralBar: string;
  /** Heatmap color ramp (low → high) */
  heatmapScale: [string, string, string, string];
  /** Sankey link opacity */
  sankeyLinkOpacity: number;
  /** Mono font family for tabular numerics inside chart labels */
  fontMono: string;
}

export function getChartTheme(isDark: boolean): ChartTheme {
  return {
    text: isDark ? "#F3F4F6" : "#111827",
    textMuted: isDark ? "#7A8494" : "#9CA3AF",
    splitLine: isDark ? "#1F2632" : "#F3F4F6",
    tooltipBg: isDark ? "#0B0F14" : "#111827",
    tooltipBorder: isDark ? "#2A323D" : "#111827",
    tooltipText: isDark ? "#F3F4F6" : "#F9FAFB",
    splitAreaA: isDark ? "#1A2029" : "#FAFAFA",
    splitAreaB: isDark ? "#151B23" : "#F5F5F5",
    accent: isDark ? "#14B8A6" : "#0D9488",
    accentSoft: isDark ? "rgba(20, 184, 166, 0.10)" : "rgba(13, 148, 136, 0.06)",
    healthy: isDark ? "#14B8A6" : "#0D9488",
    warning: isDark ? "#F59E0B" : "#D97706",
    critical: isDark ? "#EF4444" : "#DC2626",
    info: isDark ? "#3B82F6" : "#2563EB",
    normal: isDark ? "#9CA3AF" : "#6B7280",
    neutralBar: isDark ? "#374151" : "#D1D5DB",
    heatmapScale: isDark
      ? ["#064E3B", "#78350F", "#7F1D1D", "#EF4444"]
      : ["#D1FAE5", "#FEF3C7", "#FEE2E2", "#DC2626"],
    sankeyLinkOpacity: isDark ? 0.45 : 0.6,
    fontMono: "var(--font-ibm-plex-mono), monospace",
  };
}

export function useChartTheme(): ChartTheme {
  const isDark = useIsDark();
  return useMemo(() => getChartTheme(isDark), [isDark]);
}
