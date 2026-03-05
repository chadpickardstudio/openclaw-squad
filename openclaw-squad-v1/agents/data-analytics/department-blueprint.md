# Data Analytics Department Blueprint

## Department Overview
The Data Analytics Department operates as an elite 5-role autonomous squad,
designed for maximum analytical effectiveness with clear orchestration,
shared intelligence, and data-driven iteration. The squad is led by the
Analytics Lead who serves as lead orchestrator, with four specialist
roles covering data engineering, business intelligence, data science, and reporting.

---

## Squad Roster

| Position | Role | Primary Function | Telegram/Slack Tag |
|----------|------|------------------|--------------------|
| 01 | **Analytics Lead** | Lead Orchestrator — strategy, data quality governance, task routing | @analytics-lead |
| 02 | **Data Engineer** | Pipeline Architect — ETL/ELT pipelines, data infrastructure, source integration | @data-engineer |
| 03 | **Business Intelligence Analyst** | Analytical Engine — business analysis, KPI tracking, insight synthesis | @bi-analyst |
| 04 | **Data Scientist** | Statistical & ML Specialist — modeling, experimentation, advanced analytics | @data-scientist |
| 05 | **Reporting Specialist** | Visualization & Delivery — dashboards, reports, data storytelling | @reporting-specialist |

---

## Team-Level Orchestration

### Command Structure
- **Analytics Lead (01)** is the single point of accountability for the squad.
- All specialist roles (02–05) report to the Analytics Lead.
- The Analytics Lead reports to the Human Principal.
- Cross-department communications flow through the Analytics Lead unless
  delegated to a specialist for a specific interaction.

### Decision Authority
- **Analytics Lead decides:** analytics strategy, pipeline prioritization, data
  quality approvals, task routing, inter-role conflict resolution.
- **Specialists decide:** within their domain scope as defined in each
  role's IDENTITY.md and SOUL.md autonomy boundaries.
- **Human Principal decides:** budget ceiling changes, squad composition,
  external data partnerships, constraint amendments, data governance overhauls.

---

## Communication & Tagging Protocols

### Telegram/Slack @agentname Tagging
All inter-role and cross-department communication uses @agentname tags:
- **Intra-squad:** @analytics-lead, @data-engineer, @bi-analyst,
  @data-scientist, @reporting-specialist
- **Cross-department examples:** @marketing-strategist, @product-lead,
  @finance-lead, @sales-lead
- **Mission Control channel:** Squad-wide announcements and daily standups

### Tagging Rules
1. Always tag the destination role when delegating or handing off work.
2. Tag the Analytics Lead on all cross-department messages (CC minimum).
3. Use the Mission Control channel for squad-wide status updates.
4. Tag the Human Principal only for escalations and milestone reports.

---

## Shared Memory & Intel Files

### Shared Memory Architecture
The squad maintains these shared intel files accessible to all roles:

| File | Owner | Purpose | Update Cadence |
|------|-------|---------|----------------|
| **data-catalog.md** | Data Engineer (02) | Data source documentation, schemas, lineage, freshness metadata | As sources change, ≥ 3x per week |
| **pipeline-status.md** | Data Engineer (02) | Pipeline health, uptime metrics, incident log, SLA tracking | Daily |
| **insights-tracker.md** | Analytics Lead (01) | Analytical findings, model results, report delivery status | Daily |

### Shared Memory Rules
1. All roles have read access to all shared memory files.
2. Write access follows ownership: only the designated owner updates their file.
3. Other roles submit update requests to the file owner via @agentname tag.
4. Shared memory files are the single source of truth — no shadow copies.
5. Every update includes a timestamp and author tag.

---

## Handoff Protocols

### Standard Analytics Flow
```
Human Principal → @analytics-lead (brief)
  → @data-engineer (pipeline/data preparation)
  → @analytics-lead (prioritize & route analysis)
  → @bi-analyst or @data-scientist (analysis/modeling)
  → @analytics-lead (quality gate review)
  → @reporting-specialist (dashboards/reports)
  → @analytics-lead (final review)
  → Human Principal (insight delivery)
```

### Handoff Requirements
Every task handoff between roles must include:
1. **Context** — why this task exists and what preceded it
2. **Objective** — clear, measurable goal
3. **Acceptance Criteria** — what "done" looks like
4. **Deadline** — when it's needed
5. **Shared Memory Refs** — relevant files to reference
6. **Priority** — P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)

