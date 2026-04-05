# Reflex Demo Walkthrough

A guided tour of the Reflex refinery optimization platform. Estimated time: 5-7 minutes.

---

## 1. Login

**URL:** `http://localhost:3000/login`

> "This is Reflex — an AI-powered optimization platform for mid-market oil refineries. Let's log in as Jessica Martinez, a shift operator at Constellation Energy."

- Credentials are pre-filled (j.martinez@valero.com / password)
- Click **Sign In**

---

## 2. Operations Dashboard

**URL:** `/operations` (lands here after login)

> "This is the main control surface. At the top we see the total realized opportunity — the dollar value Reflex has captured through optimization recommendations."

**Walk through:**
- **Hero metric** — total margin captured with trend indicator
- **KPI row** — four cards showing key operational metrics with sparkline trends
- **Recommendation Feed** (left) — AI-generated optimization recommendations ranked by priority. Each card shows the margin impact delta and lets operators Acknowledge, Add Constraint, or Dismiss
- **Flow Network chart** (right) — real-time refinery throughput visualization
- **Constraint Panel** (right) — active operational constraints with handover timeline

**Interactive demos:**
1. Click **"Add Constraint"** on any recommendation card to open the 5-step constraint wizard. Walk through: select unit, constraint type, specific constraint, severity, then confirm
2. Click **"Optimize Run"** button — shows toast: *"Optimization run queued. Estimated completion: 2.3s"*
3. Click **"Export Log"** button — shows toast: *"Export started. File will download shortly."*
4. Scroll down to the **Optimization Queue** table showing pending optimization items

---

## 3. Refinery Flow

**Sidebar:** Refinery Flow

> "This page gives operators a visual map of the entire refinery process — from crude intake through distillation to product output."

- Unit-level KPI cards with status indicators (healthy/warning/critical)
- Process flow visualization showing throughput between units
- Feed quality and yield data

---

## 4. Inventory

**Sidebar:** Inventory

> "Inventory tracks every tank and storage vessel in real time. Operators can see fill levels, days of supply, and capacity utilization at a glance."

- KPI cards for total capacity and utilization
- Tank inventory table with fill levels and status
- Product-level breakdown

---

## 5. Logistics

**Sidebar:** Logistics

> "Logistics manages inbound crude deliveries and outbound product shipments — pipeline, rail, and truck."

- KPI cards for shipment volume and on-time rates
- Active shipment table with status tracking
- Route and carrier details

---

## 6. Reports & Analytics

**Sidebar:** Reports

> "The analytics page is where engineers dig into optimization performance over time."

- KPI summary cards
- **Constraint Bar Chart** — recurring constraint patterns (which constraints fire most often)
- **Drift Chart** — predicted vs. actual values with drift detection
- **Sensor Health Matrix** — unit-by-sensor grid showing health status (green/amber/red)
- **Waterfall Chart** — margin captured vs. opportunity with time range toggle (30d / 90d / YTD)

---

## 7. Assets

**Header tab:** Assets

> "Asset management tracks the health and maintenance status of every piece of equipment."

**Interactive demo:**
- Click the **filter tabs** (All, Online, Degraded, Offline) to filter the equipment list
- KPI cards show fleet-wide health metrics
- Equipment table with status, last inspection, and next maintenance dates

---

## 8. Compliance

**Header tab:** Compliance

> "Compliance gives a real-time view of regulatory adherence — EPA, OSHA, state permits."

- Overall compliance score with trend
- Compliance items table with status badges
- Upcoming audit schedule and deadline tracking

---

## 9. Risk Assessment

**Sidebar:** Risk Assessment

> "Risk assessment surfaces operational risks ranked by severity and likelihood."

- Risk score KPIs
- Risk matrix visualization
- Active risk items with mitigation status
- Historical risk trend data

---

## 10. Safety

**Header tab:** Safety

> "Safety tracks incidents, near-misses, and key safety metrics across the facility."

- Days without incident, incident rate metrics
- Safety KPI cards with animated values
- Incident log with severity classification
- Safety compliance items

---

## 11. Logs

**Sidebar:** Logs

> "The system log captures every action, recommendation, and event for full auditability."

**Interactive demo:**
1. Click the **type filter pills** (All, System, Optimization, User, Alerts) to filter by category
2. Click the **severity pills** (All, Info, Warning, Error, Critical) to filter by severity
3. Type in the **search box** to filter entries by text
4. Click any **log row** to expand and see full details

---

## 12. Settings

**Sidebar:** Settings (bottom)

> "Settings lets administrators configure system behavior, notification preferences, and integrations."

**Interactive demo:**
- Click through the **tabs** (General, Notifications, Integrations, Security, Advanced) to see different config panels
- Toggle switches and checkboxes are interactive
- Form fields are editable

---

## 13. Support

**Sidebar:** Support (bottom)

> "Finally, the support page gives operators self-service help and a direct line to the team."

**Interactive demo:**
1. Click any **FAQ question** to expand the answer (accordion)
2. Fill out the **support ticket form** and click Submit — shows success confirmation
3. Review **system status** panel showing service health
4. Browse **documentation links** for training materials

---

## 14. User Menu

> "One last thing — the user menu."

- Click the **JM avatar** in the top-right corner of the header
- Dropdown shows **Profile** (goes to Settings) and **Sign Out** (returns to Login)

---

## Closing

> "That's Reflex — real-time optimization recommendations, full operational visibility, and complete auditability. All running in shadow mode to build trust before going live. Questions?"
