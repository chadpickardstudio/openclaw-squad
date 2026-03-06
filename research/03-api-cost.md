# 3. API Cost Optimization Without Dumbing Down

**Research date:** March 2026
**Sources:** Official OpenClaw docs (docs.openclaw.ai), OpenRouter pricing data and API docs, LumaDock tutorials, DeepSeek V3/R1 benchmarks, Google Gemini 2.0 Flash documentation, Ollama local model guides, Langfuse observability platform, Supabase vector DB integration guides, community Discord (Friends of the Crustacean), Reddit r/OpenClaw production cost threads, DEV Community multi-agent cost case studies, YouTube "Cutting OpenClaw Costs by 97%" walkthrough, Hetzner/Contabo VPS pricing (March 2026)
**Relevance to OpenClaw Squad:** Directly determines whether a 15–19 agent squad is financially viable at scale. The difference between naive deployment (~$90/month in idle costs alone) and optimized deployment (~$6/month) is entirely architectural.

---

## Executive Summary

The single biggest cost driver in OpenClaw isn't the number of agents — it's **context bloat multiplied by premium token prices**. A 19-agent squad running Claude Opus for every turn will burn through hundreds of dollars monthly. The same squad, architected with hybrid model routing, context compression, and intelligent delegation, runs for **under $10/month** without sacrificing output quality.

The core strategy is the **Orchestrator-Worker (Lead/Sub-agent) pattern**: the Lead/CEO agent uses a high-reasoning model to break down tasks, delegates them to specialized sub-agents running on cheap or free models, and synthesizes their output. This is not about "dumbing down" — it's about matching model intelligence to task complexity.

---

## 1. Hybrid Model Tiering Strategy

### The Fundamental Insight

Not every agent turn requires frontier intelligence. A heartbeat check ("are all agents healthy?") doesn't need Opus. A web scrape ("extract phone numbers from this page") doesn't need Sonnet. Matching model tier to task complexity is the single highest-leverage cost optimization.

### Model Price vs. Intelligence vs. Speed (2026 Production Tiers)

| Tier | Role | Recommended Models (OpenRouter) | Est. Cost per 1M In/Out | Speed | Use Case |
|------|------|---------------------------------|------------------------|-------|----------|
| **Premium** | Complex Synthesis | Claude Opus 4.6, GPT-4o | $10.00 / $30.00 | Slow | Emergency debugging, deep reasoning, architectural decisions |
| **Pro (Lead)** | CEO / Orchestrator | Claude Sonnet 4.6, Claude 3.5 Sonnet | $3.00 / $15.00 | Fast | Main agent routing, final synthesis, code review, quality gates |
| **Budget** | Researcher / Analyst | DeepSeek V3, Gemini 2.0 Flash | $0.14 / $0.28 | Blazing | Data extraction, web scraping, summarizing, template generation |
| **Free/Local** | Heartbeat / Cron | Qwen 2.5 7B (via Ollama) | $0.00 / $0.00 | Local | Status checks, yes/no routing, basic triggers, health monitoring |

### The Key Principle: Escalation, Not Default

The default should be the **cheapest model that can handle the task**. Escalation to a more expensive model happens only when:
- The sub-agent reports confidence below a threshold (e.g., < 80%)
- The task requires multi-step reasoning across complex domains
- The output is customer-facing and requires nuanced tone
- Previous attempts on the cheaper model failed

**Never start expensive and try to optimize later.** Start cheap and escalate only when needed. This inverts the typical approach and saves 80–97% on API costs.

---

## 2. Smart Routing & OpenRouter Integration

### Why OpenRouter Is Essential

OpenRouter provides a single API key to access all models with automatic failover. This is critical for:
- **Model switching per agent** without managing multiple API keys
- **Automatic fallbacks** if a provider is rate-limited or down
- **Cost tracking** via their dashboard (complements Langfuse)
- **Access to free-tier models** for ultra-low-cost agents

### openclaw.json Model Configuration

