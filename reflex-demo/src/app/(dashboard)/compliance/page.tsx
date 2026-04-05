"use client";

import { KPICard } from "@/components/ui/KPICard";
import type { KPICardData } from "@/types";

/* ── Mock Data ────────────────────────────────────────────────── */

const kpis: KPICardData[] = [
  { label: "Active Regulations", value: 12, precision: 0 },
  { label: "Compliance Rate", value: 98.5, precision: 1, unit: "%" },
  { label: "Upcoming Audits", value: 2, precision: 0 },
  { label: "Certifications", value: 8, precision: 0 },
];

type ComplianceStatus = "Compliant" | "Pending Review" | "Action Required";

interface Regulation {
  name: string;
  agency: string;
  status: ComplianceStatus;
  dueDate: string;
  lastReview: string;
  owner: string;
}

const regulations: Regulation[] = [
  { name: "Clean Air Act - MACT Standards", agency: "EPA", status: "Compliant", dueDate: "2026-06-30", lastReview: "2026-03-15", owner: "L. Garcia" },
  { name: "OSHA PSM - Process Safety Mgmt", agency: "OSHA", status: "Compliant", dueDate: "2026-09-01", lastReview: "2026-02-20", owner: "R. Kim" },
  { name: "SPCC Plan - Oil Spill Prevention", agency: "EPA", status: "Compliant", dueDate: "2026-07-15", lastReview: "2026-01-10", owner: "L. Garcia" },
  { name: "Wastewater Discharge Permit", agency: "State DEQ", status: "Pending Review", dueDate: "2026-04-30", lastReview: "2025-12-05", owner: "L. Garcia" },
  { name: "Air Quality Operating Permit", agency: "State DEQ", status: "Compliant", dueDate: "2026-12-01", lastReview: "2026-03-01", owner: "M. Chen" },
  { name: "RCRA Hazardous Waste Permit", agency: "EPA", status: "Compliant", dueDate: "2026-08-15", lastReview: "2026-02-28", owner: "T. Nguyen" },
  { name: "RMP - Risk Management Plan", agency: "EPA", status: "Pending Review", dueDate: "2026-05-15", lastReview: "2025-11-20", owner: "R. Kim" },
  { name: "Benzene NESHAP Compliance", agency: "EPA", status: "Compliant", dueDate: "2026-10-01", lastReview: "2026-03-10", owner: "L. Garcia" },
  { name: "OSHA Respiratory Protection", agency: "OSHA", status: "Action Required", dueDate: "2026-04-15", lastReview: "2025-10-15", owner: "R. Kim" },
  { name: "Stormwater Pollution Prevention", agency: "State DEQ", status: "Compliant", dueDate: "2026-11-30", lastReview: "2026-01-25", owner: "T. Nguyen" },
];

const complianceStatusColor: Record<ComplianceStatus, string> = {
  Compliant: "bg-emerald-100 text-emerald-700",
  "Pending Review": "bg-amber-100 text-amber-700",
  "Action Required": "bg-red-100 text-red-700",
};

interface Certification {
  name: string;
  issuingBody: string;
  expiryDate: string;
  daysRemaining: number;
}

const certifications: Certification[] = [
  { name: "ISO 14001", issuingBody: "Bureau Veritas", expiryDate: "2027-03-15", daysRemaining: 344 },
  { name: "ISO 45001", issuingBody: "DNV GL", expiryDate: "2026-11-20", daysRemaining: 229 },
  { name: "API 653", issuingBody: "American Petroleum Institute", expiryDate: "2026-05-27", daysRemaining: 52 },
  { name: "OSHA PSM", issuingBody: "OSHA VPP Star", expiryDate: "2026-09-10", daysRemaining: 158 },
];

interface Audit {
  name: string;
  auditor: string;
  scheduledDate: string;
  scope: string;
  preparationPct: number;
}

const audits: Audit[] = [
  {
    name: "EPA Compliance Inspection",
    auditor: "EPA Region 6",
    scheduledDate: "2026-05-12",
    scope: "Air emissions, wastewater discharge, hazardous waste handling, and SPCC plan verification",
    preparationPct: 72,
  },
  {
    name: "ISO 14001 Surveillance Audit",
    auditor: "Bureau Veritas",
    scheduledDate: "2026-06-08",
    scope: "Environmental management system effectiveness, corrective actions, and continual improvement evidence",
    preparationPct: 45,
  },
];

/* ── Helpers ──────────────────────────────────────────────────── */

function daysRemainingColor(days: number): string {
  if (days > 90) return "text-[#0D9488]";
  if (days >= 30) return "text-[#D97706]";
  return "text-[#DC2626]";
}

function daysRemainingBg(days: number): string {
  if (days > 90) return "bg-[#0D9488]";
  if (days >= 30) return "bg-[#D97706]";
  return "bg-[#DC2626]";
}

/* ── Page Component ───────────────────────────────────────────── */

export default function CompliancePage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">Compliance &amp; Regulatory</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]">
            Compliant
          </span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">Synced 12s ago</span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* Two-column: Table + Certs/Audits */}
      <div className="grid grid-cols-[60fr_40fr] gap-4">
        {/* Left: Regulatory Tracker Table */}
        <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
          <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
            Regulatory Tracker
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Regulation</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Agency</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Status</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Due Date</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Last Review</th>
                <th className="text-left py-2 text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF] font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {regulations.map((r, i) => (
                <tr
                  key={r.name}
                  className={`border-b border-[#F3F4F6] last:border-0 ${i % 2 === 1 ? "bg-[#F9FAFB]" : ""}`}
                >
                  <td className="py-2 font-body text-xs text-[#111827]">{r.name}</td>
                  <td className="py-2 font-mono text-xs text-[#4B5563]">{r.agency}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-semibold uppercase tracking-wide ${complianceStatusColor[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 font-mono text-xs text-[#4B5563]">{r.dueDate}</td>
                  <td className="py-2 font-mono text-xs text-[#4B5563]">{r.lastReview}</td>
                  <td className="py-2 font-body text-xs text-[#4B5563]">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Certifications */}
          <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
            <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
              Certifications
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="border border-[#E5E7EB] rounded p-3 flex flex-col gap-1.5"
                >
                  <span className="text-sm font-headline font-semibold text-[#111827]">{cert.name}</span>
                  <span className="text-[10px] font-body text-[#9CA3AF]">{cert.issuingBody}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-mono text-[#4B5563]">Exp: {cert.expiryDate}</span>
                    <span className={`text-xs font-mono font-semibold ${daysRemainingColor(cert.daysRemaining)}`}>
                      {cert.daysRemaining}d
                    </span>
                  </div>
                  {/* Days remaining indicator bar */}
                  <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${daysRemainingBg(cert.daysRemaining)}`}
                      style={{ width: `${Math.min((cert.daysRemaining / 365) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Audits */}
          <div className="bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4">
            <h2 className="text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3">
              Upcoming Audits
            </h2>
            <div className="flex flex-col gap-3">
              {audits.map((audit) => (
                <div
                  key={audit.name}
                  className="border border-[#E5E7EB] rounded p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-headline font-semibold text-[#111827]">{audit.name}</span>
                    <span className="font-mono text-xs text-[#4B5563]">{audit.scheduledDate}</span>
                  </div>
                  <span className="text-[10px] font-body text-[#9CA3AF]">Auditor: {audit.auditor}</span>
                  <p className="text-xs font-body text-[#4B5563]">{audit.scope}</p>
                  {/* Preparation bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]">Preparation</span>
                      <span className="text-xs font-mono text-[#111827]">{audit.preparationPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0D9488]"
                        style={{ width: `${audit.preparationPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
