# 9. Context Window Management & Long-Term Memory Tricks — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, official docs, community configs
> **Last verified**: March 2026 (OpenClaw v2026.3.2, QMD backend, sqlite-vec, LumaDock patterns)

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Layered Memory Architecture](#2-the-layered-memory-architecture)
3. [Official MEMORY.md System](#3-official-memorymd-system)
4. [Auto Pre-Compaction memoryFlush](#4-auto-pre-compaction-memoryflush)
5. [RAG-Style Chunking Techniques](#5-rag-style-chunking-techniques)
6. [Vector DB Add-ons](#6-vector-db-add-ons)
7. [Context Compression & Auto-Summarization](#7-context-compression--auto-summarization)
8. [Lead-as-CEO Memory Oversight](#8-lead-as-ceo-memory-oversight)
9. [Integration with Independence & Privacy](#9-integration-with-independence--privacy)
10. [Integration with Cost Optimization](#10-integration-with-cost-optimization)
11. [Integration with Prompt Engineering & Autonomy](#11-integration-with-prompt-engineering--autonomy)
12. [Real 2026 Production Examples](#12-real-2026-production-examples)
13. [Common Failure Modes & Anti-Patterns](#13-common-failure-modes--anti-patterns)
14. [Step-by-Step Setup Commands & Full Configs](#14-step-by-step-setup-commands--full-configs)
15. [Comparison Tables](#15-comparison-tables)
16. [Practical Recommendations](#16-practical-recommendations)

---

## 1. Overview

Context window management is the defining challenge of 2026 multi-agent AI
engineering. OpenClaw's core long-term memory (as of v2026.3.2) is deliberately
**plain Markdown on disk**—the files are the single source of truth. The model
never "remembers" anything that isn't written to disk.

Get it right: a fleet of agents that seamlessly recalls conversations from three
months ago with sub-200k sustained context. Get it wrong: agents hallucinate,
bleed private data across boundaries, or bankrupt you in token costs.

This guide covers the full stack from raw Markdown files through vector search,
auto-compaction, RAG chunking, and Lead-as-CEO orchestrated memory hygiene.

---

## 2. The Layered Memory Architecture

The 2026 standard dictates a **multi-tiered approach** (Gemini's "four-layer"
model validated by Grok's production configs):

| Layer | Name | Description | Loaded When |
|-------|------|-------------|-------------|
| **L1** | Working Memory | The immediate conversation thread (context window) | Always active |
| **L2** | Episodic Memory | Chronological append-only daily logs (`memory/YYYY-MM-DD.md`) | Today + yesterday auto-loaded at session start |
| **L3** | Semantic Memory | Curated facts, preferences, entity relationships (`MEMORY.md` + vector index) | Main/private sessions only; capped ~20k chars |
| **L4** | Long-Term Archive | Compressed weekly digests moved to `archive/YYYY/` | Only on explicit query via `memory_search` |

### 2.1 How Layers Interact

```
User message arrives
  → L1 (Working Memory): immediate context window
  → Agent checks if relevant facts needed
     → memory_search queries L3 (semantic) + L2 (episodic)
     → If deep history needed: searches L4 (archive) via QMD/sqlite-vec
  → Agent responds using retrieved context
  → Significant facts written to L2 (daily log)
  → Periodic distillation promotes L2 facts → L3 (MEMORY.md)
  → Weekly compaction archives old L2 → L4
```

### 2.2 Beyond MEMORY.md (2026 Extensions & RFCs)

- **Episodic layer**: Daily logs + optional session JSONL indexing (QMD)
- **Semantic layer**: MEMORY.md + vector index + emerging structured KV
  (RFC #31656 proposes native `memory_store`/`memory_query` SQLite tools
  for runtime state—comments, metrics, schedules—avoiding Markdown parsing)
- **Hierarchical archive**: Weekly scripts move old dailies to `archive/YYYY/`
  after distillation; QMD can index them with scope rules
- **Graph layer** (Cognee/Mem0 plugins): Entities + relations extracted
  automatically from conversations and documents

---

## 3. Official MEMORY.md System

### 3.1 Markdown-First Architecture

OpenClaw's memory is **plain Markdown on disk**. Default layout under
`~/.openclaw/workspace` or per-agent workspace:

- **`MEMORY.md`** — Curated long-term semantic layer (preferences, facts,
  rules, routing index). Loaded **only** in the agent's main/private session.
  Capped at ~20k chars for bootstrap. Keep under 50 lines as a routing index.
- **`memory/YYYY-MM-DD.md`** — Episodic daily logs (append-only). Today +
  yesterday auto-loaded at session start.

### 3.2 Tools Exposed to Agents

| Tool | Function |
|------|----------|
| `memory_search` | Semantic/hybrid recall across all indexed memory |
| `memory_get` | Targeted read by `path#line` for specific facts |

Agents are explicitly instructed in system prompts: *"If something should
stick, write it to MEMORY.md or today's daily log."*

### 3.3 MEMORY.md Curation Rules

- Keep MEMORY.md as a **routing index**, not a dump of everything
- Max ~50 curated lines pointing to deeper files/sections
- Facts, preferences, decisions, and active project references only
- No conversational artifacts, debugging notes, or intermediate states
- Version-control in Git for rollback capability

---

## 4. Auto Pre-Compaction memoryFlush

Before any compaction, OpenClaw triggers a silent agentic turn to prevent
memory loss. This is the critical safety net that distinguishes OpenClaw from
naive context truncation.

### 4.1 How memoryFlush Works

1. Context approaches `softThresholdTokens` (default 4000–6000 tokens
   before limit)
2. OpenClaw injects a system prompt: *"Session nearing compaction. Store
   durable memories now."*
3. Agent writes lasting notes/decisions/preferences to daily log or MEMORY.md
4. Agent replies `NO_REPLY` if nothing to store
5. Compaction proceeds safely with durable facts preserved on disk

### 4.2 Configuration

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000,
          "systemPrompt": "Session nearing compaction. Store durable memories now.",
          "prompt": "Write any lasting notes/decisions/preferences to memory/YYYY-MM-DD.md or MEMORY.md. Reply with NO_REPLY if nothing to store."
        },
        "reserveTokensFloor": 20000
      }
    }
  }
}
```

- **softThresholdTokens**: 4000 (default) or 6000 (LumaDock recommendation
  for heavy workloads)
- **reserveTokensFloor**: 20000 tokens always kept free for agent operation
- Tracked in `sessions.json` — workspace must be writable
- Runs once per compaction cycle (not repeatedly)

---

## 5. RAG-Style Chunking Techniques

To prevent the 1M token bloat failure mode, OpenClaw squads use advanced
Retrieval-Augmented Generation (RAG) pipelines with careful chunking.

### 5.1 Chunking Strategies

**Default (sqlite-vec)**: 400-token chunks with 80-token overlap (sliding window).

**Semantic splitting** (community upgrade, GitHub #28027): Split at `##`
headings + inject title into every chunk. Results:
- MRR@10 jumps from 0.33 → 0.56
- Fact-miss rate drops 58% → 17% on structured MEMORY.md

**Additional options**:
- Section-aware splitting (preserves tables/lists intact)
- Temporal decay (30-day half-life on relevance scores)
- JSON-object splitting for structured data (used by data processing squads)

### 5.2 Chunking Comparison Table

| Strategy | Avg. Chunk Size | Recall Accuracy (MRR@10) | Cost/Token Efficiency | Best Use Case |
|----------|----------------|--------------------------|----------------------|---------------|
| **Naive Fixed-Size** | 1000 tokens | Low (~0.25, cuts mid-thought) | Poor (retrieves padding) | Quick prototyping only |
| **Sliding Window** | 400t + 80 overlap | Good (0.33 baseline) | Medium (minor overlap tax) | Chat history, conversational logs |
| **Semantic/Section-Aware** | Variable (200–800t) | Very High (0.56+) | Optimal (high signal-to-noise) | Structured Markdown, codebases |
| **JSON-Object Splitting** | Variable | Excellent for structured data | Optimal | Data logs, API responses |

### 5.3 The "Lost in the Middle" Problem

Using massive 2000-token chunks causes the LLM to ignore crucial facts buried
in the center of the chunk. The 400-token sweet spot avoids this by keeping
each chunk focused enough that the model attends to all content.

---

## 6. Vector DB Add-ons

OpenClaw's architecture requires **strict isolation per agentDir**. Never use
a shared index for multiple agents.

### 6.1 Provider Comparison

| Provider | Type | Install | Isolation | Recall Quality | Cost | Best For |
|----------|------|---------|-----------|---------------|------|----------|
| **sqlite-vec** | Local embedded | Auto-detected by OpenClaw | Per-agent `.sqlite` file | Baseline (hybrid search) | Zero | Simple squads, default |
| **QMD** | Local sidecar | `bun install -g https://github.com/tobi/qmd` | Per-agent XDG dirs | Highest local (BM25 + vec + LLM rerank) | Zero | Production recall |
| **Cognee** | Graph plugin | LumaDock tutorial | Per-agent graph DB | Excellent for relations | Medium (graph build) | Complex inter-agent deps |
| **Mem0** | Auto-extraction | LumaDock tutorial | ChromaDB (self-hosted/cloud) | Automatic long-term | Variable | Hands-off multi-agent |
| **Chroma** | Cloud/self-hosted | Standard install | Configurable | High at volume | API cost | Heavy cross-repo synthesis |
| **Pinecone** | Cloud only | API key | Cloud-managed | Highest at volume | Higher API cost | >100k chunks synthesis |
| **LanceDB** | Local | Docling RAG extension | Per-agent | Good | Zero | Document-heavy workloads |

### 6.2 sqlite-vec Schema (Simplified)

```sql
CREATE TABLE chunks (
  id TEXT PRIMARY KEY,
  path TEXT,
  text TEXT NOT NULL,
  embedding BLOB,          -- FLOAT[] via vec0 extension
  timestamp TEXT,
  metadata JSON
);
-- Hybrid index: FTS5 (keyword) + vec0 (vector)
```

Per-agent isolation by default: `~/.openclaw/memory/<agentId>.sqlite`

### 6.3 QMD Configuration

```json
{
  "memory": {
    "backend": "qmd",
    "qmd": {
      "update": { "interval": "5m", "debounceMs": 15000 },
      "limits": { "maxResults": 6, "timeoutMs": 4000 },
      "scope": {
        "default": "deny",
        "rules": [{ "action": "allow", "match": { "chatType": "direct" } }]
      }
    }
  }
}
```

QMD auto-falls back to sqlite-vec if unavailable. Superior recall with
BM25 + vector + LLM reranker sidecar.

---

## 7. Context Compression & Auto-Summarization

Agents must self-monitor their context pressure. The three-tier summarization
cadence is the production standard:

### 7.1 Three-Tier Summarization Cadence

| Cadence | Trigger | Action | Owner |
|---------|---------|--------|-------|
| **Micro-compaction** | Every 10 turns or >70% window | Agent self-prompts `/status`, distills key facts from working memory | Individual agent |
| **Daily distillation** | Cron/heartbeat (e.g., 2:00 AM) | Summarize day's log → promote facts to MEMORY.md or QMD digest | Individual agent or Lead |
| **Weekly compaction** | Monday cron or Lead skill | Consolidate 7 dailies into one digest, archive old logs to `archive/YYYY/` | Lead agent (global) |

### 7.2 Real-World Compaction Results

Community benchmarks show dramatic improvements:

```
Before (no flush/compaction):
  Day 1: 40k tokens → Day 7: 1M+ bloat/crash

After (flush + QMD + weekly compact):
  Day 1: 40k tokens → Day 7: ~180k sustained (50–70% savings)
```

Production example: 180 raw daily files → 26 digests after 6 months;
900 KB raw → 130–200 KB compressed. Total index stays under 200 KB/agent.

### 7.3 Auto-Summarize Prompt for Lead Agent

From Gemini's production pattern (validated against Grok configs):

```json
{
  "system_prompt": "You are the Lead Orchestrator. Review the attached 10-turn episodic log from the [Coder] agent. Extract ONLY hard facts, finalized decisions, and uncompleted blockers. Discard all conversational pleasantries and intermediate debugging steps. Output in strict JSON format under 'key_facts'. Do not exceed 150 words."
}
```

### 7.4 Context Pruning Configuration

```json
{
  "contextPruning": {
    "mode": "cache-ttl",
    "ttl": "45m"
  }
}
```

Older context entries expire after 45 minutes, keeping the working window
fresh while relying on vector search for historical recall.

---

## 8. Lead-as-CEO Memory Oversight

### 8.1 The Lead Never Loads Full Squad Context

The Lead (orchestrator) agent operates on **summaries only**. It triggers
global compaction and reads only QMD summaries or targeted `memory_search`
results. This is essential for keeping the Lead's context window pristine
for high-level decision-making.

### 8.2 Five Core Memory Responsibilities

The Lead acts as **CEO of squad memory management**:

1. **Task Decomposition with Memory Awareness**: When breaking tasks, the Lead
   considers which agents have relevant memory/context and routes accordingly,
   using bindings and `sessions_send` for loose, per-task routing.

2. **Global Compaction Triggers**: The Lead triggers squad-wide compaction via
   custom skill or cron when any agent approaches context pressure.

3. **Result Synthesis from Summaries**: Collects grunt outputs via
   `sessions_send`, evaluates quality from summaries (never full histories),
   and synthesizes the final user-facing response.

4. **Autonomous Capability Grants for Memory Tools**: The Lead can
   **autonomously grant** memory-related tools and backends to sub-agents:
   - **Low-risk grants** (read-only memory_search, QMD query access, local
     sqlite-vec) are issued autonomously with no human approval.
   - **High-risk grants** (write access to shared memory stores, cloud vector
     DB API keys, cross-agent memory scope permissions) require **one-time
     human approval** only. Once approved, the Lead can re-issue at will.
   - All grant decisions are logged to MEMORY.md for audit.

5. **Memory Hygiene Enforcement**: Monitors per-agent memory health and
   triggers compaction, pruning, or archive operations as needed.

### 8.3 Lead Memory Oversight Skill

Add to Lead's SKILL.md or AGENTS.md:

```markdown
Self-monitor squad context pressure every 10 turns or >70% window.
1. memory_search "recent key facts/decisions" across agents (scope: direct only).
2. Distill and write summaries to shared digest or per-agent MEMORY.md.
3. Trigger /compact on high-pressure agents.
4. Reply ONLY with summary. Do NOT inject full histories.
```

### 8.4 Why Loose Coordination Matters for Memory

Tight coordination (rigid pipelines, shared state machines) creates **memory
coupling** that destroys the layered architecture:

- Shared memory stores between agents cause **privacy bleed** and noisy recall
- Rigid pipelines require full context handoffs that bloat the window
- State machines accumulate coordination overhead in the context

Loose coordination preserves memory independence:
- Each agent owns its memory stack (L1–L4) independently
- The Lead reads summaries, not full histories
- `sessions_send` passes results, not shared mutable state
- Binding-based dispatch handles 80%+ of routing without memory coupling
- No fixed DAGs—the Lead routes per-task at runtime based on current context

> **Design principle**: The cheapest memory operation is the one that never
> happens. Loose coordination minimizes cross-agent memory traffic.

---

## 9. Integration with Independence & Privacy

### 9.1 Per-Agent Memory Isolation

Every agent gets its own workspace + separate SQLite/QMD DB:
`~/.openclaw/agents/<agentId>/...`

- No shared index by default
- QMD scope rules enforce isolation (e.g., deny group channels)
- Privacy bleed is **impossible** unless you deliberately share workspaces

### 9.2 The Cardinal Sin: Shared Vector DB

> If Agent A (Personal Finance) and Agent B (Twitter Shitposter) share a vector
> index, Agent B might accidentally retrieve and tweet your bank balance.
> — Gemini source (validated in production incidents)

**Fix**: Strict `agentDir` isolation. One sqlite-vec/QMD DB per agent. Period.

### 9.3 Cross-Agent Memory Access (When Needed)

When agents legitimately need to share context:
- Lead performs `memory_search` with `scope: direct` across agents
- Results are summarized before injection (never raw histories)
- Explicit allowlist in QMD scope rules for specific cross-agent queries
- Shared files (status.md, proposals.md) in designated shared workspace

---

## 10. Integration with Cost Optimization

### 10.1 Local-First Memory = Zero Recall Cost

| Backend | Recall Cost | Latency | Privacy |
|---------|------------|---------|---------|
| sqlite-vec (local) | $0 | <10ms | Full |
| QMD (local sidecar) | $0 | <10ms | Full |
| Ollama embeddings (local) | $0 | ~50ms | Full |
| Chroma (cloud) | API pricing | ~100ms | Low |
| Pinecone (cloud) | API pricing | ~50ms | Low |

### 10.2 Real Cost Savings

- Pre-flush + pruning + hybrid search halves daily spend
  (e.g., $4.20 → $1.80 in one tracked case)
- 19-agent LumaDock fleets: ~$6/mo with local everything
- Prompt caching (model-dependent) + compaction further reduces input tokens
- Cloud vector DB **only** for heavy synthesis or >100k chunks

### 10.3 The Token Budget Breakdown

For a 19-agent squad without memory management:
- Each agent accumulates ~50k tokens/day in context
- 19 agents × 50k × 30 days = 28.5M tokens/month context overhead
- At cloud API pricing: **catastrophic**

With proper layered memory:
- Sustained ~15k tokens/agent working context
- 19 × 15k = 285k total active context (99% reduction)
- Vector search handles recall at zero marginal cost

---

## 11. Integration with Prompt Engineering & Autonomy

### 11.1 Memory-Aware Agent Instructions

Embed in every agent's AGENTS.md or SOUL.md:

```markdown
## Memory Protocol
- Before any long task, use memory_search for relevant context
- Monitor context with /status — if approaching limit, proactively write
  facts and request_summarization
- If something should stick, write it to MEMORY.md or today's daily log
- Never rely on "remembering" — if it's not on disk, it doesn't exist
```

### 11.2 Self-Triggered Compaction

Agents self-trigger flush/compaction via tools. No shared state except
explicit Lead orchestration. The autonomy pattern:

1. Agent monitors own context pressure (via /status or token estimate)
2. At >70% capacity: writes key facts to daily log
3. At >80% capacity: triggers self-compaction
4. If blocked: escalates to Lead for assistance

---

## 12. Real 2026 Production Examples

### 12.1 The 88k-Word Book Squad (Reddit r/openclaw, March 2026)

- **Squad**: 5–9 agents (Director + research Gemini + writing Sonnet + review
  DeepSeek). Some reports cite 4 agents with similar architecture.
- **Memory**: Per-agent RAG with sqlite-vec, 400-token chunks. Markdown/git
  for cross-agent coordination.
- **Key result**: The "Editor" agent successfully recalled a plot point
  generated 60,000 words prior by retrieving exactly three relevant semantic
  chunks rather than reading the whole manuscript.
- **Token savings**: 74% reduction per generation step via chunked recall
  vs full-context injection.
- **Timeline**: Completed in 48 hours (planned 8 days). Isolated sessions +
  workspace persistence prevented any single agent from bloating to 1M+ tokens.

### 12.2 LumaDock 19-Agent Fleet

- **Setup**: HA Kubernetes + per-agent sandboxes + QMD/Cognee on 16GB NVMe VPS
- **Memory approach**: Hybrid—local sqlite-vec for cheap instant recall of
  codebase syntax, cloud Chroma for heavy cross-repository synthesis
- **Compaction**: Weekly compaction + nightly "dream" distillation
- **Results**: Total index stays under 200 KB/agent. 70% token reduction vs
  naive setups. ~$6/mo with local everything.
- **Cross-agent messaging**: Native `agentToAgent` peer messaging
  (`agent:<agentId>:<key>`) for coordination without shared memory

### 12.3 shenhao-stu 9-Agent Data Squad

- **Architecture**: One-command multi-agent with group routing
- **Memory**: `HistoryLimit: 50` per session + per-agent memory stores.
  Production routing rules eliminated cross-talk bloat.
- **Data handling**: Because data logs are highly structured, uses aggressive
  JSON-object splitting. Token savings: reduced context bloat from 400k tokens
  down to a persistent 12k working memory.
- **Isolation**: Isolated sessions + routing rules prevent cross-agent
  memory pollution

### 12.4 Token Savings Visualization (Community Benchmarks)

```
Day  | No Management | With Full Stack | Savings
-----|---------------|-----------------|--------
  1  |    40k tokens |      40k tokens |    0%
  2  |   120k tokens |      65k tokens |   46%
  3  |   280k tokens |      95k tokens |   66%
  5  |   600k tokens |     140k tokens |   77%
  7  | 1M+ (crash)   |     180k stable |   82%+
 30  |     N/A       |     180k stable |   N/A
```

The key insight: with proper management, context **stabilizes** rather than
growing linearly. The 180k ceiling is sustainable indefinitely.

---

## 13. Common Failure Modes & Anti-Patterns

### 13.1 Failure Mode Table

| Failure Mode | Symptom | Root Cause | Fix |
|-------------|---------|-----------|-----|
| **1M Token Bloat** | Crashes, $50/day burn, inference halt | No compaction or memoryFlush | Enable memoryFlush + weekly compaction |
| **Privacy Bleed** | Agent A retrieves Agent B's data | Shared vector DB/index | Strict agentDir isolation, one DB per agent |
| **Lost Facts** | Agent forgets critical decisions | Naive 1000+ token chunks, "lost in middle" | 400t chunks + semantic splitting |
| **Noisy Recall** | Irrelevant results from memory_search | Uncurated MEMORY.md, no temporal decay | Keep MEMORY.md under 50 lines, enable decay |
| **Token Waste** | High cost, slow responses | Over-injecting full MEMORY.md every turn | Use recall-only mode, load on demand |
| **Weak Search** | Poor retrieval quality | Disabled auto-index, no QMD | Install QMD, enable hybrid search |
| **Cross-Talk Bloat** | Agents polluted by other agents' context | Missing routing rules, shared sessions | Per-agent isolation + scope rules |
| **Compaction Data Loss** | Facts lost after window compression | memoryFlush disabled | Enable memoryFlush with proper threshold |

### 13.2 The Context Pressure Death Spiral

Without management, agents enter a death spiral:
1. Context grows with every turn
2. Retrieval gets noisier as context bloats
3. Agent compensates by injecting more context for clarity
4. Context grows faster → inference slows → costs spike
5. Eventually: OOM, API rate limits, or $50+/day burn

The memoryFlush + compaction + layered architecture breaks this spiral by
enforcing a hard ceiling on active context while preserving recall quality
through vector search.

---

## 14. Step-by-Step Setup Commands & Full Configs

### 14.1 Install sqlite-vec (Usually Auto-Detected)

```bash
# macOS
brew install sqlite

# Verify OpenClaw detects vec extension
openclaw doctor --check-memory
```

### 14.2 Install QMD Backend (Recommended for Production)

```bash
bun install -g https://github.com/tobi/qmd

# Set up per-agent XDG directories
export XDG_CONFIG_HOME=~/.openclaw/agents/main/qmd/xdg-config
export XDG_CACHE_HOME=~/.openclaw/agents/main/qmd/xdg-cache

# Warm index and test
qmd update && qmd embed && qmd query "test" -c memory-root
```

### 14.3 Full Production Config (`~/.openclaw/openclaw.json`)

```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "enabled": true,
        "provider": "auto",
        "hybrid": {
          "enabled": true,
          "vectorWeight": 0.7,
          "textWeight": 0.3,
          "mmr": { "enabled": true, "lambda": 0.7 },
          "temporalDecay": { "halfLifeDays": 30 }
        }
      },
      "memory": {
        "backend": "qmd",
        "citations": "auto",
        "qmd": {
          "update": { "interval": "5m", "debounceMs": 15000 },
          "limits": { "maxResults": 6, "timeoutMs": 4000 },
          "scope": {
            "default": "deny",
            "rules": [
              { "action": "allow", "match": { "chatType": "direct" } }
            ]
          }
        }
      },
      "compaction": {
        "mode": "safeguard",
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000
        }
      },
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "45m"
      }
    }
  }
}
```

### 14.4 Per-Agent RAG Configuration

For agents needing custom chunking (e.g., the book squad):

```json
{
  "memory": {
    "provider": "sqlite-vec",
    "db_path": "~/.openclaw/agents/main/vector.db",
    "chunking": {
      "strategy": "semantic",
      "size": 400,
      "overlap": 80
    },
    "retrieval": {
      "top_k": 5,
      "min_score": 0.75
    }
  }
}
```

### 14.5 Weekly Compaction Cron

```bash
# Via OpenClaw heartbeat
openclaw cron add \
  --name "Weekly compaction" \
  --cron "0 9 * * 1" \
  --message "Weekly memory review: distill dailies, archive old logs, compact indexes."

# Or via system cron
crontab -e
# Add: 0 2 * * * openclaw memory index --all && openclaw memory compact
```

### 14.6 Auto-Summarize Skill for Lead

Create as a skill or add to Lead's AGENTS.md:

```markdown
# Auto-Summarize Skill
Trigger: Every 10 turns or daily cron.
1. memory_search "recent key facts/decisions" across direct agents.
2. Extract ONLY hard facts, finalized decisions, uncompleted blockers.
3. Discard conversational pleasantries and debugging steps.
4. Write summary to shared digest or per-agent MEMORY.md.
5. Trigger /compact on high-pressure agents.
6. Reply ONLY with summary. Do NOT inject full histories.
Max output: 150 words per agent summary.
```

---

## 15. Comparison Tables

### 15.1 Chunking & Backend Trade-offs

| Approach | Chunk Method | Recall (MRR@10) | Cost Impact | Best For |
|----------|-------------|-----------------|-------------|----------|
| **Default sqlite-vec** | 400t + 80 overlap | Baseline (0.33) | Zero (local) | Simple squads |
| **Semantic/section-aware** | Heading split + title inject | +70% (0.56) | Same index size | Structured Markdown |
| **QMD Hybrid + rerank** | BM25 + vec + LLM | Highest local | Zero (local sidecar) | Production recall |
| **Cognee Graph** | Relational entities | Excellent for relations | Medium (graph build) | Complex inter-agent deps |
| **Mem0 Auto + Chroma** | Fact extraction | Automatic long-term | Variable (extraction) | Hands-off multi-agent |
| **Pinecone (cloud)** | Any + scale | Highest at volume | Higher API cost | >100k chunks synthesis |

### 15.2 Local vs Cloud Memory Pros/Cons

**Local sqlite-vec/QMD**:
- Pros: Zero cost, full privacy, <10ms recall, portable, no network dependency
- Cons: Host CPU for large indexes, scale limit ~100k chunks before slowdown

**Hierarchical memory (layered architecture)**:
- Pros: Efficient injection, clean separation, sustainable long-term
- Cons: Requires curation discipline, initial setup investment

**Per-agent vs shared memory**:
- Per-agent pros: Independence, privacy, no cross-contamination
- Per-agent cons: Duplication if not orchestrated by Lead
- Shared: **Anti-pattern** in nearly all cases

---

## 16. Practical Recommendations

### Getting Started (March 2026)

1. **Start with official defaults + enable memoryFlush**: The single most
   impactful change. Prevents compaction data loss with one config toggle.

2. **Install QMD for production recall**: The BM25 + vector + reranker
   combination provides the best local recall quality available.

3. **Instruct every agent with self-monitoring prompts**: Add to AGENTS.md:
   *"Before any long task, use memory_search. Monitor context with /status.
   If approaching limit, proactively write facts."*

4. **Enable semantic/section-aware chunking**: The MRR improvement from
   0.33 → 0.56 is free—just configure the chunking strategy.

5. **Weekly review**: Run `openclaw memory status` + archive old dailies.
   This prevents the slow accumulation that eventually causes bloat.

### Scaling to 5+ Agents

6. **Add Cognee or Mem0 via LumaDock tutorials**: For squads needing
   entity-relationship tracking or automatic fact extraction.

7. **Deploy Lead memory oversight skill**: The Lead monitors squad-wide
   context pressure and triggers compaction as needed.

8. **Use shenhao-stu kit patterns**: Per-agent isolation + HistoryLimit +
   routing rules eliminate cross-talk bloat at scale.

### For 19-Agent or Book-Scale Squads

9. **LumaDock VPS + per-agent isolation + Lead orchestration**: The proven
   stack for large deployments. Weekly compaction + nightly distillation.

10. **Monitor spend**: If daily cost >$2 or context warnings appear, tighten
    `softThresholdTokens` and add section-aware chunking.

11. **Keep MEMORY.md as routing index**: Under 50 curated lines. Point to
    deeper files rather than stuffing everything into one file.

12. **Trust the vector search**: Don't inject full MEMORY.md every turn.
    Use `memory_search` on demand and let the retrieval system do its job.

---

## Summary

This setup turns OpenClaw from a "context-forgetting tool" into a
production-grade long-term memory squad with:

- **Sub-200k sustained context** (vs 1M+ bloat without management)
- **50–70% cost reduction** via local-first memory and compaction
- **Zero privacy bleed** via per-agent isolation
- **Recall quality**: MRR@10 of 0.56+ with semantic chunking + QMD
- **Lead-as-CEO oversight**: Loose coordination where the Lead monitors
  squad memory health, triggers compaction, autonomously grants memory
  tools to growing agents, and synthesizes from summaries only

The layered architecture (Working → Episodic → Semantic → Archive) with
memoryFlush safety nets and weekly compaction is the 2026 production
standard. Deploy the config from §14.3 and your squad will outlive any
single context window.

---

*Master research file. Synthesized from Grok (primary) + Gemini sources.*
*Strengthened: Lead-as-CEO memory oversight, loose coordination rationale.*
*Production configs validated against LumaDock, shenhao-stu, and community reports.*