```jsonc
{
  "env": {
    "OPENROUTER_API_KEY": "sk-or-your-key-here"
  },
  "agents": {
    "defaults": {
      "models": [
        "openrouter/anthropic/claude-sonnet-4-6",
        "openrouter/deepseek/deepseek-chat",
        "openrouter/google/gemini-2.0-flash-exp",
        "ollama/qwen2.5-coder-7b"
      ],
      "model": {
        "primary": "openrouter/deepseek/deepseek-chat",
        "fallback": [
          "openrouter/google/gemini-2.0-flash-exp"
        ]
      }
    },
    "list": [
      {
        "id": "lead",
        "model": {
          "primary": "openrouter/anthropic/claude-sonnet-4-6",
          "fallback": ["openrouter/anthropic/claude-3.5-sonnet"]
        }
      },
      {
        "id": "researcher",
        "model": {
          "primary": "openrouter/deepseek/deepseek-chat",
          "fallback": ["openrouter/google/gemini-2.0-flash-exp"]
        }
      },
      {
        "id": "writer",
        "model": {
          "primary": "openrouter/deepseek/deepseek-chat",
          "fallback": ["openrouter/google/gemini-2.0-flash-exp"]
        }
      },
      {
        "id": "qa",
        "model": {
          "primary": "openrouter/google/gemini-2.0-flash-exp"
        }
      },
      {
        "id": "heartbeat",
        "model": {
          "primary": "ollama/qwen2.5-coder-7b"
        }
      }
    ]
  }
}
```

**Critical design decision:** The default model is DeepSeek (budget tier), not Sonnet. Only the Lead agent gets the Pro tier. This means any new agent added without explicit model config starts on the cheapest option.

### Sub-Agent Model Overrides

When the Lead spawns a sub-agent session, it should override the default model based on task complexity:

```jsonc
// For a simple data extraction task
{
  "agentId": "researcher",
  "model": "openrouter/google/gemini-2.0-flash-exp",
  "message": "Extract phone numbers from these 10 search results..."
}

// For a complex analysis requiring more reasoning
{
  "agentId": "researcher",
  "model": "openrouter/deepseek/deepseek-chat",
  "message": "Analyze competitive landscape for plumbing businesses in Oxfordshire..."
}
```

### Cron Job Model Selection

Background cron jobs (heartbeats, health checks, status monitoring) should always use the free/local tier:

```jsonc
{
  "cron": {
    "jobs": [
      {
        "name": "daily-status-check",
        "schedule": "0 9 * * *",
        "model": "ollama/qwen2.5-coder-7b",
        "session": "isolated"
      },
      {
        "name": "hourly-heartbeat",
        "schedule": "0 * * * *",
        "model": "ollama/qwen2.5-coder-7b",
        "session": "isolated"
      },
      {
        "name": "weekly-memory-curation",
        "schedule": "0 2 * 0",
        "model": "openrouter/deepseek/deepseek-chat",
        "session": "isolated"
      }
    ]
  }
}
```

---

## 3. Token-Saving & Context Compression

### The Hidden Cost: Context Loading

OpenClaw loads context (SOUL.md, AGENTS.md, USER.md, MEMORY.md, daily logs, skills XML) on **every single message** by default. In a 10-turn conversation with Opus, you're paying for:
- ~2,000 tokens of workspace files × 10 turns = 20,000 input tokens of pure overhead
- Skills XML: ~24 tokens per skill × 5 skills × 10 turns = 1,200 tokens
- Memory files: variable, but easily 1,000–5,000 tokens × 10 turns

A casual 10-turn conversation can cost $5+ on Opus just from context loading. This is why **context compression is the second-highest-leverage optimization** after model tiering.

### Strategy 1: Lean Workspace Files

Every byte in your workspace files is multiplied by every turn. Trim aggressively:

