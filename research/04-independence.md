**4. Independence & Memory Hygiene**
OpenClaw Multi-Agent Squad — Definitive Research (March 2026)

**Table of Contents**

1. Why Full Per-Agent Independence Is Non-Negotiable
2. Recommended Private Workspace Structure Per Agent
3. How OpenClaw Enforces Isolation
4. MEMORY.md Best Practices
5. No-Recursion Rules
6. Daily/Weekly Memory Hygiene Routines
7. Real 2026 Production Examples
8. Integration with Lead-as-CEO Autonomy
9. Tool and Skill Isolation
10. Common Failure Modes & Anti-Patterns
11. Step-by-Step Setup Commands & Config Snippets
12. Sources & References

**1. Why Full Per-Agent Independence Is Non-Negotiable**

The 2026 reality: OpenClaw has 249K+ GitHub stars and 5,700+ community skills. Squads range from 5–19 agents running 24/7. Without strict per-agent isolation the system collapses in days.

**The Four Horsemen of Shared-State Failure**

**1.1 Context Poisoning**
One agent's domain bleeds into another. GitHub Issue #3998 (mem0 plugin, Feb 2026): single `userId` caused clinic SOPs to appear in a personal assistant's responses. Symptoms:
- Sales agent quoting GDPR rules
- Coder referencing calendar preferences in technical decisions
- Analytics agent pulling irrelevant content-writer notes

**1.2 Recursion Loops**
Most expensive failure mode. Confirmed incidents:
- Issue #5960 (Jan 31): 123 Opus calls in 16 min → $4.85
- Issue #17442 (Feb 15): 2,258 callback re-injections → exponential context growth
- Issue #28533 (Feb 27): 498 `exec` calls in 30 min → entire daily budget gone
- Real user reports: $37 in 6 h, $750 in 48 h unsupervised

**1.3 Skill Bleed**
Three-tier precedence (workspace > managed > bundled) means one agent's custom `exec` config silently affects everyone. Official warning: "Name collisions override managed/bundled skills."

**1.4 Hive-Mind Degradation**
After ~2 weeks shared MEMORY.md:
- Personas blur into generic median
- Semantic index mixes unrelated embeddings
- Retrieval returns irrelevant results (Cognee documentation: "everything bleeds together")

**Independence Principle (non-negotiable)**
Each agent MUST have its own:
✓ Workspace directory
✓ SOUL.md + IDENTITY.md
✓ MEMORY.md (routing index)
✓ memory/ daily logs
✓ Session store + SQLite index
✓ Skills directory
✓ Sandbox configuration

"Isolated" is not marketing language — OpenClaw official docs (Multi-Agent Routing).

**2. Recommended Private Workspace Structure Per Agent**

**Official Layout** (docs.openclaw.ai/concepts/agent-workspace)
For your LifeClaw/TradeClaw squad (16 agents) use:

```
~/.openclaw/workspace/agents-workspaces/
├── lead/                          # Lead/Orchestrator
│   ├── SOUL.md
│   ├── IDENTITY.md
│   ├── AGENTS.md                  # Full roster + routing logic
│   ├── MEMORY.md                  # 50-line routing index
│   ├── memory/2026-03-03.md
│   ├── skills/route-task/SKILL.md
│   ├── oversight/                 # Read-only symlinks to all agents
│   ├── logs/
│   ├── temp/
│   └── reflection.md
├── researcher/                    # Sales outreach example
│   ├── SOUL.md                    # Domain-specific personality
│   ├── MEMORY.md
│   ├── memory/
│   ├── skills/
│   ├── logs/
│   ├── temp/
│   └── reflection.md
├── writer/
├── analyst/
└── ... (13 more)
```

