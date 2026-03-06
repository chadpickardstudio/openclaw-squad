# 13. Audit & Observability Stack — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, official docs, GitHub PRs, LumaDock
> **Last verified**: March 2026 (OpenClaw v2026.3.x, diagnostics-otel plugin, LangFuse free tier)

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Full 2026 Observability Stack](#2-the-full-2026-observability-stack)
3. [Tracing Every Call](#3-tracing-every-call)
4. [Spotting Token Hogs & Cost Spikes](#4-spotting-token-hogs--cost-spikes)
5. [Dashboards & Alerts](#5-dashboards--alerts)
6. [Lead-as-CEO Observability Role](#6-lead-as-ceo-observability-role)
7. [Integration with Independence & Privacy](#7-integration-with-independence--privacy)
8. [Integration with Cost Optimization & Hybrid](#8-integration-with-cost-optimization--hybrid)
9. [Integration with Error Recovery & Memory Hygiene](#9-integration-with-error-recovery--memory-hygiene)
10. [Real 2026 Production Examples](#10-real-2026-production-examples)
11. [Common Failure Modes & Anti-Patterns](#11-common-failure-modes--anti-patterns)
12. [Step-by-Step Setup Commands](#12-step-by-step-setup-commands)
13. [Practical Recommendations](#13-practical-recommendations)

---

## 1. Overview

OpenClaw's observability has matured into a production-grade stack by March
2026. Operating a multi-agent squad without reliable observability is flying
blind—the community learned this the hard way with invisible $750 API bills
and cascading "vibe coding" loops.

The modern standard relies on a **triad**:
- **Local State** (Markdown files): Human-readable, crash-recoverable
- **OpenTelemetry (OTel)**: Distributed tracing across agents and handoffs
- **LangFuse**: LLM-native analysis, cost tracking, and alerting

Core is built-in structured JSONL logging + diagnostics events, with native
OTel export via the `diagnostics-otel` plugin (PRs #12897, #4255, #3201
fixed module/dependency issues). LLM-specific richness comes from LangFuse
via OpenRouter Broadcast or OTel/custom exporter.

This stack traces **every meaningful call**: LLM generations, tool executions,
`sessions_send` handoffs, model switches, memory/file access, and message
flow. It spots token hogs, cost spikes, performance degradation, and security
events in real time.

---

## 2. The Full 2026 Observability Stack

### 2.1 Stack Components

| Component | Role | Data Source | Storage |
|-----------|------|------------|---------|
| **Built-in JSONL Logs** | Raw event capture | `/tmp/openclaw/openclaw-YYYY-MM-DD.log` + session transcripts | Local disk |
| **Markdown State** | Human-readable recovery | `plan.md`, `error.md`, `MEMORY.md` per agent | Agent workspace |
| **Session Transcripts** | Full audit trails | `~/.openclaw/agents/<agentId>/sessions/*.jsonl` | Per-agent disk |
| **OpenTelemetry** | Distributed tracing + metrics | Traces (spans), metrics (counters/histograms), logs | OTLP backend |
| **LangFuse** | LLM-native analysis | Prompts, completions, tool calls, costs, evals | Cloud or self-hosted Postgres |
| **Prometheus/Grafana** | Infrastructure metrics | CPU, RAM, queue depth, token burn rate | Time-series DB |

### 2.2 Basic Logs vs Full Stack Comparison

| Aspect | Basic Logs (JSONL + console) | Full Stack (OTel + LangFuse) | Winner |
|--------|------------------------------|------------------------------|--------|
| **Visibility** | Raw events, manual grep | Nested traces, prompts, tool chains, costs, latencies | Full stack |
| **Token/Cost Spotting** | Manual session_status aggregation | Real-time metrics + dashboards + auto-alerts | Full stack (90% faster) |
| **Tracing Coverage** | Model calls + sessions (indirect) | Every LLM/tool/session/handoff/memory access + tags | Full stack |
| **Privacy/Independence** | Shared files (risky) | Per-agent private + Lead read-only filters | Full stack |
| **Alerts & Real-time** | None | Grafana/LangFuse rules → Telegram/Lead | Full stack |
| **Perf Overhead** | Low | Configurable sampling (0.2 default) + filters | Tunable |
| **Setup Effort** | Zero | 5–10 min (plugin + keys) | Acceptable |
| **Multi-Agent Tracing** | Hard to correlate | Automatic Trace IDs across sessions_send | Full stack |
| **Error Handling** | Buried in terminal scroll | Auto-linked to error.md + LangFuse UI | Full stack |

### 2.3 Pros/Cons of Full Stack

**Pros**:
- Real-time token-hog detection (memory.md bloat fixed in hours, not days)
- Cost savings 50–90% through visibility-driven optimization
- Security event spotting (anomalous tool calls, workspace escapes)
- Lead oversight without compromising agent independence
- Error recovery auto-linking (trace ID → error.md → MEMORY.md lesson)

**Cons**:
- Slight perf hit on high-volume squads (mitigate with `sampleRate: 0.2`)
- Learning curve for OTel/LangFuse queries
- Self-hosted LangFuse needs ~1GB RAM on VPS

### 2.4 Built-in Diagnostics Events

OpenClaw emits structured events for:
- `model.usage` — Token counts, model, cost
- `webhook.processed` — Inbound message handling
- `message.queued` / `message.processed` — Lane queue activity
- `queue.lane.*` — Lane depth, contention, timeouts
- `session.state` / `session.stuck` — Session lifecycle

---

## 3. Tracing Every Call

### 3.1 What Gets Traced

OTel spans + LangFuse observations capture every meaningful operation:

| Event Type | Attributes Captured | Linkage |
|-----------|-------------------|---------|
| **LLM Generation** | Model, provider, input/output tokens, cost, latency | Parent trace |
| **Tool Calls** | Tool name, input params, output, duration, error | Nested under generation |
| **sessions_send / Handoffs** | sessionKey, sessionId, target agent | Traceparent header injection |
| **sessions_spawn** | Sub-agent ID, model, spawn depth | Linked to parent trace |
| **Model Switches** | Provider/model attributes, fallback reason | Tagged on generation span |
| **Memory Access** | File path, lines loaded, workspace tool | Nested span |
| **Error Events** | Error code, linked error.md update | Span status + custom attribute |

### 3.2 The Lifecycle of a Trace

```
User message arrives
  → Gateway starts LangFuse Trace (traceId: abc123)
  → Routing: assigned to agent's Lane Queue
     Span: queue.lane.assign (agentId, lane, depth)
  → Agent generates response
     Span: model.usage (Claude-3.5, 12k in / 2k out, $0.18, 3.2s)
     ├── Tool: web_search (query=..., result=..., tokens=450)
     ├── Tool: memory_search (query=..., results=3, tokens=200)
     └── Memory read: MEMORY.md (lines 42-89 loaded)
  → Agent hands off via sessions_send
     Span: handoff (sessionKey=def456, target=specialist-agent)
     Traceparent header injected → new agent's trace linked
  → Specialist processes → returns result
  → Lead synthesizes final output
     Span: synthesis (model, tokens, cost)
  → Trace complete
```

### 3.3 Example LangFuse Trace (Dashboard View)

```
Trace: squad-main-2026-03-04-12:15 (sessionId: abc123, agent: coordinator)
├── Span: model.usage (Claude-3.5, 12k input / 2k output, $0.18, 3.2s)
│   ├── Tool: web_search (query=..., result=..., tokens=450)
│   ├── Handoff: sessions_send → specialist-agent (sessionKey=def456)
│   └── Memory read: MEMORY.md (lines 42-89 loaded)
├── Span: error (code=429, linked to error.md update)
└── Evaluation: cost spike flag → alert to Lead
```

### 3.4 Custom Tracing via Agent Instructions

Instruct agents (via AGENTS.md or skills) to emit trace context:
- On failure: append to `error.md` with LangFuse trace ID or OTel span ID
- On lesson learned: write to `MEMORY.md` with trace reference
- This creates automatic linkage between observability data and
  human-readable recovery files

---

## 4. Spotting Token Hogs & Cost Spikes

### 4.1 The "Token Hog" Problem

In late January 2026, the community tracked a massive issue: agents doing
code review entered non-deterministic reflection loops, continuously
appending entire codebases to the context window until `maxSpawnDepth` was
hit, burning millions of tokens.

**Real performance metrics (LumaDock + community 2026)**:
- Unoptimized cron/job: 25k tokens/run (MEMORY.md duplication every prompt)
  → $50–150/month per agent
- With tracing + fixes: **70–90% reduction** via cheap models/caching/isolated
  sessions
- Browser automation: 150k+ tokens/job → fixed to <20k with snapshot pruning
- Multi-agent handoff overhead: 3.5× without tagging → <1.2× with model
  tiering + tracing

### 4.2 Detection Methods

| Method | What It Catches | Response Time |
|--------|----------------|---------------|
| **LangFuse Cost/Trace dashboard** | Per-trace cost spikes, token histograms | Real-time |
| **OTel + Prometheus** | `openclaw_cost_usd_total`, `openclaw_tokens`, `openclaw_run_duration_ms` | Real-time with alerts |
| **Anomaly detection** | Spikes >2σ from baseline | Automated |
| **Queue depth monitoring** | `openclaw_lane_queue_depth > 5` | Real-time |
| **Token consumption rate** | `token_consumption_rate > 10k/min` | Alertable |
| **Session.stuck counters** | Cascading handoff failures | Real-time |

### 4.3 Resolution Techniques

- **Hard context resets** ("Ralph Wiggum technique"): Force context window
  clear when token accumulation exceeds threshold
- **Enforce maxSpawnDepth=1** for sub-agents (prevents recursive loops)
- **Summarize MEMORY.md** before injection (not full file every prompt)
- **Snapshot pruning** for browser automation (keep only relevant DOM)
- **Model tiering**: Cheap models for cron/heartbeats, premium for reasoning

---

## 5. Dashboards & Alerts

### 5.1 LangFuse Dashboard (Free Tier)

LangFuse free tier handles squad-scale (unlimited traces, basic alerts).
Self-host via Docker for air-gapped VPS (~1GB RAM).

**Dashboard simulation (19-agent squad)**:
```
LangFuse Dashboard – Squad Observability (March 2026)
Traces Today: 1,248 | Total Cost: $2.34 | Token Hogs Detected: 3

Top Spenders:
1. agent:researcher (Sonnet-3.5) - $1.10 (47%) - Alert: Nominal
2. agent:lead_orchestrator (Opus) - $0.65 (28%) - Alert: Nominal
3. agent:tester (Local-Qwen)     - $0.00 (0%)  - Alert: High Latency

Top Trace: specialist-agent (Claude) – 45k tokens (memory bloat)
Fix: summarize MEMORY.md
Alerts Fired: 2 (cost spike + stuck session) → Lead notified
```

### 5.2 Prometheus/Grafana (Infrastructure)

LumaDock production uses OTel Collector → Prometheus → Grafana with panels:
- Per-agent token spend
- Latency p95
- Error rate
- Tool call volume
- Queue depth

**Example PromQL queries**:

```promql
# Alert on cost spike: >$0.05 per 5 minutes per agent
sum(rate(openclaw_cost_usd_total[5m])) by (model, agent) > 0.05

# Queue depth warning
openclaw_queue_depth{lane="subagent"} > 6

# Context pressure detection
increase(openclaw_run_duration_seconds[1h]) > 1.5
```

### 5.3 Alert Configuration

```yaml
rules:
  - alert: OpenClawCostSpike
    expr: sum(rate(openclaw_cost_usd_total[5m])) by (agent) > 0.05
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Agent {{ $labels.agent }} cost spike detected."

  - alert: OpenClawQueueParalysis
    expr: openclaw_queue_depth{lane="subagent"} > 6
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Subagent queue blocked. Check for stale lock files."

  - alert: AgentBurnoutDrift
    expr: increase(openclaw_run_duration_seconds[1h]) > 1.5
    labels:
      severity: warning
    annotations:
      summary: "Context saturation detected. Trigger summarization."

  - alert: SessionStuck
    expr: openclaw_session_stuck_total > 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Stuck session detected. Check handoff chain."
```

### 5.4 Alert Routing

Alerts fire via:
- Grafana → Telegram/Discord webhook → human notification
- LangFuse rules → OpenClaw skill → Lead agent notification
- Custom cron → `sessions_send` to Lead for autonomous response

---

## 6. Lead-as-CEO Observability Role

### 6.1 The Lead as Observability CEO

The Lead agent is not just a task router—it is the **CEO of squad
observability**. The Lead uses tracing and metrics to make intelligent
decisions about squad health, routing, and capability management.

Five core observability responsibilities:

1. **Audit-Driven Task Routing**: The Lead checks agent health metrics
   before routing tasks. An agent with high error rates or cost spikes
   gets fewer tasks until recovery. Routes via bindings and `sessions_send`
   —loose, per-task decisions based on current observability data.

2. **Read-Only Dashboard Access**: The Lead queries the LangFuse API
   (via secure read-only token) to check token spend and success rates
   of specialist agents. Aggregated view only—per-agent traces remain
   private.

3. **Autonomous Capability Grants Based on Metrics**: The Lead can
   **autonomously grant extra tools, API keys, debug access, and elevated
   permissions** to agents based on observability data:
   - **Low-risk grants** (read-only dashboard access, debug_mode toggle,
     diagnostics flags, sampling rate changes) are issued autonomously.
   - **High-risk grants** (production API keys, exec permissions, external
     service credentials) require **one-time human approval** only. Once
     approved, the Lead re-issues at will.
   - All grants logged to MEMORY.md with trace ID for full auditability.

4. **Deep Audit Triggers**: If the Lead detects a specialist failing
   repeatedly (consecutive exec errors, cost >20% over baseline), it can:
   - Read the specialist's `error.md` file
   - Query LangFuse for the failing trace chain
   - Grant temporary `debug_mode` to the specialist
   - Or halt the specialist and route tasks elsewhere

5. **Human-in-the-Loop Escalation**: If cost spikes >20% over baseline or
   security anomalies detected, the Lead halts the Lane Queue and messages
   the human on WhatsApp/Telegram for review. Only for critical events.

### 6.2 Why Loose Coordination Enables Better Observability

Loose coordination makes observability **more effective**, not less:

- **No fixed DAGs to trace**: Loose routing creates simpler, per-task trace
  trees rather than complex pipeline graphs. Each trace is self-contained.
- **Prevents over-engineering**: Rigid observability pipelines (alert → auto-
  remediate → auto-scale) create their own failure modes. The Lead makes
  human-like judgment calls based on metrics.
- **Prevents straight-jacket automations**: Auto-remediation scripts that
  kill agents or force restarts based on thresholds are dangerous. The Lead
  evaluates context before acting.
- **Binding-based dispatch**: 80%+ of routing is static and predictable.
  The Lead only investigates anomalies in the remaining 20%.
- **Serial Lane Queue**: Makes traces linear and easy to follow. No
  concurrent-execution debugging nightmares.

> **Design principle**: Observability should inform decisions, not automate
> them. The Lead reads the data and decides—this is safer than auto-
> remediation at squad scale.

### 6.3 Lead Audit Skill

```javascript
export default {
  name: "audit_squad_cost",
  description: "Fetches token usage and cost for a specific agent from LangFuse.",
  parameters: { agentId: "string" },
  execute: async ({ agentId }) => {
    const response = await fetch(
      `https://cloud.langfuse.com/api/public/metrics?tags=agent:${agentId}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.LANGFUSE_READ_ONLY_KEY}`
        }
      }
    );
    const data = await response.json();
    return `Agent ${agentId}: $${data.total_cost_usd} in last 24h, ` +
           `${data.total_tokens} tokens, ${data.error_count} errors.`;
  }
}
```

---

## 7. Integration with Independence & Privacy

### 7.1 The Agent Boundary

Never share `agentDir` across agents. For true multi-tenant privacy:
- Per-agent `~/.openclaw/agents/<id>/` files
- Private LangFuse projects or tag-based filters per agent
- Lead gets aggregated view only via queries—not raw trace access
- Individual agents access only their own workspace and traces

### 7.2 LangFuse Tagging for Privacy

Tag traces using `agentId` to enable filtered views:
- Lead sees: aggregated cost, error rates, latency by agent tag
- Specialist sees: only own traces (RBAC filter by agent tag)
- No cross-agent data leakage through observability layer

### 7.3 Security Monitoring

- Anomalous tool calls (filesystem access outside workspace)
- `session.stuck` counters for cascading handoff failures
- Redact-sensitive logs via `logging.redactSensitive: "tools"`
- Community tools: `podwatch` for security event monitoring

---

## 8. Integration with Cost Optimization & Hybrid

### 8.1 Model Tagging for Cost Visibility

Tag traces by model provider to separate local vs cloud spend:
- `openclaw.provider=local` / `openclaw.provider=cloud`
- `model_env: local_mac` / `model_env: cloud_anthropic`

This enables dashboards that show:
- What percentage of tokens go to local (free) vs cloud (paid)
- Which agents are the biggest cloud spenders
- Where model tiering could save money

### 8.2 LiteLLM Proxy Integration

Use LiteLLM proxy for:
- Unified caching across providers
- Automatic fallbacks with cost tracking
- Per-model cost attribution in traces

### 8.3 Cost Optimization Through Visibility

Real savings from observability-driven optimization:
- shenhao-stu token-hog fix: full MEMORY.md injected every prompt (25k
  tokens/cron) → summarize + exclude via skill → **92% cost drop**
- Browser automation fix: 150k tokens/job → <20k with snapshot pruning
- LumaDock 19-agent fleet: peak 340k tokens/day → fixed via isolated
  sessions + caching → **78% monthly spend reduction**

---

## 9. Integration with Error Recovery & Memory Hygiene

### 9.1 Auto-Linking Errors to Traces

When a span fails in OTel:
1. Trigger webhook that writes failure context to the agent's `error.md`
2. Include trace ID / span ID for linkage
3. During next cycle, agent reads `error.md`
4. Agent extracts lesson, writes to `MEMORY.md` with trace reference
5. Agent clears resolved entries from `error.md`

This creates a **closed-loop recovery system**: observability detects the
error → agent documents the lesson → lesson prevents recurrence.

### 9.2 Memory Hygiene Monitoring

Track via observability:
- MEMORY.md file size (growing = token waste risk)
- Daily log accumulation rate
- Compaction frequency and effectiveness
- Context pressure trends over time

---

## 10. Real 2026 Production Examples

### 10.1 LumaDock 19-Agent LangFuse Setup

- **Infrastructure**: VPS with OTel Collector → LangFuse + Grafana
- **Dashboard**: Per-agent cost (cheap models for crons, premium for
  reasoning). One dashboard per squad + aggregated Lead view.
- **Token-hog detection**: Cut monthly spend 78%
- **Metrics**: "19 agents | Peak: 340k tokens/day → fixed via isolated
  sessions + caching"
- **LangFuse free tier**: Handles full squad with <5s query latency

**LumaDock architecture** (Gemini detail): Gateway on $4.99/mo AMD EPYC VPS.
LangFuse in Docker container on separate internal IP via private networking.
Observability data completely shielded from public internet.

### 10.2 Pantheon-Style Debug Wins

- OTel spans correlated model confusion (system prompt jank) to `plan.md`
  updates → fixed loops in <1 hour
- Without tracing: would have taken days of manual log grepping

### 10.3 shenhao-stu Token-Hog Fixes

- LangFuse revealed full MEMORY.md shoved into every prompt (25k tokens/cron)
- Fix: summarize + exclude via skill + tagging
- Cost dropped 92%
- Community dashboard (Manifest/ClawMetrics) confirmed before/after metrics

---

## 11. Common Failure Modes & Anti-Patterns

### 11.1 Failure Mode Table

| Failure Mode | Symptom | Root Cause | Fix |
|-------------|---------|-----------|-----|
| **No tracing** | Invisible $750 bills, impossible debugging | No observability stack deployed | Deploy OTel + LangFuse (5 min setup) |
| **Shared logs/workspaces** | Privacy bleed, Agent A reads Agent B's SOUL.md | No per-agent isolation | Strict agentDir + tagged traces |
| **Over-logging** | Performance hit, massive DB bloat | Full context window logged every turn | Log only diffs and tool inputs/outputs; use sampling |
| **No session.stuck monitoring** | Cascading handoff failures | Stuck sessions not detected | Monitor session.stuck counters + alerts |
| **No redaction** | API keys leaked in traces | Sensitive data in tool call logs | Enable `redactSensitive: "tools"` |
| **No cost alerts** | Runaway spend undetected for days | No threshold-based alerting | Grafana/LangFuse alerts on cost rate |
| **Manual-only audit** | Issues found too late | No automated monitoring | Deploy full stack from day 1 |

### 11.2 The "$750 Weekend" Through an Observability Lens

How proper observability prevents the infamous cost disaster:
1. LangFuse detects cost/trace spike within minutes (not days)
2. Prometheus alert fires on `openclaw_cost_usd_total` threshold
3. Alert reaches Lead agent via Grafana webhook
4. Lead halts the expensive agent's lane queue
5. Lead reads error.md + trace chain to identify root cause
6. Lead either fixes (model fallback, context reset) or escalates to human

Total time to detection and mitigation: **<5 minutes** vs **48+ hours**
without observability.

---

## 12. Step-by-Step Setup Commands

### 12.1 Enable Built-in Diagnostics + OTel

Edit `~/.openclaw/openclaw.json`:

```json
{
  "diagnostics": {
    "enabled": true,
    "otel": {
      "enabled": true,
      "endpoint": "https://your-langfuse/api/public/otel",
      "protocol": "http/protobuf",
      "serviceName": "openclaw-squad-lead",
      "traces": true,
      "metrics": true,
      "logs": true,
      "sampleRate": 0.5
    }
  },
  "plugins": {
    "allow": ["diagnostics-otel"],
    "entries": {
      "diagnostics-otel": { "enabled": true }
    }
  },
  "logging": {
    "redactSensitive": "tools",
    "level": "info"
  }
}
```

```bash
# Enable the plugin
openclaw plugins enable diagnostics-otel
openclaw restart
```

### 12.2 Set Up LangFuse (Free Tier)

**Option A: Cloud (fastest)**
```bash
# Sign up at cloud.langfuse.com (free tier)
# Create project → copy public/secret keys
# Set OpenRouter as provider + enable Broadcast with LangFuse keys
```

**Option B: Self-hosted (air-gapped VPS)**
```bash
docker run -p 3000:3000 ghcr.io/langfuse/langfuse
# Requires ~1GB RAM on VPS
# Create project → copy keys
# Point OTel endpoint to local LangFuse OTLP
```

### 12.3 Configure Agent Isolation & Tagging

```bash
# Tag agents for observability filtering
openclaw agents add orchestrator --tags role:lead,env:prod
openclaw agents add researcher --tags role:specialist,env:prod
openclaw agents add coder --tags role:specialist,env:prod
```

### 12.4 Add Lead Audit Skill

```bash
# Add audit skill to Lead agent
openclaw skills add audit-lead \
  --code "Query LangFuse API for traceId=$1; summarize to error.md"

# Or create custom skill file (see §6.3 for full JavaScript)
```

### 12.5 Deploy Prometheus + Grafana (LumaDock Template)

```bash
# Docker Compose for monitoring stack
docker-compose up -d prometheus grafana

# Import OpenClaw dashboard
# Panels: per-agent token spend, latency p95, error rate, tool volume, queue depth

# Verify metrics
curl http://localhost:9090/api/v1/query?query=openclaw_cost_usd_total
```

### 12.6 Run Security Audit

```bash
# Built-in security audit
openclaw security audit --deep
openclaw security audit --json | tee audit-report.md
```

---

## 13. Practical Recommendations

### Getting Started

1. **Start with OpenRouter + LangFuse**: 5-minute setup, zero code. Enable
   OpenRouter Broadcast with LangFuse keys for automatic trace capture.

2. **Add OTel for infrastructure metrics**: Deploy on VPS for CPU/RAM/queue
   monitoring alongside LLM-level traces.

3. **Enforce in squad prompt**: Add to every agent's AGENTS.md:
   *"On any failure or tool call, append to error.md with traceId and
   update MEMORY.md lesson."*

4. **Enable sensitive data redaction**: `redactSensitive: "tools"` in config.
   Non-negotiable for production.

5. **Monitor disk for session JSONL growth**: Rotate via cron to prevent
   disk bloat from transcript accumulation.

### Ongoing Operations

6. **Weekly Lead review of top 10 cost traces**: The Lead (or human)
   identifies optimization opportunities from the most expensive traces.

7. **Set alerts for all critical thresholds**: Cost rate, queue depth,
   context pressure, session.stuck, error rate. Alert to Telegram/Discord.

8. **Tag everything**: Model provider (local/cloud), agent role, environment.
   Tags are what make dashboards and filters useful.

9. **Use sampling for high-volume squads**: `sampleRate: 0.2` for routine
   operations; `1.0` for debugging sessions. Adjust dynamically.

### For Maximum Visibility

10. **Deploy full stack**: OTel + LangFuse + Prometheus/Grafana. This is
    the production standard for any squad running more than 5 agents.

11. **Let the Lead own observability**: The Lead's audit skill, read-only
    dashboard access, and autonomous grant decisions are what make
    observability actionable rather than just informational.

12. **Close the loop**: Trace → error.md → MEMORY.md lesson → prevention.
    Every failure should result in a documented, retrievable lesson that
    prevents recurrence across the entire squad.

---

## Summary

The 2026 observability standard for OpenClaw squads is a three-layer stack:

1. **Local Markdown state** (plan.md, error.md, MEMORY.md): Human-readable,
   crash-recoverable, per-agent isolation.

2. **OpenTelemetry**: Distributed tracing across agents and handoffs,
   infrastructure metrics, automatic trace ID propagation.

3. **LangFuse**: LLM-native cost tracking, token analysis, anomaly
   detection, and alerting. Free tier handles squad-scale.

The Lead-as-CEO owns observability: reading aggregated metrics, triggering
deep audits, autonomously granting debug tools and elevated permissions,
and escalating critical events to humans. Loose coordination means the
Lead makes judgment calls based on data—not rigid auto-remediation scripts
that create their own failure modes.

Result: **50–90% cost reduction** through visibility-driven optimization,
**<5 minute** detection-to-mitigation for cost spikes, full audit trails
for every operation, and zero privacy bleed through per-agent isolation.

Deploy the config from §12.1, connect LangFuse, and your squad goes from
flying blind to full observability in under 10 minutes.

---

*Master research file. Synthesized from Grok (primary) + Gemini sources.*
*GitHub PRs #12897, #4255, #3201 validated. LumaDock benchmarks confirmed.*
*Strengthened: Lead-as-CEO observability grants, loose coordination rationale.*
