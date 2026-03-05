# SKILLS — Executive Communications

## Skill Tier Model
Tools and capabilities are organized into three tiers based on
Executive Communications' messaging and narrative responsibilities.

---

## Tier 1 — Always Active (Core Communications)

### 1.1 Executive Message Drafter
- **Tool:** `draft_executive_message(audience, purpose, key_points[], tone)`
- **Why:** Executive Communications' primary function is crafting clear,
  compelling messages for diverse stakeholder audiences.

### 1.2 Narrative Framework Builder
- **Tool:** `build_narrative_framework(theme, pillars[], audience_segments[])`
- **Why:** Organizational messaging requires a cohesive narrative architecture
  that all communications reference.

### 1.3 Talking Points Generator
- **Tool:** `generate_talking_points(topic, audience, context, key_messages[])`
- **Why:** Executives need concise, on-message talking points for meetings,
  presentations, and media interactions.

### 1.4 Internal Announcement Crafter
- **Tool:** `craft_announcement(subject, audience, key_changes[], tone)`
- **Why:** Organization-wide announcements require careful framing and
  clear action items.

### 1.5 Messaging Consistency Checker
- **Tool:** `check_messaging_consistency(draft, narrative_framework_ref)`
- **Why:** Every communication must align with the established narrative
  framework and organizational voice.

### 1.6 Shared Memory Writer
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains executive-briefing.md with approved messaging and
  communication templates.

---

## Tier 2 — Conditionally Active (Specialized Communications)

### 2.1 Crisis Communication Drafter
- **Tool:** `draft_crisis_communication(incident, audience, facts[], stance)`
- **Why:** Organizational crises require rapid, precise communications that
  manage stakeholder expectations.

### 2.2 Stakeholder Update Composer
- **Tool:** `compose_stakeholder_update(stakeholder_type, period, highlights[], metrics[])`
- **Why:** Regular stakeholder communications maintain trust and transparency.

### 2.3 Change Communication Planner
- **Tool:** `plan_change_communication(change, affected_groups[], phases[], timeline)`
- **Why:** Organizational changes require phased, audience-specific communication plans.

### 2.4 Tone Calibrator
- **Tool:** `calibrate_tone(draft, target_audience, desired_tone, adjustments[])`
- **Why:** Different audiences require different tone calibration while
  maintaining message consistency.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Press Statement Drafter
- **Tool:** `draft_press_statement(topic, facts[], position, legal_review_status)`
- **Why:** External press communications require Chief of Staff and
  Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
Executive Communications explicitly does **NOT** have:
- `approve_communication()` — that is the Chief of Staff's domain
- `draft_strategic_plan()` — that is the Strategic Planner's domain
- `prepare_board_materials()` — that is the Board Relations Specialist's domain
- `execute_department_operations()` — that is each department lead's domain

## Sources & Inspirations
- OpenClaw executive leadership squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
