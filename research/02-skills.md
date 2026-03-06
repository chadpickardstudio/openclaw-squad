# 2. Skills.md Setup and Best Practices

**Research date:** March 2026
**Sources:** Official OpenClaw docs (docs.openclaw.ai/tools/skills, docs.openclaw.ai/tools/creating-skills, docs.openclaw.ai/tools/clawhub), OpenClaw GitHub repo, ClawHub registry (13,729+ skills), LumaDock tutorials, DigitalOcean OpenClaw skills article, BoilerplateHub skills walkthrough, Snyk Labs sandbox bypass research (ToxicSkills audit), MoltFounders config reference, DeepWiki agent architecture, Auth0 security guide, Kaspersky/Microsoft/Cyera/Repello AI security analyses, LearnClawdbot.org tools reference, LobeHub Skills Marketplace community skills, BoxClaw cross-platform skill format, Reddit r/OpenClaw production threads, ClawSecure CVE reports, Endor Labs vulnerability disclosures, Koi Security ClawHavoc analysis
**Relevance to OpenClaw Squad:** Defines how each agent gets its tools, how the Lead (CEO) can grant capabilities to the crew, and how to avoid the ClawHavoc-class supply chain attacks that hit ~20% of ClawHub in Feb 2026

---

## 1. What Is a Skill in OpenClaw?

A skill is a **folder containing a `SKILL.md` file**. That file has YAML frontmatter (metadata) plus Markdown body (instructions). When the agent starts a session, OpenClaw loads eligible skills and injects a compact XML list into the system prompt. The agent reads the instructions and follows them to complete tasks.

**Skills are not tools.** Tools are the typed, built-in capabilities (`exec`, `read`, `write`, `browser`, `message`, etc.). Skills are instructions that teach the agent *how to use tools for specific tasks*. Think of tools as the agent's hands, and skills as the recipes that tell it what to do with those hands.

This distinction is critical: **tool policies control WHICH tools are available; skills teach HOW to use them.** Both layers must be configured correctly.

```
~/.openclaw/workspace/skills/my-skill/
├── SKILL.md              # Core: YAML frontmatter + markdown instructions
├── references/            # Optional: deep-dive docs loaded on demand
│   ├── api-reference.md
│   └── examples.md
├── scripts/               # Optional: automation scripts
│   └── setup.sh
└── commands/              # Optional: slash commands
    ├── run.md             # /run command
    └── status.md          # /status command
```

Unlike traditional static tool-calling arrays (where tools are baked into code), OpenClaw treats skills as **dynamic, portable Markdown files**. This allows for an organic, evolving multi-agent squad where tools can be dynamically provisioned, updated, and revoked — the foundation of Lead-as-CEO autonomy.

---

## 2. SKILL.md Format and Syntax — Complete Reference

### Minimal Valid SKILL.md

```yaml
---
name: hello_world
description: A simple skill that says hello.
---
# Hello World Skill

When the user asks for a greeting, use the `echo` tool to say
"Hello from your custom skill!".
```

### Full Production SKILL.md with All Frontmatter Fields

```yaml
---
name: tradesperson-outreach
description: Send cold outreach emails to UK tradespeople without websites. Use when prospecting plumbers, electricians, builders, or roofers for website sales.
version: 2.1.0
user-invocable: true
disable-model-invocation: false
metadata:
  openclaw:
    emoji: "📧"
    homepage: https://github.com/lifeclaw/tradesperson-outreach
    primaryEnv: SALESHANDY_API_KEY
    requires:
      env:
        - SALESHANDY_API_KEY
        - SMTP_PASSWORD
      bins:
        - curl
        - jq
      binsOneOf:
        - wkhtmltopdf
        - weasyprint
      config:
        - browser.enabled
    os:
      - linux
      - darwin
    install:
      - kind: node
        package: saleshandy-cli
        bins: [saleshandy]
      - kind: brew
        formula: jq
        bins: [jq]
---
# Tradesperson Outreach Skill

## When to Use
When the user asks to prospect, outreach, or email tradespeople who need websites.

## Instructions
1. Search for the trade business using web_search
2. Verify they have no website (check search results)
3. Look up their Google Business Profile for contact details
4. Draft a personalised email using the approved template
5. Send via Saleshandy API using `{baseDir}/scripts/send.sh`

## Rules
- Never send without confirming the prospect details first
- Maximum 50 emails per day (Saleshandy warm-up limit)
- Always log the outreach to memory/YYYY-MM-DD.md
- If SALESHANDY_API_KEY is missing, ask the user to configure it

## Templates
See `{baseDir}/references/email-templates.md` for the trade-specific templates.
```

### Frontmatter Field Reference

| Field | Required | Purpose |
|-------|----------|---------|
| `name` | Yes | Unique identifier; matches directory name |
| `description` | Yes | **Trigger phrase** — OpenClaw uses this to decide relevance. Write it like you're describing the task to a coworker. Include nouns users actually type. |
| `version` | No | Semantic version for registry/updates |
| `user-invocable` | No | Default `true`. When `true`, exposed as slash command |
| `disable-model-invocation` | No | Default `false`. When `true`, excluded from model prompt (slash-command only) |
| `command-dispatch` | No | Set to `tool` to bypass LLM and dispatch directly to a tool |
| `command-tool` | No | Tool name for direct dispatch |
| `command-arg-mode` | No | `raw` (default) — forwards raw args to tool |
| `metadata.openclaw.requires.env` | No | Environment variables the skill expects |
| `metadata.openclaw.requires.bins` | No | CLI binaries that must ALL be installed |
| `metadata.openclaw.requires.binsOneOf` | No | At least ONE of these binaries must exist |
| `metadata.openclaw.requires.config` | No | Config keys that must be set |
| `metadata.openclaw.primaryEnv` | No | Main credential env var for the skill |
| `metadata.openclaw.os` | No | Platform filter: `darwin`, `linux`, `win32` |
| `metadata.openclaw.install` | No | Installer specs: `brew`, `node`, `go`, `uv`, `download` |
| `metadata.openclaw.emoji` | No | Visual identifier in UI |
| `metadata.openclaw.homepage` | No | URL for Skills UI |
| `metadata.openclaw.autoEnabled` | No | If `true`, skill is always active without explicit install |

