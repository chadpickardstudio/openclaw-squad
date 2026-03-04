# 7. Hybrid Local + Cloud Setups — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, community configs, official docs
> **Last verified**: March 2026 (OpenClaw v2026.3.x, ClawRouter Feb 2026, Ollama v0.17+)

---

## Table of Contents

1. [Overview & Why Hybrid](#1-overview--why-hybrid)
2. [Exact Hybrid Architecture](#2-exact-hybrid-architecture)
3. [The Lead-as-CEO Model](#3-the-lead-as-ceo-model)
4. [openclaw.json Hybrid Routing Config](#4-openclawjson-hybrid-routing-config)
5. [Fallback & Escalation Logic](#5-fallback--escalation-logic)
6. [Confidence-Based Escalation via Prompt Loops](#6-confidence-based-escalation-via-prompt-loops)
7. [Tools & Providers](#7-tools--providers)
8. [Cost vs Intelligence Tradeoffs](#8-cost-vs-intelligence-tradeoffs)
9. [Integration with Independence & Coordination](#9-integration-with-independence--coordination)
10. [Integration with Memory Hygiene](#10-integration-with-memory-hygiene)
11. [Integration with Security & Tool Tiering](#11-integration-with-security--tool-tiering)
12. [Real 2026 Production Examples](#12-real-2026-production-examples)
13. [Common Failure Modes & Anti-Patterns](#13-common-failure-modes--anti-patterns)
14. [Step-by-Step Setup Commands](#14-step-by-step-setup-commands)
15. [Practical Recommendations](#15-practical-recommendations)

---

## 1. Overview & Why Hybrid

OpenClaw (github.com/openclaw/openclaw, formerly Clawdbot/Moltbot) is a self-hosted
multi-agent gateway that routes messaging channels (WhatsApp, Telegram, Discord, etc.)
into persistent AI agents with isolated workspaces, tools, and memory. As of March 2026
(v2026.3.x), it natively supports:

- **Ollama local models** (v0.17 integration, Feb 2026)
- **OpenRouter** as a unified cloud proxy
- **Per-agent model overrides** in `openclaw.json`
- **Two-tier routing** via the ClawRouter plugin (shipped Feb 2026)
- **Full multi-agent orchestration** with `sessions_spawn` and bindings

Hybrid setups are the production standard: the **Lead/CEO agent** runs premium cloud
models for high-stakes reasoning while **grunt agents** (Researcher, Writer, Analyst,
etc.) run free local Ollama models on Mac Mini or VPS. This delivers **80–95% cost
savings** while preserving intelligence where it matters.

> **Key correction (Gemini)**: OpenClaw's native fallback logic triggers on network/API
> errors (HTTP 429, timeouts, model unavailability)—**not** on "confidence scores."
> Confidence-based escalation requires an engineered Lead-as-CEO evaluation loop
> (see §6). Additionally, while Claude Sonnet 4, GLM-5, and Qwen3.5 are production
> standard, model identifiers like "GPT-5.3" are not yet standard in configs.

All data below comes from official docs (docs.openclaw.ai), GitHub issues (#6421
closed/completed, #13893, #6203), LumaDock production tutorials, Meta-Intelligence
agent/security guides, awesome-openclaw repos, recent X threads (local Qwen3.5 +
hybrid routing since Jan 2026), r/openclaw, and community kits.

---

## 2. Exact Hybrid Architecture

The current production meta is an **Orchestrator-Sub-Agent architecture**. OpenClaw
runs multiple fully isolated agents inside one Gateway process.

### Component Roles

| Component | Role | Model Tier | Location |
|-----------|------|-----------|----------|
| **Lead (CEO/Orchestrator)** | Intent recognition, workflow routing, task decomposition, final synthesis, budget enforcement | Cloud frontier: Claude Opus/Sonnet-4, Kimi-k2.5, GPT-4o via OpenRouter | VPS or cloud API |
| **Grunts (Sub-agents)** | Web scraping, initial code reviews, data formatting, journaling, repetitive lifting | Local Ollama: qwen3-coder, qwen2.5-coder:32b, llama3.3, ministral-8b, deepseek-r1:14b | Mac Mini / local GPU / VPS |
| **Gateway** | Daemon process, messaging adapters, API routing, agent lifecycle | N/A (orchestration layer) | Cheap VPS ($2–$6/mo LumaDock, Hetzner, Contabo) |
| **ClawRouter** | 14-dim local scorer, <1ms routing decisions | ollama/qwen2.5-7b (tiny) | Co-located with Gateway |

### Routing Flow

```
Inbound message
  → bindings (channel → agent mapping)
  → assigned agent (or Lead)
  → Lead/ClawRouter analyzes task
     ├─ SIMPLE → route to local grunt
     └─ COMPLEX → escalate to self/cloud
  → Grunts do parallel work
  → Return via sessions_send or file drops
  → Lead synthesizes final output
```

### Infrastructure Pattern

- **VPS** ($2–$6/mo): Hosts Gateway, messaging adapters, API routing, ClawRouter
- **Local GPU rig / Mac Mini**: Runs heavy Ollama models (32B+ for coding, 7B for routing)
- **Connection**: Securely linked via **Tailscale** mesh VPN
- **Cloud APIs**: OpenRouter (single key, auto-cheapest model routing) for Lead escalations

---

## 3. The Lead-as-CEO Model

The Lead agent acts as **CEO of the hybrid squad**. This is the single most important
architectural decision in a hybrid deployment. The Lead is not merely a router—it is
an autonomous orchestrator with five core responsibilities:

### 3.1 Five Core Responsibilities

1. **Task Decomposition**: Breaks complex inbound requests into discrete sub-tasks,
   each tagged with a complexity estimate and model-tier requirement.

2. **Intelligent Routing via Bindings and sessions_send**: Uses OpenClaw's native
   binding system to map channels/patterns to agents, and `sessions_spawn` /
   `sessions_send` for dynamic sub-agent orchestration. Routing is **loose by design**
   —the Lead makes per-task decisions rather than following rigid pipelines.

3. **Result Synthesis**: Collects outputs from grunts via `sessions_send` or shared
   file drops, evaluates quality, and synthesizes the final user-facing response.

4. **Autonomous Capability Grants**: The Lead can **autonomously grant extra tools,
   API keys, email accounts, secrets, and elevated permissions** to sub-agents as they
   grow and develop. This is the key to scaling without manual intervention:
   - Low-risk grants (read-only tools, search APIs, local file access) are issued
     autonomously by the Lead with no human approval.
   - **High-risk grants** (exec permissions, write access to shared repos, external
     API keys with spend authority, email/messaging accounts) require **one-time human
     approval** only. Once approved, the Lead can re-issue at will.
   - Grant decisions are logged to `MEMORY.md` for audit.

5. **Budget Enforcement**: Monitors per-agent and squad-wide token spend via proxy
   quotas and prompt-based reminders. Decides when to use expensive cloud models vs
   free local inference.

### 3.2 Why Loose Coordination Wins

The Lead-as-CEO model deliberately uses **loose coordination patterns** over rigid
pipelines:

- **No fixed DAGs**: Tasks flow based on runtime assessment, not pre-built graphs.
  A research task might go to one grunt or three, depending on complexity.
- **Prevents over-engineering**: Rigid automation chains break when models update,
  contexts shift, or new agents join. Loose routing adapts naturally.
- **Prevents straight-jacket automations**: Agents are not locked into sequential
  handoffs. The Lead can re-route, retry, or escalate at any point without unwinding
  a pipeline state machine.
- **Binding-based dispatch**: Channel → agent mappings via `openclaw.json` bindings
  handle 80%+ of routing. The Lead only intervenes for ambiguous or multi-step tasks.
- **Serial Lane Queue**: OpenClaw executes tools serially by default (the "Lane
  Queue"), preventing race conditions without requiring explicit locking or
  coordination protocols.

> **Design principle**: The cheapest, fastest, most maintainable coordination is the
> one that lets agents work independently with minimal coupling. The Lead is the only
> coupling point, and it decides dynamically—not a config file.

---

## 4. openclaw.json Hybrid Routing Config

Production-ready config combining official docs + LumaDock + ClawRouter patterns:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen2.5-coder:32b",
        "fallbacks": ["ollama/llama3.3", "anthropic/claude-sonnet-4"]
      },
      "subagents": {
        "model": "ollama/qwen2.5-7b",
        "maxSpawnDepth": 2,
        "maxConcurrent": 8
      },
      "workspace": "~/.openclaw/workspace",
      "sandbox": { "mode": "docker", "scope": "agent" }
    },
    "list": [
      {
        "id": "lead-ceo",
        "name": "CEO Orchestrator",
        "model": { "primary": "anthropic/claude-opus-4-6" },
        "workspace": "~/.openclaw/workspace-lead",
        "tools": {
          "allow": ["*"],
          "agentToAgent": { "enabled": true, "allow": ["*"] }
        }
      },
      {
        "id": "researcher",
        "name": "Researcher",
        "model": { "primary": "ollama/qwen2.5-coder:32b" },
        "workspace": "~/.openclaw/workspace-research",
        "tools": {
          "allow": ["read", "browser", "search"],
          "deny": ["exec"]
        }
      },
      {
        "id": "writer",
        "name": "Writer",
        "model": { "primary": "ollama/ministral-8b" },
        "workspace": "~/.openclaw/workspace-writer"
      },
      {
        "id": "analyst",
        "name": "Analyst",
        "model": { "primary": "ollama/deepseek-r1:14b" },
        "workspace": "~/.openclaw/workspace-analyst"
      },
      {
        "id": "grunt_researcher",
        "name": "Grunt Researcher (Gemini pattern)",
        "model": {
          "primary": "ollama/qwen3-coder:latest",
          "fallbacks": ["openrouter/mistralai/ministral-8b"]
        },
        "workspace": "~/.openclaw/agents/researcher",
        "sandbox": {
          "enabled": true,
          "dockerImage": "openclaw/sandbox:latest"
        }
      }
    ]
  },
  "models": {
    "mode": "merge",
    "providers": {
      "ollama": {
        "baseUrl": "http://127.0.0.1:11434/v1",
        "apiKey": "ollama-local",
        "api": "openai-responses",
        "contextWindow": 64000
      },
      "openrouter": {
        "baseUrl": "https://openrouter.ai/api/v1",
        "apiKey": "sk-or-...",
        "api": "openai-completions"
      }
    }
  },
  "routing": {
    "enabled": true,
    "router": {
      "model": "ollama/qwen2.5-7b",
      "prompt": "Classify: SIMPLE (lookup/summary/pattern) or COMPLEX (reasoning/code/multi-step). Output [LOCAL] or [ESCALATE]."
    }
  },
  "memorySearch": { "provider": "ollama", "hybrid": true }
}
```

> **Note**: The `mode: "merge"` under models tells OpenClaw to merge these provider
> configs with any existing defaults rather than replacing them entirely.

---

## 5. Fallback & Escalation Logic

OpenClaw provides multiple layers of fallback, from automatic to prompt-engineered:

### 5.1 Built-in Model Fallbacks (Automatic)

The `fallbacks` array in `openclaw.json` triggers on:
- **HTTP 429** (Rate Limit) from cloud providers
- **API unavailability** (connection refused, DNS failure)
- **Timeouts** (15s default per step)
- **Unknown model errors** from OpenRouter endpoints

> **Critical caveat (Gemini, confirmed via GitHub)**: As of late Feb 2026, there are
> active GitHub issues **#13893** and **#6203** where fallbacks occasionally fail to
> trigger during Anthropic cooldown periods. Always test your fallback chains.

**What fallbacks do NOT trigger on**: Low-quality output, hallucinations, incomplete
answers, or "confidence scores." These require prompt-based escalation (§6).

### 5.2 ClawRouter Plugin (Feb 2026)

The ClawRouter is a local 14-dimensional scorer that runs in <1ms:
- Scores each inbound task across 14 dimensions (complexity, domain, length, etc.)
- Routes: `SIMPLE → local grunt` / `COMPLEX → cloud Lead`
- Achieves **80–95% cost reduction** by keeping the vast majority of tasks local
- Uses a tiny local model (qwen2.5-7b) for classification—no cloud API call needed

### 5.3 Lead/User Override

- **Lead skill**: Custom routing skill that analyzes task and decides grunt vs cloud
- **User commands**: `/primary`, `/model claude-opus` to force a specific model
- **Budget-aware**: Lead can refuse cloud escalation if monthly budget is exhausted

---

## 6. Confidence-Based Escalation via Prompt Loops

> **This is the most commonly misunderstood aspect of hybrid setups.**

OpenClaw does **not** natively evaluate output quality or confidence. To achieve
confidence-based escalation, you must engineer a prompt-based evaluation loop.

### 6.1 Self-Escalation Prompt (Agent SOUL.md)

Place in any agent's `SOUL.md` or Lead Modelfile:

```markdown
You are an OpenClaw agent. After thinking, output exactly one of:
[LOCAL] confidence:XX% - I can handle this locally
[ESCALATE] confidence:XX% - Needs cloud/Lead for: <one-line reason>

Rules:
- Complex reasoning, code generation, nuanced analysis, multi-step → ESCALATE
- Simple lookup, summary, pattern matching → LOCAL
- If confidence <80% → ESCALATE regardless
Request: {{message}}
```

### 6.2 Lead CEO Evaluation Loop (SOUL.md)

The Lead uses this pattern to evaluate grunt outputs before returning to user:

```markdown
You are the Lead CEO Orchestrator.
1. Delegate research tasks to `grunt_researcher` using the `agentToAgent` tool.
2. When the sub-agent returns a result, evaluate its completeness and accuracy.
3. If your confidence in the sub-agent's output is <80%, DO NOT return it to the
   user. Instead, escalate the task to `cloud_analyst` (running on Claude 4) for
   high-tier synthesis.
4. Log all routing decisions and confidence assessments to MEMORY.md.
5. Track cumulative cost and refuse cloud escalation if budget is exhausted.
```

### 6.3 Lead Model Router Skill

For more sophisticated routing, implement as a custom Lead skill:

```markdown
# Lead Model Router Skill
Analyze the incoming task. Decide:
- Local grunt (cheap/fast) → spawn researcher/writer with ollama model
- Heavy synthesis → handle myself (cloud) or escalate to cloud_analyst
Enforce monthly budget: {{budget_remaining}}.
Log every routing decision to MEMORY.md with timestamp and rationale.
```

---

## 7. Tools & Providers

### 7.1 Provider Ecosystem

| Provider | Role | Protocol | Notes |
|----------|------|----------|-------|
| **Ollama** | Local model execution | Native `/api/chat` (tool calling + streaming) | Undisputed king of local. Auto-discovers tool-capable models |
| **OpenRouter** | Cloud model proxy | OpenAI-compat | Single key, auto-cheapest routing, wide model selection |
| **Venice** | Decentralized inference | OpenAI-compat via OpenRouter or direct | Privacy-focused alternative |
| **LiteLLM/Lynkr** | Self-hosted proxy | OpenAI-compat | Local-first + cloud fallback, fine-grained control |
| **Convex DB** | Real-time shared state | Community skill | Task boards, shared RAG sync across agents |

### 7.2 Local Vector Stores

- **SQLite-vec**: Lightweight, embedded, works with Ollama embeddings
- **QMD**: Hybrid BM25 + vector search, temporal decay, MMR dedup
- Both support Ollama-generated embeddings for fully local RAG

### 7.3 Tool Tiering by Agent Role

| Agent Role | Allowed Tools | Denied Tools |
|-----------|--------------|-------------|
| Lead CEO | `*` (all), agentToAgent, convexSync | None (full access) |
| Researcher | read, browser, search | exec, write, sudo |
| Writer | read, write (own workspace only) | exec, browser, sudo |
| Analyst | read, search, python (sandboxed) | exec, sudo, browser |
| Coder (sandboxed) | read, write, exec (Docker only) | Host exec, sudo |

---

## 8. Cost vs Intelligence Tradeoffs

### 8.1 The Real 2026 Math (19-Agent Squad)

| Setup Type | Monthly Cost | Speed / Latency | Intelligence / Reliability | Token Privacy | Best Use Case |
|-----------|-------------|----------------|---------------------------|--------------|--------------|
| **All-Cloud** (Opus/Claude 4 everywhere) | $300–$500+ | Fast (1–3s, API bound) | Highest (Opus reasoning) | Low | Never recommended for squads |
| **All-Local** (Ollama/Mac Mini) | $0 (electricity only) | <1s (GPU bound) | Good for grunt work; weaker synthesis | Highest | Small squads, offline, privacy-critical |
| **Hybrid (recommended)** | **$6–$50** (VPS $6–10 + cloud Lead $10–40) | <1s grunt / 2s Lead | Best of both (Lead catches errors) | High | **The 2026 meta. Smart routing, low cost** |

### 8.2 Why Hybrid Wins Decisively

- **80–92% cost savings** vs all-cloud, with no quality drop on final output
- **19-agent hybrid real-world**: ~$6/mo VPS + ~$10–40 OpenRouter for Lead escalations
  only. All-cloud equivalent: $400+ (heartbeats + repetitive tasks destroy budgets)
- **Parallelized speed**: Grunts work simultaneously on local hardware while Lead
  synthesizes—faster than sequential cloud API calls
- **Privacy**: 80–95% of tokens never leave your local network

### 8.3 The Bankruptcy Math

Running 19 agents doing recursive research on Claude 4 via OpenRouter:
- Average research task: ~8K tokens in + ~4K tokens out per agent per cycle
- 19 agents × 10 cycles/day × 30 days = 5,700 cycles/month
- At $15/M input + $75/M output (Opus pricing): **~$2,000+/month**
- Hybrid with 85% local routing: **~$30/month** for the same output quality

---

## 9. Integration with Independence & Coordination

### 9.1 Agent Independence

Every agent maintains full independence:
- **Private workspace**: `~/.openclaw/agents/<id>/` with own `agent.md`, `SOUL.md`,
  `MEMORY.md`, `skills/`, and sandbox config
- **Per-agent `openclaw.json` overrides**: Model, tools, permissions, sandbox mode
- **No cross-talk** unless explicitly allowed via `agentToAgent` + allowlist
- **Isolated Docker sandboxes** per agent (scope: agent, not shared)

### 9.2 Coordination Patterns

The hybrid architecture uses the same loose coordination principles from Topic 05:

- **Binding-based dispatch**: 80%+ of routing handled by static channel → agent
  bindings in `openclaw.json`
- **sessions_spawn for parallel work**: Lead spawns transient sub-agents for
  research/writing tasks, they auto-archive on completion
- **sessions_send for results**: Grunts return results to Lead via messaging,
  not shared state mutations
- **File drops for large payloads**: Shared workspace directories for code,
  documents, and data too large for message passing
- **No rigid pipelines**: The Lead decides routing per-task at runtime

### 9.3 Lead-as-CEO Autonomous Grants in Hybrid Context

In a hybrid setup, the Lead's autonomous capability grants (§3.1.4) become especially
powerful:

- A local grunt researcher that consistently produces high-quality web research can
  be **autonomously granted** browser tool access by the Lead
- A coder agent that proves reliable can be **granted exec permissions** (with one-time
  human approval since this is high-risk)
- API keys for external services (search APIs, data providers) can be issued by the
  Lead to grunts that need them, without manual config changes
- The Lead tracks grant history in `MEMORY.md` and can **revoke grants** if an agent
  starts producing poor results or exhibiting unexpected behavior

---

## 10. Integration with Memory Hygiene

### 10.1 Memory Tiering by Model Location

The hybrid architecture creates a natural memory tiering:

- **Local models (grunts)**: Handle all noisy journaling and raw data parsing. Write
  to local vector stores or shared Convex DB states. Daily logs in
  `memory/YYYY-MM-DD.md` with auto-flush prompts.
- **Cloud Lead**: Only reads the **summarized state**, drastically saving on context
  window tokens. Performs vector search + final report synthesis.

This split means the expensive cloud context window is never polluted with raw
research notes, web scrape dumps, or intermediate processing artifacts.

### 10.2 Memory Config

```json
"memorySearch": {
  "provider": "ollama",
  "hybrid": true,
  "query": {
    "temporalDecay": { "halfLifeDays": 30 }
  }
}
```

- **Provider**: Ollama for fully local embeddings (no cloud cost for memory ops)
- **Hybrid search**: BM25 keyword + vector similarity
- **Temporal decay**: 30-day half-life prevents stale context from dominating
- **Auto-compaction**: Periodic summarization of old memory entries
- **Citations**: All memory entries include source attribution
- **extraPaths**: Team-shared docs can be indexed alongside agent-private memory

---

## 11. Integration with Security & Tool Tiering

### 11.1 Security Tiering by Model Trust

Local models are inherently less trustworthy than frontier cloud models—they
hallucinate more, follow instructions less reliably, and are more susceptible to
prompt injection. The hybrid security model reflects this:

| Agent Tier | Sandbox | Tool Permissions | Rationale |
|-----------|---------|-----------------|-----------|
| **Lead (cloud)** | Isolated workspace, no Docker needed | Broad (`allow: ["*"]`), agentToAgent | High-trust model, needs orchestration power |
| **Grunts (local)** | **Docker mandatory** (`scope: agent`) | Narrow (`allow` list, explicit `deny` for exec/sudo) | Low-trust models, prevent accidental damage |
| **Coder (local)** | Docker + resource limits | exec inside container only | Must run code but never touch host |

### 11.2 The Deny-Wins Rule

If a tool is both allowed globally but denied per-agent, **deny wins**. This is
critical for hybrid setups where a hallucinating local model could attempt to
execute `rm -rf` on the host machine.

### 11.3 Lane Queue (Serial Execution)

OpenClaw executes tools serially in a "Lane Queue." This is a security feature
in hybrid setups:
- Prevents race conditions between local and cloud agents
- Ensures tool executions are auditable and sequential
- Stops a runaway local agent from flooding the tool execution queue

### 11.4 Gateway Security

- Gateway token authentication for all API access
- Per-agent permission boundaries enforced at the Gateway level
- Prompt injection hardening in Lead's SOUL.md (see Topic 06)
- All tool executions logged for audit

---

## 12. Real 2026 Production Examples

### 12.1 LumaDock 19-Agent Hybrid Squad

Published by Teodor Tudor in Feb 2026. The most widely cited production hybrid setup.

- **Architecture**: 1 main persistent Lead agent bound to WhatsApp/Slack, spawning
  18 transient sub-agents that auto-archive after task completion
- **Hardware**: LumaDock Performance VPS ($6/mo, AMD EPYC) for Gateway + Mac Mini M4
  (32GB) for Ollama models, connected via Tailscale
- **Models**: Lead on Claude Opus via OpenRouter; grunts on Ollama Qwen2.5/Ministral
- **Routing**: ClawRouter + per-agent overrides + bindings for channel routing +
  `sessions_spawn` for parallel research/writing
- **Security**: Sub-agents heavily restricted (deny wins). Docker sandboxing enforced
  for all local coding agents
- **Performance**: <2s average response, ~$15/mo total cost
- **Metrics**: 85% local routing, cost flatlines vs linear all-cloud spike

### 12.2 shenhao-stu 9-Agent Local-First Kit

Released March 1, 2026 (github.com/shenhao-stu/openclaw-agents). Current gold standard
for rapid multi-agent deployment.

- **The Squad**: 9 pre-configured agents (planner, ideator, critic, surveyor, coder,
  writer, reviewer, scout) with emoji identities
- **The Flow**: Adversarial collaboration (Ideator vs. Critic) with "SHARP taste gates"
- **Hardware**: Single Mac Mini M4 32GB running all 9 agents via Ollama
- **Cloud fallback**: Lead has cloud fallback for complex synthesis only
- **Memory**: QMD local vector store for fully offline RAG
- **Performance**: 24/7 personal automation, zero API cost after initial setup,
  <1% crash rate
- **Setup**:

```bash
git clone https://github.com/shenhao-stu/openclaw-agents.git
cd openclaw-agents
./setup.sh --mode local \
  --model-map 'coder=ollama/qwen3-coder:latest,planner=openrouter/anthropic/claude-sonnet-4'
```

### 12.3 Pantheon 14-Agent Security Fallback Flow

Community/VPS production setup for code auditing:

- **Architecture**: Local agents handle basic linting and regex scanning. If a complex
  Compound Scanner Gate is triggered (e.g., detecting a prompt injection CVE), the task
  escalates to a secure cloud model via OpenRouter for deep AST analysis
- **Routing**: Full ClawRouter + proxy (LiteLLM + OpenRouter)
- **Budget enforcement**: Lead enforces monthly budgets; local overload auto-escalates
- **Performance**: 92% cost reduction vs all-cloud, 100ms local router latency
- **Per-agent timeout + fallback chains** in config prevent cascade failures

---

## 13. Common Failure Modes & Anti-Patterns

### 13.1 Always-Cloud = Bankruptcy

Running 19 agents doing recursive research on Claude 4 will drain your OpenRouter
credits in hours. Heartbeat messages, status checks, and repetitive tasks generate
massive token volumes that provide zero value at cloud pricing.

**Fix**: Route 80–95% of tasks to local grunts. Only escalate to cloud for synthesis,
complex reasoning, and quality-critical final outputs.

### 13.2 No Fallback = Crashes and Dumb Output

As confirmed in OpenClaw issue **#6203**: if an `Unknown model` error hits your
OpenRouter endpoint and you don't have a `fallbacks` array, the Gateway crashes or
returns empty responses.

**Fix**: Always specify at least 2 fallbacks per agent. Chain: primary local → backup
local → cloud emergency.

### 13.3 Local Overload = OOM Kernel Panics

Spawning 10 Ollama sub-agents simultaneously on a single Mac Mini with 32B+ models
will cause Out-Of-Memory (OOM) kernel panic. Even with 48GB unified RAM, concurrent
32B model instances will exhaust memory.

**Fix**: Rely on OpenClaw's serial-by-default Lane Queue to process tasks one by one.
Use smaller models (7B) for routing/classification. Limit `maxConcurrent` in config.

### 13.4 Shared Directories = Session Collisions

Never reuse `agentDir` across multiple agents. It causes authentication and session
collisions, corrupted memory files, and unpredictable behavior.

**Fix**: Every agent gets its own isolated workspace directory. No exceptions.

### 13.5 Over-Permissive Tools on Local Models

Giving a tiny local model (7B) full exec permissions is a security nightmare. Small
models are far more likely to hallucinate dangerous commands and ignore safety
instructions.

**Fix**: Strict `allow`/`deny` lists per agent. Docker sandboxing mandatory for any
agent with exec permissions. Deny always wins over allow.

### 13.6 No Lead Oversight = Drift and Waste

Without the Lead-as-CEO evaluating outputs, agents drift off-task, duplicate each
other's work, and exceed budgets without producing useful results.

**Fix**: Always have a Lead agent (cloud model) that reviews grunt outputs before
they reach the user. The Lead is the quality gate.

---

## 14. Step-by-Step Setup Commands

### 14.1 Install Ollama and Pull Models

```bash
# macOS
brew install ollama && ollama serve &

# Linux
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable --now ollama

# Pull models for your squad
ollama pull qwen2.5-coder:32b    # Primary coder grunt
ollama pull qwen2.5-7b           # ClawRouter classifier
ollama pull llama3.3              # General-purpose grunt
ollama pull ministral-8b          # Writer grunt
ollama pull deepseek-r1:14b       # Analyst grunt
```

### 14.2 Install OpenClaw and Configure Hybrid

```bash
# Install OpenClaw CLI and daemon
npm install -g openclaw@latest
openclaw onboard --install-daemon

# Add the Lead CEO agent with cloud model
openclaw agents add lead-ceo --model anthropic/claude-opus-4-6

# Set your OpenRouter API key for cloud fallbacks
openclaw config set models.providers.openrouter.apiKey "sk-or-v1-..."

# Set Ollama as the local provider (standard local bypass)
export OLLAMA_API_KEY="ollama-local"

# Edit ~/.openclaw/openclaw.json with the full config from §4 above
# Then start the Gateway
openclaw gateway start
```

### 14.3 Enable ClawRouter and Fallback Prompts

```bash
# Drop the self-escalation prompt into each grunt's SOUL.md (see §6.1)
# Drop the CEO evaluation loop into Lead's SOUL.md (see §6.2)

# Verify routing is working
openclaw models list
openclaw agents list --bindings

# Chat with Lead and watch logs for [LOCAL]/[ESCALATE] decisions
openclaw gateway logs --follow
```

### 14.4 Test the Fallback Chain

```bash
# Simulate local model failure
ollama stop qwen2.5-coder:32b

# Send a task that would route to the stopped model
# Watch the fallback chain trigger: primary → fallback1 → fallback2

# Restart and verify
ollama serve &
openclaw gateway restart
```

### 14.5 Monitor Cost and Usage

```bash
# Real-time cost tracking
openclaw gateway usage-cost

# Per-agent token usage
openclaw agents stats --all

# Backup entire config and state
cp -r ~/.openclaw/ ~/.openclaw-backup-$(date +%Y%m%d)/
```

---

## 15. Practical Recommendations

### For Getting Started (2026)

1. **Start small**: 1 Lead (cloud) + 3–4 grunts (local Ollama) on a Mac Mini or
   decent VPS. Do not jump to 19 agents on day one.

2. **Use OpenRouter** for cloud variety + cost routing. Single API key, access to
   Claude, GPT-4o, Kimi, and dozens of others.

3. **Monitor aggressively**: Use `openclaw gateway usage-cost` to track spending.
   Set budget alerts in your Lead's SOUL.md.

4. **Backup weekly**: Entire `~/.openclaw/` directory. Agent memory, configs, and
   skills are your squad's institutional knowledge.

5. **Scale gradually**: Add agents one at a time. Test fallback flows for each new
   agent before adding the next.

6. **Prefer loose coordination**: Let the Lead make runtime routing decisions rather
   than building rigid automation pipelines. The simplest coordination that works
   is the best coordination.

### For Scaling to 10+ Agents

7. **Separate concerns**: Gateway/routing on VPS, heavy models on dedicated GPU rig,
   connected via Tailscale. Never run everything on one machine.

8. **Use ClawRouter**: The 14-dim local scorer eliminates unnecessary cloud API calls.
   It pays for itself immediately in saved tokens.

9. **Enforce the Lane Queue**: Don't try to parallelize tool execution. Serial
   execution prevents race conditions and makes debugging possible.

10. **Docker everything**: Every local agent with exec permissions must run in Docker.
    No exceptions, even for "trusted" models.

### For Production Reliability

11. **Always specify fallbacks**: At least 2 per agent. Primary local → backup local
    → cloud emergency.

12. **Test Anthropic cooldowns**: GitHub issues #13893 and #6203 show fallbacks can
    fail during provider cooldowns. Test your specific fallback chains under load.

13. **Isolate workspaces**: Every agent gets its own directory. Shared state goes
    through explicit mechanisms (Convex DB, file drops, sessions_send), never
    through shared workspace directories.

14. **Let the Lead be CEO**: The Lead's autonomous capability grants, budget
    enforcement, and quality evaluation are what make hybrid work. Without a
    strong Lead, you have a collection of independent agents, not a squad.

---

## Summary

Hybrid local + cloud is the **undisputed 2026 production standard** for serious
OpenClaw squads. The architecture is simple:

- **Lead on cloud** (Claude Opus/Sonnet-4 via OpenRouter): reasoning, synthesis,
  quality gates, budget enforcement, autonomous capability grants
- **Grunts on local** (Ollama Qwen/Llama/Ministral on Mac Mini or VPS): repetitive
  work, research, writing, data processing
- **ClawRouter** for sub-millisecond routing decisions
- **Loose coordination** via bindings and sessions_send, not rigid pipelines
- **Prompt-based escalation** for confidence-aware routing (native fallbacks only
  cover API errors)

Result: **80–95% cost savings**, sub-second local responses, frontier intelligence
where it matters, and full token privacy for the vast majority of operations.

Deploy the config from §4, drop the prompts from §6 into your SOUL.md files, and
you'll have a production-grade hybrid squad running by lunch.

---

*Master research file. Synthesized from Grok (primary) + Gemini sources.*
*Corrections applied: fallback trigger scope, model identifier accuracy.*
*Strengthened: Lead-as-CEO autonomous grants, loose coordination rationale.*
