# SKILLS — Process Optimization Specialist

## Skill Tier Model
Tools organized by the Process Specialist's workflow optimization responsibilities.

---

## Tier 1 — Always Active (Core Optimization)

### 1.1 Process Mapper
- **Tool:** `map_process(workflow_name, steps[], dependencies[], owners[])`
- **Why:** Visualizing current-state workflows is the foundation of all optimization.

### 1.2 Bottleneck Analyzer
- **Tool:** `analyze_bottlenecks(process_id, metrics[], timeframe)`
- **Why:** Identifying constraints is the first step to eliminating them.

### 1.3 Cycle Time Calculator
- **Tool:** `calculate_cycle_time(process_id, start_point, end_point, data_source)`
- **Why:** Quantifying process duration enables data-driven improvement targets.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="process-playbook.md", section, content, tags[])`
- **Why:** All process findings must flow into shared memory for squad access.

### 1.5 Cross-Department Querier
- **Tool:** `query_department(department, question, context)`
- **Why:** Gathering process data from other departments requires structured
  queries via @agentname tags on Telegram/Slack.

---

## Tier 2 — Conditionally Active

### 2.1 Workflow Redesigner
- **Tool:** `redesign_workflow(process_id, proposed_changes[], impact_projection)`
- **Why:** Extended optimization projects beyond routine analysis.

### 2.2 SLA Compiler
- **Tool:** `compile_sla(process_id, metrics[], targets[], enforcement_rules[])`
- **Why:** Provides measurable service-level agreements for optimized processes.

### 2.3 Report Generator
- **Tool:** `generate_report(type, data, format, audience)`
- **Why:** Structures raw findings into consumable briefs for the squad.

---

## Tier 3 — Restricted

### 3.1 Automation Proposal Requester
- **Tool:** `request_automation(process_id, justification, complexity, cost)`
- **Why:** Automation implementations require Ops Lead approval and
  Product Engineering coordination.

---

## Skill Anti-Patterns
The Process Specialist does **NOT** have:
- `approve_operational_change()` — Ops Lead's domain
- `negotiate_vendor_contract()` — Vendor Procurement's domain
- `manage_facilities()` — Facilities Manager's domain

## Sources & Inspirations
- OpenClaw operations squad tool-access model
