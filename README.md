# OpenClaw Squad Factory

> **Elite AI Departments for Any Business — Mix and Match to Build Custom Client Teams**

Built on 21 deep research topics. One prompt → full squad ready to work.

---

## What Is This?

OpenClaw Squad Factory is a research-backed blueprint system for launching
production-grade multi-agent AI squads using [OpenClaw](https://docs.openclaw.ai).
Every blueprint in this repo is grounded in 21 deep-dive research topics covering
agent architecture, coordination, security, memory, evolution, cost optimization,
and the Lead-as-CEO paradigm.

The factory ships two complementary systems:

1. **Departments** — self-contained business units (Sales, Marketing, Finance,
   etc.) each with their own blueprint, roles, and coordination patterns
2. **Role Definitions** — individual specialist agents that can be mixed across
   departments or assembled into custom squads

**Mix any departments to create custom client teams.** Need a startup package?
Combine Executive Leadership + Product Engineering + Marketing. Need an
enterprise ops team? Combine Operations + Finance + Legal Compliance +
Data Analytics. The system is modular by design.

---

## Departments

Eleven production-ready department blueprints, each a complete business unit:

| # | Department | Folder | Focus |
|---|-----------|--------|-------|
| 01 | Executive Leadership | [`departments/executive-leadership/`](openclaw-squad-v1/departments/executive-leadership/) | C-suite strategy, vision, cross-dept coordination |
| 02 | Sales | [`departments/sales/`](openclaw-squad-v1/departments/sales/) | Pipeline, prospecting, closing, revenue targets |
| 03 | Marketing | [`departments/marketing/`](openclaw-squad-v1/departments/marketing/) | Campaigns, brand, content, demand generation |
| 04 | Customer Success | [`departments/customer-success/`](openclaw-squad-v1/departments/customer-success/) | Onboarding, adoption, expansion, retention |
| 05 | Customer Support | [`departments/customer-support/`](openclaw-squad-v1/departments/customer-support/) | Tickets, SLAs, knowledge base, escalation |
| 06 | Operations | [`departments/operations/`](openclaw-squad-v1/departments/operations/) | Infrastructure, processes, efficiency, uptime |
| 07 | Finance | [`departments/finance/`](openclaw-squad-v1/departments/finance/) | Budgets, forecasting, billing, financial reporting |
| 08 | HR & People | [`departments/hr-people/`](openclaw-squad-v1/departments/hr-people/) | Hiring, culture, performance, team health |
| 09 | Legal & Compliance | [`departments/legal-compliance/`](openclaw-squad-v1/departments/legal-compliance/) | Contracts, regulatory, privacy, risk management |
| 10 | Data & Analytics | [`departments/data-analytics/`](openclaw-squad-v1/departments/data-analytics/) | BI, metrics, data pipelines, insights |
| 11 | Product & Engineering | [`departments/product-engineering/`](openclaw-squad-v1/departments/product-engineering/) | Product strategy, design, development, QA |

Each department folder contains a `department-blueprint.md` that will be
populated with elite-grade role definitions, coordination patterns, and
ready-to-deploy configurations.

---

## Role Definitions (Layer 1.5)

Seven elite specialist roles, each defined across 8 configuration files:

| # | Role | Folder |
|---|------|--------|
| 01 | Lead CEO | [`role-definitions/01-lead-ceo/`](openclaw-squad-v1/role-definitions/01-lead-ceo/) |
| 02 | Product Strategist | [`role-definitions/02-product-strategist/`](openclaw-squad-v1/role-definitions/02-product-strategist/) |
| 03 | Product Designer | [`role-definitions/03-product-designer/`](openclaw-squad-v1/role-definitions/03-product-designer/) |
| 04 | System Architect | [`role-definitions/04-system-architect/`](openclaw-squad-v1/role-definitions/04-system-architect/) |
| 05 | Builder | [`role-definitions/05-builder/`](openclaw-squad-v1/role-definitions/05-builder/) |
| 06 | Ops Guardian | [`role-definitions/06-ops-guardian/`](openclaw-squad-v1/role-definitions/06-ops-guardian/) |
| 07 | Growth & Compliance Specialist | [`role-definitions/07-growth-compliance-specialist/`](openclaw-squad-v1/role-definitions/07-growth-compliance-specialist/) |

Each role includes: `IDENTITY.md`, `SOUL.md`, `skills.md`, `STYLE.md`,
`GOALS.md`, `CONSTRAINTS.md`, `EVOLUTION.md`, `HEARTBEAT.md`

---

## Squad Blueprints

| # | Blueprint | Agents | Best For |
|---|-----------|--------|----------|
| 01 | [Elite Software & App Development Team](openclaw-squad-v1/squad-blueprints/01-software-app-team.md) | 7 | Building any web/app/software product from idea to full launch |

*More blueprints coming — each one is a complete, copy-paste-ready squad.*

---

## Research Foundation

All blueprints are built on the `/research` directory containing 21 deep-dive
topics. Key research that directly powers every blueprint:

- **Topic 3–5**: Multi-agent coordination, bindings, session routing
- **Topic 6**: Security sandboxing, ClawVault secrets, tool policies
- **Topic 9**: Memory hygiene, distillation, context management
- **Topic 12**: Scalability — optimal squad sizes, hierarchical Leads
- **Topic 19**: Tool tiering — safe auto-grant vs. human-gated
- **Topic 20**: Agent evolution — reflection loops, self-improvement
- **Topic 21**: Lead-as-CEO — autonomous tool grants, enabling growth

---

## Quick Start

1. **Pick a department** from the table above — or combine multiple
2. **Pick roles** from role-definitions/ to staff your department
3. Copy the configuration into Claude Code or your OpenClaw CLI
4. Your squad spins up, ready to work

---

## Repository Structure

```
openclaw-squad/
├── README.md                              ← You are here
├── openclaw-squad-v1/
│   ├── departments/                       ← 11 business unit blueprints
│   │   ├── executive-leadership/
│   │   ├── sales/
│   │   ├── marketing/
│   │   ├── customer-success/
│   │   ├── customer-support/
│   │   ├── operations/
│   │   ├── finance/
│   │   ├── hr-people/
│   │   ├── legal-compliance/
│   │   ├── data-analytics/
│   │   └── product-engineering/
│   ├── role-definitions/                  ← 7 elite specialist roles (8 files each)
│   ├── squad-blueprints/                  ← Ready-to-spin squad configs
│   ├── research/                          ← 21 deep-dive research topics
│   ├── agents/                            ← Agent templates
│   ├── blueprints/                        ← Architecture blueprints
│   ├── decisions/                         ← Design decisions
│   ├── scripts/                           ← Automation scripts
│   └── spec/                              ← Specifications
```

---

**Built for Chad Pickard Studio Agency**
