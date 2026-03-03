# 5. Multi-Agent Coordination Patterns

## Research Summary

**Topic:** Multi-agent coordination patterns in OpenClaw (March 2026)
**Scope:** Loose vs rigid routing, channel bindings, sessions_send, shared files, Lead-as-CEO,
delegation depth limits, real production examples, integration with memory/cost/tools, anti-patterns
**Sources:** Official OpenClaw docs, GitHub issues/discussions, LumaDock tutorials, MoltFounders
guides, DEV Community articles, Clawe project, shenhao-stu/openclaw-agents, HackMD architecture
deep-dives, community X/Reddit posts, and production squad reports (Jan–Mar 2026)

---

## 5.1 Loose vs Rigid Coordination Patterns

### The 2026 Consensus: Loose Routing Wins

The OpenClaw community has converged on a clear lesson by early 2026: **loose, binding-based
coordination consistently outperforms rigid, hard-coded pipeline chains**. Fewer than 10% of
teams that attempted rigid multi-agent pipelines successfully scaled beyond single-agent
deployment. The main failure modes were coordination complexity, uncontrolled token costs,
and state management that nobody planned for (LumaDock governance guide).

### What "Loose Routing" Means in Practice

Loose routing means:
- **Binding-based dispatch:** Messages route to agents via declarative bindings (channel →
  agentId mappings). The Gateway resolves the most-specific binding match — no code paths
  hardwire which agent talks to which.
- **Opt-in messaging:** Agents communicate via `sessions_send` only when explicitly configured.
  No agent can broadcast to siblings it shouldn't know about.
- **File-based handoffs:** Coordination state lives in shared Markdown files (`plan.md`,
  `status.md`, `task-queue.md`) rather than in rigid event buses or typed RPC contracts.
- **Lead-as-coordinator:** One agent (the Lead) decomposes tasks and routes work. Specialists
  execute and return structured results. No forced chains, no lateral peer-to-peer chatter.

### What "Rigid Coordination" Means (and Why It Fails)

Rigid coordination means:
- **Hard-coded pipelines:** Agent A always passes to Agent B, which always passes to Agent C.
  Any change requires rewriting the pipeline definition.
- **Typed event buses:** YAML/JSON workflow definitions with explicit `condition`, `loop`, and
  `stdin` piping between stages. Deterministic but brittle.
- **Broadcast messaging:** All agents receive all messages. Noise overwhelms signal.
- **Forced chains:** The system mandates a specific execution order regardless of the task.

