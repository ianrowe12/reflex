"use client";

import { KPICard } from "@/components/ui/KPICard";
import { AnimatedMetric } from "@/components/ui/AnimatedMetric";
import type { KPICardData } from "@/types";
import ReactECharts from "echarts-for-react";

/* ── Mock Data ────────────────────────────────────────────────── */

const kpis: KPICardData[] = [
  { label: "TRIR", value: 0.42, precision: 2 },
  { label: "Near Misses This Month", value: 3, precision: 0 },
  { label: "Open Work Permits", value: 12, precision: 0 },
  { label: "Training Completion", value: 96, precision: 0, unit: "%" },
];

type IncidentType = "Spill" | "Near Miss" | "First Aid" | "Fire" | "Environmental";
type Severity = "Low" | "Medium" | "High";
type IncidentStatus = "Open" | "Investigating" | "Closed";

interface Incident {
  date: string;
  type: IncidentType;
  severity: Severity;
  location: string;
  description: string;
  status: IncidentStatus;
}

const incidents: Incident[] = [
  { date: "2026-04-02", type: "Near Miss", severity: "Medium", location: "FCC Unit", description: "Scaffold plank dislodged during maintenance access", status: "Investigating" },
  { date: "2026-03-28", type: "First Aid", severity: "Low", location: "CDU", description: "Minor hand laceration during gasket replacement", status: "Closed" },
  { date: "2026-03-15", type: "Spill", severity: "Medium", location: "Tank Farm", description: "Small diesel spill during tank gauging — 2 gal contained", status: "Investigating" },
  { date: "2026-03-01", type: "Near Miss", severity: "Low", location: "Reformer", description: "Dropped wrench from elevated platform — area was clear", status: "Closed" },
  { date: "2026-02-14", type: "Environmental", severity: "Low", location: "Wastewater", description: "Brief pH excursion in outfall — auto-corrected within 10 min", status: "Closed" },
  { date: "2026-01-20", type: "First Aid", severity: "Low", location: "HCU", description: "Chemical splash on arm — immediate decon, no injury", status: "Closed" },
  { date: "2025-12-05", type: "Fire", severity: "High", location: "Alkylation", description: "Small pump seal fire — extinguished in 45s by operator", status: "Closed" },
  { date: "2025-11-18", type: "Near Miss", severity: "Medium", location: "Blending", description: "Pressure relief valve lifted during startup — no release", status: "Closed" },
  { date: "2025-10-30", type: "Spill", severity: "Low", location: "Loading Rack", description: "Hose drip during truck loading — 0.5 gal on pad", status: "Closed" },
  { date: "2025-10-10", type: "First Aid", severity: "Low", location: "CDU", description: "Heat stress event during turnaround — worker treated on-site", status: "Open" },
];

const incidentTypeColor: Record<IncidentType, string> = {
  Spill: "bg-[#2563EB]",
  "Near Miss": "bg-[#D97706]",
  "First Aid": "bg-[#0D9488]",
  Fire: "bg-[#DC2626]",
  Environmental: "bg-purple-500",
};

