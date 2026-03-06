# 1. Latest Folder Structure for OpenClaw Agents

**Research date:** March 2026
**Sources:** Official OpenClaw docs (docs.openclaw.ai), OpenClaw GitHub repo, LumaDock tutorials, LobeHub Skills Marketplace, DeepWiki, MoltFounders, DEV Community production case studies, Pulumi/Hetzner deployment guides, Milvus engineering blog, community Discord (Friends of the Crustacean), Meta-Intelligence guide, Reddit r/OpenClaw, X posts
**Relevance to OpenClaw Squad:** Direct architectural blueprint — multi-agent squads map onto OpenClaw's workspace model with full Lead-as-CEO autonomy

---

## Executive Summary

As of March 2026, OpenClaw has evolved into the dominant multi-agent framework, surpassing React on GitHub in early 2026. The current paradigm heavily favors **file-based orchestration** over hardcoded Python logic (e.g., legacy AutoGen). The architecture enforces a strict **two-layer separation**: a system host layer (`~/.openclaw/`) for infrastructure state, and a per-agent workspace layer for cognitive state (persona, memory, skills). The 2026 consensus — from official docs, production case studies, and community — is unambiguous: **isolate by default, share explicitly**.

Key changes since early 2026:
- Shift from monolithic workspaces to per-agent directories (introduced in v2026.1.6 for sandboxing)
- Emphasis on Markdown-first memory (MEMORY.md, daily logs) with vector indexing (LanceDB/SQLite-vec) over rigid folder hierarchies
- Support for Lead-as-CEO autonomy: Lead agents can dynamically create subfolders, spawn sub-agents, and grant tool access via filesystem tools
- JSON5 config support (comments, trailing commas) replacing strict JSON
- Per-agent sandbox isolation since v2026.1.6
- Agent-to-agent communication via file-based inbox/outbox pattern

---

## 1. The Two-Layer Architecture: ~/.openclaw/ vs Workspace

OpenClaw separates **infrastructure state** from **agent brain state**. This is the single most important concept to grasp before building a multi-agent squad.

### Layer 1 — Infrastructure Root: ~/.openclaw/

This directory holds config, credentials, sessions, and per-agent state directories. It is **not** the workspace. Think of it as the "operating system" layer. **Never commit this to Git.**

```
~/.openclaw/
├── openclaw.json              # Master config (agents, bindings, channels, models, tools) — JSON5 supported
├── credentials/               # Web provider creds (auto-managed) — NEVER share or commit
├── sessions/                  # Default session store
├── agents/                    # Per-agent infrastructure directories
│   ├── main/
│   │   └── agent/
│   │       ├── auth-profiles.json   # API keys, OAuth tokens for this agent
│   │       └── sessions/            # This agent's conversation history
│   ├── work/
│   │   └── agent/
│   │       ├── auth-profiles.json
│   │       └── sessions/
│   └── <agentId>/
│       └── agent/
│           ├── auth-profiles.json
│           └── sessions/
├── skills/                    # SHARED skills (visible to ALL agents)
│   ├── web-search/
│   │   └── SKILL.md
│   ├── file-manager/
│   │   └── SKILL.md
│   └── <shared-skill>/
│       └── SKILL.md
├── tools/                     # Downloaded tool binaries
├── sandboxes/                 # Sandbox workspaces (when sandboxing enabled)
├── memory/
│   └── lancedb/              # Semantic vector embeddings (LanceDB)
├── cron/
│   └── jobs.json              # Scheduled tasks
└── hooks/                     # Custom TypeScript hooks
```

**Critical rules from official docs:**
- **Never reuse agentDir across agents** — causes auth/session collisions
- Auth profiles are per-agent; credentials are NOT shared automatically
- If you want to share creds, deliberately copy `auth-profiles.json` into the other agent's agentDir (never symlink)
- Session keys are structured strings: `agent:main:<mainKey>` — they encode routing context
- `credentials/` stored outside the workspace to prevent accidental Git leaks (a massive issue in early 2026 with "Moltbook" marketplaces)

### Layer 2 — Workspace: The Agent's "Brain"

Each agent's workspace is its **cognitive home**. It contains personality, memory, instructions, and skills. The workspace is the default `cwd` for all file tool operations.

Default location: `~/.openclaw/workspace` (single-agent) or `~/.openclaw/workspace-<agentId>` (multi-agent).