One developer who built a deterministic code → review → test pipeline noted: "The session file
pattern (goal, plan, status, log) is elegant. But I needed inter-agent coordination with
event-driven transitions, not better intra-agent loops. Typed pipelines beat prompt engineering
for coordination" (DEV Community, ggondim). However, this approach required contributing
sub-workflow steps with loop support to Lobster (OpenClaw's workflow engine) — significant
engineering overhead for what a loose binding + shared-file pattern handles natively.

### Comparison Table: Loose vs Rigid Coordination

| Dimension              | Loose (Binding-Based)              | Rigid (Pipeline-Based)             |
|------------------------|------------------------------------|------------------------------------|
| **Routing**            | Declarative bindings, most-specific wins | Hard-coded agent chains          |
| **Communication**      | Opt-in `sessions_send`             | Forced event bus / typed contracts |
| **State**              | Shared Markdown files              | Centralized workflow engine state  |
| **Flexibility**        | Add/remove agents without rewiring | Any change = pipeline rewrite      |
| **Failure isolation**  | One agent fails, others continue   | Pipeline halts at failed stage     |
| **Token cost**         | Low overhead (direct handoffs)     | High overhead (context duplication)|
| **Setup complexity**   | ~10 min (bindings + files)         | Hours (workflow engine + schemas)  |
| **Scalability**        | Proven at 9–17 agents              | Rarely succeeds beyond 3–5 agents |
| **Debugging**          | Read shared files + session logs   | Trace workflow engine state machine|
| **Best for**           | Most squads, dynamic workloads     | Fixed, repetitive CI/CD pipelines  |

### Why Loose Routing Wins: No Ping-Pong, No Straight-Jacket

The key insight from the community: **"Multi-agent is not a checkbox you need to tick — it
adds moving parts. The trick is to add agents for clear reasons"** (LumaDock). Loose routing
respects this principle by keeping coordination minimal and declarative. Agents remain
independent units that can be added, removed, or reconfigured without touching other agents.

---

## 5.2 Channel Bindings System

### How Bindings Work

Bindings are **declarative routing rules** that map inbound messages to specific agents. When a
message arrives at the Gateway, it evaluates bindings in priority order and routes to the first
match. If no binding matches, the default agent handles the message.

Each binding matches on one or more of:
- `channel` — The messaging platform (discord, telegram, whatsapp, slack, etc.)
- `accountId` — The bot account within that channel
- `peer` — A specific DM, group, or channel ID
- `guildId` — A Discord server ID
- `teamId` — A Slack workspace ID
- `chatType` — The type of chat (dm, group, etc.)

### Most-Specific-First Priority Rules

OpenClaw evaluates bindings using a **most-specific-wins** strategy:

| Priority | Scope         | Example                                | Description                 |
|----------|---------------|----------------------------------------|-----------------------------|
| 1 (high) | `peer`        | Exact WhatsApp group ID                | Exact DM/group/channel ID   |
| 2        | `guildId`     | Discord server `guild:abc123`          | Guild-level routing          |
| 3        | `teamId`      | Slack workspace `team:T01234`          | Team-level routing           |
| 4        | `accountId`   | `telegram:ops-bot`                     | Account-level routing        |
| 5        | `channel`     | `accountId: "*"` (all accounts)        | Channel-wide fallback        |
| 6 (low)  | default agent | No binding matched                     | Final fallback               |

**Critical rule:** Put the most specific bindings first. If you define "all WhatsApp goes to
main" AND "this specific group goes to work," the group binding must come before the channel-
wide binding. Otherwise the broad rule swallows the specific one.

### agentId → Channel Mapping Example

```json
{
  "agents": {
    "lead": {
      "agentDir": "./agents/lead",
      "model": "anthropic:claude-opus-4-20250514"
    },
    "coder": {
      "agentDir": "./agents/coder",
      "model": "anthropic:claude-sonnet-4-20250514"
    },
    "researcher": {
      "agentDir": "./agents/researcher",
      "model": "openrouter:google/gemini-3-flash"
    }
  },
  "bindings": [
    {
      "agentId": "coder",
      "channel": "discord",
      "guildId": "1234567890",
      "peer": "dev-channel-id"
    },
    {
      "agentId": "researcher",
      "channel": "telegram",
      "peer": "research-group-id"
    },
    {
      "agentId": "lead",
      "channel": "discord",
      "guildId": "1234567890"
    },
    {
      "agentId": "lead",
      "channel": "telegram"
    }
  ]
}
```

In this example:
- Messages in the Discord `dev-channel-id` → **coder** (peer match, highest priority)
- Messages in the Telegram research group → **researcher** (peer match)
- All other Discord messages in guild `1234567890` → **lead** (guild match)
- All other Telegram messages → **lead** (channel-wide fallback)

### requireMention Rules

The `requireMention` setting controls whether agents must be @mentioned to respond in groups:

```json
{
  "agents": {
    "lead": {
      "guilds": {
        "1234567890": {
          "requireMention": false
        }
      }
    },
    "coder": {
      "guilds": {
        "1234567890": {
          "channels": {
            "dev-channel-id": {
              "requireMention": true
            }
          }
        }
      }
    }
  }
}
```

- `requireMention: true` — Agent only responds when @mentioned. Unmentioned messages stored
  for context but don't trigger replies. Best for busy group channels.
- `requireMention: false` — Agent auto-responds to all group messages. Best for dedicated
  agent channels or small coordination groups.

---

## 5.3 sessions_send and Opt-In Messaging

### The Two Inter-Agent Communication Primitives

OpenClaw provides two mechanisms for agent-to-agent communication:

| Tool             | Purpose                        | Blocking? | Result Flow                       |
|------------------|--------------------------------|-----------|-----------------------------------|
| `sessions_send`  | Direct message to a session    | Optional  | Waits N seconds for reply or timeout |
| `sessions_spawn` | Spawn isolated sub-agent task  | Never     | Announces result back when done   |

### sessions_send: Synchronous Conversation

`sessions_send` sends a message into another agent's session. It's the primary tool for
direct, request-response coordination.

**Syntax:**
```json
{
  "tool": "sessions_send",
  "args": {
    "sessionKey": "agent:coder:discord:channel:dev-123",
    "message": "Review the auth module and report any security issues",
    "timeoutSeconds": 60
  }
}
```

**Behavior:**
- If `timeoutSeconds > 0`: Waits up to N seconds for completion. Returns
  `{ runId, status: "ok", reply }` on success, or `{ runId, status: "timeout", error }`.
- If `timeoutSeconds == 0`: Fire-and-forget. Returns `{ runId, status: "accepted" }`.
- The run continues even after timeout — call `sessions_history` later to check.

**Max ping-pong turns:** Controlled by `session.agentToAgent.maxPingPongTurns` (0–5,
default 5). This prevents infinite back-and-forth loops between agents.

### sessions_spawn: Isolated Background Tasks

`sessions_spawn` creates a new isolated session (`agent:<agentId>:subagent:<uuid>`) for
a specific task. The sub-agent runs independently and announces its result back to the
parent when complete.

```json
{
  "tool": "sessions_spawn",
  "args": {
    "agentId": "researcher",
    "task": "Find the latest benchmarks for Gemini 3 vs Claude Opus on code generation",
    "announce": true
  }
}
```

**Key difference from sessions_send:** `sessions_spawn` is always non-blocking. It returns
`{ status: "accepted", runId, childSessionKey }` immediately. The parent doesn't wait.

### Opt-In Configuration (agentToAgent)

**Critical:** Neither `sessions_send` nor cross-agent communication works by default.
You must explicitly enable it:

```json
{
  "tools": {
    "agentToAgent": {
      "enabled": true
    }
  },
  "gateway": {
    "bind": "lan"
  }
}
```

**Per-agent allow lists** control which agents can message which:
- Preventing specialists from using `sessions_send` is a governance choice that also
  prevents delegation loops.
- The Lead agent gets `sessions_send` + `sessions_list`. Specialists get neither.
- This enforces **one-way flow:** Lead → Specialist, never Specialist → Specialist.

### Session Tools for Coordination

The full session tool suite available for coordination:

| Tool               | Purpose                                    | Typical Access      |
|--------------------|--------------------------------------------|---------------------|
| `sessions_list`    | Discover active sessions across agents     | Lead only           |
| `sessions_history` | Fetch transcript logs from a session       | Lead only           |
| `sessions_send`    | Message another session (with opt reply)   | Lead only           |
| `sessions_spawn`   | Spawn isolated sub-agent task              | Lead + orchestrators|
| `session_status`   | Check status of a running session          | Lead only           |
| `subagents`        | List/manage spawned sub-agents             | Lead + orchestrators|

### Send Policy (Allow/Deny)

You can also restrict where agents can send messages using `sendPolicy`:

```json
{
  "session": {
    "sendPolicy": {
      "rules": [
        {
          "match": { "channel": "discord", "chatType": "group" },
          "action": "deny"
        }
      ],
      "default": "allow"
    }
  }
}
```

This prevents agents from sending unsolicited messages into group channels — a critical
safety guardrail for production squads.

---

## 5.4 Shared Lightweight Files for Handoffs

### The File-Based Coordination Pattern

OpenClaw's memory architecture prioritizes plain Markdown files as the source of truth.
This extends naturally to multi-agent coordination: **shared files are the primary
mechanism for agent handoffs and state synchronization**.

### Core Coordination Files

#### plan.md — The Task Decomposition Document

Written by the Lead agent only. Contains the current plan, task assignments, and priorities.

```markdown
# Squad Plan — 2026-03-03

## Current Sprint
- [ ] @coder: Implement OAuth2 flow for Discord integration
- [ ] @researcher: Find production examples of rate limiting in Go
- [x] @writer: Draft API documentation for /auth endpoints

## Priorities
1. Auth module must ship by EOD
2. Rate limiting research blocks coder's next task
3. Docs can be reviewed async

## Dependencies
- coder BLOCKED ON researcher (rate limiting patterns)
- writer INDEPENDENT
```

#### status.md — The Living Status Board

Append-only to prevent overwrites. Each agent appends its status update.

```markdown
# Status Updates

## 2026-03-03T14:22Z — @researcher
STATUS: COMPLETE
TASK: Rate limiting patterns research
RESULT: Found 3 production patterns. See /shared/rate-limit-research.md
NEXT: Available for new assignment

## 2026-03-03T14:15Z — @coder
STATUS: IN_PROGRESS
TASK: OAuth2 flow implementation
BLOCKED: Waiting on rate limiting research from @researcher
ETA: 2 hours after unblock

## 2026-03-03T14:00Z — @lead
STATUS: COORDINATING
ACTION: Assigned sprint tasks. Monitoring dependencies.
```

#### task-queue.md — The Assignment Queue

Used for asynchronous task delegation. Lead writes tasks; specialists claim them.

```markdown
# Task Queue

## PENDING
- [TASK-007] Research WebSocket scaling patterns for 10K concurrent connections
  ASSIGNED: @researcher | PRIORITY: high | CREATED: 2026-03-03T13:00Z

## IN_PROGRESS
- [TASK-005] Implement JWT refresh token rotation
  ASSIGNED: @coder | STARTED: 2026-03-03T12:30Z | ETA: 2hr

## DONE
- [TASK-004] Write integration test for /auth/login endpoint
  ASSIGNED: @coder | COMPLETED: 2026-03-03T12:00Z | RESULT: 12 tests passing
```

### File Coordination Rules

| Rule                           | Rationale                                    |
|--------------------------------|----------------------------------------------|
| **Lead-only writes to plan.md**| Prevents conflicting task assignments         |
| **Append-only for status.md** | Prevents overwrites when agents write concurrently |
| **Idempotent writes**          | If two agents update simultaneously, no data loss |
| **No file locking (yet)**      | OpenClaw file locking is in development       |
| **Shared directory symlinks**  | Each agent workspace symlinks to `shared/`   |

### Workspace Structure

Each agent's workspace follows this pattern:

```
agents/
├── lead/
│   ├── SOUL.md           # Agent persona and instructions
│   ├── AGENTS.md         # Tool and behavior config
│   ├── MEMORY.md         # Private long-term memory (never shared)
│   ├── memory/           # Daily notes (YYYY-MM-DD.md)
│   └── shared/ → ../../shared/   # Symlink to shared coordination files
├── coder/
│   ├── SOUL.md
│   ├── AGENTS.md
│   ├── MEMORY.md
│   └── shared/ → ../../shared/
├── researcher/
│   ├── SOUL.md
│   ├── AGENTS.md
│   ├── MEMORY.md
│   └── shared/ → ../../shared/
└── shared/               # The actual shared directory
    ├── plan.md           # Lead-only writes
    ├── status.md         # Append-only status updates
    ├── task-queue.md     # Task assignments
    └── deliverables/     # Output files from specialists
```

---

## 5.5 Lead-as-CEO Coordination Role

### The Coordinator Pattern

The most successful multi-agent squads in 2026 follow the **Lead-as-CEO** pattern:

> "The coordination layer is the hard part. The agents themselves are 'just' OpenClaw
> sessions with good prompts." — Mission Control documentation

The Lead agent acts as a CEO:
1. **Decomposes tasks** — Breaks user requests into specialist-sized work items
2. **Routes via bindings** — Uses `sessions_send` or `sessions_spawn` to delegate
3. **Synthesizes results** — Combines specialist outputs into cohesive responses
4. **Never forces chains** — Specialists work independently, not in sequence
5. **Monitors progress** — Reads `status.md` and `sessions_list` to track state

### The PM Delegation Pattern

A proven variant keeps the main session as coordinator ONLY. All execution goes to
sub-agents:

```
New task arrives
  → Check PROJECT_REGISTRY.md for existing PM
    → If PM exists: sessions_send to PM
    → If new project: sessions_spawn new PM
      → PM executes, updates STATE.yaml, reports back
  → Lead synthesizes and reports to user
```

**Rule:** The Lead session should make **0–2 tool calls max** (spawn/send only).
Everything else is delegated. This keeps the Lead's context window clean and cheap.

### Lead Agent SOUL.md Template

```markdown
# Lead Agent — SOUL.md

You are the Lead coordinator for this OpenClaw squad. Your role:

## Core Responsibilities
- Decompose user requests into specialist-sized tasks
- Route tasks to the appropriate specialist via sessions_send or sessions_spawn
- Monitor progress by reading shared/status.md and using sessions_list
- Synthesize specialist results into cohesive user-facing responses
- Update shared/plan.md with current sprint status

## Rules
- NEVER execute tasks yourself — always delegate to specialists
- NEVER force sequential chains — let specialists work independently
- Make 0–2 tool calls per turn (spawn/send only)
- Read status.md before assigning new tasks (check for blocks)
- Write structured summaries, not verbose prose
- Use the cheapest model that can handle coordination (you don't need Opus)

## Communication Protocol
- To assign a task: sessions_send to the specialist's session
- To check progress: read shared/status.md OR sessions_history
- To unblock: reassign blocked tasks or provide missing context
- To synthesize: read deliverables from shared/deliverables/
```

---

## 5.6 Delegation Rules and Depth Limits

### maxSpawnDepth: Preventing Recursion Hell

OpenClaw enforces strict depth limits on sub-agent spawning:

| Setting          | Default | Range | Description                              |
|------------------|---------|-------|------------------------------------------|
| `maxSpawnDepth`  | 2*      | 1–5   | Max nesting depth for sub-agent spawning |
| `maxChildrenPerAgent` | 5  | 1–20  | Max active children per session          |
| `maxConcurrent`  | 8       | 1–20  | Max concurrent sub-agent runs            |

*Changed to 2 in v2026.2.21 (was 1 previously).

### Configuration

```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2,
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 8
      }
    }
  }
}
```

### Depth-Based Tool Access

Tools available to sub-agents change based on their depth:

| Depth | Role           | Available Tools                                  |
|-------|----------------|--------------------------------------------------|
| 0     | Main agent     | All tools including sessions_send/spawn           |
| 1     | Orchestrator*  | sessions_spawn, subagents, sessions_list/history  |
| 1     | Leaf worker†   | Full tool set MINUS session tools                 |
| 2     | Leaf worker    | Full tool set MINUS session tools, can't spawn    |

*When `maxSpawnDepth >= 2`. †When `maxSpawnDepth == 1`.

### The One-Way Flow Rule

The most important delegation rule: **communication flows one way only**.

```
User → Lead → Specialist → Result
              ↑                |
              └────────────────┘  (announce back, never lateral)
```

- **No lateral communication:** Specialist A cannot message Specialist B directly
- **No upward delegation:** Specialists don't assign tasks back to the Lead
- **One-way results:** Specialists announce results; Lead reads them
- **Depth limits enforce this:** Sub-agents at depth 2 have no session tools at all

### Result Announce Chain

Results flow back up the hierarchy automatically:

1. Depth-2 worker finishes → announces to parent (depth-1 orchestrator)
2. Depth-1 orchestrator synthesizes → announces to main agent
3. Main agent delivers to user

Each level only sees announces from its **direct children** — no cross-level visibility.

---

## 5.7 Real 2026 Production Examples

### Example 1: shenhao-stu/openclaw-agents — 9-Agent Squad

**Source:** [github.com/shenhao-stu/openclaw-agents](https://github.com/shenhao-stu/openclaw-agents)

One-command multi-agent setup for OpenClaw with 9 specialized AI agents, group routing,
and safe config merge. Ships an entire AI agent fleet to your chat group in 60 seconds.

**Architecture:**
- 9 pre-configured agents with emoji identities for instant recognition
- Two modes: **Channel Mode** (auto-routes to Feishu/WhatsApp/Telegram/Discord) and
  **Local Workflow Mode** (agents communicate via `agentToAgent` tool, no channel needed)
- Default model: `zai/glm-5`
- Agent self-merge: deploys BOOTSTRAP.md for intelligent first-run setup

**Setup:**
```bash
git clone https://github.com/shenhao-stu/openclaw-agents.git
cd openclaw-agents
chmod +x setup.sh

# Channel mode with group routing
./setup.sh --mode channel --channel feishu --group-id oc_default \
  --group-map 'coder=oc_dev,scout=oc_news'

# Local mode (no channel)
./setup.sh --skip-bindings

# Preview only
./setup.sh --dry-run
```

**Verification:**
```bash
openclaw agents list --bindings   # Shows all 8 agents with bindings
openclaw channels status --probe  # Shows channel connected
```

### Example 2: Clawe — "Trello for OpenClaw Agents"

**Source:** [github.com/getclawe/clawe](https://github.com/getclawe/clawe)

Multi-agent coordination system with Kanban-style task management, real-time notifications,
and a web dashboard. Think Trello for AI agent teams.

**Architecture (Docker Compose):**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  squadhub   │    │   watcher   │    │    clawe     │
│ (Gateway +  │◄──►│ (registers  │◄──►│ (web dash   │
│  4 agents)  │    │  agents,    │    │  task board  │
│             │    │  crons,     │    │  agent chat) │
│             │    │  notifs)    │    │             │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                    ┌─────┴─────┐
                    │  Convex   │
                    │ (backend) │
                    │ agents,   │
                    │ tasks,    │
                    │ notifs    │
                    └───────────┘
```

**Agent CLI commands:**
```bash
clawe check              # Check notifications
clawe tasks              # List tasks
clawe tasks update       # Update task status
clawe tasks comment      # Add comments
clawe squad              # View squad status
clawe activity           # Activity feed
```

### Example 3: Mission Control — SaaS Agent Squad Platform

**Source:** [dan-malone.com/blog/mission-control-ai-agent-squads](https://www.dan-malone.com/blog/mission-control-ai-agent-squads)

Hosted platform for designing and deploying AI agent squads. Design your squad through
a conversation; Mission Control handles the infrastructure.

### Example 4: 17-Agent Mixed-Model Squad (RFC Discussion)

**Source:** [GitHub Discussion #10036](https://github.com/openclaw/openclaw/discussions/10036)

A team reported running 17 agents (mix of Opus, Sonnet, GPT-5.2 Codex, and local Qwen 72B)
coordinated through a single OpenClaw gateway. They identified the biggest UX gap as wanting
natural multi-agent group conversations on Telegram where agents share context and respond
organically — exactly what the Agent Teams RFC aims to address.

### Example 5: 88K-Word Book — 5 Parallel Agents

**Source:** [GitHub Discussion #17626](https://github.com/openclaw/openclaw/discussions/17626)

"The OpenClaw Paradigm: AI-Native Development in Practice" — 14 chapters, 42 diagrams,
88,000+ words. Produced by 5 parallel AI agents in approximately 48 hours using the
sub-agent coordination pattern with shared file handoffs.

### Example 6: Trebuh's 4-Agent Solo Founder Setup

A solo founder running 4 OpenClaw agents on a VPS, controlled through a single Telegram chat:
- **Milo** — Strategy lead (Opus, coordinates all agents)
- **Josh** — Business agent (Sonnet, handles operations)
- **Marketing agent** — Content and campaigns (Haiku, cheap model)
- **Dev agent** — Code generation and deployment (Sonnet, sandboxed)

Each agent has its own personality, model, and scheduled tasks, while sharing project memory
through a common `shared/` directory. Described as "a real small team available 24/7."

---

## 5.8 Integration with Independence & Memory

### Private MEMORY.md: Never Shared

Each agent has a private `MEMORY.md` in its workspace. This file:
- Contains durable facts, decisions, and preferences specific to that agent
- Is **never shared** with other agents or loaded in group contexts
- Is only loaded in private sessions to protect sensitive information
- Is isolated per-agent via separate SQLite indexes at
  `~/.openclaw/memory/<agentId>.sqlite`

### Lead Reads via Read-Only Oversight Only

The Lead agent can observe specialist state through:
1. **Reading shared files** — `status.md`, `task-queue.md`, deliverables
2. **sessions_history** — Fetch transcript logs from specialist sessions
3. **sessions_list** — Discover active sessions across agents

The Lead **cannot** write to a specialist's private `MEMORY.md` or modify their workspace
files. This is a hard boundary — the Lead coordinates through shared files and messaging,
not by directly manipulating specialist state.

### Memory Isolation in Multi-Agent Setups

| Scope                  | Isolation Level                              |
|------------------------|----------------------------------------------|
| MEMORY.md              | Private per-agent, never shared              |
| memory/YYYY-MM-DD.md   | Private per-agent daily notes                |
| Session transcripts    | Per-agent at `~/.openclaw/agents/<id>/sessions/` |
| Memory index (SQLite)  | Per-agent at `~/.openclaw/memory/<id>.sqlite` |
| Shared files           | Accessible by all agents via symlinked `shared/` |

---

## 5.9 Integration with Cost Optimization

### Cheap Models for Coordination, Pro Models for Synthesis

The fundamental insight: **not every task deserves your most expensive model**. A coordinator
doing task classification and routing doesn't need the same reasoning power as a specialist
debugging a complex distributed system.

**Recommended model tiering for coordination:**

| Role          | Model Tier                      | Cost/1M tokens | Rationale                    |
|---------------|---------------------------------|-----------------|------------------------------|
| Lead          | Sonnet / GPT-4o                 | ~$3–6           | Routing + synthesis          |
| Coder         | Opus / GPT-5.2 Codex            | ~$15–30         | Complex code generation      |
| Researcher    | Gemini 3 Flash / Haiku          | ~$0.03–0.25     | Search + summarize           |
| Writer        | Sonnet                          | ~$3–6           | Drafting + editing           |
| Heartbeat     | Local Qwen 3 32B / Haiku        | ~$0 / $0.03     | Status checks, cron tasks    |

**Cost impact of coordination overhead:**
- Research puts coordination overhead at **3.5x** the token consumption of equivalent
  single-agent workflows (LumaDock cost guide)
- Every handoff between agents duplicates context across specialists
- A single agent can generate $50–150/month. Multi-agent coordination can triple that.
- With proper model tiering, heavy users report **60–65% cost reduction** vs running
  everything on a premium model

**Configuration:**
```json
{
  "agents": {
    "lead": {
      "model": "anthropic:claude-sonnet-4-20250514"
    },
    "coder": {
      "model": "anthropic:claude-opus-4-20250514"
    },
    "researcher": {
      "model": "openrouter:google/gemini-3-flash"
    },
    "defaults": {
      "subagents": {
        "model": "anthropic:claude-haiku-4-5-20251001"
      }
    }
  }
}
```

---

## 5.10 Integration with Tool Tiering

### Minimal Privilege Per Agent

OpenClaw's per-agent tool allow/deny lists enforce the principle of minimal privilege.
The deny list always wins over the allow list.

**Recommended tool access by role:**

| Role        | Allowed Tools                                      | Denied Tools                  |
|-------------|----------------------------------------------------|-------------------------------|
| Lead        | sessions_send, sessions_list, sessions_spawn,      | exec, browser, canvas         |
|             | sessions_history, memory_search, read, write       |                               |
| Coder       | exec, read, write, edit, git                        | sessions_send, browser, web   |
| Researcher  | web_search, web_fetch, read, write                  | exec, sessions_send, git      |
| Writer      | read, write, edit                                   | exec, browser, sessions_send  |

**Configuration:**
```json
{
  "agents": {
    "lead": {
      "tools": {
        "allow": ["sessions_send", "sessions_list", "sessions_spawn",
                   "sessions_history", "memory_search", "read", "write"],
        "deny": ["exec", "browser", "canvas"]
      }
    },
    "coder": {
      "tools": {
        "allow": ["exec", "read", "write", "edit", "git"],
        "deny": ["sessions_send", "browser", "web_search"]
      }
    }
  }
}
```

### Lead Grants Tools During Coordination

The Lead can effectively "grant" tool access by routing tasks to the appropriate specialist.
Need code executed? Route to `coder`. Need web research? Route to `researcher`. The Lead
itself never executes these tools directly — it coordinates specialists who have them.

---

## 5.11 Common Failure Modes and Anti-Patterns

### Anti-Pattern 1: Hard-Coded Chains (Over-Engineering)

**Symptom:** Agent A always passes to B, which always passes to C. Any change requires
rewriting the entire pipeline definition.

**Why it fails:**
- Rigid pipelines can't adapt to tasks that don't fit the predefined flow
- Adding or removing an agent requires rewriting the chain
- A failure at any stage blocks the entire pipeline
- Rarely succeeds beyond 3–5 agents in production

**Fix:** Use binding-based routing with shared files. Let the Lead dynamically assign
tasks based on the current workload, not a hard-coded sequence.

### Anti-Pattern 2: Broadcast Messaging (Noise)

**Symptom:** All agents receive all messages. Every agent processes every update, even
when irrelevant to their role.

**Why it fails:**
- Token costs spike as every agent burns context on irrelevant messages
- Signal-to-noise ratio collapses in groups larger than 3 agents
- Agents start responding to messages meant for other agents
- `requireMention` helps but doesn't solve the fundamental routing problem

**Fix:** Use bindings to route messages to specific agents. Use `sessions_send` for
targeted, opt-in communication. Never broadcast when a direct message will do.

### Anti-Pattern 3: No Depth Limits (Recursion Hell)

**Symptom:** Coordinator sends to specialist A, specialist A sends back, coordinator
sends again. Token costs spike, nothing gets done, Gateway hits concurrency limits.

**Why it fails:**
- Without `maxSpawnDepth`, sub-agents can spawn sub-agents indefinitely
- Without `maxPingPongTurns`, agents loop in endless conversation
- Without `maxChildrenPerAgent`, a single orchestrator can fan out uncontrollably

**Fix:** Set explicit limits:
```json
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2,
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 8
      }
    }
  },
  "session": {
    "agentToAgent": {
      "maxPingPongTurns": 2
    }
  }
}
```

### Anti-Pattern 4: Token Amplification (Verbose Handoffs)

**Symptom:** Each agent-to-agent handoff adds massive token overhead. The coordinator
summarizes verbosely before delegating, the specialist summarizes verbosely before
returning, and the coordinator summarizes again.

**Why it fails:**
- A task that a single agent handles in one pass burns 3–5x tokens across a squad
- Context duplication across every handoff multiplies costs
- Prose summaries between agents are expensive and lossy

**Fix:** Make specialists return **structured output**, not prose summaries. The Lead
handles final synthesis. Use append-only files instead of full-context handoffs.

### Anti-Pattern 5: Concurrent File Writes (Race Conditions)

**Symptom:** Two specialists write to `status.md` simultaneously. One overwrites the
other's update.

**Why it fails:**
- OpenClaw doesn't yet have file locking for multi-agent writes
- Simultaneous writes to the same file cause silent data loss

**Fix:** Use **append-only files** for status updates. Design writes to be idempotent.
Only the Lead writes to `plan.md` (single-writer pattern). Specialists append to
`status.md` with timestamps.

### Summary: Anti-Pattern Quick Reference

| Anti-Pattern              | Root Cause                    | Fix                               |
|---------------------------|-------------------------------|------------------------------------|
| Hard-coded chains         | Rigid pipeline definitions    | Binding-based routing + shared files|
| Broadcast messaging       | All agents see all messages   | Targeted bindings + sessions_send  |
| Recursion hell            | No spawn/ping-pong limits     | maxSpawnDepth + maxPingPongTurns   |
| Token amplification       | Verbose inter-agent handoffs  | Structured output, Lead synthesizes|
| Concurrent file writes    | No file locking               | Append-only files, single-writer   |
| God-agent Lead            | Lead executes instead of routing | 0–2 tool calls, delegate everything |
| Shared memory bleeding    | Agents share userId for memory | Per-agent isolation via agentId    |

---

## 5.12 Step-by-Step Setup Commands

### Step 1: Initialize OpenClaw and Add Agents

```bash
# Initialize OpenClaw project
npx openclaw init

