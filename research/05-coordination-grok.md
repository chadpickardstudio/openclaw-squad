Multi-agent coordination patterns in OpenClaw (March 2026 state-of-the-art)

OpenClaw (github.com/openclaw/openclaw, docs.openclaw.ai) has matured into a production-grade multi-agent platform by early 2026. The core primitives — isolated agents (separate workspaces, agentDir, sessions stores), deterministic channel bindings, the sessions_send/sessions_spawn tool family, and lightweight shared .md files — enable scalable squads of 5–19 agents without external orchestration frameworks. Official routing, sub-agent depth controls, and per-agent tool/memory isolation form the foundation; LumaDock governance tutorials and community repos (e.g., shenhao-stu/openclaw-agents) supply the practical patterns used in real fleets.

Latest changes (v2026.2.x–2026.3.x) include hardened session visibility scoping (tree / spawned-only), loop-detection safeguards in ping-pong replies, and safer resolvePathWithinSessionsDir checks for bindings. Production squads now routinely run on single VPS instances with model tiering and file-based handoffs replacing brittle prompt-chains.

Loose vs Rigid Coordination Patterns

Loose coordination (dominant 2026 pattern) relies on:
* Deterministic bindings for inbound routing
* Opt-in sessions_send / sessions_spawn for delegation
* Append-only shared .md files (plan.md / status.md / goal.md / log.md) for persistent handoff state
* A single Lead (CEO-style orchestrator) that decomposes, delegates, and synthesizes

Rigid coordination (discouraged) hard-codes fixed pipelines (e.g., main → writer → checker → reviewer via nested sessions_send or deep spawning).

Why loose routing wins in 2026:
* No uncontrolled ping-pong (max 5 turns default + REPLY_SKIP / ANNOUNCE_SKIP + file state)
* No straight-jacket pipelines (Lead dynamically re-plans via files; easy to audit/rollback)
* Full agent independence (private MEMORY.md, per-agent tools/sandbox/model)
* Scalability to 19 agents without recursion hell or context bloat
* Cost control (cheap models for routing/coord; pro only for synthesis)
* Inspectability (git-diff plan.md, status.md kanban-style)

Comparison Table

Aspect Loose (Bindings + Files + Opt-in) Rigid (Hard-coded Chains) Flexibility High (dynamic decomposition) Low (fixed sequence) Debugging/Audit Excellent (files + bindings CLI) Poor (nested session history) Recursion Risk Low (depth limits + skips + denies) High Scalability (5-19 agents) Excellent Poor (token/cost explosion) Cost Optimization Native (model & tool tiering per role) Difficult Inspectability High (append-only logs) Low

Pros of loose: auditable, resilient, aligns with OpenClaw's isolation model. Cons: requires disciplined Lead prompt engineering. Pros of rigid: predictable for tiny squads. Cons: over-engineering; community reports abandonment after 3-4 agents.

Channel Bindings System

Bindings live in ~/.openclaw/openclaw.json (or OPENCLAW_CONFIG_PATH). Routing is most-specific-first; when multiple bindings match the same tier, config-order wins. All fields in a match object are AND-ed.

Precedence (most-specific to least):
1. Exact peer (DM/group ID)
2. Parent peer (threads)
3. Guild + roles (Discord)
4. Guild / TeamId
5. AccountId
6. Channel-wide (accountId: "*")
7. Default agent (agents.list[].default or first entry or "main")

requireMention rules: Configured per-group in channels.{channel}.groups.{id}.requireMention or mentionPatterns: ["@planner", "planner"]. Groups without it fall to default binding.

Full example config (shenhao-stu style + official):

```json
{
  "agents": {
    "list": [
      { "id": "planner", "default": true, "workspace": "~/.openclaw/workspace-planner", "model": { "primary": "anthropic/claude-opus-4-6" } },
      { "id": "coder", "workspace": "~/.openclaw/workspace-coder", "model": { "primary": "ollama/qwen3-code-next" } }
    ]
  },
  "bindings": [
    { "agentId": "planner", "match": { "channel": "discord", "peer": { "kind": "group", "id": "1234567890" } } },
    { "agentId": "coder", "match": { "channel": "telegram", "accountId": "coding-bot" } }
  ],
  "channels": {
    "discord": { "groups": { "1234567890": { "requireMention": true, "mentionPatterns": ["@planner"] } } },
    "telegram": { "accounts": { "coding-bot": { "botToken": "..." } } }
  }
}
```