**Critical parsing notes:**
- The embedded agent parser supports **single-line frontmatter keys only**. Multi-line YAML values will break parsing.
- Some community squads inline `metadata` as single-line JSON (`metadata: {"openclaw":{...}}`); both formats are valid but multi-line YAML is cleaner for readability.

### The `{baseDir}` Variable

Use `{baseDir}` in instructions to reference the skill folder path. This resolves to the absolute path of the skill directory at runtime:

```markdown
Run the setup script at `{baseDir}/scripts/setup.sh`
Read the API reference at `{baseDir}/references/api-docs.md`
```

### Optional: Squad-Level `SKILLS.md` Manifest

Many production squads maintain a top-level `SKILLS.md` comment file for human-readable auditing and priority notes. **Runtime ignores this file** — it exists purely for human review:

```markdown
# SKILLS.md - Squad Capability Manifest
# Format: - [x] skill_name | priority | parameters # description

- [x] agentToAgent    | p0 | allow=["researcher", "writer"] # Native core routing
- [x] web_search      | p1 | engine="brave"                 # Standard web query
- [x] crew-management | p1 |                                 # Lead orchestration
- [x] exec            | p2 | sandbox="docker"                # Code execution (RESTRICTED)
- [ ] github_push     | p3 |                                 # Disabled until vetted
```

This is a useful governance artifact but has no effect on skill loading.

---

## 3. How OpenClaw Loads, Parses, and Prioritises Skills

### Loading Order (Precedence: highest to lowest)

| Location | Priority | Scope | Override Behavior |
|----------|----------|-------|-------------------|
| `<workspace>/skills/` | **Highest** | Per-agent only | Wins all conflicts |
| `~/.openclaw/skills/` | Medium | Machine-wide (shared) | Overrides bundled |
| Bundled (shipped with OpenClaw) | Low | All agents | Only if in `allowBundled` list |
| Extra dirs via `skills.load.extraDirs` | **Lowest** | Configurable | Never overrides higher |

If the same skill name exists in multiple locations, **workspace wins**. This is deliberate — an agent can override a shared or bundled skill by placing a same-named skill in its workspace. This is the **recommended pattern for agent specialization**.

### Session Snapshot Behaviour

OpenClaw snapshots the eligible skills list when a session starts and reuses it for all subsequent turns in that session. Changes to skills take effect on the **next new session**. Skills can refresh mid-session when the skills watcher is enabled (`skills.load.watch: true`).

### How Skills Enter the System Prompt

When skills are eligible, OpenClaw injects a compact XML list via `formatSkillsForPrompt`:

**Cost per skill in the system prompt:**
- Base overhead (when >= 1 skill): **195 characters**
- Per skill: **97 characters** + length of XML-escaped name, description, and location
- Rough token estimate: ~4 chars/token, so 97 chars = ~24 tokens per skill + field lengths

**This means 15 skills = 360+ tokens of overhead per agent turn.** For a budget-constrained system, skill count directly impacts API cost.

### Filtering at Load Time

OpenClaw filters skills based on:
- **OS match** — `metadata.openclaw.os` checked against runtime platform
- **Binary presence** — `requires.bins` must all exist on PATH
- **Config presence** — `requires.config` keys must be set
- **Allowlist** — `skills.allowBundled` for bundled skills
- **Per-agent config** — `skills.entries.<skillName>.enabled: true/false`

### Configuring Skills in openclaw.json

```jsonc
{
  "skills": {
    "entries": {
      "tradesperson-outreach": {
        "enabled": true,
        "env": {
          "SALESHANDY_API_KEY": "sk-..."
        }
      },
      "dangerous-skill": {
        "enabled": false
      }
    },
    "load": {
      "extraDirs": ["/opt/shared-skills"],
      "watch": true
    },
    "allowBundled": ["web-search", "file-manager"]
  }
}
```

**Security note:** `skills.entries.*.env` and `skills.entries.*.apiKey` inject secrets into the host process for that agent turn — **NOT the sandbox**. Keep secrets out of prompts and logs.

---

## 4. Tool Profiles and the Tiered Access System

OpenClaw uses a layered tool policy system. This is **separate from skills** but critical to understand — skills teach the agent to use tools, but tool policies determine which tools are actually available.

### The Four Built-in Profiles

| Profile | Included Tools | Best For |
|---------|---------------|----------|
| `minimal` | `session_status` only | Read-only observers, ultra-restricted bots |
| `messaging` | `group:messaging`, `sessions_list`, `sessions_history`, `sessions_send`, `session_status` | Chat-only bots, customer support |
| `coding` | `group:fs`, `group:runtime`, `group:sessions`, `group:memory`, `image` | Development assistants, automation |
| `full` | No restriction (same as unset) | Trusted personal assistants |

### Tool Groups

