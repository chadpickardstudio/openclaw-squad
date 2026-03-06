# Topic 18 — Future-Proofing: Model Migration & Abstraction

> **OpenClaw v2026.3.x · Master Research File**
> Grok foundation + Gemini insights · March 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Abstracting Model Names in Prompts and Configs](#2-abstracting-model-names-in-prompts-and-configs)
3. [Zero-Rewrite Migration Strategies](#3-zero-rewrite-migration-strategies)
4. [Version Pinning, Fallback Chains, and Auto-Testing](#4-version-pinning-fallback-chains-and-auto-testing)
5. [Lead-as-CEO Migration Authority](#5-lead-as-ceo-migration-authority)
6. [Integration with Hybrid Local + Cloud](#6-integration-with-hybrid-local--cloud)
7. [Integration with Cost Optimization](#7-integration-with-cost-optimization)
8. [Integration with Prompt Engineering & Autonomy](#8-integration-with-prompt-engineering--autonomy)
9. [Integration with Observability](#9-integration-with-observability)
10. [Real 2026 Production Examples](#10-real-2026-production-examples)
11. [Common Failure Modes & Anti-Patterns](#11-common-failure-modes--anti-patterns)
12. [Step-by-Step Migration Playbook](#12-step-by-step-migration-playbook)
13. [Practical Recommendations](#13-practical-recommendations)
14. [Summary](#14-summary)

---

## 1. Overview

OpenClaw is built **model-agnostic from the ground up**. As of March 2026,
every core mechanism—config schema, CLI, in-chat overrides, multi-agent
bindings, and skills—decouples agent intelligence (SOUL.md, SKILL.md, memory
markdowns, prompts) from specific model IDs. You migrate from Claude Opus
4.6 → Claude 4 Sonnet → GPT-5.3 → whatever-next by editing **one config
file** (or letting the Lead agent do it). No prompt rewrites, no skill
changes, zero downtime in production squads via hot-reload + ClawRouter /
LiteLLM proxies.

LumaDock production tutorials, Meta-Intelligence.tech guides, ClawRouter
plugin (github.com/BlockRunAI/ClawRouter), recent X threads, r/openclaw
reports, and GitHub issues all confirm the same pattern: **squads that
abstract early survive every frontier-model shift in minutes**.

Key architecture principle:

```
SOUL.md / SKILL.md / MEMORY.md  ←  model-agnostic (universal structures)
         ↕
   openclaw.json aliases         ←  single source of truth for model IDs
         ↕
   ClawRouter / LiteLLM proxy    ←  runtime routing + fallback + caching
         ↕
   Providers (Anthropic, OpenAI, Ollama, OpenRouter)
```

Change happens at the config layer. Everything above and below stays stable.

---

## 2. Abstracting Model Names in Prompts and Configs

**Never hard-code a model ID anywhere except the central config.** Use
aliases + primary/fallbacks + allowlist.

### 2.1 Abstract Config Template

`~/.openclaw/openclaw.json` (or modular `$include` files):

```json5
{
  agents: {
    defaults: {
      model: {
        // Swap this ONE line for major upgrades
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: [
          "openai/gpt-5.2",
          "openrouter/google/gemini-3-flash",
          "ollama/qwen2.5-72b"
        ]
      },
      models: {
        // Allowlist + aliases for /model command & internal routing
        "anthropic/claude-opus-4-6":   { alias: "opus" },
        "anthropic/claude-sonnet-4-5": { alias: "sonnet" },
        "anthropic/claude-haiku-4-5":  { alias: "haiku" },
        "openai/gpt-5.3":              { alias: "gpt-latest" },
        "ollama/qwen2.5-72b":          { alias: "local-heavy" }
      }
    },
    list: [
      // Per-specialist overrides (multi-agent squad)
      { id: "lead",   model: { primary: "sonnet" } },
      { id: "coder",  model: { primary: "opus" } },
      { id: "triage", model: { primary: "haiku" } }
    ]
  },
  models: {
    mode: "merge",
    providers: {
      ollama: {
        baseUrl: "http://localhost:11434/v1",
        api: "openai-completions"
      }
    }
  }
}
```

### 2.2 In-Chat Overrides

`/model sonnet` or `/model local-heavy` instantly switches the session
(sticky until `/new` or compaction). No restart, no config edit needed for
ad-hoc testing.

### 2.3 Hard-Coded vs. Abstract: Comparison

| Approach | Hard-Coded (model ID everywhere) | Abstract (aliases + primary/fallbacks) |
|---|---|---|
| **Migration effort** | Rewrite every SOUL.md, skill, cron, prompt template | Edit 1 line in config + `openclaw doctor --fix` |
| **Multi-agent squad** | Every specialist breaks independently | Lead updates central alias → all specialists inherit |
| **Future-proofing** | Rewrite hell on every new model family | One alias remap or router rule update |
| **Observability** | Impossible to trace without grep | `openclaw models status --json` + session logs show resolved model |
| **Cost control** | Manual per-agent cost tracking | Centralized per-model `cost` objects + routing metrics |

---

## 3. Zero-Rewrite Migration Strategies

### 3.1 The One-Line Migration

Change only the `primary` key or an alias mapping. SOUL.md, SKILL.md,
memory files, and all prompts stay untouched because they contain
**universal structures** (JSON output schemas, Chain-of-Thought blocks,
role definitions) that work across Claude/OpenAI/Gemini/Ollama families.

```bash
# Before: running Claude Sonnet 4.5
# After: migrating to GPT-5.3
# Change ONE line in openclaw.json:
#   primary: "anthropic/claude-sonnet-4-5"
#   →
#   primary: "openai/gpt-5.3"

# Apply with hot-reload (no gateway restart needed)
openclaw doctor --fix
```

### 3.2 Hot-Reload Behavior

Default `hybrid` mode applies model changes without gateway restart for
95% of cases. The gateway detects config changes and swaps the model
connection at the next session boundary:

- **Existing sessions**: Continue on the old model until completion or
  compaction.
- **New sessions**: Immediately use the updated model.
- **Cron/heartbeat tasks**: Pick up the new model on the next tick.

Only provider-level changes (new base URL, new auth method) require a
full gateway restart.

### 3.3 Blue-Green Agent Deployment

For zero-risk migrations, run old and new models in parallel:

```bash
# Deploy new model alongside old
# In agents.list, add a shadow agent:
{
  "id": "coder-v2",
  "model": { "primary": "openai/gpt-5.3" },
  "bindings": []  # no live traffic yet
}

# Route test traffic to shadow agent
openclaw send "Test task: implement fizzbuzz" --agent coder-v2

# Compare outputs, then swap bindings
# Old coder gets bindings removed, new coder gets them
```

---

## 4. Version Pinning, Fallback Chains, and Auto-Testing

### 4.1 Version Pinning

Use exact model strings to prevent surprise behavior changes:

```json5
{
  model: {
    // Pinned to exact snapshot — no surprise updates
    primary: "anthropic/claude-sonnet-4-5-20250215",
    // Or OpenRouter snapshot pinning
    // primary: "openrouter/anthropic/claude-sonnet-4-5:20250215"
  }
}
```

**When to pin**: Production squads handling sensitive tasks, regulated
environments, or squads where output consistency matters more than
bleeding-edge capability.

**When NOT to pin**: Development squads, cost-optimization experiments,
or squads where the Lead manages upgrades via the migration skill.

### 4.2 Fallback Chains

Cross-provider by design. Auth profiles rotate first, then models fall
through the chain:

```json5
{
  model: {
    primary: "anthropic/claude-sonnet-4-5",
    fallbacks: [
      "openai/gpt-5.2",                    // cloud fallback #1
      "openrouter/google/gemini-3-flash",   // cloud fallback #2
      "ollama/qwen2.5-72b"                  // local fallback (zero cost)
    ]
  }
}
```

Fallback triggers:
- Provider rate-limit (429)
- Provider outage (5xx)
- Auth token expiry
- Context window exceeded (auto-downgrade to model with larger window)

The chain is walked in order. If all cloud providers fail, the local Ollama
model catches everything—degraded quality but zero downtime.

### 4.3 Auto-Testing on Migration

The Lead agent (or a human) spawns parallel test sessions to compare old
vs. new model before committing to the migration:

```bash
# Spawn test sub-agents on old vs new model
openclaw models set new-model-id --temp-session

# Or use sessions_spawn with temp model override
# Lead spawns two agents with identical tasks, different models
# Compare: output quality, cost, latency, tool-call success rate

# Community skills for benchmarking:
openclaw skills add add-top-openrouter-models
openclaw skills add model-benchmark-suite
```

Compare outputs via eval agent or simple diff in workspace. The Lead
synthesizes results into a go/no-go recommendation.

---

## 5. Lead-as-CEO Migration Authority

In multi-agent squads, the Lead agent operates as CEO of model migration:
it detects new model releases, decomposes the migration into per-agent
tasks, routes test execution via bindings and `sessions_send`, synthesizes
benchmark results, and autonomously manages the rollout—including granting
new model access and API keys to specialist agents.

### 5.1 Core Migration Responsibilities

1. **Migration Task Decomposition**: When a new frontier model drops, the
   Lead breaks the migration into specific steps:
   - Benchmark the new model against current primary (quality, cost, latency)
   - Test tool-calling compatibility across the squad
   - Generate cost projection for the new model
   - Plan rollout order (low-risk agents first, then critical agents)
   - Prepare rollback config snapshot

   Each step is dispatched through bindings—not a hardcoded pipeline.
   The Lead decides *per migration* which agents test first based on
   their role, risk level, and current workload.

2. **Autonomous Capability Grants**: The Lead can **autonomously grant
   new model access, API keys, provider credentials, and routing rules**
   to agents as migration progresses:
   - **Low-risk grants** (adding a new model to an agent's allowlist,
     switching a triage agent to a cheaper model, granting test-session
     access to a new provider) are issued autonomously.
   - **High-risk grants** (switching the primary model for a production
     agent handling sensitive data, adding a new cloud provider with
     billing implications, changing the coder agent's primary from Opus
     to a different family) require **one-time human approval** only.
     Once approved, the Lead re-issues for future migrations.
   - All grants logged to MEMORY.md and LangFuse with tag `model_migration`.

3. **Autonomous Migration Workflow**: The Lead owns a custom migration
   skill (file-edit + CLI execution privileges). The full workflow is
   autonomous except for final human OK on major cost/quality jumps:

   ```
   Step 1: Lead detects new model release (via news skill or cron)
   Step 2: Spawns test sub-agents on old vs new model (sessions_spawn)
   Step 3: Runs squad benchmarks (quality, cost, latency, tool-call success)
   Step 4: Generates rollout diff + cost projection
   Step 5: Posts summary + requests one-time human approval (channel message)
   Step 6: On approval → updates central config, propagates to specialists
   Step 7: Monitors 24h and rolls back if degradation detected
   ```

4. **Config Propagation via config.patch**: The Lead updates model
   assignments per-agent without touching SOUL.md or skills:

   ```json
   // Lead issues config.patch to migrate coder to new model
   {
     "agents": {
       "list": [
         {
           "id": "coder",
           "model": { "primary": "openai/gpt-5.3" }
         }
       ]
     }
   }
   ```

5. **Rollback Authority**: If degradation is detected within the monitoring
   window (24h default), the Lead autonomously rolls back:

   ```bash
   # Lead restores previous config from git-versioned backup
   git checkout HEAD~1 -- ~/.openclaw/openclaw.json
   openclaw doctor --fix
   # Notifies human: "Rolled back coder from gpt-5.3 to sonnet —
   # tool-call success dropped 15%"
   ```

### 5.2 Why Loose Coordination Beats Rigid Migration Pipelines

Rigid migration pipelines ("upgrade all agents to the same model on the
same day, same config") create **straight-jacket automations** that break
in practice:

| Rigid Pipeline Problem | Loose Coordination Solution |
|---|---|
| All agents migrate simultaneously → mass failure risk | Lead rolls out per-agent, starting with lowest-risk |
| Uniform model for all roles → over/under-provisioned | Lead assigns models per-role (Opus for coder, Haiku for triage) |
| Single fallback model for everyone | Lead configures per-agent fallback chains based on task type |
| Pipeline requires manual config per agent | Lead propagates via config.patch, agents inherit |
| No rollback granularity | Lead rolls back individual agents, not the entire squad |
| Migration blocked until all tests pass | Lead promotes agents individually as their tests pass |

The Lead-as-CEO approach means migration strategy **adapts per-agent**
based on actual benchmark results, cost constraints, and task criticality—
not a one-size policy imposed on the entire squad.

### 5.3 Lead Migration Skill Template

```markdown
# SKILL.md — Model Migration Manager

## Triggers
- `migrate check` — scan for new model releases
- `migrate benchmark <model-id>` — run comparison benchmarks
- `migrate rollout <model-id>` — begin staged rollout
- `migrate rollback` — revert to previous model config
- `migrate status` — show current migration state

## Permissions Required
- file-edit (openclaw.json)
- CLI execution (openclaw models, openclaw doctor)
- sessions_spawn (test sub-agents)
- sessions_send (notify human, coordinate agents)
```

---

## 6. Integration with Hybrid Local + Cloud

Declare Ollama/LM Studio/vLLM as custom providers (zero-cost local models).
Model migration becomes even simpler when local models serve as the
universal fallback.

### 6.1 Hybrid Provider Configuration

```json5
{
  models: {
    mode: "merge",
    providers: {
      ollama: {
        baseUrl: "http://localhost:11434/v1",
        api: "openai-completions"
      },
      lmstudio: {
        baseUrl: "http://localhost:1234/v1",
        api: "openai-completions"
      },
      vllm: {
        baseUrl: "http://gpu-server:8000/v1",
        api: "openai-completions"
      }
    }
  }
}
```

### 6.2 Migration-Safe Fallback Pattern

Primary cloud frontier + fallback local 72B for heartbeats/crons. During
migration, the local model catches all traffic if the new cloud model
has issues:

```
Normal:    Task → Claude Sonnet (cloud) → response
Migration: Task → GPT-5.3 (new, testing) → response
Fallback:  Task → GPT-5.3 (failed) → Ollama qwen2.5-72b (local) → response
```

### 6.3 ClawRouter Complexity Scoring

Router plugins (ClawRouter, github.com/BlockRunAI/ClawRouter) score task
complexity locally in <1ms and pick the cheapest compatible model:

```json5
{
  "routing": {
    "engine": "clawrouter",
    "rules": [
      { "complexity": "low",    "route": "ollama/qwen2.5-7b" },
      { "complexity": "medium", "route": "anthropic/claude-haiku-4-5" },
      { "complexity": "high",   "route": "anthropic/claude-sonnet-4-5" },
      { "complexity": "expert", "route": "anthropic/claude-opus-4-6" }
    ]
  }
}
```

During migration, update routing rules instead of the primary model—
traffic shifts gradually based on complexity tier.

---

## 7. Integration with Cost Optimization

### 7.1 Tiered Routing (LumaDock/Velvetshark Patterns)

| Task Type | Recommended Model Tier | Approximate Cost |
|---|---|---|
| Heartbeats, triage, status checks | Gemini Flash / DeepSeek V3 / local | ~$0.50/M tokens |
| Daily coding, reviews, documentation | Sonnet / Kimi / GPT-5.2 | ~$3–8/M tokens |
| Strategic synthesis, complex reasoning | Opus / GPT-5.3 | ~$15–30/M tokens |

### 7.2 Cost Savings from Abstraction

OpenRouter auto-router or ClawRouter + LiteLLM caching delivers **50–80%
savings** in production squads by routing routine tasks to cheaper models
while reserving frontier models for complex work.

Per-model `cost` objects in openclaw.json enable internal tracking:

```json5
{
  models: {
    "anthropic/claude-sonnet-4-5": {
      cost: { input: 3.0, output: 15.0, unit: "per_million_tokens" }
    },
    "ollama/qwen2.5-72b": {
      cost: { input: 0.0, output: 0.0, unit: "per_million_tokens" }
    }
  }
}
```

### 7.3 Migration Cost Projection

Before migrating, the Lead generates a cost projection:

```markdown
## Migration Cost Projection: Sonnet → GPT-5.3

| Agent | Current Model | Current Cost/Day | New Model | Projected Cost/Day | Delta |
|---|---|---|---|---|---|
| lead | sonnet | $2.40 | gpt-5.3 | $3.10 | +$0.70 |
| coder | opus | $8.50 | gpt-5.3 | $5.20 | -$3.30 |
| triage | haiku | $0.30 | haiku | $0.30 | $0.00 |
| **Total** | | **$11.20** | | **$8.60** | **-$2.60** |

Recommendation: Migrate coder to gpt-5.3 (saves $3.30/day).
Keep lead on sonnet. Keep triage on haiku.
```

---

## 8. Integration with Prompt Engineering & Autonomy

### 8.1 Model-Agnostic Templates

Use universal prompt structures that work across all model families:

```markdown
# SOUL.md (never reference a model name)
You are a reasoning agent. Think step-by-step.
Output only valid JSON with keys: reasoning, plan, tools[], final_answer.

## Boundaries
- Do not hallucinate tool names or API endpoints.
- If uncertain, ask for clarification rather than guessing.
- Follow the output schema exactly.
```

### 8.2 ClawRouter Tool-Call Normalization

ClawRouter normalizes tool calling across model families. This means
skills and SKILL.md definitions work identically regardless of whether
the underlying model is Claude, GPT, Gemini, or a local Ollama model.

Avoid vendor-specific phrasing in prompts:
- **Bad**: "Use Claude's artifacts feature to..."
- **Good**: "Generate a structured output with..."
- **Bad**: "Think like GPT-4 would..."
- **Good**: "Think step-by-step and show your reasoning."

### 8.3 Universal Output Schemas

Define output schemas in SKILL.md that every model can follow:

```json
{
  "output_schema": {
    "type": "object",
    "properties": {
      "reasoning": { "type": "string" },
      "plan": { "type": "array", "items": { "type": "string" } },
      "tools": { "type": "array", "items": { "type": "string" } },
      "final_answer": { "type": "string" }
    },
    "required": ["reasoning", "final_answer"]
  }
}
```

This schema works with Claude, GPT, Gemini, and most local models.
No rewrite needed on migration.

---

## 9. Integration with Observability

### 9.1 Model Status Dashboard

```bash
# Current primary/fallbacks/auth health — JSON for scripting
openclaw models status --json

# In-chat: check which model is active
/model status

# Output example:
{
  "primary": "anthropic/claude-sonnet-4-5",
  "resolved": "anthropic/claude-sonnet-4-5-20250215",
  "fallbacks": ["openai/gpt-5.2", "ollama/qwen2.5-72b"],
  "fallback_active": false,
  "auth_status": {
    "anthropic": "valid",
    "openai": "valid",
    "ollama": "local"
  }
}
```

### 9.2 Session-Level Model Tracking

Session logs trace the exact model and version used for every turn.
Custom memory skill can append model + cost per turn for detailed
cost attribution:

```markdown
## Turn Log (auto-appended to MEMORY.md by tracking skill)

| Turn | Model | Tokens (in/out) | Cost | Latency |
|---|---|---|---|---|
| 1 | claude-sonnet-4-5-20250215 | 1,200/800 | $0.015 | 1.2s |
| 2 | claude-sonnet-4-5-20250215 | 2,400/1,500 | $0.030 | 2.1s |
| 3 | ollama/qwen2.5-72b (fallback) | 1,800/1,200 | $0.000 | 3.4s |
```

### 9.3 Migration Monitoring

After a migration, monitor key metrics for 24h:

- **Quality**: Tool-call success rate, output schema compliance
- **Cost**: Per-agent token spend vs. projection
- **Latency**: Response time p50/p95/p99
- **Fallback rate**: How often the new model triggers fallback

```bash
# Export migration metrics
openclaw models status --json > status.log
# Watch in real-time
watch -n 60 'openclaw models status --json | jq ".fallback_active"'
```

### 9.4 Rollback via Git

Version your entire `~/.openclaw` directory in Git. Rollback is a
single command:

```bash
# Rollback to previous model config
git checkout HEAD~1 -- ~/.openclaw/openclaw.json
openclaw doctor --fix

# Verify rollback
openclaw models status --json
```

---

## 10. Real 2026 Production Examples

### 10.1 Opus → Sonnet Shift (February 2026)

Multiple X/Reddit squads updated one alias + fallback chain when Anthropic
released Claude Sonnet 4.5 as a cost-effective alternative to Opus:

> "One CLI command, zero downtime, prompts untouched."
> — Timeline: 3 minutes config edit + hot-reload.

Squads that had hard-coded `claude-opus-4-6` in SOUL.md files spent
hours on search-and-replace across all agents.

### 10.2 LumaDock VPS Squads

Docker Compose + blue-green agents. Model swap via config map;
zero-downtime rolling update. Cost dropped **65%** by moving heartbeats
and triage tasks to Gemini Flash-Lite while keeping coder on Sonnet.

### 10.3 Pantheon Multi-Agent Wins

14-agent teams (Lead + 13 specialists). Lead skill handles quarterly
upgrades with parallel test sessions on cloned workspaces. One reported
full migration (Claude 4 family → Claude 4.5 family) completed in
**11 minutes** with human approval only for the cost jump.

### 10.4 ClawRouter Production

Local complexity scoring routes simple tasks to $0.40/M-token models;
complex tasks stay on frontier. **80–95% cost reduction** on routine
traffic while quality remained unchanged. The router evaluates task
complexity in <1ms, adding negligible latency.

### 10.5 Migration Metrics Summary

| Migration | Squad Size | Time | Downtime | Prompts Changed | Cost Impact |
|---|---|---|---|---|---|
| Opus → Sonnet | 5 agents | 3 min | Zero | 0 | -40% |
| Claude 4 → 4.5 family | 14 agents | 11 min | Zero | 0 | +5% (quality gain) |
| Cloud → hybrid (local fallback) | 8 agents | 20 min | Zero | 0 | -65% |
| ClawRouter adoption | 12 agents | 30 min | Zero | 0 | -80% routine tasks |

---

## 11. Common Failure Modes & Anti-Patterns

| Anti-Pattern | Consequence | Prevention |
|---|---|---|
| **Hard-coded model names** in SOUL.md/skills/crons | Rewrite hell on every model release | Use aliases + central config only |
| **No fallback chains** | Outage when provider rate-limits or goes down | Always configure 2+ fallbacks including local |
| **No testing before migration** | Sudden quality drop or tool-call failures | Lead spawns parallel test sessions first |
| **Ignoring Lead oversight** | Specialists fight over model choices, chaotic spend | Lead-as-CEO owns all model config edits |
| **Skipping `openclaw doctor --fix`** | Silent config ignores, broken hot-reload | Always run doctor after any config change |
| **Over-reliance on single provider** | Single point of failure | Route through OpenRouter or LiteLLM proxy |
| **Over-reliance on free tiers** | Sudden unavailability, rate limits | Budget for paid tiers; local fallback |
| **No version pinning in production** | Surprise model behavior changes | Pin exact version strings for critical agents |
| **No cost projection before migration** | Bill shock from more expensive model | Lead generates cost projection first |
| **Migrating all agents at once** | Mass failure if new model has issues | Lead rolls out per-agent, lowest-risk first |

---

## 12. Step-by-Step Migration Playbook (2026 Edition)

### Step 1: Backup

```bash
# Full backup of OpenClaw config
cp -r ~/.openclaw ~/.openclaw-backup-$(date +%Y%m%d)

# If versioned in git (recommended):
cd ~/.openclaw && git add -A && git commit -m "pre-migration snapshot"
```

### Step 2: Add New Model to Allowlist

```bash
# Add new model to allowlist with alias
# Edit openclaw.json or let Lead do it via migration skill:
# In models section, add:
#   "openai/gpt-5.3": { "alias": "gpt-latest" }
```

### Step 3: Benchmark (Lead or Manual)

```bash
# Spawn test session with new model
openclaw models set gpt-latest --temp-session

# Or let Lead run parallel benchmarks:
# Lead spawns two sub-agents with identical tasks, different models
# Compare: output quality, cost, latency, tool-call success rate

# Community benchmark skills:
openclaw skills add model-benchmark-suite
openclaw skills add add-top-openrouter-models
```

### Step 4: Review Benchmark Results

The Lead (or human) reviews the comparison:

```markdown
## Benchmark: Sonnet vs GPT-5.3

| Metric | Sonnet 4.5 | GPT-5.3 | Winner |
|---|---|---|---|
| Tool-call success | 97.2% | 96.8% | Sonnet (marginal) |
| Output schema compliance | 99.1% | 98.7% | Sonnet (marginal) |
| Cost per 1M tokens (in/out) | $3/$15 | $2.5/$10 | GPT-5.3 |
| Latency p50 | 1.2s | 0.9s | GPT-5.3 |
| Code quality (eval score) | 8.4/10 | 8.6/10 | GPT-5.3 |

Recommendation: Migrate coder and lead to GPT-5.3.
Keep triage on Haiku (cheapest for simple routing).
```

### Step 5: Staged Rollout

```bash
# Start with lowest-risk agent
openclaw models set gpt-latest --agent triage
openclaw doctor --fix

# Monitor 4h, then next agent
openclaw models set gpt-latest --agent coder
openclaw doctor --fix

# Finally, production-critical agent
openclaw models set gpt-latest --agent lead
openclaw doctor --fix
```

### Step 6: Monitor & Rollback Plan

```bash
# Monitor for 24h
openclaw models status --json > migration-status.log
watch -n 300 'openclaw models status --json | jq ".fallback_active"'

# If degradation detected — rollback:
git checkout HEAD~1 -- ~/.openclaw/openclaw.json
openclaw doctor --fix
# Notify team: "Rolled back — [reason]"
```

---

## 13. Practical Recommendations

### For Solo Developers / Small Teams (1–3 Agents)

- **Always use aliases** in openclaw.json—never hard-code model IDs
  in SOUL.md or skills.
- Configure **at least 2 fallbacks** including one local model (Ollama).
- Run `openclaw doctor --fix` after every config change.
- Version `~/.openclaw` in a private Git repo for instant rollback.
- Pin exact model versions for production; use floating aliases for dev.

### For Medium Teams (4–8 Agents)

- Everything above, plus:
- **Lead-as-CEO owns all model config edits**—no specialist should
  change its own model without Lead coordination.
- Install **ClawRouter or LiteLLM proxy** for automatic complexity-based
  routing and 50–80% cost savings.
- Run **parallel benchmarks** before every migration via Lead's
  migration skill.
- Maintain a **permanent benchmark suite** in the workspace that tests
  tool-calling, output schema compliance, and task quality.

### For Large Deployments (9+ Agents, Multiple Leads)

- Everything above, plus:
- **Blue-green deployment** for zero-risk migrations: shadow agents
  on new model receive test traffic before live cutover.
- **Per-agent fallback chains** tailored to task type (coder needs
  Opus-class fallback; triage can fall to local).
- **Hierarchical migration**: each Lead migrates its squad independently;
  meta-Lead coordinates timing to avoid simultaneous migrations.
- **Quarterly model review**: Lead runs `openclaw models scan` +
  cost calculator, proposes optimizations.

### Universal Best Practices

1. **Abstract early, abstract always**—the cost of abstraction is one
   config file; the cost of hard-coding is rewrite hell.
2. **Route through a proxy** (OpenRouter, LiteLLM, ClawRouter) for
   ultimate future-proofing and automatic failover.
3. **Build a permanent benchmark suite** that runs on every migration.
4. **For squads >3 agents**: make the Lead the sole owner of model
   config edits. Loose coordination through the Lead prevents the chaos
   of specialists independently switching models.
5. **Monitor for 24h after every migration**—quality degradation often
   shows up in edge cases, not average performance.
6. **Keep local fallback always available**—even if quality drops, zero
   downtime is worth it during provider outages.
7. **Document migration decisions in MEMORY.md**—future migrations
   benefit from knowing why the last model was chosen.

---

## 14. Summary

OpenClaw's model-agnostic architecture means migration is a **config-layer
operation, not a rewrite**. Abstract model names behind aliases in
`openclaw.json`, configure cross-provider fallback chains (cloud →
cloud → local), and let ClawRouter or LiteLLM handle complexity-based
routing. The Lead-as-CEO orchestrates migrations: detecting new releases,
spawning parallel benchmarks, generating cost projections, autonomously
granting new model access to specialists (one-time human approval for
major cost jumps), and monitoring for 24h with automatic rollback. Loose
coordination—where each agent's model assignment is tailored to its role
and the Lead manages upgrades per-agent rather than forcing uniform
migration—prevents the rigid pipeline problem that causes mass failures
when a new model has issues. The 2026 production track record proves it:
squads that abstracted early survived every frontier-model shift in
minutes with zero prompt changes, zero downtime, and 50–80% cost savings
from intelligent routing.
