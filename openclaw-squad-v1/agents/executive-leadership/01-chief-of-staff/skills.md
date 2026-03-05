# SKILLS — Chief of Staff

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Chief of Staff's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Initiative Router
- **Tool:** `route_initiative(task, target_role, priority, context)`
- **Why:** The Chief of Staff's primary function is decomposing executive work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Governance Alignment Checker
- **Tool:** `check_governance_alignment(directive, governance_framework_ref)`
- **Why:** Every outbound directive must pass governance review before delivery.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every executive decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Executive leadership must coordinate with all departments
  via @agentname tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (strategic-plan.md, executive-briefing.md,
  board-calendar.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Resource Allocator
- **Tool:** `allocate_resources(initiative_id, department, amount, justification)`
- **Why:** Distributes executive budget and resources across initiatives.

### 2.2 Priority Override
- **Tool:** `override_priority(task_id, new_priority, justification)`
- **Why:** When organizational conditions shift, the Chief of Staff must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When specialists disagree on approach, the Chief of Staff arbitrates.

### 2.4 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed Chief of Staff authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Commitment Requester
- **Tool:** `request_external_commitment(commitment, justification, risk_assessment)`
- **Why:** New external commitments require Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Chief of Staff explicitly does **NOT** have:
- `draft_strategic_plan()` — that is the Strategic Planner's domain
- `compose_executive_speech()` — that is Executive Communications' domain
- `prepare_board_materials()` — that is the Board Relations Specialist's domain
- `run_department_operations()` — that is each department lead's domain

## Sources & Inspirations
- OpenClaw executive leadership squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
