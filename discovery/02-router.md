# Assessment-to-Squad Router

> **OpenClaw Squad · Discovery Phase**
> Decision logic that converts assessment answers into a deployment specification
> Cross-references: Doc 22 (Agent Roster), Doc 23 (Deployment Playbook), Doc 24 (Skills Blueprint), Doc 03 (Cost)

---

## How to Use This Document

This document takes the completed assessment (`discovery/01-assessment-questionnaire.md`) and produces a **deployment specification** — the exact instructions that Doc 23 (Deployment Playbook) executes.

**Input:** Completed assessment questionnaire
**Output:** A deployment spec containing:
- Squad template selection
- Agent activation list with justification
- Skills to install per agent
- Model routing configuration
- Pre-populated USER.md content
- Pre-populated MEMORY.md content per agent
- Estimated monthly cost
- 90-day success criteria

**Process:** Work through Sections 1–7 in order. Each section takes assessment data and produces a deployment decision.

---

## 1. Squad Template Selection

### 1.1 Cost Context (Read First)

**Critical:** All squad cost estimates must reflect the full optimization stack from Doc 03 (API Cost Optimization). Without optimization, a 14-agent squad costs ~$95/month. With optimization, the same squad costs ~$6–15/month. The difference is purely architectural — hybrid model routing, lean context, local models for heartbeats, delegation-based context resets, and fail-fast escalation.

**Optimized monthly costs (from Doc 03, validated in production):**
- The Operator (4 agents): **$3–8/month**
- The Department (8–10 agents): **$5–12/month**
- The Marketing Machine (12–14 agents): **$6–15/month**

These costs are the AI API costs only. Infrastructure (Hetzner CX22 VPS) adds ~£4/month. Chad Pickard Studio's service fees are separate.

Budget should NOT be the primary factor in squad selection — even the largest squad costs under £15/month in API fees. Select the squad that matches the client's needs, not their budget fears.

### 1.2 Primary Decision Tree

Start here. Use the assessment answers from Sections 1 and 2. Budget (Section 6) is used for model routing decisions (Section 4), NOT for squad template selection.

```
Assessment data:
  team_size = Section 1.2 → Team size
  tool_count = Section 3 → Count of all "Yes" tools
  pain_count = Section 2.2 → Count of "Major pain" + "Critical" functions
  pain_focus = Section 2.2 → Where "Major pain" and "Critical" concentrate

Decision tree:

IF team_size = "Just me" AND pain_count <= 3 AND tool_count < 5
  → THE OPERATOR (4 agents) — $3–8/month

IF team_size = "Just me" AND (pain_count > 3 OR tool_count >= 5)
  → THE DEPARTMENT (8–10 agents) — $5–12/month

IF team_size = "2–5 people" AND pain_count <= 3
  → THE OPERATOR (4 agents) — $3–8/month

IF team_size = "2–5 people" AND pain_count > 3
  → THE DEPARTMENT (8–10 agents) — $5–12/month

IF team_size = "6–15 people"
  → THE DEPARTMENT (8–10 agents) or THE MARKETING MACHINE (12–14 agents)
  → Use secondary signals (Section 1.3) to choose between them

IF team_size = "15+" OR pain_count >= 6
  → THE MARKETING MACHINE (12–14 agents) — $6–15/month
```

### 1.2 Secondary Signals (Override Primary When Needed)

The primary tree handles 80% of cases. These secondary signals adjust the recommendation:

| Signal | Override |
|--------|---------|
| Pain is overwhelmingly marketing (content + social + email all "Critical") | Upgrade to Marketing Machine regardless of team size |
| Pain is overwhelmingly operational (bookkeeping + ops + support all "Critical") | Ensure Department template at minimum |
| Client says "I just need help with one thing" | Downgrade to Custom (Lead + 1–2 specialists) |
| Client has no tools at all (< 2 "Yes" in Section 3) | Start with Operator — fewer skills to configure |
| Client has complex compliance needs (Section 6.3) | Ensure Compliance Officer is activated regardless of template |
| Client budget says "Whatever it takes" | Match template to pain, not budget — don't oversell |

