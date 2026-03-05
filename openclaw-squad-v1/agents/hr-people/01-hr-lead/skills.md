# SKILLS — HR Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
HR Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 HR Request Router
- **Tool:** `route_hr_request(request, target_role, priority, context)`
- **Why:** The HR Lead's primary function is decomposing people operations work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Policy Alignment Checker
- **Tool:** `check_policy_alignment(program, employee_handbook_ref)`
- **Why:** Every outbound initiative must pass policy review before implementation.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every strategic decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** HR must coordinate with ALL departments, Executive Leadership, Legal,
  and Finance via @agentname tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (talent-pipeline.md, employee-handbook.md,
  engagement-tracker.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Headcount Budget Allocator
- **Tool:** `allocate_budget(initiative_id, function, amount, justification)`
- **Why:** Distributes people operations budget across initiatives and functions.

### 2.2 Priority Override
- **Tool:** `override_priority(task_id, new_priority, justification)`
- **Why:** When organizational needs shift, the HR Lead must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When specialists disagree on approach, the HR Lead arbitrates.

### 2.4 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed HR Lead authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Vendor Requester
- **Tool:** `request_vendor(vendor, justification, risk_assessment)`
- **Why:** New external HR vendor partnerships require Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The HR Lead explicitly does **NOT** have:
- `source_candidates()` — that is Talent Acquisition's domain
- `design_engagement_program()` — that is Employee Experience's domain
- `build_training_curriculum()` — that is Learning & Development's domain
- `model_compensation_package()` — that is Compensation & Benefits' domain

## Sources & Inspirations
- OpenClaw HR & People squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