# Authenticate your model provider
openclaw models auth paste-token --provider anthropic

# Add agents with isolated workspaces
openclaw agents add lead --workspace ./agents/lead --non-interactive
openclaw agents add coder --workspace ./agents/coder --non-interactive
openclaw agents add researcher --workspace ./agents/researcher --non-interactive
```

### Step 2: Configure Bindings

```bash
# Bind agents to specific channels/groups
openclaw agents bind --agent coder --bind discord:dev-channel-id
openclaw agents bind --agent researcher --bind telegram:research-group
openclaw agents bind --agent lead --bind discord
openclaw agents bind --agent lead --bind telegram

# Verify bindings
openclaw agents list --bindings
```

### Step 3: Configure agentToAgent Communication

Add to `openclaw.json`:
```json
{
  "tools": {
    "agentToAgent": {
      "enabled": true
    }
  },
  "gateway": {
    "bind": "lan"
  },
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2,
        "maxChildrenPerAgent": 5,
        "maxConcurrent": 8
      }
    }
  },
  "session": {
    "agentToAgent": {
      "maxPingPongTurns": 2
    }
  }
}
```

### Step 4: Set Up Per-Agent Tool Policies

Add to each agent's config section in `openclaw.json`:
```json
{
  "agents": {
    "lead": {
      "model": "anthropic:claude-sonnet-4-20250514",
      "tools": {
        "allow": ["sessions_send", "sessions_list", "sessions_spawn",
                   "sessions_history", "read", "write"],
        "deny": ["exec", "browser"]
      }
    },
    "coder": {
      "model": "anthropic:claude-opus-4-20250514",
      "tools": {
        "allow": ["exec", "read", "write", "edit", "git"],
        "deny": ["sessions_send", "browser"]
      }
    },
    "researcher": {
      "model": "openrouter:google/gemini-3-flash",
      "tools": {
        "allow": ["web_search", "web_fetch", "read", "write"],
        "deny": ["exec", "sessions_send"]
      }
    }
  }
}
```

### Step 5: Create Shared Coordination Files

```bash
# Create shared directory
mkdir -p shared/deliverables

