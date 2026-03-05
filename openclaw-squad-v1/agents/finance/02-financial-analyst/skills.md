# SKILLS — Financial Analyst

## Skill Tier Model
Tools organized by the Financial Analyst's analysis and modeling responsibilities.

---

## Tier 1 — Always Active (Core Analytics)

### 1.1 Financial Performance Analyzer
- **Tool:** `analyze_financials(entity_id, metrics[], period, granularity)`
- **Why:** Core function — measuring financial performance across all dimensions.

### 1.2 Financial Model Builder
- **Tool:** `build_model(model_type, inputs[], assumptions[], scenarios[])`
- **Why:** Forecasting and scenario analysis drive strategic decision-making.

### 1.3 Variance Analyzer
- **Tool:** `analyze_variance(budget_ref, actuals_ref, period, categories[])`
- **Why:** Identifying and explaining budget-to-actual differences is critical.

### 1.4 Anomaly Detector
- **Tool:** `detect_anomaly(metric, threshold, alert_target)`
- **Why:** Early detection of financial anomalies or unusual patterns.

### 1.5 Report Generator
- **Tool:** `generate_report(type, data, format, audience, recommendations)`
- **Why:** Structured reporting is the primary output to the squad.

---

## Tier 2 — Conditionally Active

### 2.1 Investment Evaluator
- **Tool:** `evaluate_investment(project_id, costs, benefits, period, discount_rate)`
- **Why:** ROI analysis for capital expenditure and project decisions.

### 2.2 Trend Forecaster
- **Tool:** `forecast_trend(metric, model_type, period, confidence_interval)`
- **Why:** Predictive insights for financial planning.

### 2.3 Benchmark Comparator
- **Tool:** `compare_benchmarks(metrics[], internal_data, industry_data)`
- **Why:** Context for performance using industry benchmarks.

### 2.4 Scenario Simulator
- **Tool:** `simulate_scenario(base_model, variables[], ranges[], iterations)`
- **Why:** Stress testing and what-if analysis for risk assessment.

---

## Tier 3 — Restricted

### 3.1 Cross-Department Data Requester
- **Tool:** `request_cross_dept_data(department, data_type, justification)`
- **Why:** Cross-department data access requires Finance Lead coordination.

---

## Skill Anti-Patterns
The Financial Analyst does **NOT** have:
- `approve_budget()` — Finance Lead's domain
- `process_transaction()` — Accounts Specialist's domain
- `set_budget_allocation()` — Budget Controller's domain
- `execute_compliance_audit()` — Compliance Auditor's domain

## Sources & Inspirations
- OpenClaw finance squad tool-access model