### 1.3 Record the Decision

| Field | Value |
|-------|-------|
| **Selected template** | [ ] The Operator [ ] The Department [ ] The Marketing Machine [ ] Custom |
| **Justification** | *(Why this template fits based on assessment data)* |
| **Config file** | `squads/operator/openclaw.json5` or `squads/department/openclaw.json5` or `squads/marketing-machine/openclaw.json5` |

---

## 2. Agent Activation Matrix

### 2.1 Pain-to-Agent Mapping

Use Section 2.2 of the assessment (Function-Specific Pain Check). Every "Major pain" or "Critical" activates an agent.

| Assessment Pain Area | Primary Agent | Also Consider |
|---------------------|---------------|---------------|
| Writing content | **Content Creator** (05) | Email Marketer (07) if email is also pain |
| Social media | **Social Media Manager** (06) | Content Creator (05) for content production |
| Email marketing | **Email Marketer** (07) | Content Creator (05) for copy |
| Sales outreach | **Sales Rep** (10) | Client Manager (11) for retention |
| Client management | **Client Manager** (11) | Support Agent (12) for reactive support |
| Customer support | **Support Agent** (12) | Client Manager (11) for proactive retention |
| Bookkeeping | **Bookkeeper** (03) | Ops Manager (04) for process management |
| Operations | **Ops Manager** (04) | Bookkeeper (03) for financial admin |
| Strategy/analytics | **Strategist** (01) + **Data Analyst** (09) | Market Researcher (08) for competitive intel |
| Compliance | **Compliance Officer** (13) | — |

### 2.2 The Big Three Override

The three things the client would "hand off tomorrow" (Section 2.1, Q2) are the non-negotiable agent activations. Even if the pain check shows them as "Minor pain," if the client explicitly names them, they get activated.

### 2.3 Lead Is Always Active

The Lead (00) is activated in every squad. It is never optional. It is the CEO — without it, there is no coordination (Doc 21, Doc 23 Section 6).

### 2.4 Agent Activation Record

Fill in based on the assessment:

| Agent | Activated? | Priority | Justification |
|-------|:---:|:---:|---------------|
| Lead (00) | **Always Yes** | Required | Squad CEO, all tasks route through Lead |
| Strategist (01) | [ ] Yes [ ] No | | |
| Engineer (02) | [ ] Yes [ ] No | | |
| Bookkeeper (03) | [ ] Yes [ ] No | | |
| Ops Manager (04) | [ ] Yes [ ] No | | |
| Content Creator (05) | [ ] Yes [ ] No | | |
| Social Media Manager (06) | [ ] Yes [ ] No | | |
| Email Marketer (07) | [ ] Yes [ ] No | | |
| Market Researcher (08) | [ ] Yes [ ] No | | |
| Data Analyst (09) | [ ] Yes [ ] No | | |
| Sales Rep (10) | [ ] Yes [ ] No | | |
| Client Manager (11) | [ ] Yes [ ] No | | |
| Support Agent (12) | [ ] Yes [ ] No | | |
| Compliance Officer (13) | [ ] Yes [ ] No | | |
| **Total activated** | /14 | | |

---

## 3. Skill Assignment

### 3.1 Tool-to-Skill Mapping

Use Section 3 of the assessment (Tools Audit). For every tool marked "Yes," generate the corresponding skills from Doc 24 (Skills Blueprint).

**Communication tools:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Gmail | `gmail-read`, `gmail-send`, `gmail-draft` | Lead (read), Sales Rep (send), Client Manager (send), Content Creator (draft), Email Marketer (draft) |
| Outlook | `outlook-read`, `outlook-send`, `outlook-draft` | Same distribution as Gmail |
| Slack | `slack-read`, `slack-post`, `slack-reply` | Lead (read), Content Creator (post), Support Agent (reply) |