const incidentStatusColor: Record<IncidentStatus, string> = {
  Open: "bg-red-100 text-red-700",
  Investigating: "bg-amber-100 text-amber-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

type PermitType = "Hot Work" | "Confined Space" | "Line Break" | "Excavation" | "Elevated Work";

interface WorkPermit {
  id: string;
  type: PermitType;
  location: string;
  validUntil: string;
  holder: string;
}

const permits: WorkPermit[] = [
  { id: "WP-2026-0412", type: "Hot Work", location: "FCC Regenerator Level 3", validUntil: "2026-04-05 18:00", holder: "D. Martinez" },
  { id: "WP-2026-0411", type: "Confined Space", location: "CDU Overhead Drum D-101", validUntil: "2026-04-05 16:00", holder: "A. Johnson" },
  { id: "WP-2026-0410", type: "Line Break", location: "HCU Feed Line L-204", validUntil: "2026-04-06 12:00", holder: "K. Williams" },
  { id: "WP-2026-0409", type: "Excavation", location: "Tank Farm Road B South", validUntil: "2026-04-07 17:00", holder: "S. Brown" },
  { id: "WP-2026-0408", type: "Elevated Work", location: "Reformer Stack Platform", validUntil: "2026-04-05 15:00", holder: "P. Davis" },
];

const permitBorderColor: Record<PermitType, string> = {
  "Hot Work": "border-l-[#DC2626]",
  "Confined Space": "border-l-[#D97706]",
  "Line Break": "border-l-[#2563EB]",
  Excavation: "border-l-[#0D9488]",
  "Elevated Work": "border-l-purple-500",
};

// TRIR over 24 months — gradual improvement from 0.8 to 0.42
const trirMonths = [
  "May '24", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan '25", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan '26", "Feb", "Mar", "Apr",
];
const trirValues = [
  0.80, 0.78, 0.75, 0.73, 0.71, 0.68, 0.72, 0.66,
  0.64, 0.62, 0.59, 0.61, 0.58, 0.55, 0.53, 0.51, 0.52, 0.48, 0.46, 0.47,
  0.45, 0.44, 0.43, 0.42,
];

/* ── Page Component ───────────────────────────────────────────── */

export default function SafetyPage() {
  /* TRIR Trend chart */
  const trirOption: Record<string, unknown> = {
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut" as const,
    grid: { top: 20, right: 20, bottom: 24, left: 50 },
    xAxis: {
      type: "category",
      data: trirMonths,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 10,
        color: "#9CA3AF",
        interval: 5,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 1.0,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: "#F3F4F6", type: "dashed" as const } },
      axisLabel: {
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 11,
        color: "#9CA3AF",
        formatter: (v: number) => v.toFixed(1),
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#111827",
      borderColor: "#111827",
      textStyle: {
        color: "#F9FAFB",
        fontFamily: "IBM Plex Mono, monospace",
        fontSize: 12,
      },
      formatter: (params: Array<{ name: string; value: number }>) =>
        `${params[0].name}<br/>TRIR: ${params[0].value.toFixed(2)}`,
    },
    series: [
      {
        type: "line",
        data: trirValues,
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        lineStyle: { color: "#0D9488", width: 2 },
        itemStyle: { color: "#0D9488" },
        areaStyle: { color: "rgba(13, 148, 136, 0.06)" },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed" as const, color: "#DC2626", width: 1 },
          label: {
            formatter: "Industry Avg",
            position: "end" as const,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10,
            color: "#DC2626",
          },
          data: [{ yAxis: 0.5 }],
        },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">Safety Management</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]">
            Safe Operations
          </span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">Synced 12s ago</span>
      </div>

      {/* Hero metric: Days Without Recordable Incident */}
      <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 border-l-4 border-l-[#0D9488]">
        <span className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">
          Days Without Recordable Incident
        </span>
        <div className="mt-1">
          <AnimatedMetric
            value={247}
            precision={0}
            className="text-4xl font-bold text-[#0D9488]"
          />
        </div>
        <span className="text-xs font-body text-[#9CA3AF] mt-1 block">
          Plant record: 312 days
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Two-column: Incident Log + Work Permits */}
      <div className="grid grid-cols-[55fr_45fr] gap-4">
        {/* Left: Incident Log */}
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
            Incident Log
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Date</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Type</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Severity</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Location</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Description</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc, i) => (
                <tr
                  key={`${inc.date}-${inc.type}`}
                  className={`border-b border-[#F3F4F6] last:border-0 ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}
                >
                  <td className="py-2 font-mono text-xs text-[#4B5563]">{inc.date}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${incidentTypeColor[inc.type]}`} />
                      <span className="font-body text-xs text-[#111827]">{inc.type}</span>
                    </div>
                  </td>
                  <td className="py-2 font-body text-xs text-[#4B5563]">{inc.severity}</td>
                  <td className="py-2 font-body text-xs text-[#4B5563]">{inc.location}</td>
                  <td className="py-2 font-body text-xs text-[#4B5563] max-w-[200px] truncate">{inc.description}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-wide ${incidentStatusColor[inc.status]}`}>
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Active Work Permits */}
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
            Active Work Permits
          </h2>
          <div className="flex flex-col gap-3">
            {permits.map((permit) => (
              <div
                key={permit.id}
                className={`border border-[#E5E7EB] rounded border-l-4 p-3 ${permitBorderColor[permit.type]}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-[#111827]">{permit.id}</span>
                  <span className="text-[10px] font-headline font-semibold uppercase tracking-wide text-[#4B5563]">
                    {permit.type}
                  </span>
                </div>
                <p className="text-xs font-body text-[#4B5563]">{permit.location}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] font-mono text-[#9CA3AF]">Valid until: {permit.validUntil}</span>
                  <span className="text-[10px] font-body text-[#9CA3AF]">{permit.holder}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Safety Trend */}
      <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
          Safety Trend — TRIR (24 Months)
        </h2>
        <ReactECharts
          option={trirOption}
          style={{ height: 220, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
}
