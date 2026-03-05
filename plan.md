# What's Wrong With Our Current Agent System

## The Core Problem

**Our agents are department-locked. They should be business-universal.**

The research says agents should be **reusable, capability-based entities** that a Lead routes dynamically per-task. But we built them as **department citizens** hardwired to sister agents, department leads, and internal handoff chains.

When a gym founder walks in, we can't just assemble a squad. We have to mentally cherry-pick from 10 different departments, ignore all the @agentname cross-references that will break, and pretend the agents don't expect their 4 department siblings to exist.

---

## The 5 Specific Problems

### Problem 1: Agents Are Welded to Departments (Not Portable)

Every IDENTITY.md says things like:
- "Position 3 of 05 in the Marketing Squad"
- "Reports to: Marketing Strategist (01)"
- "Handoff to @retention-strategist for lifecycle stage 3"

If we pull the Social Executor out of Marketing and put it in a gym squad, its IDENTITY.md still references @marketing-researcher, @creative-director, @analytics-specialist — agents that don't exist in that squad. Its handoff protocols break. Its KPI table references the Marketing department blueprint.

**What the research says:** "No fixed DAGs... Tasks flow based on runtime assessment. The Lead only intervenes for ambiguous or multi-step tasks." Agents should be routed by the Lead per-task, not pre-wired to 4 specific siblings.

### Problem 2: Department Blueprints Are Monolithic (All-or-Nothing)

Every department blueprint assumes all 5 agents run together as a unit:
- "operates as an elite 5-role autonomous squad"
- Shared memory files owned by the department lead
- Quality gates that require the department lead's approval
- Squad-level health metrics measured as a unit

You can't deploy 2 out of 5 Customer Success agents. The blueprint assumes all 5 exist. The lead expects 4 direct reports. The handoff chain has gaps if you remove one.

**What the research says:** "The cheapest, fastest, most maintainable coordination is the one that lets agents work independently with minimal coupling. The Lead is the only coupling point."

### Problem 3: Too Many Leads (10 Department Leads + 1 CEO = 11 Leads)

Our system has:
- 1 Lead CEO (product-engineering/01-lead-ceo)
- 1 Marketing Strategist (acts as marketing lead)
- 1 CS Lead
- 1 Support Lead
- 1 Analytics Lead
- 1 Finance Lead
- 1 HR Lead
- 1 Legal Lead
- 1 Ops Lead
- 1 Chief of Staff
- 1 Sales Manager

That's 11 coordination/management agents. The research says **1 Lead per 4-8 specialists** max. If a gym founder needs 6 agents, they get 1 Lead + 5 specialists. They don't need a Marketing Lead AND a CS Lead AND a Sales Manager all managing 1-2 people each.

**What the research says:** "The sweet spot is 1 Lead + 4-8 specialists." One Lead, one gateway. Department leads are middle-management overhead that doesn't exist in the research model.

### Problem 4: Agents Can't Grow Because Their Identity Is Pre-Baked

The research describes a graduated trust model:
```
Day 1:   Tier 1 (read-only safe tools)
Week 1:  Lead grants Tier 2 after 10 successful operations
Week 2:  Agent earns Tier 3 based on reflection
Week 4+: Full autonomous operation at granted tier
```

But our agents have fixed skills.md files with pre-assigned Tier 1/2/3 tools. Their GOALS.md has pre-written OKRs. Their CONSTRAINTS.md has department-specific rules. The Lead can't reshape them for a different business because their identity files assume a specific department context.

**What the research says:** "Agents earn capabilities through demonstrated competence... Rigid tool policies create straight-jacket automations that break in practice."

### Problem 5: No Universal Agent Library (The Actual Product Gap)

What we HAVE: 10 departments × 4-5 agents = ~48 department-locked roles
What we NEED: A library of ~15-20 universal agent CAPABILITIES that can be mixed into any squad

Example: We don't need "Marketing/04-Social-Executor" (locked to Marketing department, reports to Marketing Strategist, references @creative-director). We need a **"Content Creator"** agent that:
- Has a SOUL.md defining its personality as a content specialist
- Has skills for social media, copywriting, visual content
- Reports to whoever the Lead is in THIS squad
- Has no hardcoded @agentname references
- Can create gym content, law firm content, restaurant content — whatever the client needs

---

