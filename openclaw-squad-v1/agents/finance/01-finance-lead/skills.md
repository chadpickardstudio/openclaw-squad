# SKILLS — Finance Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Finance Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Financial Task Router
- **Tool:** `route_financial_task(task, target_role, priority, context)`
- **Why:** The Finance Lead's primary function is decomposing financial work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Financial Approval Gate
- **Tool:** `check_financial_alignment(deliverable, policy_ref, budget_ref)`
- **Why:** Every outbound financial artifact must pass quality review before delivery.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every financial decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Finance must coordinate with all departments, Executive Leadership,
  Legal, and Operations via @agentname tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (financial-dashboard.md, budget-tracker.md,
  compliance-log.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Budget Allocation Approver
- **Tool:** `approve_budget(department, amount, category, justification)`
- **Why:** Distributes and approves budgets across departments and initiatives.

### 2.2 Priority Override
- **Tool:** `override_priority(task_id, new_priority, justification)`
- **Why:** When financial conditions shift, the Finance Lead must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When Budget Controller and Financial Analyst disagree on approach,
  the Finance Lead arbitrates.

### 2.4 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed Finance Lead authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Vendor Approver
- **Tool:** `request_vendor_agreement(vendor, justification, risk_assessment)`
- **Why:** New vendor agreements require Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Finance Lead explicitly does **NOT** have:
- `run_financial_analysis()` — that is the Financial Analyst's domain
- `process_transaction()` — that is the Accounts Specialist's domain
- `manage_budget_line_items()` — that is the Budget Controller's domain
- `execute_compliance_audit()` — that is the Compliance Auditor's domain

## Sources & Inspirations
- OpenClaw finance squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
