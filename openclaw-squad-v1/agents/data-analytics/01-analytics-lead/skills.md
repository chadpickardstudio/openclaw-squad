# SKILLS — Analytics Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Analytics Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Analytics Router
- **Tool:** `route_analytics_task(task, target_role, priority, context)`
- **Why:** The Analytics Lead's primary function is decomposing analytics work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Data Quality Checker
- **Tool:** `check_data_quality(deliverable, quality_standards_ref)`
- **Why:** Every outbound deliverable must pass data quality review before delivery.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every strategic decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Data Analytics must coordinate with Product Engineering, Marketing,
  Finance, and other departments via @agentname tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (data-catalog.md, pipeline-status.md,
  insights-tracker.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Pipeline Priority Allocator
- **Tool:** `allocate_pipeline_priority(pipeline_id, priority, justification)`
- **Why:** Distributes compute and pipeline capacity across analytics workstreams.

### 2.2 Priority Override
- **Tool:** `override_priority(task_id, new_priority, justification)`
- **Why:** When business conditions shift, the Analytics Lead must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When Data Scientist and BI Analyst disagree on methodology,
  the Analytics Lead arbitrates.

### 2.4 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed Analytics Lead authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Data Source Requester
- **Tool:** `request_data_source(source, justification, cost, risk_assessment)`
- **Why:** New external data integrations require Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Analytics Lead explicitly does **NOT** have:
- `build_pipeline()` — that is the Data Engineer's domain
- `create_dashboard()` — that is the Reporting Specialist's domain
- `train_model()` — that is the Data Scientist's domain
- `run_sql_query()` — that is the BI Analyst's domain

## Sources & Inspirations
- OpenClaw data analytics squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