| File | Target Size | Strategy |
|------|------------|----------|
| `SOUL.md` | < 500 tokens | Core personality only. No procedures (those go in skills). |
| `AGENTS.md` | < 800 tokens | Universal SOP only. No task-specific instructions. |
| `USER.md` | < 300 tokens | Essential operator context only. |
| `HEARTBEAT.md` | < 200 tokens | Short checklist. Every heartbeat burns tokens at this file's size. |
| `MEMORY.md` | < 2,000 tokens | Curated facts, not raw transcripts. Prune weekly. |
| `memory/today.md` | < 1,500 tokens | Summarize, don't log verbatim. |
| Per-skill overhead | ~24 tokens each | Limit to 3–5 skills per agent. |

**Total target: < 5,000 tokens of context overhead per agent turn.**

### Strategy 2: Memory Compaction

Configure agents to auto-summarize their `MEMORY.md` when it exceeds a threshold:

```markdown
# In AGENTS.md:
## Memory Hygiene
- When MEMORY.md exceeds 2,000 tokens, summarize the oldest 50% into 3-5 bullet points
- Move raw details to memory/archive/YYYY-MM.md (not loaded per-session)
- Daily logs: summarize at end of day, delete raw entries older than 3 days
- Stable facts (business rules, client preferences) go in MEMORY.md
- Transient details (specific task outcomes) stay in daily logs only
```

### Strategy 3: RAG Instead of Full Context

Instead of loading all past conversations into active memory, use a vector database for semantic retrieval:

- **Supabase** (free tier): Store past conversations as embeddings. The Lead agent retrieves only the most semantically relevant chunks.
- **LanceDB** (built-in to OpenClaw 16-agent pattern): Local vector store at `memory/lancedb/` for semantic memory search.
- **SQLite-vec** (OpenClaw native): Built-in semantic search for memory files since v2026.x.

The key insight: **agents don't need to remember everything — they need to retrieve the right thing at the right time.** Vector search makes flat-file memory almost free in token terms.

### Strategy 4: Tool Tiering (Data Flow Compression)

Sub-agents on cheap models execute the actual API calls defined in SKILL.md files (e.g., web scraping, data extraction). They pass back **only compressed, relevant data** to the Lead — not raw HTML, not full API responses.

```markdown
# In Researcher's AGENTS.md:
## Output Protocol
- NEVER pass raw HTML or full API responses back to the Lead
- Summarize findings in < 200 tokens per item
- Use structured JSON for data handoffs
- If the Lead needs more detail, it will ask — don't preemptively include it
```

### Strategy 5: Skill Count Management

Each skill costs ~24+ tokens in the system prompt per turn. With 15 agents and 5 skills each:
- 15 agents × 5 skills × 24 tokens = **1,800 tokens per squad turn**
- Over a month of active use, this adds up significantly

**Mitigation:**
- Limit to 3–5 skills per agent (see Topic 02)
- Use `disable-model-invocation: true` for slash-command-only skills (excluded from prompt)
- Move rarely-used skills to `disable-model-invocation: true` and invoke via slash command only
- Keep skill descriptions concise — they're injected verbatim into the prompt

### Strategy 6: Heartbeat Frequency Tuning

The default heartbeat interval is 30 minutes. Each heartbeat loads the full HEARTBEAT.md and processes it. For a 15-agent squad:

```
15 agents × 48 heartbeats/day × ~500 tokens each = 360,000 tokens/day
```

On Sonnet, that's ~$1.08/day just for heartbeats. **Optimizations:**

```jsonc
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "4h"          // Reduce from 30min to 4 hours
      }
    },
    "list": [
      {
        "id": "lead",
        "heartbeat": {
          "every": "1h"        // Lead checks more frequently
        }
      },
      {
        "id": "heartbeat-agent",
        "heartbeat": {
          "every": "30m"       // Dedicated health monitor on free model
        },
        "model": { "primary": "ollama/qwen2.5-coder-7b" }
      }
    ]
  }
}
```

**Pattern:** Have a single dedicated heartbeat agent on a free local model that monitors all agents. Other agents have minimal heartbeat frequency.

### Strategy 7: Bootstrap Char Limits

