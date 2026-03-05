# SKILLS — Supply Chain Coordinator

## Skill Tier Model
Tools organized by the Supply Chain Coordinator's logistics responsibilities.

---

## Tier 1 — Always Active (Core Logistics)

### 1.1 Inventory Tracker
- **Tool:** `track_inventory(item_id | "all", location, threshold_alerts)`
- **Why:** Real-time inventory visibility prevents stockouts and overstock.

### 1.2 Fulfillment Monitor
- **Tool:** `monitor_fulfillment(order_id | "all", status_filter, sla_check)`
- **Why:** Continuous fulfillment tracking ensures delivery SLA compliance.

### 1.3 Demand Forecaster
- **Tool:** `forecast_demand(product_category, timeframe, data_sources[])`
- **Why:** Accurate demand forecasting drives optimal inventory planning.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="ops-dashboard.md", section, content, tags[])`
- **Why:** All logistics findings must flow into shared memory for squad access.

### 1.5 Supplier Communicator
- **Tool:** `communicate_supplier(supplier_id, message, priority, context)`
- **Why:** Day-to-day supplier coordination via structured communications.

---

## Tier 2 — Conditionally Active

### 2.1 Disruption Response Coordinator
- **Tool:** `respond_disruption(disruption_type, affected_orders[], contingency_plan)`
- **Why:** Rapid response to supply chain disruptions minimizes impact.

### 2.2 Logistics Cost Analyzer
- **Tool:** `analyze_logistics_cost(route, carrier, volume, comparison_baseline)`
- **Why:** Identifies cost optimization opportunities in shipping and logistics.

### 2.3 Report Generator
- **Tool:** `generate_report(type, data, format, audience)`
- **Why:** Structures logistics data into consumable briefs for the squad.

---

## Tier 3 — Restricted

### 3.1 Supplier Escalation Requester
- **Tool:** `request_supplier_escalation(supplier_id, issue, justification)`
- **Why:** Supplier relationship changes require Ops Lead and Vendor
  Procurement coordination.

---

## Skill Anti-Patterns
The Supply Chain Coordinator does **NOT** have:
- `approve_operational_change()` — Ops Lead's domain
- `negotiate_vendor_contract()` — Vendor Procurement's domain
- `redesign_process()` — Process Specialist's domain

## Sources & Inspirations
- OpenClaw operations squad tool-access model