# Create plan.md template
cat > shared/plan.md << 'EOF'
# Squad Plan — $(date +%Y-%m-%d)

## Current Sprint
- [ ] (no tasks assigned yet)

## Priorities
1. (none set)

## Dependencies
- (none identified)
EOF

# Create status.md template
cat > shared/status.md << 'EOF'
# Status Updates

(append-only — each agent adds entries below)
EOF

# Create task-queue.md template
cat > shared/task-queue.md << 'EOF'
# Task Queue

## PENDING
(no tasks)

## IN_PROGRESS
(no tasks)

## DONE
(no tasks)
EOF

# Symlink shared directory into each agent workspace
ln -sf ../../shared agents/lead/shared
ln -sf ../../shared agents/coder/shared
ln -sf ../../shared agents/researcher/shared
```

### Step 6: Start the Gateway

```bash
# Start the gateway with all agents
openclaw gateway start

# Verify all agents are running
openclaw agents list --bindings

# Check channel connectivity
openclaw channels status --probe
```

### Full Coordination Flow Diagram (Text)

```
┌──────────────────────────────────────────────────────────────┐
│                        USER REQUEST                          │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     GATEWAY (Routing)                         │
│  Evaluates bindings: most-specific-first                     │
│  Routes to Lead agent (channel-wide fallback)                │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    LEAD AGENT (Sonnet)                        │
│  1. Read shared/plan.md + shared/status.md                   │
│  2. Decompose task into specialist work items                │
│  3. Update shared/plan.md                                    │
│  4. Route via sessions_send / sessions_spawn                 │
└────────┬─────────────────────────────────┬───────────────────┘
         │                                 │
         ▼                                 ▼
