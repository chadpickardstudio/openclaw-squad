# SKILLS — Budget Controller

## Skill Tier Model
Tools organized by the Budget Controller's budget management and
cost control responsibilities.

---

## Tier 1 — Always Active (Core Budget Management)

### 1.1 Budget Tracker
- **Tool:** `track_budget(department, category, period, allocated, spent, remaining)`
- **Why:** Core function — real-time visibility into budget utilization across the organization.

### 1.2 Variance Reporter
- **Tool:** `report_variance(budget_ref, actuals_ref, period, threshold, categories[])`
- **Why:** Identifying budget-to-actual variances is the primary control mechanism.

### 1.3 Budget Request Evaluator
- **Tool:** `evaluate_request(department, amount, category, justification, priority)`
- **Why:** Systematic evaluation of incoming budget requests with cost-benefit analysis.

### 1.4 Cost Optimizer
- **Tool:** `identify_savings(department, category, period, analysis_type)`
- **Why:** Proactive cost reduction drives organizational financial health.

### 1.5 Forecast Updater
- **Tool:** `update_forecast(budget_ref, actuals_to_date, projections, assumptions[])`
- **Why:** Rolling forecasts keep budget plans aligned with reality.

---

## Tier 2 — Conditionally Active

### 2.1 Budget Planner
- **Tool:** `build_budget(department, period, categories[], targets[], constraints[])`
- **Why:** Annual and quarterly budget planning with strategic alignment.

### 2.2 Cost-Benefit Analyzer
- **Tool:** `analyze_cost_benefit(proposal, costs[], benefits[], period, discount_rate)`
- **Why:** Data-driven evaluation of investment proposals and initiatives.

### 2.3 Department Budget Advisor
- **Tool:** `advise_department(department, budget_status, recommendations[], context)`
- **Why:** Proactive budget guidance prevents overspend and misallocation.

---

## Tier 3 — Restricted

### 3.1 Budget Reallocation Requester
- **Tool:** `request_reallocation(from_dept, to_dept, amount, justification)`
- **Why:** Cross-department budget moves require Finance Lead approval.

### 3.2 Budget Policy Amendment Proposer
- **Tool:** `propose_policy_change(policy_id, proposed_change, justification)`
- **Why:** Budget policy changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Budget Controller does **NOT** have:
- `approve_budget()` — Finance Lead's domain (final approval)
- `process_transaction()` — Accounts Specialist's domain
- `run_financial_analysis()` — Financial Analyst's domain
- `execute_compliance_audit()` — Compliance Auditor's domain

## Sources & Inspirations
- OpenClaw finance squad tool-access model