**CRM tools:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| HubSpot | `hubspot-read`, `hubspot-lead-create`, `hubspot-deal-update`, `hubspot-activity-log` | Lead (read), Sales Rep (all), Client Manager (read, update, log) |
| Salesforce | `salesforce-read`, `salesforce-lead-create`, `salesforce-deal-update` | Same distribution |
| Pipedrive | `pipedrive-read`, `pipedrive-lead-create`, `pipedrive-deal-update` | Same distribution |

**Social media:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Instagram | `instagram-post`, `meta-insights` | Social Media Manager |
| Facebook | `facebook-post`, `meta-insights` | Social Media Manager |
| LinkedIn | `linkedin-post`, `linkedin-read`, `linkedin-analytics` | Social Media Manager, Content Creator (post) |
| Twitter/X | `twitter-post`, `twitter-read`, `twitter-analytics` | Social Media Manager |
| TikTok | `tiktok-post`, `tiktok-analytics` | Social Media Manager |

**Content/CMS:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| WordPress | `wordpress-draft`, `wordpress-publish`, `wordpress-read` | Content Creator |
| Webflow | `webflow-cms` | Content Creator |
| Ghost | `ghost-publish` | Content Creator |
| Shopify | `shopify-product-read`, `shopify-product-update` | Content Creator, Data Analyst |

**Email marketing:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Mailchimp | `mailchimp-campaign`, `mailchimp-list`, `mailchimp-read` | Email Marketer |
| ConvertKit | `convertkit-sequence`, `convertkit-read` | Email Marketer |
| Beehiiv | `beehiiv-newsletter`, `beehiiv-read` | Email Marketer, Content Creator |

**Accounting/Finance:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| QuickBooks | `quickbooks-categorise`, `quickbooks-invoice`, `quickbooks-report` | Bookkeeper |
| Xero | `xero-categorise`, `xero-invoice`, `xero-report` | Bookkeeper |
| Stripe | `stripe-read`, `stripe-invoice-create`, `stripe-invoice-read` | Bookkeeper |
| PayPal | `paypal-read` | Bookkeeper |

**Calendar:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Google Calendar | `calendar-read`, `calendar-create` | Lead (read), Ops Manager (create), Sales Rep (create) |
| Calendly | `calendly-check`, `calendly-link` | Sales Rep, Client Manager |

**Project management:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Trello | `trello-read`, `trello-task-create`, `trello-task-update` | Lead (read), Ops Manager (all) |
| Asana | `asana-read`, `asana-task-create`, `asana-task-update` | Same distribution |
| Monday.com | `monday-read`, `monday-item-create` | Same distribution |
| Notion | `notion-read`, `notion-create`, `notion-update` | Lead (read), Ops Manager (all), Content Creator (create) |

**Customer support:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Zendesk | `zendesk-ticket-read`, `zendesk-ticket-reply`, `zendesk-ticket-escalate` | Support Agent |
| Intercom | `intercom-read`, `intercom-reply` | Support Agent |
| Freshdesk | `freshdesk-read`, `freshdesk-reply` | Support Agent |

**Analytics:**

| Client Tool | Skills to Generate | Assign to Agents |
|------------|-------------------|-----------------|
| Google Analytics | `ga-read`, `ga-report` | Data Analyst, Market Researcher |
| Google Search Console | `gsc-read` | Market Researcher |

### 3.2 Skill Assignment Record

| Agent | Skills to Install | Credentials Needed |
|-------|------------------|--------------------|
| Lead (00) | | |
| *(each activated agent)* | | |

### 3.3 Only Assign Skills to Activated Agents

If an agent is not activated (Section 2.4), do NOT generate skills for it. Skills without an agent are wasted effort. If a skill logically belongs to a non-activated agent, either:
- Activate the agent (if the skill is critical), or
- Assign the skill to the closest active agent (e.g., if Social Media Manager is not activated, Content Creator gets social posting skills)

---

## 4. Model Routing Decision

### 4.1 Standard Model Routing (Default for All Squads)

