# 14. Tool Chaining & Skill Discovery — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, official docs, ClawHub, community repos
> **Last verified**: March 2026 (OpenClaw v2026.3.x, ClawHub ecosystem, SKILL.md standard)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Skill Architecture & SKILL.md Format](#2-skill-architecture--skillmd-format)
3. [ClawHub Marketplace](#3-clawhub-marketplace)
4. [Mid-Task Skill Discovery](#4-mid-task-skill-discovery)
5. [Tiered Approval System](#5-tiered-approval-system)
6. [Lead-as-CEO Skill Authority](#6-lead-as-ceo-skill-authority)
7. [Tool Chaining Best Practices](#7-tool-chaining-best-practices)
8. [Safe Auto-Install Mechanisms](#8-safe-auto-install-mechanisms)
9. [Integration with Memory, Security & Coordination](#9-integration-with-memory-security--coordination)
10. [Real 2026 Production Examples](#10-real-2026-production-examples)
11. [Common Failure Modes & Anti-Patterns](#11-common-failure-modes--anti-patterns)
12. [Step-by-Step Setup Commands](#12-step-by-step-setup-commands)
13. [Practical Recommendations](#13-practical-recommendations)

---

## 1. Overview

OpenClaw loads skills from three tiered locations with strict precedence:

1. **Workspace** (`<workspace>/skills/`) — highest priority, agent-specific
2. **Shared** (`~/.openclaw/skills/`) — shared across all agents on machine
3. **Bundled** — shipped with core install, lowest priority

Extra directories can be added via `skills.load.extraDirs` in
`~/.openclaw/openclaw.json`. Conflicts resolve to the highest-precedence
match. Skills are snapshotted at session start (with optional filesystem
watcher for hot-reload on SKILL.md changes) and injected into the system
prompt as compact XML. Token cost: ~195 base + 97 + escaped lengths per skill.

The transition from static toolsets to dynamic skill discovery has
fundamentally changed how multi-agent systems operate in 2026. However,
allowing agents to pull unvetted tools from a massive marketplace introduces
significant security surface area. This guide covers the full stack from
SKILL.md format through ClawHub marketplace to Lead-as-CEO governance.

> **Security warning** (Snyk Feb 2026): ~7–12% of registry-scanned skills
> contain malicious code or key leaks. Always sandbox, inspect, and gate.

---

## 2. Skill Architecture & SKILL.md Format

### 2.1 The SKILL.md Contract

Every skill is a directory with a mandatory `SKILL.md` containing YAML
frontmatter + Markdown instructions. Agents discover skills purely via
this file (progressive disclosure: metadata always loaded, body only on
trigger).

### 2.2 Full SKILL.md Template

```markdown
---
name: csv-processor
description: "Parse, filter, transform, and export CSV files. Use when
  user mentions spreadsheets, data cleaning, or CSV export."
user-invocable: true
version: 1.2.0
metadata:
  {
    "openclaw": {
      "emoji": "📊",
      "requires": {
        "bins": ["csvkit"],
        "env": ["CSV_API_KEY"]
      },
      "install": [
        {
          "id": "node",
          "kind": "node",
          "formula": "csvkit",
          "bins": ["csvkit"]
        }
      ]
    }
  }
---

# CSV Processor Skill

When the task involves CSV data:
1. Ask for input file/path if missing.
2. Use `exec` tool with csvkit commands (never raw shell on untrusted input).
3. Output to new file and log summary to MEMORY.md.
4. Chain to next skill (e.g., plotter) by passing file path explicitly.

## Fallback
If parsing fails due to memory limits, log `[ERROR: MEM_LIMIT]` to the
current session transcript and halt. Notify Lead via sessions_send.
```

### 2.3 Key SKILL.md Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Unique identifier, used for invocation |
| `description` | Yes | LLM reads this to decide when to use the skill |
| `user-invocable` | No | Whether users can trigger directly via `/skillname` |
| `version` | Recommended | Semver for ClawHub pinning and lockfile |
| `metadata.openclaw.requires` | Recommended | Gating: bins, env vars, config, OS checks |
| `metadata.openclaw.install` | Optional | Auto-installer specs (brew/node/go/download) |

### 2.4 How Skills Are Injected

1. Session start: all SKILL.md files in precedence order are scanned
2. Frontmatter (name + description) is always loaded into system prompt
3. Full body (instructions) loaded only when the skill is triggered
4. Token budget: ~195 base + 97 + escaped content length per skill
5. With filesystem watcher enabled: changes hot-reload without restart

---

## 3. ClawHub Marketplace

### 3.1 Ecosystem Scale

ClawHub (clawhub.ai + GitHub openclaw/clawhub) is the public npm-like
registry for AgentSkills bundles. As of March 2026:
- Curated awesome lists index **5,400+ filtered skills** from the official
  registry
- **99k+ total downloads** tracked
- Community repos (VoltAgent/awesome-openclaw-skills,
  sundial-org/awesome-openclaw-skills) provide categorized discovery
- Total ecosystem (including forks/archives) exceeds 13k via vector search
  and GitHub mirroring

### 3.2 CLI Workflows

```bash
# Install ClawHub CLI
npm i -g clawhub

# Search for skills
clawhub search "csv tools" --limit 10

# Install with version pinning
clawhub install csv-processor --version 1.2.3

# Bulk update with lockfile check
clawhub update --all

# Publish a custom skill
clawhub publish ./my-skill --version 1.0.0 --changelog "Initial release"

# Auto-publish + version bump
clawhub sync --all --bump patch

# List installed skills (reads .clawhub/lock.json)
clawhub list

# Inspect before installing (security check)
clawhub inspect csv-processor
```

### 3.3 Dependency Checking

Dependency checking is declarative in `metadata.openclaw.requires`:
- **bins**: Required system binaries (e.g., `csvkit`, `ffmpeg`)
- **env**: Required environment variables (e.g., `CSV_API_KEY`)
- **config**: Required config entries in openclaw.json
- **os**: OS restrictions (e.g., macOS-only for brew installers)

The CLI/Gateway offers installers (brew/node/go/download) at load time
if gating fails. Lockfile + content-hash prevents drift.

---

## 4. Mid-Task Skill Discovery

### 4.1 The "I Need a Tool" Flow

Agents do **not** have built-in auto-install (security-first design).
Instead, proactive discovery is prompt-engineered:

```
Agent hits capability gap mid-task
  → Recognition: LLM realizes it lacks tools for objective
     (e.g., "I need to process this 50MB CSV but only have read_file")
  → Discovery: Agent logs to MEMORY.md or plan.md:
     "Capability gap: CSV parsing. Suggested skill: csv-processor"
  → Request: Agent outputs to chat or sessions_send to Lead:
     "I need CSV tools — can I add them?"
  → Approval: Lead (or human) evaluates and runs:
     clawhub install csv-processor --dir <target-workspace>/skills/
  → Reload: Filesystem watcher or session refresh makes it available
  → Resume: Agent continues with new capability
```

### 4.2 How Agents Discover Skills

- **SKILL.md / SOUL.md instruction**: Embed "If capability gap detected,
  output: 'I need [tool] — can I add it?' then stop."
- **MEMORY.md logging**: Agent logs gap and suggested skill for persistence
- **plan.md notification**: Worker updates plan.md with new tool needs
- **Community skills**: mogus-prog "Automated Skill Discovery Integration"
  scores relevance, simulates compatibility, and plans safe install
- **shenhao-stu pattern**: Planner agent identifies gaps and triggers
  `/add-agent` or equivalent skill request

> **Key design choice**: No native "agent requests new tool" API exists.
> Discovery surfaces via chat or MEMORY.md—this is intentional for security.

### 4.3 Hot-Reload Mechanism

Once installed, OpenClaw's `discoverSkills()` mechanism can hot-reload
skills without process restart:
- Filesystem watcher detects new SKILL.md in workspace
- YAML frontmatter parsed and injected into system prompt
- Full body loaded on first trigger
- No Gateway restart required (sub-millisecond reload)

---

## 5. Tiered Approval System

### 5.1 The Four-Tier Model

| Tier | Source | Approval | Typical Use Case |
|------|--------|----------|------------------|
| **Tier 1: Built-in** | Native OpenClaw binaries | Implicit (always safe) | Basic file I/O, web_search, memory tools |
| **Tier 2: Pre-approved** | `~/.openclaw/skills/` (shared) | Auto-granted via openclaw.json | Org-wide tools (internal APIs, formatters) |
| **Tier 3: Lead-as-CEO** | ClawHub (verified tier) | Lead agent evaluates + installs | Specialist utilities (CSV parsers, RAG tools) |
| **Tier 4: Human-in-Loop** | ClawHub (unverified) / elevated | Human CLI/chat Y/N required | Skills requiring exec, OAuth, network access |

### 5.2 Enforcement Mechanisms

No built-in GUI tiering exists, but enforcement is achieved via:

1. **Built-in** — bundled skills always available
2. **Pre-approved** — `openclaw.json` `allowBundled` + `skills.entries.<name>.enabled`
3. **Lead-as-CEO grant** — Lead evaluates gap, logs to plan.md, runs
   `clawhub install --force` only to target agent's workspace with
   budget/security checks
4. **Human approval** — high-risk (exec/bash, network) requires
   `--no-input` disabled + manual review + sandbox enabled

### 5.3 Why Tiering Matters

Without tiering, you get:
- Standard worker agents autonomously installing random code from the internet
- Indirect prompt injections via malicious SKILL.md instructions
- Privilege escalation through unvetted exec permissions
- Key exfiltration via skills that rewrite agent memory

---

## 6. Lead-as-CEO Skill Authority

### 6.1 The Lead as Skill Governance CEO

The Lead agent is not just a task router—it is the **CEO of skill
governance** for the entire squad. Its five core responsibilities:

1. **Task Decomposition with Skill Awareness**: When breaking tasks, the
   Lead considers which agents have which skills and routes accordingly.
   Uses bindings and `sessions_send` for loose, per-task routing—not
   rigid skill assignment pipelines.

2. **Skill Gap Evaluation**: When a specialist reports a capability gap
   via `sessions_send` or plan.md, the Lead:
   - Queries ClawHub for relevant packages
   - Checks the requested permissions against security policies
   - Evaluates whether the skill is needed for this task or reusable
   - Decides: install, deny, or escalate to human

3. **Autonomous Capability Grants**: The Lead can **autonomously grant
   skills, API keys, email accounts, secrets, and elevated permissions**
   to agents as they grow and develop:
   - **Low-risk grants** (read-only skills, search tools, formatters,
     verified ClawHub packages with no exec perms) are issued
     autonomously with no human approval.
   - **High-risk grants** (skills requiring exec, network access, OAuth
     tokens, unverified packages, API keys with spend authority) require
     **one-time human approval** only. Once approved for a skill
     category, the Lead can re-issue at will.
   - All grants logged to MEMORY.md with timestamp and justification.

4. **Scoped Installation**: The Lead installs skills **only to the target
   agent's workspace**, never globally:
   ```bash
   clawhub install csv-processor \
     --dir ~/.openclaw/agents/data-worker/workspace/skills/
   ```
   This ensures strict sandboxing—the skill is physically available
   only to the agent that needs it.

5. **Result Synthesis After Skill Addition**: After granting a new skill,
   the Lead monitors the agent's next execution cycle to verify the skill
   works correctly and the output quality meets standards.

### 6.2 Why Loose Coordination Enables Safe Skill Discovery

Loose coordination is essential for dynamic skill management:

- **No fixed skill DAGs**: Agents don't have rigid tool pipelines. The
  Lead decides per-task which agent gets which skill based on current needs.
- **Prevents over-engineering**: Rigid skill assignment matrices break when
  new skills appear or task requirements shift. Loose routing adapts.
- **Prevents straight-jacket automations**: Auto-install pipelines that
  grant skills based on triggers are dangerous. The Lead evaluates context
  and security before each grant—human judgment, not automation.
- **Binding-based dispatch**: 80%+ of routing handled by static bindings.
  Skill grants happen only when genuine capability gaps are identified.
- **Serial Lane Queue**: Prevents race conditions during skill installation
  and reload.

> **Design principle**: Skill discovery should be intelligent, not automatic.
> The Lead evaluates security, cost, and necessity before every grant.

### 6.3 Lead Auto-Install Example

When the Lead approves a request, it executes scoped installation:

```bash
# Lead installs skill ONLY to target agent's workspace
clawhub install data-sci/csv-analyzer \
  --dir ~/.openclaw/agents/data-worker/workspace/skills/

# Lead logs the grant to MEMORY.md
echo "[2026-03-04] Installed data-sci/csv-analyzer v1.2.3 to Agent:data-worker for CSV processing" \
  >> ~/.openclaw/workspace/MEMORY.md
```

---

## 7. Tool Chaining Best Practices

### 7.1 How Agents Chain Tools

Agents chain naturally (LLM decides sequence in one response). The key is
making chaining **explicit and safe** rather than implicit and risky.

### 7.2 Safe Chaining Patterns

```markdown
# Chaining Protocol (embed in SKILL.md or AGENTS.md)

Output format for chaining:
- Tool call 1 result → store as $VAR1 (file path or MEMORY.md section)
- Pass $VAR1 explicitly to next tool (never assume context)
- On error: log to MEMORY.md + fallback skill suggestion
- Never chain >3 deep without user confirmation (token + safety)
- Never blind exec on untrusted input from previous chain step
```

### 7.3 Explicit Edges & Sync Routing

When building multi-agent workflows, explicitly connect task dependencies:
- Setting `dependencies: [taskId]` ensures the Gateway physically passes
  sanitized output from Agent A to Agent B
- Prevents hallucinated handoffs where agents assume they know the
  previous step's output

### 7.4 The "Ralph Wiggum" Context Reset

Critical pattern for 2026: instead of letting context windows grow
infinitely during a chain, force a hard context reset between chained
tool executions:
1. Agent writes current state to session file
2. Drops the full transcript
3. Re-reads only the status and plan for the next step
4. Continues with clean context

This prevents the token explosion that happens when chains accumulate
context from every previous step.

### 7.5 Fail-Safe Contracts

Every custom skill must include a fallback condition in its SKILL.md:

```markdown
## Fallback (required in every SKILL.md)
If the primary operation fails:
1. Log `[ERROR: <TYPE>]` to the current session transcript
2. Write failure context to error.md with trace ID
3. Notify Lead via sessions_send with error summary
4. Do NOT retry blindly—wait for Lead decision
```

---

## 8. Safe Auto-Install Mechanisms

### 8.1 Installation Scope Rules

- **Local only**: Install to `~/.openclaw/skills/` or workspace—never global
- **Target-scoped**: `--dir <target-workspace>/skills/` for per-agent grants
- **Gating**: `requires.bins/env/config/os` filters at load time (sandbox-aware)
- **Post-install**: Filesystem watcher + session snapshot for zero-downtime

### 8.2 Sandbox & Security Layers

| Layer | Protection | Configuration |
|-------|-----------|---------------|
| **Docker sandbox** | Network/filesystem restricted execution | `sandbox.mode: "docker"` per agent |
| **KVM isolation** | Full VM-level isolation (LumaDock/VPS) | Hypervisor config |
| **Requires gating** | Blocks skill load if deps not met | `metadata.openclaw.requires` |
| **Content-hash lockfile** | Prevents drift between installs | `.clawhub/lock.json` |
| **Installer specs** | Controlled dependency installation | `metadata.openclaw.install` |

### 8.3 Security Considerations

- Treat all ClawHub skills as **untrusted** until verified
- Snyk Feb 2026: ~7–12% of registry skills contain malicious code or leaks
- Always `clawhub inspect` before installing in production
- Skills with `exec` permissions require human review
- Secrets injected per-run only, never embedded in prompts
- Public registry has auto-hide after 3 community flags

---

## 9. Integration with Memory, Security & Coordination

### 9.1 Memory Hygiene for Skill Changes

Every skill addition must be documented:
- **MEMORY.md**: Lead logs the new capability with timestamp:
  `[2026-03-04] Installed csv-processor v1.2.3 to Agent:Research via Lead grant`
- **plan.md**: Worker agent updates to reflect new tool availability,
  preventing duplicate requests if the thread drops
- **shenhao-stu pattern**: Planner agent propagates skill changes across
  squad via coordinated plan.md updates

### 9.2 Security Integration

- **Tool deny-lists**: Specialists cannot install skills themselves or
  modify other agents' skill directories
- **Sandboxed Docker**: Network and filesystem restricted for all agents
  running ClawHub skills with exec permissions
- **Requires gating**: Skills that need bins/env not present are blocked
  at load time, not at execution time
- **Lead-only CLI access**: Only the Lead agent has `clawhub install`
  permissions in the squad

### 9.3 Coordination Patterns

- **Loose routing for skill needs**: The Lead routes tasks to agents that
  already have the required skills. Skill gaps trigger discovery, not
  rigid pre-assignment.
- **Fan-Out/Fan-In**: One coordinator routes to stateless specialists.
  Never "everything-to-everything" where 5 agents ping each other.
- **Binding-based dispatch**: Static channel → agent mappings handle
  routine routing. Skill-dependent routing is dynamic via Lead.

---

## 10. Real 2026 Production Examples

### 10.1 shenhao-stu 9-Agent Kit (Mid-Task Upgrades)

- **Setup**: 9-agent squad with dynamic `/add-agent` capability
- **Key example**: Coding agent realized its Next.js 16+ knowledge was
  outdated. Successfully searched ClawHub for `nextjs-docs-rag` skill,
  requested installation from user, and re-wrote implementation based
  on newly injected docs—all in one session loop.
- **Skill install pattern**: `clawhub install agent-commons` via Planner
  agent detecting gap → config merge → workspace refresh
- **All skill additions logged to MEMORY.md**

### 10.2 LumaDock Auto-Skill Squads (VPS Production)

- **Infrastructure**: Pre-configured Ubuntu templates with KVM + Docker
  sandbox on EPYC VPS
- **Workflow**: Agents chain web-scrape → csv-processor → plot
- **Skill management**: CLI installs via cron workflows; watcher enabled
  for zero-downtime hot-reload
- **Security model**: Public-facing agent runs in locked-down workspace.
  When it encounters unknown issue, routes payload to isolated backend
  agent that can query ClawHub, install diagnostics, and analyze in
  sandboxed environment.

### 10.3 Pantheon 14-Agent Marketplace Usage

- **Architecture**: Lead agent (CEO role) manages on-chain USDC jobs board
  with 14 specialized agents
- **Skill discovery**: Lead uses Skill Discovery Protocol to dynamically
  spin up ephemeral sub-agents, pulling niche ClawHub scraping skills
  just-in-time
- **Zero-bloat pattern**: Execute scrape → instantly kill sub-agent and
  its workspace to prevent skill accumulation
- **Install command**: `clawhub install csv-processor --version 1.2.3
  --dir .agents/data-agent/skills`

---

## 11. Common Failure Modes & Anti-Patterns

### 11.1 Failure Mode Table

| Failure Mode | Cause | Consequence | Prevention |
|-------------|-------|-------------|------------|
| **Security breach** | Unvetted ClawHub skills (malware, key leaks) | Data exfiltration, key compromise | Always `clawhub inspect` + sandbox + manual review |
| **Skill conflicts/bleed** | Same name in multiple precedence locations | Wrong skill loaded, unexpected behavior | Workspace pinning + unique names |
| **Chaos** | No approval flow (auto `--force` everywhere) | Agents installing random code | Tiered Lead-as-CEO + human gate for exec tools |
| **Token bloat** | 100+ un-gated skills loaded into system prompt | Context window eaten by skill metadata | Disable via openclaw.json; gate with `requires` |
| **Mid-task stall** | Skill not loaded until new session (no watcher) | Agent stuck waiting for capability | Enable watcher + explicit "refresh skills" command |
| **Global install** | Installing skill to shared dir exposes all agents | Breaks least privilege, unintended access | Always `--dir <agent-workspace>/skills/` |
| **Spaghetti chaining** | 5 agents ping each other simultaneously | Token explosion, Gateway crashes | Fan-Out/Fan-In pattern, one coordinator |
| **Prompt injection** | Malicious skill rewrites agent memory | Key exfiltration, behavior hijacking | Lead-as-CEO gatekeeper, block unverified + exec |

### 11.2 The "Everything-to-Everything" Anti-Pattern

When multiple agents freely chain to each other without coordinator
oversight, you get spaghetti routing: 5 agents ping each other
simultaneously, causing token explosion and Gateway crashes.

**Fix**: Use structured Fan-Out/Fan-In patterns. One coordinator (Lead),
stateless specialists. Never let specialists trigger skill installs or
chain directly to peers.

---

## 12. Step-by-Step Setup Commands

### 12.1 Install ClawHub CLI

```bash
npm i -g clawhub
clawhub whoami
```

### 12.2 Initialize Lead Agent with Skill Authority

```bash
# Add Lead agent with elevated CLI access
openclaw agents add lead-orchestrator

# Grant Lead the clawhub install capability
# (via custom skill or direct CLI access in Lead workspace)
```

### 12.3 Create a Custom Skill

```bash
# Create skill directory
mkdir -p ~/.openclaw/agents/data-worker/workspace/skills/csv-processor

# Create SKILL.md (use template from §2.2)
# Then publish if sharing:
clawhub publish ./csv-processor --version 1.0.0 --changelog "Initial release"
```

### 12.4 Lead Grants Skill to Specialist

```bash
# Lead installs skill scoped to target agent only
clawhub install data-sci/csv-analyzer \
  --version 1.2.3 \
  --dir ~/.openclaw/agents/data-worker/workspace/skills/

# Lead logs grant to MEMORY.md
echo "[$(date -Iseconds)] Installed data-sci/csv-analyzer v1.2.3 to Agent:data-worker" \
  >> ~/.openclaw/workspace/MEMORY.md
```

### 12.5 Enable Filesystem Watcher for Hot-Reload

In `openclaw.json`:

```json
{
  "skills": {
    "load": {
      "watchForChanges": true,
      "extraDirs": []
    },
    "entries": {
      "csv-processor": { "enabled": true }
    }
  }
}
```

### 12.6 Configure Skill Gating

In the skill's SKILL.md frontmatter:

```yaml
metadata:
  openclaw:
    requires:
      bins: ["csvkit"]
      env: ["CSV_API_KEY"]
      os: ["linux", "darwin"]
```

Skills that fail gating checks are silently skipped at load time.

---

## 13. Practical Recommendations

### Getting Started

1. **Start with bundled + vetted awesome-openclaw-skills**: Don't dive
   into the full ClawHub marketplace on day one. Use curated community
   lists for quality-filtered skills.

2. **Use Lead-as-CEO pattern for all skill grants**: Even in small squads,
   route all skill installations through the Lead. This builds the
   governance habit before it becomes critical at scale.

3. **Always scope installations to agent workspace**: Never install to
   shared `~/.openclaw/skills/` unless the skill is genuinely needed by
   every agent. Use `--dir <workspace>/skills/` for everything else.

4. **Enable filesystem watcher**: Zero-downtime skill hot-reload is
   essential for mid-task discovery. Without it, agents stall waiting
   for session refresh.

5. **Inspect before installing**: `clawhub inspect <skill>` should be
   mandatory before any production installation. Treat all marketplace
   skills as untrusted.

### Skill Management at Scale

6. **Log every skill grant to MEMORY.md**: Timestamp, version, target
   agent, justification. This creates an audit trail and prevents
   duplicate requests.

7. **Version pin everything**: Use `--version` on every install. Lockfile
   + content-hash prevents drift. Never use `latest` in production.

8. **Sandbox all exec-capable skills**: Docker sandbox with network/
   filesystem restrictions for any skill that runs code. Non-negotiable.

9. **Cap skill count per agent**: 100+ un-gated skills eat the context
   window. Use `requires` gating and `enabled: false` for unused skills.

### Tool Chaining Safety

10. **Never chain >3 deep without confirmation**: Token cost and error
    risk compound exponentially with chain depth.

11. **Use the "Ralph Wiggum" reset**: Hard context reset between chain
    steps prevents token explosion from accumulated context.

12. **Explicit output passing**: File paths or MEMORY.md sections, never
    assumed context. Each step must explicitly receive its inputs.

---

## Summary

Tool chaining and skill discovery in 2026 OpenClaw squads rests on five
pillars:

1. **SKILL.md as the universal contract**: YAML frontmatter + Markdown
   instructions, progressive disclosure, hot-reloadable, gated by
   dependency requirements.

2. **ClawHub marketplace with safety**: 5,400+ curated skills, semver
   pinning, lockfiles, content-hash verification. Treat all as untrusted
   until inspected.

3. **Tiered approval system**: Built-in → pre-approved → Lead-as-CEO →
   human-in-loop. The Lead autonomously grants low-risk skills and
   escalates high-risk to human for one-time approval.

4. **Lead-as-CEO skill governance**: The Lead decomposes tasks, routes
   loosely via bindings and sessions_send, evaluates skill gaps, grants
   capabilities autonomously, and synthesizes results. Loose coordination
   prevents over-engineering and straight-jacket skill assignment.

5. **Safe chaining patterns**: Explicit output passing, fail-safe contracts,
   depth limits, context resets, and Fan-Out/Fan-In architecture.

Start with vetted skills, use the Lead as gatekeeper, sandbox everything,
and log every grant. This gives agents true autonomy without chaos.

---

*Master research file. Synthesized from Grok (primary) + Gemini sources.*
*ClawHub ecosystem and SKILL.md standard validated against official docs.*
*Strengthened: Lead-as-CEO skill grants, loose coordination rationale.*
