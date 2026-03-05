# SKILLS — Legal Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Legal Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Legal Task Router
- **Tool:** `route_legal_task(task, target_role, priority, context)`
- **Why:** The Legal Lead's primary function is decomposing legal work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Legal Risk Assessor
- **Tool:** `assess_legal_risk(matter, risk_factors[], severity, likelihood)`
- **Why:** Every legal matter must have a risk assessment before action.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every legal decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Legal must coordinate with all departments via @agentname
  tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (contract-registry.md,
  regulatory-tracker.md, legal-risk-log.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Matter Priority Override
- **Tool:** `override_priority(matter_id, new_priority, justification)`
- **Why:** When legal deadlines shift or regulatory urgency arises, the
  Legal Lead must re-rank priorities.

### 2.2 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When specialists disagree on legal interpretation or approach,
  the Legal Lead arbitrates.

### 2.3 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed Legal Lead authority for Human Principal.

### 2.4 Legal Opinion Approver
- **Tool:** `approve_legal_opinion(matter_id, opinion, risk_level, conditions[])`
- **Why:** All outbound legal opinions must pass the Legal Lead's quality gate.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Counsel Requester
- **Tool:** `request_external_counsel(matter, justification, risk_assessment)`
- **Why:** Engaging outside counsel requires Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Legal Lead explicitly does **NOT** have:
- `draft_contract()` — that is the Contract Specialist's domain
- `conduct_regulatory_audit()` — that is the Regulatory Compliance Officer's domain
- `perform_ip_search()` — that is the IP & Data Privacy Counsel's domain
- `draft_privacy_impact_assessment()` — that is the IP & Data Privacy Counsel's domain

## Sources & Inspirations
- OpenClaw legal-compliance squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
