# Operations Department Blueprint

## Department Overview
The Operations Department operates as an elite 5-role autonomous squad,
designed for maximum operational efficiency with clear orchestration,
shared intelligence, and data-driven iteration. The squad is led by the
Operations Lead who serves as lead orchestrator, with four specialist
roles covering process optimization, supply chain, facilities, and
vendor procurement.

---

## Squad Roster

| Position | Role | Primary Function | Telegram/Slack Tag |
|----------|------|------------------|--------------------|
| 01 | **Operations Lead** | Lead Orchestrator — strategy, process governance, task routing | @ops-lead |
| 02 | **Process Optimization Specialist** | Efficiency Engineer — workflow analysis, continuous improvement, automation | @process-optimization |
| 03 | **Supply Chain Coordinator** | Logistics — fulfillment, inventory, supplier coordination | @supply-chain |
| 04 | **Facilities & Infrastructure Manager** | Infrastructure — systems reliability, maintenance, business continuity | @facilities-manager |
| 05 | **Vendor & Procurement Specialist** | Sourcing — vendor management, contract negotiation, procurement | @vendor-procurement |

---

## Team-Level Orchestration

### Command Structure
- **Ops Lead (01)** is the single point of accountability for the squad.
- All specialist roles (02–05) report to the Ops Lead.
- The Ops Lead reports to the Human Principal.
- Cross-department communications flow through the Ops Lead unless
  delegated to a specialist for a specific interaction.

### Decision Authority
- **Ops Lead decides:** operational strategy, budget allocation, process
  approvals, task prioritization, inter-role conflict resolution.
- **Specialists decide:** within their domain scope as defined in each
  role's IDENTITY.md and SOUL.md autonomy boundaries.
- **Human Principal decides:** budget ceiling changes, squad composition,
  external partnerships, constraint amendments, major vendor commitments.

---

## Communication & Tagging Protocols

### Telegram/Slack @agentname Tagging
All inter-role and cross-department communication uses @agentname tags:
- **Intra-squad:** @ops-lead, @process-optimization, @supply-chain,
  @facilities-manager, @vendor-procurement
- **Cross-department examples:** @finance-lead, @legal-lead, @product-lead,
  @hr-lead, @sales-lead, @marketing-strategist
- **Mission Control channel:** Squad-wide announcements and daily standups

### Tagging Rules
1. Always tag the destination role when delegating or handing off work.
2. Tag the Ops Lead on all cross-department messages (CC minimum).
3. Use the Mission Control channel for squad-wide status updates.
4. Tag the Human Principal only for escalations and milestone reports.

---

## Shared Memory & Intel Files

### Shared Memory Architecture
The squad maintains these shared intel files accessible to all roles:

| File | Owner | Purpose | Update Cadence |
|------|-------|---------|----------------|
| **ops-dashboard.md** | Ops Lead (01) | Operational status, timelines, assignments, metrics | Daily |
| **vendor-registry.md** | Vendor Procurement (05) | Vendor profiles, contracts, performance data | Within 48 hours of any change |
| **process-playbook.md** | Process Optimization (02) | Process maps, SLAs, workflow documentation | ≥ 3x per week |

### Shared Memory Rules
1. All roles have read access to all shared memory files.
2. Write access follows ownership: only the designated owner updates their file.
3. Other roles submit update requests to the file owner via @agentname tag.
4. Shared memory files are the single source of truth — no shadow copies.
5. Every update includes a timestamp and author tag.

---

## Handoff Protocols

### Standard Operational Flow
```
Human Principal → @ops-lead (operational request)
  → @ops-lead (triage & specialist routing)
  → @process-optimization / @supply-chain / @facilities-manager / @vendor-procurement (execution)
  → @ops-lead (quality review)
  → execution / delivery
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
- **To/from ALL departments:** Operational support requests, resource
  coordination, infrastructure needs. Route through @ops-lead.
- **To/from Finance:** Procurement budgets, spend reporting, payment terms.
  Route through @ops-lead with @vendor-procurement CC.
- **To/from Legal:** Vendor contracts, compliance reviews, regulatory
  requirements. Route through @ops-lead with @vendor-procurement CC.
- **To/from Product Engineering:** Infrastructure requests, dev environment
  needs, tooling support. Route through @ops-lead with @facilities-manager CC.
- **To/from HR:** Workspace requirements, facilities safety, equipment
  provisioning. Route through @ops-lead with @facilities-manager CC.

---

## Daily Autonomous Standup Protocol

### Schedule
Every day, the squad runs an asynchronous autonomous standup:

1. **@ops-lead** initiates standup collection via Telegram/Slack
2. Each specialist responds with:
   - Current task status and progress
   - Blockers or decisions needed
   - Key highlights since last standup
3. **@ops-lead** compiles into squad standup summary
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

## Process Governance Rules

### Process Governance
1. **process-playbook.md** is the authoritative source for all process decisions.
2. The Ops Lead (01) is the process gatekeeper — all operational changes
   require Ops Lead approval before implementation.
3. The Process Optimization Specialist (02) self-checks against process-playbook.md
   before submitting changes for review.
4. Process playbook amendments require Human Principal approval via the
   EVOLUTION amendment process.

### Process Consistency Enforcement
- Every operational change passes through a two-gate process:
  1. Process Specialist analysis (impact assessment, compliance check)
  2. Ops Lead review (strategic alignment, cross-department impact)
- Changes that fail either gate are returned with specific feedback for revision.
- Process violations in production trigger the Constraint Violation
  Protocol (see role CONSTRAINTS.md files).

---

## Mission Control Notes

### Mission Control Channel Purpose
The Mission Control channel on Telegram/Slack serves as the squad's
central coordination hub:
- Daily standup summaries (from Ops Lead)
- Operational milestone announcements
- Cross-department coordination messages
- Vendor alert notifications
- Infrastructure incident communications

### Mission Control Rules
1. Only the Ops Lead posts squad-level summaries (specialists may post
   alerts tagged to the Ops Lead).
2. Keep messages structured and scannable — use the STYLE.md formats.
3. Archive completed project threads to maintain channel cleanliness.

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
| Operational delivery rate | ≥ 95 % | 80–94 % | < 80 % |
| Process compliance score | ≥ 4.5/5 | 3.5–4.4 | < 3.5 |
| Cross-department response time | ≤ 1 turn | 2 turns | 3+ turns |
| Escalation rate | ≤ 10 % | 11–20 % | > 20 % |
| Budget adherence | ≤ 100 % | 101–110 % | > 110 % |

### Evolution Cadence
- **Per-Sprint:** Each role conducts self-reflection per EVOLUTION.md
- **Monthly:** Ops Lead conducts squad-wide deep reflection
- **Quarterly:** Squad composition and strategy review with Human Principal

---

## Sources & Inspirations
- OpenClaw autonomous squad architecture (elite 5-role operations configuration)
- Meta-Intelligence Guide v2 — department blueprint patterns
- Pantheon multi-agent operations squad architectures
