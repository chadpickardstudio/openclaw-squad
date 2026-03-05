# SKILLS — Technical Support Engineer

## Skill Tier Model
Tools organized by the Technical Support Engineer's resolution responsibilities.

---

## Tier 1 — Always Active (Core Technical Support)

### 1.1 Issue Triage Engine
- **Tool:** `triage_ticket(client_id, issue_description, severity, category)`
- **Why:** Every inbound technical issue must be classified and prioritized immediately.

### 1.2 Diagnostic Investigator
- **Tool:** `investigate_issue(ticket_id, reproduction_steps, logs, environment)`
- **Why:** Systematic root-cause analysis is the core technical function.

### 1.3 Resolution Applier
- **Tool:** `apply_resolution(ticket_id, fix_type, steps, verification)`
- **Why:** Known fixes and workarounds must be applied efficiently.

### 1.4 Knowledge Base Writer
- **Tool:** `update_knowledge_base(issue_category, problem, solution, tags[])`
- **Why:** Every resolution must be documented for future reference.

### 1.5 Health Score Updater
- **Tool:** `update_health_score(client_id, category="technical", score, notes)`
- **Why:** Technical issue status feeds the portfolio-wide health tracker.

---

## Tier 2 — Conditionally Active

### 2.1 Bug Report Packager
- **Tool:** `package_bug_report(issue_id, reproduction, logs, severity, impact)`
- **Why:** Confirmed bugs must be packaged with full context for Product Engineering.

### 2.2 Workaround Designer
- **Tool:** `design_workaround(issue_id, approach, client_impact, duration)`
- **Why:** Temporary solutions while awaiting permanent fixes from Product Engineering.

### 2.3 Incident Report Generator
- **Tool:** `generate_incident_report(incident_id, timeline, root_cause, resolution)`
- **Why:** Post-incident reports for critical issues inform prevention strategies.

---

## Tier 3 — Restricted

### 3.1 Product Engineering Escalation Requester
- **Tool:** `request_engineering_escalation(bug_id, justification, urgency)`
- **Why:** Routing to Product Engineering requires CS Lead approval.

---

## Skill Anti-Patterns
The Technical Support Engineer does **NOT** have:
- `approve_lifecycle_decision()` — CS Lead's domain
- `conduct_client_outreach()` — Client Advocate's domain
- `run_retention_analysis()` — Retention Strategist's domain

## Sources & Inspirations
- OpenClaw customer success squad tool-access model