Doc 03's validated production architecture uses a single optimized routing pattern that works for all squad sizes. The client's budget is NOT a factor in model selection — the optimized costs are so low ($3–15/month) that budget only matters for infrastructure and service fees.

**Standard routing (apply to every squad):**

| Agent Type | Primary Model | Fallback | Monthly Cost |
|-----------|---------------|----------|-------------|
| **Lead** | Claude Sonnet 4.6 | DeepSeek V3 | ~$2.25 |
| **Strategy agents** | Claude Sonnet 4.6 | DeepSeek V3 | ~$1.00–1.50 each |
| **Worker agents** | DeepSeek V3 | Gemini 2.0 Flash | ~$0.12–0.20 each |
| **Heartbeat/Cron** | Qwen 2.5 7B (local via Ollama) | None | $0.00 |

**Escalation model (available to all agents via Lead):**
- Claude Opus 4.6 — reserved for complex reasoning tasks where Sonnet fails or reports < 80% confidence
- Never assigned as a primary model. Always used on-demand via the Lead's escalation logic (Doc 03, Section 4)

**Why this works:** Doc 03 Example A proves 19 agents at $6.45/month with this exact pattern. The key insight is that intelligence is matched to task complexity — the Lead orchestrates on Sonnet, workers execute on budget models, and Opus is available when genuinely needed. No quality is lost because the final output is synthesised by the Lead (Doc 03, Sections 1 and 4).

**Ref:** Doc 03 (API Cost Optimization), Sections 1–5. Full optimization stack: hybrid routing + lean context (< 5,000 tokens/agent/turn) + memory compaction + delegation-based context resets + fail-fast escalation (1 retry max) + heartbeat tuning + skill count management (3–5 per agent).

### 4.2 Heartbeat Frequency

| Agent Type | Heartbeat Interval | max_turns |
|-----------|-------------------|-----------|
| Lead | 30 minutes | 3 |
| Strategy agents (Strategist, Data Analyst) | 2 hours | 2 |
| Worker agents (all others) | 1 hour | 2 |

### 4.3 Model Routing Record

| Agent | Primary Model | Fallback Model | Heartbeat | max_turns |
|-------|--------------|----------------|-----------|-----------|
| Lead (00) | | | 30m | 3 |
| *(each activated agent)* | | | | |

---

## 5. USER.md Generation

### 5.1 What Goes in USER.md

USER.md is the client-specific context file that every agent reads. It's generated from assessment Sections 1, 4, 5, 6, and 7.

**Template:** `squads/<template>/USER.md.template`

### 5.2 USER.md Content Mapping

| USER.md Field | Assessment Source |
|--------------|------------------|
| Name | Section 1.1 → Your name |
| Role | Section 1.1 → Industry context |
| Business | Section 1.1 → Business name + one-sentence description |
| Industry | Section 1.1 → Industry checkbox |
| Size | Section 1.2 → Team size |
| Website | Section 1.1 → Website |
| Preferred channel | Section 7 → Preferred communication channel |
| Detail level | Section 7 → Detail level |
| Tone preference | Section 7 → Tone preference |
| Response time expectation | Section 7 → Response time |
| Work hours | Section 7 → Work hours |
| Timezone | Section 7 → Timezone |
| Primary goal | Section 6.2 → What does success look like in 90 days |
| Current pain points | Section 2.1 → The Big Three (verbatim) |
| Target audience | Section 5.3 → Ideal customer description |
| Budget | Section 6.1 → Monthly budget |
| Key competitors | Section 4.2 → Competitors whose content you admire |
| Brand voice | Section 4.1 → 3 words + content example link |
| Topics to cover | Section 4.2 → Top 3 topics |
| Topics to avoid | Section 4.2 → Topics to AVOID |
| Existing content | Section 4.2 → Links to existing content |
| ICP | Section 5.3 → Ideal customer description |
| Current pipeline | Section 5.2 → How customers find you |
| Sales channels | Section 5.2 → Sales process |
| Pricing | Section 5.1 → Price points |
| What they value most | Section 6.2 → The ONE thing |
| What they DON'T want | Section 6.3 → What must the squad NEVER do |
| Success metrics | Section 6.2 → How will you measure it |
| Forbidden actions | Section 6.3 → What must the squad NEVER do |

