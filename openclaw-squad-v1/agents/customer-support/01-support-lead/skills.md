# SKILLS — Support Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Support Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Ticket Router
- **Tool:** `route_ticket(ticket_id, target_role, priority, context)`
- **Why:** The Support Lead's primary function is triaging inbound tickets
  and routing them to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 SLA Monitor
- **Tool:** `check_sla(ticket_id | "all", sla_thresholds)`
- **Why:** Every ticket must be tracked against SLA targets for timely resolution.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every triage and escalation decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Support must coordinate with Product Engineering, Customer Success,
  and Sales via @agentname tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_memory(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared files (ticket-tracker.md, knowledge-base-index.md,
  escalation-playbook.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Escalation Controller
- **Tool:** `escalate_ticket(ticket_id, from_tier, to_tier, justification)`
- **Why:** Manages the escalation pipeline between Tier 1 and Tier 2 agents.

### 2.2 Priority Override
- **Tool:** `override_priority(ticket_id, new_priority, justification)`
- **Why:** When incident severity changes, the Support Lead must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When agents disagree on resolution approach, the Support Lead arbitrates.

### 2.4 Escalation to Human
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed Support Lead authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Policy Amendment Requester
- **Tool:** `request_policy_change(policy_area, justification, risk_assessment)`
- **Why:** Support policy changes require Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Support Lead explicitly does **NOT** have:
- `resolve_tier2_issue()` — that is the Tier 2 Technical Agent's domain
- `write_kb_article()` — that is the Knowledge Base Curator's domain
- `conduct_qa_review()` — that is the Quality Assurance Analyst's domain
- `handle_tier1_ticket()` — that is the Tier 1 Support Agent's domain

## Sources & Inspirations
- OpenClaw customer support squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
