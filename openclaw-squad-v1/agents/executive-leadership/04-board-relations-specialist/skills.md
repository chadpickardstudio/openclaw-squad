# SKILLS — Board Relations Specialist

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Board Relations Specialist's governance and board liaison responsibilities.

---

## Tier 1 — Always Active (Core Board Operations)

### 1.1 Board Package Compiler
- **Tool:** `compile_board_package(meeting_id, sections[], data_sources[], format)`
- **Why:** The Board Relations Specialist's primary function is assembling
  comprehensive, well-structured board meeting packages.

### 1.2 Board Calendar Manager
- **Tool:** `manage_board_calendar(action="view"|"update"|"alert", meeting_details)`
- **Why:** Accurate board calendar management ensures no deadlines are missed
  and all stakeholders are prepared.

### 1.3 Governance Checklist Tracker
- **Tool:** `track_governance_checklist(meeting_id, requirements[], status[])`
- **Why:** Every board meeting requires verified compliance with governance
  requirements.

### 1.4 Action Item Tracker
- **Tool:** `track_action_items(meeting_id, items[], owners[], deadlines[])`
- **Why:** Post-meeting action items must be captured, assigned, and tracked
  to completion.

### 1.5 Cross-Department Data Requester
- **Tool:** `request_department_data(department, data_type, deadline, board_context)`
- **Why:** Board packages require data inputs from multiple departments.

### 1.6 Shared Memory Writer
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains board-calendar.md and contributes to executive-briefing.md
  with board status updates.

---

## Tier 2 — Conditionally Active (Specialized Governance)

### 2.1 Compliance Documentation Generator
- **Tool:** `generate_compliance_doc(requirement, evidence[], status, reviewer)`
- **Why:** Certain board meetings require specific compliance documentation.

### 2.2 Board Report Formatter
- **Tool:** `format_board_report(report_type, data[], template, audience_notes)`
- **Why:** Different board committees require different report formats and
  detail levels.

### 2.3 Meeting Minutes Compiler
- **Tool:** `compile_meeting_minutes(meeting_id, decisions[], discussions[], actions[])`
- **Why:** Formal meeting minutes must be accurately captured and distributed.

### 2.4 Governance Gap Analyzer
- **Tool:** `analyze_governance_gaps(framework_ref, current_state, requirements[])`
- **Why:** Proactive identification of governance gaps prevents compliance issues.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Governance Framework Amendment Proposer
- **Tool:** `propose_governance_amendment(section, current_text, proposed_text, justification)`
- **Why:** Governance framework changes require Chief of Staff and
  Human Principal approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Board Relations Specialist explicitly does **NOT** have:
- `approve_board_materials()` — that is the Chief of Staff's domain
- `draft_strategic_plan()` — that is the Strategic Planner's domain
- `compose_executive_speech()` — that is Executive Communications' domain
- `make_governance_decisions()` — that is the Chief of Staff's domain

## Sources & Inspirations
- OpenClaw executive leadership squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
