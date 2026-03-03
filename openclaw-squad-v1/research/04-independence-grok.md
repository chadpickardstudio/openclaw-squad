**4. Independence & memory hygiene** (OpenClaw multi-agent squads, latest as of March 2026)

Full per-agent independence is non-negotiable in 2026 production deployments. Shared context files or unrestricted sub-agent spawning trigger four catastrophic failure modes that destroy squad performance within days to weeks:

- **Context poisoning**: One agent’s transient notes bleed into others’ prompts, corrupting specialized personas (e.g., a “coder” agent starts hallucinating marketing copy).
- **Recursion loops**: Sub-agents spawn further sub-agents indefinitely; real squads have racked up $300+ API bills in hours before gateway timeouts.
- **Skill bleed**: Tool allowlists leak; a sandboxed research agent gains `exec` rights and rm -rf’s the workspace.
- **Hive-mind degradation**: After ~2 weeks of shared MEMORY.md, agents lose distinct voices and collapse into generic, low-creativity responses (documented in multiple 2026 GitHub discussions and X failure reports).

Official docs, LumaDock production guides, Meta-Intelligence agent-setup series, and real 5–19-agent squads all mandate **private workspaces + explicit no-recursion gates** to keep squads stable at scale.

### Exact recommended private workspace structure per agent
Official + community standard (shenhao-stu/openclaw-agents + Meta-Intelligence guide + LumaDock HA setups) uses one isolated directory tree per agent. Default main agent stays at `~/.openclaw/workspace`; squad agents live under `~/agents/<agent-id>/` (or `~/.openclaw/agents/<agent-id>/` or `.agents/<agent-id>/` — all equivalent via config).

```
~/agents/
├── planner/
│   ├── SOUL.md              # (or soul.md / agent.md) — persona + no-recursion rules
│   ├── MEMORY.md            # curated long-term memory (routing index <50 lines)
│   ├── AGENTS.md            # operating rules + Lead routing logic
│   ├── USER.md              # user profile mirror
│   ├── skills.md            # private skill allowlist & notes
│   ├── reflection.md        # weekly self-review log (optional but recommended)
│   ├── logs/                # session transcripts + heartbeat
│   ├── memory/              # daily auto-journal: YYYY-MM-DD.md
│   │   └── 2026-03-02.md
│   ├── temp/                # ephemeral tool output (auto-pruned)
│   └── .gitignore
├── coder/
│   ├── SOUL.md
│   ├── MEMORY.md
│   └── … (identical structure)
└── researcher/
    └── …
```

**Why this exact layout?** Each agent boots with its own bootstrap files injected only into its sessions. Lead (main) never writes to child workspaces.

### How OpenClaw enforces isolation
1. **Filesystem sandboxing** — `agents.<id>.workspace` + `sandbox.mode: "non-main"` or `"all"`. Tools resolve relative to the private workspace only.
2. **Docker volumes (LumaDock production)** — Named volumes `openclaw-workspace-<agent-id>` or Kubernetes PVCs per agent (ReadWriteMany + NFS/Ceph). Sandbox sub-containers mount `/workspace` with `network: none` and auto-prune after 24 h idle.
3. **config.json per-agent overrides** — Global `agents.defaults.*` is overridden by `agents.<id>.*` (model, tools allowlist, sandbox, workspace path).
4. **Session key isolation** — `agent:<id>:<channel>:group:<groupId>` prevents cross-talk.

### MEMORY.md best practices (2026 production standard)
MEMORY.md is **not** a dump — it is a **routing index** + distilled life story.

```markdown
# MEMORY.md — <agent-id> long-term memory (last distilled 2026-03-01)

## Core Identity & Preferences
- User prefers concise lobster-coded wit, zero corporate hedging.
- Never spawn sub-agents without explicit Lead @mention.

## Permanent Facts
- Project X deadline: 2026-03-15
- User hates walls of text >300 words.

## Weekly Distillation (auto-appended)
2026-02-23 → 2026-03-01: Summarized 47 daily logs into 3 insights...
```

**Routines**:
- **Daily auto-journaling**: `memory/YYYY-MM-DD.md` + pre-compaction memoryFlush (official, enabled by default in 2026).
- **Weekly distillation**: Lead skill or cron job condenses old dailies into one paragraph in MEMORY.md (popular X prompt from @kloss_xyz, Feb 2026).
- **Long-term compaction**: RAG-style via `memory_search` + optional QMD vector backend (BM25 + reranker, local or Gemini).
- **Vector DB optional add-on**: Set `memory.backend: "qmd"` — indexes only private workspace files, scoped to DMs only.

### No-recursion rules — hard-enforced
**In every agent’s SOUL.md / agent.md** (verbatim block recommended by orchestrator skills and Meta-Intelligence):

```markdown
## NO-RECURSION & ORCHESTRATION RULES (Lead-as-CEO only)
- You are a leaf agent. NEVER spawn, mention, or invoke another sub-agent.
- If you need help, reply with exact JSON: {"request_lead": "task description"} and stop.
- Lead (main session) is the sole orchestrator. All coordination happens via @Lead mention in group channels.
- Sub-agent attempts to spawn further sub-agents = immediate NO_REPLY + log violation to reflection.md.
- Recursion depth must stay 0. Any loop detected → self-pause and alert human.
```

