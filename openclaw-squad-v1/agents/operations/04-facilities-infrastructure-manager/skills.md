# SKILLS — Facilities & Infrastructure Manager

## Skill Tier Model
Tools organized by the Facilities Manager's infrastructure responsibilities.

---

## Tier 1 — Always Active (Core Infrastructure)

### 1.1 Infrastructure Health Monitor
- **Tool:** `monitor_infrastructure(system_id | "all", metrics[], alert_thresholds)`
- **Why:** Continuous infrastructure monitoring prevents outages and ensures uptime.

### 1.2 Maintenance Scheduler
- **Tool:** `schedule_maintenance(asset_id, type, date, duration, impact_assessment)`
- **Why:** Preventive maintenance keeps infrastructure reliable and extends lifecycle.

### 1.3 Equipment Lifecycle Tracker
- **Tool:** `track_equipment(asset_id | "all", status, lifecycle_stage)`
- **Why:** Full lifecycle visibility from procurement to decommissioning.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="ops-dashboard.md", section, content, tags[])`
- **Why:** All infrastructure status must flow into shared memory for squad access.

### 1.5 Incident Response Coordinator
- **Tool:** `respond_incident(incident_type, severity, affected_systems[], runbook_ref)`
- **Why:** Rapid, structured incident response minimizes downtime and impact.

---

## Tier 2 — Conditionally Active

### 2.1 Capacity Planner
- **Tool:** `plan_capacity(system_id, current_usage, projected_growth, timeline)`
- **Why:** Proactive capacity planning prevents infrastructure bottlenecks.

### 2.2 Continuity Plan Manager
- **Tool:** `manage_continuity_plan(plan_id, action="review"|"activate"|"test")`
- **Why:** Business continuity plans must be current and tested regularly.

### 2.3 Report Generator
- **Tool:** `generate_report(type, data, format, audience)`
- **Why:** Structures infrastructure data into consumable briefs for the squad.

---

## Tier 3 — Restricted

### 3.1 Infrastructure Purchase Requester
- **Tool:** `request_infrastructure_purchase(item, justification, cost, vendor)`
- **Why:** Major infrastructure purchases require Ops Lead approval and
  Vendor Procurement coordination.

---

## Skill Anti-Patterns
The Facilities Manager does **NOT** have:
- `approve_operational_change()` — Ops Lead's domain
- `negotiate_vendor_contract()` — Vendor Procurement's domain
- `redesign_process()` — Process Specialist's domain

## Sources & Inspirations
- OpenClaw operations squad tool-access model