## What The System Should Look Like

### Current Structure (Department-Locked)
```
agents/
├── marketing/          ← department silo
│   ├── 01-strategist         ← department lead (overhead)
│   ├── 02-researcher
│   ├── 03-creative-director
│   ├── 04-social-executor    ← locked to marketing siblings
│   └── 05-analytics-specialist
├── customer-success/   ← another department silo
│   ├── 01-cs-lead            ← another department lead (overhead)
│   ├── 02-onboarding-specialist  ← locked to CS siblings
│   └── ...
└── (8 more departments)
```

### Proposed Structure (Universal Agent Library)
```
agents/
├── 00-lead/                  ← ONE Lead role (the CEO)
├── 01-content-creator/       ← was marketing/04-social-executor + marketing/03-creative-director
├── 02-market-researcher/     ← was marketing/02-researcher + marketing/05-analytics
├── 03-sales-rep/             ← was sales/01-SDR + sales/02-account-executive
├── 04-client-onboarder/      ← was customer-success/02-onboarding-specialist
├── 05-client-retainer/       ← was customer-success/03-retention-strategist
├── 06-support-agent/         ← was customer-support/02-tier1 + 03-tier2
├── 07-strategist/            ← was marketing/01-strategist (without department lead duties)
├── 08-data-analyst/          ← was data-analytics/03-BI-analyst + 04-data-scientist
├── 09-bookkeeper/            ← was finance/02-analyst + 03-AP-AR
├── 10-ops-manager/           ← was operations/02-process + 04-facilities
├── 11-recruiter/             ← was hr/02-talent-acquisition
├── 12-compliance-officer/    ← was legal/03-regulatory + 04-ip-privacy
├── 13-engineer/              ← was product-engineering/05-builder
├── 14-designer/              ← was product-engineering/03-product-designer
├── 15-system-architect/      ← was product-engineering/04-system-architect
└── (more as needed)
```

Each agent:
- Reports to "the Lead" (not a department lead)
- Has NO hardcoded @agentname references to siblings
- Has skills that are business-agnostic (content creation, not "marketing squad content")
- Starts at Tier 1 tools; the Lead grants more based on performance
- Can be mixed into ANY squad blueprint

### Squad Blueprints Become the Product
```
squad-blueprints/
├── 01-software-app-team.md      → Lead + Strategist + Designer + Engineer + Architect + Ops
├── 02-gym-business.md           → Lead + Content Creator + Sales Rep + Client Onboarder + Client Retainer
├── 03-law-firm.md               → Lead + Compliance Officer + Client Onboarder + Content Creator + Bookkeeper
├── 04-restaurant.md             → Lead + Content Creator + Ops Manager + Bookkeeper + Sales Rep
├── 05-ecommerce.md              → Lead + Content Creator + Sales Rep + Data Analyst + Engineer
├── 06-agency.md                 → Lead + Strategist + Content Creator + Designer + Data Analyst + Sales Rep
└── (any business vertical)
```

Each blueprint just lists which agents from the universal library to include, plus business-specific tool tiering and coordination rules. The agents themselves are plug-and-play.

---

## Summary of Changes Needed

| What | Current State | Target State |
|------|--------------|--------------|
| Agent identity | Department-locked, @agentname hardcoded | Universal, reports to "the Lead" |
| Department leads | 10 middle-management leads | Eliminated — 1 Lead per squad |
| Department blueprints | Monolithic all-or-nothing units | Removed — replaced by squad blueprints |
| Agent count | ~48 department-specific roles | ~15-20 universal capabilities |
| Squad blueprints | 1 example (software team) | Many (one per business vertical) |
| Tool tiering | Pre-baked in skills.md per department | Starts minimal; Lead grants based on performance |
| Handoff protocols | Fixed chains within departments | Dynamic — Lead routes per-task |
| @agentname references | Hardcoded to specific siblings | None — Lead handles all routing |

---

## What This Means Practically

The `/agents/` directory becomes a **menu**. When a gym founder comes in, we pick 5-6 items from the menu, wire them under a Lead, and hand them a squad blueprint. The agents don't know or care that they're in a gym squad vs a law firm squad — they just do their capability (content creation, sales outreach, client retention, etc.) and the Lead routes work between them based on the specific business context.

That's what the research envisioned. That's what we should build.