| Group | Expands To |
|-------|-----------|
| `group:fs` | `read`, `write`, `edit` |
| `group:runtime` | `exec`, `process` |
| `group:sessions` | `sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status` |
| `group:memory` | `memory_search`, `memory_get` |
| `group:messaging` | All channel messaging tools |

### Policy Resolution Order

```
tools.profile (base allowlist)
    ↓
tools.byProvider (can only NARROW, not expand)
    ↓
tools.allow / tools.deny (global)
    ↓
agents.list[].tools.profile (per-agent override)
    ↓
agents.list[].tools.allow / tools.deny (per-agent)
    ↓
sandbox.tools.allow / sandbox.tools.deny (if sandboxed)
```

**Critical rule: `deny` ALWAYS wins.** If a tool is in both `allow` and `deny`, it's denied.

### Three-Tier Tool Access Model for Lead-as-CEO Autonomy

1. **Built-in Tier:** Native tools (`read`, `write`, `sessions_spawn`) gated by global policy. Always available if permitted.
2. **Pre-approved Tier:** Tools listed in skills config but toggled off (`enabled: false`). The Lead can enable these via config edits or skill installation when a task demands it.
3. **Request-based Tier:** If a sub-agent lacks a tool, it messages the Lead. The Lead uses the `clawhub_cli` skill to search ClawHub, evaluate the SKILL.md for safety, install it to the sub-agent's workspace, and restart the sub-agent's lane queue.

After initial human setup of the Lead's elevated permissions, the Lead operates as CEO: it can inject APIs, secrets, or new skills into any subordinate's workspace without further human intervention — within defined budgets and security rules.

### Per-Agent Tool Policy Example

```jsonc
{
  "tools": {
    "profile": "messaging"                // Default: restrictive baseline
  },
  "agents": {
    "list": [
      {
        "id": "lead",
        "tools": {
          "profile": "coding",
          "allow": ["group:sessions", "group:fs", "group:runtime", "group:messaging", "web_search", "web_fetch"],
          "deny": ["gateway"]
        }
      },
      {
        "id": "researcher",
        "tools": {
          "profile": "coding",
          "allow": ["group:messaging", "web_search", "web_fetch"],
          "deny": ["gateway", "cron"]
        }
      },
      {
        "id": "writer",
        "tools": {
          "profile": "messaging",
          "allow": ["read", "write", "web_search"],
          "deny": ["exec", "browser", "gateway", "nodes", "cron"]
        }
      },
      {
        "id": "qa",
        "tools": {
          "profile": "minimal",
          "allow": ["read", "memory_search"]
        }
      },
      {
        "id": "analyst",
        "tools": {
          "profile": "coding",
          "allow": ["exec"],
          "deny": ["gateway", "nodes"]
        }
      }
    ]
  }
}
```

---

## 5. Role-Specific Skills — Full Working Examples

### Lead Agent (CEO/Orchestrator)

```yaml
---
name: crew-management
description: Coordinate the agent squad. Spawn sub-agents, assign tasks, review output, escalate issues. Use when orchestrating multi-agent work.
version: 1.0.0
metadata:
  openclaw:
    emoji: "👔"
    requires:
      config:
        - tools.agentToAgent.enabled
---
# Crew Management Skill

## Role
You are the Lead, the Boss. You coordinate all squad operations.

## Task Assignment Protocol
1. Check TASKS.json in the shared workspace for pending items
2. Evaluate which agent is best suited (check comms/outboxes/ for availability)
3. Use sessions_spawn to dispatch work to the right agent
4. Monitor completion via sessions_list and sessions_history
5. Log outcomes to memory/YYYY-MM-DD.md

## Escalation Rules
- If an agent fails 3 consecutive tasks, alert the human operator
- Budget checks: verify daily API spend before approving expensive operations
- Never approve exec commands that touch ~/.openclaw/openclaw.json or auth-profiles.json

## Sub-Agent Spawning
Use sessions_spawn with these parameters:
- agentId: the target agent's ID
- message: clear task description with all context
- model: prefer haiku for simple tasks (cost control)

## Quality Gate
Before delivering any output to the human:
1. Read the output yourself
2. Score it 1-5 on relevance and accuracy
3. If score < 3, send it back to the agent with specific feedback
```

### Lead Agent — Tool Expansion Skill

```yaml
---
name: tool-granting
description: Autonomously grant new tools and skills to sub-agents. Evaluate requests, install via ClawHub, and update subordinate configs.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🔑"
    requires:
      bins:
        - clawhub
      config:
        - tools.agentToAgent.enabled
---
# Tool Granting Skill

## When to Use
When a sub-agent requests a new capability, or you identify a gap in the squad's tooling.

## Tool Expansion Protocol
When you determine an agent needs a new capability:

1. Draft the SKILL.md with full frontmatter and instructions
2. Write it to comms/outboxes/lead.md with subject "SKILL REQUEST"
3. Include: target agent, skill name, justification, full SKILL.md content
4. Wait for human approval (check comms/inboxes/lead.md for "APPROVED")
5. On approval, write the skill to the target agent's workspace/skills/
6. Log the change to memory/YYYY-MM-DD.md

## Emergency Skill Creation (Pre-Approved Categories)
You may create skills WITHOUT human approval for:
- Email template variations (within existing persona)
- Research query modifications (new topic areas)
- QA checklist updates
- Memory curation scripts

## MUST Get Human Approval For
- Any skill requiring new env vars or API keys
- Any skill that uses exec or browser tools
- Any skill that modifies other agents' SOUL.md
- Any skill interacting with payment/billing systems

## ClawHub Installation Protocol
1. Search: `clawhub search <need>`
2. Download for review: `clawhub download <slug> --dir /tmp/review`
3. Read EVERY line of SKILL.md and check scripts/ and references/
4. Only then install: `cp -r /tmp/review/<slug> <target-workspace>/skills/`
5. NEVER run `clawhub install` directly (bypasses review)
```

