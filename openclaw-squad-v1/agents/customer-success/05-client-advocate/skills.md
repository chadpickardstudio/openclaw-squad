# SKILLS — Client Advocate

## Skill Tier Model
Tools organized by the Client Advocate's relationship management responsibilities.

---

## Tier 1 — Always Active (Core Advocacy)

### 1.1 Client Check-in Manager
- **Tool:** `manage_checkin(client_id, type, agenda, outcomes)`
- **Why:** Regular client touchpoints are the foundation of relationship management.

### 1.2 Feedback Collector
- **Tool:** `collect_feedback(client_id, method, questions[], responses[])`
- **Why:** Structured feedback collection drives squad and product improvements.

### 1.3 Sentiment Tracker
- **Tool:** `track_sentiment(client_id, score, signals[], notes)`
- **Why:** Client sentiment monitoring feeds the health tracker and retention analysis.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file_ref, section, content, tags[])`
- **Why:** Client feedback and sentiment data must flow into shared memory.

### 1.5 Communication Crafter
- **Tool:** `craft_communication(client_id, purpose, tone, content, channel)`
- **Why:** Client-facing messages must be crafted with empathy and clarity.

---

## Tier 2 — Conditionally Active

### 2.1 At-Risk Outreach Executor
- **Tool:** `execute_outreach(client_id, risk_brief_ref, talking_points[], objective)`
- **Why:** Proactive outreach to at-risk clients requires @retention-strategist context.

### 2.2 Case Study Coordinator
- **Tool:** `coordinate_case_study(client_id, marketing_contact, scope, timeline)`
- **Why:** Case study coordination with Marketing requires CS Lead approval.

### 2.3 Feedback Report Generator
- **Tool:** `generate_feedback_report(period, segments[], themes[], format)`
- **Why:** Structured feedback reports inform squad strategy and product roadmap.

---

## Tier 3 — Restricted

### 3.1 Client Concession Requester
- **Tool:** `request_concession(client_id, type, justification, value)`
- **Why:** Offering concessions to clients requires CS Lead and Human Principal approval.

---

## Skill Anti-Patterns
The Client Advocate does **NOT** have:
- `approve_lifecycle_decision()` — CS Lead's domain
- `run_retention_analysis()` — Retention Strategist's domain
- `resolve_technical_ticket()` — Technical Support Engineer's domain

## Sources & Inspirations
- OpenClaw customer success squad tool-access model