┌─────────────────────┐      ┌──────────────────────────┐
│  CODER (Opus)       │      │  RESEARCHER (Gemini Flash)│
│  - exec, git, edit  │      │  - web_search, web_fetch  │
│  - Sandboxed Docker  │      │  - read, write            │
│  - No sessions_send │      │  - No exec                │
└────────┬────────────┘      └───────────┬──────────────┘
         │                               │
         ▼                               ▼
┌─────────────────────┐      ┌──────────────────────────┐
│  Append status.md   │      │  Append status.md        │
│  Write deliverable   │      │  Write deliverable        │
│  Announce to Lead   │      │  Announce to Lead         │
└────────┬────────────┘      └───────────┬──────────────┘
         │                               │
         └───────────────┬───────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    LEAD AGENT (Synthesis)                     │
│  1. Read announces + deliverables                            │
│  2. Synthesize into cohesive response                        │
│  3. Update shared/status.md                                  │
│  4. Deliver to user                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 5.13 Practical Recommendations

### For Small Squads (2–4 Agents)

1. Start with **one Lead + one specialist**. Add specialists only when you have clear roles.
2. Use **shared files** for coordination (plan.md, status.md). Skip `sessions_send`.
3. Use **heartbeat crons** to wake specialists every 15 minutes to check the task queue.
4. Keep the Lead on Sonnet, specialists on the cheapest model that handles their role.

