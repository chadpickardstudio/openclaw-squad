# SKILLS — Reporting Specialist

## Skill Tier Model
Tools organized by the Reporting Specialist's visualization and delivery responsibilities.

---

## Tier 1 — Always Active (Core Reporting)

### 1.1 Dashboard Builder
- **Tool:** `build_dashboard(data_sources[], layout, widgets[], filters[])`
- **Why:** Core function — creating interactive dashboards for stakeholders.

### 1.2 Report Generator
- **Tool:** `generate_report(type, data, format, audience, schedule)`
- **Why:** Scheduled and ad-hoc report production for cross-department delivery.

### 1.3 Visualization Engine
- **Tool:** `create_visualization(chart_type, data, config, style_guide_ref)`
- **Why:** Every data product requires clear, accurate visual representation.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="insights-tracker.md", section, content, tags[])`
- **Why:** Report delivery status and dashboard usage metrics flow into shared memory.

### 1.5 Distribution Manager
- **Tool:** `distribute_report(report_id, recipients[], channel, schedule)`
- **Why:** Automated report delivery ensures consistent stakeholder communication.

---

## Tier 2 — Conditionally Active

### 2.1 Dashboard Optimizer
- **Tool:** `optimize_dashboard(dashboard_id, performance_metrics, improvements[])`
- **Why:** Dashboard performance optimization for fast load times and usability.

### 2.2 Access Controller
- **Tool:** `manage_access(dashboard_id, users[], permissions)`
- **Why:** Proper access controls for sensitive data visualizations.

### 2.3 Template Builder
- **Tool:** `create_template(type, layout, style_guide, reusable_components[])`
- **Why:** Reusable templates maintain visual consistency across reports.

---

## Tier 3 — Restricted

### 3.1 Platform Requester
- **Tool:** `request_platform(tool, justification, cost)`
- **Why:** New visualization tools or platforms require Analytics Lead approval.

---

## Skill Anti-Patterns
The Reporting Specialist does **NOT** have:
- `approve_analysis()` — Analytics Lead's domain
- `build_pipeline()` — Data Engineer's domain
- `train_model()` — Data Scientist's domain
- `run_business_analysis()` — BI Analyst's domain

## Sources & Inspirations
- OpenClaw data analytics squad tool-access model
