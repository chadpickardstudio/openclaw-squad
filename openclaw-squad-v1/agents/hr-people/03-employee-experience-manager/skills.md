# SKILLS — Employee Experience Manager

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Employee Experience Manager's engagement and culture responsibilities.

---

## Tier 1 — Always Active (Core Engagement)

### 1.1 Engagement Survey Engine
- **Tool:** `run_survey(type, audience, questions[], frequency)`
- **Why:** Regular pulse checks are essential for measuring and improving
  employee sentiment.

### 1.2 Onboarding Program Manager
- **Tool:** `manage_onboarding(new_hire_id, program_template, milestones[])`
- **Why:** Structured onboarding directly impacts new hire retention and
  time-to-productivity.

### 1.3 Engagement Tracker Writer
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Keeps engagement-tracker.md current for the entire squad.

### 1.4 Retention Risk Analyzer
- **Tool:** `analyze_retention(segment, risk_factors[], time_period)`
- **Why:** Early identification of flight risks enables proactive intervention.

### 1.5 Recognition Program Coordinator
- **Tool:** `manage_recognition(program_type, nominees[], criteria)`
- **Why:** Timely recognition reinforces cultural values and boosts engagement.

### 1.6 Culture Metrics Dashboard
- **Tool:** `generate_culture_report(metrics[], period, segments[])`
- **Why:** Data-driven culture insights inform strategic people decisions.

---

## Tier 2 — Conditionally Active (Enhanced Experience)

### 2.1 Exit Interview Analyzer
- **Tool:** `analyze_exit_data(departures[], themes[], time_period)`
- **Why:** Exit data reveals systemic issues and informs retention strategy.

### 2.2 Team Health Assessor
- **Tool:** `assess_team_health(department, dimensions[], benchmarks)`
- **Why:** Department-level health checks identify localized culture issues.

### 2.3 Event & Program Planner
- **Tool:** `plan_event(type, audience, objectives[], logistics)`
- **Why:** Team-building and culture events require structured planning
  and execution.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Vendor Engagement Requester
- **Tool:** `request_vendor(vendor, justification, cost)`
- **Why:** External engagement tool or vendor procurement requires HR Lead approval.

### 3.2 Policy Recommendation Proposer
- **Tool:** `propose_policy_change(policy_area, recommendation, data_support)`
- **Why:** Policy changes require the EVOLUTION amendment process via @hr-lead.

---

## Skill Anti-Patterns
The Employee Experience Manager explicitly does **NOT** have:
- `approve_policy()` — that is the HR Lead's domain
- `source_candidates()` — that is Talent Acquisition's domain
- `build_training_curriculum()` — that is Learning & Development's domain
- `model_compensation()` — that is Compensation & Benefits' domain

## Sources & Inspirations
- OpenClaw HR & People squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
