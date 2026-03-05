# SKILLS — Customer Success Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
CS Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Client Lifecycle Router
- **Tool:** `route_client_task(task, target_role, priority, context)`
- **Why:** The CS Lead's primary function is decomposing client work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Client Health Checker
- **Tool:** `check_client_health(client_id, health_tracker_ref)`
- **Why:** Every client interaction must be informed by current health scores.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every strategic decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Customer Success must coordinate with Sales, Product Engineering,
  and Marketing via @agentname tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (client-health-tracker.md,
  onboarding-playbook.md, retention-intel.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Client Escalation Manager
- **Tool:** `manage_escalation(client_id, severity, context, resolution_plan)`
- **Why:** High-severity client issues require orchestrated multi-role response.

### 2.2 Priority Override
- **Tool:** `override_priority(task_id, new_priority, justification)`
- **Why:** When client situations shift, the CS Lead must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When specialists disagree on client approach, the CS Lead arbitrates.

### 2.4 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed CS Lead authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Contract Amendment Requester
- **Tool:** `request_contract_change(client_id, justification, risk_assessment)`
- **Why:** Contract modifications require Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The CS Lead explicitly does **NOT** have:
- `execute_onboarding_workflow()` — that is the Onboarding Specialist's domain
- `run_retention_analysis()` — that is the Retention Strategist's domain
- `resolve_technical_ticket()` — that is the Technical Support Engineer's domain
- `conduct_client_advocacy_call()` — that is the Client Advocate's domain

## Sources & Inspirations
- OpenClaw customer success squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