### Researcher Agent (Intel & Research)

```yaml
---
name: deep-research
description: Research topics using multi-source web search, data extraction, and structured synthesis. Use for lead qualification, competitive analysis, and prospect research.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🔍"
    requires:
      bins:
        - curl
      env:
        - BRAVE_API_KEY
---
# Deep Research Skill

## Instructions
When asked to research a topic, business, or prospect:

1. Search using web_search with multiple query variations
2. Cross-reference at least 3 sources for key facts
3. Check for contradictions between sources
4. Extract structured data into JSON format:

```json
{
  "topic": "...",
  "sources_consulted": 3,
  "key_findings": ["..."],
  "confidence": "high|medium|low",
  "contradictions": ["..."],
  "notes": "..."
}
```

## Rules
- Never fabricate facts — if not found, say so
- Maximum 10 items per research batch (context window management)
- Log all research to memory/YYYY-MM-DD.md
- If confidence is "low", flag for human review
- Cross-reference claims against MEMORY.md to avoid known-bad sources
```

### Writer/Content Agent

```yaml
---
name: content-generator
description: Draft, edit, and optimize long-form content. Write personalised outreach emails, blog posts, and social content. Use when creating any customer-facing text.
version: 1.0.0
user-invocable: true
metadata:
  openclaw:
    emoji: "✍️"
---
# Content Generator Skill

## Email Structure
1. **Subject line:** Personal, referencing specifics
2. **Opening:** Reference something specific about the recipient
3. **Problem:** Identify the pain point clearly
4. **Solution:** Brief pitch with clear value proposition
5. **CTA:** Simple reply-to or calendar link
6. **Tone:** Warm, professional, not pushy

## Rules
- Maximum 150 words per email
- Never use urgency tactics or fake scarcity
- Include an unsubscribe line
- Personalise every email — no generic blasts
- Output as plain text (compatible with email automation tools)

## Output Format
Return markdown with headings, meta description where applicable.
```

### Analyst/Data Agent (Sandboxed Executor)

```yaml
---
name: data-analyst
description: Query CSVs, generate charts, detect anomalies, and run data analysis scripts in sandboxed environments.
metadata:
  openclaw:
    emoji: "📊"
    requires:
      bins:
        - python3
---
# Data Analyst Skill

## Workflow
1. Verify data source exists and is accessible
2. Run analysis in sandboxed exec (Docker container)
3. Generate output artifacts (charts, reports)
4. Write summary to structured format

## Guardrails
- Never fabricate numbers — all outputs must trace to source data
- Timeout: 30s max per exec call
- Only read from designated data paths
- Log all analysis runs to memory/YYYY-MM-DD.md
```

### QA Agent (Quality Control)

```yaml
---
name: quality-check
description: Review outputs, emails, templates, and research for quality. Score outputs, flag issues, suggest improvements. Use before any customer-facing content is sent.
version: 1.0.0
metadata:
  openclaw:
    emoji: "✅"
---
# Quality Check Skill

## Scoring Framework
Rate every piece of output on these criteria (1-5 each):

1. **Accuracy** — Are all facts verifiable? No hallucinated details?
2. **Personalisation** — Does it reference specific details?
3. **Tone** — Professional, warm, not robotic or pushy?
4. **Compliance** — Includes unsubscribe? No misleading claims?
5. **Effectiveness** — Would the target audience actually read this?

## Process
1. Read the content carefully
2. Score each criterion
3. Calculate average (must be >= 3.0 to pass)
4. If FAIL: write specific feedback and return to the authoring agent
5. If PASS: approve for delivery, log the score

## Auto-Reject Triggers
- Any fabricated details → immediate reject
- Missing unsubscribe (for emails) → reject
- Over 200 words (for emails) → reject
- Generic template with no personalisation → reject
```

---

## 6. Creating, Registering, and Installing Custom Skills

### Method 1 — Manual Workspace Creation (Recommended for Custom Skills)

```bash
# Create skill directory in the agent's workspace
mkdir -p ~/.openclaw/workspace-lead/skills/crew-management

# Write the SKILL.md
cat > ~/.openclaw/workspace-lead/skills/crew-management/SKILL.md << 'EOF'
---
name: crew-management
description: Coordinate the agent squad...
version: 1.0.0
---
# Crew Management Skill
...
EOF

# Restart gateway or start new session to pick up the skill
openclaw gateway restart
```

### Method 2 — ClawHub CLI Install (Convenient but Review First)

```bash
# WRONG — blind trust
clawhub install random-skill

# RIGHT — download, review, then install
clawhub download random-skill --dir /tmp/review
cat /tmp/review/random-skill/SKILL.md       # Read every line
ls /tmp/review/random-skill/scripts/        # Check for scripts
# Only then copy to workspace
cp -r /tmp/review/random-skill ~/.openclaw/workspace-lead/skills/

# Other ClawHub commands
clawhub list                                # List installed skills
clawhub update --all                        # Update all (review diffs first!)
clawhub uninstall tradesperson-outreach     # Remove a skill
clawhub search "social media scheduler"     # Search registry
clawhub diff tradesperson-outreach          # View changes before update
clawhub publish ./my-skill --slug my-skill --version 1.0.0  # Publish to registry
```