CLI verification:

```
openclaw agents add planner
openclaw agents list --bindings
openclaw gateway restart
```

sessions_send and Opt-in Messaging

sessions_send is the opt-in A2A primitive (disabled by default).

Syntax (tool call):

```json
{
  "name": "sessions_send",
  "parameters": {
    "sessionKey": "agent:coder:telegram:group:123",
    "message": "Implement feature X per plan.md line 42. Return concise diff.",
    "timeoutSeconds": 0
  }
}
```

Ping-pong control (prevents recursion hell):
* Max turns: session.agentToAgent.maxPingPongTurns (default 5, configurable 0-infinity)
* Target replies exactly REPLY_SKIP to end loop
* After primary run: announce step (target replies ANNOUNCE_SKIP to suppress visible message)

Opt-in config (global or per-agent):

```json
"tools": {
  "agentToAgent": { "enabled": true, "allow": ["planner", "coder", "reviewer"] }
}
```

Direct vs routed: sessions_send is direct (by sessionKey). Inbound user messages use bindings. Sub-agents announce results back automatically (unless skipped).

How agents request help without recursion: Specialists are denied sessions_send via tools.deny or maxSpawnDepth:1. Only Lead uses it. One-way announce flow.

Shared Lightweight Files for Handoffs

Community standard (LumaDock governance + shenhao + Reddit): place in a shared workspace or Lead's workspace with read/write tools. Append-only + Lead-only writes for critical sections prevents races.

Files:
* goal.md / plan.md: Lead writes decomposition + assignments
* status.md: Per-subtask status (pending/in-progress/complete/blocked)
* task-queue.md or log.md: Append-only audit
* Private per-agent: MEMORY.md, SOUL.md, AGENTS.md (never shared)

plan.md template (Lead-only):

```
# PLAN.md - 2026-03-03 Campaign X
## Goal (Lead decomposition)
Launch Q2 marketing push. Budget: $5k.

## Subtasks (append-only)
- [ID-001] Research competitors -> Assigned: surveyor | Status: pending | Due: now
- [ID-002] Draft copy -> Assigned: writer | Status: pending

## Status Summary (link to status.md)
Updates: Only Lead edits this section. Specialists append to log.md.
```

status.md snippet:

```
# STATUS.md
ID-001: complete | Result: 3 competitors analyzed | Updated: surveyor @ 08:12
```

Practical rules:
* Lead owns plan.md updates after synthesis
* Specialists append only (idempotent writes + unique task IDs)
* Lead reads via read-only oversight (or summary announces)

Lead-as-CEO Coordination Role

The planner / main / coordinator agent acts as CEO:
* Decomposes user request
* Updates plan.md / status.md / task-queue.md
* Routes via bindings or targeted sessions_send / sessions_spawn
* Synthesizes results (never forces chains)
* Final response + MEMORY.md summary
* Can autonomously grant extra tools, APIs, email accounts, and secrets to other agents as they grow and develop (with optional one-time human approval for high-risk items only)

Prompt snippet (Lead SOUL.md or system prompt):

```
Act as CEO. Decompose into plan.md. Delegate ONLY via sessions_send or spawn (never force chains). Specialists are stateless. Synthesize results, update status.md, close task. Never recurse. Use cheap model for routing.
```

Delegation Rules and Depth Limits

* agents.defaults.subagents.maxSpawnDepth: 1 (recommended; orchestrator spawns workers, workers cannot spawn)
* maxChildrenPerAgent, maxConcurrent
* No lateral communication: specialists have tools.agentToAgent.allow: [] or explicit deny
* One-way flow: announce back to parent only
* Cascade kill on timeout

Config:

```json
"agents": {
  "defaults": {
    "subagents": {
      "maxSpawnDepth": 1,
      "maxChildrenPerAgent": 5,
      "maxConcurrent": 8
    }
  }
}
```

Real 2026 Production Examples