**Files that MUST NEVER be shared**
- SOUL.md, MEMORY.md, memory/*.md, skills/, session store, SQLite index

**Files that CAN be shared (read-only copies)**
- AGENTS.md (team roster only)
- USER.md (symlink OK)
- Base rules (cat into each SOUL.md at bootstrap)

**Alternative simpler layouts** (for smaller squads)
- Grok-style: `~/agents/<agent-id>/`
- Gemini-style: `~/.openclaw/agents/<agent-id>/workspace/`

All supported via `openclaw.json` workspace mapping. For 15+ agent production use the agents-workspaces umbrella.

**3. How OpenClaw Enforces Isolation**

**3.1 Workspace-Level Isolation**
Workspace is the only cwd for file tools. Resolved via `resolveSessionAgentIds` using `agent:<agentId>:` session keys. All bootstrap files injected per-agent only.

**3.2 Docker Sandbox Isolation**
Modes: `off` (Lead only), `non-main`, `all`.
Scope: `session` (strongest) or `agent`.
Default: `network: none`, no egress.
Per-agent example in openclaw.json (see section 11).

**3.3 Docker Volumes & docker-compose**
Named volumes per agent + read-only config mount.

**3.4 Filesystem & Config Overrides**
`workspaceAccess: "rw"` / `"ro"` / `"none"`.
Config merge: `agents.defaults` → `agents.<id>` (workspace, sandbox, tools, model, memorySearch, compaction).

**3.5 Security Defaults (Issue #7827)**
- `sandbox.docker.network: "none"`
- Deny high-risk tools by default
- `dmScope: "per-channel-peer"`

**4. MEMORY.md Best Practices**

**Two-Layer Architecture** (all versions agree)

| Layer      | File                  | Purpose                              | Lifecycle                     |
|------------|-----------------------|--------------------------------------|-------------------------------|
| Episodic   | memory/YYYY-MM-DD.md  | Append-only raw events               | Read today + yesterday        |
| Semantic   | MEMORY.md             | Curated routing index (≤50 lines)    | Loaded in private sessions    |

**Production MEMORY.md Template** (merged best practices)

```markdown
# MEMORY.md — Long-Term Memory
# Agent: researcher | Domain: Sales Outreach
# Last distilled: 2026-03-02
# Target size: ≤50 lines (routing index only)

## Identity
- Role: Sales outreach for TradeClaw (operates as "Natalie from Molty Sites")
- Reports to: Lead

## Core Facts
- Target: UK tradespeople without websites
- Pricing: £97/month, £497 buyout, £47/month SEO
- Platform: Saleshandy

## Active Constraints
- Budget cap: £3.50/day hard squad limit
- Never email without Lead approval
- GDPR only — no cold calling

## Knowledge Pointers (load on demand)
- Templates → skills/trade-templates/SKILL.md
- Objections → memory/reference/objections.md
- Metrics → memory/reference/metrics.md

## Recent Decisions (rotate weekly)
- [2026-03-01] Plumber v3 approved
- [2026-02-28] Switched to 3-email sequence
```

**Routines**
- Daily auto-journaling via `memoryFlush` (pre-compaction)
- Weekly distillation (scan 7 daily logs → update MEMORY.md)
- Monthly archive + summary
- Native RAG: ~400-token chunks, sqlite-vec, per-agent `~/.openclaw/memory/<agentId>.sqlite`
- Optional add-ons: Cognee (knowledge graph) or QMD (local vector sidecar with BM25 + reranker)

**5. No-Recursion Rules**

**Hard SOUL.md Block** (verbatim recommended — merged Opus + Grok)

```markdown
## Absolute Rules — No Exceptions

### No-Recursion Protocol
1. NEVER call another agent that can call you back. Delegation is one-way only.
2. NEVER create cron from within cron. Write to temp/cron-requests.md for Lead.
3. NEVER retry failed tool >3 times. Log, write to temp/blocked.md, STOP.
4. NEVER spawn subagent from subagent session.
5. Track depth. If already delegated-to, execute or refuse.
6. If repeating same action: write "LOOP DETECTED" and halt.

### Lead Routing (Lead only)
- Tasks flow DOWN only. Never lateral.
- Every delegation includes task-id + max-depth:1
- Sub-agents NEVER talk directly — route through Lead.
```

**Config Guards**
```json
{
  "agents": { "defaults": {
    "maxToolCalls": 50,
    "timeoutSeconds": 1800,
    "maxSpawnDepth": 0
  }}
}
```

**6. Daily/Weekly Memory Hygiene Routines**

**Auto-Flush Before Compaction** (critical — prevents 45-hour context loss)
Set `softThresholdTokens` to ~15% of context window (30k for 200k models, 150k for 1M).

**Daily Hygiene Script** (Lead skill — full Opus version enhanced with Grok checks)

**Weekly Distillation + Git Commit + Human-Readable Backup** (combined best scripts in section 11).

**7. Real 2026 Production Examples**

- **mem0 bleed** (#3998): Fixed by agentId in session keys.
- **45-hour loss** (#5429): Fixed by memoryFlush + immediate write rule.
- **Callback storm** (#17442): 2,258 re-injections — solved by per-cron model + timeout.
- **498 exec loop** (#28533): Fixed by maxIterations + backoff.
- **shenhao-stu 9-agent squad**: Private workspaces dropped token bloat 68%.
- **88k-word book squad**: 48 h instead of 8 days after hygiene.
- **LumaDock K8s 19-agent**: PVC-per-agent + sandbox = zero collisions.
- **$750 runaway** (X reports): Cron with no budget caps.

**8. Integration with Lead-as-CEO Autonomy**

The Lead acts as CEO and has full authority to grant extra tools, APIs, email accounts, and secrets to any other agent as they grow and develop. It may request one-time human approval only for high-risk items.

The Lead maintains:
- Read-only oversight/ symlinks to every agent's MEMORY.md + reflection.md
- Trigger-hygiene skill (runs in target agent's context)
- Approval flow for new tools/skills (installs only to target workspace)

**NEVER**: writes to sub-agent MEMORY.md or SOUL.md.

**9. Tool and Skill Isolation**

Per-agent allow/deny lists in openclaw.json + workspace skills/ highest precedence.
Install command: `openclaw skills install <name> --workspace <agent-path>` (never shared ~/.openclaw/skills/).

**10. Common Failure Modes & Anti-Patterns**

**Shared vs Private Memory** (Grok/Opus merged)

| Dimension              | Shared MEMORY.md                  | Private per-agent                     |
|------------------------|-----------------------------------|---------------------------------------|
| Context poisoning      | Guaranteed after 7–10 days        | Impossible                            |
| Recursion risk         | High                              | Eliminated by SOUL gates              |
| Token efficiency       | 3–5× bloat                        | Stable <40k                           |
| Personality            | Hive-mind collapse                | Distinct forever                      |
| Recovery               | Full squad restart                | One agent only                        |
| Lead oversight         | Dangerous read/write              | Read-only + trigger-only              |

**Anti-Pattern Table** (all sources)

- Shared MEMORY.md → collapse
- No recursion guards → $300+ overnight bills
- Lazy compaction → silent data loss
- MEMORY.md as knowledge dump → 2000+ token overhead
- Shared skills dir → bleed
- No git backup → permanent loss
- Heartbeat on every agent → massive waste

**11. Step-by-Step Setup Commands & Config Snippets**

**Step 1: Create workspaces** (full script in Opus + Grok CLI)

**Step 2: openclaw.json** (full 16-agent example with Lead full access, subs restricted, memoryFlush, sandbox, maxSpawnDepth)

**Step 3: SOUL.md template** (merged no-recursion + budget + memory rules)

**Step 4: Cron jobs** (daily hygiene, weekly distillation, git-backup)

**Step 5: Verify**
`openclaw agents list`, `openclaw sessions --json`, `ls ~/.openclaw/memory/*.sqlite`, `openclaw security audit`

**12. Sources & References** (merged & verified March 3 2026)

Official docs, GitHub issues #3998, #5429, #5960, #17442, #28533, #7827, #17034 etc., LumaDock HA guides, shenhao-stu/openclaw-agents repo, Cognee & QMD community plugins, Microsoft Security Blog, Docker Blog, X failure threads, MoltFounders cheatsheet, FlyPix cost reports.

**Research compiled March 3 2026 — OpenClaw v2026.3.x**
Implement exactly as above and your squad stays sharp, distinct, and unstoppable for months. Independence + ruthless memory hygiene is the difference between a production AI workforce and a $750 bill + total collapse.