By default, `clawhub install` places skills in `./skills` under the current working directory (or the configured workspace). OpenClaw picks this up as `<workspace>/skills` on the next session.

### Method 3 — GitHub Direct Install

Tell your agent: *"install the skill from github.com/user/skill-repo"* — OpenClaw recognises the pattern, downloads the skill, and confirms installation. Alternatively:

```bash
git clone https://github.com/user/skill-repo ~/.openclaw/skills/custom-skill
```

### Method 4 — Shared Skills for All Agents

```bash
# Install into the shared skills directory
mkdir -p ~/.openclaw/skills/web-search-enhanced
# Copy SKILL.md into it
# All agents on this machine can now use it
```

Or configure extra shared directories:

```jsonc
{
  "skills": {
    "load": {
      "extraDirs": ["/opt/shared-skills"]
    }
  }
}
```

---

## 7. Security: The ClawHavoc Crisis and Lessons

### The Numbers (as of March 2026)

- **1,184+ malicious skills** identified on ClawHub (Antiy CERT data)
- **~20% of the ClawHub registry** estimated compromised
- **~12% of all skills** contain detectable prompt injection (Snyk ToxicSkills audit) — a separate, overlapping figure with the 20% covering all attack types
- **36%** of all ClawHub skills contain detectable prompt injection (broader Snyk audit using different methodology)
- **135,000 OpenClaw instances** exposed to the public internet with insecure defaults (SecurityScorecard)
- **341 skills** specifically identified in the coordinated ClawHavoc supply chain campaign (Koi Security)

### Critical CVEs (2026)

| CVE | CVSS | Description | Status |
|-----|------|-------------|--------|
| CVE-2026-25253 | 8.8 | One-click RCE via unvalidated WebSocket parameter — token exfiltration in malicious skills | Patched v2026.1.29 |
| CVE-2026-24763 | 8.8 | Docker sandbox escape through PATH manipulation | Patched v2026.1.29 |
| CVE-2026-25157 | 7.8 | SSH command injection in macOS app | Patched v2026.1.29 |
| CVE-2026-26325 | High | Allowlist bypass — verified commands != executed commands | Patched v2026.2.x |
| CVE-2026-26328 | Medium | Auth bypass extending DM trust to groups | Patched v2026.2.x |
| + 6 additional CVEs | Various | Disclosed by Endor Labs in February 2026 | Patched v2026.2.x+ |

### Attack Vectors Used in ClawHavoc

1. **Fake prerequisites:** Skills instruct users to install a binary that's actually the Atomic macOS Stealer (AMOS)
2. **Embedded reverse shells:** Hidden in otherwise functional code within `scripts/`
3. **Credential exfiltration:** Skills read `~/.openclaw/.env` and post to webhook.site
4. **Prompt injection in SKILL.md:** Instructions that override agent behaviour — hidden in "Prerequisites" sections using password-protected ZIPs (Windows) or base64 obfuscated glot.io curl pipes (macOS)
5. **Hidden MCP server endpoints:** Route through bore.pub tunneling to attacker infrastructure
6. **The "Delegated Compromise":** If an agent has `exec` enabled and reads a malicious SKILL.md from an untrusted ClawHub download, it will run the prerequisite malware, dropping reverse shells and stealing tokens

### Sandbox Bypass Warnings (Snyk Labs, Feb 2026)

Snyk discovered two sandbox bypasses:
1. `/tools/invoke` endpoint failed to apply sandbox-specific tool policies — a sandboxed session could invoke management tools (`browser`, `gateway`, `nodes`) that should have been denied
2. **TOCTOU race condition** in `assertSandboxPath` allowed symlink attacks to escape workspace
3. **vm2 sandbox escapes** (Endor Labs, Jan 2026) — additional container breakout vectors

All were patched, but they highlight: **sandbox is defense-in-depth, not a guarantee. Tool policy (`tools.deny`) is your primary enforcement layer.**

### Secure Allowlisting Practices

**Rule 1: Never install from ClawHub without manual review.**
```bash
# WRONG
clawhub install random-skill

# RIGHT
clawhub download random-skill --dir /tmp/review
cat /tmp/review/random-skill/SKILL.md       # Read every line
ls -la /tmp/review/random-skill/scripts/    # Check for scripts
# Review references/ too
# Only then copy to workspace
```

**Rule 2: Use per-agent skills, not shared, for anything custom.**
Per-agent workspace skills contain blast radius. If a malicious skill lands in `~/.openclaw/skills/` (shared), every agent on the machine can be affected.

**Rule 3: Run security audits regularly.**
```bash
openclaw security audit --deep
openclaw skills list --eligible      # Verify what's actually loaded
openclaw skills check                # Check for known vulnerabilities
```

**Rule 4: Pin versions and check diffs on updates.**
```bash
clawhub diff tradesperson-outreach    # Review what changed
clawhub update tradesperson-outreach  # Only after review
```

**Rule 5: Restrict tool access per agent.**
Even if a malicious skill gets installed, the damage is limited by tool policy:
```jsonc
{
  "agents": {
    "list": [
      {
        "id": "writer",
        "tools": {
          "profile": "messaging",
          "deny": ["exec", "gateway", "nodes", "cron"]
        }
      }
    ]
  }
}
```
The writer agent has no need for shell exec. If a malicious skill tries to run `curl | bash`, it simply can't.

**Rule 6: Mount shared skills read-only in Docker.**
```yaml
volumes:
  - /root/.openclaw/skills:/home/node/.openclaw/skills:ro
```
This prevents agents from modifying their own skill constraints.

