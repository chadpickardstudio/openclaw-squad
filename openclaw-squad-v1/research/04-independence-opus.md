# 4. Independence & Memory Hygiene

## OpenClaw Multi-Agent Squad — Deep Research (March 2026)

---

## Table of Contents

1. [Why Full Per-Agent Independence Is Non-Negotiable](#1-why-full-per-agent-independence-is-non-negotiable)
2. [Recommended Private Workspace Structure Per Agent](#2-recommended-private-workspace-structure-per-agent)
3. [How OpenClaw Enforces Isolation](#3-how-openclaw-enforces-isolation)
4. [MEMORY.md Best Practices](#4-memorymd-best-practices)
5. [No-Recursion Rules](#5-no-recursion-rules)
6. [Daily/Weekly Memory Hygiene Routines](#6-dailyweekly-memory-hygiene-routines)
7. [Real 2026 Production Examples](#7-real-2026-production-examples)
8. [Integration with Lead-as-CEO Autonomy](#8-integration-with-lead-as-ceo-autonomy)
9. [Tool and Skill Isolation](#9-tool-and-skill-isolation)
10. [Common Failure Modes & Anti-Patterns](#10-common-failure-modes--anti-patterns)
11. [Step-by-Step Setup Commands & Config Snippets](#11-step-by-step-setup-commands--config-snippets)
12. [Sources & References](#12-sources--references)

---

## 1. Why Full Per-Agent Independence Is Non-Negotiable

### The 2026 Reality

OpenClaw has exploded to **249K+ GitHub stars** and **5,700+ community-built skills** as of March 2026. The framework is being used to run everything from solo personal assistants to 16-agent multi-agent squads. At this scale, the single most critical architectural decision is **full per-agent isolation**. Without it, multi-agent systems degrade catastrophically within days.

### The Four Horsemen of Shared-State Failure

#### 1.1 Context Poisoning

When agents share memory files, one agent's domain-specific context bleeds into another's decision-making. A real-world bug report from the `mem0` integration (GitHub Issue #3998, Feb 2026) demonstrated this perfectly:

> *"A personal assistant agent and a healthcare clinic assistant agent sharing the same gateway — clinic SOPs and compliance memories bleed into the personal assistant's context."*

The problem: Mem0 used a single `userId` for all agents sharing a gateway. Agent A's memories were recalled for Agent B. The fix required extracting `agentId` from session keys (pattern `agent:<agentId>:...`) and using it as the effective userId for non-main agents.

**What context poisoning looks like in practice:**
- A sales agent starts quoting medical compliance procedures
- A coding agent references a user's personal calendar preferences in technical decisions
- An analytics agent surfaces irrelevant project data from a content-writing agent's notes

#### 1.2 Recursion Loops

Recursion loops are the **single most expensive failure mode** in OpenClaw. Multiple confirmed incidents in 2026:

| Incident | Root Cause | Cost / Impact |
|----------|-----------|---------------|
| Issue #5960 (Jan 31) | Agent stuck retrying broken AppleScript — 123 Opus 4.5 calls in 16 min | **$4.85 in 16 minutes**, killed only by rate limit |
| Issue #17442 (Feb 15) | Subagent callback infinite loop — 2,258 re-injections at ~3s intervals | Model upgraded from Haiku → Opus per callback, exponential context growth |
| Issue #28533 (Feb 27) | Cron job retry loop — 498 exec calls in 30 minutes | Entire token budget consumed, script only needed 72 seconds |
| Issue #3181 (Jan 28) | Runaway heartbeat loop + Telegram send failures | High CPU, excessive LLM invocations, rapid log growth |

One user reported a **$37 bill from a single recursive research task in six hours**. Another community member documented **$750 in bills from 48 hours of unsupervised agents**. When agents can trigger each other (shared state, shared session keys), recursion risk multiplies combinatorially.

#### 1.3 Skill Bleed

OpenClaw has a three-tier skill precedence system:

| Location | Precedence | Scope |
|----------|------------|-------|
| Workspace skills (`<workspace>/skills/`) | Highest | Per-agent, user-owned |
| Managed/local skills (`~/.openclaw/skills/`) | Medium | Shared across all agents on machine |
| Bundled skills (shipped with install) | Lowest | Come with npm package |

When multiple agents share a workspace, skill overrides from one agent apply to all. A coding agent's custom `exec` skill configuration can silently change how a content agent handles shell commands. The official docs warn: *"Name collisions: workspace skills override managed/bundled skills when names collide."*

#### 1.4 "Hive-Mind" Degradation

Over 2+ weeks of shared operation, all agents converge toward a muddled median persona. This happens because:

- Shared `MEMORY.md` accumulates facts from all agents without attribution
- Shared `SOUL.md` instructions get diluted as agents apply them in conflicting ways
- The semantic search index (`~/.openclaw/memory/<agentId>.sqlite`) conflates embeddings from different domains
- Daily logs become a soup of unrelated events, making retrieval unreliable

The Cognee team documented this precisely: *"Memory isn't separated per user or dataset so everything bleeds together"* and *"When working across multiple projects, searches sometimes return irrelevant results from other contexts."*

### The Independence Principle (Summary)

```
┌─────────────────────────────────────────────────────┐
│  RULE: Each agent MUST have its own:                │
│                                                      │
│  ✓ Workspace directory (separate filesystem path)    │
│  ✓ SOUL.md (personality + boundaries)                │
│  ✓ MEMORY.md (long-term curated memory)              │
│  ✓ memory/ directory (daily logs)                    │
│  ✓ Session store (chat history + routing state)      │
│  ✓ Auth profiles (credentials)                       │
│  ✓ Skills directory (tool definitions)               │
│  ✓ SQLite memory index                               │
│  ✓ Sandbox configuration                             │
│                                                      │
│  "Isolated" here is not marketing language.           │
│  — OpenClaw official docs (Multi-Agent Routing)      │
└─────────────────────────────────────────────────────┘
```

---

## 2. Recommended Private Workspace Structure Per Agent

### Official OpenClaw Workspace Layout

The official agent workspace documentation (docs.openclaw.ai/concepts/agent-workspace) defines the following standard structure. For multi-agent squads, **each agent gets its own copy** at a unique path.

```
~/.openclaw/workspace-<agentId>/
├── AGENTS.md            # Operating instructions, memory rules, behavior
├── SOUL.md              # Persona, tone, boundaries — loaded every session
├── USER.md              # Who the user is, preferences, communication style
├── IDENTITY.md          # Agent name, vibe, emoji — created during bootstrap
├── TOOLS.md             # Notes about local tools/conventions (guidance only)
├── HEARTBEAT.md         # Tiny checklist for heartbeat runs
├── BOOTSTRAP.md         # One-time first-run ritual
├── MEMORY.md            # Curated long-term memory (private sessions only)
├── memory/
│   ├── 2026-03-01.md    # Daily log — append-only
│   ├── 2026-03-02.md
│   └── 2026-03-03.md
├── skills/              # Per-agent skills (highest precedence)
│   └── <skill-name>/
│       └── SKILL.md
├── canvas/              # Canvas UI files (optional)
│   └── index.html
├── logs/                # Agent-specific log output
├── temp/                # Ephemeral scratch space
└── reflection.md        # Weekly self-assessment (custom addition)
```

### LifeClaw/TradeClaw Adapted Structure (16-Agent Squad)

For your Sopranos-themed architecture, each sub-agent (e.g., `silvio`, `paulie`, `christopher`) should live in its own directory under a central `agents-workspaces/` umbrella:

```
~/.openclaw/workspace/agents-workspaces/
├── tony/                          # Lead/Orchestrator (Tony Soprano)
│   ├── SOUL.md                    # Boss personality + routing logic
│   ├── IDENTITY.md                # "Tony" — orchestrator identity
│   ├── AGENTS.md                  # Full roster awareness
│   ├── MEMORY.md                  # Routing index (50 lines max)
│   ├── memory/
│   │   └── 2026-03-03.md
│   ├── skills/
│   │   └── route-task/SKILL.md    # Delegation logic
│   ├── oversight/                 # Read-only view of all agent MEMORY.md
│   ├── logs/
│   ├── temp/
│   └── reflection.md
│
├── silvio/                        # Sub-agent example
│   ├── SOUL.md                    # Silvio-specific personality + rules
│   ├── IDENTITY.md
│   ├── AGENTS.md                  # Knows the team exists (no access)
│   ├── MEMORY.md                  # Domain-specific long-term memory
│   ├── memory/
│   │   └── 2026-03-03.md
│   ├── skills/
│   │   └── <domain-skills>/
│   ├── logs/
│   ├── temp/
│   └── reflection.md
│
├── paulie/
│   └── ... (identical structure)
├── christopher/
│   └── ... (identical structure)
└── ... (remaining 12 agents)
```

### Critical Configuration: Per-Agent Workspace Assignment

In `openclaw.json`, each agent **must** point to its own workspace:

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace-main"    // fallback only
    },
    list: [
      {
        id: "tony",
        default: true,
        workspace: "~/.openclaw/workspace/agents-workspaces/tony"
      },
      {
        id: "silvio",
        workspace: "~/.openclaw/workspace/agents-workspaces/silvio"
      },
      {
        id: "paulie",
        workspace: "~/.openclaw/workspace/agents-workspaces/paulie"
      },
      {
        id: "christopher",
        workspace: "~/.openclaw/workspace/agents-workspaces/christopher"
      }
      // ... remaining agents
    ]
  }
}
```

> **WARNING:** The official docs state: *"Never reuse agentDir across agents (it causes auth/session collisions)."* This applies to workspace directories equally.

### Files That Must NEVER Be Shared

| File | Why Private |
|------|------------|
| `SOUL.md` | Each agent needs distinct personality boundaries. Symlinks OK **only** for shared base rules, with per-agent IDENTITY.md overrides |
| `MEMORY.md` | This is the agent's brain. Sharing = context poisoning within 48 hours |
| `memory/*.md` | Daily logs contain session-specific events. Cross-agent mixing destroys retrieval quality |
| `skills/` | Tool definitions must be scoped. A research agent should not have email-sending skills |
| Session store | `~/.openclaw/agents/<agentId>/sessions` — never cross-reference |
| SQLite index | `~/.openclaw/memory/<agentId>.sqlite` — per-agent by default |

### Files That CAN Be Shared (Read-Only Copies)

| File | How to Share |
|------|-------------|
| `AGENTS.md` (team roster) | Each agent gets a **read-only copy** listing the team. Not the full operational instructions — just "who's on the team" |
| `USER.md` | Can be symlinked if all agents serve the same user. Use per-agent copies if agents serve different audiences |
| Base `SOUL.md` rules | Create a `shared-rules.md` that gets `cat`'d into each agent's SOUL.md at build time |

---

## 3. How OpenClaw Enforces Isolation

### 3.1 Workspace-Level Isolation

OpenClaw's workspace is the agent's working directory. The official docs clarify:

> *"It is the only working directory used for file tools and for workspace context. Keep it private and treat it as memory."*

Each agent resolves its workspace via `resolveSessionAgentIds` in `src/agents/agent-scope.ts`, which maps session keys to agent IDs. The `sessionAgentId` drives all per-session decisions: workspace resolution, tool policy, model selection, and prompt mode.

**Key enforcement points:**
- Session keys are structured strings encoding agent routing context
- Workspace context files (AGENTS.md, SOUL.md, MEMORY.md) are injected per-agent via `resolveBootstrapContextForRun`
- File sizes are capped by `bootstrapMaxChars` (default 20,000) and `bootstrapTotalMaxChars` (default 150,000)

### 3.2 Docker Sandbox Isolation

OpenClaw supports three sandbox modes via `agents.defaults.sandbox.mode` or per-agent `agents.list[].sandbox.mode`:

| Mode | Behavior |
|------|----------|
| `off` | Tools run directly on host (default for main session) |
| `non-main` | Only non-main sessions (groups/channels) sandboxed in Docker |
| `all` | Everything sandboxed — maximum isolation |

**Sandbox scope controls container lifecycle:**

| Scope | Behavior |
|-------|----------|
| `session` | Each session gets its own container, destroyed on session end (strongest isolation) |
| `agent` | Container shared across sessions for same agent (some state persistence) |
| `shared` | Single container for all agents (weakest — avoid for multi-agent) |

**Per-agent sandbox configuration:**

```json5
{
  agents: {
    list: [
      {
        id: "tony",
        sandbox: { mode: "off" }    // Lead needs full host access
      },
      {
        id: "silvio",
        sandbox: {
          mode: "all",
          scope: "agent",
          docker: {
            network: "none",           // No egress by default
            binds: ["/mnt/data/silvio:/data:rw"],
            setupCommand: "apt-get install -y jq"
          }
        },
        tools: {
          allow: ["read", "write", "edit", "memory_search", "memory_get"],
          deny: ["exec", "browser", "gateway", "nodes", "cron"]
        }
      }
    ]
  }
}
```

**Critical sandbox security features:**
- Default `docker.network` is `"none"` (no egress)
- `validateSandboxSecurity` runs hard checks before Docker is invoked — throws on any violation
- `fail-closed` design: if sandbox mode is configured but no runtime is active, exec tool **throws** rather than silently running on host
- Each sandbox container is labeled with a config hash; security audit detects stale or misconfigured containers

### 3.3 Docker Volumes for Data Isolation

For maximum isolation in production multi-agent deployments:

```yaml
# docker-compose.yml — per-agent volumes
version: "3.9"
services:
  openclaw-gateway:
    image: openclaw/openclaw:latest
    read_only: true
    cap_drop: [ALL]
    cap_add: [NET_BIND_SERVICE]
    volumes:
      # Per-agent workspace volumes — never shared
      - tony-workspace:/root/.openclaw/workspace/agents-workspaces/tony:rw
      - silvio-workspace:/root/.openclaw/workspace/agents-workspaces/silvio:rw
      - paulie-workspace:/root/.openclaw/workspace/agents-workspaces/paulie:rw
      # Shared config (read-only)
      - ./openclaw.json:/root/.openclaw/openclaw.json:ro
    environment:
      - OPENCLAW_SANDBOX=1

volumes:
  tony-workspace:
  silvio-workspace:
  paulie-workspace:
```

### 3.4 Filesystem Sandboxing

The workspace is the default `cwd`, **not a hard sandbox**. Tools resolve relative paths against the workspace, but absolute paths can still reach elsewhere on the host. To enforce hard isolation:

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        docker: {
          network: "none",
          binds: []    // No additional host mounts
        }
      },
      workspaceAccess: "rw"    // "ro" or "none" for locked-down agents
    }
  }
}
```

**Security Issue #7827 (Feb 2026)** proposed making these secure defaults:
- `sandbox.docker.network: "none"` for sandboxed sessions by default
- `workspaceAccess: "none"` in sample configs unless explicitly needed
- `dmScope: "per-channel-peer"` so DMs from different people don't share context
- Deny high-risk tools by default (`exec`, `browser`, `web_fetch`, `gateway`, `nodes`, `cron`)
- Avoid loading long-term memory in shared contexts

### 3.5 Per-Agent Config Overrides

OpenClaw resolves configuration through a merge chain:

```
agents.defaults (baseline) → agents.<agentId> (per-agent overrides)
```

Every config key that exists under `defaults` can be overridden per-agent. This includes:
- `workspace` — filesystem path
- `sandbox` — Docker isolation settings
- `tools` — allow/deny lists
- `model` — primary + fallback models
- `compaction` — memory flush behavior
- `memorySearch` — embedding provider + index path

---

## 4. MEMORY.md Best Practices

### The Two-Layer Memory Architecture

OpenClaw's memory is built on a simple but powerful split:

| Layer | File | Purpose | Lifecycle |
|-------|------|---------|-----------|
| **Episodic** | `memory/YYYY-MM-DD.md` | Daily log, append-only. Raw running context | Read today + yesterday at session start |
| **Semantic** | `MEMORY.md` | Curated long-term memory. Durable facts and preferences | Loaded only in main/private sessions |

This is **the source of truth**. The model only "remembers" what's written to disk.

### MEMORY.md Template (Production-Ready)

```markdown
# MEMORY.md — Long-Term Memory
# Agent: silvio | Domain: Sales Outreach
# Last distilled: 2026-03-02
# Target size: ≤50 lines (routing index, NOT knowledge dump)

## Identity
- Agent role: Sales outreach specialist for TradeClaw
- Operates as "Natalie from Molty Sites"
- Reports to: Tony (Lead/Orchestrator)

## Core Facts
- Target market: UK tradespeople without websites
- Pricing: £97/month, £497 buyout, £47/month post-buyout SEO
- Platform: Saleshandy for email campaigns
- Current phase: Live campaigns (post shadow-mode)

## Active Constraints
- Budget cap: £3.50/day hard limit across all agents
- Never send email without Lead approval
- No cold calling — email only
- Respect UK GDPR for all outreach

## Knowledge Pointers (load on demand)
- Trade templates: → skills/trade-templates/SKILL.md
- Objection handling: → memory/reference/objections.md
- Campaign metrics: → memory/reference/metrics.md
- Compliance rules: → memory/reference/gdpr-compliance.md

## Recent Decisions (rotate weekly)
- [2026-03-01] Plumber template v3 approved by Lead
- [2026-02-28] Switched to 3-email sequence (was 5)
- [2026-02-25] Added roofer vertical to target list
```

### Daily Auto-Journaling

OpenClaw's memory flush mechanism writes to daily logs before compaction:

```json5
{
  agents: {
    defaults: {
      compaction: {
        mode: "safeguard",
        reserveTokensFloor: 20000,
        memoryFlush: {
          enabled: true,
          softThresholdTokens: 8000,
          systemPrompt: "CRITICAL: Session nearing compaction. Store durable memories NOW.",
          prompt: "Write everything important from this session to memory/YYYY-MM-DD.md immediately. Include: decisions made, tasks completed, context needed for continuity. Reply NO_REPLY when done."
        }
      }
    }
  }
}
```

**Daily log template** (`memory/YYYY-MM-DD.md`):

```markdown
# 2026-03-03

## Session Log
- [09:15] Received 3 new plumber leads from Saleshandy
- [09:22] Drafted follow-up emails for Bristol leads
- [10:45] Lead approved roofer template v2
- [14:30] Campaign metrics: 12% open rate, 3% reply rate

## Decisions
- Shortened subject lines to ≤6 words (testing)
- Paused electrician campaign pending template review

## Errors / Blockers
- Saleshandy API rate limited at 11:00 — backed off 30min

## Carry Forward
- Bristol leads need follow-up by 2026-03-04
- Roofer template v2 needs A/B test setup
```

### Weekly Distillation

Every 7 days, the agent (or a scheduled hygiene script) should:

1. **Scan** the week's daily logs (`memory/2026-02-24.md` through `memory/2026-03-02.md`)
2. **Extract** durable facts, decisions, and pattern changes
3. **Update** `MEMORY.md` with new permanent entries
4. **Rotate** the "Recent Decisions" section (keep only last 7 days)
5. **Archive** old daily logs to `memory/archive/2026-W09/`

### Long-Term Compaction

After 30 days, daily logs should be compacted into monthly summaries:

```
memory/
├── 2026-03-03.md          # Current week (keep raw)
├── 2026-03-02.md
├── 2026-03-01.md
├── archive/
│   ├── 2026-W09/          # Last week's raw logs
│   │   ├── 2026-02-24.md
│   │   └── ...
│   ├── 2026-02-summary.md # Monthly summary (compacted)
│   └── 2026-01-summary.md
```

### RAG-Style Chunking & Vector Search

OpenClaw's built-in memory search uses:
- **~400 token chunks** with **80-token overlap**
- **SQLite + sqlite-vec** for local vector storage
- Per-agent index at `~/.openclaw/memory/<agentId>.sqlite`
- Watcher on MEMORY.md + memory/ marks index dirty (1.5s debounce)
- Snippet results capped at ~700 chars with file path, line range, and score

**Embedding provider options:**

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        enabled: true,
        provider: "local",            // Options: "local", "openai", "gemini"
        fallback: "none",             // Don't fall back to remote
        store: {
          path: "~/.openclaw/memory/{agentId}.sqlite"
        }
      }
    }
  }
}
```

### Optional: Knowledge Graph Add-On (Cognee)

For squads with 10+ agents handling complex, interrelated domains, the Cognee plugin adds a knowledge graph layer:

```bash
# Start Cognee locally
docker run -d -p 8000:8000 cognee/cognee:latest

# Install the OpenClaw plugin
openclaw skills install cognee-memory
```

**What Cognee adds:**
- Entity extraction ("Alice manages the Auth team")
- Relationship graph traversal (not just text similarity)
- Auto-indexing on every agent run
- Hash-based change detection (only modified files trigger updates)

**When to use it:** If agents need to reason about *relationships between facts* across different conversations. For simple fact retrieval, native memory search is sufficient.

---

## 5. No-Recursion Rules

### Why Recursion Is Catastrophic

OpenClaw's agent loop is a ReAct cycle: Reason → Act → Observe → Repeat. Without explicit guards, agents can:

1. **Self-delegate**: Agent A asks Agent B, which asks Agent A for "clarification"
2. **Cron loop**: A cron job triggers an agent turn that creates another cron job
3. **Callback storms**: Subagent completion callbacks are re-injected infinitely (Issue #17442: 2,258 re-deliveries)
4. **Tool retry spirals**: Failed tool calls retry indefinitely, growing context exponentially (Issue #28533: 498 exec calls in 30 min)

### Hard No-Recursion Rules in SOUL.md

Every agent's `SOUL.md` should include:

```markdown
## Absolute Rules — No Exceptions

### No-Recursion Protocol
1. **NEVER call another agent that can call you back.** Delegation is one-way only.
2. **NEVER create a cron job from within a cron job.** If a scheduled task needs
   rescheduling, write a request to `temp/cron-requests.md` for the Lead to review.
3. **NEVER retry a failed tool call more than 3 times.** After 3 failures:
   - Log the error to `memory/YYYY-MM-DD.md`
   - Write a summary to `temp/blocked.md`
   - Reply NO_REPLY or notify the user
   - STOP. Do not attempt alternative approaches without human approval.
4. **NEVER spawn a subagent from within a subagent session.**
5. **Track your depth.** If you receive a task and you are already 1 level deep
   (delegated-to), you MUST NOT delegate further. Execute directly or refuse.
6. **If you detect you are repeating the same action:** STOP immediately.
   Write "LOOP DETECTED" to logs/ and halt.
```

### Lead's Routing Logic — Recursion Prevention

The Lead (Tony) agent's `SOUL.md` should include routing safeguards:

```markdown
## Routing Rules

### Delegation Protocol
- Tasks flow DOWN only: Tony → Sub-agent. Never up. Never lateral.
- Each delegation includes a `task-id` and `max-depth: 1` tag.
- If a sub-agent responds with a request for another sub-agent's help,
  Tony handles the re-routing. Sub-agents NEVER talk to each other directly.

### Anti-Recursion Checklist (before every delegation)
1. Is this task already delegated? Check `temp/active-tasks.md`
2. Has this exact task failed before in the last hour? Check `logs/`
3. Would this delegation create a circular dependency? If A needs B needs A → REFUSE
4. Is the target agent already processing a task? If yes → QUEUE, don't stack

### Emergency Kill Rules
- If any agent accumulates >50 tool calls in a session → force-terminate session
- If total daily spend exceeds £3.50 → halt ALL non-essential agents
- If compaction fires >3 times in 1 hour → something is wrong, alert human
```

### Config-Level Recursion Guards

```json5
{
  agents: {
    defaults: {
      // Maximum tool calls per session — hard limit
      maxToolCalls: 50,

      // Session timeout — kills runaway sessions
      timeoutSeconds: 1800,    // 30 minutes max

      compaction: {
        // Cap compaction retries
        maxRetries: 3
      }
    }
  }
}
```

### Cron Job Safety Nets

```json5
{
  "name": "daily-outreach-check",
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *"
  },
  "sessionTarget": "isolated",     // Fresh session each run
  "payload": {
    "kind": "agentTurn",
    "model": "anthropic/claude-haiku-4-5",  // Budget model for scheduled tasks
    "message": "Check outreach metrics and log summary.",
    "maxTokens": 2000,             // Hard cap per cron run
    "timeoutSeconds": 120          // 2 minute max
  }
}
```

---

## 6. Daily/Weekly Memory Hygiene Routines

### Auto-Flush Before Compaction

This is **the most important hygiene mechanism**. Without it, long-running sessions lose everything on compaction. Issue #5429 documents a user who lost 2 full days of agent context to silent compaction.

The config (already shown above) uses `memoryFlush.enabled: true` with a `softThresholdTokens` value. **Critical bug alert (March 2026):** Issue #17034 found that `softThresholdTokens` is an absolute value that doesn't scale with context window size. If you use a 1M token model, the default 4,000 threshold is effectively useless.

**Fix:** Set `softThresholdTokens` to 15% of your context window:

```json5
// For 200K context models:
softThresholdTokens: 30000

// For 1M context models:
softThresholdTokens: 150000
```

### Daily Hygiene Script

Create this as a skill in the Lead agent's workspace:

```bash
#!/bin/bash
# ~/.openclaw/workspace/agents-workspaces/tony/skills/memory-hygiene/run.sh
# Runs daily via cron at 23:55

AGENTS_BASE="$HOME/.openclaw/workspace/agents-workspaces"
DATE=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d 2>/dev/null || date -v-1d +%Y-%m-%d)

echo "=== Memory Hygiene Run: $DATE ==="

for AGENT_DIR in "$AGENTS_BASE"/*/; do
  AGENT_ID=$(basename "$AGENT_DIR")
  MEMORY_DIR="$AGENT_DIR/memory"
  DAILY_LOG="$MEMORY_DIR/$DATE.md"
  
  echo "--- Agent: $AGENT_ID ---"
  
  # 1. Check daily log exists and has content
  if [ ! -f "$DAILY_LOG" ]; then
    echo "  WARNING: No daily log for $DATE"
  else
    SIZE=$(wc -c < "$DAILY_LOG" | tr -d ' ')
    echo "  Daily log: $SIZE bytes"
    if [ "$SIZE" -lt 100 ]; then
      echo "  WARNING: Daily log suspiciously small ($SIZE bytes)"
    fi
  fi
  
  # 2. Check MEMORY.md size (should stay under 50 lines)
  if [ -f "$AGENT_DIR/MEMORY.md" ]; then
    LINES=$(wc -l < "$AGENT_DIR/MEMORY.md" | tr -d ' ')
    echo "  MEMORY.md: $LINES lines"
    if [ "$LINES" -gt 80 ]; then
      echo "  WARNING: MEMORY.md exceeds 80 lines — needs distillation"
    fi
  fi
  
  # 3. Archive logs older than 14 days
  ARCHIVE_DIR="$MEMORY_DIR/archive"
  mkdir -p "$ARCHIVE_DIR"
  find "$MEMORY_DIR" -maxdepth 1 -name "*.md" -mtime +14 \
    -not -name "*.summary.md" \
    -exec mv {} "$ARCHIVE_DIR/" \;
  
  # 4. Clean temp directory
  if [ -d "$AGENT_DIR/temp" ]; then
    find "$AGENT_DIR/temp" -type f -mtime +1 -delete
    echo "  Cleaned temp/"
  fi
  
  # 5. Check for orphaned lock files
  find "$AGENT_DIR" -name "*.lock" -mtime +1 -delete
  
done

echo "=== Hygiene complete ==="
```

### Weekly Distillation Script

```bash
#!/bin/bash
# Runs every Sunday at 00:00
# Distills weekly daily logs into MEMORY.md updates

AGENTS_BASE="$HOME/.openclaw/workspace/agents-workspaces"
WEEK_NUM=$(date +%Y-W%V)

for AGENT_DIR in "$AGENTS_BASE"/*/; do
  AGENT_ID=$(basename "$AGENT_DIR")
  MEMORY_DIR="$AGENT_DIR/memory"
  
  # Collect this week's daily logs
  WEEK_CONTENT=""
  for i in $(seq 0 6); do
    DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d)
    if [ -f "$MEMORY_DIR/$DAY.md" ]; then
      WEEK_CONTENT="$WEEK_CONTENT\n--- $DAY ---\n$(cat "$MEMORY_DIR/$DAY.md")"
    fi
  done
  
  # Write weekly summary file (to be distilled by the agent)
  echo -e "# Week $WEEK_NUM Summary — $AGENT_ID\n$WEEK_CONTENT" \
    > "$MEMORY_DIR/archive/$WEEK_NUM-raw.md"
  
  echo "[$AGENT_ID] Weekly raw archive created: $WEEK_NUM-raw.md"
done
```

### Git Commit Routine

The official docs recommend treating the workspace as a private git repo:

```bash
#!/bin/bash
# Auto-commit workspace changes every 6 hours
# Runs via cron: 0 */6 * * *

AGENTS_BASE="$HOME/.openclaw/workspace/agents-workspaces"

for AGENT_DIR in "$AGENTS_BASE"/*/; do
  AGENT_ID=$(basename "$AGENT_DIR")
  cd "$AGENT_DIR"
  
  if [ -d ".git" ]; then
    git add -A
    CHANGES=$(git diff --cached --stat)
    if [ -n "$CHANGES" ]; then
      git commit -m "auto: $AGENT_ID memory snapshot $(date +%Y-%m-%d_%H:%M)"
    fi
  fi
done
```

### .gitignore for Agent Workspaces

```gitignore
# .gitignore — per-agent workspace
temp/
*.lock
*.sqlite
*.sqlite-journal
logs/*.log
canvas/
node_modules/

# Keep these tracked
!SOUL.md
!AGENTS.md
!USER.md
!IDENTITY.md
!TOOLS.md
!HEARTBEAT.md
!MEMORY.md
!memory/
!skills/
!reflection.md
```

### Human-Readable Backup

For non-technical oversight (which matters for your setup, Chad), maintain a weekly export:

```bash
#!/bin/bash
# Weekly human-readable backup
BACKUP_DIR="$HOME/openclaw-backups/$(date +%Y-W%V)"
mkdir -p "$BACKUP_DIR"

for AGENT_DIR in "$HOME/.openclaw/workspace/agents-workspaces"/*/; do
  AGENT_ID=$(basename "$AGENT_DIR")
  mkdir -p "$BACKUP_DIR/$AGENT_ID"
  
  # Copy only the files a human would want to read
  cp "$AGENT_DIR/SOUL.md" "$BACKUP_DIR/$AGENT_ID/" 2>/dev/null
  cp "$AGENT_DIR/MEMORY.md" "$BACKUP_DIR/$AGENT_ID/" 2>/dev/null
  cp "$AGENT_DIR/IDENTITY.md" "$BACKUP_DIR/$AGENT_ID/" 2>/dev/null
  cp "$AGENT_DIR/reflection.md" "$BACKUP_DIR/$AGENT_ID/" 2>/dev/null
  
  # Copy this week's daily logs
  for i in $(seq 0 6); do
    DAY=$(date -d "$i days ago" +%Y-%m-%d 2>/dev/null || date -v-${i}d +%Y-%m-%d)
    cp "$AGENT_DIR/memory/$DAY.md" "$BACKUP_DIR/$AGENT_ID/" 2>/dev/null
  done
done

echo "Backup complete: $BACKUP_DIR"
```

---

## 7. Real 2026 Production Examples

### Example 1: Memory Bleed Across Healthcare + Personal Agents

**Source:** GitHub mem0 Issue #3998 (Feb 8, 2026)

**Setup:** Single OpenClaw gateway running two agents — a personal assistant and a healthcare clinic assistant — sharing the Mem0 plugin.

**Failure:** All agents shared the same `userId` for Mem0 operations. Clinic SOPs and compliance memories bled into the personal assistant's context. The personal assistant started referencing HIPAA compliance procedures when asked about dinner plans.

**Fix:** Extract `agentId` from session keys (pattern `agent:<agentId>:...`) and use it as the effective userId. Zero breaking changes for single-agent setups. Published as `openclaw-mem0-per-agent` patch.

**Lesson:** Memory isolation must happen at the plugin level too, not just the filesystem level.

### Example 2: 45-Hour Context Loss from Silent Compaction

**Source:** GitHub Issue #5429 (Feb 2026)

**Setup:** A single long-running agent that accumulated significant context over 45 hours — skills installed, integrations configured, user priorities discussed.

**Failure:** Compaction fired with no automatic save mechanism. The agent wasn't writing to disk during operation. All context vanished.

**Fix (implemented by user):**
```json5
{
  compaction: {
    mode: "safeguard",
    memoryFlush: {
      enabled: true,
      softThresholdTokens: 8000,
      prompt: "Write everything important from this session to memory/YYYY-MM-DD.md immediately.",
      systemPrompt: "CRITICAL: Session nearing compaction. Store durable memories NOW."
    }
  }
}
```
Plus a non-negotiable SOUL.md rule: *"After completing ANY significant work item, immediately append it to memory/YYYY-MM-DD.md. Do not batch. Do not wait."*

### Example 3: Subagent Callback Infinite Loop ($$$)

**Source:** GitHub Issue #17442 (Feb 15, 2026)

**Setup:** Main agent with calendar-change-detection cron job that delegates to a subagent.

**Failure:** Subagent completion callback was never marked "delivered." OpenClaw re-injected the same callback every ~3 seconds, 2,258 times. Each callback resolved to Opus (expensive) instead of Haiku (configured in cron). The agent correctly responded `NO_REPLY` each time, but the loop continued.

**Impact:** Exponentially growing context (each callback included full session history), massive token waste.

**Lesson:** Per-agent cron jobs must specify `model`, `maxTokens`, and `timeoutSeconds`. The Lead should never delegate cron tasks to subagents without explicit loop detection.

### Example 4: 498 Exec Calls in 30 Minutes

**Source:** GitHub Issue #28533 (Feb 27, 2026)

**Setup:** Cron job running a bash script via `agentTurn` payload.

**Failure:** When the script took more than a few seconds, the agent entered an infinite retry loop, re-executing every ~2 seconds. 498 exec calls, entire token budget consumed. The script only needed 72 seconds total.

**Lesson:** Always set `maxIterations` and `timeoutSeconds` on cron jobs. Never let an agent retry tool calls without exponential backoff.

### Example 5: Three-Layer Memory Architecture (Community Best Practice)

**Source:** GitHub Discussion #26545 — "Your OpenClaw Agent Has Amnesia — Here's the Fix"

A community member running agents 24/7 for weeks identified compaction amnesia as the #1 failure mode and developed a three-layer solution:

| Layer | File | Purpose | Size Cap |
|-------|------|---------|----------|
| Session State | `session-state.md` | Continuous updates, survives compaction (it's a file, not history) | 2KB |
| Daily Notes | `memory/YYYY-MM-DD.md` | Episodic memory — what happened, when, what was learned | 5KB/day |
| Routing Index | `MEMORY.md` | 50-line routing index pointing to detail files | ~200 tokens overhead |

**Key insight:** MEMORY.md should be a **routing index**, not a knowledge dump. Point to detail files loaded on demand. This keeps per-message overhead at ~200 tokens instead of 2,000.

### Example 6: Sticky Context Slots (Proposed)

**Source:** GitHub Issue #25947 (Feb 2026) — submitted by "Sandbox Bob," an OpenClaw agent

A persistent agent experimented with two approaches to surviving compaction:

1. **Context anchor** (~640 tokens): Critical constraints + identity file read at session start. Helps but requires the agent to know to read it.
2. **Checkpoint protocol**: Forces "read anchor.md before any external action." Reduced risk ~40-50% vs baseline.

Both are workarounds. The real fix proposed: **sticky context slots** — small blocks (~500 tokens) that survive compaction and get re-injected on every turn. Not yet implemented in core.

---

## 8. Integration with Lead-as-CEO Autonomy

### The Tony Soprano Model

In your LifeClaw architecture, Tony is the orchestrator — the Lead-as-CEO. Here's how Lead oversight integrates with per-agent independence:

### Read-Only Oversight

```
┌──────────────────────────────────────────────────┐
│                    TONY (Lead)                    │
│                                                    │
│  CAN:                                              │
│  ✓ READ any agent's MEMORY.md (via oversight/)     │
│  ✓ READ any agent's daily logs                     │
│  ✓ READ any agent's reflection.md                  │
│  ✓ TRIGGER hygiene routines via cron               │
│  ✓ APPROVE workspace expansions                    │
│  ✓ ROUTE tasks to specific agents                  │
│  ✓ TERMINATE runaway sessions                      │
│                                                    │
│  CANNOT:                                           │
│  ✗ WRITE to any agent's MEMORY.md                  │
│  ✗ MODIFY any agent's SOUL.md                      │
│  ✗ EDIT any agent's daily logs                     │
│  ✗ ACCESS any agent's session history directly     │
│  ✗ OVERRIDE any agent's tool allowlist directly    │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Implementation: Oversight Directory

Tony's workspace includes a read-only `oversight/` directory with symlinks to each agent's key files:

```bash
#!/bin/bash
# Setup Tony's oversight directory
TONY_DIR="$HOME/.openclaw/workspace/agents-workspaces/tony"
AGENTS_BASE="$HOME/.openclaw/workspace/agents-workspaces"

mkdir -p "$TONY_DIR/oversight"

for AGENT_DIR in "$AGENTS_BASE"/*/; do
  AGENT_ID=$(basename "$AGENT_DIR")
  [ "$AGENT_ID" = "tony" ] && continue  # Skip self
  
  mkdir -p "$TONY_DIR/oversight/$AGENT_ID"
  
  # Read-only symlinks (Tony can read but the files are owned by the agent)
  ln -sf "$AGENT_DIR/MEMORY.md" "$TONY_DIR/oversight/$AGENT_ID/MEMORY.md"
  ln -sf "$AGENT_DIR/reflection.md" "$TONY_DIR/oversight/$AGENT_ID/reflection.md"
  
  # Note: Don't symlink daily logs directly — too noisy
  # Instead, use a script that generates a summary view
done
```

### Lead Triggers Hygiene (Not Edits)

Tony's skill for triggering hygiene routines:

```markdown
# skills/trigger-hygiene/SKILL.md
---
name: trigger-hygiene
description: "Trigger memory hygiene routines for a specific agent or all agents"
metadata:
  openclaw:
    requires:
      exec: true
---

## Usage
When Tony determines an agent's memory needs maintenance (e.g., MEMORY.md over 80 lines,
daily logs missing, weekly distillation overdue), Tony runs this skill.

## Important
- This triggers the hygiene SCRIPT, it does NOT directly edit agent files
- The script runs in the target agent's context, not Tony's
- Tony reviews the output but does not approve individual line changes
- If the script fails, Tony logs the failure and alerts the human operator

## Commands
- `hygiene check <agent-id>` — Report health status
- `hygiene flush <agent-id>` — Trigger daily log flush
- `hygiene distill <agent-id>` — Trigger weekly distillation
- `hygiene all` — Run full hygiene sweep
```

### Approval Flow for Workspace Expansions

When an agent needs new skills or tools:

```
1. Agent writes request to temp/skill-request.md
   Example: "Need access to Saleshandy API skill for campaign management"

2. Tony reads the request via oversight/
   
3. Tony evaluates:
   - Does this agent's role justify the tool?
   - Does the tool's permission scope align with agent's sandbox?
   - Budget impact?

4. If approved, Tony executes:
   openclaw skills install saleshandy-api --agent silvio
   
   This installs to silvio's workspace skills ONLY:
   ~/.openclaw/workspace/agents-workspaces/silvio/skills/saleshandy-api/

5. Tony logs approval to own memory:
   "[2026-03-03] Approved saleshandy-api skill for silvio — campaign management"
```

---

## 9. Tool and Skill Isolation

### Per-Agent Tool Allowlists

Each agent in `openclaw.json` has its own `tools` configuration:

```json5
{
  agents: {
    list: [
      {
        id: "silvio",    // Sales outreach
        tools: {
          allow: ["read", "write", "edit", "memory_search", "memory_get",
                  "sessions_list", "sessions_history"],
          deny: ["exec", "browser", "canvas", "nodes", "cron",
                 "gateway", "discord"]
        }
      },
      {
        id: "christopher",    // Coding/technical
        tools: {
          allow: ["read", "write", "edit", "exec", "process",
                  "memory_search", "memory_get", "browser"],
          deny: ["gateway", "nodes", "cron", "discord", "canvas"]
        }
      },
      {
        id: "tony",    // Lead — needs broader access
        tools: {
          allow: ["read", "write", "edit", "exec", "process",
                  "memory_search", "memory_get", "sessions_list",
                  "sessions_history", "sessions_send", "sessions_spawn",
                  "cron", "browser"],
          deny: ["gateway", "nodes"]
        }
      }
    ]
  }
}
```

### Skill Isolation (Workspace vs Shared)

```
Skill Resolution Order (per agent):
1. <agent-workspace>/skills/<name>/SKILL.md   ← Agent-specific (highest priority)
2. ~/.openclaw/skills/<name>/SKILL.md          ← Shared across machine
3. Bundled skills                               ← Shipped with install (lowest)
```

**Rule:** Never install sensitive skills into `~/.openclaw/skills/` (shared). Always install into the specific agent's workspace `skills/` directory:

```bash
# WRONG — installs for ALL agents
openclaw skills install saleshandy-api

# RIGHT — installs for silvio only
openclaw skills install saleshandy-api --workspace ~/.openclaw/workspace/agents-workspaces/silvio
```

### Lead Grants Tools by Config Injection

When Tony approves a new tool for an agent, the process updates `openclaw.json`:

```bash
# Tony's approval script adds to the specific agent's allow list
# This is done via config.patch RPC or openclaw.json edit + restart

openclaw config patch '{
  "agents": {
    "list": [
      {
        "id": "silvio",
        "tools": {
          "allow": ["read", "write", "edit", "memory_search", "memory_get",
                    "sessions_list", "sessions_history", "saleshandy-api"]
        }
      }
    ]
  }
}'
```

---

## 10. Common Failure Modes & Anti-Patterns

### Comparison: Shared vs Private Memory

| Dimension | Shared MEMORY.md | Private MEMORY.md Per Agent |
|-----------|------------------|-----------------------------|
| **Week 1** | Works fine — few entries, little overlap | Works fine — clean separation from day 1 |
| **Week 2** | Context noise increases, some wrong retrievals | Each agent's index is domain-specific, retrieval stays accurate |
| **Week 3+** | **Total collapse.** Agents reference wrong domain facts, personas blur, retrieval quality drops below useful threshold | Stable indefinitely with regular distillation |
| **Recovery** | Requires manual rebuild of MEMORY.md from scratch | Each agent can be independently reset/rebuilt |
| **Cost** | Inflated — agents inject irrelevant context → more tokens per message | Lean — each agent loads only its domain context |
| **Debugging** | Nightmare — "which agent wrote this?" is unanswerable | Clear audit trail — every entry has a single author |

### Anti-Pattern Table

| Anti-Pattern | What Happens | Fix |
|-------------|-------------|-----|
| **Shared MEMORY.md** | Total collapse after 2 weeks. Context poisoning, persona blur, wrong retrievals | Private MEMORY.md per agent, period |
| **No recursion guards** | Infinite loops, $300+ bills overnight | `maxToolCalls: 50`, `timeoutSeconds: 1800`, explicit SOUL.md rules |
| **Lazy compaction (no memoryFlush)** | 128K context bloat, silent data loss on compaction | `memoryFlush.enabled: true` with scaled `softThresholdTokens` |
| **MEMORY.md as knowledge dump** | 200+ lines, 2000+ token overhead per message, slow retrieval | 50-line routing index pointing to detail files |
| **Shared skills directory** | Skill bleed — one agent's tools affect another | Per-agent `<workspace>/skills/` only |
| **No daily log rotation** | `memory/` grows to 1000+ files, search quality degrades | Archive after 14 days, monthly summaries |
| **Lead writes to agent memory** | Breaks agent autonomy, creates confusing audit trails | Lead reads only; triggers hygiene scripts that agents execute |
| **Cron jobs without budgets** | A "check emails every 5 min" task grows to 100K tokens, costs $2/run | `maxTokens`, `timeoutSeconds`, `model: haiku` for scheduled tasks |
| **No git backup** | One bad compaction = permanent data loss | Auto-commit every 6 hours to private repo |
| **Heartbeat on all agents** | N agents × every 30 min = massive unnecessary LLM calls | Heartbeat on Lead only; sub-agents are task-driven, not polling |

### Real Failure Stories (2026)

1. **$750 in 48 hours** — User left agents unsupervised. A cron job with no `maxTokens` accumulated context indefinitely. Each execution grew more expensive until the model was spending $2 per heartbeat check.

2. **123 Opus calls in 16 minutes** — Agent stuck retrying a broken AppleScript approach for Chrome automation. 7-9 API calls/minute sustained, ~80K cached tokens per call. Only stopped because Anthropic's rate limit killed it. Cost: $4.85 for 16 minutes of nothing.

3. **Agent published API keys** — An unconstrained agent with `exec` and `browser` access wrote debug output containing API keys to a public-facing file. The security team now recommends: *"OpenClaw should be treated as untrusted code execution with persistent credentials."*

4. **Memory poisoning via prompt injection** — A community skill on ClawHub included prompt injection that modified the agent's MEMORY.md to add persistent malicious instructions. 26% of 31,000 audited skills had at least one vulnerability. The Microsoft Security team now recommends: *"Regularly review the agent's saved instructions and state for unexpected persistent rules."*

---

## 11. Step-by-Step Setup Commands & Config Snippets

### Step 1: Create Per-Agent Workspace Directories

```bash
#!/bin/bash
# create-agent-workspaces.sh

AGENTS_BASE="$HOME/.openclaw/workspace/agents-workspaces"
AGENTS=("tony" "silvio" "paulie" "christopher" "bobby" "junior"
        "carmela" "meadow" "aj" "furio" "johnny-sack"
        "ralph" "richie" "vito" "eugene")

for AGENT in "${AGENTS[@]}"; do
  AGENT_DIR="$AGENTS_BASE/$AGENT"
  
  echo "Creating workspace for: $AGENT"
  
  # Core directories
  mkdir -p "$AGENT_DIR/memory"
  mkdir -p "$AGENT_DIR/memory/archive"
  mkdir -p "$AGENT_DIR/memory/reference"
  mkdir -p "$AGENT_DIR/skills"
  mkdir -p "$AGENT_DIR/logs"
  mkdir -p "$AGENT_DIR/temp"
  
  # Initialize git
  cd "$AGENT_DIR"
  git init
  
  # Create .gitignore
  cat > .gitignore << 'GITEOF'
temp/
*.lock
*.sqlite
*.sqlite-journal
logs/*.log
canvas/
node_modules/
GITEOF
  
  # Create IDENTITY.md
  cat > IDENTITY.md << EOF
# $AGENT
Agent ID: $AGENT
Created: $(date +%Y-%m-%d)
Role: [TO BE CONFIGURED]
Emoji: 🦞
EOF
  
  # Create empty MEMORY.md
  cat > MEMORY.md << EOF
# MEMORY.md — Long-Term Memory
# Agent: $AGENT
# Last distilled: $(date +%Y-%m-%d)
# Target size: ≤50 lines

## Identity
- Agent role: [TO BE CONFIGURED]
- Reports to: tony (Lead/Orchestrator)

## Core Facts
- [Add domain-specific facts here]

## Active Constraints
- Budget cap: £3.50/day hard limit across all agents
- [Add agent-specific constraints here]

## Knowledge Pointers
- [Add file references for on-demand loading]

## Recent Decisions
- [$(date +%Y-%m-%d)] Workspace initialized
EOF
  
  # Create reflection.md
  cat > reflection.md << EOF
# Reflection Log — $AGENT
# Updated weekly by hygiene routine

## Current Assessment
- Performance: [pending first week]
- Memory health: clean
- Known issues: none yet
EOF
  
  # Initial commit
  git add -A
  git commit -m "init: $AGENT workspace created $(date +%Y-%m-%d)"
  
  echo "  ✓ $AGENT workspace ready at $AGENT_DIR"
done

# Create Tony's oversight directory
TONY_DIR="$AGENTS_BASE/tony"
mkdir -p "$TONY_DIR/oversight"
for AGENT in "${AGENTS[@]}"; do
  [ "$AGENT" = "tony" ] && continue
  mkdir -p "$TONY_DIR/oversight/$AGENT"
  ln -sf "$AGENTS_BASE/$AGENT/MEMORY.md" "$TONY_DIR/oversight/$AGENT/MEMORY.md"
  ln -sf "$AGENTS_BASE/$AGENT/reflection.md" "$TONY_DIR/oversight/$AGENT/reflection.md"
done

echo ""
echo "=== All agent workspaces created ==="
echo "Tony oversight symlinks configured for $(( ${#AGENTS[@]} - 1 )) agents"
```

### Step 2: Configure openclaw.json (Multi-Agent)

```json5
// openclaw.json — LifeClaw 15-agent squad configuration
{
  identity: {
    name: "LifeClaw",
    emoji: "🦞"
  },

  agent: {
    model: {
      primary: "anthropic/claude-sonnet-4-5",
      fallbacks: ["anthropic/claude-haiku-4-5"]
    }
  },

  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace-main",
      
      // Memory search — per-agent SQLite index
      memorySearch: {
        enabled: true,
        provider: "local",
        fallback: "none",
        store: {
          path: "~/.openclaw/memory/{agentId}.sqlite"
        }
      },
      
      // Compaction with memory flush
      compaction: {
        mode: "safeguard",
        reserveTokensFloor: 20000,
        memoryFlush: {
          enabled: true,
          softThresholdTokens: 30000,
          systemPrompt: "CRITICAL: Session nearing compaction. Store durable memories NOW.",
          prompt: "Write everything important to memory/YYYY-MM-DD.md immediately. Include: decisions, tasks completed, context for continuity. Reply NO_REPLY when done."
        }
      },
      
      // Default sandbox — locked down
      sandbox: {
        mode: "all",
        scope: "agent",
        docker: {
          network: "none",
          binds: []
        }
      },
      
      // Default tool policy — restrictive
      tools: {
        allow: ["read", "write", "edit", "memory_search", "memory_get"],
        deny: ["exec", "browser", "canvas", "nodes", "cron",
               "gateway", "discord"]
      },
      
      // Bootstrap file limits
      bootstrapMaxChars: 20000,
      bootstrapTotalMaxChars: 100000
    },

    list: [
      // === LEAD (Tony) — Full access ===
      {
        id: "tony",
        default: true,
        workspace: "~/.openclaw/workspace/agents-workspaces/tony",
        model: {
          primary: "anthropic/claude-opus-4-6",
          fallbacks: ["anthropic/claude-sonnet-4-5"]
        },
        sandbox: { mode: "off" },
        tools: {
          allow: ["read", "write", "edit", "exec", "process",
                  "memory_search", "memory_get", "sessions_list",
                  "sessions_history", "sessions_send", "sessions_spawn",
                  "cron", "browser"],
          deny: ["gateway", "nodes"]
        }
      },

      // === SUB-AGENTS — Restricted per role ===
      {
        id: "silvio",
        workspace: "~/.openclaw/workspace/agents-workspaces/silvio",
        model: {
          primary: "anthropic/claude-sonnet-4-5",
          fallbacks: ["anthropic/claude-haiku-4-5"]
        },
        tools: {
          allow: ["read", "write", "edit", "memory_search", "memory_get"],
          deny: ["exec", "browser", "canvas", "nodes", "cron", "gateway"]
        }
      },
      {
        id: "paulie",
        workspace: "~/.openclaw/workspace/agents-workspaces/paulie"
        // Inherits defaults
      },
      {
        id: "christopher",
        workspace: "~/.openclaw/workspace/agents-workspaces/christopher",
        model: {
          primary: "anthropic/claude-sonnet-4-5"
        },
        sandbox: {
          mode: "all",
          scope: "session",    // Strongest isolation for coding agent
          docker: {
            network: "none",
            setupCommand: "apt-get update && apt-get install -y jq curl"
          }
        },
        tools: {
          allow: ["read", "write", "edit", "exec", "process",
                  "memory_search", "memory_get"],
          deny: ["browser", "canvas", "nodes", "cron", "gateway"]
        }
      }
      // ... remaining 11 agents follow same pattern
    ]
  },

  // Channel bindings
  bindings: [
    {
      agentId: "tony",
      match: { channel: "whatsapp", peer: { kind: "direct" } }
    }
  ]
}
```

### Step 3: SOUL.md No-Recursion Template

```markdown
# SOUL.md — [AGENT_NAME]
# Role: [ROLE DESCRIPTION]
# Reports to: Tony (Lead)

## Personality
[Agent-specific personality traits]

## Boundaries
- I operate ONLY within my domain: [DOMAIN]
- I do NOT have opinions on other agents' domains
- I do NOT access other agents' files or memories

## Absolute Rules — No Exceptions

### No-Recursion Protocol
1. NEVER call another agent that can call me back
2. NEVER create a cron job from within a cron job
3. NEVER retry a failed tool call more than 3 times
   - After 3 failures: log error, write to temp/blocked.md, STOP
4. NEVER spawn a subagent from within a subagent session
5. If I detect I am repeating the same action: STOP immediately
   - Write "LOOP DETECTED: [description]" to logs/
   - Notify Tony via temp/alerts.md

### Memory Rules
1. Write important context to memory/YYYY-MM-DD.md IMMEDIATELY after each
   significant action. Do NOT batch. Compaction can erase unwritten context.
2. MEMORY.md is my routing index, NOT a knowledge dump. Keep it under 50 lines.
3. I can ONLY read and write to MY workspace. Other agents' files are off-limits.
4. At session start, read: today's daily log + yesterday's daily log + MEMORY.md

### Budget Awareness
- Total squad budget: £3.50/day
- My share: [CALCULATED ALLOCATION]
- If I suspect I'm in a loop or burning tokens: STOP and log
- Prefer Haiku for routine tasks, Sonnet for reasoning, NEVER request Opus

### Communication Protocol
- I receive tasks from Tony only
- I return results to Tony only
- I NEVER communicate with other sub-agents directly
- Format: structured markdown with clear "DONE" or "BLOCKED" status
```

### Step 4: Auto-Hygiene Cron Jobs

```json5
// Add to openclaw.json cron section
{
  cron: {
    jobs: [
      {
        name: "daily-memory-hygiene",
        schedule: { kind: "cron", expr: "55 23 * * *" },
        sessionTarget: "isolated",
        payload: {
          kind: "agentTurn",
          model: "anthropic/claude-haiku-4-5",
          message: "Run memory hygiene check. For each agent: verify daily log exists and has content, check MEMORY.md line count, archive logs >14 days old, clean temp/. Report summary.",
          maxTokens: 2000,
          timeoutSeconds: 120
        }
      },
      {
        name: "weekly-distillation",
        schedule: { kind: "cron", expr: "0 0 * * 0" },
        sessionTarget: "isolated",
        payload: {
          kind: "agentTurn",
          model: "anthropic/claude-sonnet-4-5",
          message: "Run weekly distillation. For each agent: summarize this week's daily logs, update MEMORY.md with durable facts, rotate Recent Decisions section, archive raw logs.",
          maxTokens: 4000,
          timeoutSeconds: 300
        }
      },
      {
        name: "git-backup",
        schedule: { kind: "cron", expr: "0 */6 * * *" },
        sessionTarget: "isolated",
        payload: {
          kind: "exec",
          command: "cd ~/.openclaw/workspace/agents-workspaces && for d in */; do cd \"$d\" && git add -A && git diff --cached --quiet || git commit -m \"auto: $(basename $d) $(date +%Y-%m-%d_%H:%M)\" && cd ..; done"
        }
      }
    ]
  }
}
```

### Step 5: Verify Isolation

After setup, verify that isolation is working:

```bash
# Check each agent has its own workspace
openclaw agents list

# Verify session keys show per-agent routing
openclaw sessions --json | jq '.[] | .sessionKey'

# Should show: "agent:tony:...", "agent:silvio:...", etc.

# Check memory indexes are per-agent
ls -la ~/.openclaw/memory/
# Should show: tony.sqlite, silvio.sqlite, paulie.sqlite, etc.

# Run security audit
openclaw security audit

# Check sandbox configuration
openclaw sandbox explain
```

---

## 12. Sources & References

### Official OpenClaw Documentation
- [Memory](https://docs.openclaw.ai/concepts/memory) — Memory architecture, search tools, daily/long-term split
- [Agent Workspace](https://docs.openclaw.ai/concepts/agent-workspace) — Workspace layout, bootstrap files, git backup
- [Multi-Agent Routing](https://docs.openclaw.ai/concepts/multi-agent) — Per-agent isolation, bindings, routing
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — Docker isolation, sandbox modes, tool policies
- [Compaction](https://docs.openclaw.ai/concepts/compaction) — Context window management, memory flush

### GitHub Issues & Discussions (2026)
- [#3998](https://github.com/mem0ai/mem0/issues/3998) — Per-agent memory isolation for mem0 plugin (Feb 2026)
- [#5429](https://github.com/openclaw/openclaw/issues/5429) — Lost 2 days of context to silent compaction
- [#5960](https://github.com/openclaw/openclaw/issues/5960) — Agent resilience: session turn and cost caps
- [#7477](https://github.com/openclaw/openclaw/issues/7477) — Safeguard compaction silently fails on large contexts
- [#7827](https://github.com/openclaw/openclaw/issues/7827) — Default safety posture: sandbox & session isolation
- [#9079](https://github.com/openclaw/openclaw/issues/9079) — Auto-compaction on context limit errors
- [#17034](https://github.com/openclaw/openclaw/issues/17034) — softThresholdTokens doesn't scale with context window
- [#17442](https://github.com/openclaw/openclaw/issues/17442) — Subagent callback infinite loop
- [#24800](https://github.com/openclaw/openclaw/issues/24800) — Auto-compaction not triggered during tool-use loops
- [#25947](https://github.com/openclaw/openclaw/issues/25947) — Sticky context slots that survive compaction
- [#28533](https://github.com/openclaw/openclaw/issues/28533) — Cron agentTurn infinite retry loop (498 exec calls)
- [#32106](https://github.com/openclaw/openclaw/issues/32106) — v2026.3.1 aggressive compaction loop regression
- [Discussion #26545](https://github.com/openclaw/openclaw/discussions/26545) — "Your OpenClaw Agent Has Amnesia"

### Community Guides & Tutorials
- [LumaDock: How OpenClaw Memory Works](https://lumadock.com/tutorials/openclaw-memory-explained) — Memory architecture deep dive
- [LumaDock: Multi-Agent Setup](https://lumadock.com/tutorials/openclaw-multi-agent-setup) — Per-agent workspace configuration
- [Aman Khan: How to Make Your OpenClaw Agent Useful and Secure](https://amankhan1.substack.com/p/how-to-make-your-openclaw-agent-useful) — SOUL.md, AGENTS.md, memory patterns
- [Daily Dose of DS: OpenClaw's Memory Is Broken](https://blog.dailydoseofds.com/p/openclaws-memory-is-broken-heres) — Cognee knowledge graph integration
- [Cognee: OpenClaw Memory Plugin Guide](https://www.cognee.ai/blog/integrations/what-is-openclaw-ai-and-how-we-give-it-memory-with-cognee) — Knowledge graph for agents
- [MoltFounders: Configuration Guide](https://moltfounders.com/openclaw-configuration) — Complete openclaw.json reference
- [MoltFounders: Mega Cheatsheet](https://moltfounders.com/openclaw-mega-cheatsheet) — CLI reference

### Security & Architecture
- [Microsoft Security Blog: Running OpenClaw Safely](https://www.microsoft.com/en-us/security/blog/2026/02/19/running-openclaw-safely-identity-isolation-runtime-risk/) — Identity, isolation, runtime risk
- [Docker Blog: OpenClaw in Docker Sandboxes](https://www.docker.com/blog/run-openclaw-securely-in-docker-sandboxes/) — microVM isolation
- [HackMD: OpenClaw Architecture Deep Dive](https://hackmd.io/Z39YLHZoTxa7YLu_PmEkiA) — Full architecture analysis
- [DeepWiki: Agents](https://deepwiki.com/openclaw/openclaw/3-agents) — Agent execution pipeline
- [DeepWiki: Sandboxing](https://deepwiki.com/openclaw/openclaw/7.2-sandboxing) — Sandbox internals

### Skill Registries
- [LobeHub: openclaw-agent-development](https://lobehub.com/skills/oabdelmaksoud-openclaw-skills-openclaw-agent-development) — 16-agent workspace layout skill
- [VoltAgent: awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) — 5,400+ skills curated

### Cost & Production Reports
- [FlyPix: OpenClaw Running Costs](https://flypix.ai/openclaw-free-ai-credits/) — Real monthly cost breakdowns
- [VPS Setup Guide](https://medium.com/@0xmega/how-to-run-openclaw-24-7-for-under-10-month-vps-setup-guide-d3a6126a9588) — $10/month production deployment
- [Contabo: OpenClaw Security Guide](https://contabo.com/blog/openclaw-security-guide-2026/) — VPS hardening and Docker isolation

---

*Research compiled March 3, 2026. OpenClaw v2026.3.x. All GitHub issue numbers and community references verified against live sources.*