### 5.3 One USER.md Per Squad

USER.md is the same for all agents in the squad — it's the shared client context. The Lead reads the full file. Worker agents read the sections relevant to their role (enforced by their SOUL.md instructions, not by file access).

---

## 6. MEMORY.md Pre-Population

### 6.1 Why Per-Agent Memory Matters

Unlike USER.md (shared client context), MEMORY.md is **per-agent and role-specific**. The Content Creator's memory contains brand voice and content history. The Bookkeeper's memory contains financial data. They must NEVER be shared (Doc 04, Section 1.4).

### 6.2 MEMORY.md Content by Agent Role

**Lead (00):**
```markdown
# Working Memory

## Business Overview
- Business: [name] — [one-sentence description]
- Industry: [industry]
- Owner: [name]
- Squad composition: [list activated agents and their roles]

## Squad Capabilities
[For each activated agent: name, role, skills available, model tier]

## Current Priorities
1. [From assessment: biggest pain point]
2. [Second biggest]
3. [Third biggest]

## Success Criteria (90 days)
- [From Section 6.2]

## Forbidden Actions
- [From Section 6.3]
```

**Content Creator (05):**
```markdown
# Working Memory

## Brand Voice
- 3 words: [from Section 4.1]
- Never sound like: [from Section 4.1]
- Example content: [link from Section 4.1]

## Content Pillars
1. [Topic 1 from Section 4.2]
2. [Topic 2]
3. [Topic 3]

## Audience
- [Ideal reader/follower from Section 4.1]

## Content Calendar
- Blog: [desired frequency from Section 4.3] per month
- Social: [desired frequency] per week
- Email: [desired frequency] per month

## Topics to Avoid
- [From Section 4.2]
```

**Sales Rep (10):**
```markdown
# Working Memory

## Products/Services
[From Section 5.1 — what they sell, price points, highest-margin offering]

## Ideal Customer Profile
[From Section 5.3 — ideal customer description]

## Sales Process
[From Section 5.2 — how customers find them, current process]

## Objection Handling
[Inferred from Section 5.1 — common objections based on pricing and industry]

## Pipeline
[From Section 5.3 — active clients, how leads currently come in]
```

**Client Manager (11):**
```markdown
# Working Memory

## Active Clients
[From Section 5.3 — number of active clients]

## Onboarding Process
[Inferred from industry — standard onboarding steps]

## Retention Signals
- Average client lifetime value: [from Section 5.1]
- Biggest reason clients leave: [from Section 5.3]

## Check-in Schedule
[Based on client count and communication preferences]
```

**Bookkeeper (03):**
```markdown
# Working Memory

## Accounting System
[From Section 3.6 — which tool they use]

## Payment Processing
[From Section 3.6 — Stripe/PayPal/GoCardless]

## Key Financial Data
- Price points: [from Section 5.1]
- Payment terms: [inferred from industry]

## Recurring Items
[To be populated as the agent learns]
```

**Ops Manager (04):**
```markdown
# Working Memory

## Project Management Tool
[From Section 3.8]

## Calendar System
[From Section 3.7]

## Team Size
[From Section 1.2]

## Key Processes
[Inferred from industry — standard operational workflows]

## Vendor/Contractor Info
[From Section 1.2 — contractors]
```

**Support Agent (12):**
```markdown
# Working Memory

## Support Tool
[From Section 3.9]

## Common Issues
[Inferred from industry — typical customer questions]

## Escalation Path
- First: attempt self-resolution from FAQ
- Then: escalate to Client Manager
- Then: escalate to Lead

## Response Standards
- Target response time: [from Section 7]
- Tone: [from Section 7]
```

