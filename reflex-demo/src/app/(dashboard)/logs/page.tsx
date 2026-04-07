"use client";

import { useState } from "react";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

type LogType = "System" | "User" | "API" | "Alert";
type Severity = "Info" | "Warning" | "Error" | "Critical";

interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  severity: Severity;
  source: string;
  message: string;
  fullMessage?: string;
  stackTrace?: string;
  metadata?: Record<string, string>;
}

const LOG_DATA: LogEntry[] = [
  {
    id: "log-001",
    timestamp: "2026-04-05 14:23:07",
    type: "System",
    severity: "Info",
    source: "pi-gateway",
    message: "PI historian connection refreshed — 127 tags synced",
    fullMessage: "PI historian connection refreshed — 127 tags synced across 4 data servers. Average latency: 12ms. No tag resolution failures detected.",
    metadata: { "Tags Synced": "127", "Servers": "4", "Avg Latency": "12ms", "Failed Tags": "0" },
  },
  {
    id: "log-002",
    timestamp: "2026-04-05 14:22:53",
    type: "System",
    severity: "Info",
    source: "lp-orchestrator",
    message: "LP model solve completed in 2.3s — feasible solution",
    fullMessage: "LP model solve completed in 2.3s — feasible solution found. Objective value: $47,230. Iterations: 342. Solver: COIN-OR CBC v2.10.",
    metadata: { "Solve Time": "2.3s", "Objective": "$47,230", "Iterations": "342", "Solver": "COIN-OR CBC v2.10" },
  },
  {
    id: "log-003",
    timestamp: "2026-04-05 14:22:41",
    type: "User",
    severity: "Info",
    source: "auth-service",
    message: "User J. Martinez acknowledged recommendation rec-1",
    fullMessage: "User J. Martinez (shift-supervisor) acknowledged recommendation rec-1 (Increase FCC feed rate). Action logged to audit trail.",
    metadata: { "User": "J. Martinez", "Role": "Shift Supervisor", "Recommendation": "rec-1", "Action": "Acknowledge" },
  },
  {
    id: "log-004",
    timestamp: "2026-04-05 14:22:18",
    type: "API",
    severity: "Warning",
    source: "market-feed",
    message: "Market data feed timeout — retrying in 30s",
    fullMessage: "Market data feed timeout on EIA endpoint after 15s. Retry scheduled in 30s. Previous successful fetch: 14:21:48. Affected feeds: WTI spot, RBOB crack.",
    metadata: { "Endpoint": "EIA", "Timeout": "15s", "Retry In": "30s", "Affected Feeds": "WTI spot, RBOB crack" },
  },
  {
    id: "log-005",
    timestamp: "2026-04-05 14:21:55",
    type: "System",
    severity: "Info",
    source: "trigger-engine",
    message: "Trigger engine: crack spread threshold exceeded +12.3%",
    fullMessage: "Crack spread threshold exceeded +12.3% above baseline. Trigger: CRACK_SPREAD_HIGH. Current 3-2-1 crack: $18.42/bbl vs threshold $16.40/bbl.",
    metadata: { "Trigger": "CRACK_SPREAD_HIGH", "Current": "$18.42/bbl", "Threshold": "$16.40/bbl", "Delta": "+12.3%" },
  },
  {
    id: "log-006",
    timestamp: "2026-04-05 14:21:32",
    type: "Alert",
    severity: "Error",
    source: "auth-service",
    message: "Authentication failed for unknown session",
    fullMessage: "Authentication failed for unknown session ID sess-7f3a2b. IP: 10.0.14.88. User agent indicates automated client. Session not found in active session store.",
    stackTrace: `Error: SessionNotFoundError
  at AuthService.validateSession (auth-service.ts:142)
  at middleware.authenticate (middleware.ts:67)
  at Router.handle (router.ts:234)
  at Server.handleRequest (server.ts:89)`,
    metadata: { "Session ID": "sess-7f3a2b", "IP Address": "10.0.14.88", "Client Type": "Automated", "Store Status": "Not Found" },
  },
  {
    id: "log-007",
    timestamp: "2026-04-05 14:21:10",
    type: "System",
    severity: "Info",
    source: "pi-gateway",
    message: "Sensor read cycle completed — 2,847 data points ingested",
    fullMessage: "Sensor read cycle completed successfully. 2,847 data points ingested from 127 tags across all configured PI servers. Cycle time: 28.4s.",
    metadata: { "Data Points": "2,847", "Tags": "127", "Cycle Time": "28.4s" },
  },
  {
    id: "log-008",
    timestamp: "2026-04-05 14:20:47",
    type: "API",
    severity: "Info",
    source: "ai-engine",
    message: "AI recommendation generation completed — 3 new recommendations",
    fullMessage: "AI recommendation generation completed. 3 new recommendations generated based on current process state and market conditions. Model: Claude Haiku. Tokens used: 1,247.",
    metadata: { "Recommendations": "3", "Model": "Claude Haiku", "Tokens": "1,247", "Latency": "890ms" },
  },
  {
    id: "log-009",
    timestamp: "2026-04-05 14:20:22",
    type: "System",
    severity: "Warning",
    source: "lp-orchestrator",
    message: "LP solve near constraint boundary — margin of 0.3% on Cat Feed Max",
    fullMessage: "LP solve returned feasible solution but Cat Feed Max constraint is within 0.3% of its bound. Consider reviewing constraint limits to avoid infeasibility in next solve cycle.",
    metadata: { "Constraint": "Cat Feed Max", "Margin": "0.3%", "Current Value": "54,780 bbl/d", "Limit": "55,000 bbl/d" },
  },
  {
    id: "log-010",
    timestamp: "2026-04-05 14:19:58",
    type: "User",
    severity: "Info",
    source: "auth-service",
    message: "User R. Chen logged in from control room terminal CR-04",
    fullMessage: "User R. Chen (process-engineer) authenticated via SSO. Terminal: CR-04. Session ID: sess-a8c1d4. Previous session: 2026-04-05 06:12:33.",
    metadata: { "User": "R. Chen", "Role": "Process Engineer", "Terminal": "CR-04", "Session": "sess-a8c1d4" },
  },
  {
    id: "log-011",
    timestamp: "2026-04-05 14:19:33",
    type: "Alert",
    severity: "Critical",
    source: "trigger-engine",
    message: "Safety interlock SIL-2 pressure relief valve PRV-101 actuated",
    fullMessage: "Safety interlock SIL-2 activated. Pressure relief valve PRV-101 on CDU overhead drum actuated at 142 psig (setpoint: 140 psig). Pressure returning to normal. Operator notification dispatched.",
    stackTrace: `CRITICAL SAFETY EVENT
  Interlock: SIL-2 / PRV-101
  Trigger: Overpressure on CDU overhead drum
  Setpoint: 140 psig
  Actual: 142 psig
  Action: Relief valve opened
  Status: Pressure declining — returning to normal range`,
    metadata: { "Interlock": "SIL-2", "Valve": "PRV-101", "Setpoint": "140 psig", "Actual": "142 psig", "Status": "Pressure declining" },
  },
  {
    id: "log-012",
    timestamp: "2026-04-05 14:19:05",
    type: "System",
    severity: "Info",
    source: "pi-gateway",
    message: "Tag quality check passed — 0 stale tags detected",
    metadata: { "Tags Checked": "127", "Stale": "0", "Quality Score": "100%" },
  },
  {
    id: "log-013",
    timestamp: "2026-04-05 14:18:42",
    type: "API",
    severity: "Info",
    source: "market-feed",
    message: "OPIS pricing update received — 14 product prices refreshed",
    metadata: { "Source": "OPIS", "Products Updated": "14", "Latency": "234ms" },
  },
  {
    id: "log-014",
    timestamp: "2026-04-05 14:18:19",
    type: "System",
    severity: "Info",
    source: "lp-orchestrator",
    message: "Model input matrix updated — 847 coefficients refreshed",
    metadata: { "Coefficients": "847", "Variables": "234", "Constraints": "189" },
  },
  {
    id: "log-015",
    timestamp: "2026-04-05 14:17:55",
    type: "User",
    severity: "Info",
    source: "auth-service",
    message: "User J. Martinez dismissed recommendation rec-3 with reason: operator override",
    metadata: { "User": "J. Martinez", "Recommendation": "rec-3", "Action": "Dismiss", "Reason": "Operator Override" },
  },
  {
    id: "log-016",
    timestamp: "2026-04-05 14:17:30",
    type: "Alert",
    severity: "Warning",
    source: "trigger-engine",
    message: "Ambient temperature rising — cooling tower efficiency may be impacted",
    metadata: { "Current Temp": "97°F", "Threshold": "95°F", "Impact": "Cooling Tower Efficiency" },
  },
  {
    id: "log-017",
    timestamp: "2026-04-05 14:17:02",
    type: "System",
    severity: "Info",
    source: "pi-gateway",
    message: "Historian archive compression completed — 12.4 GB freed",
    metadata: { "Freed Space": "12.4 GB", "Records Compressed": "4.2M", "Duration": "3m 12s" },
  },
  {
    id: "log-018",
    timestamp: "2026-04-05 14:16:38",
    type: "API",
    severity: "Error",
    source: "market-feed",
    message: "EIA API rate limit exceeded — 429 Too Many Requests",
    fullMessage: "EIA API rate limit exceeded. HTTP 429 returned for crude inventory endpoint. Daily limit: 500 requests. Current: 502. Will resume at midnight UTC.",
    stackTrace: `APIError: 429 Too Many Requests
  at MarketFeed.fetchEIA (market-feed.ts:89)
  at DataPipeline.refreshPricing (pipeline.ts:156)
  at Scheduler.execute (scheduler.ts:42)`,
    metadata: { "Endpoint": "EIA Crude Inventory", "Status": "429", "Daily Limit": "500", "Current": "502" },
  },
  {
    id: "log-019",
    timestamp: "2026-04-05 14:16:12",
    type: "System",
    severity: "Info",
    source: "lp-orchestrator",
    message: "Constraint set updated — 3 new temporary constraints added by shift supervisor",
    metadata: { "New Constraints": "3", "Source": "Shift Supervisor", "Type": "Temporary", "Expiry": "18:00 CDT" },
  },
  {
    id: "log-020",
    timestamp: "2026-04-05 14:15:48",
    type: "User",
    severity: "Info",
    source: "auth-service",
    message: "Shift handover initiated — Day Shift to Night Shift",
    metadata: { "Outgoing": "Day Shift (J. Martinez)", "Incoming": "Night Shift (K. Thompson)", "Pending Items": "4" },
  },
  {
    id: "log-021",
    timestamp: "2026-04-05 14:15:22",
    type: "System",
    severity: "Info",
    source: "trigger-engine",
    message: "Scheduled trigger evaluation completed — 2 of 12 triggers fired",
    metadata: { "Total Triggers": "12", "Fired": "2", "Cycle Time": "145ms" },
  },
  {
    id: "log-022",
    timestamp: "2026-04-05 14:14:57",
    type: "API",
    severity: "Info",
    source: "ai-engine",
    message: "Model health check passed — latency p99: 1.2s",
    metadata: { "Model": "Claude Haiku", "P50 Latency": "340ms", "P99 Latency": "1.2s", "Status": "Healthy" },
  },
  {
    id: "log-023",
    timestamp: "2026-04-05 14:14:33",
    type: "Alert",
    severity: "Error",
    source: "pi-gateway",
    message: "PI Server 3 connection lost — failover to PI Server 4 initiated",
    fullMessage: "PI Server 3 (pi-svr-03.valero.local) connection lost after 3 consecutive heartbeat failures. Automatic failover to PI Server 4 initiated. 32 tags affected during switchover.",
    stackTrace: `ConnectionError: ETIMEDOUT
  at PIClient.heartbeat (pi-client.ts:67)
  at PIGateway.checkConnections (gateway.ts:134)
  at HealthMonitor.run (monitor.ts:23)
Failover initiated: pi-svr-03 → pi-svr-04
Tags reassigned: 32`,
    metadata: { "Failed Server": "pi-svr-03", "Failover Target": "pi-svr-04", "Affected Tags": "32", "Recovery ETA": "~30s" },
  },
  {
    id: "log-024",
    timestamp: "2026-04-05 14:14:08",
    type: "System",
    severity: "Info",
    source: "lp-orchestrator",
    message: "Sensitivity analysis completed — 8 shadow prices updated",
    metadata: { "Shadow Prices Updated": "8", "Binding Constraints": "5", "Duration": "0.8s" },
  },
  {
    id: "log-025",
    timestamp: "2026-04-05 14:13:44",
    type: "User",
    severity: "Info",
    source: "auth-service",
    message: "User A. Patel exported daily operations report",
    metadata: { "User": "A. Patel", "Report": "Daily Operations", "Format": "PDF", "Size": "2.4 MB" },
  },
  {
    id: "log-026",
    timestamp: "2026-04-05 14:13:18",
    type: "System",
    severity: "Warning",
    source: "trigger-engine",
    message: "Model drift detected — recommendation confidence declining (78% → 71%)",
    metadata: { "Previous Confidence": "78%", "Current Confidence": "71%", "Threshold": "70%", "Action": "Monitor" },
  },
  {
    id: "log-027",
    timestamp: "2026-04-05 14:12:52",
    type: "API",
    severity: "Info",
    source: "market-feed",
    message: "Platts pricing window update received — 6 benchmark prices",
    metadata: { "Source": "Platts", "Benchmarks": "6", "Effective Date": "2026-04-05" },
  },
  {
    id: "log-028",
    timestamp: "2026-04-05 14:12:28",
    type: "Alert",
    severity: "Critical",
    source: "lp-orchestrator",
    message: "LP model infeasible — constraint conflict detected between Cat Feed Max and Gasoline Yield Min",
    fullMessage: "LP model returned infeasible status. Conflict detected between Cat Feed Max (55,000 bbl/d) and Gasoline Yield Min (42%). IIS analysis suggests relaxing Cat Feed Max by 2,000 bbl/d or reducing Gasoline Yield Min to 40%.",
    stackTrace: `InfeasibilityError: Model has no feasible solution
  at LPSolver.solve (solver.ts:234)
  at Orchestrator.runCycle (orchestrator.ts:89)

IIS Analysis:
  Conflicting constraints:
    1. Cat Feed Max ≤ 55,000 bbl/d
    2. Gasoline Yield Min ≥ 42%
  Suggested relaxations:
    - Increase Cat Feed Max to 57,000 bbl/d
    - Reduce Gasoline Yield Min to 40%`,
    metadata: { "Status": "Infeasible", "Conflict": "Cat Feed Max vs Gasoline Yield Min", "IIS Size": "2 constraints" },
  },
  {
    id: "log-029",
    timestamp: "2026-04-05 14:12:03",
    type: "System",
    severity: "Info",
    source: "pi-gateway",
    message: "Data quality report: 99.7% tag read success rate over last hour",
    metadata: { "Success Rate": "99.7%", "Period": "1 hour", "Failed Reads": "4", "Total Reads": "1,247" },
  },
  {
    id: "log-030",
    timestamp: "2026-04-05 14:11:38",
    type: "User",
    severity: "Info",
    source: "auth-service",
    message: "User J. Martinez added temporary constraint on Alkylation unit",
    metadata: { "User": "J. Martinez", "Unit": "Alkylation", "Type": "Temporary", "Duration": "4 hours" },
  },
];

