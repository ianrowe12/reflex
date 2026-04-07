"use client";

import { useState } from "react";
import { KPICard } from "@/components/ui/KPICard";
import type { KPICardData } from "@/types";
import { useChartTheme } from "@/lib/chart-theme";

/* ── Mock Data ────────────────────────────────────────────────── */

const kpis: KPICardData[] = [
  { label: "Total Assets", value: 142, precision: 0 },
  { label: "Average Health", value: 91.2, precision: 1, unit: "/ 100" },
  { label: "Maintenance Due", value: 5, precision: 0, status: "warning" },
  { label: "Uptime", value: 99.2, precision: 1, unit: "%" },
];

type AssetType = "Pump" | "Valve" | "Exchanger" | "Reactor";
type AssetStatus = "Online" | "Maintenance" | "Offline";

interface Asset {
  id: string;
  name: string;
  unit: string;
  type: AssetType;
  health: number;
  lastInspection: string;
  nextMaintenance: string;
  status: AssetStatus;
}

const assets: Asset[] = [
  { id: "AST-001", name: "CDU Feed Pump A", unit: "CDU", type: "Pump", health: 94, lastInspection: "2026-02-15", nextMaintenance: "2026-05-15", status: "Online" },
  { id: "AST-002", name: "CDU Feed Pump B", unit: "CDU", type: "Pump", health: 87, lastInspection: "2026-01-20", nextMaintenance: "2026-04-20", status: "Online" },
  { id: "AST-003", name: "FCC Regen Valve V-101", unit: "FCC", type: "Valve", health: 72, lastInspection: "2025-12-10", nextMaintenance: "2026-04-10", status: "Online" },
  { id: "AST-004", name: "HCU Recycle Pump", unit: "HCU", type: "Pump", health: 96, lastInspection: "2026-03-01", nextMaintenance: "2026-06-01", status: "Online" },
  { id: "AST-005", name: "Reformer Pre-Heat Exchanger", unit: "Reformer", type: "Exchanger", health: 88, lastInspection: "2026-01-05", nextMaintenance: "2026-04-05", status: "Online" },
  { id: "AST-006", name: "Alkylation Reactor R-201", unit: "Alkylation", type: "Reactor", health: 91, lastInspection: "2026-02-28", nextMaintenance: "2026-08-28", status: "Online" },
  { id: "AST-007", name: "CDU Overhead Condenser", unit: "CDU", type: "Exchanger", health: 65, lastInspection: "2025-11-15", nextMaintenance: "2026-04-08", status: "Maintenance" },
  { id: "AST-008", name: "FCC Slide Valve SV-02", unit: "FCC", type: "Valve", health: 82, lastInspection: "2026-02-01", nextMaintenance: "2026-05-01", status: "Online" },
  { id: "AST-009", name: "HCU Hydrogen Compressor", unit: "HCU", type: "Pump", health: 45, lastInspection: "2025-10-20", nextMaintenance: "2026-04-06", status: "Offline" },
  { id: "AST-010", name: "Reformer Reactor R-301", unit: "Reformer", type: "Reactor", health: 93, lastInspection: "2026-03-10", nextMaintenance: "2026-09-10", status: "Online" },
  { id: "AST-011", name: "Blend Header Valve BV-05", unit: "Blending", type: "Valve", health: 98, lastInspection: "2026-03-15", nextMaintenance: "2026-06-15", status: "Online" },
  { id: "AST-012", name: "FCC Main Fractionator Reboiler", unit: "FCC", type: "Exchanger", health: 76, lastInspection: "2025-12-22", nextMaintenance: "2026-04-22", status: "Online" },
  { id: "AST-013", name: "CDU Desalter Pump P-103", unit: "CDU", type: "Pump", health: 89, lastInspection: "2026-01-30", nextMaintenance: "2026-04-30", status: "Online" },
  { id: "AST-014", name: "Alkylation Acid Settler Valve", unit: "Alkylation", type: "Valve", health: 58, lastInspection: "2025-11-01", nextMaintenance: "2026-04-12", status: "Maintenance" },
  { id: "AST-015", name: "HCU Reactor R-401", unit: "HCU", type: "Reactor", health: 95, lastInspection: "2026-03-05", nextMaintenance: "2026-09-05", status: "Online" },
];

const tabs: { id: string; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Pump", label: "Pumps" },
  { id: "Valve", label: "Valves" },
  { id: "Exchanger", label: "Exchangers" },
  { id: "Reactor", label: "Reactors" },
];

