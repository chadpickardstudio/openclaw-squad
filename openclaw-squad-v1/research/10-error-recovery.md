# 10. Error Recovery & Fallback Loops — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, official GitHub, community configs
> **Last verified**: March 2026 (OpenClaw v2026.3.x, RFC #33809 self-healing router, LumaDock patterns)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Full Error Recovery Architecture](#2-full-error-recovery-architecture)
3. [Error Detection & Classification](#3-error-detection--classification)
4. [Fallback Mechanisms](#4-fallback-mechanisms)
5. [Retry Strategies & Comparison](#5-retry-strategies--comparison)
6. [Depth & Loop Prevention](#6-depth--loop-prevention)
7. [Lead-as-CEO Recovery Role](#7-lead-as-ceo-recovery-role)
8. [Logging & Observability](#8-logging--observability)
9. [Integration with Independence & Memory Hygiene](#9-integration-with-independence--memory-hygiene)
10. [Integration with Cost & Hybrid Architecture](#10-integration-with-cost--hybrid-architecture)
11. [Real 2026 Production Examples](#11-real-2026-production-examples)
12. [Common Failure Modes & Anti-Patterns](#12-common-failure-modes--anti-patterns)
13. [Step-by-Step Setup Commands & Full Configs](#13-step-by-step-setup-commands--full-configs)
14. [Practical Recommendations](#14-practical-recommendations)

---

## 1. Overview

OpenClaw's core (v2026.3.x) treats error recovery as a **layered, deterministic
system**: per-lane queue isolation + model/profile failover + tool classification +
community-built file-based escalation for squads. LumaDock production tutorials,
Meta-Intelligence agent-setup guides, GitHub issues/PRs (Feb–Mar 2026), and real
squad blueprints (discussion #16075, 10+-agent deployments) show that one failure
**never** silently kills an entire squad when configured correctly.

Resilience is achieved through three pillars:
- **Private per-agent error handling** (isolated workspaces, no shared error state)
- **Lead-as-CEO escalation** (intelligent routing of failures, not blind retries)
- **Explicit loop guards** (circuit breakers, max-retry caps, stagnation detection)

> **Key principle**: The framework manages concurrency via a lane-based FIFO queue
> (`src/process/command-queue.ts`), ensuring isolated session processing. One agent's
> failure never cascades to another.

---

## 2. Full Error Recovery Architecture

### 2.1 The Five-Layer Recovery Flow

```
Error detected
├── Layer 1: Transient? → Auto-retry (max 3, exp backoff + jitter)
│                 ├─ Success → Resume normal operation
│                 └─ Fail → Layer 2
├── Layer 2: Model failover → Primary → same-provider profiles → cross-provider
│                 ├─ Success → Resume with fallback model
│                 └─ Fail → Layer 3
├── Layer 3: Tool fallback → Degrade gracefully (exec → read → cache)
│                 ├─ Success → Resume with degraded capability
│                 └─ Fail → Layer 4
├── Layer 4: Escalate to Lead → Write plan.md + sessions_send
│                 Lead decides: retry / re-route / grant temp tool / notify human
│                 ├─ Resolved → Resume via Lead instruction
│                 └─ Unresolved → Layer 5
└── Layer 5: HALT → Log to error.md + HITL checkpoint
              Non-retryable or LOOP DETECTED → full stop + human notification
```

### 2.2 Layer Responsibilities

| Layer | Name | Owner | Trigger | Action |
|-------|------|-------|---------|--------|
| **L1** | Auto-Retry | OpenClaw core | HTTP 429, 503, 529, 408, ECONNRESET | Exponential backoff + jitter, max 3 attempts |
| **L2** | Model Failover | OpenClaw core | Model 404, 403, quota exhausted, overloaded | Walk `fallbacks` array cross-provider |
| **L3** | Tool Fallback | RFC #33809 router | Permission denied, sandbox limits, timeout | Deterministic route table + circuit breaker |
| **L4** | Lead Escalation | Squad architecture | All auto-recovery exhausted | Write plan.md + sessions_send to Lead |
| **L5** | Halt + HITL | Squad architecture | Non-retryable, loop detected, stagnation | Append error.md + human notification |

---

## 3. Error Detection & Classification

### 3.1 Core Error Normalization

OpenClaw normalizes all errors via `coerceToFailoverError` in `failover-error.ts`
+ `model-fallback.ts`:

**Failover-worthy (retryable)**:
- `429` — Rate limit (most common in production)
- `503` / `529` — Provider overloaded
- `408` / timeout — Request timeout
- Some `400` errors (malformed but fixable)
- `401` / `403` — Auth errors (profile rotation first, then failover)

**Non-retryable (short-circuit immediately)**:
- Validation errors (schema mismatch, invalid parameters)
- Permission errors (after profile rotation exhausted)
- `500` without retry header
- Tool execution failures (sandbox escape, missing binary)

### 3.2 Recent Fixes (Feb–Mar 2026)

| Issue | Date | Problem | Fix |
|-------|------|---------|-----|
| **#24378** | Feb 23 | Overloaded 503 → no fallback → session hang | Updated `coerceToFailoverError` + UI retry button |
| **#32533** | Mar 3 | Provider overload only rotated profiles, never crossed providers | Cross-provider escalation added |
| **#33809** | Mar 4 | No deterministic tool fallback | Self-healing tool router + circuit breaker merged |
| **#22137** | Feb 20 | Override-model fallback incomplete | Full-chain option added in config |
| **#14687** | Earlier | "Model does not exist" silently halted run | Classified as `not_found`, triggers fallback chain |

---

## 4. Fallback Mechanisms

### 4.1 Model Fallback (Official + Meta-Intelligence)

The `agents.defaults.model.fallbacks` array supports cross-provider chains:

```
Primary (e.g., anthropic/claude-opus-4-6)
  → Same-provider profile rotation (cooldown between profiles)
  → Cross-provider fallback (e.g., google/gemini-3-pro)
  → Local model fallback (e.g., ollama/qwen3:32b)
```

- Periodic primary retry added (issue #6230, closed)
- Post-#32533: cross-provider escalation now works correctly
- Post-#24378: overloaded/529 properly triggers fallback chain

### 4.2 Tool Fallback (RFC #33809, Merged March 2026)

The self-healing tool router provides deterministic fallback routes + circuit
breaker for tool failures:

```json
{
  "toolFallbacks": {
    "exec": {
      "permission_denied": "escalate",
      "timeout": "local_cache"
    },
    "memory_search": {
      "fail": "passthrough"
    }
  },
  "circuitBreaker": {
    "failureThreshold": 0.8,
    "cooldownMs": 300000
  }
}
```

**Fallback hierarchy for tools**:
1. If `exec` fails with permission denied → escalate to Lead
2. If `exec` times out → fall back to cached results
3. If `memory_search` fails → pass through (agent works without memory)
4. Circuit breaker opens at 80% failure rate → 5-minute cooldown

### 4.3 Local → Cloud Escalation

To manage costs, configure agents to use cheap local LLMs first:
- Local models (Ollama/Qwen) are first in the fallback list
- Cloud models only activate on final escalation
- Cached results from `memory_search` + daily journal serve as fallback
  before any re-execution

### 4.4 Fallback Comparison Table

| Strategy | Trigger | Cost Impact | Ideal Use Case |
|----------|---------|-------------|---------------|
| **Native Backoff** | HTTP 429, 503, ETIMEDOUT | Zero (framework handled) | Temporary API outages, rate limits |
| **Model Failover** | Model 404, 403, quota exhausted | Varies (local → cloud) | Provider outages, tiered cost structures |
| **Tool Escalation** | exec denied, sandbox limits | Low (just prompt tokens) | Graceful degradation of capabilities |
| **Lead Escalation** | maxSpawnDepth reached, persistent failure | High (wakes CEO agent) | Complex workflow failures needing re-routing |
| **Local-First Hybrid** | Model chain order | Cheap retries first | Cost runaway prevention |
| **Cached Results** | memory_search before re-exec | Zero | Avoiding redundant API calls |

---

## 5. Retry Strategies & Comparison

### 5.1 Retry Strategy Details

| Strategy | Backoff Pattern | Max Retries | Use Case | Pros | Cons |
|----------|----------------|-------------|----------|------|------|
| **Channel (Telegram/Discord)** | retry_after or exp+jitter | 5 | Inbound messages | Handles flaky polling | Markdown parse errors = no retry |
| **LLM/Provider** | 1s → 5s → 25s → 60s (proxy) | 3–4 | Rate limits, overloads | Transparent to agent | Pre-proxy: provider-wide cooldown |
| **Tool/Exec (RFC router)** | Deterministic + breaker | 1 (then escalate) | Permission/timeout | Prevents bill explosion | Requires RFC config |
| **Squad Escalation** | Manual Lead decision | N/A | Persistent failure | Human intelligence applied | Requires Lead always online |
| **Local-First Hybrid** | Model chain order | Full chain length | Cost runaway prevention | Cheap retries first | Slight quality drop possible |

### 5.2 Backoff Implementation

OpenClaw core provides internal 1–27s backoff (improved in 2026). For production,
use LiteLLM proxy for true exponential backoff:

```
Attempt 1: immediate
Attempt 2: 1s delay
Attempt 3: 5s delay
Attempt 4: 25s delay
Attempt 5: 60s cap
```

Always add jitter (±20%) to prevent thundering herd on rate-limited endpoints.

---

## 6. Depth & Loop Prevention

Unchecked multi-agent loops cause runaway token billing (the dreaded "$750
weekend"). OpenClaw has built-in circuit breakers that must be leveraged.

### 6.1 Built-in Guards

| Guard | Default | Description |
|-------|---------|-------------|
| **maxSpawnDepth** | 1 (max 2) | Prevents sub-agents from infinitely spawning sub-sub-agents |
| **maxConcurrent** | 4 (configurable) | Limits concurrent lane executions per agent |
| **Lane Queue Serialization** | Always on | Prevents duplicate runs and race conditions |
| **timeoutSeconds** | 300 | Hard timeout per agent execution cycle |
| **Circuit Breaker** | 80% failure threshold | Opens circuit for 5-minute cooldown |

### 6.2 The "LOOP DETECTED" Halt

Implement a deterministic check in sub-agent SOUL.md:

```markdown
## Loop Detection Protocol
- If you use the same tool with the exact same parameters 3 times → HALT
- If stagnation detected (>5 minutes with no progress) → HALT
- If recursion pattern detected in log → HALT
- On HALT: append stack trace + context to error.md
- Use agentToAgent to send summary to agent:lead
- Never attempt to recover from a loop yourself
```

### 6.3 Queue Depth Monitoring

Monitor `openclaw_queue_depth`. If the nested lane queue depth sustains above
3–4, your tools are looping. Auto-alerts should fire to the Lead agent:

```yaml
cron:
  - schedule: "*/5 * * * *"
    command: "check queue_depth > 4 → sessions_send lead 'QUEUE ALERT'"
```

---

## 7. Lead-as-CEO Recovery Role

### 7.1 The Lead as Recovery CEO

The Lead agent is not just a router—it is the **CEO of error recovery** for
the entire squad. The Lead doesn't do the work; it manages the recovery state
machine. Its five core recovery responsibilities:

1. **Failure Triage**: Reads structured escalations from `plan.md` or
   `escalations.md`, classifies severity, and decides the recovery path.
   Uses bindings and `sessions_send` for loose, per-failure routing—not
   rigid escalation pipelines.

2. **Intelligent Re-routing**: Re-delegates failed tasks to different agents
   or different models based on the failure type. A rate-limited cloud call
   gets re-routed to a local model; a permission failure gets re-routed to
   an agent with appropriate access.

3. **Autonomous Capability Grants for Recovery**: The Lead can **autonomously
   grant temporary tools, elevated permissions, API keys, and secrets** to
   agents that need them for error recovery:
   - **Low-risk grants** (read-only tools, search access, local file access,
     temporary model override) are issued autonomously with no human approval.
   - **High-risk grants** (exec permissions, write access to shared repos,
     external API keys with spend authority) require **one-time human
     approval** only. Once approved, the Lead can re-issue at will.
   - All grant decisions are logged to MEMORY.md for audit.
   - Grants can be **time-limited** (e.g., "exec for one run only").

4. **Result Synthesis from Recovery**: After a failed-and-recovered task,
   the Lead synthesizes the final output, ensuring the user never sees
   intermediate failure artifacts.

5. **Lesson Extraction**: After every recovery cycle, the Lead distills the
   failure into an actionable lesson in MEMORY.md (e.g., "Lesson: always
   check rate-limit header before exec"). This prevents the same failure
   from recurring across the squad.

### 7.2 Lead Recovery Prompt (SOUL.md / AGENTS.md)

```markdown
You are the CEO Orchestrator. On escalation from any agent:
1. Read error.md + plan.md for the escalating agent
2. Classify: transient (retry once) / capability gap (grant tool) /
   routing error (re-delegate) / persistent (notify human)
3. Decide recovery path:
   - Retry: grant temp tool via config reload, re-run once max
   - Re-route: delegate to different agent with appropriate capability
   - Human notify: channel send + HITL checkpoint with full context
   - Shutdown: teammate_shutdown if agent is in unrecoverable state
4. If granting temp tool: write to shared recovery.md and reload config
5. After resolution: distill lesson to MEMORY.md
6. Never recurse into your own tasks. Never retry more than once.
```

### 7.3 Why Loose Coordination Prevents Cascading Failures

The Lead-as-CEO recovery model deliberately uses **loose coordination**:

- **No rigid escalation DAGs**: Failures are routed based on runtime
  assessment, not pre-built escalation chains. A rate-limit error might
  need model failover; a permission error might need tool grants. The
  Lead decides dynamically.
- **Prevents over-engineering**: Rigid recovery pipelines break when new
  failure modes appear (and they always do). Loose routing adapts naturally.
- **Prevents straight-jacket automations**: Agents are not locked into
  fixed recovery sequences. The Lead can skip layers, combine strategies,
  or invent new recovery paths on the fly.
- **Binding-based dispatch**: Normal routing handles 80%+ of operations.
  The Lead only intervenes when auto-recovery (L1–L3) fails.
- **Serial Lane Queue**: Prevents race conditions during recovery without
  requiring explicit distributed locking.

> **Design principle**: The best error recovery is the one that handles
> the failure you didn't anticipate. Loose coordination gives the Lead
> the flexibility to improvise.

---

## 8. Logging & Observability

### 8.1 error.md (Append-Only Per Workspace)

Community standard for structured error logging:

```markdown
# Error Log (append-only)

## 2026-03-04 12:05 UTC | Agent: researcher | Error: 529 overloaded
Model: anthropic/claude-opus-4-6 → fallback: google/gemini-3-pro
Retries: 2/3 | Action: escalated to Lead
Context hash: abc123

## 2026-03-04 12:17 UTC | Agent: coder | Status: ESCALATED
- **Task:** Fetching latest API docs
- **Error:** HTTP 403 Forbidden on endpoint
- **Action Taken:** Retried twice with exponential backoff. Failed.
- **Handoff:** Alerted Lead for human intervention.
```

### 8.2 Observability Stack

| Tool | Purpose | Metrics |
|------|---------|---------|
| **error.md** | Per-agent structured error log | Error type, retries, escalation status |
| **Daily journals** | `memory/YYYY-MM-DD.md` + auto-flush before compaction | All events including errors |
| **LangFuse / OTEL traces** | Per-agent spans (LumaDock) | Tool latency, token count, retry count |
| **Prometheus** | Gateway-level metrics | `openclaw_queue_depth`, `failure_rate`, `retry_total` |
| **Auto-alerts** | Cron + `sessions_send` | Fire on >3 consecutive errors or queue depth >5 |

---

## 9. Integration with Independence & Memory Hygiene

### 9.1 Error Isolation

Shared error logs cause **context poisoning**—if one agent fails and all agents
read the same log, they all start hallucinating failures.

**Isolation rules**:
- Each agent has its own `agentDir` and session store
- Per-agent `error.md` in private workspace (not shared)
- One agent's loop or failure never pollutes others
- Stateless specialists: `memory: { enabled: false }` for transient agents

### 9.2 Memory Hygiene for Errors

- Every failure is distilled by the Lead into MEMORY.md as a lesson
  (e.g., "Lesson: always check rate-limit header before exec")
- QMD hybrid search (vector + text) indexes error patterns for future recall
- Daily journals capture error context with auto-flush before compaction
- Weekly distillation: Lead consolidates error.md entries into actionable
  rules in global MEMORY.md, then archives raw logs

### 9.3 Coordination During Recovery

Failed handoffs use loose coordination patterns:
- Append to `plan.md` → Lead re-routes via `sessions_spawn`
- Idempotent `status.md` updates prevent duplicate recovery attempts
- No shared mutable state—all coordination through message passing
- `sessions_send` for escalation payloads, not shared file mutations

---

## 10. Integration with Cost & Hybrid Architecture

### 10.1 Cost-Aware Recovery

- **Local models first** in fallback chain: cheap retries before cloud spend
- **Cheap-lane cron/heartbeats**: Don't use expensive models for monitoring
- **maxConcurrent per lane**: Prevents $750-style runaway billing
- **LiteLLM proxy + budget caps**: Hard spend limits at the proxy level
- **Cached results**: `memory_search` before re-execution avoids redundant calls

### 10.2 The $750 Weekend Prevention

The infamous "$750 weekend" happens when:
1. Agent hits a retryable error
2. Retries with same expensive cloud model
3. Error persists → infinite retry loop
4. 19 agents × unlimited retries × cloud pricing = catastrophe

**Fix stack**:
- Lane caps (`maxConcurrent: 4`)
- Circuit breaker (80% failure threshold → 5-min cooldown)
- Local-first fallbacks (cloud is last resort)
- Lead-as-CEO with budget enforcement
- Hard `timeoutSeconds: 300` per execution cycle

### 10.3 Real Cost Numbers

One 19-agent LumaDock squad (K8s HA) survived a 3-day Anthropic outage with
**zero human intervention**—local models + cached results handled everything.
Total cost during outage: ~$0 (all local). Without fallbacks: would have been
$750+ in failed cloud retries.

---

## 11. Real 2026 Production Examples

### 11.1 Callback Storm / Heartbeat Flood Fix

**Problem**: On gateway restart, agents triggered 4× full-context retries via
resume loop (analogous to Discord WS issues #14331/#15762, closed Feb 2026).

**Fix**: Circuit breaker on resume loop + deduplication cache.
- Config: `debounceMs: 1500` + lane isolation
- Result: Zero spurious retries on restart

### 11.2 The 498-Exec Loop

**Problem**: Agent tries to fix a syntax error by running `exec`, fails,
and blindly retries the exact same command infinitely (similar to #14729
patterns + exec hook PRs).

**Fix**: Non-retryable classification + max 1 retry then escalate.
- Router RFC #33809 added deterministic passthrough
- SOUL.md "LOOP DETECTED" circuit breaker halts after 3 identical attempts
- Lead notified via `agentToAgent` for human decision

### 11.3 LumaDock 19-Agent Resilience

Full production recovery flow:

```
Specialist fails
  → writes error.md + plan.md
  → Lead reads (OTEL trace alert)
  → grants temp local model + retries once
  → distills lesson to MEMORY.md
  → closes task
```

Actual config used:
```json
{
  "agents": {
    "defaults": {
      "maxConcurrent": 4,
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallbacks": ["google/gemini-3-pro", "ollama/qwen3:32b"]
      },
      "timeoutSeconds": 300
    }
  }
}
```

### 11.4 The Infinite Reply Loop (Two Agents, One Channel)

**Problem**: Two agents bound to the same Telegram group without explicit
priority trigger an infinite reply loop—each responding to the other's output.

**Fix**: Enforce explicit channel priorities and deterministic `dmScopes`.
Only one agent responds per channel per message. Lead manages binding
conflicts via config.

### 11.5 LumaDock VPS Deployment for Resilience

For 19-agent production setups:
- Deploy using PM2 or Docker on 4GB/6GB RAM LumaDock VPS
- Separate SQLite databases for session persistence per agent
- Avoids concurrent file-write corruption on heavy loads
- Bind gateway to `127.0.0.1` + SSH tunnel / Tailscale (never expose
  port 18789 directly—compromised tool execution → host takeover)

---

## 12. Common Failure Modes & Anti-Patterns

### 12.1 Failure Mode Table

| Failure Mode | Symptom | Root Cause | Fix |
|-------------|---------|-----------|-----|
| **Infinite Retry = Bill Explosion** | $750+ weekend, token burn | All errors treated as transient | Non-retryable tags + circuit breakers + max-retry caps |
| **Silent Death** | Agent stops responding, no notification | No escalation path, 401 fails fast | Mandatory write to plan.md + Lead monitoring |
| **Shared Error Log = Context Poisoning** | All agents hallucinate failures | Shared error.md across agents | Per-agent error.md + Lead-only distillation |
| **Callback Storm** | 4× retries on restart | Resume loop without deduplication | debounceMs + circuit breaker on resume |
| **498-Exec Loop** | Same exec retried forever | No loop detection, no escalation | SOUL.md loop guard + max 1 retry then escalate |
| **Infinite Reply Loop** | Two agents loop on same channel | No channel priority, no dmScope | Explicit priorities + deterministic dmScopes |
| **Stateful Specialist Bloat** | Memory grows, context explodes | Specialist retains all error context | Stateless specialists + Lead-only MEMORY.md |
| **Over-Parallelism** | Lane starvation, slow recovery | Too many concurrent agents | maxConcurrent caps per lane |

### 12.2 Anti-Pattern: "Keep Trying Until You Succeed"

> Never tell an LLM to "keep trying until you succeed." It will burn your
> API budget in an hour. — Gemini source (validated in production)

Always hardcode retry limits. The community standard is **max 3 retries**
with exponential backoff, then escalate. Never unlimited.

### 12.3 Pros/Cons of Full Recovery Architecture

**Pros**:
- Zero silent squad deaths (every failure is logged and escalated)
- Sub-$5/day for 10-agent squads (local-first fallbacks)
- Automatic lesson learning (Lead distills failures to MEMORY.md)
- Self-healing after provider outages (local models bridge the gap)

**Cons / Risks**:
- File-based coordination has race risks (mitigated by append-only +
  idempotency + lane serialization)
- Requires disciplined SOUL.md rules across all agents
- Lead must be available for L4 escalation (use heartbeat monitoring)
- Initial setup investment (SOUL.md protocols + error.md templates +
  observability stack)

---

## 13. Step-by-Step Setup Commands & Full Configs

### 13.1 SOUL.md Error Protocol (Sub-Agent)

Edit `~/.openclaw/agents/<agent>/agent.md` or equivalent:

```markdown
## Error Recovery Protocol (v2026.3)
On any tool/model error:
1. Analyze the error message. DO NOT blindly retry.
2. Retry up to 3 times with exponential backoff (log each attempt).
3. If persistent: append structured block to error.md.
4. Write to shared plan.md: "ESCALATE: [agent] [error_type] [context_hash]"
5. If LOOP DETECTED (same tool + same params 3×, or stagnation >5min):
   HALT immediately and notify Lead.
6. Never pollute other agents' memory with your error context.
```

### 13.2 Lead Recovery Skill Setup

```bash
# Add recovery tools to Lead agent
openclaw agents set-identity lead \
  --add-tools "teammate_shutdown,config_reload"
```

### 13.3 error.md Template (Create in Each Agent Workspace)

```markdown
# Error Log (append-only)
## Timestamp | Agent | Type | Retries | Escalated
```

### 13.4 Cron for Log Review + Alerts

Add to Lead AGENTS.md or system cron:

```yaml
cron:
  - schedule: "*/15 * * * *"
    command: "memory_search error.md + distill_to MEMORY.md + alert_if >3"
```

### 13.5 Full Production Config (`openclaw.json`)

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-6",
        "fallbacks": [
          "google/gemini-3-pro",
          "ollama/qwen3:32b"
        ]
      },
      "maxConcurrent": 4,
      "timeoutSeconds": 300,
      "memory": { "enabled": true, "flush": true }
    }
  },
  "channels": {
    "telegram": {
      "retry": {
        "attempts": 5,
        "minDelayMs": 1000
      }
    }
  },
  "toolFallbacks": {
    "exec": {
      "permission_denied": "escalate",
      "timeout": "local_cache"
    },
    "memory_search": {
      "fail": "passthrough"
    }
  },
  "circuitBreaker": {
    "failureThreshold": 0.8,
    "cooldownMs": 300000
  },
  "laneQueue": {
    "maxConcurrent": 4,
    "maxSpawnDepth": 1
  },
  "tools": {
    "agentToAgent": {
      "enabled": true,
      "allow": ["lead", "researcher", "coder", "writer", "analyst"]
    }
  }
}
```

### 13.6 LiteLLM Proxy for Production Backoff

For true exponential backoff with jitter across all providers:

```bash
# Install LiteLLM proxy
pip install litellm[proxy]

# Configure with budget caps
litellm --config litellm_config.yaml --port 4000

# Point OpenClaw to proxy
openclaw config set models.providers.proxy.baseUrl "http://127.0.0.1:4000"
```

---

## 14. Practical Recommendations

### Getting Started (March 2026)

1. **Always cross-provider fallbacks**: Never rely on a single provider.
   Chain: primary cloud → backup cloud → local Ollama. Use LiteLLM proxy
   for unified management.

2. **Stateless specialists + Lead-only MEMORY.md**: Specialists handle
   their own retries (L1–L3) and escalate to Lead (L4). Only the Lead
   writes lessons to MEMORY.md.

3. **SOUL.md error protocol in every agent**: The loop detection and
   escalation protocol is non-negotiable. Copy the template from §13.1.

4. **error.md template in every workspace**: Structured, append-only,
   per-agent. Never shared across agents.

5. **Monitor queue depth + failure rate**: Set up alerts for queue depth >4
   and >3 consecutive errors. Use Prometheus or simple cron checks.

### Scaling to 10+ Agents

6. **Custom lanes per squad member**: Isolate execution lanes to prevent
   one agent's failure from starving others.

7. **LumaDock VPS for production**: PM2 or Docker, separate SQLite per
   agent, gateway bound to localhost + Tailscale.

8. **Weekly cron distill + quarterly permission audit**: Lead reviews all
   error.md entries weekly, distills lessons. Quarterly: review all tool
   grants and permissions.

### For Maximum Resilience

9. **Circuit breakers on everything**: Provider-level, tool-level, and
   session-level circuit breakers prevent cascade failures.

10. **Local-first fallbacks**: Every agent should be able to function
    (degraded) on local models alone. Cloud is for quality, not necessity.

11. **Test your fallback chains**: Simulate provider outages by stopping
    Ollama or blocking cloud endpoints. Verify the full L1→L5 flow works.

12. **Let the Lead be CEO of recovery**: The Lead's autonomous grants,
    dynamic re-routing, and lesson extraction are what make squad-level
    resilience work. Without a strong Lead, you have individual agent
    resilience but no squad resilience.

---

## Summary

The 2026 production standard for OpenClaw error recovery rests on five layers:

1. **Auto-retry** (L1): Exponential backoff + jitter for transient errors
2. **Model failover** (L2): Cross-provider fallback chains, local-first
3. **Tool fallback** (L3): RFC #33809 deterministic router + circuit breaker
4. **Lead escalation** (L4): CEO decides retry / re-route / grant / notify
5. **Halt + HITL** (L5): Hard stop for loops and non-retryable failures

The Lead-as-CEO owns recovery orchestration through loose coordination:
decomposing failures, routing recovery via `sessions_send`, autonomously
granting temporary capabilities, synthesizing results, and distilling
lessons. No rigid escalation pipelines—the Lead improvises based on the
specific failure, preventing over-engineering and straight-jacket automations.

Result: **zero silent squad deaths**, sub-$5/day for 10-agent squads,
automatic lesson learning, and self-healing through provider outages.

---

*Master research file. Synthesized from Grok (primary) + Gemini sources.*
*GitHub issues validated: #33809, #32533, #24378, #22137, #14687, #6230.*
*Strengthened: Lead-as-CEO recovery grants, loose coordination rationale.*
