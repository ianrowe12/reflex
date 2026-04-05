# Reflex Frontend Demo Spec

Complete specification of every element in the Reflex demo frontend. This document describes what each UI element shows, what the data means, and how interactive elements behave.

---

## Table of Contents

1. [Global Layout](#1-global-layout)
2. [Login Page](#2-login-page)
3. [Operations Dashboard](#3-operations-dashboard)
4. [Refinery Flow](#4-refinery-flow)
5. [Inventory Management](#5-inventory-management)
6. [Logistics & Scheduling](#6-logistics--scheduling)
7. [Financial & Model Health (Analytics)](#7-financial--model-health-analytics)
8. [Asset Management](#8-asset-management)
9. [Compliance & Regulatory](#9-compliance--regulatory)
10. [Risk Assessment](#10-risk-assessment)
11. [Safety Management](#11-safety-management)
12. [System Logs](#12-system-logs)
13. [Settings](#13-settings)
14. [Help & Support](#14-help--support)

---

## 1. Global Layout

### 1.1 Header Bar (`Header.tsx`)

A 48px-tall white bar pinned to the top of every dashboard page.

| Element | Description |
|---------|-------------|
| **Reflex logo** | Teal text "Reflex" in Space Grotesk bold. Static branding. |
| **Site label** | "Valero Memphis" — the name of the refinery site being monitored. Shown in light gray next to the logo. |
| **Nav tabs** | Four tabs that switch between high-level views: **Global View** (→ /operations), **Assets** (→ /assets), **Compliance** (→ /compliance), **Safety** (→ /safety). The active tab has a teal background tint. |
| **Search bar** | A centered text input with placeholder "Search systems...". Decorative only — no backend search. Focus state shows teal ring. |
| **Live Indicator** | A pulsing green dot with the word "Live" — indicates the system is receiving real-time data. Purely visual. |
| **Connection dots** | Four small status dots labeled **PI**, **MKT**, **LP**, **AI**. These represent the four data pipelines Reflex depends on: PI System (sensor data), Market Data (pricing), LP Solver (optimization model), AI Engine (Claude Haiku recommendations). All show "connected" (green). |
| **User avatar "JM"** | A teal circle with the operator's initials. **Clickable** — opens a dropdown menu with two options: "Profile" (navigates to /settings) and "Sign Out" (navigates to /login). Click outside to close. |

### 1.2 Sidebar (`Sidebar.tsx`)

A 208px-wide white panel on the left side of every dashboard page.

**Main navigation (7 items):**

| Label | Route | Icon | What it opens |
|-------|-------|------|---------------|
| Dashboard | /operations | LayoutDashboard | Main operations control surface |
| Refinery Flow | /refinery-flow | GitBranch | Process flow visualization with Sankey chart |
| Inventory | /inventory | Package | Tank farm and product inventory |
| Logistics | /logistics | Truck | Inbound/outbound shipment tracking |
| Risk Assessment | /risk-assessment | ShieldAlert | Risk heatmap and active risk register |
| Reports | /analytics | FileBarChart | Financial and model health analytics |
| Logs | /logs | ScrollText | System event log with filters |

**Bottom navigation (2 items):**

| Label | Route | Icon |
|-------|-------|------|
| Settings | /settings | Settings |
| Support | /support | HelpCircle |

**User profile section** (bottom of sidebar): Shows "JM" avatar, "Refinery Ops" as the team name, and "INST ID · CONSTELLATION" as the organization identifier.

**Active state**: The current page's nav item gets a teal left border, teal text, and a light teal background.

### 1.3 Root Page (`/`)

Immediately redirects to `/operations`. The user never sees this page.

---

## 2. Login Page

**Route:** `/login` (outside the dashboard layout — no sidebar or header)

A centered card on a gray background with the Reflex branding.

| Element | Description |
|---------|-------------|
| **Logo** | "Reflex" in large teal text with subtitle "Refinery Optimization Platform" |
| **Email field** | Pre-filled with `j.martinez@valero.com`. This is Jessica Martinez, the shift supervisor persona used throughout the demo. |
| **Password field** | Pre-filled with `password`. |
| **Remember me checkbox** | Decorative toggle. |
| **Forgot Password? link** | Points to `#` — intentionally non-functional for the mock. |
| **Sign In button** | **Interactive** — calls `router.push("/operations")` to navigate to the main dashboard. No actual authentication occurs. |
| **Version footer** | "Reflex v2.1.0 · Constellation Energy" |

---

## 3. Operations Dashboard

**Route:** `/operations`  
**Sidebar label:** Dashboard  
**Header tab:** Global View

This is the primary control surface — the screen an operator sees all day. It's intentionally the only page without a standard h1 header because it leads with the hero financial metric.

### 3.1 Hero Metric Section

| Element | Value | Meaning |
|---------|-------|---------|
| **Label** | "Total Realized Opportunity" | Cumulative dollar value Reflex has captured through optimization recommendations that operators acted on |
| **Dollar figure** | **$1,247,832** | Animated counter (AnimatedMetric component). Represents total margin captured since system deployment. |
| **Trend badge** | +14.2% | Percentage improvement vs. the previous comparison period. Shown in a teal pill. |
| **Optimize Run button** | — | **Interactive** — clicking shows a teal toast notification: "Optimization run queued. Estimated completion: 2.3s". Auto-dismisses after 3 seconds. Simulates triggering a manual LP model re-solve. |
| **Export Log button** | — | **Interactive** — clicking shows a dark toast: "Export started. File will download shortly." Auto-dismisses after 3 seconds. Simulates exporting the shift log as a file. |

### 3.2 KPI Cards Row (4 cards)

Each card uses the `KPICard` component which displays a label, animated value, unit, and a sparkline trend.

| Card | Value | Unit | Sparkline Trend | Meaning |
|------|-------|------|-----------------|---------|
| **Throughput** | 412.8 | MBPD (thousand barrels per day) | 390 → 412.8 ↑ | Total crude processing volume across all units. Healthy refineries target their nameplate capacity (105K BPD for this site, but MBPD includes all product streams). |
| **Energy Index** | 88.4 | EEI (Energy Efficiency Index) | 85 → 88.4 ↑ | Composite measure of how efficiently the plant converts energy inputs (fuel, steam, electricity) into product output. 0–100 scale, higher is better. 88.4 is strong. |
| **Safety Health** | 0.98 | (unitless, 0–1 scale) | 0.95 → 0.98 ↑ | Composite safety score rolling up incident rate, near-miss frequency, equipment inspection pass rate, and safety compliance percentage. 0.98 = 98% safety health. |
| **Emissions** | 14.2 | MT/d (metric tons per day) | 15.1 → 14.2 ↓ | Daily emissions output (CO2-equivalent or criteria pollutants). Downward trend is positive — the system is finding more efficient operating points. Status: "healthy" (green). |

### 3.3 Recommendation Feed (left column, 55% width)

Section header shows "RECOMMENDATION FEED" with a count badge ("2 active").

Each recommendation is a `RecommendationCard` — a white card with a colored left border indicating priority.

**Recommendation 1 — HIGH priority (amber border):**

| Field | Value | Meaning |
|-------|-------|---------|
| Priority badge | HIGH | Second-highest urgency level |
| Timestamp | 14:23 | When the recommendation was generated |
| Trigger pill | "Price Movement" | What caused the recommendation — in this case, a change in market prices |
| Summary | "Crack spreads widened $1.80/bbl in the last 2 hours. Model recommends increasing naphtha yield by 2.6 percentage points on Units 3 and 4." | The AI's plain-language explanation of what to do and why |
| Delta table | Naphtha yield: 32.1% → 34.7% (+2.6%), Margin impact: +$44,000/day, Confidence: HIGH | Specific parameter changes the LP model recommends, with current vs. recommended values |
| **Acknowledge** button | — | Operator accepts the recommendation and will act. Logs to audit trail. |
| **Add Constraint** button | — | **Interactive** — opens the 5-step Constraint Wizard modal (see 3.6). Operator flags why the recommendation can't be implemented. |
| **Dismiss** button | — | Operator chooses not to act. Logged but no model update. |

**Recommendation 2 — MEDIUM priority (blue border):**

| Field | Value | Meaning |
|-------|-------|---------|
| Trigger | "Inventory Slack" | Triggered by suboptimal inventory positioning |
| Summary | Adjust diesel blend ratio on Unit 6 | |
| Delta | Diesel ratio: 29.8% → 27.2% (-2.6%), Margin: +$18,200/day | Lower priority but still significant daily value |

### 3.4 Refinery Flow Network Chart (right column, top)

A bar chart (`FlowNetworkChart` component using ECharts) showing performance percentage for each major processing unit.

| Bar | Unit | Performance | What it represents |
|-----|------|-------------|-------------------|
| CDU | Crude Distillation Unit | 94% | Primary unit that heats and separates raw crude into fractions (naphtha, diesel, gas oil, residue). 94% of optimal throughput. |
| FCC | Fluid Catalytic Cracker | 88% | Converts heavy gas oil into gasoline and lighter products using a catalyst. Running at 88% — slightly constrained. |
| HCU | Hydrocracker | 91% | Uses hydrogen and pressure to break heavy fractions into high-value diesel and jet fuel. |
| REF | Reformer | 96% | Upgrades low-octane naphtha into high-octane gasoline blendstock. Highest performer. |
| BLN | Blending | 85% | Mixes product streams to meet final specifications (octane, sulfur, vapor pressure). **Weakest unit** — blending bottlenecks are common when upstream units shift yields. |
| STR | Sulfur Recovery/Treating | 93% | Removes sulfur from process streams for environmental compliance. |

**Network Health Index: 94.5** — A weighted composite of all unit performances. Single number for at-a-glance plant health.

Y-axis range: 70–100% (compressed to highlight meaningful variation).

### 3.5 Constraint Panel (right column, bottom)

A tabbed card (`ConstraintPanel` component) with three tabs:

**Tab 1: Active Constraints** (default) — Operational limitations that the LP model must respect:

| Constraint | Unit | Equipment | Severity | Age | Status | Meaning |
|-----------|------|-----------|----------|-----|--------|---------|
| 1 | Unit 2 | HX-201 Fouling | -15% capacity | 3 days | Active (amber) | Heat exchanger is fouled, reducing capacity by 15%. Model accounts for this. |
| 2 | Unit 6 | Catalyst Aging | -8% yield | 12 days | Monitoring (blue) | Catalyst in the reformer is degrading, reducing yield. LP model coefficients updated. |
| 3 | Blend | Staffing Constraint | Manual override | This shift | Temporary (gray) | Not enough staff for full blending operations. Expires at shift change. |

Each constraint card has a colored left border matching its status. The "active" status means the constraint is currently binding the LP model.

**Tab 2: Active Overrides** — Shows "No active overrides" (empty state). Overrides are when an operator manually forces a value that conflicts with the LP solution.

**Tab 3: Shift Handover** — A timeline of events during the current shift, used for handover to the next shift:

| Time | Event | Type |
|------|-------|------|
| 14:23 | Naphtha yield recommendation acknowledged by J. Martinez | Action (teal dot) |
| 13:45 | HX-201 fouling constraint confirmed | Constraint (amber dot) |
| 11:07 | Diesel blend recommendation deferred — awaiting feed quality results | Deferral (blue dot) |
| 09:15 | HX-201 fouling constraint submitted by J. Martinez | Constraint (amber dot) |
| 06:30 | Shift started. 2 constraints carried over from night shift. | Routine (gray dot) |

**Footer button:** "+ LOG NEW CONSTRAINT" — opens the constraint wizard.

### 3.6 Optimization Queue (bottom section)

A table (`OptimizationQueue` component) showing assets queued for optimization:

| Asset ID | Name | Stability % | Trend | Action |
|----------|------|------------|-------|--------|
| BLNK-041-ALPHA | Blending Unit Alpha | 99.6% | — (stable) | Optimize button |
| HEAT-204-BRAVO | Heat Exchanger 204 | 92.1% | ▼ (down, red) | Optimize button |
| FCC-102-GAMMA | FCC Reactor Gamma | 97.3% | ▲ (up, green) | Optimize button |

Stability % represents how consistently the asset operates within its target parameters. The trend arrow indicates whether stability is improving or declining.

### 3.7 Constraint Wizard Modal

A 5-step guided modal (`ConstraintWizard` component) for adding operational constraints:

| Step | Title | Content | Options |
|------|-------|---------|---------|
| 1 | Select Unit | Grid of unit buttons | Unit 2 — CDU, Unit 3 — FCC, Unit 4 — HCU, Unit 6 — Reformer, Blend |
| 2 | Constraint Type | Category selection | Equipment Issue, Feed Quality, Safety, Staffing |
| 3 | Specific Constraint | Depends on unit selected (e.g., for Unit 2: HX-201 Fouling, Pump P-202 Vibration, Valve V-203 Sticking) | Dynamic list filtered by unit |
| 4 | Severity & Duration | Slider for severity (1–10), duration dropdown | Severity scale, duration options |
| 5 | Confirm | Summary of all selections | Confirm or go back |

The wizard has a step indicator at the top, animated slide transitions, and a close button. The LP model would incorporate the new constraint in its next solve cycle.

---

## 4. Refinery Flow

**Route:** `/refinery-flow`  
**Sidebar label:** Refinery Flow

### 4.1 Page Header

| Element | Value | Meaning |
|---------|-------|---------|
| Title | "Refinery Flow" | |
| Status badge | "All Units Online" | Green teal badge — all 6 processing units are operational |
| Sync time | "Synced 12s ago" | Data freshness indicator |

### 4.2 KPI Strip (4 cards)

| Card | Value | Unit | Trend | Meaning |
|------|-------|------|-------|---------|
| **Total Throughput** | 412.8 | MBPD | +2.1% vs yesterday | Total volume of all product streams flowing through the refinery |
| **Network Efficiency** | 94.5 | % | +0.8% vs target | Same as the Network Health Index on operations — weighted average of all unit performances |
| **Active Units** | 6 | /6 | — | All 6 processing units are running. None are down for maintenance. |
| **Feed Rate** | 105 | K BPD (thousand barrels per day) | +1.5% vs plan | Rate at which crude oil enters the CDU. 105K BPD is this refinery's nameplate capacity. |

### 4.3 Sankey Chart — Material Flow Network

An interactive Sankey diagram (ECharts SVG renderer) showing how crude oil flows through the refinery and becomes products.

**Flow paths (left to right):**

```
Crude Feed (105K) → CDU
    CDU → FCC (38K)        → Gasoline Pool (32K) + LPG (6K)
    CDU → HCU (28K)        → Diesel Pool (24K) + Naphtha (4K)
    CDU → Reformer (22K)   → Reformate (18K) + H2 (4K)
    CDU → Blend (17K)      → Product Out (17K)
```

**What each node represents:**
- **Crude Feed**: Raw crude oil entering the refinery
- **CDU**: Crude Distillation Unit — first separation step
- **FCC**: Fluid Catalytic Cracker — makes gasoline from heavy oil
- **HCU**: Hydrocracker — makes diesel and jet fuel
- **Reformer**: Upgrades naphtha to high-octane gasoline blendstock
- **Blend**: Final product blending to meet specifications
- **Product nodes**: Gasoline Pool, LPG, Diesel Pool, Naphtha, Reformate, H2, Product Out

Color gradient: dark teal (upstream) → light teal (downstream). Hover shows flow volume.

### 4.4 Unit Status Grid (6 cards, 3 columns)

Each card shows one processing unit with a colored left border:

| Unit | Status | Throughput | Temp (°F) | Pressure (psi) | Border Color |
|------|--------|-----------|-----------|----------------|-------------|
| CDU | Online | 105 K BPD | 725 | 42 | Teal (healthy) |
| FCC | Online | 38 K BPD | 985 | 28 | Teal |
| HCU | **Caution** | 28 K BPD | 780 | 165 | **Amber** (warning) |
| Reformer | Online | 22 K BPD | 925 | 350 | Teal |
| Blend | Online | 17 K BPD | 180 | 15 | Teal |
| Storage | Online | 85 K BPD | 95 | 2 | Teal |

The HCU unit shows "Caution" status (amber border and text) — this correlates with its 91% performance on the operations page and the ongoing constraints.

---

## 5. Inventory Management

**Route:** `/inventory`  
**Sidebar label:** Inventory

### 5.1 KPI Strip (4 cards)

| Card | Value | Unit | Trend | Meaning |
|------|-------|------|-------|---------|
| **Crude Supply Days** | 8.2 | days | +0.5 vs last week | How many days the refinery can operate at current throughput before running out of crude. 8.2 days is comfortable. |
| **Total Ullage** | 42,000 | bbl (barrels) | -3.2% capacity used | Available empty space across all tanks. Lower means tanks are fuller. |
| **Product Ready** | 156 | K bbl | +4.1% vs target | Volume of finished products ready for sale/shipment. |
| **Tank Utilization** | 78 | % | +2.0% vs avg | Percentage of total tank capacity currently in use. |

### 5.2 Tank Farm Overview (8 tank cards, 4 columns)

Each card shows one storage tank:

| Tank ID | Product | Fill % | Volume / Capacity | Temp | Quality |
|---------|---------|--------|-------------------|------|---------|
| TK-101 | Crude Oil | 82% | 410,000 / 500,000 bbl | 95°F | On-Spec (green) |
| TK-102 | Crude Oil | 45% | 225,000 / 500,000 bbl | 92°F | On-Spec |
| TK-201 | Gasoline | 91% | 182,000 / 200,000 bbl | 78°F | On-Spec |
| TK-202 | Gasoline | 67% | 134,000 / 200,000 bbl | 76°F | On-Spec |
| TK-301 | Diesel | 73% | 219,000 / 300,000 bbl | 85°F | On-Spec |
| TK-302 | Diesel | 88% | 264,000 / 300,000 bbl | 83°F | On-Spec |
| TK-401 | Jet Fuel | 56% | 112,000 / 200,000 bbl | 72°F | On-Spec |
| TK-501 | Naphtha | 34% | 51,000 / 150,000 bbl | 88°F | **Testing** (amber) |

Each card has a teal fill-level progress bar. TK-501 shows "Testing" quality status in amber — the naphtha hasn't passed quality certification yet.

### 5.3 Product Inventory Table (7 rows)

| Product | Grade | Volume (bbl) | Tanks | Quality | Last Updated |
|---------|-------|-------------|-------|---------|-------------|
| Crude Oil | WTI Midland | 635,000 | 2 | On-Spec | 2024-04-05 06:30 |
| Gasoline | RBOB Regular | 316,000 | 2 | On-Spec | 2024-04-05 06:28 |
| Diesel | ULSD #2 | 483,000 | 2 | On-Spec | 2024-04-05 06:25 |
| Jet Fuel | Jet-A | 112,000 | 1 | On-Spec | 2024-04-05 06:20 |
| Naphtha | Light Virgin | 51,000 | 1 | Testing | 2024-04-05 05:45 |
| LPG | Mix C3/C4 | 28,000 | 1 | On-Spec | 2024-04-05 06:15 |
| Reformate | High Octane | 74,000 | 1 | On-Spec | 2024-04-05 06:10 |

Alternating row backgrounds. Monospace font for numeric values.

---

## 6. Logistics & Scheduling

**Route:** `/logistics`  
**Sidebar label:** Logistics

### 6.1 KPI Strip (4 cards)

| Card | Value | Unit | Trend | Meaning |
|------|-------|------|-------|---------|
| **Inbound Today** | 3 | shipments | 0 (scheduled) | Number of feedstock deliveries expected today |
| **Outbound Today** | 5 | shipments | +1 vs yesterday | Number of product shipments going out today |
| **Pipeline Throughput** | 62 | K BPD | +3.5% vs capacity | Volume flowing through pipeline connections |
| **On-Time Rate** | 94 | % | +2.0% 30-day avg | Percentage of shipments arriving/departing on schedule |

### 6.2 Inbound Feedstock Table (6 rows)

| Date | Source | Volume (bbl) | Mode | Status | ETA |
|------|--------|-------------|------|--------|-----|
| Apr 05 | Permian Basin | 35,000 | Pipeline (blue dot) | Delivered (green) | — |
| Apr 05 | Cushing Hub | 42,000 | Pipeline | In Transit (blue) | 14:30 |
| Apr 05 | Eagle Ford | 18,000 | Rail (brown dot) | In Transit | 16:45 |
| Apr 06 | Midland Terminal | 28,000 | Pipeline | Scheduled (gray) | 08:00 |
| Apr 06 | Local Blend | 5,000 | Truck (teal dot) | Scheduled | 10:30 |
| Apr 07 | Bakken Field | 22,000 | Rail | Scheduled | 06:00 |

**Transport modes** are color-coded: Pipeline = blue, Rail = brown, Truck = teal.

### 6.3 Outbound Shipments Table (5 rows)

| Date | Destination | Product | Volume (bbl) | Mode | Status |
|------|-------------|---------|-------------|------|--------|
| Apr 05 | Houston Terminal | Gasoline | 28,000 | Pipeline | In Transit |
| Apr 05 | Dallas Depot | Diesel | 15,000 | Truck | Delivered |
| Apr 05 | DFW Airport | Jet Fuel | 22,000 | Pipeline | In Transit |
| Apr 06 | Gulf Export | Naphtha | 18,000 | Pipeline | Scheduled |
| Apr 06 | Midwest Rail | Gasoline | 32,000 | Rail | Scheduled |

### 6.4 Transport Mode Breakdown (3 cards)

| Mode | Percentage | Volume (bbl/day) | Color |
|------|-----------|-----------------|-------|
| Pipeline | 62% | 38,400 | Blue (#2563EB) |
| Rail | 28% | 17,300 | Brown (#92400E) |
| Truck | 10% | 6,200 | Teal (#0D9488) |

Each card has a progress bar filled to the mode's percentage.

---

## 7. Financial & Model Health (Analytics)

**Route:** `/analytics`  
**Sidebar label:** Reports  
**Page title:** "Financial & Model Health"

### 7.1 KPI Strip (5 cards)

| Card | Value | Unit | Trend | Meaning |
|------|-------|------|-------|---------|
| **Total Margin Captured** | $1.24 | M (million) | +12% vs last quarter | Total dollar value of optimization recommendations that were acted on |
| **Capture Rate** | 82 | % | — | Percentage of recommended value that operators actually captured (some recs are dismissed or partially implemented) |
| **Actionability** | 85 | % | +3% ↑ high intent | Percentage of recommendations that operators found actionable (acknowledged or constrained, not dismissed) |
| **LP Model Accuracy** | 96.2 | % | — | How closely the LP model's predictions match actual plant behavior |
| **Sensor Health** | 87 | /100 | Status: warning | Composite sensor health score. Warning status because 3 sensor substitutions are active — the system is using calculated values instead of direct readings |

### 7.2 Chart Grid (2x2, 55%/45% split)

**Top-left: Waterfall Chart** (`WaterfallChart` component)
- Shows margin contribution by unit: CDU ($420K), FCC ($380K), HCU ($260K), Blend ($180K)
- Has a time range toggle: 30d / 90d / YTD
- Visualizes where value is being created in the refinery

**Top-right: Drift Chart** (`DriftChart` component)
- Dual-line chart: solid line = LP model predicted values, dashed line = actual plant values
- 90-day window. First 30 days: lines overlap perfectly. After day 30: actual values start drifting down (8.0 → ~7.58)
- This shows "model drift" — the LP model's predictions diverging from reality, indicating the model may need recalibration (catalyst aging, fouling, etc.)

**Bottom-left: Sensor Health Matrix** (`SensorHealthMatrix` component)
- Grid with units (rows) × sensor types (columns): Temp, Pressure, Flow, Level, Comp (composition)
- Each cell is color-coded: Green (#0D9488) = Healthy, Amber (#D97706) = Degraded, Red (#DC2626) = Substituted
- Notable issues:
  - CDU Pressure: **Substituted** (red) — using a calculated value instead of the physical sensor
  - FCC Pressure: **Degraded** — sensor reading but with reduced confidence
  - FCC Composition: **Degraded**
  - Reformer Flow: **Substituted**
  - Reformer Level: **Degraded**

**Bottom-right: Constraint Bar Chart** (`ConstraintBarChart` component)
- Horizontal bar chart showing recurring constraint patterns (which constraints fire most often)
- Sorted by frequency:
  1. Unit 2 HX-201 Fouling: 11 times (amber bar, annotated "Consider permanent seasonal constraint")
  2. Unit 6 Catalyst Aging: 8 times
  3. Blend Staffing: 6 times
  4. CDU Feed Quality: 4 times
  5. FCC Regen Pressure: 3 times
- The annotation on HX-201 suggests this is a known recurring issue that should become a permanent constraint rather than being re-entered every time

---

## 8. Asset Management

**Route:** `/assets`  
**Header tab:** Assets

### 8.1 KPI Strip (4 cards)

| Card | Value | Unit | Status | Meaning |
|------|-------|------|--------|---------|
| **Total Assets** | 142 | — | — | Total pieces of tracked equipment across the refinery |
| **Average Health** | 91.2 | /100 | — | Fleet-wide average equipment health score |
| **Maintenance Due** | 5 | — | Warning (amber) | Number of assets with maintenance due soon |
| **Uptime** | 99.2 | % | — | Overall equipment uptime percentage |

### 8.2 Equipment Registry Table

**Interactive filter tabs:** All, Pumps, Valves, Exchangers, Reactors — clicking filters the table by equipment type.

| Asset ID | Name | Unit | Type | Health | Last Inspection | Next Maintenance | Status |
|----------|------|------|------|--------|----------------|-----------------|--------|
| AST-001 | CDU Feed Pump A | CDU | Pump | 94 (teal bar) | 2026-02-15 | 2026-05-15 | Online (green) |
| AST-002 | CDU Feed Pump B | CDU | Pump | 87 (teal bar) | 2026-01-20 | 2026-04-20 | Online |
| AST-003 | FCC Regen Valve V-101 | FCC | Valve | 72 (amber bar) | 2025-12-10 | 2026-04-10 | Online |
| AST-004 | HCU Recycle Pump | HCU | Pump | 96 (teal) | 2026-03-01 | 2026-06-01 | Online |
| AST-005 | Reformer Pre-Heat Exchanger | Reformer | Exchanger | 88 (teal) | 2026-01-05 | 2026-04-05 | Online |
| AST-006 | Alkylation Reactor R-201 | Alkylation | Reactor | 91 (teal) | 2026-02-28 | 2026-08-28 | Online |
| AST-007 | CDU Overhead Condenser | CDU | Exchanger | 65 (amber) | 2025-11-15 | 2026-04-08 | **Maintenance** (amber) |
| AST-008 | FCC Slide Valve SV-02 | FCC | Valve | 82 (teal) | 2026-02-01 | 2026-05-01 | Online |
| AST-009 | HCU Hydrogen Compressor | HCU | Pump | **45** (red) | 2025-10-20 | 2026-04-06 | **Offline** (red) |
| AST-010 | Reformer Reactor R-301 | Reformer | Reactor | 93 (teal) | 2026-03-10 | 2026-09-10 | Online |
| AST-011 | Blend Header Valve BV-05 | Blending | Valve | 98 (teal) | 2026-03-15 | 2026-06-15 | Online |
| AST-012 | FCC Main Fractionator Reboiler | FCC | Exchanger | 76 (amber) | 2025-12-22 | 2026-04-22 | Online |
| AST-013 | CDU Desalter Pump P-103 | CDU | Pump | 89 (teal) | 2026-01-30 | 2026-04-30 | Online |
| AST-014 | Alkylation Acid Settler Valve | Alkylation | Valve | 58 (amber) | 2025-11-01 | 2026-04-12 | **Maintenance** (amber) |
| AST-015 | HCU Reactor R-401 | HCU | Reactor | 95 (teal) | 2026-03-05 | 2026-09-05 | Online |

Health bars are color-coded: >80 = teal, 50–80 = amber, <50 = red.

### 8.3 Upcoming Maintenance Timeline (5 items)

A vertical timeline with color-coded dots by maintenance type:

| Date | Asset | Work | Duration | Type (dot color) |
|------|-------|------|----------|-----------------|
| 2026-04-05 | CDU Overhead Condenser | Tube bundle cleaning & inspection | 3 days | Corrective (red) |
| 2026-04-06 | HCU Hydrogen Compressor | Bearing replacement & alignment | 5 days | Corrective (red) |
| 2026-04-10 | FCC Regen Valve V-101 | Actuator calibration & seat inspection | 1 day | Predictive (teal) |
| 2026-04-12 | Alkylation Acid Settler Valve | Full valve overhaul | 2 days | Routine (gray) |
| 2026-04-20 | CDU Feed Pump B | Vibration analysis & seal check | 4 hrs | Inspection (blue) |

---

## 9. Compliance & Regulatory

**Route:** `/compliance`  
**Header tab:** Compliance

### 9.1 KPI Strip (4 cards)

| Card | Value | Meaning |
|------|-------|---------|
| **Active Regulations** | 12 | Number of regulatory requirements being tracked |
| **Compliance Rate** | 98.5% | Percentage of regulations in full compliance |
| **Upcoming Audits** | 2 | External audits scheduled in the near term |
| **Certifications** | 8 | Active third-party certifications held |

### 9.2 Regulatory Tracker Table (10 regulations)

| Regulation | Agency | Status | Due Date | Last Review | Owner |
|-----------|--------|--------|----------|-------------|-------|
| Clean Air Act - MACT Standards | EPA | Compliant (green) | 2026-06-30 | 2026-03-15 | L. Garcia |
| OSHA PSM - Process Safety Mgmt | OSHA | Compliant | 2026-09-01 | 2026-02-20 | R. Kim |
| SPCC Plan - Oil Spill Prevention | EPA | Compliant | 2026-07-15 | 2026-01-10 | L. Garcia |
| Wastewater Discharge Permit | State DEQ | **Pending Review** (amber) | 2026-04-30 | 2025-12-05 | L. Garcia |
| Air Quality Operating Permit | State DEQ | Compliant | 2026-12-01 | 2026-03-01 | M. Chen |
| RCRA Hazardous Waste Permit | EPA | Compliant | 2026-08-15 | 2026-02-28 | T. Nguyen |
| RMP - Risk Management Plan | EPA | **Pending Review** (amber) | 2026-05-15 | 2025-11-20 | R. Kim |
| Benzene NESHAP Compliance | EPA | Compliant | 2026-10-01 | 2026-03-10 | L. Garcia |
| OSHA Respiratory Protection | OSHA | **Action Required** (red) | 2026-04-15 | 2025-10-15 | R. Kim |
| Stormwater Pollution Prevention | State DEQ | Compliant | 2026-11-30 | 2026-01-25 | T. Nguyen |

### 9.3 Certifications (4 cards, 2x2 grid)

| Certification | Issuing Body | Expiry | Days Remaining | Bar Color |
|--------------|-------------|--------|----------------|-----------|
| ISO 14001 | Bureau Veritas | 2027-03-15 | 344d | Teal (>90 days) |
| ISO 45001 | DNV GL | 2026-11-20 | 229d | Teal |
| API 653 | American Petroleum Institute | 2026-05-27 | **52d** | **Amber** (30–90 days) |
| OSHA PSM | OSHA VPP Star | 2026-09-10 | 158d | Teal |

### 9.4 Upcoming Audits (2 cards)

| Audit | Auditor | Date | Scope | Preparation |
|-------|---------|------|-------|-------------|
| EPA Compliance Inspection | EPA Region 6 | 2026-05-12 | Air emissions, wastewater discharge, hazardous waste handling, SPCC plan | 72% (teal bar) |
| ISO 14001 Surveillance Audit | Bureau Veritas | 2026-06-08 | Environmental management system effectiveness, corrective actions | 45% (teal bar) |

---

## 10. Risk Assessment

**Route:** `/risk-assessment`  
**Sidebar label:** Risk Assessment

### 10.1 Page Header

Status badge: **"7 Active Risks"** in amber (unlike most pages which show green "System Normal").

### 10.2 KPI Strip (4 cards)

| Card | Value | Status | Meaning |
|------|-------|--------|---------|
| **Active Risks** | 7 | — | Total number of tracked risks currently open |
| **Critical** | 2 | Warning (amber) | Number of risks with scores > 8.0 |
| **Avg Risk Score** | 6.4 / 10 | — | Average severity across all active risks |
| **Mitigated This Month** | 3 | +2 vs last month | Risks successfully closed or reduced to acceptable levels |

### 10.3 Risk Heatmap (ECharts, left column)

A 5x5 matrix with:
- **X-axis (Impact):** Negligible, Minor, Moderate, Major, Catastrophic
- **Y-axis (Likelihood):** Rare, Unlikely, Possible, Likely, Almost Certain
- **Color gradient:** Green (low risk) → Yellow → Orange → Red (critical risk)

**Plotted risk points:**

| Position | Impact × Likelihood | Score |
|----------|-------------------|-------|
| Major × Likely | 8.5 | High — crude supply pricing risk |
| Catastrophic × Possible | 9.2 | Critical — FCC catalyst attrition |
| Moderate × Unlikely | 4.8 | Medium — insurance premium risk |
| Minor × Possible | 5.1 | Medium — reformer tube thinning |
| Major × Rare | 3.2 | Low — CDU corrosion |
| Moderate × Likely | 7.0 | High — H2S detector drift |
| Catastrophic × Unlikely | 6.9 | Medium-High — wastewater pH risk |

### 10.4 Active Risks Table (7 risks, right column)

| ID | Description | Category | Score | Owner | Status |
|----|------------|----------|-------|-------|--------|
| RSK-041 | FCC regenerator catalyst attrition above threshold | Operational (blue) | **9.2** | M. Chen | Open (red) |
| RSK-038 | Crude supply contract renewal pricing risk | Financial (amber) | **8.5** | J. Patel | Open (red) |
| RSK-035 | H2S detector calibration drift in alkylation unit | Safety (red) | 7.0 | R. Kim | Mitigating (amber) |
| RSK-033 | Wastewater discharge pH exceedance probability | Environmental (green) | 6.9 | L. Garcia | Mitigating (amber) |
| RSK-030 | Reformer tube wall thinning above forecast | Operational (blue) | 5.1 | T. Nguyen | Monitoring (blue) |
| RSK-028 | Insurance premium increase due to incident rate | Financial (amber) | 4.8 | J. Patel | Monitoring (blue) |
| RSK-025 | CDU overhead corrosion rate exceeding inspection plan | Operational (blue) | 3.2 | M. Chen | Monitoring (blue) |

Each row has a colored left border matching its category.

### 10.5 Risk Trend Chart (bottom, full width)

A line chart showing **Total Risk Score over 12 months** (May → April). The trend line shows steady improvement: 52 → 40, with a teal area fill and smooth curve.

---

## 11. Safety Management

**Route:** `/safety`  
**Header tab:** Safety

### 11.1 Hero Metric

A prominent card with teal left border accent:
- **"Days Without Recordable Incident"**
- **247** (animated counter, large teal text)
- "Plant record: 312 days"

### 11.2 KPI Strip (4 cards)

| Card | Value | Unit | Meaning |
|------|-------|------|---------|
| **TRIR** | 0.42 | — | Total Recordable Incident Rate — industry standard safety metric. Calculated as (incidents × 200,000) / total hours worked. 0.42 is excellent (industry average ~0.5 for refineries). |
| **Near Misses This Month** | 3 | — | Incidents that could have resulted in injury but didn't. Tracking near misses is a leading indicator. |
| **Open Work Permits** | 12 | — | Active permits for hazardous work (hot work, confined space, etc.) |
| **Training Completion** | 96 | % | Percentage of required safety training completed by staff |

### 11.3 Incident Log Table (10 incidents, left column)

| Date | Type | Severity | Location | Description | Status |
|------|------|----------|----------|-------------|--------|
| 2026-04-02 | Near Miss (amber dot) | Medium | FCC Unit | Scaffold plank dislodged during maintenance access | Investigating (amber) |
| 2026-03-28 | First Aid (teal dot) | Low | CDU | Minor hand laceration during gasket replacement | Closed (green) |
| 2026-03-15 | Spill (blue dot) | Medium | Tank Farm | Small diesel spill during tank gauging — 2 gal contained | Investigating |
| 2026-03-01 | Near Miss | Low | Reformer | Dropped wrench from elevated platform — area was clear | Closed |
| 2026-02-14 | Environmental (purple dot) | Low | Wastewater | Brief pH excursion in outfall — auto-corrected within 10 min | Closed |
| 2026-01-20 | First Aid | Low | HCU | Chemical splash on arm — immediate decon, no injury | Closed |
| 2025-12-05 | **Fire** (red dot) | **High** | Alkylation | Small pump seal fire — extinguished in 45s by operator | Closed |
| 2025-11-18 | Near Miss | Medium | Blending | Pressure relief valve lifted during startup — no release | Closed |
| 2025-10-30 | Spill | Low | Loading Rack | Hose drip during truck loading — 0.5 gal on pad | Closed |
| 2025-10-10 | First Aid | Low | CDU | Heat stress event during turnaround — worker treated on-site | Open (red) |

### 11.4 Active Work Permits (5 cards, right column)

Each permit card has a colored left border by type:

| Permit ID | Type | Location | Valid Until | Holder | Border Color |
|-----------|------|----------|-------------|--------|-------------|
| WP-2026-0412 | Hot Work | FCC Regenerator Level 3 | 2026-04-05 18:00 | D. Martinez | Red |
| WP-2026-0411 | Confined Space | CDU Overhead Drum D-101 | 2026-04-05 16:00 | A. Johnson | Amber |
| WP-2026-0410 | Line Break | HCU Feed Line L-204 | 2026-04-06 12:00 | K. Williams | Blue |
| WP-2026-0409 | Excavation | Tank Farm Road B South | 2026-04-07 17:00 | S. Brown | Teal |
| WP-2026-0408 | Elevated Work | Reformer Stack Platform | 2026-04-05 15:00 | P. Davis | Purple |

### 11.5 TRIR Trend Chart (bottom, full width)

A 24-month line chart showing TRIR declining from 0.80 (May 2024) to 0.42 (April 2026). A dashed red horizontal line at 0.5 marks the "Industry Avg" — the plant has been below industry average since mid-2025.

---

## 12. System Logs

**Route:** `/logs`  
**Sidebar label:** Logs

### 12.1 Page Header

Title "System Logs" with a LiveIndicator component (pulsing dot + "Live"). Sync indicator: "Last sync: 4s ago".

### 12.2 Filter Bar (interactive)

Three filter mechanisms, all functional:

**Type filter pills:** All, System, User, API, Alert
- Active pill: teal background with white text
- Inactive: gray background with border

**Severity filter pills:** All, Info, Warning, Error, Critical
- Same styling as type filters

**Search input:** Full-text search that filters by message, source, or type in real time.

All filters combine — selecting "API" type + "Error" severity shows only API errors.

### 12.3 Log Table (30 entries)

Grid-based layout with columns: Timestamp, Type, Severity, Source, Message.

**Each row is clickable** — expanding shows:
- **Full Message**: Extended description of the event
- **Stack Trace**: Code-style error trace (dark background, monospace) — only for errors
- **Metadata**: Key-value pairs with structured event data

**Log types and their colors:**
- **System** (blue pill): Internal system events — sensor reads, LP solves, data syncs
- **User** (teal pill): Human actions — logins, recommendations acknowledged, constraints added
- **API** (purple pill): External API interactions — market data feeds, AI engine calls
- **Alert** (red pill): High-priority events — safety interlocks, authentication failures

**Severity indicators:**
- **Info** (gray dot): Normal operations
- **Warning** (amber dot): Needs attention but not critical
- **Error** (red dot): Something failed
- **Critical** (red pulsing dot): Immediate attention required

**Notable log entries:**

| ID | Severity | Summary | Why it matters |
|----|----------|---------|---------------|
| log-006 | Error | Authentication failed for unknown session | Security event — automated client tried an invalid session |
| log-011 | **Critical** | Safety interlock SIL-2 pressure relief valve PRV-101 actuated | Safety system activated — CDU overhead pressure reached 142 psig (setpoint: 140). Auto-resolved. |
| log-018 | Error | EIA API rate limit exceeded — 429 Too Many Requests | Market data temporarily unavailable |
| log-023 | Error | PI Server 3 connection lost — failover initiated | Sensor data source failed, automatic failover to backup server |
| log-028 | **Critical** | LP model infeasible — constraint conflict detected | The optimization model couldn't find a valid solution. IIS analysis identified conflicting constraints. |

### 12.4 Pagination Bar

Shows "1–{filtered count} of 142 entries" with Previous/Next buttons. Pagination is decorative (all 30 mock entries show on one page).

---

## 13. Settings

**Route:** `/settings`  
**Sidebar label:** Settings

### 13.1 Tab Navigation (4 tabs, all interactive)

**Profile | Integrations | Notifications | System**

### 13.2 Profile Tab

User profile form for J. Martinez:

| Field | Value | Editable |
|-------|-------|----------|
| Avatar | "JM" teal circle | No |
| Full Name | J. Martinez | Yes |
| Email | j.martinez@valero.com | Yes |
| Role | Shift Supervisor | Yes (dropdown: Shift Supervisor, Process Engineer, Plant Manager, Operator) |
| Site | Valero Memphis | No (disabled, gray background) |
| Timezone | US/Central (CDT) | Yes (dropdown) |
| Shift Schedule | Day Shift (06:00–18:00) | Yes (dropdown: Day/Night) |

Save Changes (teal) and Cancel buttons at bottom.

### 13.3 Integrations Tab (6 cards, 3 columns)

| Integration | Icon | Connected | Detail | Last Activity |
|------------|------|-----------|--------|--------------|
| PI System | Database | Yes (green dot) | 127 tags synced | Last sync: 32s ago |
| Market Data | Radio | Yes | EIA + OPIS feeds | Last sync: 5m ago |
| LP Solver | Settings2 | Yes | Excel COM v2.1 | Last solve: 14m ago |
| AI Engine | BrainCircuit | Yes | Claude Haiku | Requests today: 23 |
| Teams | MessageSquare | Yes | #reflex-alerts channel | Last message: 8m ago |
| ERP System | Server | **No** (red dot) | Not configured | "Configure" button |

### 13.4 Notifications Tab

**Notification preferences matrix:**

| Category | In-App | Email | Teams | SMS |
|----------|--------|-------|-------|-----|
| Recommendations | ✓ | ✓ | ✓ | ✗ |
| Constraint Alerts | ✓ | ✓ | ✓ | ✓ |
| System Warnings | ✓ | ✓ | ✓ | ✓ |
| Shift Handover | ✓ | ✓ | ✗ | ✗ |
| Daily Digest | ✓ | ✓ | ✗ | ✗ |
| Model Drift | ✓ | ✗ | ✓ | ✗ |

All checkboxes are **interactive** — clicking toggles each notification channel.

**Quiet Hours** section with toggle switch (on by default): From 22:00 to 06:00. Suppresses non-critical notifications during off hours. Time inputs are editable.

### 13.5 System Tab

**System Information:**
| Field | Value |
|-------|-------|
| Version | Reflex v2.1.0 |
| Environment | Production |
| License | Enterprise — Constellation Energy |
| Database | PostgreSQL 16 + TimescaleDB |
| Region | US-Central |
| Last Updated | 2026-03-28 |

**Data Retention:**
| Data Type | Retention |
|-----------|-----------|
| Sensor Data | 2 years |
| Audit Logs | 7 years |
| Recommendations | Indefinite |

Action buttons: "Contact Administrator" and "Export System Report" (decorative).

---

## 14. Help & Support

**Route:** `/support`  
**Sidebar label:** Support

### 14.1 FAQ Accordion (8 questions, left column)

All items are **interactive** — clicking a question expands/collapses the answer. Only one answer is open at a time.

| # | Question | Key points in answer |
|---|----------|---------------------|
| 1 | How does Reflex generate recommendations? | LP optimization model + real-time market data (EIA, OPIS, Platts) + PI historian + AI layer (Claude Haiku). Re-solves every 60 seconds. |
| 2 | What should I do when I see a recommendation? | Three actions: Acknowledge, Add Constraint, Dismiss. All logged to audit trail. |
| 3 | How do I add a constraint? | 5-step wizard: unit → type → specific constraint → severity/duration → confirm. Temporary constraints expire automatically. |
| 4 | What is Shadow Mode? | Trust-building phase — system generates recommendations but doesn't push to operators. Scored against actual decisions until 80%+ alignment over 30 days. |
| 5 | How often does the system update? | Sensors: 30–60s. LP solve: 2–5s per cycle. Market data: varies by source (EIA daily, OPIS intraday, Platts trading windows). |
| 6 | What happens if the LP model fails to solve? | IIS (Irreducible Infeasible Set) analysis, falls back to last feasible solution, alerts shift supervisor. |
| 7 | How is margin impact calculated? | Delta between current and LP-optimized operating point, valued at current market prices. Accounts for utility costs, yield shifts, and quality giveaway. |
| 8 | Who can I contact for support? | Site admin, submit ticket on this page, email reflex-support@constellation.com, or 24/7 phone: +1 (800) 555-0142. Response SLAs: Critical 15min, High 1hr, Medium 4hr, Low next business day. |

### 14.2 Documentation Links (6 items, right column top)

| Link | Description |
|------|-------------|
| Getting Started | Quick start guide for new users |
| Operator Handbook | Complete reference for daily operations |
| API Reference | REST API and webhook documentation |
| Troubleshooting Guide | Common issues and solutions |
| Release Notes (v2.1.0) | Latest features and fixes |
| Training Videos | Step-by-step video walkthroughs |

All links point to `#` (mock). Icons change color to teal on hover.

### 14.3 Support Ticket Form (right column bottom)

**Interactive form** with three fields:
- **Subject**: Text input with placeholder "Brief description of the issue"
- **Description**: Textarea (4 rows) with placeholder "Describe the issue in detail..."
- **Priority**: Dropdown — Low, Medium (default), High, Critical

**Submit Ticket button** — on click:
1. Form clears
2. Shows success state: green checkmark, "Ticket submitted successfully", reference number "SUP-2847"
3. "Submit another ticket" link resets the form

### 14.4 System Status (bottom, full width, 5 services)

| Service | Status | Detail |
|---------|--------|--------|
| API Gateway | Operational (green dot) | 99.9% uptime |
| Database | Operational | Healthy |
| AI Engine | Operational | p99: 1.2s |
| Market Feed | **Degraded** (amber pulsing dot) | Intermittent delays |
| Task Scheduler | Operational | All jobs running |

The Market Feed degraded status is consistent with the log entries showing EIA API timeouts and rate limiting.