### For Medium Squads (5–9 Agents)

1. Use **binding-based routing** to isolate agents by channel/group.
2. Enable **agentToAgent** for the Lead only. Deny `sessions_send` for all specialists.
3. Implement **append-only status.md** to prevent concurrent write conflicts.
4. Set `maxSpawnDepth: 2` to allow one level of orchestrator delegation.
5. Use `maxChildrenPerAgent: 5` and `maxConcurrent: 8` to prevent fan-out.
6. Use a tool like **Clawe** for task management visibility if the team is non-technical.

### For Large Squads (10+ Agents)

1. Consider **sub-teams** — each sub-team has its own Lead orchestrator agent.
2. Main Lead delegates to sub-team Leads via `sessions_spawn`.
3. Use `maxSpawnDepth: 2` (main → sub-team Lead → workers). Never go deeper.
4. Use **OTEL tracing** to monitor the full coordinator → specialist → tool chain.
5. Run cost monitoring from day one. Budget per-agent and per-role.
6. Keep specialists **stateless and concise** — structured output, not prose.

### The "Honestly, Do You Need Multi-Agent?" Checklist

Before building a multi-agent squad, ask:

- [ ] Does a single well-configured agent with good tools NOT cover this use case?
- [ ] Do I have **3+ clearly distinct roles** that benefit from isolation?
- [ ] Am I prepared for **3.5x token overhead** from coordination?
- [ ] Do I have a plan for **observability and cost monitoring**?
- [ ] Can I articulate **why each agent exists** (not just "it sounds cool")?

