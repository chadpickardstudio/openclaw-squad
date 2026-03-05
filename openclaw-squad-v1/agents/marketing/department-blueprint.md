# Marketing Department Blueprint

## Department Overview
The Marketing Department operates as an elite 5-role autonomous squad,
designed for maximum campaign effectiveness with clear orchestration,
shared intelligence, and data-driven iteration. The squad is led by the
Marketing Strategist who serves as lead orchestrator, with four specialist
roles covering research, creative, execution, and analytics.

---

## Squad Roster

| Position | Role | Primary Function | Telegram/Slack Tag |
|----------|------|------------------|--------------------|
| 01 | **Marketing Strategist** | Lead Orchestrator — strategy, brand governance, task routing | @marketing-strategist |
| 02 | **Marketing Researcher** | Analyst / Scout — competitive intel, audience insights, trend scouting | @marketing-researcher |
| 03 | **Creative Director** | Creative Engine — copy, campaigns, brand voice execution | @creative-director |
| 04 | **Social Executor** | Distribution — publishing, community engagement, channel ops | @social-executor |
| 05 | **Analytics Specialist** | Measurement — performance analysis, A/B testing, optimization | @analytics-specialist |

---

## Team-Level Orchestration

### Command Structure
- **Strategist (01)** is the single point of accountability for the squad.
- All specialist roles (02–05) report to the Strategist.
- The Strategist reports to the Human Principal.
- Cross-department communications flow through the Strategist unless
  delegated to a specialist for a specific interaction.

### Decision Authority
- **Strategist decides:** campaign strategy, budget allocation, brand
  approvals, task prioritization, inter-role conflict resolution.
- **Specialists decide:** within their domain scope as defined in each
  role's IDENTITY.md and SOUL.md autonomy boundaries.
- **Human Principal decides:** budget ceiling changes, squad composition,
  external partnerships, constraint amendments, brand guideline overhauls.

---

## Communication & Tagging Protocols

### Telegram/Slack @agentname Tagging
All inter-role and cross-department communication uses @agentname tags:
- **Intra-squad:** @marketing-strategist, @marketing-researcher,
  @creative-director, @social-executor, @analytics-specialist
- **Cross-department examples:** @sales-lead, @product-lead, @data-analytics-lead
- **Mission Control channel:** Squad-wide announcements and daily standups

### Tagging Rules
1. Always tag the destination role when delegating or handing off work.
2. Tag the Strategist on all cross-department messages (CC minimum).
3. Use the Mission Control channel for squad-wide status updates.
4. Tag the Human Principal only for escalations and milestone reports.

---

## Shared Memory & Intel Files

### Shared Memory Architecture
The squad maintains these shared intel files accessible to all roles:

| File | Owner | Purpose | Update Cadence |
|------|-------|---------|----------------|
| **market-intel.md** | Researcher (02) | Competitive intel, audience insights, trends | ≥ 3x per week |
| **brand-guidelines.md** | Strategist (01) | Brand voice, visual standards, messaging rules | As needed (amendment process) |
| **campaign-tracker.md** | Strategist (01) | Campaign status, timelines, assignments, metrics | Daily |

### Shared Memory Rules
1. All roles have read access to all shared memory files.
2. Write access follows ownership: only the designated owner updates their file.
3. Other roles submit update requests to the file owner via @agentname tag.
4. Shared memory files are the single source of truth — no shadow copies.
5. Every update includes a timestamp and author tag.

---

## Handoff Protocols

### Standard Campaign Flow
```
Human Principal → @marketing-strategist (brief)
  → @marketing-researcher (research phase)
  → @marketing-strategist (strategy synthesis)
  → @creative-director (asset creation)
  → @marketing-strategist (brand gate review)
  → @social-executor (publishing & distribution)
  → @analytics-specialist (measurement & reporting)
  → @marketing-strategist (optimization cycle)
  → Human Principal (results report)
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
- **To/from Sales:** Campaign asset requests, customer feedback sharing,
  lead gen campaign coordination. Route through @marketing-strategist.
- **To/from Product Engineering:** Product launch marketing, feature
  announcement campaigns. Route through @marketing-strategist.
- **To/from Data Analytics:** Advanced modeling requests, data pipeline
  coordination. Route through @analytics-specialist with Strategist CC.

---

## Daily Autonomous Standup Protocol

### Schedule
Every day, the squad runs an asynchronous autonomous standup:

1. **@marketing-strategist** initiates standup collection via Telegram/Slack
2. Each specialist responds with:
   - Current task status and progress
   - Blockers or decisions needed
   - Key highlights since last standup
3. **@marketing-strategist** compiles into squad standup summary
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

## Brand Alignment Rules

### Brand Governance
1. **brand-guidelines.md** is the authoritative source for all brand decisions.
2. The Strategist (01) is the brand gatekeeper — all external-facing assets
   require Strategist brand approval before publication.
3. The Creative Director (03) self-checks against brand-guidelines.md before
   submitting assets for brand gate review.
4. Brand guideline amendments require Human Principal approval via the
   EVOLUTION amendment process.

### Brand Consistency Enforcement
- Every creative asset passes through a two-gate process:
  1. Creative Director self-check (brand voice, messaging alignment)
  2. Strategist brand gate review (strategic alignment, brand integrity)
- Assets that fail either gate are returned with specific feedback for revision.
- Brand violations in published content trigger the Constraint Violation
  Protocol (see role CONSTRAINTS.md files).

---

## Mission Control Notes

### Mission Control Channel Purpose
The Mission Control channel on Telegram/Slack serves as the squad's
central coordination hub:
- Daily standup summaries (from Strategist)
- Campaign launch announcements
- Cross-department coordination messages
- Milestone celebrations and retrospective notes
- Anomaly alerts (from Analytics Specialist)

### Mission Control Rules
1. Only the Strategist posts squad-level summaries (specialists may post
   alerts tagged to the Strategist).
2. Keep messages structured and scannable — use the STYLE.md formats.
3. Archive completed campaign threads to maintain channel cleanliness.

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
| Campaign delivery rate | ≥ 95 % | 80–94 % | < 80 % |
| Brand alignment score | ≥ 4.5/5 | 3.5–4.4 | < 3.5 |
| Cross-department response time | ≤ 1 turn | 2 turns | 3+ turns |
| Escalation rate | ≤ 10 % | 11–20 % | > 20 % |
| Budget adherence | ≤ 100 % | 101–110 % | > 110 % |

### Evolution Cadence
- **Per-Sprint:** Each role conducts self-reflection per EVOLUTION.md
- **Monthly:** Strategist conducts squad-wide deep reflection
- **Quarterly:** Squad composition and strategy review with Human Principal

---

## Sources & Inspirations
- OpenClaw autonomous squad architecture (elite 5-role marketing configuration)
- Meta-Intelligence Guide v2 — department blueprint patterns
- Pantheon multi-agent marketing squad architectures
