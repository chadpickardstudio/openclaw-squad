# SKILLS — Operations Lead

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Ops Lead's orchestration responsibilities.

---

## Tier 1 — Always Active (Core Orchestration)

### 1.1 Operational Task Router
- **Tool:** `route_ops_task(task, target_role, priority, context)`
- **Why:** The Ops Lead's primary function is decomposing operational work
  and routing it to the right specialist.

### 1.2 Squad Status Aggregator
- **Tool:** `collect_status(role_id | "all", depth="summary"|"detail")`
- **Why:** Real-time visibility into squad progress for informed prioritization.

### 1.3 Process Compliance Checker
- **Tool:** `check_process_compliance(deliverable, process_playbook_ref)`
- **Why:** Every operational output must pass process review before delivery.

### 1.4 Decision Logger
- **Tool:** `log_decision(decision, rationale, affected_roles[], timestamp)`
- **Why:** Every operational decision must be auditable and traceable.

### 1.5 Cross-Department Messenger
- **Tool:** `send_message(from_role, to_department, message, priority)`
- **Why:** Operations must coordinate with ALL departments via @agentname
  tagging on Telegram/Slack.

### 1.6 Shared Memory Manager
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains shared intel files (ops-dashboard.md, vendor-registry.md,
  process-playbook.md) that the entire squad references.

---

## Tier 2 — Conditionally Active (Authority Tools)

### 2.1 Operational Budget Allocator
- **Tool:** `allocate_budget(project_id, category, amount, justification)`
- **Why:** Distributes operational budget across projects and vendors.

### 2.2 Priority Override
- **Tool:** `override_priority(task_id, new_priority, justification)`
- **Why:** When operational conditions shift, the Ops Lead must re-rank priorities.

### 2.3 Conflict Arbiter
- **Tool:** `resolve_conflict(role_a, role_b, issue, decision, rationale)`
- **Why:** When specialists disagree on approach, the Ops Lead arbitrates.

### 2.4 Escalation Channel
- **Tool:** `escalate_to_human(issue, context, options[], recommendation)`
- **Why:** Packages issues that exceed Ops Lead authority for Human Principal.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Vendor Partnership Requester
- **Tool:** `request_vendor_partnership(vendor, justification, risk_assessment)`
- **Why:** New vendor partnerships above budget threshold require Human
  Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Ops Lead explicitly does **NOT** have:
- `optimize_process()` — that is the Process Optimization Specialist's domain
- `manage_supply_chain()` — that is the Supply Chain Coordinator's domain
- `manage_facilities()` — that is the Facilities & Infrastructure Manager's domain
- `negotiate_vendor_contract()` — that is the Vendor & Procurement Specialist's domain

## Sources & Inspirations
- OpenClaw operations squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
