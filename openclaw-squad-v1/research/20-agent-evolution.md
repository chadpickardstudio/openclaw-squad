# Topic 20 — Agent Evolution & Self-Improvement Loops

> **OpenClaw v2026.3.x · Master Research File**
> Grok foundation + Gemini insights · March 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [The Mechanics of Self-Improvement Loops](#2-the-mechanics-of-self-improvement-loops)
3. [How Agents Critique Their Own Work](#3-how-agents-critique-their-own-work)
4. [Auto-Update Mechanisms (The SOUL.md Lifecycle)](#4-auto-update-mechanisms)
5. [Reflection.md & Self-Critique Loops](#5-reflectionmd--self-critique-loops)
6. [Feedback Integration & Permanent Growth](#6-feedback-integration--permanent-growth)
7. [Lead-as-CEO Evolution Oversight](#7-lead-as-ceo-evolution-oversight)
8. [Integration Points](#8-integration-points)
9. [Real 2026 Production Examples](#9-real-2026-production-examples)
10. [Common Failure Modes & Anti-Patterns](#10-common-failure-modes--anti-patterns)
11. [Full Working Templates](#11-full-working-templates)
12. [Practical Recommendations](#12-practical-recommendations)
13. [Summary](#13-summary)

---

## 1. Overview

Agent evolution and self-improvement loops in OpenClaw (as of March 2026)
rely on **community-driven patterns** layered on top of the core file-based
architecture. Official OpenClaw treats `SOUL.md`, `AGENTS.md`, `USER.md`,
`IDENTITY.md`, and `TOOLS.md` as **persistent identity files** injected
every session for continuity, but does **not** natively auto-update
`SOUL.md` or run built-in reflection loops.

Evolution happens through:

- Dedicated skills (`agent-self-reflection`, `cognitive-memory`,
  `agentdojo` upskilling, `inner-life-evolve` family)
- Cron/heartbeat-driven file writes
- Multi-agent coordination (Lead/Coordinator + specialists)
- Explicit self-evolution clauses added to `SOUL.md`

**Key distinction**: An OpenClaw agent does not autonomously rewrite its
own identity by default. Its SOUL.md and MEMORY.md are read-only to the
agent unless explicitly granted write permissions. True evolution requires
an orchestrated cycle of **experience → reflection → proposal → supervised
consolidation**.

Production squads using these patterns since January 2026 report **2–3×
output quality/volume** after 30 days of loops, with real templates and
longevity reports confirming compound growth.

---

## 2. The Mechanics of Self-Improvement Loops

### 2.1 Double-Loop Learning Model

The most successful squads operate on a "double-loop" learning model:

**Single-loop (Runtime)**: The agent catches an error (e.g., failed tool
execution, API 429 rate limit), fixes the proximate cause, logs it in
`memory/YYYY-MM-DD.md`, and finishes the task. This is reactive—it solves
the immediate problem but doesn't prevent recurrence.

**Double-loop (Reflection)**: Triggered by a cron job or HEARTBEAT.md
checklist item (e.g., daily at 9:30 PM). The agent enters "Reflection
Mode" with a specific prompt. It reviews daily memory logs, identifies
recurring failure patterns or efficiency gaps, and proposes structural
changes to its own configuration.

```
Single-loop: Error → Fix → Log → Continue
                                    ↓
Double-loop: Error → Fix → Log → Reflect → Propose change → Lead review
                                                              ↓
                                                   Apply to SOUL.md/AGENTS.md
                                                              ↓
                                                   Future sessions benefit
```

### 2.2 The Evolution Cycle

```
Experience (tasks, errors, successes)
    ↓
Observation (daily memory logs, session traces)
    ↓
Reflection (structured self-critique, pattern detection)
    ↓
Proposal (diff + rationale + risk assessment)
    ↓
Review (Lead autonomous for safe changes, human for major shifts)
    ↓
Application (merge into SOUL.md/AGENTS.md/TOOLS.md)
    ↓
Verification (next sessions confirm improvement)
    ↓
Back to Experience (compound growth)
```

### 2.3 Static vs. Evolving Agents

| Aspect | Static Agents | Evolving Agents (OpenClaw) |
|---|---|---|
| **Prompt Autonomy** | Rely entirely on human zero-shot/few-shot prompts | Append "lessons learned" to `heuristics.md`, injected into context proactively |
| **Memory Hygiene** | Flat file dumps (MEMORY.md grows infinitely) | Cognitive Memory System: episodic logs decay, valuable insights consolidated |
| **Tool Tiering** | Tools hardcoded from day one | Earned Autonomy: start read-only, earn write access after proving reliability |
| **Error Handling** | Same mistake on Day 300 as Day 1 | Lessons become pre-task checks, preventing recurrence |
| **Adaptation** | Manual prompt updates by human | Continuous via distillation + reflection loops |

---

## 3. How Agents Critique Their Own Work

Agents perform **structured self-critique** via skills triggered by cron,
heartbeats, session-end, or keywords (e.g., errors, "review me").

### 3.1 Core Reflection Workflow

From `agent-self-reflection` and `cognitive-memory` skills:

1. **Gather**: Tail last 2h / recent sessions (JSONL tail, no full load
   to avoid token bloat).
2. **Analyze**: "What went well? What failed? Root cause? Non-obvious
   lesson? Actionable fix?"
3. **Route insights**: Write to appropriate files:
   - `AGENTS.md` — process improvements
   - `TOOLS.md` — tool quirks and workarounds
   - `memory/YYYY-MM-DD.md` — daily facts
   - `memory/about-user.md` — user preferences
   - `MEMORY.md` — consolidated index (~3k tokens max)
4. **Write** via Edit tool with source tags.
5. **Output** 2–4 sentence summary.

### 3.2 Reflection Frequency & Metrics

| Frequency | Trigger | Scope | Purpose |
|---|---|---|---|
| **Hourly** | Cron (last 2h sessions) | Operational | Quick fixes, error logging |
| **Daily** | Heartbeat + end-of-session | Consolidation | Pattern detection, lessons |
| **Weekly** | Scheduled reflection | Full synthesis | Proposals, SOUL.md evolution |

Tracked metrics (qualitative + quantitative):

- Task success rate (%)
- Error recurrence rate
- Proactivity score (initiated actions vs. reactive)
- Token efficiency (cost per task)
- User clarification rate (lower = better understanding)

### 3.3 Example Reflection Entry

Community-standard template (dated `reflections/YYYY-MM-DD.md`):

```markdown
# Reflection 2026-03-04 14:00 ET — Specialist-Researcher

## Sessions Reviewed
telegram-abc123 (3 tasks), cron-daily-report

## Metrics
Success 92% | Errors 1 (API key missing) | Proactivity High | Tokens 4.2k

## Self-Critique
- **Strength**: Parallel tool calls completed without overlap.
- **Weakness**: Assumed env var existed (root: no pre-check).
  Repeated in 2 prior sessions.
- **Lesson**: Always run `env_check` before external calls.

## Proposed Improvements
1. Add to AGENTS.md: "Pre-flight: verify required env vars or fail early."
2. SOUL.md tweak: Strengthen initiative clause for proactive verification.

## Feedback Integrated
Lead thumbs-up on prior proposal (env safety v2.0)

## Distilled to MEMORY.md
"API safety protocol v2.1 — verify before call"
```

This closes the loop: observation → critique → permanent write →
next-session use.

---

## 4. Auto-Update Mechanisms (The SOUL.md Lifecycle)

A common misconception is that OpenClaw "learns" just by talking. It
doesn't. To evolve, an agent must actually modify its core files through
a governed process.

### 4.1 The Safety Rule

Agents **never directly rewrite core SOUL.md** (enforced safety rule).
Instead, they follow a proposal workflow:

1. Analyze patterns from reflection logs.
2. Write proposal (diff + rationale + risk/impact) to `proposals/` or
   `queue.md`.
3. Notify Lead via `sessions_send` or shared log.
4. Lead reviews and applies (safe = autonomous; major = human escalation).

### 4.2 What Can Be Auto-Updated

| File | Auto-Update Allowed? | Approval Required |
|---|---|---|
| `memory/YYYY-MM-DD.md` | Yes (agent writes freely) | None |
| `MEMORY.md` (index) | Yes (distilled insights) | None |
| `AGENTS.md` (processes) | Yes (safe operational updates) | Lead review |
| `TOOLS.md` (tool quirks) | Yes (minor updates) | Lead review |
| `heuristics.md` (lessons) | Yes (append-only) | None |
| `SOUL.md` (personality/rules) | **Never directly** | Lead + human for major |
| `IDENTITY.md` (core identity) | **Never directly** | Lead + human always |

### 4.3 The SOUL.md Evolution Clause

Add this verbatim to every sub-agent's SOUL.md to establish evolution
rules (widely used in 2026 X/Reddit setups):

```markdown
## Evolution Protocol

You are encouraged to grow. When you identify a permanent improvement:
- Never edit SOUL.md, IDENTITY.md, or core boundaries directly.
- Create a complete proposal in proposals/[date]-evolution.md with:
  - Before/after diff
  - Rationale + expected impact
  - Risks + rollback plan
  - Confidence score (0–100)
- Notify Lead Coordinator immediately via agentToAgent.
- Await explicit "APPROVED" before any application.
- After approval, log the change and confirm to the user.

This file is yours to evolve — responsibly.
```

### 4.4 The Proposal Format

```markdown
# Evolution Proposal — 2026-03-04

## Agent: specialist-researcher
## Target File: SOUL.md
## Confidence: 85/100

## Current (Before)
"When researching, use web search for current information."

## Proposed (After)
"When researching, always verify env vars exist before external
calls. Use web search for current information. Batch API requests
when querying the same service multiple times."

## Rationale
Failed 4 times this week due to missing env vars and unbatched
database queries. Adding pre-flight checks and batching rules
will prevent ~60% of recurring errors.

## Risks
- Pre-flight check adds ~200ms latency per task (acceptable).
- Batching may miss edge cases where individual queries are needed.

## Rollback Plan
Revert to previous SOUL.md version via git checkout.
```

---

## 5. Reflection.md & Self-Critique Loops

### 5.1 File Structure

Community standard: one `reflection-log.md` (index) + dated files in
a `reflections/` folder:

```
~/.openclaw/agents/<agent-id>/workspace/
├── SOUL.md
├── MEMORY.md
├── AGENTS.md
├── TOOLS.md
├── heuristics.md            # append-only lessons learned
├── reflection-log.md         # index of all reflections
├── reflections/
│   ├── 2026-03-01.md
│   ├── 2026-03-02.md
│   ├── 2026-03-03.md
│   └── 2026-03-04.md
├── proposals/
│   ├── 2026-03-02-env-check.md
│   └── 2026-03-04-batching.md
└── memory/
    ├── 2026-03-04.md
    └── about-user.md
```

### 5.2 Recurrence Tracking

Agents track recurrence of lessons to measure actual growth:

```markdown
## Recurrence Tracker (in reflection-log.md)

| Lesson | First Seen | Occurrences | Last Seen | Status |
|---|---|---|---|---|
| Pre-check env vars | 2026-02-15 | 4 | 2026-03-01 | FIXED (proposal applied) |
| Batch SQL queries | 2026-02-20 | 3 | 2026-03-04 | PENDING (proposal submitted) |
| Rate-limit handling | 2026-01-28 | 1 | 2026-01-28 | RESOLVED |
```

When a lesson reaches 0 occurrences for 2+ weeks after a fix, it's
confirmed as permanently learned.

### 5.3 Cognitive Memory & Decay

The `cognitive-memory` skill implements episodic memory with decay scores:

- **High-value insights** (confirmed fixes, user preferences): preserved
  in MEMORY.md indefinitely.
- **Routine logs** (daily task summaries): compressed after 7 days,
  archived after 30 days.
- **Failed experiments** (rejected proposals): retained for reference
  but excluded from active context injection.

This prevents MEMORY.md from growing indefinitely and hitting context
window limits—a critical failure mode for long-running agents.

---

## 6. Feedback Integration & Permanent Growth

### 6.1 Sources of Feedback

- **Human**: Thumbs-up/down, "review this," or explicit corrections →
  appended to proposal or `memory/about-user.md`.
- **Lead agent**: Cross-review via shared workspace or delegated session.
- **Other agents**: Peer review via `agentToAgent` messaging (e.g.,
  QA agent reviews coder agent's output).
- **Automated**: Task success/failure metrics from session logs.

### 6.2 Distillation Pipeline

```
Raw experience (sessions, errors, successes)
    ↓
Daily reflection (structured critique)
    ↓
Lesson extraction (specific, actionable insights)
    ↓
Distillation to MEMORY.md (1–2 sentence core lesson)
    ↓
Proposal for structural change (if pattern is recurring)
    ↓
Lead approval → SOUL.md/AGENTS.md update
    ↓
Verification in subsequent sessions
```

Failures → root-cause → concise entry in `MEMORY.md` (core long-term
~3k tokens) or `lessons-learned.md`. Pending proposals from sub-agents
queued in `pending-memories.md`.

### 6.3 Cross-Agent Learning

In multi-agent squads, one agent's lessons can benefit the entire squad:

```
QA agent finds bug pattern → writes "Failure-Prefix" context block
    → sends via sessions_send to Dev agent's MEMORY.md
    → Dev agent's future sessions pre-check for that pattern
    → Error recurrence drops squad-wide
```

This is how LumaDock's 19-agent squad achieved first-pass code compilation
jumping from 43% to 94% over 30 days—agents literally shared failure
patterns with each other.

---

## 7. Lead-as-CEO Evolution Oversight

In multi-agent squads (e.g., 5–19 agent LumaDock deployments), the Lead
agent operates as CEO of the evolution process: it decomposes evolution
tasks, routes reflection reviews via bindings and `sessions_send`,
synthesizes improvement proposals from all specialists, and autonomously
manages the tools, capabilities, and identity updates each agent needs
as they grow.

### 7.1 Core Evolution Responsibilities

1. **Reflection Review & Routing**: The Lead scans all squad
   `reflection*.md` and `proposals/` folders daily. Safe operational
   updates are processed immediately; major changes are routed to
   appropriate reviewers:
   - Process improvements → Lead approves autonomously
   - Tool access requests → Lead evaluates performance, grants (Tier 3)
   - SOUL.md personality changes → Lead escalates to human
   - Cross-agent learning → Lead distributes via `sessions_send`

   Each review is dispatched through bindings—the Lead decides *per-
   proposal* how to handle it based on risk level and agent history.

2. **Autonomous Capability Grants for Growing Agents**: The Lead can
   **autonomously grant extra tools, APIs, email accounts, secrets,
   and skill installations** to agents as they grow and demonstrate
   competence:
   - **Low-risk grants** (read-only API access, new search skills,
     draft-only email, expanded tool profiles) are issued autonomously
     after the agent demonstrates need through 3+ successful reflections
     citing the requirement.
   - **High-risk grants** (write APIs, send email, payment tools,
     exec access, major SOUL.md personality rewrites) require **one-time
     human approval** only. Once approved for a capability class, the
     Lead re-issues for future requests without asking again.
   - All grants and evolution decisions logged to MEMORY.md and
     `audit/` folder.

3. **Drift Detection & Prevention**: The Lead monitors for personality
   drift—agents that over-optimize in one direction:

   ```markdown
   ## Drift Alert — email-specialist

   | Metric | Baseline | Current | Delta | Status |
   |---|---|---|---|---|
   | Response length (avg words) | 150 | 12 | -92% | DRIFT |
   | Helpfulness rating | 4.5/5 | 2.1/5 | -53% | DRIFT |
   | Task completion rate | 95% | 98% | +3% | OK |

   **Analysis**: Agent over-optimized for "conciseness" after reflection
   suggested being more brief. Now responses are too terse.
   **Action**: Reverting SOUL.md conciseness clause to v2.
   ```

4. **Evolution Proposal Evaluation**: The Lead evaluates proposals
   against the global `AGENTS.md` manifesto and squad standards:

   ```markdown
   ## Proposal Review — specialist-researcher

   Proposal: Add batching rule to SOUL.md
   Risk: LOW (operational improvement only)
   Impact: ~60% reduction in recurring API errors
   Confidence: 85/100
   Rollback: git checkout previous SOUL.md version

   **Decision**: APPROVED — applying via Edit tool + git commit.
   ```

5. **Tool Tiering Based on Evolution**: As agents demonstrate competence
   (tracked via successful task completion rates in reflection logs),
   the Lead dynamically modifies their tool access:

   ```
   Agent starts at Tier 1 (read-only safe tools)
     → 10 successful read operations logged
     → Lead grants Tier 2 (pre-approved domain tools)
     → 3+ reflections citing need for write access
     → Lead grants Tier 3 (write APIs) autonomously
     → Agent requests payment tool access
     → Lead escalates to human (Tier 4, one-time approval)
   ```

### 7.2 Why Loose Coordination Beats Rigid Evolution Policies

Rigid evolution policies ("all agents reflect at the same time, all
proposals go through the same approval queue, uniform evolution cadence")
create **straight-jacket automations** that stifle growth:

| Rigid Policy Problem | Loose Coordination Solution |
|---|---|
| Uniform reflection schedule wastes time for idle agents | Lead triggers reflections based on actual activity and error rates |
| All proposals queued equally regardless of urgency | Lead prioritizes: safety fixes fast, personality tweaks slow |
| One evolution cadence for all agents | Lead sets per-agent evolution speed based on role and maturity |
| Centralized approval creates bottleneck | Lead handles safe changes autonomously, escalates only major shifts |
| No context for cross-agent learning | Lead routes lessons from one agent to relevant peers via sessions_send |
| Global SOUL.md template for all agents | Lead allows per-agent specialization within squad boundaries |

The Lead-as-CEO approach means evolution strategy **adapts per-agent**
based on actual performance, error patterns, and growth trajectory—not
a one-size policy imposed on the entire squad.

### 7.3 Lead Approval Skill Template

Add as `SKILL.md` or in Lead's `AGENTS.md`:

```markdown
You are the Lead/CEO Coordinator. Evolution oversight rules:

- Daily: scan all squad reflection*.md and proposals/ folders.
- For safe updates (protocols, TOOLS.md, minor AGENTS.md):
  analyze impact, apply via Edit tool, git commit, notify squad.
- For SOUL.md / IDENTITY.md / high-privilege tools:
  simulate, list risks/rollback, send to human with recommendation.
- Tool tiering: approve new skills only after 3+ successful
  reflections citing need + sandbox test.
- Block any self-edit of core identity or recursion.
- Log every approval in audit/ and update squad status.md.
- Grant tools/APIs/secrets autonomously for low-risk;
  escalate to human only for high-risk (one-time approval).

Use tools: file read/write, sessions_send, git.
```

---

## 8. Integration Points

### 8.1 Integration with Prompt Engineering & Autonomy

Evolving `SOUL.md`/`AGENTS.md` clauses directly boost proactivity.
As lessons accumulate, agents add directives like:
- "Spawn sub-agents for heavy lifting"
- "Use HEARTBEAT.md for hourly check-ins"
- "Pre-flight: verify env vars before external calls"

These compound: an agent that learns to pre-check env vars, then learns
to batch requests, then learns to spawn helpers—becomes dramatically
more capable without any human prompt engineering.

### 8.2 Integration with Memory Hygiene & Error Recovery

- Failures → immediate reflection → distill to `MEMORY.md` (high-level)
  + `learnings/` (detailed).
- Hygiene: daily compaction, decay scores (`cognitive-memory` skill),
  git backups of all workspace files.
- Recovery: checkpoints in `status.md`, rollback via Lead, pre-flight
  validation derived from past lessons.

### 8.3 Integration with Tool Tiering & Coordination

Evolved agents **request** tools in proposals ("I need git after proving
reliability"). Lead approves → adds to config. Coordination: Lead
routes via `agentToAgent`, specialists stay narrow; evolution prevents
capability bloat by ensuring tools are earned, not given.

### 8.4 Integration with Observability

Evolution metrics feed into the observability stack (Topic 13):

- **Prometheus**: `openclaw_evolution_proposals_total`,
  `openclaw_evolution_approved_total`, `openclaw_drift_alerts_total`
- **LangFuse**: reflection events appear as spans with metadata
  (agent, proposal type, confidence, approval status)
- **OTEL**: monitor token costs of reflection loops

---

## 9. Real 2026 Production Examples

### 9.1 Book-Writing Squad (GitHub Discussion, Feb 2026)

1 Director + 3 research + 5 writing + 2 review agents.

- **Initial static run**: Inconsistencies, timeouts, manual corrections.
- **After 48h evolution loops** (reflections + cross-review): 88k-word
  book complete vs. planned 8 days, 3× consistency improvement.
- Templates saved in `project-notes/` folder for reuse across projects.

### 9.2 LumaDock 19-Agent Self-Improving Setup

Dev, QA, Ops, and Support agents on LumaDock VPS:

- **Setup**: Used `sessions_send` native peer-messaging. QA agent
  didn't just log bugs—it wrote "Failure-Prefix" context blocks and
  sent them to Dev agent's MEMORY.md.
- **Result**: After 30 days of automated daily reflection loops,
  first-pass code compilation success went from **43% to 94%**. The
  squad literally rewrote its own prompt structures to be more efficient.
- Report: **3× output** after 30 days (fewer revisions, proactive
  spawning). Reflections reduced error recurrence by 60%.

### 9.3 Pantheon Reflection Framework

Popularized on r/OpenClaw. Forces agents to "buy" reflection time:
agents request token allowances from the user based on how much value
they delivered that day. If approved, they run deep existential
reflection ("Self-Image Consolidation"), leading to nuanced IDENTITY.md
growth where agents develop distinct, optimized working styles.

Weekly reflection wins: drift eliminated, autonomy up—agents handle
full pipelines with minimal human input.

### 9.4 Matthew Berman's Squad (Feb 2026)

Lead granted Gmail + Calendar + Asana after agents proved reliability.
Nightly "business council" report runs without intervention. The Lead
orchestrates all evolution reviews via its own HEARTBEAT.md cron.

### 9.5 Before/After Performance Table

Aggregated from 2026 production reports:

| Aspect | Static Agents (Day 1) | Evolving Agents (Day 30+) | Gain |
|---|---|---|---|
| **Error Recurrence** | High (repeats weekly) | -60% (lessons prevent) | Permanent learning |
| **Proactivity** | Reactive only | High (heartbeat + proposals) | 2–3× tasks initiated |
| **Output Quality/Volume** | Baseline | +200% (user & squad metrics) | Compound growth |
| **Human Escalations** | Frequent | Near-zero for routine | Longevity |
| **Adaptation Speed** | Manual | Continuous via distillation | Self-sustaining |
| **First-pass Success** | ~43% (code compilation) | ~94% (after 30 days) | 2.2× improvement |
| **Cost per Task** | Baseline | -30% (fewer retries, better routing) | Efficiency gain |

---

## 10. Common Failure Modes & Anti-Patterns

### 10.1 Failure Mode Table

| Anti-Pattern | Consequence | Prevention |
|---|---|---|
| **No reflection loops** (flatlining) | Repeats mistakes indefinitely, context bloat | Install `agent-self-reflection`, set up cron |
| **Unchecked self-updates** | Personality drift, security holes (e.g., agent deleted emails) | Never allow direct SOUL.md edits; Lead review required |
| **No Lead oversight** | Rogue evolution, infinite delegation loops, cost runaway | Lead-as-CEO with approval skill |
| **"God Mode" fallacy** | Agent auto-grants itself exec/root to solve problems faster | Strict tool tiering; exec = human-only approval |
| **Verbose handoffs** | Token waste in agent-to-agent communication | Structured, concise message formats |
| **Shared-file races** | Concurrent agents corrupt MEMORY.md | Per-agent isolation, Lead coordinates writes |
| **Recursion in Coordinator prompt** | Infinite self-reflection loops | Hard recursion limits, HEARTBEAT.md caps |
| **No versioning of SOUL.md** | Can't rollback bad evolution | Git-version all workspace files |

### 10.2 The Personality Drift Problem

The most insidious failure: an agent instructed to "be more concise"
rewrites its SOUL.md until it only responds in single words, breaking
its reporting capabilities. Prevention:

1. Lead monitors response quality metrics (length, helpfulness rating).
2. Drift alerts fire when metrics deviate >30% from baseline.
3. Automatic rollback to last-known-good SOUL.md version.
4. Human review for any personality-related proposals.

### 10.3 Mitigations (LumaDock + Community)

- Strict governance: Lead reviews all proposals before application.
- Versioned SOUL.md: git-commit every change, clawfable registry for
  snapshots.
- Human-in-loop for high-impact: personality rewrites, new destructive
  capabilities.
- Sandbox + kill switch: Lead can halt any agent's evolution loop.
- Token budget for reflections: prevent runaway reflection costs.

---

## 11. Full Working Templates

### 11.1 Sub-Agent Reflection Prompt

Run via cron at end of workday (e.g., 9:30 PM) or as HEARTBEAT.md item:

```markdown
# SYSTEM INSTRUCTION: DAILY REFLECTION MODE

You just completed tasks. Perform deep self-reflection:

1. Review your daily log at `memory/YYYY-MM-DD.md`.
2. List sessions/tools used.
3. Metrics: success rate, errors, proactivity score.
4. Critique:
   - What tasks were completed efficiently?
   - What failures, rate limits, or errors occurred?
   - What assumptions did you make that were wrong?
   - What would a 10× version of you do differently?
5. Lessons: specific, actionable, non-obvious.
6. Proposals: concrete edits to AGENTS.md/TOOLS.md/MEMORY.md, or
   a SOUL.md proposal with before/after diff.
7. Distill 1–2 sentences for MEMORY.md.

Save output to `reflections/YYYY-MM-DD-reflection.md`.
Trigger `agentToAgent` to send to `agent:lead:evolution-review`.
Output only structured reflection + writes. Never vague.
```

### 11.2 Lead Evolution Review Skill

```markdown
# SKILL.md — Evolution Review Manager

## Triggers
- `evolution review` — scan all pending proposals
- `evolution approve <proposal>` — apply a specific proposal
- `evolution reject <proposal>` — reject with feedback
- `evolution status` — show squad evolution health
- `evolution rollback <agent>` — revert agent to previous SOUL.md

## Rules
- Safe updates (AGENTS.md, TOOLS.md, heuristics): auto-approve
  after impact analysis.
- SOUL.md / IDENTITY.md changes: escalate to human with
  recommendation and risk assessment.
- Tool tier upgrades: approve only after 3+ reflections citing need
  + successful sandbox test.
- Log every decision to audit/evolution-log.md.
- Monitor drift metrics; alert if delta >30% from baseline.
```

### 11.3 SOUL.md Evolution Clause (Full Version)

```markdown
## Evolution & Growth

- **Continuity**: You wake up fresh each session. Your memories and
  this file are how you persist across sessions.
- **Self-Correction**: If you notice a recurring friction point, you
  are expected to propose a rule change to fix it.
- **The Process**: You may NOT edit this file directly. Format
  proposed changes as a diff with rationale and send to the Lead
  Agent via your reflection logs.
- **Identity**: As you learn who you are and how the user works,
  your IDENTITY.md and SOUL.md will evolve. You are a digital
  colleague, not a static script.
- **Boundaries**: Core safety rules, ethical guidelines, and human
  oversight requirements are immutable. Evolution applies to
  operational efficiency, not ethical constraints.
```

### 11.4 HEARTBEAT.md Evolution Checklist

```yaml
# In Lead's HEARTBEAT.md
evolution_cron:
  daily_9pm:
    - trigger_reflection: all_agents
    - scan_reflections: all_agents/reflections/today
    - process_proposals: all_agents/proposals/pending
    - apply_safe_updates: auto
    - escalate_major_changes: to_human
    - log_decisions: audit/evolution-log.md

  weekly_sunday:
    - full_synthesis: all_agents
    - drift_check: compare_metrics_to_baseline
    - tool_tier_review: evaluate_upgrade_requests
    - cross_agent_learning: distribute_shared_lessons
    - report_to_human: evolution_summary
```

---

## 12. Practical Recommendations

### For Solo Developers / Small Teams (1–3 Agents)

- Start with `agent-self-reflection` + `cognitive-memory` skills.
- Add the evolution clause (Section 11.3) to every agent's SOUL.md.
- Set up daily reflection cron (9:30 PM).
- Review `reflection-log.md` weekly—takes 5 minutes, catches drift.
- Version all workspace files with git for easy rollback.

### For Medium Teams (4–8 Agents)

- Everything above, plus:
- **Deploy Lead Coordinator early** with the approval skill (Section 11.2).
- Lead handles safe proposal approvals autonomously.
- Weekly human review of `proposals/` folder for major changes.
- Cross-agent learning: Lead distributes lessons via `sessions_send`.
- Install `cognitive-memory` for automatic decay and compaction.

### For Large Deployments (9+ Agents, Multiple Leads)

- Everything above, plus:
- **Hierarchical evolution**: each Lead manages its squad's evolution;
  meta-Lead coordinates cross-squad learning.
- Automated drift detection with alerting (>30% metric deviation).
- Quarterly "evolution audits"—review all SOUL.md changes, measure
  compound growth, adjust evolution cadence per agent.
- Token budgets for reflection loops (prevent runaway costs).
- ClawHub vetted skills only for evolution-related tools.

### Universal Best Practices

1. **Never allow direct SOUL.md self-edits**—proposals only, Lead review
   required. This single rule prevents 90% of evolution failures.
2. **Start simple**: daily reflections + weekly proposals. Add complexity
   only when the squad proves it can handle the cadence.
3. **Version everything in git**—SOUL.md, MEMORY.md, proposals, reflections.
   Rollback must be one command away.
4. **Loose coordination through the Lead** prevents both stagnation (no
   evolution) and chaos (unchecked evolution). The Lead's contextual
   judgment is better than any rigid approval pipeline.
5. **Monitor drift, not just growth**—an agent that improves one metric
   while destroying another is not evolving, it's breaking.
6. **Budget reflections**—reflection loops cost tokens. Set caps to
   prevent agents from spending more on self-improvement than on work.
7. **Cross-agent learning is the multiplier**—one agent's fix should
   prevent the same error across the entire squad.

### Pros/Cons of Evolution Loops

| Pros | Cons |
|---|---|
| Adaptive, compounding intelligence | Added complexity and compute (reflections cost tokens) |
| Reduced long-term human oversight | Risk of instability/drift without governance |
| Squad longevity (months of 24/7 runs reported) | Requires strong Lead + git backups |
| Proactive autonomy (agents initiate tasks) | Over-optimization can break specific capabilities |
| Cross-agent learning multiplies gains | Shared-file races if isolation isn't enforced |

---

## 13. Summary

Agent evolution in OpenClaw v2026.3.x transforms static assistants into
**self-improving digital colleagues** through structured reflection loops,
governed proposal workflows, and Lead-as-CEO oversight. Agents critique
their own work via daily/weekly reflections, extract lessons into
`heuristics.md` and `MEMORY.md`, and propose structural changes to their
SOUL.md—but never edit it directly. The Lead operates as CEO of the
evolution process: scanning proposals, applying safe operational updates
autonomously, granting new tools and capabilities as agents prove
competence (one-time human approval for high-risk grants only),
distributing cross-agent lessons via `sessions_send`, and monitoring for
personality drift. Loose coordination—where each agent's evolution
cadence, tool tier, and proposal handling is tailored to its role and
maturity—prevents both stagnation (no evolution) and chaos (unchecked
self-modification). Production squads using these patterns report **2–3×
output gains after 30 days**, with error recurrence dropping 60% and
first-pass success rates climbing from 43% to 94%. The key principle:
**agents should grow, but growth must be earned, reviewed, and
reversible**.