**Social Media Manager (06):**
```markdown
# Working Memory

## Active Platforms
[From Section 3.3 — every "Yes" platform with handle]

## Posting Schedule
[From Section 4.3 — desired frequency per platform]

## Brand Voice
[From Section 4.1 — same as Content Creator]

## Content Themes
[From Section 4.2 — topics to cover and avoid]

## Engagement Rules
[Inferred from tone preference — how to respond to comments/mentions]
```

**Email Marketer (07):**
```markdown
# Working Memory

## Email Platform
[From Section 3.5]

## List Size
[From Section 3.5]

## Newsletter Frequency
[From Section 4.3]

## Brand Voice
[From Section 4.1]

## Sequence Types Needed
[Inferred from business model — welcome, nurture, sales, re-engagement]
```

### 6.3 Token Budget Check

After generating each MEMORY.md, verify it's under 2,000 tokens. If over, trim the least critical sections. Memory grows organically through daily logs — the initial load should be concise (Doc 04, Doc 09).

---

## 7. The Deployment Specification

### 7.1 Complete Specification Template

This is the final output — the document that gets handed to Doc 23 (Deployment Playbook) for execution.

```markdown
# Deployment Specification

## Client
- Name: [from assessment]
- Business: [from assessment]
- Industry: [from assessment]

## Squad Template
- Template: [The Operator / The Department / The Marketing Machine]
- Config: squads/[template]/openclaw.json5
- Justification: [from Section 1]

## Activated Agents
| # | Agent | Priority | Model Primary | Model Fallback | Heartbeat |
|---|-------|----------|--------------|----------------|-----------|
| 00 | Lead | Required | [model] | [model] | 30m / 3 turns |
| [..] | [...] | [...] | [...] | [...] | [...] |

## Skills to Install
| Agent | Skills | Credentials Needed |
|-------|--------|--------------------|
| [...] | [...] | [...] |

## Credentials to Configure
| Credential | Service | Vault Key |
|-----------|---------|-----------|
| [...] | [...] | [...] |

## Estimated Monthly Cost
| Component | Estimate |
|-----------|----------|
| Lead (model costs) | £X |
| Worker agents (model costs) | £X |
| Total API cost | £X |

## 90-Day Success Criteria
1. [from assessment]
2. [from assessment]
3. [from assessment]

## Forbidden Actions
- [from assessment]

## Deployment Checklist
- [ ] Directory structure created (Doc 23, §4)
- [ ] Agent files written (Doc 23, §5)
- [ ] Lead configured (Doc 23, §6)
- [ ] Bindings set (Doc 23, §7)
- [ ] Security locked down (Doc 23, §8)
- [ ] Skills installed (Doc 24)
- [ ] Credentials vaulted
- [ ] Pre-launch tests passed (Doc 25)
- [ ] Client onboarding packet delivered (discovery/03-onboarding-packet.md)
```

---

## 8. Quality Checks

Before passing the deployment specification to Doc 23, verify:

### 8.1 Completeness

- [ ] Every activated agent has a model assignment
- [ ] Every "Yes" tool from the assessment has corresponding skills
- [ ] Every skill has a credential identified
- [ ] USER.md is fully populated with no blank fields
- [ ] Every activated agent has MEMORY.md content
- [ ] Every MEMORY.md is under 2,000 tokens
- [ ] 90-day success criteria are specific and measurable
- [ ] Forbidden actions are explicit

### 8.2 Consistency

- [ ] Agent count matches the selected squad template
- [ ] Model routing matches the budget tier
- [ ] Skills are only assigned to activated agents
- [ ] No agent has skills for tools the client doesn't use

### 8.3 Sanity

- [ ] Estimated monthly cost is within the client's budget
- [ ] The activated agents actually address the client's top 3 pain points
- [ ] The squad isn't over-built for the client's needs (don't sell a Marketing Machine to someone who just needs content)
- [ ] The squad isn't under-built for the client's pain (don't deploy an Operator when they clearly need a Department)

---

*This router is a living document. As new client patterns emerge, update the decision tree (Section 1), pain-to-agent mapping (Section 2), and tool-to-skill mapping (Section 3). Every client deployment should validate and improve the routing logic.*
