# SKILLS — Strategic Planner

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Strategic Planner's planning and analysis responsibilities.

---

## Tier 1 — Always Active (Core Planning)

### 1.1 Strategic Plan Drafter
- **Tool:** `draft_strategic_plan(objective, scope, timeline, resources)`
- **Why:** The Strategic Planner's primary function is translating vision
  into structured, actionable strategic plans.

### 1.2 OKR Framework Builder
- **Tool:** `build_okr_framework(objectives[], key_results[], owners[])`
- **Why:** Organizational alignment requires clear, measurable OKR structures.

### 1.3 Scenario Modeler
- **Tool:** `model_scenario(initiative, assumptions, variables, outcome_range)`
- **Why:** Executive decisions require scenario-based risk and opportunity analysis.

### 1.4 Initiative Roadmap Builder
- **Tool:** `build_roadmap(initiatives[], milestones[], dependencies[], resources[])`
- **Why:** Complex strategic initiatives need visual, trackable roadmaps.

### 1.5 Cross-Department Data Collector
- **Tool:** `collect_department_data(department, metrics[], timeframe)`
- **Why:** Strategic planning requires data inputs from across the organization.

### 1.6 Shared Memory Writer
- **Tool:** `read_write_shared_intel(file_ref, action="read"|"write"|"append")`
- **Why:** Maintains strategic-plan.md and contributes to executive-briefing.md.

---

## Tier 2 — Conditionally Active (Analysis Tools)

### 2.1 Competitive Landscape Analyzer
- **Tool:** `analyze_competitive_landscape(market, competitors[], dimensions[])`
- **Why:** Strategic positioning requires understanding competitive dynamics.

### 2.2 Resource Forecaster
- **Tool:** `forecast_resources(initiative_id, timeline, scenarios[])`
- **Why:** Budget and headcount forecasting supports executive resource decisions.

### 2.3 Risk Assessment Engine
- **Tool:** `assess_risk(initiative_id, risk_factors[], mitigation_options[])`
- **Why:** Every strategic plan requires documented risk assessment.

### 2.4 Dependency Mapper
- **Tool:** `map_dependencies(initiatives[], departments[], critical_path)`
- **Why:** Cross-initiative dependencies must be visible to prevent blockers.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 External Research Requester
- **Tool:** `request_external_research(topic, justification, budget_impact)`
- **Why:** External research purchases require Chief of Staff approval.

### 3.2 Constraint Amendment Proposer
- **Tool:** `propose_constraint_change(constraint_id, proposed_change, reason)`
- **Why:** CONSTRAINTS changes require the EVOLUTION amendment process.

---

## Skill Anti-Patterns
The Strategic Planner explicitly does **NOT** have:
- `approve_initiative()` — that is the Chief of Staff's domain
- `compose_executive_speech()` — that is Executive Communications' domain
- `prepare_board_materials()` — that is the Board Relations Specialist's domain
- `execute_department_operations()` — that is each department lead's domain

## Sources & Inspirations
- OpenClaw executive leadership squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
