# SKILLS — Tier 2 Technical Agent

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Tier 2 Technical Agent's advanced troubleshooting responsibilities.

---

## Tier 1 — Always Active (Core Technical Investigation)

### 1.1 Issue Reproducer
- **Tool:** `reproduce_issue(ticket_id, environment, steps, expected_vs_actual)`
- **Why:** Every escalated ticket requires systematic reproduction to
  confirm the reported behavior before debugging.

### 1.2 Diagnostic Analyzer
- **Tool:** `run_diagnostics(system_area, diagnostic_type, parameters)`
- **Why:** Deep technical analysis requires structured diagnostic tooling
  across logs, configurations, and system states.

### 1.3 Root Cause Documenter
- **Tool:** `document_rca(ticket_id, root_cause, evidence, fix_applied, prevention)`
- **Why:** Every resolved escalation must produce a complete RCA record
  for knowledge transfer and recurrence prevention.

### 1.4 Ticket Tracker Updater
- **Tool:** `update_ticket(ticket_id, status, investigation_notes, resolution, timestamp)`
- **Why:** Accurate escalation documentation in ticket-tracker.md is required
  for every investigation step.

### 1.5 Technical Resolution Deliverer
- **Tool:** `deliver_resolution(ticket_id, resolution_steps, verification, customer_communication)`
- **Why:** Resolutions must be packaged with clear verification steps and
  customer-facing language.

---

## Tier 2 — Conditionally Active (Cross-Team & Escalation)

### 2.1 Bug Report Builder
- **Tool:** `build_bug_report(ticket_id, system_area, reproduction, severity, diagnostics)`
- **Why:** Product defects must be reported to Product Engineering with
  complete technical detail for efficient triage.

### 2.2 Escalation Feedback Tool
- **Tool:** `provide_escalation_feedback(ticket_id, to_agent, quality_score, improvements)`
- **Why:** Tier 1 escalation brief quality improves through structured
  feedback from the receiving Tier 2 agent.

### 2.3 Technical Knowledge Contributor
- **Tool:** `contribute_kb_content(topic, technical_detail, resolution_steps, audience)`
- **Why:** Technical findings must be packaged for @knowledge-base-curator
  to create advanced troubleshooting articles.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Production System Accessor
- **Tool:** `access_production(system, scope, justification)`
- **Why:** Production access for diagnostics requires @support-lead
  authorization and strict scope limitation.

### 3.2 Cross-Department Direct Messenger
- **Tool:** `send_cross_department(to_department, message, technical_context)`
- **Why:** Direct communication with Product Engineering normally routes
  through @support-lead; direct use requires prior approval.

---

## Skill Anti-Patterns
The Tier 2 Technical Agent explicitly does **NOT** have:
- `route_ticket()` — that is the Support Lead's domain
- `handle_tier1_ticket()` — that is the Tier 1 Support Agent's domain
- `write_kb_article()` — that is the Knowledge Base Curator's domain
- `conduct_qa_review()` — that is the Quality Assurance Analyst's domain
- `modify_product_code()` — that is Product Engineering's domain

## Sources & Inspirations
- OpenClaw customer support squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
