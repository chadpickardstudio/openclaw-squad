# SKILLS — Tier 1 Support Agent

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Tier 1 Support Agent's frontline resolution responsibilities.

---

## Tier 1 — Always Active (Core Resolution)

### 1.1 Ticket Assessor
- **Tool:** `assess_ticket(ticket_id, customer_context, issue_description)`
- **Why:** Every inbound ticket requires initial classification, severity
  confirmation, and customer context verification.

### 1.2 Knowledge Base Searcher
- **Tool:** `search_kb(query, category, filters)`
- **Why:** The majority of Tier 1 resolutions rely on finding and applying
  the correct KB article or approved procedure.

### 1.3 Customer Communicator
- **Tool:** `send_customer_response(ticket_id, message, template_id, tone)`
- **Why:** Every ticket requires customer-facing communication: acknowledgment,
  updates, and resolution delivery.

### 1.4 Ticket Tracker Updater
- **Tool:** `update_ticket(ticket_id, status, notes, resolution, timestamp)`
- **Why:** Accurate ticket documentation in ticket-tracker.md is required
  for every interaction.

### 1.5 Response Template Engine
- **Tool:** `apply_template(template_id, variables, customizations)`
- **Why:** Standardized responses ensure consistency while allowing
  per-customer personalization.

---

## Tier 2 — Conditionally Active (Escalation & Feedback)

### 2.1 Escalation Brief Builder
- **Tool:** `build_escalation_brief(ticket_id, issue_summary, repro_steps, attempted_solutions, customer_impact)`
- **Why:** When Tier 1 scope is exceeded, a structured escalation brief
  must be prepared for @tier2-technical-agent.

### 2.2 KB Gap Reporter
- **Tool:** `report_kb_gap(issue_category, gap_description, ticket_refs[], priority)`
- **Why:** Frontline agents are best positioned to identify missing or
  outdated KB content for @knowledge-base-curator.

### 2.3 QA Submission Tool
- **Tool:** `submit_for_qa(ticket_id, resolution_summary, confidence_level)`
- **Why:** Resolved tickets are submitted to @quality-assurance-analyst
  for quality review before final closure.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Severity Reclassifier
- **Tool:** `reclassify_severity(ticket_id, new_severity, justification)`
- **Why:** Severity changes affect SLA timelines and routing; requires
  @support-lead notification after use.

### 3.2 Direct Department Messenger
- **Tool:** `send_cross_department(to_department, message, context)`
- **Why:** Cross-department communication normally routes through
  @support-lead; direct use requires prior approval.

---

## Skill Anti-Patterns
The Tier 1 Support Agent explicitly does **NOT** have:
- `debug_technical_issue()` — that is the Tier 2 Technical Agent's domain
- `write_kb_article()` — that is the Knowledge Base Curator's domain
- `conduct_qa_review()` — that is the Quality Assurance Analyst's domain
- `route_ticket()` — that is the Support Lead's domain
- `override_priority()` — that is the Support Lead's domain

## Sources & Inspirations
- OpenClaw customer support squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