const statusColor: Record<AssetStatus, string> = {
  Online: "bg-emerald-100 text-emerald-700",
  Maintenance: "bg-amber-100 text-amber-700",
  Offline: "bg-red-100 text-red-700",
};

interface MaintenanceItem {
  date: string;
  asset: string;
  work: string;
  duration: string;
  type: "routine" | "corrective" | "predictive" | "inspection";
}

const upcomingMaintenance: MaintenanceItem[] = [
  { date: "2026-04-05", asset: "CDU Overhead Condenser", work: "Tube bundle cleaning & inspection", duration: "3 days", type: "corrective" },
  { date: "2026-04-06", asset: "HCU Hydrogen Compressor", work: "Bearing replacement & alignment", duration: "5 days", type: "corrective" },
  { date: "2026-04-10", asset: "FCC Regen Valve V-101", work: "Actuator calibration & seat inspection", duration: "1 day", type: "predictive" },
  { date: "2026-04-12", asset: "Alkylation Acid Settler Valve", work: "Full valve overhaul", duration: "2 days", type: "routine" },
  { date: "2026-04-20", asset: "CDU Feed Pump B", work: "Vibration analysis & seal check", duration: "4 hrs", type: "inspection" },
];

const dotColor: Record<string, string> = {
  routine: "bg-text-muted",
  corrective: "bg-status-critical",
  predictive: "bg-accent",
  inspection: "bg-status-info",
};

/* ── Page Component ───────────────────────────────────────────── */

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const t = useChartTheme();

  const filtered = activeTab === "All" ? assets : assets.filter((a) => a.type === activeTab);

  return (
    <div className="flex flex-col gap-5">
      {/* Integration notice */}
      <div className="bg-accent-muted border border-accent-light rounded p-3 flex items-start gap-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-surface-card text-accent border border-accent-light shrink-0 mt-0.5">
          Optional Integration
        </span>
        <p className="text-xs font-body text-accent-hover leading-relaxed">
          Asset Management is an optional integration. Connect your asset management system (e.g. SAP PM, Maximo, Aveva APM) to populate live equipment data. The data shown below is sample data for demonstration purposes.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-text-primary">Asset Management</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-accent-muted text-accent border border-accent-light">
            System Normal
          </span>
        </div>
        <span className="text-xs font-mono text-text-muted">Synced 12s ago</span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Filter tabs + Table */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card">
        {/* Tabs */}
        <div className="flex border-b border-surface-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-headline uppercase tracking-wider text-center transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent font-semibold"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Equipment Registry Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Asset ID</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Name</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Unit</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Type</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Health</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Last Inspection</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Next Maintenance</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-text-muted font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const barColor =
                  a.health > 80 ? t.healthy : a.health >= 50 ? t.warning : t.critical;
                return (
                  <tr
                    key={a.id}
                    className={`border-b border-surface-border-subtle last:border-0 ${i % 2 === 1 ? "bg-surface-hover" : ""}`}
                  >
                    <td className="py-2 font-mono text-xs text-text-primary">{a.id}</td>
                    <td className="py-2 font-body text-xs text-text-primary">{a.name}</td>
                    <td className="py-2 font-body text-xs text-text-secondary">{a.unit}</td>
                    <td className="py-2 font-body text-xs text-text-secondary">{a.type}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-border-subtle rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${a.health}%`, backgroundColor: barColor }}
                          />
                        </div>
                        <span className="font-mono text-xs text-text-primary">{a.health}</span>
                      </div>
                    </td>
                    <td className="py-2 font-mono text-xs text-text-secondary">{a.lastInspection}</td>
                    <td className="py-2 font-mono text-xs text-text-secondary">{a.nextMaintenance}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-wide ${statusColor[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Maintenance */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
        <h2 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">
          Upcoming Maintenance
        </h2>
        <div className="flex flex-col gap-0">
          {upcomingMaintenance.map((item, i) => (
            <div key={i} className="flex gap-3 py-2.5">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center pt-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[item.type]}`} />
                {i < upcomingMaintenance.length - 1 && (
                  <div className="w-px flex-1 bg-surface-border mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono tabular-nums text-xs text-text-muted">{item.date}</span>
                  <span className="text-xs font-headline font-semibold text-text-primary">{item.asset}</span>
                </div>
                <p className="text-xs font-body text-text-secondary mt-0.5">{item.work}</p>
                <span className="text-[10px] font-mono text-text-muted">Est. {item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
