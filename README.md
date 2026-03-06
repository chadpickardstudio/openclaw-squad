# OpenClaw Squad

AI consultancy system for deploying autonomous agent teams to small businesses and solo founders.

**Read the full mission:** [MISSION.md](MISSION.md)

---

## Repository Structure

| Directory | Purpose | Status |
|-----------|---------|--------|
| `research/` | 21 deep research documents covering agent architecture, security, coordination, cost, memory, evolution, and more. The knowledge foundation for everything we build. | Complete |
| `agents/` | Universal agent library. 15 portable specialist roles (Lead + 14 specialists) that can be mixed and matched into any squad. | Scaffolded — blueprints pending |
| `squad-blueprints/` | Per-vertical team compositions. Pre-built squad configs for specific business types (gym, law firm, restaurant, etc.). | Pending |
| `discovery/` | Client onboarding templates. Frameworks for running discovery sessions and mapping business needs to agent squads. | Pending |

## Workflow

```
Discovery → Team Selection → Configuration → Deployment → Ongoing Evolution
```

1. Meet the founder, understand their business
2. Select agents from the universal library
3. Configure each agent's identity, goals, constraints, and skills
4. Deploy the squad connected to the founder's tools and channels
5. Squad runs autonomously; agents evolve and improve over time

## Research Library

The `/research/` directory contains the foundational research that informs every agent blueprint and squad configuration:

| # | Topic | Key Takeaway |
|---|-------|-------------|
| 01 | Folder Structure | Two-layer architecture, per-agent workspace isolation |
| 02 | Skills | SKILL.md format, dynamic tool provisioning, security vetting |
| 03 | API Cost | Hybrid model routing, under $10/month for full squads |
| 04 | Independence | Per-agent isolation is non-negotiable, shared state fails |
| 05 | Coordination | Loose binding-based dispatch, Lead routes dynamically |
| 06 | Security | Docker sandboxing, tool policies, secrets vault, prompt guards |
| 07 | Hybrid Setup | Premium cloud for Lead, free local models for workers |
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

## Agent Library

15 universal, portable agent roles. Each agent is business-agnostic and reports to whichever Lead is in their squad:

| # | Agent | Capability |
|---|-------|-----------|
| 00 | Lead | Squad orchestrator, task routing, quality enforcement |
| 01 | Content Creator | Social media, copywriting, visual content, brand voice |
| 02 | Market Researcher | Competitor analysis, trends, audience insights |
| 03 | Sales Rep | Prospecting, outreach, follow-up, pipeline |
| 04 | Client Manager | Onboarding, retention, relationships |
| 05 | Support Agent | Customer support, FAQ, escalation |
| 06 | Strategist | Business strategy, campaigns, growth |
| 07 | Data Analyst | Reporting, dashboards, performance analysis |
| 08 | Bookkeeper | Invoicing, expenses, financial tracking |
| 09 | Ops Manager | Process optimisation, vendors, logistics |
| 10 | Recruiter | Talent sourcing, screening, coordination |
| 11 | Compliance Officer | Regulatory, data privacy, legal |
| 12 | Engineer | Technical builds, integrations, automation |
| 13 | Designer | UI/UX, visual assets, brand materials |
| 14 | System Architect | Infrastructure, security, scaling |

---

Built by Chad Pickard Studio.
