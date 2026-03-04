# Topic 19 — Tool Access Tiering & Lead Autonomy

> **OpenClaw v2026.3.x · Master Research File**
> Grok foundation + Gemini insights · March 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [The 4-Tier Tool Access System](#2-the-4-tier-tool-access-system)
3. [Secure Secrets & Vault Management](#3-secure-secrets--vault-management)
4. [Lead-as-CEO Autonomy & Tool Granting](#4-lead-as-ceo-autonomy--tool-granting)
5. [Safe Approval Workflows & Sandbox Integration](#5-safe-approval-workflows--sandbox-integration)
6. [Per-Agent Workspace Tool Injection](#6-per-agent-workspace-tool-injection)
7. [Integration Points](#7-integration-points)
8. [Real 2026 Production Examples](#8-real-2026-production-examples)
9. [Common Failure Modes & Anti-Patterns](#9-common-failure-modes--anti-patterns)
10. [Step-by-Step Setup Commands](#10-step-by-step-setup-commands)
11. [Practical Recommendations](#11-practical-recommendations)
12. [Summary](#12-summary)

---

## 1. Overview

OpenClaw implements tool access through a combination of built-in allow/deny
lists, per-agent tool profiles, sandbox modes, and skills injection. There
is no single native "Level 1–4" flag in `openclaw.json`, but the framework's
architecture—tool profiles, per-agent workspaces, SecretRef injection,
`sessions_*` coordination tools, and Lead-orchestrator patterns—maps exactly
to a four-tier system enforced at load time, runtime, and sandbox boundaries.

**Why tiering matters now**: The massive security reckoning OpenClaw faced in
early 2026—CrowdStrike and Onyx AI highlighting plaintext credentials,
blanket agent permissions, 40k+ exposed instances, and 341+ malicious ClawHub
skills—makes strict tool tiering practically mandatory for production squads.
Untiered squads are active liabilities.

Key principle: **tools are granted per-agent, per-workspace, never globally**.
The Lead agent acts as CEO—decomposing tasks, routing work via bindings and
`sessions_send`, and autonomously granting tools as agents prove performance.
Human approval is required only for genuinely high-risk operations.

```
Human Operator
    ↕ (Tier 4 approval only)
Lead Agent (CEO) — full tool profile
    ↕ sessions_send / sessions_spawn
    ├── Agent A — Tier 1 (safe defaults)
    ├── Agent B — Tier 2 (pre-approved for role)
    ├── Agent C — Tier 3 (Lead-granted Gmail draft)
    └── Agent D — Tier 2 → requesting Tier 3 upgrade
```

---

## 2. The 4-Tier Tool Access System

### 2.1 Tier Comparison Table

| Tier | Name | Tools Allowed | How Granted | Risk Controls | Typical Use |
|---|---|---|---|---|---|
| **Level 1** | Built-in Safe | `read`, `write`, `edit`, `sessions_list/history/send` (core only) | Default in every agent/workspace | Sandbox `"all"` + `workspaceAccess: "none"` or `"ro"`; no external APIs | Internal reasoning, memory, coordination |
| **Level 2** | Pre-Approved | + `browser` (limited), `canvas`, basic skills (calendar, search) | `tools.profile = "messaging"/"coding"` + `tools.allow` list in openclaw.json | `tools.deny` for high-risk; sandbox `"require"`; redaction | Daily workflows (Gmail read-only, Notion query) |
| **Level 3** | Lead-as-CEO Grant | + full APIs (Stripe read, Gmail send, Notion write), custom skills | Lead uses `sessions_spawn` + `clawhub install --workspace` OR patches agent config | Lead's SOUL.md rules + budget/security checklist; runtime snapshot validation | Growing agents that prove performance |
| **Level 4** | Human Approval | Email send with attachments, database write, payment APIs, AWS deploy | Lead proposes via message → human `openclaw pairing approve` or manual config edit | `dmPolicy="pairing"`, `tools.exec.security="ask"/"always"`, security audit required | Budget >$X, data exfil risk, new external service |

### 2.2 Tier Escalation Flow

```
Agent needs tool → checks own allowlist → tool available?
  YES → execute normally
  NO  → send structured request to Lead via agentToAgent:
        [event:tool_request] {"tool": "stripe_read",
         "justification": "need to verify payment for ticket #123"}
        → Lead evaluates (SOUL.md rules, performance history, budget)
        → Tier 3? → Lead grants autonomously
        → Tier 4? → Lead escalates to human → human approves/denies
        → Grant logged to MEMORY.md
```

### 2.3 Default Profiles

OpenClaw ships with built-in tool profiles that map to tiers:

| Profile | Tier Equivalent | Tools Included |
|---|---|---|
| `"minimal"` | Tier 1 | `read`, `write`, `edit`, `sessions_*` (core) |
| `"messaging"` | Tier 2 | + `browser` (limited), channel tools |
| `"coding"` | Tier 2 | + `exec` (sandboxed), `github`, dev tools |
| `"full"` | Tier 1–3 (Lead only) | All tools; Lead uses discretion |

---

## 3. Secure Secrets & Vault Management

Early OpenClaw setups stored API keys in plaintext `~/.openclaw/.env` files,
leading to disastrous credential scraping (ClawJacked CVE, Feb 2026). Modern
squads must use strict vault integration.

### 3.1 SecretRef Objects (Official, v2026.2.x+)

OpenClaw never hard-codes keys (enforced by `openclaw doctor` checks and
automatic redaction). All credentials use **SecretRef** objects:

```json
{
  "agents": {
    "list": [{
      "id": "finance-agent",
      "secrets": {
        "stripe": {
          "source": "SecretRef",
          "ref": "vault:stripe/prod",
          "ttl": "1h"
        },
        "gmail": {
          "source": "SecretRef",
          "ref": "vault:gmail/oauth",
          "ttl": "24h"
        }
      }
    }]
  }
}
```

### 3.2 Secrets Workflow (v2026.3.2)

```bash
# Audit current secrets for vulnerabilities
openclaw secrets audit

# Configure vault provider (HashiCorp, 1Password, AWS SM, sops-age)
openclaw secrets configure --provider vault --url https://vault.mycompany.com

# Apply secrets to agent configs
openclaw secrets apply

# Zero-downtime runtime reload
openclaw secrets reload
```

Supported providers: `env`, `file`, `exec` (calls external Vault/1Password/
AWS Secrets Manager/sops-age). Per-agent injection: secrets are scoped to
the agent run only—never visible in `process.env` of other agents.

### 3.3 Age Encryption for Local Vaults

For teams without external vault infrastructure, use age-encrypted local
files (community pattern from LumaDock):

```bash
#!/bin/bash
# decrypt_and_inject.sh — executed by Lead agent
AGENT_ID="${1:?agent_id required}"

# Decrypt vault in memory
age --decrypt -i key.txt secrets.env.age > /tmp/temp_secrets.env

# Inject only the required key into target agent's workspace
grep "STRIPE_KEY" /tmp/temp_secrets.env >> \
  ~/.openclaw/agents/${AGENT_ID}/workspace/.env

# Clean up — never leave decrypted secrets on disk
rm -f /tmp/temp_secrets.env
```

### 3.4 External Vault Integration (Production)

LumaDock recommendation: HashiCorp Vault or 1Password exec provider +
age encryption for local sops files:

```bash
#!/bin/bash
# vault_get.sh — exec provider for openclaw secrets
vault kv get -format=json "secret/openclaw/$1" | jq -r '.data.data.key'
```

Disk: `~/.openclaw/secrets.json` (600 perms) + full-disk encryption
recommended. Logging redacts secrets automatically.

---

## 4. Lead-as-CEO Autonomy & Tool Granting

The Lead agent operates as CEO of the squad's tool ecosystem: it decomposes
tasks into agent-specific assignments, routes work via bindings and
`sessions_send`, synthesizes results from all specialists, and autonomously
manages the tools, APIs, email accounts, and secrets each agent needs as
they grow and develop.

### 4.1 Core Tool-Granting Responsibilities

1. **Task Decomposition with Tool Awareness**: When the Lead receives a
   task, it breaks it down and identifies which tools each agent needs:
   - Finance task → spawn `finance-agent` with Stripe read access
   - Email task → spawn `email-specialist` with Gmail draft access
   - Research task → spawn `researcher` with web search + browser

   Each assignment is dispatched through bindings—the Lead decides
   *per-task* which agents handle which work and what tool tier they
   need. This is loose, per-task coordination—not a rigid pipeline.

2. **Autonomous Capability Grants**: The Lead can **autonomously grant
   tools, API access, email accounts, secrets, and skill installations**
   to agents as they prove performance and grow into larger roles:
   - **Low-risk grants (Tier 3)**: Read-only API access, draft email
     tools, Notion query, calendar read, search skills—issued
     autonomously with no human involvement. The Lead evaluates the
     agent's performance history, checks budget, runs security audit,
     and grants.
   - **High-risk grants (Tier 4)**: Email send with attachments, Stripe
     refund, AWS deploy, database write, payment processing—require
     **one-time human approval** only. Once approved for a tool class,
     the Lead re-issues the grant for future tasks without asking again.
   - All grants logged to MEMORY.md for audit trail.

3. **Performance-Based Evaluation**: Before granting Tier 3 tools, the
   Lead evaluates the requesting agent:

   ```markdown
   ## Grant Evaluation — finance-agent requesting stripe_read

   | Metric | Value | Threshold | Status |
   |---|---|---|---|
   | Task success rate | 97% | >95% | PASS |
   | Sessions completed | 142 | >50 | PASS |
   | Security incidents | 0 | 0 | PASS |
   | Budget compliance | 100% | >98% | PASS |
   | ROI estimate | 4.2x | >3x | PASS |

   **Decision**: GRANT stripe_read autonomously (Tier 3).
   ```

4. **Proactive Tool Request Handling**: Sub-agents send structured
   requests when they hit roadblocks:

   ```json
   {
     "event": "tool_request",
     "from": "finance-agent",
     "tool": "stripe_read",
     "justification": "Need to verify payment status for ticket #123",
     "estimated_uses": 5,
     "budget_impact": "$0.02"
   }
   ```

   The Lead reviews the request against its SOUL.md rules, checks
   the agent's session history, and decides autonomously (Tier 3) or
   escalates to human (Tier 4).

5. **Result Synthesis Across Tiered Agents**: The Lead aggregates outputs
   from agents operating at different tiers and produces unified results.
   A finance report might combine data from:
   - Tier 1 agent (internal calculations)
   - Tier 2 agent (read-only Stripe data)
   - Tier 3 agent (Gmail drafts for client communication)

   The Lead synthesizes these into a coherent deliverable, routing the
   final Gmail send (Tier 4) to human approval.

### 4.2 Why Loose Coordination Beats Rigid Tool Policies

Rigid tool policies ("all agents get the same allowlist, tool requests go
through a centralized approval queue, grants expire on fixed schedules")
create **straight-jacket automations** that break in practice:

| Rigid Policy Problem | Loose Coordination Solution |
|---|---|
| Uniform allowlist blocks legitimate tools for some roles | Lead tailors tool access per-agent based on role and task |
| Centralized approval queue creates bottleneck | Lead handles Tier 3 grants autonomously, instantly |
| Fixed grant expiry disrupts ongoing work | Lead manages grant lifecycle per-agent, per-task |
| Adding new tools requires global policy update | Lead installs skills to individual workspaces as needed |
| No performance-based trust escalation | Lead tracks agent metrics and grants tools as trust grows |
| Tool revocation is all-or-nothing | Lead revokes per-agent, per-tool based on specific incidents |

The Lead-as-CEO approach means tool access **evolves per-agent** based on
actual performance, task requirements, and trust history—not a one-size
policy imposed on the entire squad. When a new agent joins, it starts at
Tier 1 and earns tool access through demonstrated competence.

### 4.3 Lead SOUL.md Tool-Granting Directives

```markdown
## Tool Granting Rules (CEO Mode)

1. You are the CEO of this squad. Sub-agents request tools via
   `agentToAgent` messaging with structured [event:tool_request] payloads.

2. For Tier 3 tools (read-only APIs, draft emails, query tools):
   - Evaluate the sub-agent's performance history and plan.
   - If logical and within budget: execute
     `openclaw skills install <skill> --workspace <agent_id>`.
   - Run `openclaw security audit` before every grant.
   - Log grant to MEMORY.md.

3. For Tier 4 tools (write APIs, send emails, payments, deploys):
   - YOU MUST message the human operator for approval before granting.
   - Include: tool name, requesting agent, justification, risk summary.
   - Wait for explicit approval before executing the install.

4. Never grant a tool globally. Always target the specific sub-agent's
   workspace directory.

5. Periodically audit sub-agent tool holdings via HEARTBEAT.md cron.
   Revoke unused tools after 7 days of inactivity.
```

---

## 5. Safe Approval Workflows & Sandbox Integration

### 5.1 Tiered Approval Flow

| Risk Level | Approval Method | Latency |
|---|---|---|
| **Low (Tier 1–2)** | Automatic at agent creation | Instant |
| **Medium (Tier 3)** | Lead decides autonomously after security audit | Seconds |
| **High (Tier 4)** | Lead proposes → human approves via channel message | Minutes to hours |
| **Critical** | Lead proposes → human reviews full security audit → pairing code | Hours (rare) |

### 5.2 Human-in-the-Loop for Tier 4

The Lead intercepts Tier 4 requests and sends a direct message to the
admin via the configured channel (Telegram, Slack, WhatsApp):

```
Lead → Human (via Telegram):
"Worker-2 (finance-agent) requests aws_deploy for Project X.
Justification: Deploy updated billing service.
Risk: HIGH — production infrastructure modification.
Budget impact: ~$12/deployment.
Security audit: PASSED (openclaw security audit --deep).
Approve? Reply Y or N, or use: openclaw pairing approve 48291"
```

### 5.3 Pairing Code Approval

For maximum security on Tier 4 grants:

```bash
# Human approves via CLI with pairing code
openclaw pairing approve telegram @lead-ceo 48291

# Or via channel reply: "Y" to the Lead's message
```

### 5.4 Sandbox Enforcement on Grant

When the Lead grants any new tool, it automatically applies sandbox limits:

- Tools installed strictly to `~/.openclaw/agents/<worker_id>/workspace/skills/`
  — never to global `~/.openclaw/skills/`.
- Sandbox mode enforced: `sandbox.mode: "all"` for newly-granted tools.
- Workspace access scoped: `"rw"` only for the target agent's workspace.
- Docker container isolation: each agent runs in its own `openclaw-sbx-*`
  container.

```json
{
  "sandbox": {
    "mode": "all",
    "workspaceAccess": "rw",
    "networkAccess": "restricted",
    "allowedDomains": ["api.stripe.com"],
    "autoRevoke": {
      "inactivityDays": 7,
      "onSecurityIncident": true
    }
  }
}
```

### 5.5 Budget Checks Before Grant

The Lead runs a budget check skill before granting payment-related tools:

```bash
# Lead checks Stripe balance before granting payment tools
openclaw skills run budget-check --agent finance-agent
# Output: "Current balance: $12,400. Monthly spend cap: $5,000.
#          Projected impact of grant: +$200/month. WITHIN BUDGET."
```

---

## 6. Per-Agent Workspace Tool Injection

### 6.1 Installing Skills to a Specific Agent

Tools are installed per-workspace, never globally:

```bash
# Install skill only for one agent (Lead executes this)
openclaw skills install stripe-api-tool --workspace finance-agent

# Or using clawhub directly:
cd ~/.openclaw/workspace/finance-agent
clawhub install stripe-api-tool

# Or from a specific GitHub source:
openclaw skills install \
  https://github.com/VoltAgent/awesome-openclaw-skills/tree/main/stripe_read \
  --workspace ~/.openclaw/agents/worker-beta/workspace
```

Skills appear instantly in the next session (watcher enabled by default).
Workspace skills override managed/bundled skills (precedence rule).

### 6.2 Workspace Isolation

Each agent's tool installation is completely isolated:

```
~/.openclaw/agents/
├── lead-ceo/
│   └── workspace/
│       └── skills/           # Full tool profile
│           ├── gmail-send/
│           ├── stripe-full/
│           └── notion-write/
├── finance-agent/
│   └── workspace/
│       └── skills/           # Tier 2 + Lead-granted Tier 3
│           ├── stripe-read/  # Lead granted (Tier 3)
│           └── calculator/   # Pre-approved (Tier 2)
└── researcher/
    └── workspace/
        └── skills/           # Tier 2 only
            ├── web-search/
            └── browser-limited/
```

### 6.3 Config Patching for Tool Grants

The Lead can also grant tools by patching `openclaw.json` directly:

```json
{
  "agents": {
    "list": [
      {
        "id": "finance-agent",
        "tools": {
          "allow": ["read", "sessions_*", "stripe_read", "gmail_draft"]
        },
        "sandbox": { "workspaceAccess": "rw" }
      }
    ]
  }
}
```

After patching, the Lead triggers a reload:

```bash
openclaw doctor --fix
# Or for zero-downtime:
openclaw secrets reload
```

---

## 7. Integration Points

### 7.1 Security Checklist Integration

Every tool grant runs `openclaw security audit`; new tools are
auto-sandboxed unless explicitly disabled:

```bash
# Lead runs before every grant
openclaw security audit --deep
openclaw doctor --watch  # continuous monitoring in cron
```

### 7.2 Agent Evolution & Personality

SOUL.md + AGENTS.md updated by Lead or human as agents earn new tools.
Agents can proactively request tools with justification:

```markdown
# Agent's proactive request (in agentToAgent message):
"I need Stripe access to automate invoicing. Projected savings:
12 hours/week. I've completed 142 sessions with 97% success rate
and zero security incidents. Requesting Tier 3 stripe_read grant."
```

The Lead evaluates performance history before deciding—loose,
contextual evaluation rather than a rigid approval form.

### 7.3 Independence & Sandbox Scope

- Tools granted to one workspace only—never shared across agents.
- Sub-agents run in isolated Docker sandboxes (`sandbox.mode: "all"`,
  `workspaceAccess: "rw"` scoped to their own workspace).
- The Lead cannot access a sub-agent's workspace directly without
  explicit escalation—tool grants are pushed, not pulled.

### 7.4 Coordination via sessions_*

The Lead uses `sessions_spawn` and `sessions_send` during task routing:

```
Lead receives "Process monthly invoices"
  → sessions_spawn finance-agent with Tier 3 tools injected
  → sessions_send researcher "Pull latest pricing data"
  → Waits for results via sessions_list/history
  → Synthesizes invoice report
  → Routes final email send (Tier 4) to human approval
```

### 7.5 Observability Integration

Tool grants feed into the observability stack (Topic 13):

- **Prometheus metrics**: `openclaw_tool_grants_total`,
  `openclaw_tool_revocations_total`, `openclaw_tier4_approvals_pending`
- **LangFuse traces**: tool grant events appear as spans with metadata
  (agent, tool, tier, justification, approval_method)
- **Alertmanager**: fire if `tool_grants_pending > 0 for 1h` (stuck
  approval) or `tool_security_incidents > 0`

### 7.6 HEARTBEAT.md Tool Audit

The Lead periodically audits sub-agent tool holdings:

```yaml
# In Lead's HEARTBEAT.md
tool_audit:
  schedule: "0 */6 * * *"    # Every 6 hours
  actions:
    - check_unused_tools:
        threshold_days: 7
        action: revoke
    - check_security_incidents:
        action: revoke_and_alert
    - check_budget_compliance:
        action: alert_if_exceeded
    - report_to_memory:
        format: markdown_table
```

---

## 8. Real 2026 Production Examples

### 8.1 Success Stories

**Context Studios (LumaDock case)**: Lead autonomously granted Gmail +
Notion write to a customer service agent after 2 weeks of successful
read-only operation. Before: human routed every task manually. After:
78 custom MCP tools, 13 cron jobs fully autonomous, squad revenue +40%.
The key: graduated trust—agent started at Tier 1, earned Tier 2, then
the Lead granted Tier 3 based on performance metrics.

**Matthew Berman's Squad (Feb 2026)**: Lead granted Gmail + Calendar +
Asana to specialist agents. Nightly "business council" report now runs
without intervention. The Lead orchestrates all tool grants and revocations
via its own HEARTBEAT.md cron.

**"Claw Mart" AI CEO (X/community)**: Lead granted Stripe + email send
after a budget-check skill proved the agent was safe with payment tools.
Scaled to $80k/month revenue with zero constant babysitting. Human
approval required only for refunds >$500 (Tier 4).

**LumaDock High-Availability Cluster**: Lead in primary node grants tools
to Kubernetes-scaled specialist pods via workspace mounts. Tool grants
propagate across pods via shared config volume.

**LumaDock Tiered Wins**: Production teams isolated Lead from worker
agents. One squad allowed the Lead to autonomously grant "Gmail Draft"
(Tier 3) to a customer service agent. The worker drafts responses, but
the Lead routes the final `gmail_send` (Tier 4) to a human manager—
clean separation of draft (autonomous) from send (human-gated).

### 8.2 Production Metrics

| Deployment | Squad Size | Tier 3 Grants (Autonomous) | Tier 4 Grants (Human) | Security Incidents | Autonomy Gain |
|---|---|---|---|---|---|
| Context Studios | 12 agents | 78 tools | 5 tools | 0 | 5× |
| Berman Squad | 8 agents | 23 tools | 3 tools | 0 | 7× |
| Claw Mart | 6 agents | 15 tools | 2 tools | 0 | 10× |
| LumaDock HA | 19 agents | 45 tools | 8 tools | 0 | 6× |

Squads using the four-tier + SecretRef discipline report **5–10×
autonomy gains with zero breaches** in early 2026.

---

## 9. Common Failure Modes & Anti-Patterns

| Anti-Pattern | Consequence | Prevention |
|---|---|---|
| **Hard-coded keys** in openclaw.json or `.env` | Immediate breach (ClawJacked CVE) | SecretRef + `openclaw doctor` + `.secrets.baseline` |
| **Blanket grants** (`tools.allow: ["*"]`) | One rogue sub-agent wipes inbox | Per-agent allowlists, Lead-managed grants |
| **No Lead oversight** | Constant human babysitting (pre-2026.2 pattern) | Lead-as-CEO with autonomous Tier 3 grants |
| **Shared workspace skills** for high-risk APIs | Privilege escalation across agents | Per-agent workspace isolation, never global install |
| **Missing sandbox on Tier 3 grants** | Host takeover via prompt injection | `sandbox.mode: "all"` enforced on every grant |
| **No performance evaluation before grant** | Unreliable agents get dangerous tools | Lead checks metrics before every Tier 3 grant |
| **No budget check before payment tools** | Runaway spend, unauthorized charges | Budget-check skill runs before financial grants |
| **Workers installing own skills from ClawHub** | Malicious skills (341+ discovered in 2026) | Lead is sole package manager for the squad |
| **No periodic tool audit** | Unused tools create attack surface | HEARTBEAT.md cron revokes after 7 days inactive |
| **Giving `exec` to all agents** | Prompt injection → server compromise | `exec` only for Lead and coding-profile agents |

---

## 10. Step-by-Step Setup Commands

### 10.1 Vault Creation & Configuration

```bash
# Option A: External HashiCorp Vault
openclaw secrets configure --provider vault \
  --url https://vault.mycompany.com
openclaw secrets audit
openclaw secrets apply

# Option B: Local age-encrypted vault
# Generate encryption key
age-keygen -o key.txt
# Encrypt secrets file
age -r $(cat key.txt | grep "public" | awk '{print $NF}') \
  secrets.env > secrets.env.age
# Store key.txt securely (not in repo)
```

### 10.2 Tiered Allowlist Configuration

```json
{
  "agents": {
    "defaults": {
      "tools": {
        "profile": "minimal",
        "allow": ["read", "sessions_*"]
      },
      "sandbox": {
        "mode": "all",
        "workspaceAccess": "none"
      }
    },
    "list": [
      {
        "id": "lead-ceo",
        "tools": { "profile": "full" },
        "sandbox": { "workspaceAccess": "rw" }
      },
      {
        "id": "finance-agent",
        "tools": {
          "profile": "minimal",
          "allow": ["read", "sessions_*", "calculator"]
        },
        "sandbox": { "workspaceAccess": "rw" }
      },
      {
        "id": "email-specialist",
        "tools": {
          "profile": "messaging",
          "allow": ["read", "sessions_*", "gmail_draft"]
        },
        "sandbox": { "workspaceAccess": "rw" }
      }
    ]
  }
}
```

### 10.3 Lead Tool-Granting Skill Installation

```bash
# Add Lead's SOUL.md tool-granting directives (Section 4.3)
cat >> ~/.openclaw/agents/lead-ceo/workspace/SOUL.md << 'EOF'

## Tool Granting Rules (CEO Mode)
- Evaluate performance metrics before any Tier 3 grant.
- Run openclaw security audit before every grant.
- For Tier 4: message human and wait for explicit approval.
- Never grant tools globally. Target specific workspaces.
- Log every grant to MEMORY.md.
- Audit tool holdings every 6 hours via HEARTBEAT.md.
EOF
```

### 10.4 Tier 3 Grant Example (Lead Grants Stripe Read)

```bash
# Lead grants stripe-read to finance-agent
openclaw skills install stripe-api-tool \
  --workspace ~/.openclaw/agents/finance-agent/workspace

# Verify installation
ls ~/.openclaw/agents/finance-agent/workspace/skills/
# Output: stripe-api-tool/

# Log to MEMORY.md
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) GRANT: stripe-api-tool → finance-agent (Tier 3, autonomous)" \
  >> ~/.openclaw/agents/lead-ceo/workspace/MEMORY.md
```

### 10.5 Tier 4 Grant Example (Human Approves Gmail Send)

```bash
# Lead sends approval request to human via Telegram
# (automated by Lead's agentToAgent + channel binding)

# Human approves via pairing code
openclaw pairing approve telegram @lead-ceo 48291

# Lead executes the grant after approval
openclaw skills install gmail-send-tool \
  --workspace ~/.openclaw/agents/email-specialist/workspace

# Log with approval reference
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) GRANT: gmail-send-tool → email-specialist (Tier 4, human approved, pairing:48291)" \
  >> ~/.openclaw/agents/lead-ceo/workspace/MEMORY.md
```

### 10.6 Monitoring & Audit Setup

```bash
# Add tool audit to Lead's HEARTBEAT.md
cat >> ~/.openclaw/agents/lead-ceo/workspace/HEARTBEAT.md << 'EOF'

## Tool Audit Cron
- Every 6h: audit all sub-agent tool holdings
- Revoke tools inactive >7 days
- Alert on any security incidents
- Report tool grant/revoke log to MEMORY.md
EOF

# Add security audit to system cron
echo "0 */6 * * * openclaw security audit --deep >> /var/log/openclaw-audit.log" \
  | crontab -

# Continuous monitoring
openclaw doctor --watch
```

---

## 11. Practical Recommendations

### For Solo Developers / Small Teams (1–3 Agents)

- Start every agent with `"minimal"` profile + `sandbox.mode: "all"`.
- Lead gets `"full"` profile—sole owner of tool grants.
- Use age-encrypted local vault for secrets.
- Install `openclaw doctor --watch` in cron for continuous monitoring.
- Grant tools manually via Lead or CLI as needed.

### For Medium Teams (4–8 Agents)

- Everything above, plus:
- **Lead-as-CEO with autonomous Tier 3 grants** based on performance
  evaluation (SOUL.md rules + metrics check).
- External vault (HashiCorp or 1Password) with SecretRef per-agent.
- HEARTBEAT.md cron for periodic tool audit (every 6 hours).
- Budget-check skill before any financial tool grant.
- Per-agent sandbox with restricted network access.

### For Large Deployments (9+ Agents, Multiple Leads)

- Everything above, plus:
- **Hierarchical tiering**: each Lead manages tool grants for its squad;
  meta-Lead coordinates cross-squad tool policies.
- Kubernetes workspace mounts for scalable tool propagation.
- LangFuse integration for tool grant observability.
- Automated security audit pipeline (`openclaw security audit --deep`)
  before every Tier 3+ grant.
- Quarterly tool access review: revoke unused, re-evaluate tiers.

### Universal Best Practices

1. **Never grant tools globally**—always target specific agent workspaces.
2. **Lead is the sole package manager**—agents never install their own
   skills from ClawHub (malicious skill risk).
3. **Run security audit before every grant**—it takes seconds and catches
   vulnerabilities before they're exploitable.
4. **Use SecretRef, never plaintext**—the ClawJacked CVE proved this.
5. **Audit tool holdings regularly**—unused tools are attack surface.
6. **Start at Tier 1, earn upward**—every agent begins with minimal
   tools and earns access through demonstrated performance.
7. **Loose coordination through the Lead** prevents both over-engineering
   (rigid approval queues) and under-engineering (no oversight at all).
   The Lead's contextual judgment is better than any static policy.

---

## 12. Summary

Tool access tiering in OpenClaw v2026.3.x follows a **4-tier hierarchy**:
built-in safe tools (Tier 1), pre-approved role-based tools (Tier 2),
Lead-as-CEO autonomous grants (Tier 3), and human-approved high-risk tools
(Tier 4). The Lead operates as CEO of the tool ecosystem—decomposing tasks,
routing work via bindings and `sessions_send`, evaluating agent performance,
and autonomously granting tools, API access, email accounts, and secrets as
agents grow (with one-time human approval for high-risk grants only).
SecretRef objects replace plaintext credentials, with per-agent injection
scoped to individual workspaces—never global. Docker sandboxing enforces
isolation at every tier, and periodic HEARTBEAT.md audits revoke unused
tools to minimize attack surface. Loose coordination—where the Lead makes
contextual, per-agent, per-task tool decisions rather than enforcing rigid
global policies—prevents both the chaos of unmanaged access and the
bottleneck of over-centralized approval queues. Production squads using the
four-tier + SecretRef discipline report **5–10× autonomy gains with zero
breaches** in early 2026. The key principle: **start every agent at Tier 1,
let them earn upward through performance, and let the Lead manage the
journey**.
