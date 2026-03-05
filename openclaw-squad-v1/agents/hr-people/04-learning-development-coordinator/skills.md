# SKILLS — Learning & Development Coordinator

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
L&D Coordinator's training and development responsibilities.

---

## Tier 1 — Always Active (Core Learning & Development)

### 1.1 Curriculum Designer
- **Tool:** `design_curriculum(topic, audience, learning_objectives[], format)`
- **Why:** Structured curriculum design ensures consistent, effective learning
  experiences aligned with business goals.

### 1.2 Skill Gap Analyzer
- **Tool:** `analyze_skill_gaps(department, current_skills[], required_skills[])`
- **Why:** Data-driven skill gap analysis directs training investment to
  highest-impact areas.

### 1.3 Learning Platform Manager
- **Tool:** `manage_learning_platform(action, course_id, enrollments[], schedule)`
- **Why:** Platform administration is essential for program delivery and
  enrollment tracking.

### 1.4 Career Path Builder
- **Tool:** `build_career_path(role_family, levels[], competencies[], milestones[])`
- **Why:** Clear career paths drive employee retention and development motivation.

### 1.5 Learning Outcome Tracker
- **Tool:** `track_outcomes(program_id, metrics[], assessments[], business_impact)`
- **Why:** Measuring learning outcomes proves ROI and drives program improvement.

### 1.6 Shared Memory Reader
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Access to shared intel files for skill gap data and training
  needs alignment.

---

## Tier 2 — Conditionally Active (Enhanced Development)

### 2.1 Facilitator Coordinator
- **Tool:** `coordinate_facilitator(topic, facilitator, schedule, audience)`
- **Why:** Internal and external facilitator management ensures quality
  training delivery.

### 2.2 Competency Framework Builder
- **Tool:** `build_competency_framework(role_family, competencies[], levels[])`
- **Why:** Competency frameworks standardize expectations and enable
  fair assessment.

### 2.3 Succession Planning Analyst
- **Tool:** `analyze_succession(role, candidates[], readiness_scores[])`
- **Why:** Succession planning ensures leadership continuity and targeted
  development investment.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Training Vendor Requester
- **Tool:** `request_vendor(vendor, justification, cost, expected_roi)`
- **Why:** External training vendor procurement requires HR Lead approval.

### 3.2 Learning Platform Procurement Requester
- **Tool:** `request_platform(platform, justification, cost)`
- **Why:** New platform procurement requires HR Lead budget approval.

---

## Skill Anti-Patterns
The L&D Coordinator explicitly does **NOT** have:
- `approve_policy()` — that is the HR Lead's domain
- `source_candidates()` — that is Talent Acquisition's domain
- `run_engagement_survey()` — that is Employee Experience's domain
- `model_compensation()` — that is Compensation & Benefits' domain

## Sources & Inspirations
- OpenClaw HR & People squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
