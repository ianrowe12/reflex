"use client";

import { useState } from "react";
import {
  Database,
  Radio,
  BrainCircuit,
  MessageSquare,
  Server,
  Link2Off,
  Settings2,
} from "lucide-react";

type SettingsTab = "Profile" | "Integrations" | "Notifications" | "System";

const TABS: SettingsTab[] = ["Profile", "Integrations", "Notifications", "System"];

/* ---------- Integrations data ---------- */
const integrations = [
  { name: "PI System", icon: Database, connected: true, detail: "127 tags synced", lastActivity: "Last sync: 32s ago" },
  { name: "Market Data", icon: Radio, connected: true, detail: "EIA + OPIS feeds", lastActivity: "Last sync: 5m ago" },
  { name: "LP Solver", icon: Settings2, connected: true, detail: "Excel COM v2.1", lastActivity: "Last solve: 14m ago" },
  { name: "AI Engine", icon: BrainCircuit, connected: true, detail: "Claude Haiku", lastActivity: "Requests today: 23" },
  { name: "Teams", icon: MessageSquare, connected: true, detail: "#reflex-alerts channel", lastActivity: "Last message: 8m ago" },
  { name: "ERP System", icon: Server, connected: false, detail: "Not configured", lastActivity: "" },
];

/* ---------- Notifications data ---------- */
type NotifCategory = {
  label: string;
  inApp: boolean;
  email: boolean;
  teams: boolean;
  sms: boolean;
};

const defaultNotifications: NotifCategory[] = [
  { label: "Recommendations", inApp: true, email: true, teams: true, sms: false },
  { label: "Constraint Alerts", inApp: true, email: true, teams: true, sms: true },
  { label: "System Warnings", inApp: true, email: true, teams: true, sms: true },
  { label: "Shift Handover", inApp: true, email: true, teams: false, sms: false },
  { label: "Daily Digest", inApp: true, email: true, teams: false, sms: false },
  { label: "Model Drift", inApp: true, email: false, teams: true, sms: false },
];

