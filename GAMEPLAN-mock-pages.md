# Gameplan: Complete Reflex Mock Site

Generated: 2026-04-05

## Overview
- **Total runs**: 2
- **Total agents**: 6 (4 page builders + 1 merge + 1 polish)
- **Estimated parallelism**: Run 1 has 4 agents in parallel, Run 2 has 1 agent
- **Key dependencies**: Run 2 polish pass depends on all pages being merged from Run 1
- **Pages to create**: 11 new pages (10 dashboard + 1 login)

## What We're Building

The Reflex demo currently has 2 pages (`/operations` and `/analytics`) but 11 navigation links point to `#` (dead ends). We're creating mock pages for every missing route so the demo feels like a complete, polished product. Each page uses hardcoded inline data — no API integration — but looks production-real.

## Dependency Graph

```
Run 1 (parallel):
  Agent 1.1: Refinery Flow, Inventory, Logistics ─┐
  Agent 1.2: Risk Assessment, Safety, Compliance, Assets ─┤─→ Merge Agent 1.M ─→ Run 2 Polish
  Agent 1.3: Logs, Settings, Support ─┤
  Agent 1.4: Login page ─────────────────────────────────┘
```

All 4 agents create new files only — zero shared file conflicts. Merge agent updates Sidebar.tsx + Header.tsx navigation hrefs after all pages exist.

---

## Run 1: Create All Mock Pages
> **Prerequisite**: None (first run)
> **Agents**: 4 agents in parallel
> **Worktrees**: Yes — each agent works in an isolated worktree branch
> **Why parallel**: Every page creates new files in new directories — no overlap

### Agent 1.1: Production Pages — Refinery Flow, Inventory, Logistics
> **Service**: reflex-demo frontend
> **Key files**: `src/app/(dashboard)/refinery-flow/page.tsx`, `src/app/(dashboard)/inventory/page.tsx`, `src/app/(dashboard)/logistics/page.tsx`
> **Worktree branch**: `run-1/agent-1-production-pages`
> **Use /team**: Yes — 3 pages with chart work

<details>
<summary>Prompt (click to expand)</summary>

````
## Worktree Setup
Before starting, create an isolated worktree for this work:
git worktree add ../worktrees/run-1-agent-1 -b run-1/agent-1-production-pages
cd ../worktrees/run-1-agent-1

All work should happen in this worktree. When done:
1. Commit and push your branch
2. Do NOT merge — the merge agent will handle that
3. Do NOT remove the worktree — the merge agent will clean up

---

## Task: Create 3 production mock pages for the Reflex refinery optimization dashboard

You are working on Reflex, a Next.js 16 + React 19 + Tailwind CSS 4 refinery dashboard demo. Read AGENTS.md first — it warns about Next.js 16 breaking changes. Check `node_modules/next/dist/docs/` before writing any code.

Your job: create 3 new mock pages that make the demo feel like a complete product. Each page uses **hardcoded inline data** (define mock data as const arrays at the top of each file). Do NOT modify any existing files — only create new files.

## Design System (MUST follow exactly)

**Colors:**
- Accent: #0D9488 (teal), hover: #0F766E
- Text: #111827 (primary), #4B5563 (secondary), #9CA3AF (muted)
- Surfaces: #FFFFFF (card), #F5F5F5 (base bg), #F9FAFB (hover/zebra rows)
- Borders: #E5E7EB
- Status: green=#0D9488, amber=#D97706, red=#DC2626, blue=#2563EB

**Typography (Tailwind classes):**
- Headlines: `font-headline` (Space Grotesk) — used for page titles, section headers, buttons
- Body: `font-body` (IBM Plex Sans) — used for all body text, nav items, labels
- Data/numbers: `font-mono` (IBM Plex Mono) — used for metrics, timestamps, IDs

**Page layout pattern (follow exactly from existing pages):**
```tsx
"use client";
// imports...
export default function PageName() {
  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">Page Title</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]">
            Status Text
          </span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">Synced 12s ago</span>
      </div>
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        {/* KPICard components */}
      </div>
      {/* Content sections */}
    </div>
  );
}
```

**Card pattern:**
```
bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4
```

**Section header pattern:**
```
text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3
```

**Table pattern:**
- Header row: `text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]`
- Data rows: zebra striping with `bg-[#F9FAFB]` on even rows
- Cell text: `text-sm font-body text-[#111827]` for primary, `text-[#4B5563]` for secondary
- Monospace cells (IDs, numbers): `font-mono text-xs`

**Reusable imports available:**
- `import { KPICard } from "@/components/ui/KPICard"` — takes `data: KPICardData` with fields: label, value, unit, precision, trend, trendLabel, sparkline, prefix, status
- `import { AnimatedMetric } from "@/components/ui/AnimatedMetric"` — animated number counter
- `import type { KPICardData } from "@/types"` — the KPI type

