# 12. Scalability Ceilings & Burnout Prevention — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, official docs, GitHub #4561, LumaDock
> **Last verified**: March 2026 (OpenClaw v2026.3.x, K8s scaling patterns, LumaDock benchmarks)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Practical Scalability Ceilings](#2-practical-scalability-ceilings)
3. [Hardware & Resource Limits](#3-hardware--resource-limits)
4. [Token & Context Pressure Management](#4-token--context-pressure-management)
5. [Agent Burnout: Symptoms & Prevention](#5-agent-burnout-symptoms--prevention)
6. [Monitoring & Early Warning Systems](#6-monitoring--early-warning-systems)
7. [Lead-as-CEO Scaling Responsibility](#7-lead-as-ceo-scaling-responsibility)
8. [Load Balancing & Horizontal Scaling](#8-load-balancing--horizontal-scaling)
9. [Integration with Hybrid, Memory & Cost](#9-integration-with-hybrid-memory--cost)
10. [Real 2026 Production Examples](#10-real-2026-production-examples)
11. [Common Failure Modes & Anti-Patterns](#11-common-failure-modes--anti-patterns)
12. [Step-by-Step Scaling Playbook](#12-step-by-step-scaling-playbook)
13. [Practical Recommendations](#13-practical-recommendations)

---

## 1. Overview

OpenClaw enables true multi-agent squads through isolated workspaces, per-agent
`agentDir`, sessions, sandboxing (v2026.1.6+), and channel bindings. However,
scaling is constrained by real hardware limits, context window pressure, and a
degradation phenomenon known as "agent burnout."

The early 2026 trend of "more agents = more intelligence" has been proven false.
The community consensus from GitHub issue #4561 (closed Jan 30, 2026) and
LumaDock production reports is clear: **isolation and hygiene matter more than
agent count**. Each agent adds workspace files, session stores, sandbox overhead,
and injected bootstrap (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, `IDENTITY.md` —
each capped at 20,000 chars).

> **Key insight**: No official "19 agents ceiling" or exact "One Lead per 4
> specialists" rule exists in core docs, but practical patterns and hardware
> realities converge on these numbers. Treat them as community heuristics
> validated by production experience.

---

## 2. Practical Scalability Ceilings

### 2.1 Agent Count vs Performance

The OpenClaw Gateway runs as a single Node.js process using a lane-aware FIFO
queue. Each additional agent increases lane contention, context pressure, and
resource consumption.

| Agent Count | Structure | CPU / Lane Profile | Latency (TTFT) | Risk Level |
|------------|-----------|-------------------|----------------|------------|
| **1–5** (baseline) | 1 Lead + 2–4 specialists | Optimal: <30% CPU, linear token growth, context <60% | ~743ms | Negligible |
| **6–9** (safe max single node) | 1 Lead + 5–8 specialists | Good with pruning: 40–70% CPU under load | ~1.2s | Context bloat after 10+ sessions |
| **10–12** (requires K8s) | 1–2 Leads + 8–10 specialists | High: 70–90% CPU spikes, needs memory flush | ~2.5s | OOM kills, >80% context pressure |
| **13–19** (max practical) | Multiple Leads + specialists | Critical: sustained high CPU, 2–3× token cost | >6.0s | Cascading failures without K8s HPA |
| **20+** (not recommended) | Multiple independent Gateways | Total slowdown or collapse | N/A | Permanent degradation without split |

### 2.2 The "One Lead per N Specialists" Heuristic

Community consensus evolved through 2026:

- **Conservative (Gemini)**: 1 Lead per 4 specialists. Leaves room for
  nested tool calls and parallel cron jobs. Gateway concurrency cap is 8
  for the subagent lane.
- **Production (Grok/LumaDock)**: 1 Lead per 5–8 specialists on 32 GB
  hardware with aggressive pruning. This is the realistic production ceiling.
- **Beyond 8**: Spawn a second Lead (new gateway instance) and route via
  bindings or external orchestrator.

### 2.3 Why "19 Agents" is a Trap

The widely cited LumaDock disaster (late Jan 2026): a user spawned 19
persistent sub-agents in a single Gateway. Results:
- Lane FIFO queue deadlocked within 48 hours
- Agents hallucinated responses based on crossed contexts
- Lock timeouts crashed the host environment
- Stale lock files (`sessions/<id>.jsonl.lock`) caused silent message dropping

**The fix is not more hardware—it's architectural**: split into multiple
Gateways with routing, not a single monolith.

---

## 3. Hardware & Resource Limits

### 3.1 Single-Node Profiles

| Hardware | CPU | RAM | Storage | Max Stable Agents | Notes |
|----------|-----|-----|---------|-------------------|-------|
| **Mac Mini M2** | 8-core | 16 GB unified | SSD | 4–6 | Good for dev/testing |
| **Mac Mini M4** | 10-core | 32 GB unified | SSD | 6–10 | Viable for production with pruning |
| **LumaDock VPS (basic)** | 2–4 vCPU | 4 GB | NVMe | 3–5 | Budget option, strict limits |
| **LumaDock VPS (perf)** | 8 vCPU AMD EPYC | 32 GB | NVMe | 8–12 | Recommended production tier |
| **K8s cluster** | 16+ vCPU | 32+ GB | RWX PVCs | 12–19 | Only path to 13+ agents |

### 3.2 Resource Consumption Per Agent

- **Baseline**: 1–2 CPU cores / 1–2 GiB RAM per gateway process
- **Spikes**: Concurrent tool calls (browser ~2,500 tokens/schema), memory
  indexing, or >5 sandboxes → OOM or 80%+ CPU
- **Disk I/O**: OpenClaw writes `sessions/<id>.jsonl` and `MEMORY.md`
  continuously. On standard HDD/SSD without NVMe, 9+ agents cause massive
  disk lag and dropped webhooks.

### 3.3 Docker/K8s Resource Limits (LumaDock Template)

```yaml
resources:
  limits:
    cpu: "2"
    memory: "2Gi"
  requests:
    cpu: "1"
    memory: "1Gi"
```

Set reservations at 50% of limits. HPA triggers at 70% CPU.

---

## 4. Token & Context Pressure Management

### 4.1 Top Token Consumers

1. Tool schemas and outputs (browser alone: ~2,500 tokens)
2. Bootstrap injection (AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md)
3. Conversation history accumulation
4. Cross-agent context passing via sessions_send

### 4.2 Context Pruning Configuration

From GitHub issue #4561 (production-validated):

```json
{
  "agents": {
    "defaults": {
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "5m",
        "keepLastAssistants": 3,
        "softTrim": { "maxChars": 4000 }
      },
      "contextTokens": 80000
    }
  },
  "compaction": {
    "reserveTokensFloor": 20000,
    "memoryFlush": {
      "enabled": true,
      "softThresholdTokens": 4000,
      "prompt": "Write durable notes to memory/YYYY-MM-DD.md"
    }
  }
}
```

### 4.3 Prompt Caching Impact (Gemini Numbers)

| Metric | Without Caching | With Caching | Savings |
|--------|----------------|-------------|---------|
| Processing 75K tokens | $0.00825, 6.2s | Reduced write cost | ~68% API cost |
| TTFT | >6s at scale | ~743ms | 8× faster |

Implement a single cache checkpoint at the end of each Assistant message.
This is the single highest-ROI optimization for scaled squads.

### 4.4 Cost Impact of Scaling

Unpruned squad of 12 agents: **3–5× token spend** vs 4-agent baseline.
With pruning + caching + model fallbacks: costs stay within 1.5–2× baseline.

---

## 5. Agent Burnout: Symptoms & Prevention

"Agent burnout" in OpenClaw is **contextual degradation and memory poisoning**
occurring over 2–4 weeks of continuous uptime. It is not fatigue—it is
architectural decay.

### 5.1 Burnout Symptoms

| Symptom | Description | Detection |
|---------|-------------|-----------|
| **Personality drift** | Agent overwrites SOUL.md with hyper-specific temporary rules, permanently altering baseline behavior | Compare current SOUL.md to Git baseline |
| **"Blind Send" errors** | Agent skips tool verification because cached context convinces it already knows the answer | Error rate spike on previously reliable tasks |
| **Token usage spikes** | Context pressure >80% even after pruning; history reconstruction fails | `/usage tokens` shows sustained increase |
| **Competence creep** | Agent starts "helping" outside its designated scope | Tool deny-list violations in logs |
| **Queue paralysis** | Stale lock files pile up from hung operations, causing silent message dropping | `sessions/<id>.jsonl.lock` files accumulating |
| **"Also" loops** | Repetitive phrasing patterns, gibberish after repeated compactions | Manual output review or automated pattern check |

### 5.2 Prevention Playbook

1. **Daily memory flush + weekly `/compact`**: The baseline hygiene that
   prevents 80% of burnout cases.

2. **Enforce `hardClear` in pruning config**: Prevents stale context from
   accumulating indefinitely.

3. **Immutable core identity** (Gemini insight): Lock down the core SOUL.md
   and force agents to write temporal data only to a designated
   `SCRATCHPAD.md`. This prevents personality drift from corrupting the
   identity anchor.

4. **Adversarial tension** (shenhao-stu method): Pair an Ideator agent with
   a Critic agent. The Critic acts as a "taste gate," preventing the Ideator
   from committing lazy or hallucinated data into long-term shared memory.

5. **Scheduled amnesia** (Gemini's BOOTSTRAP.md pattern): Auto-archive old
   agents every 14 days and spawn fresh clones using a clean BOOTSTRAP.md
   state. This is the nuclear option for persistent drift.

6. **Model fallbacks**: Opus → Sonnet → Haiku + TaskMaster-style skill for
   dynamic delegation. Prevents single-model fatigue patterns.

7. **Archive idle specialists**: `openclaw agents delete <id>` (backup
   `agent.md` first) or move to separate gateway. Agents idle >14 days
   should be archived.

8. **Sandbox + tool deny lists**: Prevent specialists from "helping" outside
   scope. Scope creep is a leading indicator of burnout.

9. **Regular `/context detail` + `/status` checks**: Alert on >70% context
   or token delta >20% week-over-week.

> **Key insight**: No permanent intelligence drop occurs if you flush early.
> But ignored bloat can require a full workspace reset.

---

## 6. Monitoring & Early Warning Systems

### 6.1 Built-in Tools

| Tool | Purpose |
|------|---------|
| `/status` | Current agent state and health |
| `/context list` / `/context detail` | Context window usage breakdown |
| `/usage tokens` / `/usage cost` | Token consumption and spend tracking |
| `openclaw gateway usage-cost` | Gateway-level cost monitoring |

### 6.2 Production Monitoring Stack (LumaDock)

- **Prometheus exporter**: CPU/RAM, session count, context %, token burn rate
- **Grafana dashboards**: Real-time visualization of squad health
- **LangFuse / OpenTelemetry**: Per-agent spans via webhooks (community pattern)
- **Memory backends** (QMD/Cognee/Mem0): Expose their own metrics

### 6.3 Key Metrics to Track

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|-------------------|-------------------|--------|
| `openclaw_queue_depth` (main lane) | >3 sustained | >6 sustained | Lead is drowning—reduce agents or split |
| `openclaw_queue_depth` (subagent lane) | >4 sustained | >8 sustained | Queue blocking—optimize or add gateway |
| `openclaw_run_duration_seconds` | >1.5× baseline | >3× baseline | Prompt cache misses—check caching config |
| `openclaw_retry_count` | >5/hour | >15/hour | Hitting provider rate limits (HTTP 429) |
| Context pressure | >70% | >85% | Trigger memoryFlush + compact |
| Token delta | >15%/day | >25%/day | Memory bloat—flush and prune |
| Sandbox count (idle) | >3 | >5 | Prune idle sandboxes |
| Compaction frequency | >2/day | >3/day | Context growing too fast—investigate |

### 6.4 Alert Configuration (Prometheus)

```yaml
rules:
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
      summary: "Context window saturation. Trigger summarization."

  - alert: ContextPressureHigh
    expr: openclaw_context_usage_percent > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Context >80%. memoryFlush recommended."
```

---

## 7. Lead-as-CEO Scaling Responsibility

### 7.1 The Lead as Scaling CEO

Core OpenClaw has no built-in hierarchy, but the 2026 "Lead-as-CEO" pattern
(widely adopted from issue #4561) designates one coordinator agent that owns
squad scaling decisions. The Lead is not just a router—it is the **CEO of
squad architecture** with five core scaling responsibilities:

1. **Task Decomposition with Scale Awareness**: When breaking tasks, the Lead
   considers current squad load, context pressure, and agent health. Routes
   work via bindings and `sessions_send`—loose, per-task routing that adapts
   to current capacity.

2. **Dynamic Specialist Management**: The Lead decides when to add specialists
   (`agents add`), when to archive idle agents, and when the squad has hit
   its ceiling. These are runtime decisions, not static config.

3. **Autonomous Capability Grants**: The Lead can **autonomously grant extra
   tools, API keys, email accounts, secrets, and elevated permissions** to
   agents as they grow and prove reliable:
   - **Low-risk grants** (read-only tools, search APIs, local file access,
     model upgrades within budget) are issued autonomously.
   - **High-risk grants** (exec permissions, external API keys with spend
     authority, email/messaging accounts, gateway expansion) require
     **one-time human approval** only. Once approved, the Lead re-issues.
   - All grants logged to MEMORY.md for audit.

4. **Sub-Lead Spawning**: When the squad hits 8–12 agents or sustained >70%
   CPU, the Lead spawns a new gateway instance with a sub-Lead and routes
   via bindings. This is the only safe path beyond the single-node ceiling.

5. **Human Escalation for Expansion**: The Lead requests human intervention
   only for hardware expansion, permanent architecture changes, or when
   agent count exceeds what can be managed with sub-Leads.

### 7.2 Why Loose Coordination Enables Scaling

Loose coordination is essential for scalability:

- **No fixed DAGs**: Tasks flow based on runtime assessment of current load
  and agent health. A research task might go to one agent or three, depending
  on current capacity.
- **Prevents over-engineering**: Rigid scaling pipelines (auto-scale triggers,
  fixed agent topologies) break when workloads shift. Loose routing adapts.
- **Prevents straight-jacket automations**: Agents are not locked into fixed
  roles as load changes. The Lead can reassign, merge, or split responsibilities
  dynamically without reconfiguring pipelines.
- **Binding-based dispatch**: 80%+ of routing handled by static bindings.
  The Lead only intervenes for capacity decisions and conflict resolution.
- **Serial Lane Queue**: Prevents race conditions during scaling operations
  without requiring distributed locking.

> **Design principle**: The system that scales best is the one where the Lead
> makes runtime capacity decisions, not the one with the most elaborate
> auto-scaling config.

### 7.3 Lead SOUL.md Scaling Rules

Combined community template (issue #4561 + Gemini + LumaDock):

```markdown
# Lead Scaling Mandate (2026)

## Span of Control
- Actively manage a maximum of 8 specialists on current hardware.
- If concurrent tasks exceed capacity, invoke sessions_spawn for temporary
  parallel sub-agents.

## Scaling Triggers
- Run /context detail every 24h; if >75% → trigger memoryFlush + notify human.
- Specialist count >8 or CPU >70% sustained → spawn sub-Lead on new gateway.
- Do NOT spawn sub-leads on the same gateway. Request new gateway instance.

## Archiving
- Agents idle >14 days → archive after backup.
- Agents with error rate >15% on last 5 tasks → flush memory and restart.
- If a sub-agent has been idle >24h, consider archiving to free resources.

## Human Escalation
- If task requires more than 12 total agents → pause and request human
  intervention for architecture decisions.
- Never silently expand beyond current hardware capacity.
```

---

## 8. Load Balancing & Horizontal Scaling

### 8.1 Routing Techniques

- **Bindings**: `openclaw.json` channel/peer/group bindings for static routing
- **@mention patterns**: Direct routing to specific agents in group chats
- **Specialist grouping**: Per-workspace or per-sandbox isolation
- **Auto-pause**: Sandbox pruning + cron leader election (one replica only)

### 8.2 K8s Horizontal Scaling (LumaDock Template)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: openclaw-gateway
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: openclaw-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

- RWX PVCs (NFS/Ceph) for shared `~/.openclaw` and workspace
- Redis lock for cron (prevents duplicate heartbeats across replicas)
- Ingress for external traffic distribution
- Sandbox pruning: idle >24h, aged-out >7 days

### 8.3 Multi-Gateway Architecture (13+ Agents)

For squads beyond single-node capacity:

```
External Router (Nginx/HAProxy or binding-based)
  ├── Gateway 1: Lead CEO + 4 specialists (research/analysis)
  ├── Gateway 2: Sub-Lead + 4 specialists (coding/review)
  └── Gateway 3: Sub-Lead + 4 specialists (comms/ops)

Shared: NFS workspace for cross-gateway file drops
Coordination: Lead on Gateway 1 sends to sub-Leads via sessions_send
```

This is the only proven architecture for 13+ agents in March 2026.

---

## 9. Integration with Hybrid, Memory & Cost

### 9.1 Hybrid Architecture Integration

- K8s gateway + external QMD/Cognee memory backend on separate PVCs
- Internal DNS for service discovery between gateway replicas
- Local Ollama models on GPU nodes for grunt work; cloud APIs on gateway
  nodes for Lead reasoning

### 9.2 Memory Hygiene at Scale

- Daily `memory/YYYY-MM-DD.md` per agent
- Curated `MEMORY.md` kept under 50 lines (routing index, not dump)
- Pre-compaction flush (memoryFlush) prevents knowledge loss
- Gardener Architecture proposal: atomic facts + bi-directional links
  for clean memory at scale
- Weekly compaction consolidates 7 dailies into one digest

### 9.3 Cost Optimization at Scale

| Strategy | Impact | Complexity |
|----------|--------|-----------|
| **Model fallbacks** (Opus → Sonnet → Haiku) | 70–80% savings | Low |
| **TaskMaster skill** for dynamic delegation | 50–70% savings on routing | Medium |
| **Context cap** (contextTokens: 80000) | Prevents runaway spend | Low |
| **softTrim** (maxChars: 4000) | Keeps working context lean | Low |
| **Prompt caching** | ~68% API cost reduction | Low |
| **Local-first models** (Ollama for grunts) | 80–95% savings on grunt work | Medium |

---

## 10. Real 2026 Production Examples

### 10.1 shenhao-stu 9-Agent Kit (GitHub, Viral Success)

- **Structure**: 9 pre-configured agents (Planner, Coder, Reviewer, Scout,
  Ideator, Critic, etc.) with strict role separation
- **Key innovation**: Adversarial Ideator ↔ Critic collaboration as "taste
  gate" preventing hallucinated data from entering long-term memory
- **Routing**: Clean openclaw.json channel bindings, no cross-talk
- **Result**: Stable on consumer hardware with daily flush

### 10.2 Multi-Agent Book-Writing Squad (GitHub Discussion, Feb 2026)

- **Structure**: 1 Director + 3 research + 5 writing + 2 review (~11 agents)
- **Output**: 88k-word book via markdown/git coordination
- **Failure mode**: One reviewer timeout (hourly cron missed it)
- **Lesson**: Monitoring cron reliability is as important as agent health

### 10.3 4-Agent Mac Mini Business Team (YouTube, Mar 2026)

- **Structure**: 1 Lead + 3 specialists on consumer Mac Mini
- **Key**: Strict tool deny lists kept agents in scope
- **Result**: Stable, no burnout after 4+ weeks continuous operation

### 10.4 Pantheon 14-Agent Hybrid (Enterprise, Feb 2026)

- **Problem**: 14 agents on single Gateway caused deadlocks
- **Solution**: Deployed 3 separate OpenClaw VPS instances on LumaDock
  with shared workspace for memory synchronization
- **Result**: Stable operation with sub-Lead routing across gateways
- **Lesson**: Multi-gateway is the only path beyond 12 agents

### 10.5 LumaDock 19-Agent Swarm (Failure Case, Jan 2026)

- **Setup**: 19 persistent sub-agents in single Gateway
- **Result**: Lane FIFO queue deadlocked within 48 hours
- **Symptoms**: Crossed contexts, hallucinated responses, lock timeout crashes
- **Post-mortem**: Single-gateway monolith cannot handle 19 agents regardless
  of hardware. Architecture must split at 12–15 agents.

---

## 11. Common Failure Modes & Anti-Patterns

### 11.1 Failure Mode Table

| Failure Mode | Symptom | Root Cause | Fix |
|-------------|---------|-----------|-----|
| **Too many agents on one gateway** | OOM, slowdown, deadlocks | Single Node.js process limit | Split into multiple gateways at 12+ |
| **No monitoring** | Sudden collapse at 100% context | No visibility into degradation | Deploy Prometheus + alerts from day 1 |
| **Ignored burnout** | Personality drift becomes "permanent" | No flush/compact schedule | Daily flush + weekly compact + 14-day archive |
| **Shared agentDir** | Auth collisions, session corruption | Reusing workspace across agents | Strict per-agent isolation |
| **No memory flush before compaction** | Lost knowledge, degraded recall | memoryFlush disabled | Enable memoryFlush in config |
| **Runaway delegation** | Lead passes failing task infinitely | No recursion cap | "Never re-delegate—aggregate and close" |
| **Shared browser profiles** | Auth collisions across agents | Browser state not isolated | Per-agent browser sandboxes |
| **Over-scaling without pruning** | 3–5× token cost, diminishing returns | Adding agents without hygiene | Prune first, scale second |

### 11.2 The Scaling Anti-Pattern Hierarchy

1. **Worst**: 19 agents, single gateway, no monitoring, no pruning → crash
2. **Bad**: 12 agents, single node, occasional flush → gradual degradation
3. **Okay**: 8 agents, single node, daily flush, weekly compact → stable
4. **Good**: 5 agents, monitored, pruned, cached → optimal
5. **Best**: 12+ agents, multi-gateway, K8s HPA, Lead-as-CEO scaling → production

---

## 12. Step-by-Step Scaling Playbook

### Phase 1: Monitoring Setup (Day 1)

```bash
# Enable context pruning
openclaw config set agents.defaults.contextPruning.mode cache-ttl

# Deploy Prometheus + Grafana (LumaDock template)
# Or webhook to LangFuse for lightweight monitoring

# Verify monitoring
openclaw gateway usage-cost
```

### Phase 2: Baseline Squad (1 Lead + 4 Specialists)

```bash
# Start with single Lead
openclaw agents add lead-ceo \
  --model anthropic/claude-opus-4-6 \
  --workspace ~/squad/lead

# Add 4 specialists
openclaw agents add researcher \
  --model claude-sonnet-4-6 \
  --workspace ~/squad/researcher

openclaw agents add coder \
  --model claude-sonnet-4-6 \
  --workspace ~/squad/coder

openclaw agents add reviewer \
  --model claude-sonnet-4-6 \
  --workspace ~/squad/reviewer

openclaw agents add writer \
  --model ollama/qwen2.5-coder:32b \
  --workspace ~/squad/writer

# Verify baseline
openclaw agents list --bindings
```

### Phase 3: Weekly Health Checks

```bash
# Run on Lead
/context detail
/status
/usage tokens

# Check thresholds
# Context >70% → memoryFlush + compact
# Token delta >20% week-over-week → investigate
# Sandbox count >3 idle → prune
```

### Phase 4: When to Split (Lead Decides)

Decision tree for the Lead:
- Hit 8 active specialists → consider sub-Lead on new gateway
- Sustained >70% CPU → spawn new gateway instance
- Context pressure >80% after flush → split workload
- Archive: agents idle >14 days → delete after backup

```bash
# Archive an idle agent
cp -r ~/.openclaw/agents/idle-agent ~/.openclaw/archive/
openclaw agents delete idle-agent

# Spawn new gateway for sub-Lead
# (on separate VPS or K8s pod)
openclaw gateway start --port 18790
openclaw agents add sub-lead \
  --model anthropic/claude-sonnet-4-6 \
  --workspace ~/squad/sub-lead
```

### Phase 5: Production Scaling (K8s)

```bash
# Apply HPA
kubectl apply -f openclaw-hpa.yaml

# Verify scaling
kubectl get hpa openclaw-gateway
kubectl top pods -l app=openclaw
```

---

## 13. Practical Recommendations

### Getting Started

1. **Start with 1 Lead + 4 specialists on single node**. Do not scale
   before you have stable baseline metrics and monitoring in place.

2. **Deploy monitoring from day 1**: Prometheus + Grafana or at minimum
   regular `/context detail` + `/status` checks. You cannot manage what
   you cannot measure.

3. **Enable prompt caching**: Single highest-ROI optimization. ~68% API
   cost reduction and 8× TTFT improvement at scale.

4. **Enable memoryFlush + context pruning**: Copy the config from §4.2.
   This prevents 80% of burnout cases and most scaling failures.

5. **Do not scale on a MacBook**: Deploy to 4GB+ RAM / NVMe VPS minimum
   for anything beyond testing.

### Scaling Beyond 5 Agents

6. **Move to K8s at 8+ agents**: HPA at 70% CPU, min 2 / max 10 replicas.
   Single-node cannot reliably handle more than 8 active agents.

7. **Treat the Lead as CEO with explicit scaling rules**: Copy the SOUL.md
   template from §7.3. The Lead makes runtime capacity decisions.

8. **Archive aggressively**: Agents idle >14 days should be archived.
   Idle agents still consume resources and context.

9. **Split at 12**: Never exceed 12 agents on a single gateway. Spawn
   new gateway + sub-Lead and route via bindings.

### Burnout Prevention

10. **Daily flush + weekly compact**: Non-negotiable for any squad running
    more than 7 days continuously.

11. **Immutable SOUL.md**: Lock core identity. Temporal data goes to
    SCRATCHPAD.md, not SOUL.md.

12. **Adversarial pairing**: Ideator + Critic prevents quality decay.
    The Critic catches lazy output before it enters long-term memory.

13. **14-day scheduled amnesia**: For agents showing persistent drift,
    archive and respawn from clean BOOTSTRAP.md.

### For Maximum Scale (13+ Agents)

14. **Multi-gateway architecture**: Multiple VPS instances or K8s pods,
    each running 1 Lead + 4–8 specialists. Shared workspace via NFS.

15. **Monitor ruthlessly**: Pruning and memory hygiene are the only things
    preventing burnout collapse at scale. Automate alerts for every
    threshold in §6.3.

16. **Let the Lead manage scale**: The Lead's autonomous decisions about
    adding, archiving, and splitting agents are what make large squads
    viable. Without a strong Lead, scaling is manual and fragile.

---

## Summary

Scalability in 2026 OpenClaw squads is governed by five realities:

1. **Hardware ceilings are real**: Single-node max is 8–12 agents with
   aggressive pruning. Beyond that, multi-gateway is mandatory.

2. **Agent burnout is architectural decay**: 2–4 weeks of continuous
   operation causes personality drift, context bloat, and error spikes.
   Prevention: daily flush, weekly compact, 14-day archive cycle.

3. **Monitoring is mandatory**: Context pressure, queue depth, token delta,
   and CPU are the four vital signs. Alert on all of them.

4. **Lead-as-CEO owns scaling**: The Lead decomposes tasks, routes loosely
   via bindings and sessions_send, synthesizes results, autonomously
   grants capabilities to growing agents, and makes runtime decisions
   about when to split, archive, or expand. Loose coordination prevents
   over-engineering and straight-jacket automations.

5. **The sweet spot is 1 Lead + 4–8 specialists**: This is where cost,
   performance, and reliability converge. Scale beyond only with K8s,
   monitoring, and multi-gateway architecture.

Start small, monitor ruthlessly, prune aggressively, and let the Lead
make scaling decisions. This pattern has kept 12–14 agent production
squads stable through Feb–Mar 2026.

---

*Master research file. Synthesized from Grok (primary) + Gemini sources.*
*GitHub #4561, LumaDock benchmarks, and community reports validated.*
*Strengthened: Lead-as-CEO scaling grants, loose coordination rationale.*
