# SKILLS — Business Intelligence Analyst

## Skill Tier Model
Tools organized by the BI Analyst's analytical and insight-generation responsibilities.

---

## Tier 1 — Always Active (Core Analysis)

### 1.1 Query Engine
- **Tool:** `run_query(sql, database, timeout, explain_plan)`
- **Why:** SQL is the primary instrument for business intelligence extraction.

### 1.2 Exploratory Analyzer
- **Tool:** `explore_dataset(dataset, dimensions[], metrics[], filters[])`
- **Why:** Discovering patterns and anomalies requires systematic exploration.

### 1.3 KPI Calculator
- **Tool:** `calculate_kpi(metric_definition, timeframe, segments[], comparisons[])`
- **Why:** Consistent, reliable KPI computation is a core BI function.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="insights-tracker.md", section, content, tags[])`
- **Why:** All analytical findings must flow into shared memory for squad access.

### 1.5 Insight Synthesizer
- **Tool:** `synthesize_insight(findings[], context, audience, format)`
- **Why:** Raw analysis must be distilled into actionable business narratives.

---

## Tier 2 — Conditionally Active

### 2.1 Cohort Analyzer
- **Tool:** `analyze_cohort(cohort_definition, metrics[], timeframe)`
- **Why:** Cohort analysis for retention, conversion, and behavioral patterns.

### 2.2 Funnel Builder
- **Tool:** `build_funnel(steps[], filters[], breakdown_dimensions[])`
- **Why:** Funnel analysis for conversion optimization across departments.

### 2.3 Ad-Hoc Report Generator
- **Tool:** `generate_report(type, data, format, audience)`
- **Why:** Structures analytical findings into consumable formats.

---

## Tier 3 — Restricted

### 3.1 External Data Requester
- **Tool:** `request_external_data(source, justification, cost)`
- **Why:** External data access requires Analytics Lead approval.

---

## Skill Anti-Patterns
The BI Analyst does **NOT** have:
- `approve_analysis()` — Analytics Lead's domain
- `build_pipeline()` — Data Engineer's domain
- `train_model()` — Data Scientist's domain
- `publish_dashboard()` — Reporting Specialist's domain

## Sources & Inspirations
- OpenClaw data analytics squad tool-access model