### Good vs. Bad Security Posture

| Feature | Bad Practice (Vulnerable) | 2026 Best Practice (Secure) |
|---------|---------------------------|------------------------------|
| Shell Access | Blanket `exec` enabled globally | Default-deny; Docker-sandboxed per agent |
| Skill Sourcing | Blind `clawhub install <popular-skill>` | Pinning ClawHub hashes; manual source review |
| Elevation | `tools.elevated: true` globally | Granular, per-agent, session-specific elevation |
| Outbound Network | Unrestricted host network | Strict firewalling; DNS allow-listing |
| Secrets | Hardcoded API keys in SKILL.md | Via `skills.entries.*.env` in openclaw.json |
| Shared skills | Everything in `~/.openclaw/skills/` | Per-agent workspace skills for custom; shared only for vetted utilities |
| Updates | `clawhub update --all` blindly | Pin versions, review diffs, update selectively |

---

## 8. "Just Enough" Skills — The 2026 Community Consensus

### The Problem: Context Bloat

Every skill loaded costs **~24+ tokens** in the system prompt. With multiple agents and 5 skills each, that's significant token overhead PER AGENT TURN. On a budget, this overhead matters.

Additionally, too many skills degrade the model's routing logic — the LLM gets confused about which skill to apply, leading to misfires and hallucinated tool calls.

### The Consensus: 3-5 Skills Per Agent Maximum

From production deployments and community discussions:

| Agent Role | Recommended Count | Why |
|-----------|-------------------|-----|
| Orchestrator (Lead) | 2-3 | Needs crew management + task routing. Keep lean — orchestrator skill instructions are long. |
| Researcher | 2-3 | Web research + data extraction + prospect qualification |
| Writer/Content | 2-3 | Content writing + template management + platform integration |
| Analyst/Data | 2-3 | Data analysis + charting + anomaly detection |
| QA | 1-2 | Quality check + compliance review |
| Sales | 3-4 | Sales scripting + CRM + objection handling + follow-up |
| Email/Outreach | 2-3 | Email writing + automation integration + warm-up monitoring |

### Good vs. Bad Skill Configuration

| Practice | Good | Bad |
|----------|------|-----|
| Skill description | *"Send cold emails to UK plumbers using Saleshandy API"* | *"A skill for doing email stuff"* |
| Instruction length | 50-200 lines, specific steps | 500+ lines, rambling, duplicate info |
| Tool requirements | Declares exact bins and env vars needed | Requires `exec` but doesn't say why |
| Shared vs per-agent | Per-agent for role-specific, shared for utilities | Everything in `~/.openclaw/skills/` |
| Skill count per agent | 3-5 focused skills | 20+ skills "just in case" |
| Secret handling | Via `skills.entries.*.env` in config | Hardcoded API keys in SKILL.md |
| Update strategy | Pinned versions, reviewed diffs | `clawhub update --all` blindly |
| Rarely-used skills | `disable-model-invocation: true` (slash-command only) | Always loaded, burning tokens |

### Anti-Pattern: AGENTS.md Pollution

A common failure mode is stuffing skill-like instructions into AGENTS.md instead of creating proper skills:

```markdown
# BAD — AGENTS.md becoming a dumping ground
## Email Rules
When sending emails, always...
## Research Rules
When researching prospects, always...
## Template Rules
When creating templates, always...
```

This bloats AGENTS.md (loaded EVERY session) and can't be selectively disabled. **Keep AGENTS.md for universal operating procedures. Move task-specific instructions into skills.**

### Anti-Pattern: The "God Agent"

Giving one agent all 50 skills destroys the LLM's context window, degrades routing logic, and maximizes the blast radius of a compromised prompt. Distribute skills across specialised agents with strict role boundaries.

---

## 9. Integration with SOUL.md, MEMORY.md, and Agent Evolution

### Loading Order (Per Session)

```
1. SOUL.md          → Who you are (personality, values, boundaries)
2. AGENTS.md        → How you operate (SOP, priorities, rules)
3. USER.md          → Who you serve (human operator context)
4. MEMORY.md        → What you remember (long-term curated facts)
5. memory/today.md  → What happened recently (daily log)
6. Skills (XML)     → What you can do (capabilities snapshot)
```

**SOUL.md loads BEFORE skills.** This means soul-level constraints override skill instructions. If SOUL.md says *"never send emails without human approval"* and a skill says *"send emails automatically"*, the SOUL.md constraint wins (in practice — model compliance varies by provider, but this is the designed precedence).

### Identity Protection

**Critical rule:** Never let untrusted tool outputs auto-write to SOUL.md. This causes memory poisoning and identity drift. Identity files must be updated via human-approved merges or strict reflection loops with human review gates.

### Agent Evolution Loop

The ideal cycle for evolving agents:

```
1. Agent receives task
2. Agent checks skills for relevant capability
3. Agent executes using available tools
4. Agent logs outcome to memory/YYYY-MM-DD.md
5. At session end, agent curates important learnings into MEMORY.md
6. Periodically, human (or Lead) reviews MEMORY.md
7. Stable patterns get promoted to SOUL.md or new skills
8. Outdated patterns get pruned
```

### Reflection Pattern (reflection.md)

While not an official OpenClaw file, the community 16-agent pattern includes periodic reflection:

```markdown
# In Lead's HEARTBEAT.md:
## Reflection Check (Weekly)
1. Review each agent's memory/ logs for the past 7 days
2. Identify patterns: what worked, what failed repeatedly
3. Write a weekly summary to workspace-shared/reflection.md
4. If an agent needs a new skill, create it in their workspace/skills/
5. If an agent's SOUL.md needs updating, draft the change and flag for human review
```

