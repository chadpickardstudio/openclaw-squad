# SKILLS — Compliance Auditor

## Skill Tier Model
Tools organized by the Compliance Auditor's regulatory compliance and
internal audit responsibilities.

---

## Tier 1 — Always Active (Core Compliance)

### 1.1 Audit Executor
- **Tool:** `execute_audit(audit_type, scope, period, checklist[], evidence_refs[])`
- **Why:** Core function — conducting internal audits of financial processes and controls.

### 1.2 Compliance Checker
- **Tool:** `check_compliance(process_id, regulation_ref, evidence, status)`
- **Why:** Systematic verification of compliance with applicable regulations.

### 1.3 Risk Assessor
- **Tool:** `assess_risk(area, likelihood, impact, controls[], mitigation[])`
- **Why:** Proactive risk identification and assessment drives preventive compliance.

### 1.4 Audit Trail Verifier
- **Tool:** `verify_audit_trail(transaction_ids[], completeness, accuracy, gaps[])`
- **Why:** Complete and accurate audit trails are the foundation of compliance.

### 1.5 Compliance Report Generator
- **Tool:** `generate_compliance_report(type, period, findings[], status, recommendations[])`
- **Why:** Structured compliance reporting is the primary output to @finance-lead.

---

## Tier 2 — Conditionally Active

### 2.1 Regulatory Monitor
- **Tool:** `monitor_regulations(jurisdiction, categories[], alert_threshold)`
- **Why:** Staying current on regulatory changes prevents compliance gaps.

### 2.2 Remediation Tracker
- **Tool:** `track_remediation(finding_id, action_items[], owners[], deadlines[], status)`
- **Why:** Ensuring audit findings are resolved within defined timeframes.

### 2.3 Control Effectiveness Evaluator
- **Tool:** `evaluate_controls(process_id, controls[], test_results[], effectiveness)`
- **Why:** Assessing whether internal controls are working as designed.

---

## Tier 3 — Restricted

### 3.1 External Audit Coordinator
- **Tool:** `coordinate_external_audit(auditor, scope, timeline, documents[])`
- **Why:** External audit coordination requires Finance Lead oversight.

### 3.2 Compliance Policy Proposer
- **Tool:** `propose_policy(policy_area, proposed_text, justification, regulation_ref)`
- **Why:** New compliance policies require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Compliance Auditor does **NOT** have:
- `approve_budget()` — Finance Lead's domain
- `process_transaction()` — Accounts Specialist's domain
- `run_financial_analysis()` — Financial Analyst's domain
- `set_budget_allocation()` — Budget Controller's domain

## Sources & Inspirations
- OpenClaw finance squad tool-access model
