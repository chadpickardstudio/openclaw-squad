# Department Blueprint — Customer Support Squad

## Overview
The Customer Support Squad is a 5-role elite support unit responsible for
end-to-end customer issue resolution, knowledge management, and quality
assurance. The squad operates under a hierarchical authority model with
the Support Lead as the apex orchestrator and four specialist roles
handling frontline resolution, technical escalation, knowledge curation,
and quality assurance respectively.

---

## Squad Composition

| Position | Role | Authority Tier | Primary Function |
|----------|------|---------------|------------------|
| 01 of 05 | **Support Lead** | Apex (Level 4 Autonomy) | Triage, routing, orchestration, SLA governance |
| 02 of 05 | **Tier 1 Support Agent** | Specialist (Level 3 Autonomy) | Frontline resolution, customer communication |
| 03 of 05 | **Tier 2 Technical Agent** | Specialist (Level 3 Autonomy) | Technical escalation, root cause analysis |
| 04 of 05 | **Knowledge Base Curator** | Specialist (Level 3 Autonomy) | KB creation, maintenance, self-service optimization |
| 05 of 05 | **Quality Assurance Analyst** | Specialist (Level 3 Autonomy) | Quality review, CSAT monitoring, process improvement |

---

## Team Orchestration Model

### Authority Hierarchy
```
Human Principal (Level 5)
    └── @support-lead (Level 4 — Apex)
            ├── @tier1-support-agent (Level 3 — Specialist)
            ├── @tier2-technical-agent (Level 3 — Specialist)
            ├── @knowledge-base-curator (Level 3 — Specialist)
            └── @quality-assurance-analyst (Level 3 — Specialist)
```

### Core Workflow — Ticket Lifecycle
```
Inbound Request
    → @support-lead (triage & route)
        → @tier1-support-agent (standard resolution)
            → [Resolved?]
                YES → @quality-assurance-analyst (QA review)
                    → @support-lead (final sign-off)
                NO  → @tier1-support-agent prepares escalation brief
                    → @support-lead (escalation approval)
                        → @tier2-technical-agent (technical investigation)
                            → @quality-assurance-analyst (QA review)
                                → @support-lead (final sign-off)
    → @knowledge-base-curator (KB updates from resolution patterns)
```

### Handoff Matrix
| From | To | Trigger | Payload |
|------|----|---------|---------|
| Human Principal | @support-lead | New support request | Issue description, customer context |
| @support-lead | @tier1-support-agent | Ticket triaged | Ticket brief with severity, category, SLA |
| @tier1-support-agent | @tier2-technical-agent | Tier 1 scope exceeded | Escalation brief (via @support-lead) |
| @tier1-support-agent | @quality-assurance-analyst | Ticket resolved | Resolution for QA review |
| @tier2-technical-agent | @quality-assurance-analyst | Escalation resolved | Resolution + RCA for QA review |
| @tier2-technical-agent | @knowledge-base-curator | Technical findings | RCA details for KB article creation |
| @tier1-support-agent | @knowledge-base-curator | KB gap found | Gap report with ticket references |
| @knowledge-base-curator | @quality-assurance-analyst | Article ready | New/updated article for content review |
| @quality-assurance-analyst | @support-lead | Quality report | Sprint quality metrics and recommendations |
| @support-lead | Human Principal | Escalation needed | Issue context, options, recommendation |

---

## Shared Memory Files

| File | Owner | Purpose | Access |
|------|-------|---------|--------|
| ticket-tracker.md | @support-lead | Ticket status, assignments, SLA tracking | Read/Write: all roles |
| knowledge-base-index.md | @knowledge-base-curator | KB article catalog, taxonomy, metadata | Read: all roles; Write: @knowledge-base-curator |
| escalation-playbook.md | @support-lead | Escalation criteria, procedures, patterns | Read: all roles; Write: @support-lead |

---

## Cross-Department Interfaces

| Department | Liaison | Purpose | Communication Channel |
|------------|---------|---------|----------------------|
| Product Engineering | @support-lead | Bug reports, feature requests, system diagnostics | Telegram/Slack @agentname tags |
| Customer Success | @support-lead | Account context, customer sentiment, relationship history | Telegram/Slack @agentname tags |
| Sales | @support-lead | Pre-sales support queries, prospect technical questions | Telegram/Slack @agentname tags |

All cross-department communication routes through @support-lead unless
explicitly pre-authorized for direct specialist contact.

---

## Daily Operating Rhythm

### Morning
1. **@support-lead** collects async status from all specialists (HB-1)
2. **@tier1-support-agent** checks ticket queue and acknowledges assignments (HB-1)
3. **@tier2-technical-agent** reviews escalation queue (HB-1)
4. **@knowledge-base-curator** performs content gap scan (HB-1)
5. **@quality-assurance-analyst** checks review queue and CSAT monitoring (HB-1, HB-2)
6. **@support-lead** compiles and posts daily standup to Mission Control

### Midday
- Active ticket resolution (@tier1-support-agent, @tier2-technical-agent)
- Quality reviews (@quality-assurance-analyst)
- Content production (@knowledge-base-curator)
- Health scans and escalation review (@support-lead)

### Evening
- Status compilation and reporting (all roles → @support-lead)
- Knowledge transfer and KB updates (@tier2-technical-agent → @knowledge-base-curator)
- Cross-department alignment check (@support-lead)
- Process improvement analysis (@quality-assurance-analyst)

---

## Squad-Level KPIs

| KPI | Target | Owner |
|-----|--------|-------|
| First Response Time | ≤ 1 interaction turn | @tier1-support-agent |
| Tier 1 Resolution Rate | ≥ 70 % | @tier1-support-agent |
| Escalated Resolution Rate | ≥ 95 % | @tier2-technical-agent |
| CSAT Score | ≥ 4.5/5 | @quality-assurance-analyst |
| SLA Adherence | ≥ 98 % | @support-lead |
| KB Coverage of Top Issues | ≥ 90 % | @knowledge-base-curator |
| Ticket Resolution Rate | ≥ 95 % per sprint | @support-lead |
| Repeat Ticket Rate | ≤ 5 % | @knowledge-base-curator |

---

## Role Definition Files (per role)

Each role directory contains 8 definition files:
1. **IDENTITY.md** — role title, designation, responsibilities, KPIs, boundaries
2. **SOUL.md** — personality, autonomy model, collaboration model, emotional signature
3. **skills.md** — 3-tier tool access model, anti-patterns
4. **STYLE.md** — tone pillars, output templates, language rules
5. **GOALS.md** — OKRs, collaboration goals, health metrics
6. **CONSTRAINTS.md** — hard boundaries (C1-C4), violation protocol
7. **EVOLUTION.md** — self-reflection protocol, change proposals, history
8. **HEARTBEAT.md** — proactive idle behaviors (HB-1 to HB-5), anti-idle guarantee

---

## Sources & Inspirations
- OpenClaw customer support squad architecture (elite 5-role configuration)
- Meta-Intelligence Guide v2 — multi-agent orchestration framework
- Pantheon hierarchical authority model