## Charts
Use `echarts-for-react` (already installed). Import pattern:
```tsx
import ReactECharts from "echarts-for-react";
```
Use SVG renderer for clean rendering: `opts={{ renderer: "svg" }}`.

---

## Page 1: Refinery Flow (`src/app/(dashboard)/refinery-flow/page.tsx`)

A visual representation of the refinery process flow.

**Content:**
- Header: "Refinery Flow" + badge "All Units Online" + sync time
- KPI strip (4): Total Throughput (412.8 MBPD), Network Efficiency (94.5%), Active Units (6/6), Feed Rate (105K BPD)
- Main content: A **Sankey chart** (ECharts has native sankey support) showing material flow through the refinery:
  - Crude Feed (105K) → CDU
  - CDU splits to: FCC (38K), HCU (28K), Reformer (22K), Blend (17K)
  - FCC → Gasoline Pool (32K), LPG (6K)
  - HCU → Diesel Pool (24K), Naphtha (4K)
  - Reformer → Reformate (18K), H2 (4K)
  - Blend → Product Out (various)
  - Use teal gradient colors for the flows. Style the chart to be 400px tall.
- Below the chart: Grid of 6 **unit status cards** in a 3x2 grid. Each card:
  - Unit name (CDU, FCC, HCU, Reformer, Blend, Storage)
  - Status dot: green for "Online", amber for "Caution"
  - Key metrics: Throughput (K BPD), Temperature (°F), Pressure (psi)
  - Left border colored by status (green=#0D9488, amber=#D97706)
  - Make HCU show "Caution" status (amber) to add visual interest, rest green

## Page 2: Inventory (`src/app/(dashboard)/inventory/page.tsx`)

Tank farm overview and product inventory tracking.

**Content:**
- Header: "Inventory Management" + badge "System Normal" + sync time
- KPI strip (4): Crude Supply Days (8.2 days), Total Ullage (42,000 bbl), Product Ready (156K bbl), Tank Utilization (78%)
- **Tank Farm Overview** (section header): Grid of 8 tank cards in 4x2 layout. Each tank card:
  - Tank ID (e.g., "TK-101"), Product name, fill level as a visual percentage bar (teal fill on gray background)
  - Volume / Capacity in monospace, Temperature, Quality status (On-Spec / Off-Spec / Testing)
  - Tanks: 2 crude (TK-101 at 82%, TK-102 at 45%), 2 gasoline (TK-201 at 91%, TK-202 at 67%), 2 diesel (TK-301 at 73%, TK-302 at 88%), 1 jet fuel (TK-401 at 56%), 1 naphtha (TK-501 at 34% — mark as "Testing" quality)
- **Product Inventory Table** (section header): Table with columns — Product, Grade, Volume (bbl), Tanks, Quality Status, Last Updated. 6-8 rows.

## Page 3: Logistics (`src/app/(dashboard)/logistics/page.tsx`)

Feedstock deliveries and product shipments.

**Content:**
- Header: "Logistics & Scheduling" + badge "On Schedule" + sync time
- KPI strip (4): Inbound Today (3), Outbound Today (5), Pipeline Throughput (62K BPD), On-Time Rate (94%)
- Two-column layout (55%/45%, matching operations page pattern):
  - **Left: Inbound Feedstock** (section header): Table — Date, Source, Volume (bbl), Mode (Pipeline 🔵 / Rail 🟤 / Truck 🟢 — use colored dots not emojis), Status (Scheduled/In Transit/Delivered), ETA. 5-6 rows.
  - **Right: Outbound Shipments** (section header): Table — Date, Destination, Product, Volume, Mode, Status. 5-6 rows.
- **Bottom section: Transport Mode Breakdown** — 3 cards in a row showing Pipeline (62%), Rail (28%), Truck (10%) with volume and a simple bar indicator.

---

## When done
1. Verify each page compiles: `cd reflex-demo && npx next build` (or at least check for TypeScript errors)
2. Commit with a descriptive message
3. Push the branch to origin
4. Do NOT merge into main

If this task is complex, use /team to spin up a multi-agent team for it.
````

</details>

### Agent 1.2: Risk & Compliance Pages — Risk Assessment, Assets, Compliance, Safety
> **Service**: reflex-demo frontend
> **Key files**: `src/app/(dashboard)/risk-assessment/page.tsx`, `src/app/(dashboard)/assets/page.tsx`, `src/app/(dashboard)/compliance/page.tsx`, `src/app/(dashboard)/safety/page.tsx`
> **Worktree branch**: `run-1/agent-2-risk-compliance-pages`
> **Use /team**: Yes — 4 pages

<details>
<summary>Prompt (click to expand)</summary>

````
## Worktree Setup
Before starting, create an isolated worktree for this work:
git worktree add ../worktrees/run-1-agent-2 -b run-1/agent-2-risk-compliance-pages
cd ../worktrees/run-1-agent-2

All work should happen in this worktree. When done:
1. Commit and push your branch
2. Do NOT merge — the merge agent will handle that
3. Do NOT remove the worktree — the merge agent will clean up

---

## Task: Create 4 risk/compliance mock pages for the Reflex refinery optimization dashboard

You are working on Reflex, a Next.js 16 + React 19 + Tailwind CSS 4 refinery dashboard demo. Read AGENTS.md first — it warns about Next.js 16 breaking changes. Check `node_modules/next/dist/docs/` before writing any code.

Your job: create 4 new mock pages. Each uses **hardcoded inline data** (define mock data as const arrays at the top of each file). Do NOT modify any existing files — only create new files.

## Design System (MUST follow exactly)

**Colors:**
- Accent: #0D9488 (teal), hover: #0F766E
- Text: #111827 (primary), #4B5563 (secondary), #9CA3AF (muted)
- Surfaces: #FFFFFF (card), #F5F5F5 (base bg), #F9FAFB (hover/zebra rows)
- Borders: #E5E7EB
- Status: green=#0D9488, amber=#D97706, red=#DC2626, blue=#2563EB

**Typography (Tailwind classes):**
- Headlines: `font-headline` (Space Grotesk)
- Body: `font-body` (IBM Plex Sans)
- Data/numbers: `font-mono` (IBM Plex Mono)

**Page layout pattern:**
```tsx
"use client";
export default function PageName() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">Page Title</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]">Status</span>
        </div>
        <span className="text-xs font-mono text-[#9CA3AF]">Synced 12s ago</span>
      </div>
      {/* KPI strip + content */}
    </div>
  );
}
```

**Card:** `bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4`
**Section header:** `text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3`
**Table header:** `text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]`
**Table rows:** zebra with `bg-[#F9FAFB]` on even rows, `text-sm font-body`

**Reusable imports:**
- `import { KPICard } from "@/components/ui/KPICard"` — takes `data: KPICardData`
- `import type { KPICardData } from "@/types"` — fields: label, value, unit, precision, trend, trendLabel, sparkline, prefix, status

**Charts:** `import ReactECharts from "echarts-for-react"` with `opts={{ renderer: "svg" }}`

---

## Page 1: Risk Assessment (`src/app/(dashboard)/risk-assessment/page.tsx`)

**Content:**
- Header: "Risk Assessment" + badge "7 Active Risks" (use amber bg: `bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]` instead of the usual teal) + sync time
- KPI strip (4): Active Risks (7), Critical (2 — status:"warning"), Avg Score (6.4/10), Mitigated This Month (3, trend:+2)
- Two-column layout (55/45):
  - **Left: Risk Heatmap** — ECharts heatmap chart. X-axis: Impact (1-5: Negligible, Minor, Moderate, Major, Catastrophic). Y-axis: Likelihood (1-5: Rare, Unlikely, Possible, Likely, Almost Certain). Color gradient: green (low risk) → yellow → red (high risk). Place 7 risk data points on the grid with varying positions. Chart height 320px.
  - **Right: Active Risks** — Table: Risk ID (mono), Description, Category (colored pill: Operational=blue, Financial=amber, Safety=red, Environmental=green), Score (/10), Owner, Status. 7 rows. Use colored left borders matching category.
- Bottom: **Risk Trend** — ECharts line chart showing total risk score over 12 months (mock data showing slight improvement trend). Height 200px.

## Page 2: Assets (`src/app/(dashboard)/assets/page.tsx`)

**Content:**
- Header: "Asset Management" + badge "System Normal" + sync time
- KPI strip (4): Total Assets (47), Average Health (91.2/100), Maintenance Due (5 — status:"warning"), Uptime (99.2%)
- **Filter tabs** above table: All | Pumps | Valves | Exchangers | Reactors — styled like ConstraintPanel tabs (`text-xs font-headline uppercase tracking-wider` with active tab having teal bottom border). Use useState to toggle which rows show.
- **Equipment Registry Table**: Asset ID (mono), Name, Unit, Type, Health Score (render as a small horizontal bar — teal fill for >80, amber 50-80, red <50), Last Inspection (date), Next Maintenance (date), Status (Online/Maintenance/Offline — colored pill). 12-15 rows covering all types.
- **Upcoming Maintenance** (section header): Timeline-style list (like handover events in the existing ConstraintPanel) showing 5 upcoming maintenance items with date, asset name, type of work, estimated duration.

## Page 3: Compliance (`src/app/(dashboard)/compliance/page.tsx`)

**Content:**
- Header: "Compliance & Regulatory" + badge "Compliant" + sync time
- KPI strip (4): Active Regulations (12), Compliance Rate (98.5%), Upcoming Audits (2), Certifications (8)
- Two-column layout (60/40):
  - **Left: Regulatory Tracker Table** — Regulation name, Agency (EPA/OSHA/State DEQ — mono text), Status (Compliant=green pill, Pending Review=amber pill, Action Required=red pill), Due Date, Last Review, Owner. 8-10 rows. Most should be "Compliant" with 1 "Action Required" and 2 "Pending Review" for realism.
  - **Right top: Certifications** — Grid of 4 certification cards: ISO 14001, ISO 45001, API 653, OSHA PSM. Each card shows: cert name, issuing body, expiry date, days remaining. Color code the days remaining indicator: green (>90d), amber (30-90d), red (<30d). Make API 653 show amber (expiring in 52 days).
  - **Right bottom: Upcoming Audits** — 2 audit cards with: audit name, auditor, scheduled date, scope description, preparation status (% complete with a bar).

## Page 4: Safety (`src/app/(dashboard)/safety/page.tsx`)

**Content:**
- Header: "Safety Management" + badge "Safe Operations" + sync time
- **Hero metric** (prominent, before KPI strip): "Days Without Recordable Incident" — large teal number (247) using AnimatedMetric, with a secondary line "Plant record: 312 days" in muted text. Place in a card with subtle teal left border.
- KPI strip (4): TRIR (0.42), Near Misses This Month (3), Open Work Permits (12), Training Completion (96%)
- Two-column layout (55/45):
  - **Left: Incident Log** — Table: Date, Type (colored left-border dot — Spill=blue, Near Miss=amber, First Aid=green, Fire=red, Environmental=purple), Severity (Low/Medium/High), Location, Description, Status (Open/Investigating/Closed — pill). 8-10 rows going back 6 months. Most should be "Closed" with 2 "Investigating" and 1 "Open" for realism.
  - **Right: Active Work Permits** — List of 5 permit cards: Permit ID (mono), Type (Hot Work, Confined Space, Line Break, Excavation, Elevated Work), Location, Valid Until (date+time), Holder name. Cards with colored left border by type.
- Bottom: **Safety Trend** — ECharts line chart showing TRIR over 24 months (mock data showing gradual improvement from 0.8 to 0.42). Add a horizontal dashed line at 0.5 labeled "Industry Avg". Height 220px.

---

## When done
1. Verify each page compiles: `cd reflex-demo && npx next build`
2. Commit with a descriptive message
3. Push the branch to origin
4. Do NOT merge into main

If this task is complex, use /team to spin up a multi-agent team for it.
````

</details>

### Agent 1.3: Utility Pages — Logs, Settings, Support
> **Service**: reflex-demo frontend
> **Key files**: `src/app/(dashboard)/logs/page.tsx`, `src/app/(dashboard)/settings/page.tsx`, `src/app/(dashboard)/support/page.tsx`
> **Worktree branch**: `run-1/agent-3-utility-pages`
> **Use /team**: Yes — 3 pages with interactive state

<details>
<summary>Prompt (click to expand)</summary>

````
## Worktree Setup
Before starting, create an isolated worktree for this work:
git worktree add ../worktrees/run-1-agent-3 -b run-1/agent-3-utility-pages
cd ../worktrees/run-1-agent-3

All work should happen in this worktree. When done:
1. Commit and push your branch
2. Do NOT merge — the merge agent will handle that
3. Do NOT remove the worktree — the merge agent will clean up

---

## Task: Create 3 utility mock pages for the Reflex refinery optimization dashboard

You are working on Reflex, a Next.js 16 + React 19 + Tailwind CSS 4 refinery dashboard demo. Read AGENTS.md first — it warns about Next.js 16 breaking changes. Check `node_modules/next/dist/docs/` before writing any code.

Your job: create 3 utility/admin mock pages. Each uses **hardcoded inline data**. These pages have more interactive state (tabs, filters, accordions) than the data-display pages. Do NOT modify any existing files — only create new files.

## Design System (MUST follow exactly)

**Colors:**
- Accent: #0D9488 (teal), hover: #0F766E
- Text: #111827 (primary), #4B5563 (secondary), #9CA3AF (muted)
- Surfaces: #FFFFFF (card), #F5F5F5 (base bg), #F9FAFB (hover/zebra rows)
- Borders: #E5E7EB
- Status: green=#0D9488, amber=#D97706, red=#DC2626, blue=#2563EB

**Typography (Tailwind classes):**
- Headlines: `font-headline` (Space Grotesk)
- Body: `font-body` (IBM Plex Sans)
- Data/numbers: `font-mono` (IBM Plex Mono)

**Page layout pattern:**
```tsx
"use client";
export default function PageName() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-xl font-bold text-[#111827]">Page Title</h1>
        </div>
      </div>
      {/* Content */}
    </div>
  );
}
```

**Card:** `bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4`
**Section header:** `text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium mb-3`
**Tab pattern (from existing ConstraintPanel):** Tabs use `text-xs font-headline uppercase tracking-wider` with active tab getting `text-[#0D9488] border-b-2 border-[#0D9488]` and inactive `text-[#9CA3AF] hover:text-[#4B5563]`. Tabs sit on a bottom border line.

**Reusable imports:**
- `import { KPICard } from "@/components/ui/KPICard"` if needed
- `import type { KPICardData } from "@/types"` if needed
- Icons: `import { IconName } from "lucide-react"` — any icon from lucide-react is available

---

## Page 1: Logs (`src/app/(dashboard)/logs/page.tsx`)

A filterable event log showing system activity.

**Content:**
- Header: "System Logs" + LiveIndicator badge (reuse: `import { LiveIndicator } from "@/components/ui/LiveIndicator"`) + sync time
- **Filter bar** (inside a card): Row of filter controls:
  - Type filter: pill-style buttons (All, System, User, API, Alert) — use `useState` for active filter, style active pill with teal bg
  - Severity filter: pill-style buttons (All, Info, Warning, Error, Critical)
  - A mock search input matching the header search style
  - The filters should actually filter the displayed log entries using `useState` + `.filter()`
- **Log table** (main content, card): 25-30 log entries. Columns:
  - Timestamp — mono font, format "2026-04-05 14:23:07"
  - Type — colored chip: System=#2563EB bg-blue-50, User=#0D9488 bg-teal-50, API=#7C3AED bg-purple-50, Alert=#DC2626 bg-red-50
  - Severity — colored dot indicator: Info=gray, Warning=amber, Error=red, Critical=red+pulse
  - Source — mono text (e.g., "pi-gateway", "lp-orchestrator", "auth-service", "trigger-engine")
  - Message — body text, truncated with ellipsis if long
- **Expandable rows**: Use `useState<string | null>` to track which row is expanded. Clicking a row toggles an expanded detail section below it showing: Full message, Stack trace (for errors, mono font in a gray code block), Metadata (key-value pairs).
- **Pagination** bar at bottom: "Showing 1-25 of 142 entries" with Previous/Next buttons (mock — just display, no actual pagination needed, but buttons should look clickable).

Mock data variety: mix of types and severities. Include realistic messages like:
- "PI historian connection refreshed — 127 tags synced" (System, Info)
- "LP model solve completed in 2.3s — feasible solution" (System, Info)
- "User J. Martinez acknowledged recommendation rec-1" (User, Info)
- "Market data feed timeout — retrying in 30s" (API, Warning)
- "Trigger engine: crack spread threshold exceeded +12.3%" (System, Info)
- "Authentication failed for unknown session" (Alert, Error)

## Page 2: Settings (`src/app/(dashboard)/settings/page.tsx`)

A tabbed settings page.

**Content:**
- Header: "Settings" (no status badge or sync time for this page)
- **Tab bar**: Profile | Integrations | Notifications | System — use `useState` to switch between tabs

**Profile tab (default):**
- Form card with fields (all pre-filled, read-only feel with edit capability):
  - Avatar placeholder (teal circle with "JM" initials, matching the sidebar)
  - Full Name: "J. Martinez" — text input
  - Email: "j.martinez@valero.com" — text input
  - Role: "Shift Supervisor" — select/dropdown styled as text input
  - Site: "Valero Memphis" — disabled input (gray bg)
  - Timezone: "US/Central (CDT)" — select
  - Shift Schedule: "Day Shift (06:00–18:00)" — select
- "Save Changes" button (teal) + "Cancel" button (gray text)

**Integrations tab:**
- Grid of 6 integration cards (3x2):
  - PI System — Connected (green dot), "127 tags synced", Last sync: 32s ago
  - Market Data — Connected (green dot), "EIA + OPIS feeds", Last sync: 5m ago
  - LP Solver — Connected (green dot), "Excel COM v2.1", Last solve: 14m ago
  - AI Engine — Connected (green dot), "Claude Haiku", Requests today: 23
  - Teams — Connected (green dot), "#reflex-alerts channel"
  - ERP System — Disconnected (red dot), "Not configured", "Configure" button
- Each card: icon (from lucide), name, status dot+label, detail line, last activity

**Notifications tab:**
- Table-style grid with notification categories as rows and channels as columns:
  - Rows: Recommendations, Constraint Alerts, System Warnings, Shift Handover, Daily Digest, Model Drift
  - Columns: In-App (checkbox), Email (checkbox), Teams (checkbox), SMS (checkbox)
  - Use styled checkboxes (teal accent when checked). Pre-check most boxes realistically (e.g., SMS only for Constraint Alerts and System Warnings).
- Below: "Quiet hours" section with a toggle switch + time range inputs (22:00 - 06:00)

**System tab:**
- Read-only system info card:
  - Version: "Reflex v2.1.0"
  - Environment: "Production"
  - License: "Enterprise — Constellation Energy"
  - Database: "PostgreSQL 16 + TimescaleDB"
  - Region: "US-Central"
  - Last updated: "2026-03-28"
- Data retention card: "Sensor data: 2 years", "Audit logs: 7 years", "Recommendations: Indefinite"
- "Contact Administrator" button + "Export System Report" button

## Page 3: Support (`src/app/(dashboard)/support/page.tsx`)

Help and support page.

**Content:**
- Header: "Help & Support" (no status badge)
- Two-column layout (60/40):
  - **Left: FAQ** — Accordion with 8 questions. Use `useState<number | null>` for which item is open. Clicking toggles open/closed with a chevron icon rotation. Questions:
    1. "How does Reflex generate recommendations?" — Answer about LP model + market data + process data
    2. "What should I do when I see a recommendation?" — Answer about Acknowledge/Constraint/Dismiss flow
    3. "How do I add a constraint?" — Answer about the 5-step constraint wizard
    4. "What is Shadow Mode?" — Answer about the trust-building phase
    5. "How often does the system update?" — Answer about 30-60 second sensor reads
    6. "What happens if the LP model fails to solve?" — Answer about fallback behavior
    7. "How is margin impact calculated?" — Answer about LP delta + market prices
    8. "Who can I contact for support?" — Answer with contact info
  - **Right top: Documentation** — Card with a list of 6 documentation links (each with a FileText or BookOpen icon + label + brief description):
    - Getting Started Guide
    - Operator Handbook
    - API Reference
    - Troubleshooting Guide
    - Release Notes (v2.1.0)
    - Training Videos
    Each link should look clickable (teal text, hover underline) but href="#".
  - **Right bottom: Submit a Ticket** — Form card: Subject input, Description textarea (4 rows), Priority dropdown (Low/Medium/High/Critical), "Submit Ticket" button. On submit (mock), show a success message "Ticket submitted successfully. Reference: SUP-2847" using useState.
- **Bottom: System Status** — A card with a row of 5 service status indicators:
  - API Gateway — Operational (green dot + "99.9% uptime")
  - Database — Operational (green)
  - AI Engine — Operational (green)
  - Market Feed — Degraded (amber dot + "Intermittent delays")
  - Task Scheduler — Operational (green)

---

## When done
1. Verify each page compiles: `cd reflex-demo && npx next build`
2. Commit with a descriptive message
3. Push the branch to origin
4. Do NOT merge into main

If this task is complex, use /team to spin up a multi-agent team for it.
````

</details>

### Agent 1.4: Login Page + Navigation Updates
> **Service**: reflex-demo frontend
> **Key files**: `src/app/login/page.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/Header.tsx`
> **Worktree branch**: `run-1/agent-4-login-and-nav`
> **Use /team**: No — straightforward

<details>
<summary>Prompt (click to expand)</summary>

````
## Worktree Setup
Before starting, create an isolated worktree for this work:
git worktree add ../worktrees/run-1-agent-4 -b run-1/agent-4-login-and-nav
cd ../worktrees/run-1-agent-4

All work should happen in this worktree. When done:
1. Commit and push your branch
2. Do NOT merge — the merge agent will handle that
3. Do NOT remove the worktree — the merge agent will clean up

---

## Task: Create login page + update navigation links for the Reflex refinery optimization dashboard

You are working on Reflex, a Next.js 16 + React 19 + Tailwind CSS 4 refinery dashboard demo. Read AGENTS.md first — it warns about Next.js 16 breaking changes. Check `node_modules/next/dist/docs/` before writing any code.

Your job has 2 parts:
1. Create a login page
2. Update Sidebar.tsx and Header.tsx to replace all `href="#"` with real routes

---

## Part 1: Login Page (`src/app/login/page.tsx`)

This page lives OUTSIDE the `(dashboard)` route group — it should NOT have the sidebar/header layout. It's a standalone page.

**Design:**
- Full viewport height, centered content on `bg-[#F5F5F5]` background
- A white card (max-width ~400px, centered) with the login form
- Top of card: Reflex logo — large teal text "Reflex" using `font-headline text-3xl font-bold text-[#0D9488]`, with subtitle "Refinery Optimization Platform" in `text-sm font-body text-[#9CA3AF]`
- Generous spacing (py-10 px-8 or similar)

**Form fields:**
- Email input — label "Email", pre-filled with "j.martinez@valero.com"
- Password input (type="password") — label "Password", pre-filled with "••••••••"
- "Remember me" checkbox with label (teal when checked)
- "Sign In" button — full width, teal bg (#0D9488), white text, hover #0F766E, `font-headline font-semibold`
- "Forgot Password?" link below the button, `text-sm text-[#0D9488] hover:underline`

**Behavior:**
- Use `"use client"` directive
- Import `useRouter` from `next/navigation`
- On form submit (prevent default), call `router.push("/operations")` — no real auth, just navigate
- The form should have basic state management with `useState` for email and password fields

**Footer:** Below the card, centered text: "Reflex v2.1.0 · Constellation Energy" in `text-xs text-[#9CA3AF]`

**Input styling** (matching the search input in Header.tsx):
```
w-full px-3 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded font-body text-[#111827]
placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]
```

**Label styling:** `text-sm font-body font-medium text-[#4B5563] mb-1`

---

## Part 2: Navigation Updates

### Sidebar.tsx (`src/components/layout/Sidebar.tsx`)

Update the `navItems` array to replace `href: "#"` with real routes:

```tsx
const navItems = [
  { href: "/operations", label: "Dashboard", icon: LayoutDashboard },
  { href: "/refinery-flow", label: "Refinery Flow", icon: GitBranch },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/logistics", label: "Logistics", icon: Truck },
  { href: "/risk-assessment", label: "Risk Assessment", icon: ShieldAlert },
  { href: "/analytics", label: "Reports", icon: FileBarChart },
  { href: "/logs", label: "Logs", icon: ScrollText },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/support", label: "Support", icon: HelpCircle },
];
```

Also fix the active state highlighting: the current check `pathname === item.href` works for exact matches, but for deeper routes it won't highlight the parent. Change to `pathname.startsWith(item.href)` BUT only for non-root paths (to avoid `/operations` matching everything). The simplest fix:

```tsx
const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
```

### Header.tsx (`src/components/layout/Header.tsx`)

Update the `tabs` array:

```tsx
const tabs = [
  { href: "/operations", label: "Global View" },
  { href: "/assets", label: "Assets" },
  { href: "/compliance", label: "Compliance" },
  { href: "/safety", label: "Safety" },
];
```

Also update the active state check in the same way:
```tsx
const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
```

### Root page.tsx

Keep `src/app/page.tsx` as-is (redirecting to `/operations`). The login page is at `/login` as a separate accessible route. Do NOT change the root redirect.

---

## When done
1. Verify the changes compile: `cd reflex-demo && npx next build`
2. Commit with a descriptive message
3. Push the branch to origin
4. Do NOT merge into main
````

</details>

### Merge Agent 1.M: Integrate Run 1 branches
> Merges all 4 parallel branches, resolves conflicts, runs tests, removes worktrees.

<details>
<summary>Prompt (click to expand)</summary>

````
## Merge Agent for Run 1
Merge the parallel branches from Run 1 into the main branch and clean up worktrees.

The 4 branches are:
1. `run-1/agent-1-production-pages` — Created 3 pages: refinery-flow, inventory, logistics
2. `run-1/agent-2-risk-compliance-pages` — Created 4 pages: risk-assessment, assets, compliance, safety
3. `run-1/agent-3-utility-pages` — Created 3 pages: logs, settings, support
4. `run-1/agent-4-login-and-nav` — Created login page + updated Sidebar.tsx and Header.tsx navigation

### Merge Order (important!)
Merge Agent 4 (nav updates) LAST because it modifies existing files (Sidebar.tsx, Header.tsx). Agents 1-3 only create new files and cannot conflict with each other.

1. `git merge run-1/agent-1-production-pages`
   - Expected: clean merge (new files only)
   - Verify: `ls reflex-demo/src/app/\(dashboard\)/refinery-flow/page.tsx reflex-demo/src/app/\(dashboard\)/inventory/page.tsx reflex-demo/src/app/\(dashboard\)/logistics/page.tsx`

2. `git merge run-1/agent-2-risk-compliance-pages`
   - Expected: clean merge (new files only)
   - Verify: `ls reflex-demo/src/app/\(dashboard\)/risk-assessment/page.tsx reflex-demo/src/app/\(dashboard\)/assets/page.tsx reflex-demo/src/app/\(dashboard\)/compliance/page.tsx reflex-demo/src/app/\(dashboard\)/safety/page.tsx`

3. `git merge run-1/agent-3-utility-pages`
   - Expected: clean merge (new files only)
   - Verify: `ls reflex-demo/src/app/\(dashboard\)/logs/page.tsx reflex-demo/src/app/\(dashboard\)/settings/page.tsx reflex-demo/src/app/\(dashboard\)/support/page.tsx`

4. `git merge run-1/agent-4-login-and-nav`
   - Expected: clean merge (new login page + modified Sidebar.tsx and Header.tsx)
   - If conflicts in Sidebar.tsx or Header.tsx: accept the incoming changes (the nav update branch has the correct final state)

5. Run the full build to confirm everything integrates:
   ```bash
   cd reflex-demo && npm run build
   ```

6. If build fails: fix TypeScript errors, import issues, or any integration problems.

7. Commit the merge result if there were any conflict resolutions.

8. Clean up worktrees:
   ```bash
   git worktree remove ../worktrees/run-1-agent-1
   git worktree remove ../worktrees/run-1-agent-2
   git worktree remove ../worktrees/run-1-agent-3
   git worktree remove ../worktrees/run-1-agent-4
   git branch -d run-1/agent-1-production-pages run-1/agent-2-risk-compliance-pages run-1/agent-3-utility-pages run-1/agent-4-login-and-nav
   ```

9. Run `npm run dev` in the reflex-demo directory and verify the app loads without errors.
````

</details>

---

## Run 2: Polish & Consistency Pass
> **Prerequisite**: Run 1 complete + all branches merged
> **Agents**: 1 agent
> **Worktrees**: No — works directly on main
> **Why sequential**: Needs all pages to exist before checking consistency

### Agent 2.1: Visual Consistency & Completeness Audit
> **Service**: reflex-demo frontend
> **Key files**: All 11 new page files + Sidebar.tsx + Header.tsx
> **Worktree branch**: N/A — single agent run
> **Use /team**: No — single focused pass

<details>
<summary>Prompt (click to expand)</summary>

````
## Task: Polish pass on the complete Reflex mock site

The Reflex demo site just had 11 new mock pages added by 4 different agents working in parallel. Your job is a consistency and completeness audit. The app is at `reflex-demo/` — a Next.js 16 + React 19 + Tailwind CSS 4 project.

Read AGENTS.md first. Check `node_modules/next/dist/docs/` before writing code.

## Step 1: Build Verification
Run `cd reflex-demo && npm run build`. Fix any TypeScript errors, missing imports, or build failures.

## Step 2: Navigation Audit
1. Read `src/components/layout/Sidebar.tsx` — verify ALL sidebar links point to real routes (no `#` remaining)
2. Read `src/components/layout/Header.tsx` — verify ALL header tabs point to real routes (no `#` remaining)
3. Verify the login page exists at `src/app/login/page.tsx` (outside dashboard group)
4. Verify all 10 dashboard pages exist under `src/app/(dashboard)/`

## Step 3: Visual Consistency Check
Read every new page file and check for these patterns. Fix any deviations:

**Required patterns (from existing operations + analytics pages):**
- `"use client"` directive on every page
- Page container: `<div className="flex flex-col gap-5">`
- Page header: `font-headline text-xl font-bold text-[#111827]` for h1
- Status badge: `text-[10px] font-headline font-bold uppercase tracking-wider` with appropriate colors
- Sync time: `text-xs font-mono text-[#9CA3AF]` aligned right
- Card wrapper: `bg-white rounded border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-4`
- Section headers: `text-xs font-headline uppercase tracking-wider text-[#9CA3AF] font-medium`
- Table headers: `text-[10px] font-headline uppercase tracking-wider text-[#9CA3AF]`
- KPI cards using the `KPICard` component from `@/components/ui/KPICard`

**Common issues to watch for:**
- Different shadow values (should always be `shadow-[0_1px_3px_rgba(0,0,0,0.06)]`)
- Missing `font-headline` / `font-body` / `font-mono` class usage
- Incorrect color values (e.g., using Tailwind defaults instead of custom hex values)
- Inconsistent spacing (gap-5 between sections, gap-3/4 within)
- Missing rounded corners on cards
- Using raw numbers instead of AnimatedMetric for hero metrics

## Step 4: Interactive Elements Check
- All filter tabs/pills should toggle state with useState
- Accordion items should expand/collapse
- Settings tabs should switch content
- Log filter should actually filter displayed entries
- Login form should navigate to /operations on submit
- Support ticket form should show success message on submit

## Step 5: Quick Wins for Completeness
If any of these are missing, add them:
1. The "Optimize Run" button on `/operations` page — make it show a simple toast notification or a brief modal saying "Optimization run queued. Estimated completion: 2.3s" then auto-dismiss
2. The "Export Log" button on `/operations` page — make it show "Export started. File will download shortly." toast
3. The user avatar "JM" in the Header — add a simple dropdown on click (Profile → /settings, Sign Out → /login) using useState

## Step 6: Final Build
Run `npm run build` one final time to ensure everything is clean. Then `npm run dev` and verify the app loads.

## When done
Commit all fixes with a message like "Polish: normalize consistency across all mock pages"
````

</details>

---

## Post-Completion Checklist
- [ ] All runs completed
- [ ] All worktree branches merged and worktrees removed
- [ ] `npm run build` passing clean
- [ ] Every sidebar link navigates to a real page (no `#` links)
- [ ] Every header tab navigates to a real page
- [ ] Login page renders correctly at `/login`
- [ ] All 13 routes work: `/operations`, `/analytics`, `/refinery-flow`, `/inventory`, `/logistics`, `/risk-assessment`, `/assets`, `/compliance`, `/safety`, `/logs`, `/settings`, `/support`, `/login`
- [ ] Interactive elements work (tabs, filters, accordions, form submissions)
- [ ] Visual consistency across all pages (same card style, typography, colors)
- [ ] Manual click-through of every sidebar item + header tab
