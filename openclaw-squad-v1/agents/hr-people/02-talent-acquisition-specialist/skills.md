# SKILLS — Talent Acquisition Specialist

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Talent Acquisition Specialist's recruitment responsibilities.

---

## Tier 1 — Always Active (Core Recruitment)

### 1.1 Candidate Sourcer
- **Tool:** `source_candidates(role_profile, channels[], filters)`
- **Why:** Sourcing is the primary function — maintaining a healthy pipeline
  requires continuous candidate identification.

### 1.2 Pipeline Tracker
- **Tool:** `update_pipeline(candidate_id, stage, notes, timestamp)`
- **Why:** Real-time pipeline visibility is critical for hiring decisions
  and sprint planning.

### 1.3 Screening Evaluator
- **Tool:** `evaluate_candidate(candidate_id, criteria[], score_card)`
- **Why:** Structured screening ensures consistent, bias-reduced candidate
  assessment.

### 1.4 Interview Coordinator
- **Tool:** `schedule_interview(candidate_id, interviewers[], time_slots[])`
- **Why:** Smooth interview logistics directly impact candidate experience
  and time-to-fill.

### 1.5 Shared Memory Writer
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Keeps talent-pipeline.md current for the entire squad.

### 1.6 Job Profile Builder
- **Tool:** `build_job_profile(department, role, requirements[], hiring_manager)`
- **Why:** Clear job profiles are the foundation of effective sourcing
  and screening.

---

## Tier 2 — Conditionally Active (Enhanced Recruitment)

### 2.1 Market Talent Mapper
- **Tool:** `map_talent_market(role_type, geography, compensation_range)`
- **Why:** Understanding talent availability informs sourcing strategy
  and offer competitiveness.

### 2.2 Candidate Communication Engine
- **Tool:** `send_candidate_message(candidate_id, template, personalization)`
- **Why:** Timely, personalized communication improves candidate experience
  and acceptance rates.

### 2.3 Referral Network Manager
- **Tool:** `manage_referrals(source, candidate, referral_bonus_eligible)`
- **Why:** Employee referrals are consistently the highest-quality hiring channel.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Recruiter Requester
- **Tool:** `request_external_recruiter(role, justification, budget_impact)`
- **Why:** External recruiter engagement requires HR Lead approval due to cost.

### 3.2 Sourcing Tool Requester
- **Tool:** `request_new_tool(tool_name, justification, cost)`
- **Why:** New tool procurement requires HR Lead budget approval.

---

## Skill Anti-Patterns
The Talent Acquisition Specialist explicitly does **NOT** have:
- `approve_hire()` — that is the HR Lead's domain
- `design_onboarding()` — that is Employee Experience's domain
- `set_compensation()` — that is Compensation & Benefits' domain
- `build_training_plan()` — that is Learning & Development's domain

## Sources & Inspirations
- OpenClaw HR & People squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
