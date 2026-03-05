# SKILLS — Data Engineer

## Skill Tier Model
Tools organized by the Data Engineer's pipeline and infrastructure responsibilities.

---

## Tier 1 — Always Active (Core Pipeline)

### 1.1 Pipeline Builder
- **Tool:** `build_pipeline(source, transformations[], destination, schedule)`
- **Why:** Core function — designing and deploying ETL/ELT workflows.

### 1.2 Data Quality Validator
- **Tool:** `validate_data(dataset, schema, quality_rules[], threshold)`
- **Why:** Every dataset must pass quality checks before downstream consumption.

### 1.3 Pipeline Monitor
- **Tool:** `monitor_pipeline(pipeline_id, metrics[], alert_thresholds)`
- **Why:** Continuous monitoring ensures uptime SLAs are met.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="data-catalog.md"|"pipeline-status.md", section, content, tags[])`
- **Why:** All pipeline states and data source documentation flow into shared memory.

### 1.5 Schema Manager
- **Tool:** `manage_schema(table, action="create"|"alter"|"validate", definition)`
- **Why:** Schema integrity is the foundation of reliable data infrastructure.

---

## Tier 2 — Conditionally Active

### 2.1 Source Connector
- **Tool:** `connect_source(source_type, credentials, config, test_mode)`
- **Why:** New data source integrations require structured onboarding.

### 2.2 Performance Optimizer
- **Tool:** `optimize_pipeline(pipeline_id, bottleneck, strategy)`
- **Why:** Keeps pipeline performance within acceptable latency bounds.

### 2.3 Incident Responder
- **Tool:** `respond_to_incident(pipeline_id, error, diagnosis, fix)`
- **Why:** Pipeline failures require immediate triage and resolution.

---

## Tier 3 — Restricted

### 3.1 Infrastructure Scaler
- **Tool:** `request_infrastructure(resource_type, justification, cost)`
- **Why:** Compute and storage scaling requires Analytics Lead approval.

---

## Skill Anti-Patterns
The Data Engineer does **NOT** have:
- `approve_analysis()` — Analytics Lead's domain
- `create_dashboard()` — Reporting Specialist's domain
- `train_model()` — Data Scientist's domain

## Sources & Inspirations
- OpenClaw data analytics squad tool-access model
