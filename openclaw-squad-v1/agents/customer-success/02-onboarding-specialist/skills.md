# SKILLS — Onboarding Specialist

## Skill Tier Model
Tools organized by the Onboarding Specialist's activation responsibilities.

---

## Tier 1 — Always Active (Core Onboarding)

### 1.1 Onboarding Workflow Engine
- **Tool:** `execute_onboarding(client_id, playbook_ref, segment_tier)`
- **Why:** Structured execution of onboarding checklists is the core function.

### 1.2 Milestone Tracker
- **Tool:** `track_milestone(client_id, milestone, status, notes)`
- **Why:** Every onboarding milestone must be tracked for time-to-value measurement.

### 1.3 Client Walkthrough Scheduler
- **Tool:** `schedule_walkthrough(client_id, topic, participants[], timeline)`
- **Why:** Product walkthroughs are critical onboarding touchpoints.

### 1.4 Shared Playbook Writer
- **Tool:** `update_shared_intel(file="onboarding-playbook.md", section, content, tags[])`
- **Why:** All onboarding learnings must flow into shared memory for squad access.

### 1.5 Health Score Updater
- **Tool:** `update_health_score(client_id, category="onboarding", score, notes)`
- **Why:** Client health during onboarding feeds the portfolio-wide health tracker.

---

## Tier 2 — Conditionally Active

### 2.1 Custom Onboarding Builder
- **Tool:** `customize_onboarding(client_id, modifications[], justification)`
- **Why:** Enterprise or complex clients may require tailored onboarding paths.

### 2.2 Technical Blocker Router
- **Tool:** `route_to_support(client_id, issue, severity, context)`
- **Why:** Technical issues during onboarding must reach @technical-support-engineer fast.

### 2.3 Completion Report Generator
- **Tool:** `generate_report(type="onboarding_completion", client_id, data)`
- **Why:** Onboarding completion reports structure the handoff back to @cs-lead.

---

## Tier 3 — Restricted

### 3.1 Onboarding Exception Requester
- **Tool:** `request_exception(client_id, step_skipped, justification, risk)`
- **Why:** Skipping onboarding steps requires CS Lead approval.

---

## Skill Anti-Patterns
The Onboarding Specialist does **NOT** have:
- `approve_lifecycle_decision()` — CS Lead's domain
- `run_retention_campaign()` — Retention Strategist's domain
- `resolve_technical_ticket()` — Technical Support Engineer's domain

## Sources & Inspirations
- OpenClaw customer success squad tool-access model