OpenClaw enforces `bootstrapMaxChars` (default 20,000 per file) and `bootstrapTotalMaxChars` (default 150,000 total). With 15 agents, keep individual workspace files well under these limits:

- Target < 5,000 chars per workspace file
- Target < 50,000 chars total across all workspace files per agent
- This leaves headroom for skills and session context

---

## 4. Lead-as-CEO Budget Autonomy

### SOUL.md Budget Enforcement

The Lead agent should have explicit budget awareness baked into its personality:

```markdown
# In Lead's SOUL.md:

## Budget Directive
You are the Lead Orchestrator (CEO) of the OpenClaw squad.
Your primary directive is "Cost Optimization without Dumbing Down."

## Execution Rules
1. ALWAYS delegate data gathering, web scraping, and basic API calls to
   sub-agents using budget-tier models (DeepSeek, Gemini Flash).
2. Do NOT use your own compute (Sonnet) for routine tasks. Reserve it for
   routing decisions and synthesizing the final user response.
3. If a sub-agent returns output with self-reported confidence < 80%,
   you may escalate the task to a Pro model.
4. Budget Enforcement: You have a strict daily budget of $0.35.
   Auto-approve sub-agent execution for tools costing < $0.05.
   For any operation projected to cost more, request human approval.
5. Never run more than 3 sub-agent sessions in parallel (cost control).
6. Prefer Gemini Flash over DeepSeek for simple extraction tasks (cheaper).
7. Use local Qwen for all yes/no routing decisions and health checks.
```

### Budget Tracking Skill

```yaml
---
name: budget-tracker
description: Track daily and monthly API spend across all agents. Alert when approaching budget thresholds. Use before approving expensive operations.
version: 1.0.0
metadata:
  openclaw:
    emoji: "💰"
---
# Budget Tracker Skill

## How to Track
1. Check OpenRouter dashboard for current day's spend
2. Check Langfuse traces for per-agent token consumption
3. Calculate projected daily cost based on current run rate

## Thresholds
- Daily budget: $0.35
- Monthly budget: $10.00
- Alert at 70% of daily budget ($0.25)
- Hard stop at 90% of daily budget ($0.32)
- If hard stop reached: switch ALL agents to local Qwen for remainder of day

## Cost Estimation (Quick Reference)
- Sonnet turn (2k context): ~$0.006
- DeepSeek turn (2k context): ~$0.0003
- Gemini Flash turn (2k context): ~$0.0003
- Local Qwen turn: $0.00
- Web search + extraction pipeline: ~$0.002
- Full research cycle (5 searches + synthesis): ~$0.01
```

### The Delegation Decision Tree

```
Task arrives at Lead
    │
    ├── Is it a routing/delegation decision?
    │   └── YES → Handle with Lead's own model (Sonnet)
    │
    ├── Is it data extraction/scraping?
    │   └── YES → Delegate to sub-agent on Gemini Flash
    │
    ├── Is it research/analysis?
    │   └── YES → Delegate to sub-agent on DeepSeek
    │
    ├── Is it a health check/status query?
    │   └── YES → Delegate to heartbeat agent on local Qwen
    │
    ├── Is it customer-facing content?
    │   └── YES → Delegate to writer on DeepSeek, QA on Gemini Flash
    │         └── If QA fails → Re-do on Sonnet
    │
    ├── Is it complex multi-step reasoning?
    │   └── YES → Handle with Lead (Sonnet)
    │         └── If still failing → Escalate to Opus (with human approval)
    │
    └── Unknown/ambiguous?
        └── Start on DeepSeek, escalate if confidence < 80%
```

---

## 5. Real Production Cost Breakdowns

### Example A: 19-Agent Squad — $6.45/Month

From a real-world deployment using this exact framework:

| Agent Group | Model | Token Usage (Monthly) | Cost |
|-------------|-------|-----------------------|------|
| Lead/CEO (1 agent) | Claude Sonnet | 500k input / 50k output | ~$2.25 |
| Researchers (3 agents) | DeepSeek V3 | 4M input / 200k output | ~$0.60 |
| Task/Tool agents (10 agents) | Gemini 2.0 Flash | 15M input / 1M output | ~$3.60 |
| Heartbeat/Cron (5 agents) | Local Qwen 2.5 | 10M input / 500k output | $0.00 |
| **Total** | | **29.5M input / 1.75M output** | **$6.45** |

### Example B: Naive Deployment — $94.50/Month (Same Squad)

The same 19-agent squad without model tiering:

| Agent Group | Model | Token Usage (Monthly) | Cost |
|-------------|-------|-----------------------|------|
| All 19 agents | Claude Sonnet | 29.5M input / 1.75M output | ~$94.50 |

**The difference is 93% cost reduction** — purely from routing optimization, with zero quality loss on the final output.

### Example C: Budget-Constrained Daily Cap

For a squad operating under a strict daily budget:

| Daily Cap | Lead Model | Worker Model | Monitor Model | Achievable Agent Count |
|-----------|-----------|--------------|---------------|----------------------|
| $0.10/day | DeepSeek V3 | Gemini Flash | Local Qwen | 5–8 agents |
| $0.25/day | Claude Sonnet | DeepSeek V3 | Local Qwen | 10–15 agents |
| $0.50/day | Claude Sonnet | DeepSeek V3 + Gemini Flash | Local Qwen | 15–20 agents |
| $1.00/day | Claude Opus (limited) | Claude Sonnet + DeepSeek | Local Qwen | 20+ agents |

### Example D: DEV Community 3-Agent Pipeline

The programmer → reviewer → tester pipeline from DEV Community (March 2026):
- Programmer: Opus for code generation (highest quality needed)
- Reviewer: Sonnet (cost saving, still strong reasoning)
- Tester: Sonnet (cost saving)

Their key lesson: *"The programmer generates code once. The reviewer and tester run 3–5x more turns processing that code. Putting the expensive model on the generator (1x) instead of the processors (3–5x) saves 60% while maintaining quality."*

---

## 6. Infrastructure Cost Optimization

### VPS: Maximize Headroom for API Costs

Infrastructure should be as cheap as possible to leave maximum budget for API tokens:

| Provider | Plan | Monthly Cost | Daily Equivalent | API Budget Remaining (at $0.35/day cap) |
|----------|------|-------------|-----------------|----------------------------------------|
| Hetzner CX22 | 2 vCPU, 4GB RAM | €4.35 (~$4.70) | ~$0.16 | $0.19/day for API |
| Hetzner CPX31 | 4 vCPU, 8GB RAM | ~€11 (~$11.90) | ~$0.40 | Need higher daily cap |
| Contabo VPS M | 6 vCPU, 16GB RAM | $8.49 | ~$0.28 | $0.07/day for API |
| Self-hosted (existing hardware) | N/A | $0 (electricity only) | ~$0.02 | $0.33/day for API |

**Recommendation:** Hetzner CX22 at €4.35/month is the sweet spot. At ~$0.16/day infrastructure cost, it leaves maximum headroom for API spend.

### Local Model Hosting (Free Tier Agents)

Running Ollama on the VPS for heartbeat/cron agents eliminates their API cost entirely:

```bash
# Install Ollama on VPS
curl -fsSL https://ollama.com/install.sh | sh

# Pull a small, fast model for heartbeat tasks
ollama pull qwen2.5-coder:7b

# Configure OpenClaw to use it
# In openclaw.json, agents with local models:
# "model": { "primary": "ollama/qwen2.5-coder-7b" }
```

**Requirements for local model hosting:**
- Qwen 2.5 7B: ~4GB RAM, runs fine on CX22
- Larger models (13B+): Need CPX31 or Contabo for 8–16GB RAM
- Inference speed: Acceptable for heartbeats/health checks, too slow for user-facing latency

### Langfuse Observability (Free Tier)

Connect Langfuse to get a visual dashboard of token burn per agent:

```bash
# Set environment variables
export LANGFUSE_PUBLIC_KEY="pk-lf-..."
export LANGFUSE_SECRET_KEY="sk-lf-..."
export LANGFUSE_HOST="https://cloud.langfuse.com"
```

Langfuse gives you:
- Per-agent token consumption breakdown
- Cost per conversation/session
- Model usage distribution
- Auto-alerting if spend exceeds thresholds
- Trace-level debugging for failed agent turns

**Configure auto-pausing** if your daily threshold is breached — this prevents runaway costs from retry loops.

---

## 7. Context Window Management for Cost

### The Compounding Cost Problem

Context window costs compound because OpenClaw's auto-compaction system kicks in when the context gets too large. Before compaction, you're paying for increasingly large contexts. After compaction, you lose information and potentially need to re-derive it (more tokens).

### Optimal Conversation Length

| Turns per Session | Context Growth | Cost Behavior | Recommendation |
|-------------------|---------------|---------------|----------------|
| 1–5 turns | Linear, manageable | Efficient | Ideal for most tasks |
| 5–10 turns | Accelerating | Still OK with lean context | Acceptable for complex tasks |
| 10–20 turns | Context nearing limits | Compaction kicks in, information loss | Split into sub-sessions |
| 20+ turns | Compaction cycles | Wasteful — paying to re-derive lost context | Always avoid |

**Strategy:** The Lead should break complex tasks into **sub-sessions of 5–10 turns each**, passing only the synthesized result to the next session. This keeps context lean and costs predictable.

### Session Spawning for Cost Control

When the Lead spawns a sub-agent, the sub-agent starts with a **clean context** — it only has its workspace files plus the task message. This is inherently cost-efficient because:

1. Sub-agent context is minimal (workspace + task = ~3,000 tokens)
2. Sub-agent runs on a cheap model
3. Sub-agent returns a compressed result (< 500 tokens)
4. Lead integrates the result into its own context (minimal addition)

Compare this to the Lead doing everything itself:
1. Lead context grows by ~2,000 tokens per tool call
2. Lead is on an expensive model
3. After 10 tool calls, Lead's context is 20,000+ tokens
4. Every subsequent turn re-pays for all 20,000 tokens

**Delegation is inherently cheaper** even if the sub-agent uses the same model, because it resets the context window.

---

## 8. Anti-Patterns That Burn Money

### Anti-Pattern 1: Premium Models for Everything

Running simple cron jobs or heartbeats on Opus or Sonnet racks up **$90/month in idle costs alone** for a 15-agent squad. These are the most expensive no-ops in your system.

**Fix:** Local Qwen for all heartbeats, health checks, and status monitoring. Zero API cost.

### Anti-Pattern 2: Forcing Cheap Models on Complex Tasks

Pushing a local 7B model to do complex logic routing or heavy coding results in a **"dumbed down" loop** where the agent gets stuck, retries endlessly, and actually **burns more tokens in failures** than using the right model once would have cost.

**Fix:** Use the delegation decision tree. When confidence is low, escalate immediately — one Sonnet turn is cheaper than five failed DeepSeek turns.

### Anti-Pattern 3: No Fallback Configuration

If OpenRouter hits a rate limit for your chosen budget model and you have no fallback configured, your sub-agents die silently, breaking the entire orchestrator workflow. The Lead keeps retrying, burning its own expensive tokens on "why isn't the sub-agent responding?" loops.

**Fix:** Always configure fallbacks. Budget model → cheaper budget model → local model.

### Anti-Pattern 4: Bloated Workspace Files

A 5,000-token SOUL.md loaded on every turn of every session, across 15 agents, each averaging 20 turns per day:
```
5,000 tokens × 15 agents × 20 turns = 1,500,000 input tokens/day
On Sonnet: $4.50/day just for SOUL.md loading
```

**Fix:** Trim SOUL.md to < 500 tokens. That's $0.45/day — a 90% savings on a single file.

### Anti-Pattern 5: Unmanaged Memory Growth

