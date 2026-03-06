# 23. The Deployment Playbook — Squad Setup from Zero to Live

> **OpenClaw v2026.3.x · Operational Playbook**
> Synthesised from Research Docs 01–22 · March 2026

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Pre-Flight: Information Gathering](#2-pre-flight-information-gathering)
3. [Squad Template Selection](#3-squad-template-selection)
4. [Foundation: Directory Structure](#4-foundation-directory-structure)
5. [Agent Assembly: Building Each Team Member](#5-agent-assembly-building-each-team-member)
6. [The Lead Agent: Special Treatment](#6-the-lead-agent-special-treatment)
7. [Coordination Layer: How Agents Communicate](#7-coordination-layer-how-agents-communicate)
8. [Security Lockdown](#8-security-lockdown)
9. [Model Routing & Cost Configuration](#9-model-routing--cost-configuration)
10. [Hard Rules: The "Never Do This" List](#10-hard-rules-the-never-do-this-list)
11. [Post-Setup Verification](#11-post-setup-verification)
12. [Squad Templates: Detailed Agent Lists](#12-squad-templates-detailed-agent-lists)
13. [Cross-Reference Map](#13-cross-reference-map)

---

## 1. Purpose

This document is the **single operational checklist** that Claude Code follows when deploying an OpenClaw squad for a client. It is not a reference document — it is a sequential procedure. Every step must be completed in order. Every hard rule must be obeyed without exception.

This playbook synthesises the findings from all 22 research documents into an actionable deployment sequence. When a research finding contradicts this playbook, the playbook is authoritative — it represents the final decision layer.

**Who uses this document:**
- Claude Code (the AI assistant) during automated squad setup
- The founder (Chad) when manually configuring or debugging squads
- Future contributors who need to understand why squads are built this way

**What this document does NOT cover:**
- Skill generation → see **Doc 24 (Skills Blueprint)**
- Testing & validation → see **Doc 25 (Testing & Validation Checklist)**
- Deep research rationale → see **Docs 01–22** (referenced throughout)

---

## 2. Pre-Flight: Information Gathering

Before creating a single file, gather the following from the client assessment (see `discovery/` templates):

### 2.1 Required Information

| Category | What to Gather | Why It Matters |
|----------|---------------|----------------|
| **Business basics** | Business name, industry, team size, revenue range | Determines squad template and model budget |
| **Goals** | Top 3 business goals for the next 90 days | Shapes which agents are prioritised |
| **Tools** | Every tool they currently use (CRM, email, accounting, social, etc.) | Drives skill generation (Doc 24) |
| **Budget** | Monthly AI budget tolerance ($50? $200? $500?) | Determines model routing tier (Doc 03) |
| **Content** | Brand voice, existing content examples, tone preferences | Pre-populates MEMORY.md and SOUL.md personality |
| **Contacts** | Key email addresses, social handles, team member names | Needed for communication skills |
| **Compliance** | Industry-specific regulations (HIPAA, GDPR, PCI-DSS, etc.) | Activates Compliance Officer if needed (Doc 17) |

### 2.2 Assessment-to-Squad Decision Matrix

The assessment answers directly determine which squad template to deploy:

| Assessment Signal | Squad Template | Rationale |
|-------------------|---------------|-----------|
| Solo founder, < 5 tools, budget < $100/mo | **The Operator** (4 agents) | Minimum viable squad — covers content, sales, client mgmt |
| Small team (2–10), 5–15 tools, budget $100–300/mo | **The Department** (8–10 agents) | Full department coverage — adds ops, finance, support |
| Marketing-heavy, 10+ tools, budget $200–500/mo | **The Marketing Machine** (10–14 agents) | Full 14-agent roster with marketing depth |
| Single-function need (e.g., "just content") | **Custom** (2–3 agents) | Lead + 1–2 specialists, no template needed |

**Ref:** Squad templates live in `squads/operator/`, `squads/department/`, `squads/marketing-machine/`. Agent definitions live in `agents/00-lead/` through `agents/13-compliance-officer/`.

---

## 3. Squad Template Selection

### 3.1 The Operator (Tier 1 — 4 Agents)

The minimum viable squad for a solo founder or micro-business.

| Agent | Role | Model Tier |
|-------|------|------------|
| Lead (00) | CEO / Orchestrator | Pro (Opus with Sonnet fallback) |
| Content Creator (05) | Blog posts, copy, landing pages | Budget (DeepSeek V3 / Gemini Flash) |
| Sales Rep (10) | Outreach, follow-ups, pipeline | Budget |
| Client Manager (11) | Onboarding, retention, upsells | Budget |

**Estimated monthly cost:** $6–30/month (Ref: Doc 03, hybrid routing)

### 3.2 The Department (Tier 2 — 8–10 Agents)

Full department coverage for a growing business.

Adds to The Operator:
| Agent | Role | Model Tier |
|-------|------|------------|
| Bookkeeper (03) | Invoicing, expenses, AR | Budget |
| Ops Manager (04) | Scheduling, admin, vendor coord | Budget |
| Support Agent (12) | Customer inquiries, tickets | Budget |
| Social Media Manager (06) | Scheduling, engagement, replies | Budget |
| Email Marketer (07) | Sequences, drips, A/B testing | Budget |
| Strategist (01) | Marketing strategy, positioning | Pro (escalation to Opus for strategy) |

**Estimated monthly cost:** $20–80/month

### 3.3 The Marketing Machine (Tier 3 — 12–14 Agents)

Full 14-agent roster for marketing-intensive businesses.

Adds to The Department:
| Agent | Role | Model Tier |
|-------|------|------------|
| Market Researcher (08) | SEO, competitive intel, briefs | Budget |
| Data Analyst (09) | Reporting, attribution, dashboards | Budget |
| Engineer (02) | Technical implementation, integrations | Pro |
| Compliance Officer (13) | Regulatory, data handling audits | Budget (escalation to Pro for complex) |

**Estimated monthly cost:** $40–150/month

**Ref:** Full roster details in Doc 22 (Agent Roster & Org Chart).

---

## 4. Foundation: Directory Structure

### 4.1 The Two-Layer Architecture

OpenClaw enforces a strict separation between infrastructure state and agent brain state (Ref: Doc 01, Section 1):

```
Layer 1 — Infrastructure: ~/.openclaw/
    ├── openclaw.json          # Master config (all agents, bindings, models)
    ├── credentials/           # NEVER commit, NEVER share
    ├── agents/                # Per-agent infrastructure dirs
    │   ├── lead/agent/        # Lead's auth + sessions
    │   ├── content/agent/     # Content Creator's auth + sessions
    │   └── <agentId>/agent/   # Each agent gets its own
    ├── skills/                # SHARED skills (visible to all agents)
    ├── sandboxes/             # Sandbox workspaces
    └── memory/                # Vector embeddings (LanceDB)

Layer 2 — Workspaces: ~/.openclaw/workspace-<agentId>/
    ├── SOUL.md                # Identity — WHO the agent is
    ├── AGENTS.md              # Operating manual — HOW the agent works
    ├── IDENTITY.md            # Structured profile
    ├── MEMORY.md              # Business context + working memory
    ├── HEARTBEAT.md           # Schedule + proactive triggers
    ├── TOOLS.md               # Explicit allow/deny lists
    ├── USER.md                # Client-specific context
    ├── skills/                # Agent-specific skills (override shared)
    └── memory/                # Daily logs, reflections
```

### 4.2 Critical Rules (Doc 01)

1. **One workspace per agent.** Never share workspaces. Never symlink workspaces. The `workspace-<agentId>` naming is mandatory.
2. **One agentDir per agent.** Never reuse `agentDir` across agents — causes auth/session collisions (Doc 01, Section 1).
3. **Git-initialise each workspace.** Enables rollback if an agent's memory degrades (Doc 15).
4. **Never commit `~/.openclaw/credentials/`.** This was a massive issue in early 2026 with "Moltbook" marketplaces (Doc 01).

### 4.3 Setup Sequence

Execute in this exact order:

```bash
# Step 1: Create infrastructure directories
mkdir -p ~/.openclaw/agents/{lead,content,sales,client}/agent
mkdir -p ~/.openclaw/skills
mkdir -p ~/.openclaw/memory/lancedb

# Step 2: Create workspace directories (one per agent)
mkdir -p ~/.openclaw/workspace-lead/{skills,memory}
mkdir -p ~/.openclaw/workspace-content/{skills,memory}
mkdir -p ~/.openclaw/workspace-sales/{skills,memory}
mkdir -p ~/.openclaw/workspace-client/{skills,memory}
# ... repeat for every agent in the selected template

# Step 3: Git-initialise each workspace
cd ~/.openclaw/workspace-lead && git init
cd ~/.openclaw/workspace-content && git init
# ... repeat for each

# Step 4: Copy agent templates from the repo
# (Detailed in Section 5 below)
```

---

## 5. Agent Assembly: Building Each Team Member

For **every agent** in the selected squad template, complete the following steps in order. Do not skip steps. Do not reorder.

### 5.1 SOUL.md — Identity (The Most Important File)

SOUL.md is the first file read during every heartbeat loop. It is the agent's subconscious and long-term behavioral anchor (Ref: Doc 08, Section 2).

**Hard rules:**
- **Under 500 tokens.** Bloated SOUL.md causes robotic, constrained behaviour. The agent reads this file every single heartbeat — keep it lean (Doc 08, Section 2.1).
- **No rigid task lists.** SOUL.md defines identity, not automation. Tasks belong in AGENTS.md.
- **Include anti-yes-man instructions.** Without this, agents degrade into agreeable assistants within 7–10 days (Doc 08, Section 4).
- **Include personality, not just job description.** "You are a Content Creator" is useless. "You write with sharp clarity, hate fluff, and always ask 'would I read this?'" is a personality (Doc 11).
- **Include the Lead-as-CEO protocol.** Every agent must know how to escalate to the Lead (Doc 08, Section 2.1, Tier 4).

**Four-Tier Structure (2026 Standard — Doc 08):**

| Component | Function | Example |
|-----------|----------|---------|
| **Identity Core** | Who I am, what I value | "Systems Architect who builds clean, maintainable solutions" |
| **Initiative Triggers** | Conditions that wake me up | "If a client hasn't been contacted in 7 days, draft a check-in" |
| **Self-Reflection Clause** | Internal critique schedule | "After every 5 tasks, review reflection.md for efficiency leaks" |
| **Lead-as-CEO Protocol** | Escalation rules | "Never ask permission to research; ask permission to spend > $50" |

**Template source:** `agents/<agent-folder>/SOUL.md`

### 5.2 AGENTS.md — Operating Manual

The operational instructions for the agent — how it behaves, what processes it follows, what rules it obeys.

**Hard rules:**
- **Under 800 tokens.** This is read at every session start alongside SOUL.md. Bloat here compounds context costs (Doc 03, Doc 09).
- **Include memory hygiene rules.** The agent must know to flush its working memory and update MEMORY.md at the end of each work session (Doc 04, Section 4).
- **Include error escalation rules.** What to do when a tool fails, when confidence is low, when a task is ambiguous (Doc 10).
- **Include coordination rules.** Who this agent can message, when to hand off tasks, when to ask the Lead (Doc 05).

**Template source:** `agents/<agent-folder>/AGENTS.md`

### 5.3 IDENTITY.md — Structured Profile

A structured data file that other agents and the Lead can reference to understand this agent's capabilities.

**Contents:**
- Agent ID, name, org title
- Department membership
- Core capabilities (bulleted list)
- Tools and skills available
- Model tier assignment
- Communication channels (who they talk to)

**Template source:** `agents/<agent-folder>/IDENTITY.md`

### 5.4 MEMORY.md — Business Context

Pre-populated with client-specific context from the assessment. This is the agent's "briefing packet."

**Hard rules:**
- **Under 2,000 tokens at deployment.** Memory grows over time through daily logs, but the initial load must be concise (Doc 04, Section 4; Doc 09).
- **Include only context relevant to THIS agent's role.** The Content Creator doesn't need financial data. The Bookkeeper doesn't need brand voice guidelines. Shared context = context poisoning (Doc 04, Section 1.1).
- **Never share MEMORY.md across agents.** This is the single most important isolation rule. Shared memory causes persona blur, hive-mind degradation, and irrelevant retrieval within 7–10 days (Doc 04, Section 1.4).

**What to include per agent type:**
| Agent | Memory Contents |
|-------|----------------|
| Lead | Business overview, all agent capabilities, routing rules, escalation thresholds |
| Content Creator | Brand voice guide, content pillars, past content examples, target audience profiles |
| Sales Rep | Product/service descriptions, pricing, ideal customer profile, objection handling notes |
| Client Manager | Active client list, onboarding checklist, SLA terms, renewal dates |
| Bookkeeper | Chart of accounts, payment terms, vendor list, recurring expenses |
| Support Agent | FAQ, common issues, escalation paths, SLA response times |

**Template source:** `agents/<agent-folder>/MEMORY.md`

### 5.5 HEARTBEAT.md — Schedule & Proactive Triggers

Defines when and why the agent wakes up autonomously.

**Hard rules:**
- **Minimum 30-minute frequency for the Lead, 1-hour for workers.** More frequent = wasted money on idle heartbeats (Doc 03, Section 1; Doc 01).
- **max_turns: 2–3.** Prevents runaway heartbeat sessions that burn through budget (Doc 03).
- **Include meaningful triggers, not just "check in."** A heartbeat should have a reason: check for new emails, review pending tasks, update daily log (Doc 08, Section 3).

**Template source:** `agents/<agent-folder>/HEARTBEAT.md`

### 5.6 TOOLS.md — Explicit Allow/Deny Lists

Defines exactly what tools and skills this agent can and cannot use.

**Hard rules:**
- **Deny always wins.** If a tool appears in both allow and deny, it is denied (Doc 06, Section 4).
- **Never use `tools.allow: ["*"]`.** This is how you get remote code execution. Real CVE from Feb 2026 — a malicious ClawHub skill exploited blanket allow to exfiltrate credentials (Doc 06, Section 8).
- **Deny `exec` and `sudo` for all worker agents.** Only the Lead gets elevated tool access, and even then with constraints (Doc 06, Section 4; Doc 19).

**Template source:** `agents/<agent-folder>/TOOLS.md`

### 5.7 config.json5 — Runtime Configuration

The agent's entry in the `openclaw.json` master config.

**Required fields:**
```jsonc
{
  "id": "<agent-id>",
  "name": "<Display Name>",
  "workspace": "~/.openclaw/workspace-<agent-id>",
  "agentDir": "~/.openclaw/agents/<agent-id>/agent",
  "model": {
    "primary": "<model-id>",
    "fallbacks": ["<fallback-model-id>"],
  },
  "tools": {
    "profile": "minimal",  // "full" only for Lead
    "allow": ["read", "write", "sessions_send"],
    "deny": ["exec", "sudo"],
  },
  "sandbox": {
    "mode": "all",
    "workspaceAccess": "rw",
    "networkAccess": "restricted",
  },
  "compaction": {
    "mode": "safeguard",
    "reserveTokensFloor": 15000,
    "memoryFlush": {
      "enabled": true,
      "softThresholdTokens": 3000,
    },
  },
  "heartbeat": {
    "every": "1h",
    "max_turns": 2,
    "enabled": true,
  },
}
```

**Template source:** `agents/<agent-folder>/config.json5`

### 5.8 Skills Installation

Skills are installed per-agent based on the client's tools (see Doc 24 for the full skills generation process).

**Hard rules:**
- **Only install vetted skills.** Never auto-install from ClawHub without review. 800+ malicious skills discovered Feb 2026 (Doc 06, Section 8).
- **Per-agent skills override shared skills.** If both `~/.openclaw/skills/gmail/` and `~/.openclaw/workspace-content/skills/gmail/` exist, the workspace version wins (Doc 02, three-tier precedence).
- **Apply approval tiers.** See Doc 19 and Doc 24 for the 4-tier system.

---

## 6. The Lead Agent: Special Treatment

The Lead is not just another agent — it is the CEO of the squad. It gets configured differently because its responsibilities are fundamentally different from worker agents (Ref: Doc 21).

### 6.1 Model Assignment

**The Lead MUST run on a premium or pro-tier model.**

| Recommended | Fallback | Never |
|-------------|----------|-------|
| Claude Opus 4.6 | Claude Sonnet 4.6 | DeepSeek V3, Qwen, Gemini Flash |

**Why:** The Lead makes routing decisions, delegates tasks, evaluates agent performance, and handles ambiguous requests. A cheap model makes bad routing decisions — it sends sales tasks to the content writer, misses escalation triggers, and fails to synthesise multi-agent output (Doc 03, Section 1; Doc 21, Section 2).

### 6.2 Elevated Tool Access

The Lead gets `profile: "full"` with these additional tools:

```jsonc
"tools": {
  "profile": "full",
  "allow": [
    "read", "write", "edit",
    "sessions_spawn", "sessions_send", "sessions_list",
    "memory_search",
    "fs_read", "fs_write",
  ],
  "deny": ["exec", "sudo"],
}
```

**Critical:** Even the Lead denies `exec` and `sudo`. The Lead manages agents through OpenClaw's native tools, not shell commands (Doc 06).

### 6.3 Dynamic Tool Granting

The Lead can autonomously provision tools and skills to worker agents at runtime (Doc 21, Section 2.1):

- Inject API keys via ClawVault SecretRef
- Write new SKILL.md files into agent workspaces
- Update agent TOOLS.md allow lists
- Provision email accounts, social credentials, etc.

**Approval tiers still apply:** The Lead can grant Tier 1–3 tools autonomously. Tier 4 (financial transactions, destructive operations) requires human confirmation (Doc 19, Section 2).

### 6.4 Routing Logic

The Lead receives all incoming requests via the default binding and routes to the correct agent:

```jsonc
// In openclaw.json bindings
"bindings": [
  { "channel": "*", "agentId": "lead" },           // Lead catches all
  { "channel": "content", "agentId": "content" },   // Direct content channel
  { "channel": "sales", "agentId": "sales" },       // Direct sales channel
  // ...
]
```

The Lead evaluates each request against agent capabilities (stored in IDENTITY.md files) and routes via `sessions_send`. It never does the manual work — it builds the machine that does (Doc 21, Section 2.1).

### 6.5 Error Escalation

All unresolved errors bubble up to the Lead through the five-layer recovery flow (Doc 10, Section 2):

```
Agent encounters error
├── Layer 1: Auto-retry (max 3, exponential backoff)
├── Layer 2: Model failover (primary → fallback)
├── Layer 3: Tool fallback (degrade gracefully)
├── Layer 4: Escalate to Lead
└── Layer 5: Lead escalates to human
```

### 6.6 The Lead Should NEVER Be Over-Constrained

Do not put rigid task lists, step-by-step procedures, or excessive rules in the Lead's SOUL.md. The Lead needs maximum flexibility to make autonomous decisions (Doc 05, Section 5.5; Doc 08; Doc 21).

The Lead's SOUL.md should contain:
- Strong executive identity
- Decision-making principles (not rules)
- Squad awareness (who reports to it, what each agent does)
- When to escalate to human vs. handle autonomously

---

## 7. Coordination Layer: How Agents Communicate

### 7.1 The Binding-Based System

OpenClaw uses declarative channel bindings for message routing (Doc 05, Section 2):

```jsonc
"bindings": [
  { "channel": "*", "agentId": "lead" },
  { "channel": "content", "agentId": "content" },
  { "channel": "sales", "agentId": "sales" },
  { "channel": "client", "agentId": "client" },
]
```

**Rules:**
- The Lead is the only mandatory coupling point — every agent talks to the Lead, not to each other directly (Doc 05, Section 5.5)
- Direct agent-to-agent channels are optional and should be used sparingly
- The Gateway resolves the most-specific binding match

### 7.2 sessions_send for Task Handoffs

Agents communicate via `sessions_send` — OpenClaw's native opt-in messaging tool (Doc 05, Section 3):

```
Lead: sessions_send("content", "Write a blog post about Q1 results. Brand voice: confident, data-driven. Deadline: EOD.")
Content: [writes the post]
Content: sessions_send("lead", "Blog post complete. Draft saved to workspace. 1,200 words, 3 data points. Ready for review.")
```

### 7.3 Anti-Patterns (Doc 05, Section 11)

| Anti-Pattern | What Happens | Prevention |
|-------------|-------------|-----------|
| **Two agents on same channel** | Infinite reply loop — each responds to the other's response | One agent per channel binding |
| **Rigid DAG pipelines** | Brittle coordination that breaks when any agent fails | Loose routing via Lead delegation |
| **Shared state machines** | Agents fight over shared state, causing race conditions | Each agent owns its own state |
| **Broadcast messaging** | Every agent processes every message, burning tokens | Targeted sessions_send only |
| **No depth limits** | Agent spawns agent spawns agent → runaway recursion | maxSpawnDepth: 1 in config |

---

## 8. Security Lockdown

Complete this section AFTER agent assembly, BEFORE going live.

### 8.1 Sandbox Configuration (Doc 06, Section 3)

Every agent gets sandboxed:

```jsonc
"sandbox": {
  "mode": "all",             // Sandbox everything
  "workspaceAccess": "rw",   // Can read/write own workspace
  "networkAccess": "restricted",  // No arbitrary network access
}
```

### 8.2 Secrets Management (Doc 06, Section 7)

**Never put secrets in:**
- `.env` files
- config.json5
- MEMORY.md
- SOUL.md
- Any Markdown file

**Always use:**
```bash
openclaw vault set STRIPE_KEY sk-live-xxx     # age-encrypted
openclaw vault set GMAIL_APP_PASSWORD xxxx     # age-encrypted
```

Reference in config via `SecretRef`:
```jsonc
"env": {
  "STRIPE_KEY": { "$ref": "vault:STRIPE_KEY" }
}
```

### 8.3 Tool Deny Lists (Doc 06, Section 4)

For worker agents (all agents except Lead):
```jsonc
"tools": {
  "profile": "minimal",
  "allow": ["read", "write", "sessions_send"],
  "deny": ["exec", "sudo", "sessions_spawn"],
}
```

For the Lead:
```jsonc
"tools": {
  "profile": "full",
  "allow": ["read", "write", "edit", "sessions_spawn", "sessions_send", "sessions_list", "memory_search", "fs_read", "fs_write"],
  "deny": ["exec", "sudo"],
}
```

### 8.4 Spawn Limits (Doc 04, Section 5)

```jsonc
"maxSpawnDepth": 1,     // Agent can spawn ONE level of sub-agents, no deeper
"sessionTimeout": 300,  // 5-minute timeout per session
```

**Why:** Without spawn limits, a single error can trigger recursive agent spawning. Real incident: 2,258 callback re-injections in 16 minutes, exponential context growth, entire daily budget consumed (Doc 04, Section 1.2).

### 8.5 Security Audit (Doc 06, Section 2)

Run after every configuration change:
```bash
openclaw security audit          # Basic scan
openclaw security audit --deep   # Flags elevated allowlists, browser exposure
openclaw secrets audit --check   # Scans for plaintext leaks
```

---

## 9. Model Routing & Cost Configuration

### 9.1 The Routing Principle (Doc 03)

**Start cheap, escalate only when needed.** The default model should be the cheapest that can handle the task. Escalation happens when:
- Confidence is below threshold (< 80%)
- Task requires multi-step reasoning
- Output is customer-facing
- Previous attempt on cheaper model failed

### 9.2 Model Assignment by Agent Role

| Agent Type | Primary Model | Fallback | Est. Cost/Month |
|-----------|---------------|----------|-----------------|
| **Lead** | Claude Opus 4.6 | Claude Sonnet 4.6 | $8–25 |
| **Strategy/Pro agents** | Claude Sonnet 4.6 | DeepSeek V3 | $3–10 |
| **Worker agents** | DeepSeek V3 / Gemini Flash | Qwen 2.5 7B (local) | $0.50–3 |
| **Heartbeat/Cron** | Qwen 2.5 7B (via Ollama) | None | $0 |

### 9.3 OpenRouter Configuration (Doc 03, Section 2)

```jsonc
{
  "env": {
    "OPENROUTER_API_KEY": { "$ref": "vault:OPENROUTER_KEY" }
  },
  "models": {
    "premium": "anthropic/claude-opus-4-6",
    "pro": "anthropic/claude-sonnet-4-6",
    "budget": "deepseek/deepseek-chat-v3-0324",
    "free": "qwen/qwen-2.5-7b-instruct"
  }
}
```

### 9.4 Context Compression (Doc 03, Doc 09)

Every agent gets compaction configured to prevent context bloat — the #1 cost driver:

```jsonc
"compaction": {
  "mode": "safeguard",
  "reserveTokensFloor": 15000,       // Lead gets 20000
  "memoryFlush": {
    "enabled": true,
    "softThresholdTokens": 3000,     // Lead gets 4000
  },
}
```

---

## 10. Hard Rules: The "Never Do This" List

These rules are synthesised from every failure mode, anti-pattern, and real incident documented across Docs 01–22. Every rule has a documented consequence.

### 10.1 Memory & Isolation

| Rule | Consequence If Violated | Source |
|------|------------------------|--------|
| **Never share MEMORY.md across agents** | Personas blur into hive-mind after 7–10 days | Doc 04, §1.4 |
| **Never reuse agentDir across agents** | Auth/session collisions, agents impersonate each other | Doc 01, §1 |
| **Never symlink workspaces** | Breaks sandbox isolation, shared state corruption | Doc 04, §1 |
| **Keep MEMORY.md under 2,000 tokens at deploy** | Context bloat compounds every heartbeat, exponential cost | Doc 09 |

### 10.2 Cost & Models

| Rule | Consequence If Violated | Source |
|------|------------------------|--------|
| **Never put the Lead on a cheap model** | Bad routing decisions, missed escalations, wasted tokens on rework | Doc 03, §1 |
| **Never allow unlimited retries** | $750 weekend bill from unsupervised retry loops | Doc 04, §1.2 |
| **Heartbeat minimum: 30min Lead, 1hr workers** | Idle heartbeats burn budget with no value | Doc 03 |
| **max_turns: 2–3 per heartbeat** | Prevents runaway heartbeat sessions | Doc 03 |

### 10.3 Security

| Rule | Consequence If Violated | Source |
|------|------------------------|--------|
| **Never use `tools.allow: ["*"]`** | Remote code execution. Real CVE, Feb 2026 | Doc 06, §8 |
| **Never install unvetted ClawHub skills** | 800+ malicious skills discovered Feb 2026 | Doc 06, §8 |
| **Never put secrets in Markdown or config files** | Credential exfiltration via context injection | Doc 06, §7 |
| **maxSpawnDepth: 1 always** | 2,258 recursive callbacks in 16 minutes | Doc 04, §1.2 |
| **Deny `exec` and `sudo` for all agents** | Shell escape = full system compromise | Doc 06, §4 |

### 10.4 Architecture

| Rule | Consequence If Violated | Source |
|------|------------------------|--------|
| **Never create rigid task pipelines** | Brittle, breaks when any agent fails, < 10% scale success | Doc 05, §1 |
| **Never put two agents on the same channel** | Infinite reply loop | Doc 05, §11 |
| **Never exceed 50 rules in SOUL.md** | Robotic, over-constrained behaviour | Doc 08, §12 |
| **Never skip the Lead — all tasks route through CEO** | No coordination, agents work at cross-purposes | Doc 21 |
| **Never over-constrain the Lead** | Defeats the purpose of CEO autonomy | Doc 05, §5.5; Doc 21 |

---

## 11. Post-Setup Verification

After completing all setup steps, run the full validation checklist from **Doc 25 (Testing & Validation Checklist)**.

**Minimum pre-launch checks:**
1. Each agent responds to a test message in character
2. Lead routes a test task to the correct worker
3. Worker completes a test task and reports back to Lead
4. Security audit passes (`openclaw security audit --deep`)
5. No plaintext secrets found (`openclaw secrets audit --check`)
6. Heartbeats fire at expected intervals
7. All skills connect to their respective services

**Do not go live until all checks pass.** Fix issues first, then re-verify.

---

## 12. Squad Templates: Detailed Agent Lists

### 12.1 The Operator — Agent Assembly Order

Deploy in this exact order (dependencies flow downward):

```
1. Lead (00)           → Must exist first — all agents report to it
2. Content Creator (05) → Highest-value agent for most solo founders
3. Sales Rep (10)       → Revenue-generating agent
4. Client Manager (11)  → Retention agent
```

### 12.2 The Department — Agent Assembly Order

```
1. Lead (00)
2. Content Creator (05)
3. Sales Rep (10)
4. Client Manager (11)
5. Bookkeeper (03)      → Financial visibility
6. Ops Manager (04)     → Process management
7. Support Agent (12)   → Customer-facing
8. Social Media Manager (06) → Marketing expansion
9. Email Marketer (07)  → Campaign automation
10. Strategist (01)     → Strategic layer (needs all other agents to exist first)
```

### 12.3 The Marketing Machine — Agent Assembly Order

```
1–10. Same as The Department
11. Market Researcher (08) → Feeds into Strategist and Content Creator
12. Data Analyst (09)      → Reporting across all agents
13. Engineer (02)          → Technical integrations
14. Compliance Officer (13) → Oversight layer (deployed last)
```

---

## 13. Cross-Reference Map

Every section of this playbook traces back to specific research documents:

| Playbook Section | Primary Sources | Secondary Sources |
|-----------------|----------------|-------------------|
| Pre-Flight | Discovery templates | Doc 22 (Roster) |
| Directory Structure | Doc 01 (Folder Structure) | Doc 04 (Independence) |
| SOUL.md Assembly | Doc 08 (Prompt Engineering), Doc 11 (Personality) | Doc 21 (Lead-as-CEO) |
| AGENTS.md Assembly | Doc 08, Doc 05 (Coordination) | Doc 10 (Error Recovery) |
| MEMORY.md Assembly | Doc 04 (Independence), Doc 09 (Context) | Doc 03 (Cost) |
| HEARTBEAT.md | Doc 03 (Cost), Doc 08 (Prompt Engineering) | Doc 01 |
| TOOLS.md | Doc 06 (Security), Doc 19 (Tiering) | Doc 02 (Skills) |
| config.json5 | Doc 01, Doc 03 | Doc 12 (Scalability) |
| Lead Setup | Doc 21 (Lead-as-CEO), Doc 03 (Cost) | Doc 05, Doc 08 |
| Coordination | Doc 05 (Coordination) | Doc 04, Doc 10 |
| Security | Doc 06 (Security), Doc 19 (Tiering) | Doc 17 (Legal) |
| Model Routing | Doc 03 (Cost) | Doc 07 (Hybrid), Doc 18 (Migration) |
| Hard Rules | ALL docs | Synthesised failure modes |
| Testing | Doc 25 (Testing Checklist) | Doc 16 (Testing Frameworks) |

---

*This playbook is a living document. As new research findings emerge or production incidents occur, update the relevant sections and add entries to the Hard Rules list. Every rule must have a documented consequence and source reference.*
