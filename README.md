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

---

## Agents (Single Source of Truth)

All agent role definitions live under `agents/`, organized by department.
Each role has 8 files: `IDENTITY.md`, `SOUL.md`, `skills.md`, `STYLE.md`,
`GOALS.md`, `CONSTRAINTS.md`, `EVOLUTION.md`, `HEARTBEAT.md`

| # | Department | Folder | Roles |
|---|-----------|--------|-------|
| 01 | Executive Leadership | [`agents/executive-leadership/`](openclaw-squad-v1/agents/executive-leadership/) | CEO, Chief of Staff, … |
| 02 | Sales | [`agents/sales/`](openclaw-squad-v1/agents/sales/) | SDR, AE, Sales Ops, Sales Manager, … |
| 03 | Marketing | [`agents/marketing/`](openclaw-squad-v1/agents/marketing/) | Content, Demand Gen, Brand, … |
| 04 | Customer Success | [`agents/customer-success/`](openclaw-squad-v1/agents/customer-success/) | Onboarding, Adoption, Expansion, … |
| 05 | Customer Support | [`agents/customer-support/`](openclaw-squad-v1/agents/customer-support/) | Tickets, SLAs, Knowledge Base, … |
| 06 | Operations | [`agents/operations/`](openclaw-squad-v1/agents/operations/) | Infrastructure, Processes, Uptime, … |
| 07 | Finance | [`agents/finance/`](openclaw-squad-v1/agents/finance/) | Budgets, Forecasting, Billing, … |
| 08 | HR & People | [`agents/hr-people/`](openclaw-squad-v1/agents/hr-people/) | Hiring, Culture, Performance, … |
| 09 | Legal & Compliance | [`agents/legal-compliance/`](openclaw-squad-v1/agents/legal-compliance/) | Contracts, Regulatory, Privacy, … |
| 10 | Data & Analytics | [`agents/data-analytics/`](openclaw-squad-v1/agents/data-analytics/) | BI, Metrics, Data Pipelines, … |
| 11 | Product & Engineering | [`agents/product-engineering/`](openclaw-squad-v1/agents/product-engineering/) | 7 elite roles (Lead CEO, Strategist, Designer, Architect, Builder, Ops Guardian, Growth Specialist) |

---

## Department Blueprints

Lightweight recipes that reference `agents/` roles. Each describes how a
department operates, its coordination patterns, and ready-to-deploy configs.

| # | Blueprint |
|---|-----------|
| 01 | [`executive-leadership-department.md`](openclaw-squad-v1/department-blueprints/executive-leadership-department.md) |
| 02 | [`sales-department.md`](openclaw-squad-v1/department-blueprints/sales-department.md) |
| 03 | [`marketing-department.md`](openclaw-squad-v1/department-blueprints/marketing-department.md) |
| 04 | [`customer-success-department.md`](openclaw-squad-v1/department-blueprints/customer-success-department.md) |
| 05 | [`customer-support-department.md`](openclaw-squad-v1/department-blueprints/customer-support-department.md) |
| 06 | [`operations-department.md`](openclaw-squad-v1/department-blueprints/operations-department.md) |
| 07 | [`finance-department.md`](openclaw-squad-v1/department-blueprints/finance-department.md) |
| 08 | [`hr-people-department.md`](openclaw-squad-v1/department-blueprints/hr-people-department.md) |
| 09 | [`legal-compliance-department.md`](openclaw-squad-v1/department-blueprints/legal-compliance-department.md) |
| 10 | [`data-analytics-department.md`](openclaw-squad-v1/department-blueprints/data-analytics-department.md) |
| 11 | [`product-engineering-department.md`](openclaw-squad-v1/department-blueprints/product-engineering-department.md) |

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

1. **Pick a department** from the agents table above — or combine multiple
2. **Pick roles** from `agents/<department>/` to staff your team
3. Copy the configuration into Claude Code or your OpenClaw CLI
4. Your squad spins up, ready to work

---

## Repository Structure

```
openclaw-squad-v1/
├── agents/                          ← SINGLE SOURCE OF TRUTH for every elite agent role
│   ├── executive-leadership/
│   ├── sales/
│   ├── marketing/
│   ├── customer-success/
│   ├── customer-support/
│   ├── operations/
│   ├── finance/
│   ├── hr-people/
│   ├── legal-compliance/
│   ├── data-analytics/
│   └── product-engineering/         ← 7 elite roles (8 files each)
├── department-blueprints/           ← Lightweight recipes (references agents/)
│   ├── sales-department.md
│   ├── marketing-department.md
│   └── ...
├── squad-blueprints/                ← Custom client mixes
├── research/                        ← 21 deep-dive topics
├── decisions/                       ← Architectural Decision Records
└── spec/                            ← Living Specification
```

---

**Built for Chad Pickard Studio Agency**