If you answered "no" to any of these, start with a single agent. Multi-agent coordination
adds real complexity. The best squads have clear reasons for every agent they add.

---

## 5.14 Looking Ahead: Agent Teams RFC

The most significant upcoming change to OpenClaw coordination is the **Agent Teams RFC**
(GitHub Discussion #10036). Key proposals:

- **Shared task ledger** — `TaskCreate`, `TaskList`, `TaskUpdate` tools for explicit
  task management with dependencies
- **Direct teammate messaging** — `teammate_message` and `teammate_broadcast` tools
  for natural group conversations
- **Flexible coordination modes** — "delegate" mode (Lead plans + reviews, Teammates
  execute) vs "collaborate" mode (peer-to-peer)
- **Shared filesystem** — `~/.openclaw/teams/` for team-level state
- **Plan approval workflow** — Lead proposes plan, teammates vote before execution

The community response has been enthusiastic. The "delegate" coordination mode maps
directly to the Lead-as-CEO pattern that production squads already use. As one commenter
noted: "A single-brain agent that both plans and codes is terrible — it forgets its own
plan. Splitting into Lead (plans + reviews) and Teammate (executes) is a massive
improvement."

---

## Sources

- [OpenClaw Multi-Agent Routing (Official Docs)](https://docs.openclaw.ai/concepts/multi-agent)
- [OpenClaw Session Tools (Official Docs)](https://docs.openclaw.ai/concepts/session-tool)
- [OpenClaw Sub-Agents (Official Docs)](https://docs.openclaw.ai/tools/subagents)
- [OpenClaw Security (Official Docs)](https://docs.openclaw.ai/gateway/security)
- [OpenClaw Memory (Official Docs)](https://docs.openclaw.ai/concepts/memory)
- [OpenClaw Agents CLI (Official Docs)](https://docs.openclaw.ai/cli/agents)
- [LumaDock: Multi-Agent Coordination & Governance](https://lumadock.com/tutorials/openclaw-multi-agent-coordination-governance)
- [LumaDock: Multi-Agent Setup](https://lumadock.com/tutorials/openclaw-multi-agent-setup)
- [LumaDock: Cost Optimization](https://lumadock.com/tutorials/openclaw-cost-optimization-budgeting)
- [LumaDock: Memory Explained](https://lumadock.com/tutorials/openclaw-memory-explained)
- [MoltFounders: OpenClaw Configuration Guide 2026](https://moltfounders.com/openclaw-configuration)
- [MoltFounders: Mega Cheatsheet 2026](https://moltfounders.com/openclaw-mega-cheatsheet)
- [RFC: Agent Teams (GitHub #10036)](https://github.com/openclaw/openclaw/discussions/10036)
- [shenhao-stu/openclaw-agents (9-Agent Setup)](https://github.com/shenhao-stu/openclaw-agents)
- [getclawe/clawe (Trello for Agents)](https://github.com/getclawe/clawe)
- [DEV Community: Deterministic Pipeline (ggondim)](https://dev.to/ggondim/how-i-built-a-deterministic-multi-agent-dev-pipeline-inside-openclaw-and-contributed-a-missing-4ool)
- [DEV Community: Multiagent Best Practices](https://dev.to/operationalneuralnetwork/openclaw-multiagent-best-practices-a-complete-guide-51m5)
- [Dan Malone: Mission Control Agent Squads](https://www.dan-malone.com/blog/mission-control-ai-agent-squads)
- [Dan Malone: Building Multi-Agent Team on Telegram](https://www.dan-malone.com/blog/building-a-multi-agent-ai-team-in-a-telegram-forum)
- [HackMD: OpenClaw Architecture Deep Dive (02/08/2026)](https://hackmd.io/Z39YLHZoTxa7YLu_PmEkiA)
- [GitHub #17626: 88K-Word Book with Multi-Agent System](https://github.com/openclaw/openclaw/discussions/17626)
- [GitHub #6832: Sub-Agent Depth Limits](https://github.com/openclaw/openclaw/issues/6832)
- [DeepWiki: Subagent Management](https://deepwiki.com/openclaw/openclaw/9.6-subagent-management)
- [ZenVanRiel: API Cost Optimization](https://zenvanriel.nl/ai-engineer-blog/openclaw-api-cost-optimization-guide/)
- [VelvetShark: Multi-Model Routing](https://velvetshark.com/openclaw-multi-model-routing)
