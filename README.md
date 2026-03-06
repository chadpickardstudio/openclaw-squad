# OpenClaw Squad

AI consultancy system for deploying autonomous agent teams to small businesses and solo founders.

**Read the full mission:** [MISSION.md](MISSION.md)

---

## Repository Structure

| Directory | Purpose | Status |
|-----------|---------|--------|
| `research/` | 26 deep research documents covering agent architecture, security, coordination, cost, memory, evolution, deployment, testing, and more. The knowledge foundation for everything we build. | Complete |
| `agents/` | Universal agent library. 14 fully configured specialist roles (Lead + 13 specialists) organized by department, each with SOUL.md, IDENTITY.md, TOOLS.md, config.json5, and more. | Complete |
| `squads/` | 3 production-ready squad templates — The Operator (4 agents), The Department (8-10 agents), The Marketing Machine (12-14 agents). | Complete |
| `discovery/` | Client onboarding pipeline. Assessment questionnaire, squad router logic, and onboarding packet template. | Complete |
| `squad-blueprints/` | Per-vertical team compositions. Pre-built squad configs for specific business types (gym, law firm, restaurant, etc.). | Framework only — to be built |

## Workflow

```
Discovery → Squad Selection → Configuration → Deployment → Testing → Launch → Evolution
```

1. **Discovery** — Run the assessment questionnaire with the founder (`discovery/01`)
2. **Squad Selection** — Router maps their needs to a squad template (`discovery/02`)
3. **Configuration** — Customize agent identities, goals, and tool access per deployment
4. **Deployment** — Follow the deployment playbook (`research/23`) to stand up the squad
5. **Testing** — Validate with the 8-phase testing checklist (`research/25`)
6. **Launch** — Deliver the onboarding packet (`discovery/03`) and go live
7. **Evolution** — Squad runs autonomously; agents evolve and improve over time

## Research Library

The `/research/` directory contains the foundational research that informs every agent blueprint and squad configuration:

| # | Topic | Key Takeaway |
|---|-------|-------------|
| 01 | Folder Structure | Two-layer architecture, per-agent workspace isolation |
| 02 | Skills | SKILL.md format, dynamic tool provisioning, security vetting |
| 03 | API Cost | Hybrid model routing, under $10-15/month for full squads |
| 04 | Independence | Per-agent isolation is non-negotiable, shared state fails |
| 05 | Coordination | Loose binding-based dispatch, Lead routes dynamically |
| 06 | Security | Docker sandboxing, tool policies, secrets vault, prompt guards |
| 07 | Hybrid Setup | Premium cloud for Lead, cost-effective models for workers |
| 08 | Prompt Engineering | SOUL.md patterns, anti-yes-man, reflection loops |
| 09 | Context Management | Layered memory (L1-L4), auto-compaction, vector search |
| 10 | Error Recovery | Fallback chains, graceful degradation, self-healing |
| 11 | Personality Tuning | SOUL.md personality, conflict resolution, AURA protocol |
| 12 | Scalability | 5-19 agent ceilings, burnout prevention, horizontal scaling |
| 13 | Audit & Observability | OTel tracing, LangFuse, cost spike detection |
| 14 | Tool Chaining | Skill discovery, ClawHub marketplace, tiered approval |
| 15 | Backup & Rollback | Git snapshots, encrypted archives, disaster recovery |
| 16 | Testing Frameworks | Agent testing patterns, quality assurance |
| 17 | Legal Compliance | GDPR, CCPA, HIPAA guardrails, operator obligations |
| 18 | Model Migration | Model-agnostic architecture, zero-rewrite migration |
| 19 | Tool Access Tiering | 4-tier system, Lead grants capabilities progressively |
| 20 | Agent Evolution | Self-improvement loops, reflection, supervised growth |
| 21 | Lead-as-CEO | Orchestrator authority, tool granting, squad oversight |
| 22 | Agent Roster & Org Chart | Revised 14-agent roster, department structure, deployment scenarios |
| 23 | Deployment Playbook | Sequential deployment checklist, security lockdown, testing gates |
| 24 | Skills Blueprint | Skill generation methodology, tiering system, integration patterns |
| 25 | Testing & Validation Checklist | 8-phase pre-launch verification, go/no-go decision framework |
| 26 | All-Anthropic Model Strategy | Opus (Lead) + Sonnet (workers) + Haiku (budget tasks) |

## Squad Templates

3 pre-configured squad tiers in `/squads/`, each with `openclaw.json5`, shared comms layer, and per-agent inboxes:

| Squad | Agents | For | Est. Cost |
|-------|--------|-----|-----------|
| **The Operator** | 4 (Lead, Content Creator, Sales Rep, Client Manager) | Solo founders, small businesses getting started | $3-8/month |
| **The Department** | 8-10 (adds Bookkeeper, Ops Manager, Support Agent, Social Media Manager) | Established small businesses (5-20 employees) | $5-12/month |
| **The Marketing Machine** | 12-14 (adds Email Marketer, Market Researcher, Data Analyst, Strategist) | Marketing-heavy businesses, agencies, DTC brands | $6-15/month |

## Agent Library

14 universal, portable agent roles organized by department. Each agent has 9 configuration files (SOUL.md, IDENTITY.md, AGENTS.md, HEARTBEAT.md, MEMORY.md, TOOLS.md, config.json5, USER.md, README.md):

### C-Suite
| # | Agent | Capability |
|---|-------|-----------|
| 00 | Lead | Squad orchestrator, task routing, quality enforcement, tool granting |
| 01 | Strategist | Business strategy, campaigns, growth planning |
| 02 | Engineer | Technical builds, integrations, automation |
| 03 | Bookkeeper | Invoicing, expenses, cash flow, financial tracking |
| 04 | Ops Manager | Process optimization, vendors, scheduling, admin |

### Marketing
| # | Agent | Capability |
|---|-------|-----------|
| 05 | Content Creator | Long-form content, SEO, landing pages, brand voice |
| 06 | Social Media Manager | Post scheduling, engagement, community management |
| 07 | Email Marketer | Sequences, segmentation, A/B testing |
| 08 | Market Researcher | Keywords, competitive intel, content briefs |
| 09 | Data Analyst | Reporting, dashboards, ROI tracking |

### Sales
| # | Agent | Capability |
|---|-------|-----------|
| 10 | Sales Rep | Prospecting, outreach, follow-up, pipeline |
| 11 | Client Manager | Onboarding, retention, relationships, upsells |

### Operations
| # | Agent | Capability |
|---|-------|-----------|
| 12 | Support Agent | Customer support, tickets, FAQ, escalation |
| 13 | Compliance Officer | Regulatory, data privacy, legal compliance |

### Archived
3 agents in `agents/_archived/` (Recruiter, Designer, System Architect) — removed from active roster with documented rationale.

## Discovery Pipeline

Complete client onboarding flow in `/discovery/`:

1. **Assessment Questionnaire** (`01`) — 15-20 min structured conversation guide
2. **Assessment-to-Squad Router** (`02`) — Decision logic converting assessment answers → deployment spec
3. **Onboarding Packet** (`03`) — Client-facing welcome doc delivered post-deployment

---

Built by Chad Pickard Studio.