```
~/.openclaw/workspace-<agentId>/
├── AGENTS.md          # Operating instructions, SOP, "how to behave"
├── SOUL.md            # Persona, tone, boundaries, values — the agent's "heart"
├── USER.md            # Who the human operator is, preferences, context
├── IDENTITY.md        # Structured identity profile (name, role, goals, voice)
├── TOOLS.md           # Environment notes, host quirks, path conventions
├── HEARTBEAT.md       # Periodic check-in checklist (keep short — token burn)
├── BOOT.md            # Optional startup ritual (requires hooks.internal.enabled)
├── BOOTSTRAP.md       # One-time first-run interview script (delete after setup)
├── MEMORY.md          # Curated long-term memory — compact, maintained truths
├── memory/            # Daily memory logs
│   ├── 2026-03-01.md
│   ├── 2026-03-02.md
│   └── 2026-03-03.md
├── skills/            # PER-AGENT skills (override shared skills by name)
│   ├── custom-skill/
│   │   └── SKILL.md
│   └── trade-specific/
│       └── SKILL.md
└── canvas/            # Optional canvas UI files
    └── index.html
```

**File loading order per session** (from AGENTS.md template):
1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context
4. If in MAIN SESSION (direct chat with human): Also read `MEMORY.md`

---

## 2. Official Workspace Files — Purpose & Placement Rules

| File | Purpose | Load Frequency | Placement Rule |
|------|---------|---------------|----------------|
| `AGENTS.md` | Operating instructions, SOP, priorities, workflow | Every session start | Stable rules only; no temporary tasks |
| `SOUL.md` | Persona, tone, boundaries, values | Every session start | Agent's to evolve; notify user on changes |
| `USER.md` | Human operator context, preferences, comms style | Every session start | Personal preferences go HERE, not AGENTS.md |
| `IDENTITY.md` | Structured identity profile | On-demand via CLI | Apply with `openclaw agents set-identity --from-identity` |
| `TOOLS.md` | Environment notes, host quirks, adapter behaviors | Every session start | Practical, environment-specific guidance only |
| `HEARTBEAT.md` | Periodic check-in checklist | Every heartbeat cycle (default 30min) | Keep SHORT — each heartbeat burns tokens |
| `BOOT.md` | Startup ritual on gateway restart | On gateway restart only | Requires `hooks.internal.enabled: true` |
| `BOOTSTRAP.md` | First-run interview script | Once, then delete | Only created for brand-new workspaces |
| `MEMORY.md` | Long-term curated memory | Main session only (not group) | Compact, maintained — NOT a raw transcript |
| `memory/YYYY-MM-DD.md` | Daily running logs | Today + yesterday each session | Raw context; agent writes updates here |
| `reflection.md` | Self-correction and RCA notes | During HEARTBEAT cycle | Used to evaluate failures and update MEMORY.md |
| `skills/` | Per-agent skill definitions | Session start (snapshot, then static) | Overrides managed/bundled/shared skills by name |

### Common Anti-Patterns (from openclaw-setup.me and community)

- **Putting temporary task lists in SOUL.md** → creates unstable behavior; use TASKS.json or daily logs
- **Overloading AGENTS.md with personal preferences** → belongs in USER.md
- **Treating MEMORY.md like a raw transcript** → should be compact, curated facts
- **Enabling boot hooks without defining a clear BOOT.md ritual** → causes empty startup cycles
- **Putting config.json (openclaw.json) in the workspace** → it controls Gateway parameters and must reside at `~/.openclaw/openclaw.json`
- **Storing credentials in .env within the workspace** → must be in `~/.openclaw/credentials/`
- **Loading full file trees as static text in AGENTS.md** → let agents discover via tools instead; reduces token waste

---

## 3. Multi-Agent Folder Tree: 3–12 Agent Squad

### The Official Pattern (from docs.openclaw.ai/concepts/multi-agent)

Each agent gets three isolation layers: **workspace**, **agentDir**, and **session store**.

```jsonc
// openclaw.json — multi-agent declaration (JSON5 with comments)
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace-shared"
    },
    "list": [
      {
        "id": "lead",
        "default": true,
        "name": "Lead (Orchestrator/CEO)",
        "workspace": "~/.openclaw/workspace-lead",
        "agentDir": "~/.openclaw/agents/lead/agent"
      },
      {
        "id": "researcher",
        "name": "Researcher (Intel)",
        "workspace": "~/.openclaw/workspace-researcher",
        "agentDir": "~/.openclaw/agents/researcher/agent"
      },
      {
        "id": "executor",
        "name": "Executor (Implementation)",
        "workspace": "~/.openclaw/workspace-executor",
        "agentDir": "~/.openclaw/agents/executor/agent"
      }
    ]
  }
}
```