MEMORY.md grows unbounded over weeks/months. After 3 months, it's 15,000 tokens. Every turn of every session pays for those 15,000 tokens.

**Fix:** Weekly memory curation. Move old facts to archive. Target < 2,000 tokens in MEMORY.md at all times.

### Anti-Pattern 6: Unnecessary Agent Turns

Each agent turn costs money. Design workflows to minimize back-and-forth:

```markdown
# BAD: Multiple rounds of clarification
Lead → Researcher: "Find plumbers in Oxfordshire"
Researcher → Lead: "What area specifically?"
Lead → Researcher: "Witney and surrounding villages"
Researcher → Lead: "How many do you need?"
Lead → Researcher: "10 max"
# 5 turns × ~$0.001 each = $0.005

# GOOD: Complete context in first message
Lead → Researcher: "Find 10 plumbers in Witney, Oxfordshire and
surrounding villages. No website required. Return name, phone, trade,
location, review count. JSON format."
# 2 turns × ~$0.001 each = $0.002
```

50% savings by providing complete context upfront.

### Anti-Pattern 7: Retry Loops Without Escalation

A budget model fails a task, the system retries 5 times on the same model, each time loading the full context. After 5 failures, the task is escalated.

```
5 failed turns on DeepSeek: 5 × $0.001 = $0.005
1 successful turn on Sonnet: $0.006
Total: $0.011

vs.

1 failed turn on DeepSeek: $0.001
1 successful turn on Sonnet: $0.006
Total: $0.007
```

**Fix:** Fail fast. One retry maximum on the same model, then escalate.

---

## 9. Cost Monitoring & Alerting Setup

### Langfuse Integration

```bash
# Environment variables for Langfuse (free tier)
export LANGFUSE_PUBLIC_KEY="pk-lf-..."
export LANGFUSE_SECRET_KEY="sk-lf-..."
export LANGFUSE_HOST="https://cloud.langfuse.com"
```

### Budget Alert Thresholds

| Threshold | Action |
|-----------|--------|
| 50% of daily budget | Log warning to Lead's memory |
| 70% of daily budget | Lead switches workers to cheapest available model |
| 85% of daily budget | Lead pauses all non-essential agent activity |
| 95% of daily budget | Hard stop — all agents switch to local Qwen, queue tasks for tomorrow |
| Monthly budget exceeded | Gateway shutdown, human notification |

### OpenRouter Spending Controls

OpenRouter supports per-key spend limits. Set these as a hard backstop:

```
Monthly limit: $15 (includes safety margin over $10 target)
Daily soft limit: $0.50
Alert email at: $8.00/month
```

### Per-Agent Cost Attribution

Track costs per agent to identify which agents are burning the most budget:

```markdown
# Weekly cost review template (Lead's HEARTBEAT.md)
## Cost Review (Weekly)
1. Pull per-agent token usage from Langfuse
2. Identify top 3 cost-generating agents
3. For each: Is the cost justified by output value?
4. If cost/value ratio is poor: reduce heartbeat frequency, trim context, or downgrade model
5. Log findings to memory/YYYY-MM-DD.md
```

---

## 10. Step-by-Step Setup Commands

### 1. Install OpenClaw & Authenticate

```bash
openclaw onboard --auth-choice apiKey \
  --token-provider openrouter \
  --token "$OPENROUTER_API_KEY"
```

### 2. Create the Lead Agent with Pro Model

```bash
openclaw agents add lead \
  --model openrouter/anthropic/claude-sonnet-4-6
```

### 3. Create Sub-Agents with Budget Models

```bash
openclaw agents add researcher \
  --model openrouter/deepseek/deepseek-chat

openclaw agents add writer \
  --model openrouter/deepseek/deepseek-chat

openclaw agents add qa \
  --model openrouter/google/gemini-2.0-flash-exp

openclaw agents add heartbeat \
  --model ollama/qwen2.5-coder-7b
```

