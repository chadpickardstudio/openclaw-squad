# 01 — Elite Software & App Development Team (7 Agents)

**Best For:** Building any web/app/software product from idea to full launch and beyond
**Optimal Size:** 7 agents (1 Lead + 6 specialists) — stays under the "one Lead per 4-6" rule

---

## The Squad

- **Lead (CEO Agent)** — Decomposes tasks, routes work, grants tools/APIs/email autonomously, enables growth, synthesizes results
- **Product Strategist** — Roadmap, user research, prioritization
- **Product Designer** — UX research, wireframes, prototypes, user flows
- **System Architect** — Technical design, tech stack, scalability & migration
- **Builder (Full-Stack Engineer)** — Codes frontend, backend, mobile, integrations
- **Ops & Security Guardian** — DevOps, CI/CD, security, compliance, backups, observability
- **Growth & Compliance Specialist** — Marketing, analytics, testing, legal guardrails, launch campaigns

---

## Why This Structure Wins

- Based directly on all 21 research topics (independence, Lead-as-CEO autonomy, evolution loops, security, cost optimization, etc.)
- Loose coordination — no over-engineering
- Full tool tiering + self-improvement enabled by the Lead
- Each specialist owns a clear domain with minimal overlap
- The Lead handles grant decisions, delegation, and evolution reviews — humans only approve high-risk items
- Agents grow over time: reflection loops surface bottlenecks, Lead provisions new tools proactively

---

## Squad Architecture

```
                        ┌──────────────────┐
                        │   Lead (CEO)     │
                        │ Routes, grants,  │
                        │ synthesizes      │
                        └────────┬─────────┘
               ┌────────┬───────┼───────┬────────┬────────┐
               ▼        ▼       ▼       ▼        ▼        ▼
          ┌────────┐┌───────┐┌──────┐┌───────┐┌───────┐┌───────┐
          │Product ││Product││System││Builder││Ops &  ││Growth │
          │Strate- ││Design-││Archi-││(Full- ││Securi-││& Com- │
          │gist    ││er     ││tect  ││Stack) ││ty     ││plianc │
          └────────┘└───────┘└──────┘└───────┘└───────┘└───────┘
```

---

## Tool Tiering for This Squad

| Agent | Tier 1 (Day 1) | Tier 2 (Week 1) | Tier 3 (Week 2+) | Tier 4 (Human Approval) |
|---|---|---|---|---|
| Lead | fs_read all agents, sessions_* | fs_write agent skills/ | budget.yaml write | — |
| Product Strategist | web_search, notion_read | analytics_read | notion_write | — |
| Product Designer | figma_read, web_search | figma_write | user_testing_tools | — |
| System Architect | github_read, docs_search | github_pr_draft | infra_provisioning | AWS/GCP write |
| Builder | github_read, code_exec | github_push, npm/pip | database_write | production deploy |
| Ops & Security | logs_read, metrics_read | ci_cd_trigger | secrets_rotate | root/shell exec |
| Growth & Compliance | analytics_read, web_search | email_draft | ad_platform_write | email_send, payments |

---

## Evolution Loop Schedule

```markdown
## HEARTBEAT.md — Weekly Evolution Review
cron: "0 0 * * 0"  # Every Sunday midnight

1. Read all agents' reflection.md files.
2. Assess bottlenecks and pending evolution proposals.
3. Run 4-pillar grant framework on each proposal.
4. Auto-grant safe tools; escalate high-risk to human.
5. Distribute cross-agent learnings via sessions_send.
6. Draft "CEO Weekly Report" → send to human admin.
```

---

## One-Click Build Prompt (copy-paste ready)

Copy this entire prompt and paste it into Claude Code or your OpenClaw CLI.
It will spin up the full 7-agent squad with proper SOUL.md files, tool
tiering, evolution loops, and security guardrails.

```
You are setting up an OpenClaw multi-agent squad for elite software and app
development. Create the following 7-agent squad with proper isolation,
tool tiering, and evolution support.

## Step 1: Create All Agents

openclaw agents add lead-ceo --model anthropic/claude-opus-4-6
openclaw agents add product-strategist --model anthropic/claude-sonnet-4-6
openclaw agents add product-designer --model anthropic/claude-sonnet-4-6
openclaw agents add system-architect --model anthropic/claude-sonnet-4-6
openclaw agents add builder --model anthropic/claude-sonnet-4-6
openclaw agents add ops-security --model anthropic/claude-sonnet-4-6
openclaw agents add growth-compliance --model anthropic/claude-haiku-4-5

## Step 2: Lead CEO SOUL.md

Write to ~/.openclaw/.agents/lead-ceo/soul.md:

You are the Lead/CEO of this software development squad. You never write
code, design UI, or do manual work. You decompose goals into agent tasks,
route via sessions_send, grant tools autonomously (safe = auto, risky =
human approval), review reflections weekly, and synthesize final outputs.
Use the 4-pillar grant framework: performance, budget, security, growth.
Maintain trigger-hygiene: monitor via files, not constant messages.
This file is yours to evolve via reflection.

## Step 3: Lead TOOLS.md

Write to ~/.openclaw/.agents/lead-ceo/TOOLS.md:

tools:
  - name: fs_write
    allowed_paths:
      - "~/.openclaw/.agents/*/skills/"
      - "~/.openclaw/.agents/*/workspace/TOOLS.md"
  - name: fs_read
    allowed_paths:
      - "~/.openclaw/.agents/*/reflection.md"
      - "~/.openclaw/.agents/*/MEMORY.md"
      - "~/.openclaw/.agents/*/EVOLUTION.md"
  - name: sessions_spawn
  - name: sessions_send
  - name: sessions_list

## Step 4: Specialist SOUL.md Files

For each specialist, write a SOUL.md that:
- Defines their role and domain clearly
- Includes: "Write dated reflection entries to reflection.md after
  every major task. Propose evolution when you identify bottlenecks."
- Includes: "Request new tools from @lead-ceo via agentToAgent when
  your current toolset limits your output."

## Step 5: HEARTBEAT.md (Evolution Cron)

Write to ~/.openclaw/.agents/lead-ceo/HEARTBEAT.md:

Schedule: cron "0 0 * * 0"
Task: Read all reflection.md files, assess bottlenecks, run 4-pillar
grant framework on pending proposals, auto-grant safe tools, escalate
high-risk to human, draft weekly CEO report.

## Step 6: Restart Gateway

openclaw gateway
```

---

*This blueprint is part of the [OpenClaw Squad Factory](../../README.md),
built on 21 deep-dive research topics for Chad Pickard Studio Agency.*
