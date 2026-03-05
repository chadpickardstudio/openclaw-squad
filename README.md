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

## Agents — Single Source of Truth

All elite agent roles live in `agents/` grouped by department.
Each role has its own folder with 8 elite files:
`IDENTITY.md`, `SOUL.md`, `skills.md`, `STYLE.md`,
`GOALS.md`, `CONSTRAINTS.md`, `EVOLUTION.md`, `HEARTBEAT.md`

Each department folder also contains a `department-blueprint.md` describing
how the department operates, its coordination patterns, and deploy configs.

| # | Department | Folder | Status |
|---|-----------|--------|--------|
| 01 | Executive Leadership | [`agents/executive-leadership/`](openclaw-squad-v1/agents/executive-leadership/) | Blueprint ready, roles pending |
| 02 | Sales | [`agents/sales/`](openclaw-squad-v1/agents/sales/) | Blueprint ready, roles pending |
| 03 | Marketing | [`agents/marketing/`](openclaw-squad-v1/agents/marketing/) | Blueprint ready, roles pending |
| 04 | Customer Success | [`agents/customer-success/`](openclaw-squad-v1/agents/customer-success/) | Blueprint ready, roles pending |
| 05 | Customer Support | [`agents/customer-support/`](openclaw-squad-v1/agents/customer-support/) | Blueprint ready, roles pending |
| 06 | Operations | [`agents/operations/`](openclaw-squad-v1/agents/operations/) | Blueprint ready, roles pending |
| 07 | Finance | [`agents/finance/`](openclaw-squad-v1/agents/finance/) | Blueprint ready, roles pending |
| 08 | HR & People | [`agents/hr-people/`](openclaw-squad-v1/agents/hr-people/) | Blueprint ready, roles pending |
| 09 | Legal & Compliance | [`agents/legal-compliance/`](openclaw-squad-v1/agents/legal-compliance/) | Blueprint ready, roles pending |
| 10 | Data & Analytics | [`agents/data-analytics/`](openclaw-squad-v1/agents/data-analytics/) | Blueprint ready, roles pending |
| 11 | Product & Engineering | [`agents/product-engineering/`](openclaw-squad-v1/agents/product-engineering/) | 7 elite roles complete |

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
├── agents/                              ← SINGLE SOURCE OF TRUTH
│   ├── executive-leadership/
│   │   ├── department-blueprint.md
│   │   └── 01-ceo/                      (8 files each, when populated)
│   ├── sales/
│   │   ├── department-blueprint.md
│   │   └── 01-sales-dev-rep/            (pending)
│   ├── marketing/
│   ├── customer-success/
│   ├── customer-support/
│   ├── operations/
│   ├── finance/
│   ├── hr-people/
│   ├── legal-compliance/
│   ├── data-analytics/
│   └── product-engineering/
│       ├── department-blueprint.md
│       ├── 01-lead-ceo/                 (8 files)
│       ├── 02-product-strategist/       (8 files)
│       ├── 03-product-designer/         (8 files)
│       ├── 04-system-architect/         (8 files)
│       ├── 05-builder/                  (8 files)
│       ├── 06-ops-security-guardian/    (8 files)
│       └── 07-growth-compliance/        (8 files)
├── squad-blueprints/                    ← Custom client mixes
├── research/                            ← 21 deep-dive topics
├── decisions/                           ← ADRs
└── spec/                                ← Living Specification
```

---

**Built for Chad Pickard Studio Agency**