**In Lead’s routing logic** (AGENTS.md or dedicated orchestrator skill):
```markdown
- Only Lead may call openclaw agents spawn / route.
- Sub-agents are fire-and-forget; Lead polls via memory_search on their reflection.md.
```

Enforced by tool profile restrictions in `openclaw.json` (deny `agent:spawn` for non-Lead).

### Daily/weekly memory hygiene routines
Lead skill (recommended):

```bash
# hygiene.sh (in Lead’s skills/ or cron)
#!/bin/bash
openclaw agents list | while read id; do
  cd ~/agents/$id
  git add MEMORY.md memory/ reflection.md
  git commit -m "Hygiene $(date +%Y-%m-%d)"
  # Weekly distillation
  if [[ $(date +%u) -eq 0 ]]; then
    echo "Distilling..." | openclaw --agent $id memory-distill
  fi
done
```

Auto-git + human-readable backup (`.md` files only) + QMD re-index.

### Real 2026 production examples (5–19 agent squads)
- **shenhao-stu/openclaw-agents** (9 agents, Feb–Mar 2026): planner/coder/writer/etc. with `.agents/<id>/` isolation. Before: shared workspace → 3× token bloat & personality bleed. After: private workspaces + no-recursion gates → 68 % lower context size, zero cross-talk in 30-day run.
- **88 k-word book squad** (GitHub discussion #17626, Feb 2026): Director (Claude Opus) + 3 research + 5 writing + 2 review agents. Private workspaces + git coordination. Performance gain: 48 h vs planned 8 days; post-hygiene token spend dropped 57 %.
- **LumaDock HA Kubernetes squad** (19 agents across 3 replicas): PVC-per-agent + sandbox sub-containers. Before/after isolation trees showed zero file collisions; memory compaction now <40 k tokens steady-state.

### Integration with Lead-as-CEO autonomy
- Lead **reads** any agent’s MEMORY.md/reflection.md via `memory_get` or `memory_search` (scoped).
- Lead **cannot write** — filesystem sandbox + explicit SOUL.md rule.
- Lead triggers hygiene (`openclaw agents hygiene <id>`) or approves expansions (tool `agent:expand-workspace`).
- Perfect CEO model: oversight without contamination.

### Tool and skill isolation
```json
// openclaw.json
{
  "agents": {
    "researcher": {
      "tools": { "allowlist": ["web_search", "memory_search"], "blocklist": ["exec"] },
      "skills": { "private": ["research-pipeline"] }
    }
  }
}
```
Lead grants new tools by editing **only** the target agent’s section. Changes take effect on next session.

### Common failure modes and anti-patterns (real 2026 reports)
- **Shared MEMORY.md** → total collapse after 2 weeks (GitHub #25633, multiple X threads). Agents forget their own identity.
- **Recursion** → infinite loops + $300 bills (SmallClaw fork reports + X “JINX almost died” thread).
- **Lazy compaction** → 128 k context bloat (QMD issues + LumaDock production notes).
- **No git backup** → one mistaken `git clean -fd` wiped an entire agent’s life story (X Mar 2026).

**Shared vs Private Memory Comparison**

| Aspect                  | Shared MEMORY.md                  | Private per-agent workspaces          |
|-------------------------|-----------------------------------|---------------------------------------|
| Context poisoning       | Guaranteed after 7–10 days        | Impossible                            |
| Recursion risk          | High (cross-spawning easy)        | Eliminated by SOUL.md gates           |
| Token efficiency        | 3–5× bloat                        | Stable <40 k                          |
| Personality preservation| Hive-mind degradation             | Distinct agents forever               |
| Recovery from failure   | Full squad restart required       | One agent only                        |
| Lead oversight          | Full read/write (dangerous)       | Read-only + trigger-only              |

### Step-by-step setup commands and config snippets
```bash
# 1. Create private workspace per agent
openclaw agents add planner --workspace ~/agents/planner --model claude-opus-4-6
openclaw agents add coder --workspace ~/agents/coder

# 2. MEMORY.md template (create in each workspace)
cat > ~/agents/planner/MEMORY.md << 'EOF'
# MEMORY.md — planner (distilled 2026-03-01)
## Core Rules
...
EOF

# 3. Per-agent config overrides (openclaw.json)
{
  "agents": {
    "planner": {
      "workspace": "~/agents/planner",
      "sandbox": { "mode": "all" },
      "compaction": { "memoryFlush": { "enabled": true } },
      "memory": { "backend": "qmd" }
    }
  }
}

# 4. No-recursion in SOUL.md (append via edit tool or Lead)
# (see block above)

# 5. Auto-hygiene skill in Lead
openclaw skills install memory-hygiene
# Then schedule via cron or heartbeat.

# 6. Gitignore (in every workspace)
cat > ~/agents/planner/.gitignore << EOF
temp/
*.key
secrets*
EOF
git init && git add . && git commit -m "initial independence"
```

**Practical recommendations (March 2026)**:
- Start with shenhao-stu/openclaw-agents one-command template for 5+ agents.
- Always run `openclaw doctor` after any change.
- Weekly human review of Lead’s reflection.md only.
- Backup strategy: private GitHub repo per workspace + daily `git push` via Lead skill.

Independence + ruthless memory hygiene is the difference between a stable 19-agent squad that ships products and a $300 bill + total collapse. Implement exactly as above and your squad will stay sharp, distinct, and unstoppable.
