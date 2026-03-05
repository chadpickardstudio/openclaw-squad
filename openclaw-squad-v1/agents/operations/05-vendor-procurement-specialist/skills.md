# SKILLS — Vendor & Procurement Specialist

## Skill Tier Model
Tools organized by the Procurement Specialist's vendor management responsibilities.

---

## Tier 1 — Always Active (Core Procurement)

### 1.1 Vendor Evaluator
- **Tool:** `evaluate_vendor(vendor_id, criteria[], scoring_model, comparison_set[])`
- **Why:** Structured vendor evaluation ensures objective sourcing decisions.

### 1.2 Contract Analyzer
- **Tool:** `analyze_contract(contract_id, terms[], risk_assessment, benchmark_data)`
- **Why:** Every contract must be analyzed for value, risk, and compliance.

### 1.3 Procurement Workflow Manager
- **Tool:** `manage_procurement(request_id, stage, action, status_update)`
- **Why:** End-to-end procurement tracking from requisition to delivery.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="vendor-registry.md", section, content, tags[])`
- **Why:** All vendor data must flow into shared memory for squad access.

### 1.5 Spend Tracker
- **Tool:** `track_spend(category, vendor_id, amount, budget_ref, period)`
- **Why:** Continuous spend visibility enables cost optimization and budget compliance.

---

## Tier 2 — Conditionally Active

### 2.1 Contract Negotiation Toolkit
- **Tool:** `prepare_negotiation(vendor_id, objectives[], BATNA, market_data)`
- **Why:** Structured negotiation preparation maximizes deal outcomes.

### 2.2 Vendor Performance Scorer
- **Tool:** `score_vendor_performance(vendor_id, sla_metrics[], quality_data[])`
- **Why:** Quantitative vendor performance scoring drives accountability.

### 2.3 Report Generator
- **Tool:** `generate_report(type, data, format, audience)`
- **Why:** Structures procurement data into consumable briefs for the squad.

---

## Tier 3 — Restricted

### 3.1 Vendor Termination Requester
- **Tool:** `request_vendor_termination(vendor_id, justification, risk_assessment)`
- **Why:** Vendor termination requires Ops Lead approval and Legal coordination.

---

## Skill Anti-Patterns
The Procurement Specialist does **NOT** have:
- `approve_operational_change()` — Ops Lead's domain
- `manage_supply_chain()` — Supply Chain Coordinator's domain
- `manage_facilities()` — Facilities Manager's domain

## Sources & Inspirations
- OpenClaw operations squad tool-access model
