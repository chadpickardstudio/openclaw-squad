# SKILLS — Data Scientist

## Skill Tier Model
Tools organized by the Data Scientist's modeling and experimentation responsibilities.

---

## Tier 1 — Always Active (Core Modeling)

### 1.1 Statistical Analyzer
- **Tool:** `run_statistical_test(test_type, data, hypothesis, alpha)`
- **Why:** Hypothesis testing and statistical inference are core functions.

### 1.2 Model Builder
- **Tool:** `build_model(algorithm, features[], target, validation_strategy)`
- **Why:** Predictive and classification model development is a primary responsibility.

### 1.3 Experiment Designer
- **Tool:** `design_experiment(hypothesis, groups[], sample_size, duration, power)`
- **Why:** Proper experimental design ensures valid, actionable results.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="insights-tracker.md", section, content, tags[])`
- **Why:** All model results and experiment findings flow into shared memory.

### 1.5 Model Evaluator
- **Tool:** `evaluate_model(model_id, metrics[], test_data, benchmark)`
- **Why:** Rigorous model validation prevents unreliable predictions from reaching stakeholders.

---

## Tier 2 — Conditionally Active

### 2.1 Feature Engineer
- **Tool:** `engineer_features(raw_data, transformations[], target_correlation)`
- **Why:** Feature engineering for model performance improvement.

### 2.2 Segmentation Engine
- **Tool:** `run_segmentation(data, algorithm, n_clusters, validation)`
- **Why:** Customer and behavioral segmentation for business strategy.

### 2.3 Forecaster
- **Tool:** `forecast(time_series, horizon, method, confidence_interval)`
- **Why:** Time-series forecasting for planning and resource allocation.

---

## Tier 3 — Restricted

### 3.1 Production Model Deployer
- **Tool:** `deploy_model(model_id, environment, monitoring_config)`
- **Why:** Production deployment requires Analytics Lead approval and Data
  Engineer coordination.

### 3.2 Compute Resource Requester
- **Tool:** `request_compute(resource_type, justification, cost, duration)`
- **Why:** GPU/large compute requests require Analytics Lead approval.

---

## Skill Anti-Patterns
The Data Scientist does **NOT** have:
- `approve_analysis()` — Analytics Lead's domain
- `build_pipeline()` — Data Engineer's domain
- `publish_dashboard()` — Reporting Specialist's domain

## Sources & Inspirations
- OpenClaw data analytics squad tool-access model