/* ---------- Styled checkbox ---------- */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
        checked
          ? "bg-accent border-accent"
          : "bg-surface-card border-surface-border hover:border-text-muted"
      }`}
    >
      {checked && (
        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

/* ---------- Toggle switch ---------- */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
        checked ? "bg-accent" : "bg-surface-border"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-surface-card transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");

  /* Profile state */
  const [fullName, setFullName] = useState("J. Martinez");
  const [email, setEmail] = useState("j.martinez@valero.com");
  const [role, setRole] = useState("Shift Supervisor");
  const [timezone, setTimezone] = useState("US/Central (CDT)");
  const [shiftSchedule, setShiftSchedule] = useState("Day Shift (06:00–18:00)");

  /* Notifications state */
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [quietHours, setQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("06:00");

  const toggleNotif = (index: number, channel: "inApp" | "email" | "teams" | "sms") => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, [channel]: !n[channel] } : n))
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-text-primary">Settings</h1>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-surface-border">
        <div className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-xs font-headline uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Profile" && (
        <div className="bg-surface-card rounded border border-surface-border shadow-card p-6">
          <div className="flex flex-col gap-5 max-w-lg">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-white font-headline font-bold text-lg">
                JM
              </div>
              <div>
                <p className="text-sm font-headline font-medium text-text-primary">J. Martinez</p>
                <p className="text-xs font-body text-text-muted">Shift Supervisor</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-surface-border text-sm font-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-surface-border text-sm font-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-1 block">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-surface-border text-sm font-body text-text-primary bg-surface-card focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                >
                  <option>Shift Supervisor</option>
                  <option>Process Engineer</option>
                  <option>Plant Manager</option>
                  <option>Operator</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-1 block">Site</label>
                <input
                  type="text"
                  value="Valero Memphis"
                  disabled
                  className="w-full px-3 py-2 rounded border border-surface-border text-sm font-body text-text-secondary bg-surface-hover cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-1 block">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-surface-border text-sm font-body text-text-primary bg-surface-card focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                >
                  <option>US/Central (CDT)</option>
                  <option>US/Eastern (EDT)</option>
                  <option>US/Pacific (PDT)</option>
                  <option>UTC</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-1 block">Shift Schedule</label>
                <select
                  value={shiftSchedule}
                  onChange={(e) => setShiftSchedule(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-surface-border text-sm font-body text-text-primary bg-surface-card focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                >
                  <option>Day Shift (06:00–18:00)</option>
                  <option>Night Shift (18:00–06:00)</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button className="px-4 py-2 rounded bg-accent text-white text-sm font-headline font-medium hover:bg-accent-hover transition-colors cursor-pointer">
                Save Changes
              </button>
              <button className="px-4 py-2 text-sm font-headline font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Integrations" && (
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((intg) => (
            <div
              key={intg.name}
              className="bg-surface-card rounded border border-surface-border shadow-card p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded bg-surface-hover border border-surface-border flex items-center justify-center">
                    {intg.connected ? (
                      <intg.icon className="h-4.5 w-4.5 text-text-secondary" />
                    ) : (
                      <Link2Off className="h-4.5 w-4.5 text-text-muted" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-headline font-medium text-text-primary">{intg.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          intg.connected ? "bg-accent" : "bg-status-critical"
                        }`}
                      />
                      <span className="text-xs font-body text-text-secondary">
                        {intg.connected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs font-body text-text-secondary">{intg.detail}</p>
              {intg.connected ? (
                <p className="text-xs font-mono text-text-muted">{intg.lastActivity}</p>
              ) : (
                <button className="self-start px-3 py-1.5 rounded border border-accent text-xs font-headline font-medium text-accent hover:bg-accent-muted transition-colors cursor-pointer">
                  Configure
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="flex flex-col gap-5">
          {/* Notification Preferences Table */}
          <div className="bg-surface-card rounded border border-surface-border shadow-card">
            <div className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-3 px-4 py-2.5 border-b border-surface-border bg-surface-hover">
              <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Category</span>
              <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium text-center">In-App</span>
              <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium text-center">Email</span>
              <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium text-center">Teams</span>
              <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium text-center">SMS</span>
            </div>
            {notifications.map((notif, i) => (
              <div
                key={notif.label}
                className={`grid grid-cols-[1fr_80px_80px_80px_80px] gap-3 px-4 py-3 border-b border-surface-border ${
                  i % 2 === 1 ? "bg-surface-hover" : "bg-surface-card"
                }`}
              >
                <span className="text-sm font-body text-text-primary">{notif.label}</span>
                <div className="flex justify-center">
                  <Checkbox checked={notif.inApp} onChange={() => toggleNotif(i, "inApp")} />
                </div>
                <div className="flex justify-center">
                  <Checkbox checked={notif.email} onChange={() => toggleNotif(i, "email")} />
                </div>
                <div className="flex justify-center">
                  <Checkbox checked={notif.teams} onChange={() => toggleNotif(i, "teams")} />
                </div>
                <div className="flex justify-center">
                  <Checkbox checked={notif.sms} onChange={() => toggleNotif(i, "sms")} />
                </div>
              </div>
            ))}
          </div>

          {/* Quiet Hours */}
          <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-headline font-medium text-text-primary">Quiet Hours</h3>
                <p className="text-xs font-body text-text-muted mt-0.5">Suppress non-critical notifications during off hours</p>
              </div>
              <Toggle checked={quietHours} onChange={() => setQuietHours(!quietHours)} />
            </div>
            {quietHours && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-border">
                <label className="text-xs font-body text-text-secondary">From</label>
                <input
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className="px-2 py-1 rounded border border-surface-border text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <label className="text-xs font-body text-text-secondary">To</label>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className="px-2 py-1 rounded border border-surface-border text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "System" && (
        <div className="flex flex-col gap-4">
          {/* System Info */}
          <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
            <h3 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">System Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ["Version", "Reflex v2.1.0"],
                ["Environment", "Production"],
                ["License", "Enterprise — Constellation Energy"],
                ["Database", "PostgreSQL 16 + TimescaleDB"],
                ["Region", "US-Central"],
                ["Last Updated", "2026-03-28"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm font-body text-text-secondary">{label}</span>
                  <span className="text-sm font-mono text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
            <h3 className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mb-3">Data Retention</h3>
            <div className="flex flex-col gap-2">
              {[
                ["Sensor Data", "2 years"],
                ["Audit Logs", "7 years"],
                ["Recommendations", "Indefinite"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm font-body text-text-secondary">{label}</span>
                  <span className="text-sm font-mono text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded border border-surface-border text-sm font-headline font-medium text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
              Contact Administrator
            </button>
            <button className="px-4 py-2 rounded border border-surface-border text-sm font-headline font-medium text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
              Export System Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