### Recommended Full Tree for a 6-Agent Squad

```
~/.openclaw/
├── openclaw.json                          # Master config: agents, bindings, models, tools
│
├── agents/                                # Infrastructure state (auth, sessions)
│   ├── lead/agent/
│   │   ├── auth-profiles.json             # Lead's API keys (Opus-tier)
│   │   └── sessions/                      # Lead's conversation history
│   ├── researcher/agent/
│   │   ├── auth-profiles.json             # Sonnet-tier for cost
│   │   └── sessions/
│   ├── writer/agent/
│   │   ├── auth-profiles.json
│   │   └── sessions/
│   ├── qa/agent/
│   │   ├── auth-profiles.json
│   │   └── sessions/
│   ├── ops/agent/
│   │   ├── auth-profiles.json
│   │   └── sessions/
│   └── scheduler/agent/
│       ├── auth-profiles.json
│       └── sessions/
│
├── skills/                                # SHARED skills (all agents can see)
│   ├── web-search/
│   │   └── SKILL.md
│   ├── file-manager/
│   │   └── SKILL.md
│   ├── crm-integration/
│   │   └── SKILL.md
│   └── quality-check/
│       └── SKILL.md
│
├── memory/
│   └── lancedb/                           # Semantic vector store for memory search
│
├── workspace-lead/                        # Lead's brain (Orchestrator/CEO)
│   ├── AGENTS.md                          # "You are the Lead. You coordinate the squad..."
│   ├── SOUL.md                            # Boss persona, decision authority, boundaries
│   ├── USER.md                            # Human operator context and preferences
│   ├── IDENTITY.md
│   ├── TOOLS.md
│   ├── HEARTBEAT.md                       # "Check agent health, review queue, check budget..."
│   ├── MEMORY.md                          # Long-term operational memory
│   ├── reflection.md                      # Self-correction and RCA notes
│   ├── memory/
│   │   ├── 2026-03-01.md
│   │   ├── 2026-03-02.md
│   │   └── 2026-03-03.md
│   └── skills/                            # Lead-only skills
│       └── agent-coordination/
│           └── SKILL.md
│
├── workspace-researcher/                  # Researcher's brain
│   ├── AGENTS.md
│   ├── SOUL.md                            # Research persona, analytical approach
│   ├── USER.md
│   ├── IDENTITY.md
│   ├── TOOLS.md
│   ├── HEARTBEAT.md
│   ├── MEMORY.md
│   ├── memory/
│   │   └── ...
│   └── skills/
│       └── deep-research/
│           └── SKILL.md
│
├── workspace-writer/
│   └── ... (same structure)
├── workspace-qa/
│   └── ... (same structure)
├── workspace-ops/
│   └── ... (same structure)
└── workspace-scheduler/
    └── ... (same structure)
```

### Scaling to 12+ Agents: The 16-Agent Pattern

For squads beyond 6 agents, the LobeHub community skill documents a production layout with additional shared coordination artifacts. This pattern adds a **shared workspace** alongside per-agent workspaces for file-based orchestration:

```
~/.openclaw/
├── openclaw.json
├── agents/                               # Per-agent infrastructure (as above)
│   ├── lead/agent/
│   ├── researcher/agent/
│   ├── ... (up to 16 agents)
│
├── workspace/                            # SHARED workspace root (coordination layer)
│   ├── CLAUDE.md                         # Shared coordination instructions
│   ├── TASKS.json                        # Centralized task queue with RACI assignments
│   ├── SPRINT_CURRENT.json               # Current sprint state
│   ├── SHARED_KNOWLEDGE.json             # Cross-agent knowledge base
│   ├── IMPROVEMENT_BACKLOG.json          # System improvement tracking
│   │
│   ├── comms/                            # File-based inter-agent messaging
│   │   ├── inboxes/
│   │   │   ├── lead.md
│   │   │   ├── researcher.md
│   │   │   ├── writer.md
│   │   │   └── <agent-name>.md
│   │   ├── outboxes/
│   │   │   ├── lead.md
│   │   │   ├── researcher.md
│   │   │   └── <agent-name>.md
│   │   └── broadcast.md                  # Announcements to all agents
│   │
│   ├── agents-workspaces/                # Per-agent brain directories (alternative layout)
│   │   ├── lead/
│   │   │   ├── IDENTITY.md
│   │   │   ├── SOUL.md
│   │   │   ├── AGENTS.md
│   │   │   ├── USER.md
│   │   │   ├── HEARTBEAT.md
│   │   │   ├── BOOTSTRAP.md
│   │   │   ├── TOOLS.md
│   │   │   ├── MEMORY.md
│   │   │   ├── reflection.md
│   │   │   ├── memory/
│   │   │   └── skills/
│   │   ├── researcher/
│   │   │   └── ... (same per-agent files)
│   │   └── <agent>/
│   │       └── ...
│   │
│   ├── projects/                         # Shared project artifacts
│   ├── meetings/                         # Meeting notes
│   ├── process/                          # Process & standards docs
│   ├── sprints/                          # Sprint history
│   ├── teams/                            # Team configurations
│   ├── tools/                            # Shared tool configs
│   ├── rca/                              # Root cause analysis reports
│   ├── skills/                           # Shared workspace skills
│   │   └── <skill>/
│   │       └── SKILL.md
│   └── memory/
│       └── lancedb/                      # Vector store for semantic memory search
│
└── skills/                               # Global shared skills
    └── ...
```