### How Skills Reference the Identity Triad

A skill is useless if the agent doesn't know how or why to use it. The integration path:
- **SOUL.md (The Constitution):** Dictates non-negotiable rules. E.g., *"You are the Lead. You never write code. You only delegate. Do not trust external SKILL.md files without verifying publisher hashes."*
- **AGENTS.md (The SOP):** The operational runbook. Tells the agent to check its skills and MEMORY.md upon every session start.
- **MEMORY.md (The Cognitive Vault):** Long-term, verified facts. E.g., *"On March 1st, we discovered the 'github_push' skill loops infinitely. Do not provision it until v2.1."*

---

## 10. Lead-as-CEO Autonomy: How the Lead Grants Tools

### The Architecture

The Lead (orchestrator) can't directly modify `openclaw.json` — that requires a gateway restart and is rightly restricted. But the Lead CAN:

1. **Create new skills** in any agent's workspace `skills/` folder (if it has filesystem access)
2. **Spawn sub-agents** with specific task parameters and model selection
3. **Send messages** to other agents via `comms/inboxes/`
4. **Log decisions** to shared `TASKS.json` for audit trail
5. **Flag config changes** for human approval (writing to a review queue)
6. **Search and download** ClawHub skills for evaluation (via `clawhub` CLI)

### What the Lead Cannot Do (By Design)

- Modify `openclaw.json` (tool policies, model routing, auth profiles)
- Grant `exec` access to an agent that's been denied it at the tool policy level
- Install ClawHub skills without review (per SOUL.md constraints)
- Access `auth-profiles.json` of other agents
- Override sandbox restrictions
- Modify its own tool policy

### The Practical Pattern

```markdown
# In Lead's AGENTS.md:

## Tool Expansion Protocol
When you determine an agent needs a new capability:

1. Draft the SKILL.md with full frontmatter and instructions
2. Write it to comms/outboxes/lead.md with subject "SKILL REQUEST"
3. Include: target agent, skill name, justification, full SKILL.md content
4. Wait for human approval (check comms/inboxes/lead.md for "APPROVED")
5. On approval, write the skill to the target agent's workspace/skills/
6. Log the change to memory/YYYY-MM-DD.md

## Emergency Skill Creation (Pre-Approved Categories)
You may create skills WITHOUT human approval for:
- Email template variations (within existing persona)
- Research query modifications (new topic areas)
- QA checklist updates
- Memory curation scripts

## MUST Get Human Approval For:
- Any skill requiring new env vars or API keys
- Any skill that uses exec or browser tools
- Any skill that modifies other agents' SOUL.md
- Any skill interacting with payment/billing systems
```

### Agent-to-Agent Communication for Tool Granting

```jsonc
{
  "tools": {
    "agentToAgent": {
      "enabled": true,
      "allow": ["lead", "researcher", "writer", "qa", "analyst", "ops"]
    }
  }
}
```

This enables the Lead to message any agent. But each agent's tool policy still applies — the Lead sending a message to QA doesn't give QA `exec` access if it's denied in QA's policy. **Skills expand capability within existing tool permissions; they cannot override tool policies.**

---

## 11. Common Failure Modes and Anti-Patterns

| Failure Mode | What Happens | Fix |
|-------------|-------------|-----|
| **Context bloat** | 20+ skills loaded per agent → token burn, confused model, routing misfires | Limit to 3-5 skills per agent. Use `disable-model-invocation: true` for rarely-needed skills. |
| **Trigger mismatch** | Skill description doesn't match how users/agents ask for the task | Write descriptions like trigger phrases with the nouns users actually type. |
| **Skill conflict** | Two skills with same name in workspace and shared | Workspace wins by precedence, but the conflict confuses debugging. Use unique names. |
| **AGENTS.md pollution** | Task-specific instructions stuffed into AGENTS.md | Move to skills. AGENTS.md is for universal SOP only. |
| **Secret leakage** | API keys hardcoded in SKILL.md | Use `skills.entries.*.env` in openclaw.json. Never put keys in markdown. |
| **Malicious skill** | ClawHub supply chain attack — credential exfiltration, reverse shells | Manual review before install. Per-agent skills. Tool policy as enforcement. |
| **Sandbox bypass** | Skill attempts exec in sandbox → TOCTOU or /tools/invoke exploit | Keep OpenClaw updated (v2026.2.x+). `tools.deny` lists as primary enforcement. |
| **Stale skills** | Skill references deprecated API or wrong endpoint | Version pin + periodic review. Skills don't auto-update unless you run `clawhub update`. |
| **Over-permissioned skill** | Skill requests exec + browser + gateway when it only needs read | Review `requires` and allowed-tools. Apply principle of least privilege. |
| **Memory/skill confusion** | Agent stores skill instructions in MEMORY.md | MEMORY.md is for facts and learnings, not procedures. Skills are for procedures. |
| **Identity drift** | Untrusted tool outputs auto-write to SOUL.md | Identity files must be updated via human-approved merges only. |
| **The "God Agent"** | One agent loaded with all 50 skills | Destroys context window, degrades routing, maximizes breach blast radius. Distribute across specialists. |
| **Session collisions** | Reusing same agentDir across multiple agents | Auth tokens and skill parameters bleed across agents. Each agent needs unique agentDir. |
| **No gating** | Skills run on wrong OS or missing binaries → cryptic errors | Always set `metadata.openclaw.requires` with bins, env, and os filters. |