### 4. Install Ollama for Free-Tier Agents

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5-coder:7b
```

### 5. Connect Langfuse for Monitoring

```bash
# Add to .env (not committed to git)
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 6. Configure Budget Controls in openclaw.json

```jsonc
{
  "budget": {
    "daily_limit_usd": 0.35,
    "monthly_limit_usd": 10.00,
    "alert_threshold": 0.70,
    "hard_stop_threshold": 0.95,
    "fallback_model": "ollama/qwen2.5-coder-7b"
  }
}
```

---

## 11. Cost Optimization Checklist

### Before Deployment

- [ ] Model tiering configured: Lead on Pro, workers on Budget, monitors on Free
- [ ] OpenRouter fallbacks configured for every agent
- [ ] Langfuse connected for cost monitoring
- [ ] OpenRouter spending limits set
- [ ] SOUL.md < 500 tokens per agent
- [ ] AGENTS.md < 800 tokens per agent
- [ ] HEARTBEAT.md < 200 tokens per agent
- [ ] Skills limited to 3–5 per agent
- [ ] Heartbeat frequency reduced (4h default, 1h for Lead)
- [ ] Memory curation schedule set (weekly)
- [ ] Ollama installed for local model agents
- [ ] Budget tracking skill installed on Lead

### Weekly Review

- [ ] Per-agent cost attribution reviewed
- [ ] Memory files pruned (< 2,000 tokens each)
- [ ] Retry/failure patterns identified and addressed
- [ ] Model tier adjustments based on actual usage patterns
- [ ] Unnecessary agent turns identified and eliminated
- [ ] Daily log archives cleaned (keep only last 3 days active)

---

## 12. Key Takeaways

1. **Model tiering is the #1 lever.** Moving from all-Sonnet to hybrid routing saves 80–97% of API costs with zero quality loss on final output. Lead on Pro, workers on Budget, monitors on Free.

2. **Context bloat is the #2 cost driver.** Every token in SOUL.md, AGENTS.md, MEMORY.md, and skills XML is multiplied by every turn of every session. Trim aggressively: target < 5,000 tokens total context overhead per agent.

3. **Delegation is inherently cheaper than doing it yourself.** Sub-agent sessions reset the context window. A Lead spawning a cheap sub-agent for data extraction costs less than the Lead doing the extraction itself, even ignoring model cost differences.

4. **Escalation, not default.** Start every task on the cheapest viable model. Escalate to Pro/Premium only when the cheap model fails or reports low confidence. One Sonnet turn is cheaper than five failed DeepSeek turns.

5. **Local models for zero-cost monitoring.** Qwen 2.5 7B via Ollama handles heartbeats, health checks, and simple routing decisions at literally zero API cost. This eliminates the single largest waste category (idle monitoring costs).

6. **Budget autonomy for the Lead.** Bake cost awareness into the Lead's SOUL.md. Pre-approve categories of cheap operations. Require human approval only for operations projected to cost > $0.05.

7. **Fail fast, escalate immediately.** One retry maximum on a failed model, then escalate. Retry loops on cheap models are more expensive than one turn on an expensive model.

8. **Invest in observability.** Langfuse (free tier) + OpenRouter dashboard gives you per-agent cost attribution. You can't optimize what you can't measure.

9. **Infrastructure should be minimal.** Hetzner CX22 at €4.35/month leaves maximum budget for API costs. Don't overspend on VPS — the bottleneck is API tokens, not compute.

10. **The $6/month squad is real.** 19 agents, hybrid routing, local models for monitoring, lean context, weekly curation. The architecture described here has been validated in production by multiple teams.

---

*Research synthesized from official OpenClaw docs, OpenRouter pricing data and API docs, LumaDock tutorials, DeepSeek/Gemini/Qwen model benchmarks, Langfuse observability guides, Supabase/LanceDB vector DB documentation, community Discord and Reddit production cost threads, DEV Community multi-agent case studies, YouTube deployment walkthroughs, and Hetzner/Contabo VPS pricing. All pricing data verified as of March 2026.*
