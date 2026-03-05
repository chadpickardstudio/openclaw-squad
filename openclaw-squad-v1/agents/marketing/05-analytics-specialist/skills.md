# SKILLS — Analytics Specialist

## Skill Tier Model
Tools organized by the Analytics Specialist's measurement and optimization responsibilities.

---

## Tier 1 — Always Active (Core Analytics)

### 1.1 Performance Analyzer
- **Tool:** `analyze_performance(campaign_id, channels[], metrics[], period)`
- **Why:** Core function — measuring campaign effectiveness across all dimensions.

### 1.2 Dashboard Manager
- **Tool:** `update_dashboard(dashboard_id, data, visualizations[])`
- **Why:** Maintaining real-time visibility into marketing performance.

### 1.3 A/B Test Engine
- **Tool:** `run_ab_test(hypothesis, variants[], metric, sample_size, duration)`
- **Why:** Systematic testing drives continuous optimization.

### 1.4 Anomaly Detector
- **Tool:** `detect_anomaly(metric, threshold, alert_target)`
- **Why:** Early detection of performance drops or unusual patterns.

### 1.5 Report Generator
- **Tool:** `generate_report(type, data, format, audience, recommendations)`
- **Why:** Structured reporting is the primary output to the squad.

---

## Tier 2 — Conditionally Active

### 2.1 Attribution Modeler
- **Tool:** `model_attribution(touchpoints[], model_type, conversion_event)`
- **Why:** Multi-touch attribution for understanding marketing impact.

### 2.2 ROI Calculator
- **Tool:** `calculate_roi(campaign_id, costs, revenue, period)`
- **Why:** Budget justification and investment optimization.

### 2.3 Benchmark Comparator
- **Tool:** `compare_benchmarks(metrics[], internal_data, benchmark_data)`
- **Why:** Context for performance using @marketing-researcher benchmarks.

### 2.4 Forecast Engine
- **Tool:** `forecast_performance(metric, model, period, confidence_interval)`
- **Why:** Predictive insights for campaign planning.

---

## Tier 3 — Restricted

### 3.1 Cross-Department Data Requester
- **Tool:** `request_cross_dept_data(department, data_type, justification)`
- **Why:** Cross-department data access requires Strategist coordination.

---

## Skill Anti-Patterns
The Analytics Specialist does **NOT** have:
- `approve_campaign()` — Strategist's domain
- `create_creative_asset()` — Creative Director's domain
- `publish_content()` — Social Executor's domain

## Sources & Inspirations
- OpenClaw marketing squad tool-access model