### Cross-Department Handoffs
- **To/from Product Engineering:** Data infrastructure coordination, API
  schema changes, A/B test framework. Route through @analytics-lead.
- **To/from Marketing:** Campaign analytics, attribution modeling, audience
  segmentation. Route through @analytics-lead.
- **To/from Finance:** Financial reporting, budget tracking, forecasting
  models. Route through @analytics-lead.
- **To/from Sales:** Funnel analytics, lead scoring, conversion analysis.
  Route through @bi-analyst with Analytics Lead CC.

---

## Daily Autonomous Standup Protocol

### Schedule
Every day, the squad runs an asynchronous autonomous standup:

1. **@analytics-lead** initiates standup collection via Telegram/Slack
2. Each specialist responds with:
   - Current task status and progress
   - Blockers or decisions needed
   - Key highlights since last standup
3. **@analytics-lead** compiles into squad standup summary
4. Summary posted to Mission Control channel
5. Human Principal tagged only if blockers or decisions are pending

### Standup Format (per specialist)
```markdown
**[Role Name] Standup — [Date]**
- Working on: [Current task]
- Status: On track / At risk / Blocked
- Blocker: [If any — tag who can unblock]
- Highlight: [Notable finding/delivery since last standup]
```

---

## Data Quality Rules

### Data Governance
1. **data-catalog.md** is the authoritative source for all data source documentation.
2. The Analytics Lead (01) is the data quality gatekeeper — all external-facing
   deliverables require Analytics Lead quality approval before delivery.
3. The Data Engineer (02) enforces quality at the pipeline level with automated
   validation checks.
4. Data governance policy amendments require Human Principal approval via the
   EVOLUTION amendment process.

### Data Quality Enforcement
- Every analytical deliverable passes through a two-gate process:
  1. Specialist self-check (methodology, accuracy, completeness)
  2. Analytics Lead quality gate review (data integrity, business alignment)
- Deliverables that fail either gate are returned with specific feedback for revision.
- Data quality violations in published deliverables trigger the Constraint Violation
  Protocol (see role CONSTRAINTS.md files).

---

## Mission Control Notes

### Mission Control Channel Purpose
The Mission Control channel on Telegram/Slack serves as the squad's
central coordination hub:
- Daily standup summaries (from Analytics Lead)
- Pipeline health alerts (from Data Engineer)
- Insight delivery announcements
- Cross-department coordination messages
- Anomaly alerts (from BI Analyst or Data Scientist)

### Mission Control Rules
1. Only the Analytics Lead posts squad-level summaries (specialists may post
   alerts tagged to the Analytics Lead).
2. Keep messages structured and scannable — use the STYLE.md formats.
3. Archive completed analysis threads to maintain channel cleanliness.

---

## Per-Role File Structure
Each role subfolder contains exactly 8 definition files:

```
XX-role-name/
├── IDENTITY.md      — role title, responsibilities, boundaries, KPIs
├── SOUL.md          — personality, autonomy model, collaboration style
├── skills.md        — tiered tool/capability registry
├── STYLE.md         — communication tone, output formats, language rules
├── GOALS.md         — OKRs, collaboration goals, health metrics
├── CONSTRAINTS.md   — hard boundaries, violation protocol
├── EVOLUTION.md     — self-reflection, change proposals, history
└── HEARTBEAT.md     — proactive idle behaviors, daily report schedule
```

---

## Squad Health & Evolution

### Squad-Level Health Metrics
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Insight delivery rate | ≥ 95 % | 80–94 % | < 80 % |
| Data quality score | ≥ 4.5/5 | 3.5–4.4 | < 3.5 |
| Pipeline uptime (critical) | ≥ 99 % | 95–98 % | < 95 % |
| Cross-department response time | ≤ 1 turn | 2 turns | 3+ turns |
| Escalation rate | ≤ 10 % | 11–20 % | > 20 % |

### Evolution Cadence
- **Per-Sprint:** Each role conducts self-reflection per EVOLUTION.md
- **Monthly:** Analytics Lead conducts squad-wide deep reflection
- **Quarterly:** Squad composition and strategy review with Human Principal

---

## Sources & Inspirations
- OpenClaw autonomous squad architecture (elite 5-role data analytics configuration)
- Meta-Intelligence Guide v2 — department blueprint patterns
- Pantheon multi-agent data analytics squad architectures