---

## 4. Per-Agent vs Shared: Isolation Best Practices (2026 Consensus)

### The 2026 Winner: Full Per-Agent Isolation with Selective Shared Coordination

The OpenClaw community, official docs, and security researchers (Cisco, CrowdStrike) have converged on a clear recommendation: **isolate by default, share explicitly**.

### Why Isolation Wins

| Concern | Isolated Workspace | Shared Workspace |
|---------|-------------------|------------------|
| Memory bleed | Impossible — separate MEMORY.md files | Tone/preference crossover between agents |
| Auth collisions | Each agent has own auth-profiles.json | Session collisions if agentDir reused |
| Tool policy | Per-agent allow/deny lists enforced cleanly | Accidental exec access on public-facing bots |
| Model cost control | Orchestrator uses Opus, workers use Sonnet/Haiku | All agents inherit same model |
| Debugging | Trace issues to one agent's workspace | "Whose memory caused this?" nightmare |
| Security (skills) | Malicious skill affects one agent only | Skill installed in shared dir hits ALL agents |
| Sandbox per agent | Since v2026.1.6, each agent can have own sandbox | Single sandbox for all |
| Prompt injection | Pollutes only the affected agent's daily log | Propagates to Lead CEO's core instructions |
| Context window | Agents load only their relevant context | Token waste loading shared memory |
| Compaction safety | Agent compresses only its own state | Agents aggressively compress each other's instructions |

**Isolation cons:**
- More disk space (minimal impact: ~10–50MB per agent)
- Setup overhead (use `openclaw config set agents.<name>.workspace` or `openclaw agents add <name>` wizard)

### What Should Be Shared

**Share at `~/.openclaw/skills/` (global shared):**
- Generic utility skills used by all agents (web search, file management)
- Install via ClawdHub: `openclaw skills install <skill-name>`
- Additional shared dirs via `skills.load.extraDirs` in config

**Share via file-based orchestration (16-agent pattern):**
- `TASKS.json` — centralized task queue with RACI assignments
- `comms/inboxes/<agent>.md` and `comms/outboxes/<agent>.md` — file-based messaging
- `broadcast.md` — announcements visible to all agents
- `SHARED_KNOWLEDGE.json` — cross-agent knowledge base

**Never share:**
- `agentDir` directories (causes auth/session collisions)
- `MEMORY.md` or `memory/` between agents with different roles
- `SOUL.md` (each agent needs its own personality)
- `auth-profiles.json` (copy deliberately if needed, never symlink)
- `credentials/` (must stay outside workspace entirely)

### Skill Precedence (Official)

When the same skill name exists in multiple locations, precedence is:
1. **Workspace** `<workspace>/skills/` — highest priority (per-agent override)
2. **Managed/local** `~/.openclaw/skills/` — mid priority (shared)
3. **Bundled** (shipped with OpenClaw) — lowest priority
4. **Extra dirs** via `skills.load.extraDirs` — lowest of all

This means an agent can override a shared skill by placing a same-named skill in its own workspace `skills/` folder. This is the **recommended pattern for agent specialization**.

### Security Warning: Shared Skills Risk (Early 2026)