const typeColors: Record<LogType, { text: string; bg: string }> = {
  System: { text: "text-status-info", bg: "bg-blue-50 dark:bg-blue-500/15" },
  User: { text: "text-accent", bg: "bg-accent-muted" },
  API: { text: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-500/15" },
  Alert: { text: "text-status-critical", bg: "bg-red-50 dark:bg-red-500/15" },
};

const severityDot: Record<Severity, string> = {
  Info: "bg-text-muted",
  Warning: "bg-status-warning",
  Error: "bg-status-critical",
  Critical: "bg-status-critical animate-pulse",
};

const typeFilters: ("All" | LogType)[] = ["All", "System", "User", "API", "Alert"];
const severityFilters: ("All" | Severity)[] = ["All", "Info", "Warning", "Error", "Critical"];

export default function LogsPage() {
  const [activeType, setActiveType] = useState<"All" | LogType>("All");
  const [activeSeverity, setActiveSeverity] = useState<"All" | Severity>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = LOG_DATA.filter((entry) => {
    if (activeType !== "All" && entry.type !== activeType) return false;
    if (activeSeverity !== "All" && entry.severity !== activeSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        entry.message.toLowerCase().includes(q) ||
        entry.source.toLowerCase().includes(q) ||
        entry.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-text-primary">System Logs</h1>
          <LiveIndicator />
        </div>
        <span className="font-mono text-xs text-text-muted">Last sync: 4s ago</span>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mr-2">Type</span>
            {typeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1 rounded-full text-xs font-headline font-medium transition-colors ${
                  activeType === t
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-text-secondary border border-surface-border hover:bg-accent-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium mr-2">Severity</span>
            {severityFilters.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSeverity(s)}
                className={`px-3 py-1 rounded-full text-xs font-headline font-medium transition-colors ${
                  activeSeverity === s
                    ? "bg-accent text-white"
                    : "bg-surface-hover text-text-secondary border border-surface-border hover:bg-accent-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded border border-surface-border bg-surface-hover text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-surface-card rounded border border-surface-border shadow-card">
        {/* Table Header */}
        <div className="grid grid-cols-[160px_80px_90px_130px_1fr] gap-3 px-4 py-2.5 border-b border-surface-border bg-surface-hover">
          <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Timestamp</span>
          <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Type</span>
          <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Severity</span>
          <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Source</span>
          <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Message</span>
        </div>

        {/* Rows */}
        {filtered.map((entry, i) => (
          <div key={entry.id}>
            <button
              onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
              className={`w-full grid grid-cols-[160px_80px_90px_130px_1fr] gap-3 px-4 py-2.5 text-left border-b border-surface-border transition-colors hover:bg-accent-muted ${
                i % 2 === 1 ? "bg-surface-hover" : "bg-surface-card"
              }`}
            >
              <span className="font-mono text-xs text-text-secondary tabular-nums">{entry.timestamp}</span>
              <span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-medium uppercase tracking-wider ${typeColors[entry.type].text} ${typeColors[entry.type].bg}`}>
                  {entry.type}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full shrink-0 ${severityDot[entry.severity]}`} />
                <span className="text-xs font-body text-text-secondary">{entry.severity}</span>
              </span>
              <span className="font-mono text-xs text-text-secondary truncate">{entry.source}</span>
              <span className="flex items-center gap-2">
                {expandedRow === entry.id ? (
                  <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                )}
                <span className="text-sm font-body text-text-primary truncate">{entry.message}</span>
              </span>
            </button>

            {/* Expanded Detail */}
            {expandedRow === entry.id && (
              <div className="px-4 py-3 bg-surface-hover border-b border-surface-border">
                <div className="ml-[160px] flex flex-col gap-3">
                  {/* Full Message */}
                  {entry.fullMessage && (
                    <div>
                      <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Full Message</span>
                      <p className="mt-1 text-sm font-body text-text-primary">{entry.fullMessage}</p>
                    </div>
                  )}

                  {/* Stack Trace */}
                  {entry.stackTrace && (
                    <div>
                      <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Stack Trace</span>
                      <pre className="mt-1 p-3 rounded bg-gray-900 dark:bg-black/40 text-gray-100 dark:text-gray-200 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{entry.stackTrace}</pre>
                    </div>
                  )}

                  {/* Metadata */}
                  {entry.metadata && (
                    <div>
                      <span className="text-xs font-headline uppercase tracking-wider text-text-muted font-medium">Metadata</span>
                      <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1">
                        {Object.entries(entry.metadata).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-xs font-body text-text-muted">{key}:</span>
                            <span className="text-xs font-mono text-text-primary">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm font-body text-text-muted">
            No log entries match the current filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-surface-card rounded border border-surface-border shadow-card px-4 py-2.5">
        <span className="text-sm font-body text-text-secondary">
          Showing <span className="font-mono font-medium text-text-primary">1–{filtered.length}</span> of <span className="font-mono font-medium text-text-primary">142</span> entries
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded border border-surface-border text-xs font-headline font-medium text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded border border-surface-border text-xs font-headline font-medium text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