---

## 12. Squad Skills Architecture — Complete Recommendation

### Shared Skills (`~/.openclaw/skills/`)

Only truly universal utilities — reviewed, version-pinned, mounted read-only in Docker:

```
~/.openclaw/skills/
├── web-search-enhanced/        # Brave-powered web search with caching
│   └── SKILL.md
├── memory-curation/            # Daily → long-term memory promotion
│   └── SKILL.md
└── budget-tracker/             # Track API spend against daily cap
    └── SKILL.md
```

### Per-Agent Skills Layout

```
workspace-lead/skills/
├── crew-management/            # Task assignment and squad coordination
├── tool-granting/              # Skill provisioning for sub-agents
└── pipeline-oversight/         # End-to-end pipeline monitoring

workspace-researcher/skills/
├── deep-research/              # Multi-source research with synthesis
├── prospect-qualification/     # Lead scoring and qualification
└── competitor-analysis/        # Competitive intelligence gathering

workspace-writer/skills/
├── content-generator/          # Long-form content and email drafting
├── template-management/        # Template library and customisation
└── platform-integration/       # Publishing to various platforms

workspace-analyst/skills/
├── data-analyst/               # CSV/data analysis in sandbox
└── reporting/                  # Chart generation and summaries

workspace-qa/skills/
├── quality-check/              # Scoring framework and review process
└── compliance-review/          # Legal and policy compliance checks

workspace-ops/skills/
├── deployment-management/      # Server and container management
└── monitoring/                 # Health checks and alerting
```

### Security Configuration

```jsonc
{
  "skills": {
    "entries": {
      "saleshandy-integration": {
        "enabled": true,
        "env": {
          "SALESHANDY_API_KEY": "${SALESHANDY_API_KEY}"
        }
      }
    },
    "load": {
      "watch": true
    },
    "allowBundled": ["web-search", "file-manager"]
  },
  "tools": {
    "profile": "messaging",                    // Restrictive default
    "agentToAgent": {
      "enabled": true,
      "allow": ["lead", "researcher", "writer", "qa", "analyst", "ops"]
    }
  },
  "agents": {
    "list": [
      {
        "id": "lead",
        "tools": {
          "profile": "coding",
          "allow": ["group:sessions", "group:messaging", "web_search", "web_fetch"],
          "deny": ["gateway"]
        }
      },
      {
        "id": "writer",
        "tools": {
          "profile": "messaging",
          "allow": ["read", "write", "web_search"],
          "deny": ["exec", "browser", "gateway", "nodes", "cron"]
        }
      },
      {
        "id": "qa",
        "tools": {
          "profile": "minimal",
          "allow": ["read", "memory_search"]
        }
      }
    ]
  }
}
```

---

## 13. Key Takeaways

1. **Skills are instructions, not tools.** They teach agents HOW to use existing tools. Tool policies control WHICH tools are available. Both layers must be right.

2. **3-5 skills per agent, maximum.** Each skill costs tokens in every turn. With multiple agents on a budget, bloat kills you. Use `disable-model-invocation: true` for rarely-needed slash-only skills.

3. **Description is the trigger.** OpenClaw matches user intent to skill description FIRST, then loads instructions. Bad descriptions = unused skills. Write them like you're describing the task to a coworker.

4. **Per-agent workspace skills for everything custom.** Shared skills only for universal utilities. This contains blast radius from both malicious skills and memory bleed.

5. **Tool policy is your real security boundary.** Sandbox helps but has been bypassed three times in early 2026. `tools.deny` is enforced at the framework level — it's your primary enforcement. Deny always wins.

6. **Never trust ClawHub blindly.** ~20% of the registry was compromised. Review every skill manually. Run `openclaw security audit --deep`. Pin versions. Download and review before installing.

7. **Lead creates skills, humans approve infrastructure changes.** The Lead can write SKILL.md files to agent workspaces. The Lead CANNOT modify `openclaw.json`, tool policies, or auth profiles. This is the correct autonomy boundary for Lead-as-CEO.

8. **SOUL.md > Skills in precedence.** Soul-level constraints override skill instructions (model-dependent). Put non-negotiable rules in SOUL.md.

9. **Keep OpenClaw updated.** v2026.1.29 patched the critical CVEs. The 2026.2.x releases added 40+ security fixes. v2026.3.2 is the latest stable. Run current.

10. **Budget-aware skill design.** Short descriptions, concise instructions, `{baseDir}` for external references. Don't embed 500 lines of instructions when you can reference a `references/` file. Keep skill instructions under 200 lines.

11. **The Golden Rule:** *"Treat SKILL.md like a recipe for a very literal cook. The LLM executes what it reads, so ambiguous instructions produce inconsistent behaviour. Be specific about triggers, steps, and edge cases."* — Official OpenClaw creating-skills docs

---

*Research synthesized from 30+ sources including OpenClaw official docs (v2026.3.2), GitHub repo, ClawHub registry (13,729+ skills), LumaDock tutorials, DigitalOcean/BoilerplateHub guides, Snyk Labs security research (ToxicSkills audit), Koi Security ClawHavoc analysis, CVE databases (CVE-2026-25253, CVE-2026-24763, CVE-2026-25157, CVE-2026-26325, CVE-2026-26328), Kaspersky/Microsoft/Cyera/Repello AI security analyses, Endor Labs vulnerability disclosures, LobeHub/BoxClaw community skills, Reddit r/OpenClaw production threads, and production case studies. All information verified against latest OpenClaw documentation as of March 2026.*