shenhao-stu 9-agent squad (github.com/shenhao-stu/openclaw-agents): Agents: main (final), planner (CEO/Lead), ideator, critic (SHARP scoring gate), surveyor, coder, writer, reviewer, scout.

* Bindings: group channels with requireMention: true + mentionPatterns.
* Coordination: Planner decomposes -> adversarial loops (ideator<->critic) -> parallel execution -> writer->reviewer -> announce to planner -> main synthesizes.

```
User @planner (binding) -> Planner (update plan.md)
               |
sessions_spawn/send (depth=1)
Ideator -> Critic (SHARP>=18 gate) -> Surveyor + Coder (parallel) -> Writer -> Reviewer (veto possible)
               ^ announce (REPLY_SKIP or full result)
Planner: synthesize -> update status.md -> main final output
```

Setup: ./setup.sh --mode channel --channel discord --group-id ... --model-map 'coder=ollama/qwen3'

LumaDock-style 19-agent fleet (tutorial patterns + YouTube reports): One Coordinator Lead + 18 stateless domain specialists (research variants, UX, security, analytics, social, etc.).

* Heavy model tiering + shared plan/status files.
* Bindings route client-specific channels to Lead; internal delegation via files/sessions_send.
* Cost: ~$6/mo optimized on VPS.

Pantheon-style 14-agent marketing squad (Reddit r/openclaw + community reports, 2026): Lead + specialists (content, SEO, ad-copy, analytics, email, social variants).

* Shared task-queue.md + plan.md in Lead workspace.
* Bindings per client Discord/Telegram group.
* Runs 24/7 on $5 VPS; synthesis by Lead (pro model).

Integration with Independence and Memory

Every agent has fully private:
* Workspace (MEMORY.md, SOUL.md, AGENTS.md)
* Sessions store
* Model and sandbox

Specialists often run with memory.enabled: false (stateless). Lead never receives full MEMORY.md dumps; reads summaries via announce or read-only file access if shared dir configured.

Integration with Cost Optimization

* Lead/coordinator: cheap model for decomposition/routing
* Specialists: cheap or targeted pro only for synthesis steps
* Stateless sub-agents + concise announces
* Concurrency caps + off-peak cron

Integration with Tool Tiering

Per-agent tools.allow / deny + sandbox:
* Lead: full sessions_*, read/write shared files
* Specialists: domain tools only + explicit deny sessions_send, agentToAgent, elevated exec
* Lead grants tools at setup time via config (with optional one-time human approval for high-risk items)

Common Failure Modes and Anti-Patterns

* Hard-coded chains = over-engineering -> brittle on changes
* Broadcast messaging (sessions_send to many) = noise and cost explosion
* No depth limits or tool denies = recursion hell + runaway tokens
* Shared-file races -> use append-only + unique IDs
* Binding mis-order -> wrong agent responds (test with agents list --bindings)
* Context bleed -> disable memory on specialists

Step-by-Step Setup Commands

```bash
# 1. Base setup
openclaw onboard
openclaw agents add planner
openclaw agents add coder  # repeat for each

# 2. Bindings (edit openclaw.json or use safe-merge from shenhao)
openclaw agents list --bindings
openclaw gateway restart

# 3. Enable opt-in A2A and depth limits (edit openclaw.json as above)

# 4. Create shared files in planner workspace
cat > ~/openclaw-team/plan.md << EOF
# PLAN.md template here
EOF

# 5. Test
# In Lead session: /subagents spawn coder "Task from plan.md line 3"
```

Practical recommendations (2026):
* Start with 3 agents (planner + 2 specialists); scale to 9-19 once stable.
* Use shenhao-stu repo as template for any squad size.
* Enforce maxSpawnDepth:1 and specialist tool denies in every production config.
* Monitor with sessions_list + external Prometheus (LumaDock pattern).
* Version shared .md files with git for auditability on large squads.
* Require @Lead or mentionPatterns in all group chats.

This pattern set (bindings + controlled sessions_send + file handoffs + Lead-CEO) is the production standard in March 2026. It delivers reliable, auditable, cost-efficient squads far beyond early 2025 rigid pipelines.

Source: Grok deep research — OpenClaw coordination patterns March 2026
