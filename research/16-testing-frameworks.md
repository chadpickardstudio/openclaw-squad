# Topic 16 — Testing Frameworks & Sandboxes for Multi-Agent Squads

> **OpenClaw v2026.3.x · Master Research File**
> Grok foundation + Gemini insights · March 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Full Testing Frameworks Available](#2-full-testing-frameworks-available)
3. [Mock Handoffs & Inter-Agent Messaging](#3-mock-handoffs--inter-agent-messaging)
4. [Failure Simulation & Chaos Testing](#4-failure-simulation--chaos-testing)
5. [Human-in-the-Loop Checkpoints](#5-human-in-the-loop-checkpoints)
6. [Lead-as-CEO Testing & Deployment Oversight](#6-lead-as-ceo-testing--deployment-oversight)
7. [Integration with Independence & Memory](#7-integration-with-independence--memory)
8. [Integration with Error Recovery & Observability](#8-integration-with-error-recovery--observability)
9. [Integration with Scalability & Burnout Prevention](#9-integration-with-scalability--burnout-prevention)
10. [Real 2026 Production Examples](#10-real-2026-production-examples)
11. [Common Failure Modes & Anti-Patterns](#11-common-failure-modes--anti-patterns)
12. [Comparison Table](#12-comparison-table)
13. [Step-by-Step Setup Commands](#13-step-by-step-setup-commands)
14. [Practical Recommendations](#14-practical-recommendations)
15. [Summary](#15-summary)

---

## 1. Overview

Testing an OpenClaw multi-agent squad in 2026 goes far beyond running prompts
and hoping for the best. The ecosystem has matured into structured frameworks
that treat agents as deterministic functions where possible, with layered
sandboxing, mock handoff libraries, chaos injection, and human-gated
deployment pipelines.

**Current reality check** (March 2026): Official testing centers on the core
Vitest-based suites and Docker sandbox verification. No official
`pytest-openclaw` package, dedicated chat-replay engine, or mock-handoff
library exists in the main repo. Community extensions (shenhao-stu 9-agent
squads, skills like `agent-evaluation`, `agent-team-orchestration`,
`arc-skill-sandbox`) and emerging tools like `openclaw-mock-bindings` provide
the closest equivalents. The gap between what teams *build internally* and
what's publicly available is narrowing fast.

Key testing layers:

| Layer | What It Tests | Tools |
|---|---|---|
| Unit | Individual agent logic, tool calls | Vitest + mock providers |
| Integration | Handoffs, routing, binding resolution | agentToAgent + sandbox |
| End-to-End | Full squad workflows | shenhao-stu setup + CLI probes |
| Chaos | Failure recovery, cost spikes, loops | Custom scripts + skill mocks |
| Load | Concurrency, queue depth, burnout | LumaDock K8s + lane flooding |
| Human Gate | Approval workflows, deployment safety | agentgate + Lead oversight |

---

## 2. Full Testing Frameworks Available

### 2.1 Core Framework Testing (Vitest — Official)

OpenClaw's own tests use three Vitest suites plus Docker runners. Agent-related
tests include gateway + dev agent smoke, tool-calling mocks, and live
model/provider sweeps.

```bash
pnpm test                  # unit/integration (fast local)
pnpm test:e2e              # gateway smoke tests
pnpm test:live             # real providers/models (requires API keys)
pnpm test:coverage         # 70% threshold gate
pnpm test:docker:live-models  # full Docker-based model sweep
```

Coverage excludes CLI/gateway entrypoints but includes offline mock provider
tests for tool-calling and wizard flows. The 70% coverage gate is enforced in
CI—PRs that drop below it are blocked.

### 2.2 Multi-Agent Sandbox Verification (Official CLI + Docker)

Per-agent Docker sandboxes (`openclaw-sbx-*`) isolate each agent's filesystem,
network, and tool access. Configuration via `agents.list[].sandbox.mode`:

- `"all"` — dedicated Docker container per agent (recommended for testing)
- `"tools"` — sandboxes tool execution only
- `"off"` — no sandbox (docs explicitly warn against this)

Verification checklist from official docs:

```bash
# List all agents and their binding configuration
openclaw agents list --bindings

# Verify Docker sandbox containers are running
docker ps --filter "name=openclaw-sbx-"

# Test tool denial: send message requiring a denied tool → confirm block
# Monitor routing and sandbox events in real time
tail -f ~/.openclaw/logs/gateway.log | grep -E "routing|sandbox|tools"
```

### 2.3 Community Multi-Agent Workflow Testing (shenhao-stu/openclaw-agents)

The shenhao-stu project provides a one-command 9-agent squad (planner, coder,
critic, reviewer, etc.) with group routing or local agentToAgent handoffs:

```bash
git clone https://github.com/shenhao-stu/openclaw-agents
cd openclaw-agents
./setup.sh --mode local --dry-run   # preview only (safe)
./setup.sh --mode local             # full deploy
openclaw agents list --bindings     # verify routing
openclaw channels status --probe    # check channel health
```

Adversarial pairs (Ideator vs. Critic) simulate review gates. Workflows like
`paper-pipeline` and `daily-digest` act as end-to-end regression scenarios.
Trigger via `@planner` mentions or `/paper-pipeline` commands.

### 2.4 Skill-Based Testing & Evaluation

From the awesome-openclaw-skills registry (5400+ skills):

| Skill | Purpose |
|---|---|
| `agent-evaluation` | Behavioral testing, capability assessment, reliability metrics |
| `agent-team-orchestration` | Role definitions, task lifecycles, handoff protocols |
| `arc-skill-sandbox` | Isolate and test untrusted skills before installation |
| `test-master` | Generates pytest/Jest skeletons, coverage targets, mocking patterns |
| `agent-audit` | Performance, cost, and ROI audits per agent |
| `agent-audit-trail` | Tamper-evident logs for compliance and debugging |

Install via ClawHub or CLI:

```bash
openclaw skills add agent-evaluation agent-team-orchestration
openclaw skills add arc-skill-sandbox test-master
openclaw skills add agent-audit agent-audit-trail
```

### 2.5 Emerging: pytest-openclaw & Chat-Replay

Community teams are building (but haven't yet open-sourced) two key tools:

- **pytest-openclaw**: Interacts with OpenClaw's file-based state (`goal.md`,
  `plan.md`, `status.md`, `log.md`) and asserts workspace changes without
  triggering live LLM API calls. Available in some internal deployments;
  install via `pip install pytest-openclaw openclaw-mock-bindings` where
  available.

- **Chat-Replay Harnesses**: Leverage OpenClaw's deduplication cache and trace
  logs to feed historical `session:<key>` conversations back into the squad,
  verifying deterministic routing and task breakdown. Currently custom-built
  per team; no standard package yet.

---

## 3. Mock Handoffs & Inter-Agent Messaging

The hardest part of multi-agent testing is the handoff. OpenClaw relies on
`sessions_spawn` (hierarchical delegation) and `sessions_send` (via the
`agentToAgent` tool for peer messaging).

### 3.1 Native Handoff Testing

- **Local Workflow Mode**: `agentToAgent` tool + session isolation
  (`agent:planner:feishu:group:xxx`).
- **Dry-run simulation**: `./setup.sh --dry-run` + taste gates in critic
  agent (SHARP ≥ 18 score threshold).
- **Binding verification**: `openclaw agents list --bindings`—confirms
  routing tables without sending live messages.

### 3.2 sessions_send Mocks

Instead of spinning up the entire squad, mock the receiver. If Agent A sends
a payload to `agent:reviewer:project-a`, the test harness intercepts the
session key and injects a pre-written JSON response:

```json
{
  "event": "code_complete",
  "project": "project-a",
  "mock_response": {
    "approved": false,
    "feedback": "Memory leak detected in worker pool."
  }
}
```

Save as `tests/mocks/reviewer_mock.json` and configure the test harness to
intercept matching session keys. Use Vitest offline provider mocks from the
core test suite as a template for custom interceptors.

### 3.3 Binding Simulation

Test channel routing by simulating incoming webhook payloads or using
OpenClaw's local SSH port forwarding to inject mock Telegram/WhatsApp events
directly into the Gateway's lane queues:

```bash
# Simulate a Telegram webhook hitting the Gateway
curl -X POST http://localhost:3000/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{"message":{"text":"@reviewer check PR #42","chat":{"id":-100123}}}'

# Verify routing in gateway logs
tail -1 ~/.openclaw/logs/gateway.log
```

### 3.4 plan.md Replay

By pre-populating an agent's `~/.openclaw/agents/<agentId>/sessions` directory
with a completed `plan.md`, you can isolate and test just the execution phase
of a sub-agent without needing the Orchestrator to generate the plan
dynamically. This is the closest thing to a replay engine currently available:

```bash
# Pre-populate a plan for isolated execution testing
mkdir -p ~/.openclaw/agents/coder-01/sessions/test-run-001
cp tests/fixtures/known-good-plan.md \
   ~/.openclaw/agents/coder-01/sessions/test-run-001/plan.md

# Trigger execution of just this plan
openclaw agents run coder-01 --session test-run-001 --skip-planning
```

---

## 4. Failure Simulation & Chaos Testing

Multi-agent squads earn their complexity, but they also invent new ways to
fail. Chaos testing in OpenClaw targets specific vulnerability classes.

### 4.1 Tool Failures

Configure denied tools or use mock providers to return errors:

```bash
# Using Vitest mock provider: return ETIMEDOUT from a tool
# In test file:
mockProvider.setToolResponse("web_search", {
  error: "ETIMEDOUT",
  status: 408
});

# Assert agent writes blocked status rather than panicking
expect(readFile("status.md")).toContain("blocked");
expect(readFile("log.md")).toContain("tool_failure: web_search");
```

With `pytest-openclaw` (where available):

```python
def test_tool_timeout_graceful_degradation(agent_workspace):
    """Agent writes blocked status on tool failure, not crash."""
    inject_tool_failure("web_search", error="ETIMEDOUT", code=408)
    trigger_task(agent_workspace, "research competitor pricing")
    assert "blocked" in read_status(agent_workspace)
    assert "web_search" in read_log(agent_workspace)
```

### 4.2 Infinite Delegation Loops

The "Ralph Wiggum technique" — hard context resets tested by monitoring
`maxSpawnDepth` (default 1, max 2). Tests assert the squad gracefully halts:

```bash
# In openclaw.json: enforce spawn depth
{
  "agents": {
    "defaults": {
      "maxSpawnDepth": 2
    }
  }
}

# Test: trigger a task that would recursively delegate
# Assert: sub-agent at depth 2 executes directly, does NOT spawn depth 3
pytest tests/chaos/test_delegation_loops.py --spawn-depth-limit=2
```

### 4.3 Context Bloat

Inject oversized data into MEMORY.md to verify compression behavior:

```bash
# Generate 100KB of junk data
python3 -c "print('x' * 102400)" >> \
  ~/.openclaw/agents/coder-01/workspace/MEMORY.md

# Trigger a task and verify the agent summarizes rather than crashes
# Assert: token count stays within context window limits
# Assert: MEMORY.md gets compacted, not passed raw
```

### 4.4 Cost Spike Circuit Breakers

Mock the LLM provider to return synthetic billing alerts:

```python
def test_cost_circuit_breaker(squad_workspace):
    """Squad halts when billing threshold hit."""
    mock_billing_alert(amount=750, currency="USD")
    trigger_task(squad_workspace, "generate full documentation")
    assert squad_status(squad_workspace) == "circuit_breaker_tripped"
    assert notification_sent("telegram", "Cost alert: $750 threshold hit")
```

Production teams also monitor `openclaw_retry_count` spikes—each retry
multiplies cost. Circuit breakers should trip at 3× normal token spend.

### 4.5 Concurrent Task Collision

Test what happens when two agents modify the same file simultaneously:

```bash
# Flood the main lane to hit maxConcurrent cap
for i in $(seq 1 10); do
  openclaw send "Task $i: edit config.json" --agent coder-01 &
done
wait

# Assert: tasks queue properly (FIFO), no drops, no file corruption
# Check gateway log for proper lane queuing
grep "queued" ~/.openclaw/logs/gateway.log | wc -l
```

---

## 5. Human-in-the-Loop Checkpoints

In 2026, autonomous doesn't mean unsupervised. Testing pipelines include
mandatory human gates at critical junctures.

### 5.1 agentgate Skill

The `agentgate` skill (from awesome-openclaw-skills) provides an API gateway
with explicit write approval:

```bash
openclaw skills add agentgate

# Configure: require human approval for production deployments
# In agent's soul.md or agent.md:
# "Before deploying to production, request human approval via agentgate."
```

When triggered, the agent halts the pipeline and sends a notification
(Telegram, Slack, email) for a human to approve or reject.

### 5.2 Manual Approval Gates

- **Mention gating**: Only `@approved-humans` can trigger deployment workflows.
- **Group policies**: `allowlist` restricts which users can approve test runs.
- **agent-self-reflection**: Session review skill that summarizes what the
  agent did before requesting human sign-off.

### 5.3 Test Harness for Human Review

Send controlled messages through the squad and present results for human
review before promoting to production:

```bash
# Run test suite, capture results
pnpm test:live > /tmp/test-results.txt 2>&1

# Agent summarizes results and sends for human review
openclaw send "Summarize test results and request deployment approval" \
  --agent lead --attach /tmp/test-results.txt
```

---

## 6. Lead-as-CEO Testing & Deployment Oversight

The Lead agent operates as CEO of the testing and deployment pipeline:
it decomposes test plans, routes test execution to specialist agents via
bindings and `sessions_send`, synthesizes results from all test runners, and
autonomously grants the tools and permissions agents need to run their
test suites.

### 6.1 Core Testing Responsibilities

1. **Test Plan Decomposition**: The Lead breaks a "test the squad" directive
   into specific assignments:
   - Unit tests → Coder agent (Vitest suite)
   - Integration tests → Reviewer agent (handoff verification)
   - Chaos tests → dedicated Chaos agent or Lead itself
   - Load tests → Infrastructure agent (K8s scaling)
   - Human gates → routed to appropriate approvers via `sessions_send`

   Each assignment is dispatched through bindings—not hardcoded pipelines.
   The Lead decides *per test run* which agents handle which tests based on
   current availability and capability.

2. **Autonomous Capability Grants for Testing**: The Lead can **autonomously
   grant test-related tools, API keys, sandbox permissions, and execution
   rights** to agents as test requirements evolve:
   - **Low-risk grants** (read-only log access, sandbox spin-up, test
     runner execution, mock provider configuration) are issued autonomously
     with no human involvement.
   - **High-risk grants** (production database read access for integration
     tests, deployment credentials, cost-monitoring API keys) require
     **one-time human approval** only. Once approved, the Lead re-issues
     the grant for subsequent test runs without asking again.
   - All grants are logged to MEMORY.md for audit trail.

3. **Result Synthesis & Go/No-Go**: The Lead parses output from all test
   runners—Vitest results, `log.md` files from sub-agents, chaos test
   reports, load test metrics—and produces a unified go/no-go decision:

   ```markdown
   ## Test Run Summary — 2026-03-04T14:00:00Z

   | Suite | Agent | Status | Details |
   |---|---|---|---|
   | Unit (Vitest) | coder-01 | PASS | 247/247, 72% coverage |
   | Integration | reviewer-01 | PASS | 12/12 handoffs verified |
   | Chaos (tool fail) | chaos-01 | PASS | graceful degradation confirmed |
   | Chaos (cost spike) | chaos-01 | WARN | circuit breaker at $680, not $750 |
   | Load (10 concurrent) | infra-01 | PASS | queue depth max 6, no drops |
   | Human gate | @chad | PENDING | awaiting approval |

   **Decision**: CONDITIONAL GO — pending human approval and cost threshold fix.
   ```

4. **Deployment Gating**: The Lead triggers deployment only after all test
   suites pass and human gates clear. It spins up a parallel test squad via
   a unique `dmScope` to avoid polluting the production environment:

   ```bash
   # Lead creates isolated test scope
   openclaw scope create --name "test-$(date +%s)" --mode isolated-docker
   # Runs full regression in isolated scope
   # Merges results, sends go/no-go
   ```

5. **Cron-Based Regression**: The Lead schedules nightly regression runs
   via HEARTBEAT.md, automatically re-running the full suite and alerting
   on regressions:

   ```yaml
   # In Lead's HEARTBEAT.md
   test_cron:
     schedule: "0 2 * * *"    # 2 AM daily
     suite: full_regression
     on_failure: alert_human
     on_success: log_to_memory
   ```

### 6.2 Why Loose Coordination Beats Rigid Test Pipelines

Rigid CI/CD pipelines (run unit → integration → e2e → deploy, always in that
order, always the same agents) create **straight-jacket automations** that
break when the squad evolves:

| Rigid Pipeline Problem | Loose Coordination Solution |
|---|---|
| Adding a new agent requires pipeline rewrite | Lead dynamically assigns tests based on agent roster |
| All tests run even when only one agent changed | Lead scopes tests to affected agents via git diff |
| Single failure blocks entire pipeline | Lead can promote partial deployments for unaffected agents |
| Test agent assignment is hardcoded | Lead routes based on current load and capability |
| Pipeline config lives in YAML outside the squad | Test strategy lives in Lead's SOUL.md—agents own it |

The Lead-as-CEO approach means test strategy **evolves with the squad**. When
a new specialist agent joins, the Lead discovers its capabilities (via
SKILL.md) and assigns appropriate tests—no pipeline YAML to update, no
DevOps ticket to file.

### 6.3 Temporary Test Tool Grants

The Lead grants temporary execution tools (`exec`, `write`) to test agents
via sandbox configuration. These grants are scoped to the test run and
automatically revoked when the test scope is destroyed:

```json
{
  "test_scope": {
    "grants": {
      "coder-01": ["exec", "write", "web_search"],
      "reviewer-01": ["read", "agentToAgent"],
      "chaos-01": ["exec", "write", "mock_provider"]
    },
    "ttl_seconds": 3600,
    "auto_revoke": true
  }
}
```

---

## 7. Integration with Independence & Memory

OpenClaw's distributed memory model requires strict test isolation to prevent
pollution of production state.

### 7.1 Private Test Workspaces

Every test run dynamically generates a unique workspace directory:

```
~/.openclaw/agents/<test_uuid>/workspace/
├── SOUL.md          # test-specific personality
├── MEMORY.md        # ephemeral test memory
├── goal.md          # test objective
├── plan.md          # test execution plan
├── status.md        # pass/fail/blocked
└── log.md           # full trace
```

### 7.2 Zero Shared Pollution

Because OpenClaw uses file-based memory, test teardowns simply remove the
ephemeral workspace. Production MEMORY.md is never polluted with test
artifacts:

```bash
# Test teardown — clean and safe
rm -rf ~/.openclaw/agents/${TEST_UUID}/

# Verify no test artifacts leaked to production agents
for agent in ~/.openclaw/agents/*/; do
  grep -l "test_uuid" "$agent/workspace/MEMORY.md" 2>/dev/null && \
    echo "LEAK: $(basename $agent)" || true
done
```

### 7.3 Per-Agent Session Isolation

Each agent's sessions are isolated by design—no cross-agent memory sharing
unless explicitly routed via `agentToAgent`. Test sessions use unique keys
(`session:test-<uuid>`) that never collide with production sessions.

---

## 8. Integration with Error Recovery & Observability

### 8.1 Auto-Run Tests on Error Patterns

Production webhooks catch failure events and automatically trigger the Lead
to run targeted regression tests:

```yaml
# In observability config
alerts:
  - name: retry_spike
    condition: "openclaw_retry_count > 5 in 10m"
    action: "sessions_send lead 'Run regression: retry spike on {agent}'"
  - name: tool_failure_cluster
    condition: "openclaw_tool_failures > 3 in 5m"
    action: "sessions_send lead 'Run chaos test: tool failures on {agent}'"
```

### 8.2 Trace Replay for Debugging

When a system silently misbehaves, the `log.md` trace is imported into the
test harness to recreate exact failure conditions:

```bash
# Export production trace
cp ~/.openclaw/agents/coder-01/sessions/prod-session-42/log.md \
   tests/traces/incident-2026-03-04.md

# Replay in isolated test environment
openclaw test:replay --trace tests/traces/incident-2026-03-04.md \
  --mock-providers --assert-no-regression
```

### 8.3 Live Test Smoke

The `pnpm test:live` suite replays real tool-calling flows against actual
providers, catching API deprecations and model behavior changes before they
break production:

```bash
# Nightly cron catches silent API changes
pnpm test:live 2>&1 | tee /var/log/openclaw-live-test.log

# Alert on any failures
if [ $? -ne 0 ]; then
  openclaw send "Live test failures detected — see attached log" \
    --agent lead --attach /var/log/openclaw-live-test.log
fi
```

---

## 9. Integration with Scalability & Burnout Prevention

### 9.1 Load Testing (5–19 Agents)

OpenClaw's Gateway manages concurrency via a lane-aware FIFO queue (`main`,
`cron`, `subagent`, `nested`). Load testing pushes these limits:

```bash
# Flood the global lane to hit agents.defaults.maxConcurrent cap
for i in $(seq 1 20); do
  openclaw send "Load test task $i" --agent coder-01 --lane main &
done
wait

# Assert: tasks queue properly (FIFO), no drops
QUEUED=$(grep "queued" ~/.openclaw/logs/gateway.log | wc -l)
DROPPED=$(grep "dropped" ~/.openclaw/logs/gateway.log | wc -l)
echo "Queued: $QUEUED, Dropped: $DROPPED"
[ "$DROPPED" -eq 0 ] && echo "PASS" || echo "FAIL: tasks dropped"
```

Scale via LumaDock Docker Compose → Kubernetes HPA:

```yaml
# K8s HPA for load testing
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: openclaw-agents
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: openclaw-squad
  minReplicas: 3
  maxReplicas: 19
  metrics:
    - type: Pods
      pods:
        metric:
          name: openclaw_queue_depth
        target:
          type: AverageValue
          averageValue: "4"
```

### 9.2 Burnout Simulation

Monitor `openclaw_queue_depth`. If sustained depth stays above 4 in the main
lane, the test asserts the squad successfully routes lower-priority tasks to
cheaper, asynchronous models:

```python
def test_burnout_prevention(squad):
    """Squad offloads to cheaper models under sustained load."""
    flood_main_lane(squad, task_count=50, duration_minutes=10)
    assert queue_depth_avg(squad, lane="main") < 6
    assert model_used(squad, "claude-haiku-4-5") > 0  # offloaded tasks
    assert no_tasks_dropped(squad)
```

X posts report token/cost spikes in high-traffic squads (1k–3k tokens per
response under load). Use `agent-audit` skill to track per-agent cost/ROI
during load tests.

---

## 10. Real 2026 Production Examples

| Deployment | Squad Size | Test Strategy | Key Result |
|---|---|---|---|
| **shenhao-stu** | 9 agents | Setup dry-run + CLI probes + adversarial critic pairs | 100% pass on dry-run + probe checks; session isolation confirmed |
| **LumaDock** | 19 agents | Docker sandboxing + custom lane queues + K8s HPA | Zero cross-agent token bleed during parallel task execution |
| **Pantheon** | Regression | pytest-openclaw nightly cron jobs | Caught silent API deprecation before it broke primary Orchestrator |
| **shenhao-stu (chat-replay)** | 9 agents | `sessions_send` intercept mocks | Saved ~$400/week catching infinite loop error in staging |
| **General 19-agent** | 19 agents | Human + 19 specialized agents (requirements → testing → deploy) | Stable 24/7 operation with sandbox + human gates |

**Coverage metrics today**: ~70% core (Vitest) + 100% sandbox checks in
shenhao-stu setups. The gap is in chaos and integration coverage, which
remains team-specific.

---

## 11. Common Failure Modes & Anti-Patterns

### 11.1 Testing Anti-Patterns

| Anti-Pattern | Consequence | Fix |
|---|---|---|
| **No sandbox** | Full system compromise (18k exposed instances scanned; malicious skills) | Always `sandbox.mode: "all"` in test environments |
| **No human gate** | Runaway token spend ($750+ weekend bills) | agentgate + Lead approval for production deploys |
| **Shared test state** | False positives, corrupted `status.md` | Use per-test unique session keys |
| **No Lead oversight** | Untested chaos (42 incidents in 28 days documented on Reddit) | Lead-as-CEO with mandatory test-before-deploy |
| **Over-orchestration** | LLM randomly decides retry logic | Deterministic hooks + hard concurrency caps |
| **Generalist agents without evaluation** | Reliability drops under load | Use `agent-evaluation` skill per specialist |
| **Testing only happy paths** | Chaos failures in production | Chaos suite: tool fail, cost spike, loop, bloat |
| **Untested restores** | Backup exists but restore fails | Monthly restore drills (Topic 15) |

### 11.2 The Infamous $750 Weekend

Deploying without circuit breakers or cost monitoring leads to silent,
massive API bills. Prevention:

1. Set `maxTokenBudget` per agent in `openclaw.json`.
2. Monitor `openclaw_token_spend` in Prometheus.
3. Circuit breaker at 3× daily average.
4. Lead gets Telegram alert at 2× threshold.
5. Chaos test the circuit breaker monthly.

---

## 12. Comparison Table

| Aspect | Manual (CLI + Messages) | Automated (Vitest + Skills) | Lead-Driven (CEO + Workflows) |
|---|---|---|---|
| **Speed** | Slow | Fast (coverage gate) | Medium (review gates) |
| **Coverage** | Low | 70%+ (unit/live) | Behavioral + ROI + chaos |
| **Failure Simulation** | Basic tool deny | Mock provider + sandbox | Adversarial pairs + chaos suite |
| **Human Oversight** | Full | Optional | Mandatory at gates |
| **Scalability** | Poor | Good (Docker runners) | Best (K8s HPA + Lead routing) |
| **Cost** | Free | Free | Human time at gates |
| **Maintenance** | None | CI config | Lead SOUL.md (self-evolving) |
| **Best For** | Quick smoke tests | CI/CD pipelines | Production deployment gates |

**Pros of Current State**: Sandbox isolation, CLI verification, skill
extensibility, live model smoke tests, zero-cost local runs, strong community
momentum.

**Cons of Current State**: No official pytest integration, no standard
chat-replay, no dedicated mock libraries, limited chaos simulation depth, no
native Lead test role (community pattern only), no auto-regression cron in
core.

---

## 13. Step-by-Step Setup Commands

### 13.1 Minimum Viable Test Suite (10 Minutes)

```bash
# 1. Install OpenClaw (official)
curl -fsSL https://get.openclaw.ai | bash

# 2. Install test-related skills
openclaw skills add test-master agent-evaluation agentgate

# 3. Run core test suite
pnpm test              # unit + integration
pnpm test:e2e          # gateway smoke
pnpm test:coverage     # verify 70% gate

# 4. Verify sandbox isolation
openclaw agents list --bindings
docker ps --filter "name=openclaw-sbx-"
```

### 13.2 Multi-Agent Squad Testing (30 Minutes)

```bash
# 1. Deploy 9-agent squad
git clone https://github.com/shenhao-stu/openclaw-agents
cd openclaw-agents
./setup.sh --mode local
openclaw agents list --bindings

# 2. Install mock and chaos testing tools
pip install pytest-openclaw openclaw-mock-bindings  # where available
openclaw skills add agent-team-orchestration arc-skill-sandbox

# 3. Create mock bindings for handoff testing
mkdir -p tests/mocks
cat << 'EOF' > tests/mocks/reviewer_mock.json
{
  "event": "code_complete",
  "project": "project-a",
  "mock_response": {"approved": false, "feedback": "Memory leak detected."}
}
EOF

# 4. Initialize isolated Docker test mode
openclaw init-tests --mode isolated-docker

# 5. Run full regression with chaos
pytest tests/multi_agent/ --spawn-depth-limit=2 --chaos-mode=true

# 6. Run load tests
for i in $(seq 1 10); do
  openclaw send "Load test $i" --agent coder-01 &
done
wait
grep "dropped" ~/.openclaw/logs/gateway.log | wc -l  # should be 0
```

### 13.3 Lead-as-CEO Test Pipeline (Production)

```bash
# 1. Install orchestration and audit skills
openclaw skills add agent-team-orchestration agent-audit agent-audit-trail

# 2. Configure Lead's HEARTBEAT.md for nightly regression
cat >> ~/.openclaw/agents/lead/workspace/HEARTBEAT.md << 'EOF'

## Nightly Test Cron
- Schedule: 0 2 * * * (2 AM daily)
- Run: full regression (unit + integration + chaos + load)
- On failure: alert human via Telegram
- On success: log to MEMORY.md, update test dashboard
EOF

# 3. Configure cron
echo "0 2 * * * cd ~/openclaw-agents && pnpm test:live && pytest tests/" \
  | crontab -

# 4. Verify Lead can access all test results
openclaw send "Run test status check" --agent lead
```

---

## 14. Practical Recommendations

### For Solo Developers / Small Teams (1–3 Agents)

- Start with **Vitest core suite** + **sandbox verification** +
  **agent-evaluation skill** (covers ~80% of testing needs).
- Add `agentgate` for human gates on any production deployment.
- Run `pnpm test:live` + CLI probes before every deployment.
- Skip chaos testing initially—add it when you hit your first silent failure.

### For Medium Teams (4–8 Agents)

- Deploy **shenhao-stu 9-agent squad** as test baseline.
- Add **mock handoffs** for all inter-agent communication paths.
- Implement **chaos suite**: tool failures, cost spikes, delegation loops.
- Lead-as-CEO manages nightly regression via HEARTBEAT.md cron.
- Track coverage manually via Vitest + `agent-audit` until community
  `pytest-openclaw` stabilizes.

### For Large Deployments (9+ Agents, Multiple Leads)

- Full **Lead-as-CEO test pipeline** with autonomous capability grants.
- **LumaDock K8s HPA** for load testing at scale (5–19 agent squads).
- **Chat-replay harnesses** for deterministic regression on critical paths.
- Monthly **restore drills** (Topic 15) integrated into test suite.
- Per-agent **cost/ROI audits** via `agent-audit` after every test run.
- Hierarchical test oversight: each Lead tests its squad, meta-Lead
  coordinates cross-squad integration tests.

### Universal Best Practices

1. **Always run sandbox verification** before any other test—sandbox failures
   mean nothing else is trustworthy.
2. **Use unique session keys per test run** to prevent state pollution.
3. **Test the circuit breakers**, not just the happy paths.
4. **Automate regression via HEARTBEAT.md cron**—manual testing gets skipped.
5. **Monitor test freshness**—alert if nightly regression hasn't run in 48h.
6. **Real coverage today: ~70% core + 100% sandbox + variable chaos**—track
   your team's actual coverage, not aspirational numbers.
7. **Let the Lead own test strategy in its SOUL.md**—this keeps testing
   loosely coordinated and self-evolving rather than locked in rigid YAML.

---

## 15. Summary

Testing multi-agent OpenClaw squads in 2026 combines **official Vitest suites**
(70% coverage gate), **Docker sandbox isolation** (per-agent containers),
**community tools** (shenhao-stu 9-agent squad, 5400+ skills), and emerging
**mock/chaos frameworks** (pytest-openclaw, chat-replay harnesses). The
Lead-as-CEO orchestrates the full testing lifecycle: decomposing test plans,
routing execution to specialist agents via bindings and `sessions_send`,
autonomously granting test tools and permissions (one-time human approval for
high-risk grants), and synthesizing go/no-go deployment decisions. Loose
coordination—where the Lead dynamically assigns tests based on the current
squad roster and capabilities—prevents the rigid pipeline problem that plagues
traditional CI/CD. The key principle: **test like you deploy—with sandbox
isolation, human gates at critical points, and a Lead that evolves the test
strategy as the squad grows**.