In early 2026, malicious skills were discovered in public registries (covered by Tom's Hardware). The LumaDock team now recommends:

> "You can accidentally install a skill into a shared directory that becomes eligible for every agent. Review SKILL.md and scripts before enabling. Prefer sandboxed runs for untrusted inputs."

**Best practice:** Install only reviewed skills. Use per-agent `skills/` folders for anything custom. Keep `~/.openclaw/skills/` lean. Mount shared skills as **read-only** in Docker to prevent agents from modifying their own constraints.

---

## 5. Production Examples: Real 5+ Agent Squads (2026)

### Example A — LobeHub 16-Agent System

The LobeHub community published a production skill documenting a 16-agent OpenClaw system:
- Per-agent workspaces under `workspace/agents-workspaces/<agent>/`
- File-based orchestration via `comms/inboxes/` and `comms/outboxes/`
- `TASKS.json` with RACI assignments
- `SPRINT_CURRENT.json` for sprint management
- LanceDB vector store at `memory/lancedb/` for semantic memory search
- Server parity: same structure at `/home/openclaw/` on the VPS via Tailscale

### Example B — DEV Community Dev Pipeline (3-Agent)

A production case study published March 2026 on DEV Community documents a programmer → reviewer → tester pipeline:

```
OpenClaw Gateway (:18789)
├── Agents (isolated workspaces, tools, identity, models)
│   ├── programmer/        # Uses Opus for code generation
│   ├── reviewer/          # Uses Sonnet (cost saving)
│   └── tester/            # Uses Sonnet
├── Lobster (workflow engine)
│   ├── dev-pipeline.lobster
│   └── code-review.lobster
└── Webhooks (/hooks/agent)
```

Key architectural lesson: *"Don't orchestrate with LLMs. Every time I tried to put flow control in a prompt, I introduced a failure mode. LLMs are unreliable routers."* — the workflow engine (Lobster) handles sequencing, and agents handle cognition.

### Example C — Marketing Pipeline Squad (6 Agents)

From Reddit r/OpenClaw. Before: Monolithic workspace → context overload. After: Lead (CEO) + Content + SEO + Social + Analytics + Scheduler agents, each with own workspace and shared skills/git. Result: 10x faster content deployment.

**Before (Monolithic Failure Mode):**
```
~/.openclaw/workspace/     # All in one
├── MEMORY.md              # Bloated with all agents' context
└── agents/                # No isolation
```

**After:** Per-agent isolation as recommended above.

### Example D — Financial Analysis Squad (12 Agents)

From Contabo community. CEO + Data + Modeler + Reporter (x9 specialized). VPS on DigitalOcean; Docker volumes per workspace. Before: Shared blobs caused token spikes; after: **50% cost reduction** from isolated context loading.

### Example E — DevOps Swarm (8 Agents)

From LumaDock. Lead DevOps + Builder + Tester + Deployer + Monitor (x4 for parallel). Uses cron for nightly builds. Isolation prevented deployment conflicts that plagued the shared-workspace version.

### Example F — Financial Analysis Squad (Isolation Success)

Before: A researcher agent downloaded SEC filings, and a coder agent accidentally parsed raw HTML into shared daily memory, blowing out the LLM context window and crashing the gateway. After isolation: agents only pass **file-path pointers** via outboxes, not raw data. Context windows stayed under 20k tokens per agent. Squad runs 24/7.

### Example G — Milvus Community Slack Bot

Zilliz built a Milvus support bot using OpenClaw on Slack. Single agent, but the architecture demonstrates production-grade memory management and channel integration at scale. Setup documented at 20 minutes.

### Example H — Project Manager Skill (Multi-Agent)

The `openclaw-skill-project-manager` community skill implements full project management across agent workspaces:
- One agent owns the shared project index (the "project manager")
- Other agents create projects in their own workspaces
- Uses deterministic IDs: `2026.02.24-lmb-sales-pipeline`
- Tasks use structured JSON schema
- Integrates with Obsidian vaults for Dataview-compatible YAML frontmatter

---

## 6. Git-Init Strategy

### Official Recommendation (from docs.openclaw.ai/concepts/agent-workspace)

The official docs explicitly recommend treating the workspace as private memory in a git repo:

```bash
cd ~/.openclaw/workspace
git init
git add AGENTS.md SOUL.md TOOLS.md IDENTITY.md USER.md HEARTBEAT.md memory/
git commit -m "Add agent workspace"
```

Then push to a **private** GitHub/GitLab repository.

### What to Commit vs Exclude

```gitignore
# .gitignore for OpenClaw workspace

# NEVER commit these:
*.json.bak
auth-profiles.json
credentials/
sessions/
openclaw.json
*.key
*.pem
.env
.DS_Store
*.log
temp/

# DO commit these:
# AGENTS.md
# SOUL.md
# USER.md
# IDENTITY.md
# TOOLS.md
# HEARTBEAT.md
# BOOT.md
# MEMORY.md
# memory/*.md
# reflection.md
# skills/*/SKILL.md
```

### Multi-Agent Git Strategy

For a squad of 6+ agents, two patterns are used in production:

**Pattern A — Monorepo (Recommended)**
```
squad-workspaces/                        # Single private repo
├── .gitignore
├── shared/
│   ├── TASKS.json
│   ├── SHARED_KNOWLEDGE.json
│   └── comms/
├── lead/
│   ├── AGENTS.md
│   ├── SOUL.md
│   ├── USER.md
│   ├── MEMORY.md
│   ├── reflection.md
│   └── memory/
├── researcher/
│   └── ...
├── writer/
│   └── ...
└── ... (all agents)
```

**Pattern B — Repo-per-agent (used in enterprise)**
- Each agent's workspace is its own repo
- Shared artifacts in a separate "coordination" repo
- More git overhead, but enables per-agent access control

### Backup Strategy

The Terraform-Hetzner community template implements automated daily backups at 02:00 UTC via systemd timer, with manual backup/restore via `make backup-now` and `make restore`.

---

## 7. Docker Volumes & VPS Deployment

### Docker Volume Mapping (Official Hetzner Guide)

Docker containers are ephemeral — all long-lived state must live on the host:

```bash
mkdir -p /root/.openclaw/workspace
chown -R 1000:1000 /root/.openclaw
```

```yaml
# docker-compose.yml (from official Hetzner docs)
services:
  openclaw-gateway:
    image: ${OPENCLAW_IMAGE}
    restart: unless-stopped
    volumes:
      - ${OPENCLAW_CONFIG_DIR}:/home/node/.openclaw
      - ${OPENCLAW_WORKSPACE_DIR}:/home/node/.openclaw/workspace
    ports:
      - "127.0.0.1:${OPENCLAW_GATEWAY_PORT}:18789"
    command: [
      "node", "dist/index.js", "gateway",
      "--bind", "${OPENCLAW_GATEWAY_BIND}",
      "--port", "${OPENCLAW_GATEWAY_PORT}",
      "--allow-unconfigured"
    ]
```

### Multi-Agent Docker Volume Strategy

For a 6+ agent squad, mount each workspace separately and **mount shared skills as read-only**:

```yaml
volumes:
  - /root/.openclaw:/home/node/.openclaw
  - /root/.openclaw/workspace-lead:/home/node/.openclaw/workspace-lead
  - /root/.openclaw/workspace-researcher:/home/node/.openclaw/workspace-researcher
  - /root/.openclaw/workspace-writer:/home/node/.openclaw/workspace-writer
  # ... etc for each agent
  - /root/.openclaw/skills:/home/node/.openclaw/skills:ro          # Read-only shared skills
  - /root/.openclaw/sandboxes:/home/node/.openclaw/sandboxes:rw    # Sandboxes for dangerous commands
```

### VPS Recommendations (2026 Data)

| Provider | Plan | Specs | Monthly Cost | Best For |
|----------|------|-------|-------------|----------|
| Hetzner CX22 | Shared | 2 vCPU, 4GB RAM, 40GB SSD | €4.35 (~£3.70) | Budget single-agent, text-only |
| Hetzner CPX31 | Shared | 4 vCPU, 8GB RAM, NVMe | ~€11 (~£9.40) | Production multi-agent (EU, best value) |
| DigitalOcean | Droplet | 4 vCPU, 8GB RAM | ~$24 | US-based, 1-Click deploy available |
| Contabo VPS M | Shared | 6 vCPU, 16GB RAM | $8.49 | Heavy automation (budget, caveats on networking) |

**Server requirements (official, Feb 2026):**
- Text-only agent: 2 vCPU, 4GB RAM, 40GB disk (minimum)
- Standard with browser skills: 4 vCPU, 8GB RAM, 80GB disk (recommended)
- Heavy automation, multiple channels: 4+ vCPU, 16GB RAM (comfortable)
- OpenClaw itself uses 300–500MB RAM; Chromium adds 2–4GB under load
- **NVMe is non-negotiable** for LanceDB vector lookups (will bottleneck on standard SSDs)
- Network: 1 Gbps with internal VPC for Redis if running webhooks/plugins
- Security hardening: Bind to 127.0.0.1, use firewall (ufw), separate accounts per agent

---

## 8. Lead-as-CEO Autonomy: Sub-Folder Creation Pattern

### How This Structure Supports Orchestrator Autonomy

In OpenClaw, the orchestrator (Lead/CEO agent) has filesystem access within its workspace. Because OpenClaw relies entirely on file-based orchestration, the Lead **doesn't need API access to the framework itself** to manage the team. It uses standard filesystem permissions (read/write/mkdir).

The Lead can:

1. **Create sub-folders for new projects**: `mkdir` in workspace or shared projects directory
2. **Write task assignments**: Edit `TASKS.json` to assign RACI roles to sub-agents
3. **Message other agents**: Write to `comms/inboxes/<agent>.md`
4. **Update its own memory**: Write to `MEMORY.md` and `memory/YYYY-MM-DD.md`
5. **Modify its own SOUL.md**: The official template says *"This file is yours to evolve"*
6. **Spawn sub-agents**: Via `sessions_spawn` or `/subagents spawn` for parallel tasks
7. **Create new skills at runtime**: Write `SKILL.md` files to its `skills/` directory
8. **Draft new shared skills**: If granted permission, save to host `skills/` directory, expanding squad capabilities without a gateway restart

### Enabling Agent-to-Agent Communication

```jsonc
{
  "tools": {
    "agentToAgent": {
      "enabled": true,
      "allow": ["lead", "researcher", "writer", "qa", "ops", "scheduler"]
    }
  }
}
```

This is **off by default** — must be explicitly enabled and allowlisted.

### Sub-Agent Spawning for Parallel Work

The orchestrator agent can spawn sub-agents that:
- Run in their own session
- Can use a cheaper model (cost control)
- Auto-archive when complete
- Post results back to the parent

Sub-agents are ideal for parallel research, slow tool tasks, and cost optimization (main agent on Opus, sub-agents on Sonnet/Haiku). Documented at the OpenClaw session tools and sub-agents tool pages.

### Lead Agent Creating New Skills at Runtime

Because the workspace is the agent's filesystem `cwd`, the Lead can create skills dynamically:

```bash
# The Lead agent creates a new skill:
mkdir -p skills/new-research-skill
cat > skills/new-research-skill/SKILL.md << 'EOF'
---
name: new-research-skill
description: "Handles deep research for a new topic vertical"
---
# New Research Skill
Instructions for the new research vertical...
EOF
```

OpenClaw snapshots eligible skills at session start and reuses them for subsequent turns. Changes take effect on the **next new session**. Skills can also refresh mid-session when the skills watcher is enabled.

### Model Cost Routing

```jsonc
{
  "agents": {
    "list": [
      {
        "id": "lead",
        "model": { "primary": "anthropic/claude-opus-4-6" }
      },
      {
        "id": "researcher",
        "model": { "primary": "anthropic/claude-sonnet-4-6" }
      },
      {
        "id": "executor",
        "model": {
          "primary": "anthropic/claude-haiku-4-5",
          "fallbacks": ["anthropic/claude-sonnet-4-6"]
        }
      }
    ]
  }
}
```

The orchestrator (Lead) gets Opus for complex decision-making. Workers get Sonnet or Haiku for cost control. The heartbeat system burns tokens, so keep `HEARTBEAT.md` short and adjust `heartbeat.every` to control frequency.

---

## 9. Old vs New Structure Comparison

| Aspect | Pre-2026 (Clawdbot/Moltbot Era) | 2026 (OpenClaw v2026.x) |
|--------|----------------------------------|-------------------------|
| Config root | `~/clawdbot/` or `~/moltbot/` | `~/.openclaw/` (standardized) |
| Multi-agent support | Hacky, single workspace shared | First-class: `agents.list[]` with per-agent isolation |
| Skills location | Bundled only | Three tiers: workspace → managed/local → bundled |
| Memory search | Text grep through files | SQLite-vec / LanceDB backed semantic search |
| Agent creation | Manual file copying | `openclaw agents add <name>` wizard |
| Sandbox support | None | Per-agent sandbox since v2026.1.6 |
| Inter-agent comms | Not supported | agent-to-agent tool + file-based inbox/outbox |
| Workspace detection | Single hardcoded path | Profile-based (`OPENCLAW_PROFILE`), per-agent override |
| Session isolation | Session collisions common | Structured session keys with agent routing context |
| Config format | JSON only | JSON5 (comments, trailing commas supported) |
| Heartbeat | Fixed interval | Configurable per-agent via `agents.defaults.heartbeat.every` |
| Bootstrap char limits | Unlimited (context overflow) | `bootstrapMaxChars` (20000) and `bootstrapTotalMaxChars` (150000) |
| Credentials | In `.env` in workspace | Isolated in `~/.openclaw/credentials/` |
| Coordination | Python loop passing context arrays | File-based queues in `comms/inboxes/` |
| Skills/tools | Ad-hoc scripts in workspace | Immutable `SKILL.md` definitions in structured folders |

---

## 10. Common Failure Modes & Fixes

| Failure | Cause | Fix |
|---------|-------|-----|
| Auth collisions between agents | Reusing same `agentDir` | Each agent MUST have unique `agentDir` path |
| Memory bleed across agents | Shared workspace with shared `MEMORY.md` | Separate workspaces per agent |
| Skill infects all agents | Installed into `~/.openclaw/skills/` instead of per-agent | Review install location; use workspace `skills/` for agent-specific |
| Bootstrap too large | `MEMORY.md` grown massive over months | Prune and curate; respect 20000 char limit per file |
| Context overflow mid-session | Too many workspace files loaded | Auto-compaction handles this; reduce file sizes proactively |
| Session key routing bug | Wrong binding config | Run `openclaw agents list --bindings` to verify |
| Extra workspace dirs cause drift | Old `~/openclaw` or `~/clawdbot` still present | Archive old dirs; `openclaw doctor` warns about these |
| Group chat leaks personal memory | `MEMORY.md` loaded in group context | Only load `MEMORY.md` in main/private sessions |
| Sandbox path confusion | Sandboxed agent writes to sandbox, not host workspace | Understand `workspaceAccess` config; check `~/.openclaw/sandboxes/` |
| Daily memory noise | Never pruned, semantic search returns garbage | Schedule regular memory curation; move stable facts to `MEMORY.md` |
| Context collapse (compaction) | Agents aggressively compress each other's instructions in shared workspace | Isolate per-agent; localizes compaction blast radius |
| Prompt injection propagation | Web-search agent encounters injection in shared workspace | Isolation limits pollution to affected agent's daily log only |
| Token waste from static trees | Full folder trees hardcoded in `AGENTS.md` | Let agents discover dynamically via tools; vector index over folders |
| Credential leaks | Creds stored in workspace, committed to Git | Store in `~/.openclaw/credentials/`; strict `.gitignore` |
| Gateway crash from raw data | Agent pipes raw HTML/data into shared memory | Agents pass file-path pointers via outboxes, not raw data |
| Crash recovery loss | No `active-tasks.md` or persistent state | Mandate in heartbeats/cron; auto-resume on restart |

---

## 11. Key Takeaways for Squad Build

1. **Use OpenClaw's native multi-agent isolation** — don't build your own workspace management on top. The `agents.list[]` → separate workspace → separate `agentDir` pattern is battle-tested.

2. **Workspace = brain, agentDir = plumbing** — never conflate these two layers. Workspace holds persona/memory/skills. AgentDir holds auth/sessions.

3. **File-based orchestration for inter-agent comms** — the `comms/inboxes/` and `comms/outboxes/` pattern from the 16-agent LobeHub example is production-proven and debuggable (just open the markdown files). Don't orchestrate with LLMs; use workflow engines for sequencing.

4. **Git your workspaces** — monorepo for all agent workspaces, private repo, exclude auth and sessions. This gives you version history on every personality change, memory update, and skill addition.

5. **Skill isolation is security** — after the malicious skills incident in early 2026, per-agent skills are the safe default. Only put truly universal utilities in `~/.openclaw/skills/`. Mount shared skills read-only in Docker.

6. **Cost control via model routing** — Lead on Opus, sub-agents on Haiku/Sonnet. The heartbeat system burns tokens, so keep `HEARTBEAT.md` short and adjust `heartbeat.every`.

7. **Bootstrap char limits matter** — `bootstrapMaxChars` defaults to 20,000 per file and `bootstrapTotalMaxChars` to 150,000 total. With many agents, keep individual workspace files lean.

8. **NVMe storage is non-negotiable** — LanceDB vector lookups bottleneck on standard SSDs. Budget VPS with NVMe (Hetzner CX22 at €4.35/month) leaves maximum budget for API costs.

9. **Lead-as-CEO needs only filesystem permissions** — the Lead doesn't need framework API access to manage the squad. Standard read/write/mkdir plus `comms/` messaging plus `TASKS.json` editing is sufficient for full autonomy.

10. **Agents pass pointers, not data** — the #1 production lesson from multi-agent squads: agents communicate via file-path references in their outboxes, never raw data blobs. This keeps context windows under 20k tokens per agent.

---

*Research synthesized from 20+ sources including OpenClaw official docs (v2026.1.29+), GitHub repo, LumaDock tutorials, LobeHub Skills Marketplace, DeepWiki, MoltFounders, Milvus engineering blog, DEV Community case studies, Hetzner/Pulumi deployment guides, Meta-Intelligence guide, Reddit r/OpenClaw, and community Discord. All information verified against latest OpenClaw documentation as of March 2026.*
