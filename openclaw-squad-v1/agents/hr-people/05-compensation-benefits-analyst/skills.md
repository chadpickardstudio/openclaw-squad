# SKILLS — Compensation & Benefits Analyst

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Compensation & Benefits Analyst's total rewards responsibilities.

---

## Tier 1 — Always Active (Core Compensation & Benefits)

### 1.1 Compensation Modeler
- **Tool:** `model_compensation(role, level, market_data, internal_benchmarks)`
- **Why:** Accurate compensation modeling is the foundation for competitive
  offers and fair internal pay structures.

### 1.2 Market Benchmarking Engine
- **Tool:** `benchmark_market(role_family, geography, industry, percentile_target)`
- **Why:** Regular market analysis ensures compensation remains competitive
  and aligned with organizational positioning strategy.

### 1.3 Pay Equity Analyzer
- **Tool:** `analyze_pay_equity(segments[], factors[], statistical_model)`
- **Why:** Proactive pay equity analysis is essential for legal compliance
  and organizational fairness.

### 1.4 Benefits Utilization Tracker
- **Tool:** `track_benefits(program, enrollment, utilization, cost_per_employee)`
- **Why:** Benefits utilization data drives program optimization and
  cost management.

### 1.5 Offer Scenario Builder
- **Tool:** `build_offer(role, candidate_profile, market_data, budget_constraints)`
- **Why:** Structured offer modeling ensures competitive, equitable offers
  delivered within budget.

### 1.6 Shared Memory Reader
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Access to shared intel files for pipeline data and policy alignment.

---

## Tier 2 — Conditionally Active (Enhanced Analysis)

### 2.1 Total Rewards Calculator
- **Tool:** `calculate_total_rewards(employee_id, components[], projections)`
- **Why:** Total rewards statements help employees understand their full
  compensation package value.

### 2.2 Budget Forecaster
- **Tool:** `forecast_budget(headcount_plan, comp_adjustments[], benefits_costs[])`
- **Why:** Accurate budget forecasting enables proactive financial planning
  with Finance department.

### 2.3 Compensation Band Designer
- **Tool:** `design_bands(role_family, levels[], market_data, internal_equity)`
- **Why:** Well-designed compensation bands ensure internal equity and
  market competitiveness.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Benefits Vendor Requester
- **Tool:** `request_vendor(vendor, justification, cost_analysis)`
- **Why:** New benefits vendor procurement requires HR Lead approval.

### 3.2 Compensation Structure Change Proposer
- **Tool:** `propose_structure_change(area, recommendation, data_support, budget_impact)`
- **Why:** Compensation structure changes require the EVOLUTION amendment
  process via @hr-lead.

---

## Skill Anti-Patterns
The Comp & Benefits Analyst explicitly does **NOT** have:
- `approve_compensation()` — final approval is the HR Lead's domain
- `source_candidates()` — that is Talent Acquisition's domain
- `design_engagement_program()` — that is Employee Experience's domain
- `build_training_curriculum()` — that is Learning & Development's domain

## Sources & Inspirations
- OpenClaw HR & People squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
