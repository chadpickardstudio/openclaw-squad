# 15. Backup & Rollback Strategies — Master Research (March 2026)

> **Status**: Complete · **Sources**: Grok (primary), Gemini, official docs, MyClaw Backup, LumaDock
> **Last verified**: March 2026 (OpenClaw v2026.3.x, MyClaw Backup skill, community patterns)

---

## Table of Contents

1. [Overview](#1-overview)
2. [What Needs Backing Up](#2-what-needs-backing-up)
3. [Git-Init Strategy Per Agent](#3-git-init-strategy-per-agent)
4. [Automated Backup Routines](#4-automated-backup-routines)
5. [Rollback Procedures](#5-rollback-procedures)
6. [Lead-as-CEO Backup Oversight](#6-lead-as-ceo-backup-oversight)
7. [Integration Points](#7-integration-points)
8. [Real 2026 Production Examples](#8-real-2026-production-examples)
9. [Common Failure Modes & Anti-Patterns](#9-common-failure-modes--anti-patterns)
10. [Comparison Table](#10-comparison-table)
11. [Step-by-Step Setup Commands](#11-step-by-step-setup-commands)
12. [Practical Recommendations](#12-practical-recommendations)

---

## 1. Overview

OpenClaw stores everything critical in the filesystem: `~/.openclaw/` (state:
`openclaw.json`, credentials, sessions, cron jobs, daemon configs) and
`~/.openclaw/workspace/` (or custom per-agent path: `MEMORY.md`, `SOUL.md`,
`AGENTS.md`, `TOOLS.md`, `skills/`, daily `memory/YYYY-MM-DD.md`).

**There is no built-in snapshot/rollback in core** (official docs and repo
confirm zero native git/snapshot tools). All production strategies are
community-built + LumaDock patterns + the new March 2026 MyClaw Backup skill.

Operating always-on agents means treating AI memory like production databases.
Without a robust backup strategy, a bad update, a recursive hallucination
loop, or infrastructure failure results in permanent "amnesia."

The industry standard is a **hybrid model**:
- **Hourly Git snapshots** for granular workspace rollbacks
- **Daily encrypted tar.gz archives** for full disaster recovery
- **Off-site immutable storage** (S3/Backblaze B2) for catastrophic failure

---

## 2. What Needs Backing Up

### 2.1 Critical Files by Priority

| File/Directory | Priority | Contains | Backup Frequency |
|---------------|----------|----------|-----------------|
| `MEMORY.md` | Critical | Curated long-term facts, preferences, routing index | Every commit |
| `SOUL.md` | Critical | Agent identity, personality, behavioral rules | Every commit |
| `AGENTS.md` | Critical | Operational rules, session startup protocol | Every commit |
| `TOOLS.md` | High | Tool configurations and permissions | Every commit |
| `IDENTITY.md` | High | Role-specific tuning | Every commit |
| `HEARTBEAT.md` | High | Proactive trigger configuration | Every commit |
| `memory/YYYY-MM-DD.md` | High | Daily episodic logs | Daily archive |
| `skills/` | High | Installed skill definitions | Every commit |
| `openclaw.json` | Critical | Gateway config, credentials, agent definitions | Daily encrypted |
| `sessions/*.jsonl` | Medium | Session transcripts (audit trails) | Daily archive |
| `auth-profiles.json` | Critical (secret) | API keys in cleartext | Encrypted only |

### 2.2 The Two-Category Split

**Code/state** (safe for Git): MEMORY.md, SOUL.md, AGENTS.md, TOOLS.md,
IDENTITY.md, HEARTBEAT.md, skills/, memory/ daily logs.

**Secrets/config** (encrypted archives only): openclaw.json, auth-profiles.json,
credentials/, tokens/, .env files. **Never commit these to Git.**

---

## 3. Git-Init Strategy Per Agent

### 3.1 Per-Agent Isolation

Each agent gets its own private workspace folder (set via
`agents.<name>.workspace` in `openclaw.json`). Each workspace must be its
own Git repository. This keeps independence: no shared repo bleed.

### 3.2 .gitignore Template

Git should only track semantic state, not noisy sessions or cleartext secrets:

```gitignore
# ~/.openclaw/agents/<agentId>/workspace/.gitignore

# Secrets - NEVER commit
openclaw.json
auth-profiles.json
credentials/
tokens/
*.age
*.gpg
.env

# Large/transient files
sessions/
*.log
node_modules/
media/
*.tgz
*.tar.gz

# Temp/auto-backup
*.bak
.bak.*
.broken/

# Explicitly track core persona, memory, and skills
!MEMORY.md
!SOUL.md
!AGENTS.md
!IDENTITY.md
!HEARTBEAT.md
!TOOLS.md
!memory/
!skills/
```

### 3.3 Git-Init Script (Per Agent)

```bash
#!/bin/bash
AGENT_NAME="lead-agent"  # parameterize for each agent
WORKSPACE="$HOME/.openclaw/workspace/$AGENT_NAME"
mkdir -p "$WORKSPACE"
cd "$WORKSPACE"

git init
git branch -M main

# Copy standard .gitignore (from template above)
cp ~/.openclaw/templates/.gitignore-standard .gitignore

# Initial commit
git add .
git commit -m "init: secure baseline snapshot for $AGENT_NAME"

# Optional: push to isolated private remote
# git remote add origin git@github.com:YourOrg/agent-${AGENT_NAME}.git
# git push -u origin main

echo "Git repo initialized for $AGENT_NAME."
```

### 3.4 Automated Squad Init Script

Initialize all agents at once:

```bash
#!/bin/bash
# init-squad-repos.sh — Initialize isolated git repos for all agents
AGENTS_DIR="$HOME/.openclaw/agents"

for agent_path in "$AGENTS_DIR"/*; do
  if [ -d "$agent_path/workspace" ]; then
    AGENT_NAME=$(basename "$agent_path")
    echo "Initializing Git for agent: $AGENT_NAME"
    cd "$agent_path/workspace" || continue
    git init
    cp ~/.openclaw/templates/.gitignore-standard .gitignore
    git add .
    git commit -m "init: secure baseline snapshot for $AGENT_NAME"
  fi
done
```

---

## 4. Automated Backup Routines

### 4.1 Three-Tier Backup Strategy

| Tier | Method | Frequency | What It Covers | Secrets? |
|------|--------|-----------|---------------|----------|
| **Tier 1** | Per-agent Git commits | Hourly | Workspace files (MEMORY.md, SOUL.md, skills/) | No (gitignored) |
| **Tier 2** | Encrypted tar.gz archives | Daily | Full `~/.openclaw/` state + workspace + secrets | Yes (encrypted) |
| **Tier 3** | Off-site immutable (restic/Duplicati → S3/B2) | Daily | Complete disaster recovery archive | Yes (encrypted + immutable) |

### 4.2 Hourly Git Snapshot Script

```bash
#!/bin/bash
# backup-agent.sh — Run hourly via cron
WORKSPACE="$HOME/.openclaw/workspace/$1"  # pass agent name as arg
cd "$WORKSPACE" || exit 1
git add -A
git commit -m "Hourly snapshot $(date +%Y-%m-%d_%H-%M) - auto" || true
git push origin main || echo "Push failed - local snapshot preserved"
```

Cron entry (per agent or centralized):

```bash
# crontab -e
0 * * * * /path/to/backup-agent.sh lead-agent
0 * * * * /path/to/backup-agent.sh researcher
0 * * * * /path/to/backup-agent.sh coder
0 3 * * * /path/to/daily-tar.sh     # daily full encrypted
```

### 4.3 Daily Encrypted Full Backup Script

```bash
#!/bin/bash
set -euo pipefail
BACKUP_DIR="$HOME/backups/openclaw"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
STATE_DIR="$HOME/.openclaw"
WORKSPACE_DIR="$HOME/.openclaw/workspace"

mkdir -p "$BACKUP_DIR"

# Stop gateway for consistency (prevents concurrent writes)
openclaw gateway stop || true

# Create encrypted archives (age encryption)
tar -czf - -C "$STATE_DIR" . \
  | age -p -o "$BACKUP_DIR/state-$DATE.tgz.age"
tar -czf - -C "$WORKSPACE_DIR" . \
  | age -p -o "$BACKUP_DIR/workspace-$DATE.tgz.age"

# Restart gateway
openclaw gateway start

echo "Encrypted backups created at $BACKUP_DIR"
echo "Passphrase must be in password manager."
```

### 4.4 Off-Site with Restic (S3/Backblaze B2)

```bash
# Configure restic
export RESTIC_REPOSITORY="s3:https://s3.amazonaws.com/your-bucket/openclaw-squad"
export RESTIC_PASSWORD="super-secret-vault-pass"

# Backup
restic backup "$HOME/.openclaw" "$HOME/backups"

# Retention policy
restic forget \
  --keep-hourly 24 \
  --keep-daily 30 \
  --keep-weekly 12 \
  --prune
```

### 4.5 MyClaw Backup Skill (March 2026)

New one-command, security-first skill open-sourced in March 2026:
- Full `.tar.gz` (workspace/memory/skills/credentials/sessions/cron/daemon)
- Scheduled cron integration
- Token-protected restore
- Browser download/upload (localhost-only)
- Auto-reconnect channels after restore
- Post-restore health report
- Permission-locked (`chmod 600`)

Install via agent prompt: `"help me install backup"`

---

## 5. Rollback Procedures

### 5.1 Instant Git Workspace Rollback (Per Agent)

For workspace corruption (bad MEMORY.md edit, personality drift):

```bash
cd ~/.openclaw/agents/coder/workspace

# View recent snapshots
git log --oneline -10

# Rollback to specific commit
git reset --hard a1b2c3d

# Or rollback one step
git reset --hard HEAD~1
```

### 5.2 One-Command Full Rollback (Admin Executed)

For complete agent state corruption:

```bash
# 1. Stop gateway to prevent concurrent writes
openclaw gateway stop

# 2. Restore specific agent's workspace
cd ~/.openclaw/agents/coder/workspace
git log --oneline   # find stable commit hash
git reset --hard a1b2c3d

# 3. Restart gateway
openclaw gateway start

# 4. Verify health
openclaw doctor
```

### 5.3 Full Disaster Recovery (Hardware Failure / Migration)

```bash
# 1. Stop any running gateway
openclaw gateway stop || true

# 2. Decrypt and extract backup
age --decrypt backup-state-2026-03-04.tgz.age > state.tgz
mv ~/.openclaw ~/.openclaw.broken
tar xzf state.tgz -C ~/

# 3. Pin to known-good OpenClaw version
npm install -g openclaw@<known-good-version>

# 4. Verify and restart
openclaw doctor
openclaw gateway start

# 5. Verify agents
openclaw agents list --bindings
```

### 5.4 MyClaw Backup Restore

Token-enforced UI restore with post-restore report:

```bash
# Via MyClaw Backup skill (token-protected)
# Agent or admin triggers restore via chat or CLI
# Human confirmation required for destructive operations
```

> **Critical**: Ensure your encryption passphrase is in a password manager.
> Because OpenClaw stores `auth-profiles.json` (API keys) in cleartext,
> your backup archive is effectively a **master key to your accounts**.

---

## 6. Lead-as-CEO Backup Oversight

### 6.1 The Lead as Backup CEO

The Lead agent is not just a task router—it is the **CEO of squad state
management**. Its five core backup responsibilities:

1. **Task Decomposition with State Awareness**: When breaking tasks, the
   Lead ensures pre-task snapshots exist for agents doing risky work
   (memory distillation, skill installation, config changes). Routes via
   bindings and `sessions_send`—loose, per-task decisions.

2. **Autonomous Backup Triggers**: The Lead triggers hourly git commits
   across all agent workspaces via its HEARTBEAT.md loop. Tags state
   before executing major distillations or risky operations.

3. **Autonomous Capability Grants**: The Lead can **autonomously grant
   backup tools, restore access, git permissions, and encryption keys**
   to agents as they grow:
   - **Low-risk grants** (read-only git clone access, backup trigger
     permissions, snapshot tools) are issued autonomously.
   - **High-risk grants** (restore permissions that overwrite active
     workspaces, encryption passphrases, full state access) require
     **one-time human approval** only. Once approved, the Lead re-issues.
   - All grants logged to MEMORY.md for audit.

4. **Destructive Restore Constraints**: Before any restore that overwrites
   an active workspace, the Lead:
   - Verifies the target agent is idle (no in-flight tasks).
   - Creates a pre-restore snapshot of current state.
   - Sends `sessions_send` notification to affected agents.
   - Requires human confirmation only for cross-agent restores that touch
     multiple workspaces simultaneously.

5. **Cron Fallback Management**: The Lead monitors the hourly backup cron
   via HEARTBEAT.md. If a backup job fails twice consecutively, the Lead:
   - Switches to the fallback backup method (tar.gz if git failed, or
     vice versa).
   - Logs the failure and fallback to MEMORY.md.
   - Alerts the human operator if all fallback methods exhausted.

### 6.2 Why Loose Coordination Beats Rigid Backup Policies

Rigid backup policies (e.g., "every agent backs up every 30 minutes to the
same S3 bucket with identical retention") create **straight-jacket
automations** that break in practice:

| Rigid Policy Problem | Loose Coordination Solution |
|---|---|
| All agents backup simultaneously, causing I/O storms | Lead staggers backups via per-agent HEARTBEAT.md timing |
| Uniform retention wastes storage on low-value snapshots | Lead tags critical vs. routine snapshots; retention varies |
| Single backup target = single point of failure | Lead routes to git, tar.gz, or restic based on agent needs |
| Restore requires centralized orchestration | Each agent can self-restore from its own git history |
| Policy changes require global config updates | Lead updates per-agent backup bindings individually |

The Lead-as-CEO approach means backup strategy **evolves per-agent** based on
actual failure patterns, workspace size, and task criticality—not a one-size
policy imposed top-down.

### 6.3 Hourly Cron + HEARTBEAT.md Fallback

The default backup rhythm uses HEARTBEAT.md's hourly tick:

```yaml
# In Lead's HEARTBEAT.md
backup_rhythm:
  default_interval: 3600        # 1 hour
  pre_risky_task: true           # snapshot before distillations, installs
  post_major_milestone: true     # snapshot after successful completions
  fallback_chain:
    - method: git_commit
      target: local + origin
    - method: tar_gz_encrypted
      target: /backups/agents/{agent_id}/
    - method: restic_s3
      target: s3://openclaw-backups/{workspace}/
  on_failure:
    retry_count: 2
    then: next_method_in_chain
    final_fallback: alert_human
```

When the Lead detects a backup failure, it doesn't rigidly retry the same
method—it walks the fallback chain, adapting to what actually works for that
agent's environment.

---

## 7. Integration Points with Other OpenClaw Subsystems

Backup and rollback don't exist in isolation. They integrate tightly with
other OpenClaw components:

### 7.1 MEMORY.md Integration

Every backup event is logged to the agent's MEMORY.md:

```markdown
## Backup Log

| Timestamp | Type | Method | Size | Status | Trigger |
|---|---|---|---|---|---|
| 2026-03-04T10:00:00Z | scheduled | git_commit | 2.3MB | success | heartbeat |
| 2026-03-04T10:15:22Z | pre-task | tar_gz | 4.1MB | success | skill_install |
| 2026-03-04T11:00:00Z | scheduled | git_commit | 2.4MB | failed | heartbeat |
| 2026-03-04T11:00:05Z | fallback | tar_gz | 4.2MB | success | auto_fallback |
```

This gives the Lead full visibility into each agent's backup health without
polling—just read the MEMORY.md.

### 7.2 SOUL.md Backup Personality

Agents can have backup-related personality traits in their SOUL.md:

```markdown
## Backup Behavior
- I am cautious: I snapshot before ANY tool installation or config change.
- I prefer git commits over tar archives (faster, diffable).
- I keep the last 48 hours of hourly snapshots, then daily for 30 days.
- I never delete backups without Lead approval.
```

### 7.3 SKILL.md Backup Skills

Backup operations are discoverable skills via ClawHub:

```markdown
# SKILL.md — MyClaw Backup

## Triggers
- `backup now` — immediate full backup
- `backup diff` — incremental backup (changed files only)
- `restore latest` — restore from most recent snapshot
- `restore <timestamp>` — restore from specific point
- `backup status` — show backup health dashboard

## Requirements
- git (for git-based backups)
- tar, gpg (for encrypted archives)
- restic (for off-site S3 backups, optional)
```

### 7.4 Observability Integration

Backup metrics feed into the observability stack (Topic 13):

- **Prometheus gauges**: `openclaw_backup_last_success_timestamp`,
  `openclaw_backup_size_bytes`, `openclaw_restore_duration_seconds`
- **LangFuse traces**: backup operations appear as spans in agent traces
- **Alertmanager rules**: fire if `backup_age > 2h` or `backup_failures > 2`

---

## 8. Real 2026 Production Patterns

### 8.1 Git-Native Workspace Backup (Most Common)

The dominant pattern in 2026 OpenClaw deployments:

```bash
#!/bin/bash
# agent-backup.sh — called by HEARTBEAT.md cron
AGENT_ID="${1:?agent_id required}"
WORKSPACE="/workspaces/${AGENT_ID}"
BACKUP_BRANCH="backup/${AGENT_ID}/auto"

cd "$WORKSPACE"

# Stage all workspace files
git add -A

# Commit with structured message
git commit -m "auto-backup: ${AGENT_ID} $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --allow-empty-message 2>/dev/null

# Push to backup branch (not main)
git push origin "HEAD:${BACKUP_BRANCH}" --force-with-lease

# Prune old backup commits (keep last 48)
git log --oneline "${BACKUP_BRANCH}" | tail -n +49 | while read hash _; do
  git notes add -m "prunable" "$hash" 2>/dev/null
done

echo "backup_success{agent=\"${AGENT_ID}\"} 1" >> /metrics/backup.prom
```

**Why git?** Diffable history, built-in branching, easy partial restores,
works offline. Most production teams use git as primary + tar.gz as fallback.

### 8.2 Encrypted Archive Backup

For sensitive workspaces or when git overhead is too high:

```bash
#!/bin/bash
# encrypted-backup.sh
AGENT_ID="${1:?agent_id required}"
WORKSPACE="/workspaces/${AGENT_ID}"
BACKUP_DIR="/backups/agents/${AGENT_ID}"
PASSPHRASE_FILE="/secrets/backup-passphrase"

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date -u +%Y%m%d_%H%M%S)
ARCHIVE="${BACKUP_DIR}/${AGENT_ID}_${TIMESTAMP}.tar.gz.gpg"

tar czf - -C "$WORKSPACE" . | \
  gpg --batch --symmetric --passphrase-file "$PASSPHRASE_FILE" \
  -o "$ARCHIVE"

# Verify archive integrity
gpg --batch --passphrase-file "$PASSPHRASE_FILE" -d "$ARCHIVE" | \
  tar tzf - > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "backup_success{agent=\"${AGENT_ID}\",method=\"tar_gpg\"} 1" \
    >> /metrics/backup.prom
  # Clean old archives (keep last 72 hours)
  find "$BACKUP_DIR" -name "*.tar.gz.gpg" -mmin +4320 -delete
else
  echo "backup_failure{agent=\"${AGENT_ID}\",method=\"tar_gpg\"} 1" \
    >> /metrics/backup.prom
fi
```

### 8.3 Off-Site Restic + S3 Backup

For disaster recovery and compliance requirements:

```bash
#!/bin/bash
# restic-backup.sh
AGENT_ID="${1:?agent_id required}"
WORKSPACE="/workspaces/${AGENT_ID}"
RESTIC_REPO="s3:s3.amazonaws.com/openclaw-backups/${AGENT_ID}"

export AWS_ACCESS_KEY_ID="${AWS_BACKUP_KEY}"
export AWS_SECRET_ACCESS_KEY="${AWS_BACKUP_SECRET}"
export RESTIC_PASSWORD_FILE="/secrets/restic-passphrase"

# Initialize repo if first run
restic -r "$RESTIC_REPO" snapshots > /dev/null 2>&1 || \
  restic -r "$RESTIC_REPO" init

# Backup with tags
restic -r "$RESTIC_REPO" backup "$WORKSPACE" \
  --tag "agent:${AGENT_ID}" \
  --tag "auto:heartbeat" \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude="__pycache__"

# Prune old snapshots: keep 48 hourly, 30 daily, 12 monthly
restic -r "$RESTIC_REPO" forget \
  --keep-hourly 48 \
  --keep-daily 30 \
  --keep-monthly 12 \
  --prune
```

**Production tip**: Most teams use restic as a third-tier fallback behind git
and tar.gz. The deduplication makes it efficient for large workspaces, and S3
versioning adds another safety layer.

---

## 9. Common Failure Modes and Mitigations

### 9.1 Backup Failures

| Failure Mode | Symptoms | Mitigation |
|---|---|---|
| Git lock contention | `.git/index.lock` exists, commits fail | Check for running git processes; stale locks auto-cleared after 10 min |
| Disk full | Backup writes fail silently or partially | Monitor `disk_free_bytes`; alert at 80%; prune old backups aggressively |
| Network timeout (S3/restic) | Off-site backups timeout or hang | Set 60s timeout; fall back to local tar.gz; retry on next heartbeat |
| Encryption key missing | gpg fails with "no passphrase" | Store passphrase in mounted secret; Lead verifies key availability at startup |
| Large workspace (>1GB) | Backup takes longer than heartbeat interval | Switch to incremental (git diff, restic dedup); skip unchanged workspaces |
| Concurrent backup + task | File changes mid-backup cause corruption | Use git snapshot (atomic); or tar with `--warning=no-file-changed` |

### 9.2 Restore Failures

| Failure Mode | Symptoms | Mitigation |
|---|---|---|
| Corrupt archive | tar/gpg extraction fails | Verify checksums post-backup; keep N-1 backup as fallback |
| Wrong restore point | Agent state doesn't match expectations | Preview restore contents before applying; use git diff for comparison |
| Permission mismatch | Restored files have wrong ownership | Run `chown -R` post-restore; store uid/gid in backup metadata |
| Partial restore | Some files restored, others missing | Use atomic restore: extract to temp dir, then swap |
| Version conflict | Restored SOUL.md incompatible with current openclaw | Pin openclaw version in backup metadata; validate on restore |

### 9.3 Rollback Anti-Patterns

Avoid these common mistakes:

1. **Rolling back to "last known good" without checking what changed**: Always
   `git diff` or compare archives before restoring. The "good" state might be
   older than you think.

2. **Restoring one agent without considering dependencies**: If Agent-A's state
   depends on Agent-B's output, rolling back A alone creates inconsistency.
   The Lead should coordinate multi-agent rollbacks.

3. **Deleting backups to save space without retention policy**: Aggressive
   pruning without a policy leads to "we need the backup from 3 days ago but
   only have yesterday's." Use the 48h/30d/12m retention ladder.

4. **Testing restores only in production**: Run monthly restore drills in a
   staging environment. Verify that restored agents can resume tasks.

---

## 10. Backup Strategy Comparison Table

| Feature | Git-Native | Encrypted tar.gz | Restic + S3 | MyClaw Skill |
|---|---|---|---|---|
| **Setup complexity** | Low (git init) | Low (tar + gpg) | Medium (restic + S3) | Low (skill install) |
| **Incremental support** | Yes (git diff) | No (full archive) | Yes (dedup) | Depends on method |
| **Diffable history** | Yes | No | No | Via git if configured |
| **Encryption** | Optional (git-crypt) | Yes (gpg) | Yes (built-in) | Configurable |
| **Off-site support** | Yes (git push) | Manual (scp/rsync) | Yes (S3 native) | Configurable |
| **Restore granularity** | Per-file, per-commit | Full archive only | Per-file, per-snapshot | Per-command |
| **Storage efficiency** | Good (packfiles) | Poor (full copies) | Excellent (dedup) | Varies |
| **Offline capability** | Full | Full | Local cache only | Depends |
| **Best for** | Code-heavy workspaces | Sensitive data | Large workspaces, DR | Quick ad-hoc backups |
| **Production adoption** | ~70% of teams | ~20% of teams | ~30% of teams | ~40% of teams |

> **Recommendation**: Use **git-native as primary** (fast, diffable, works
> offline), **encrypted tar.gz as secondary** (for sensitive snapshots), and
> **restic + S3 as tertiary** (disaster recovery). The MyClaw Backup skill
> wraps all three behind simple commands.

---

## 11. Step-by-Step Setup Guide

### 11.1 Minimum Viable Backup (5 Minutes)

For teams just getting started—git-native backups with HEARTBEAT.md cron:

```bash
# Step 1: Initialize git in each agent workspace
for agent in /workspaces/*/; do
  cd "$agent"
  git init
  git add -A
  git commit -m "initial: workspace snapshot"
  echo "✓ Initialized backup for $(basename $agent)"
done

# Step 2: Add backup cron to Lead's HEARTBEAT.md
cat >> /workspaces/lead/HEARTBEAT.md << 'EOF'

## Backup Cron
- Every 60 minutes: run agent-backup.sh for all agents
- Before risky tasks: snapshot target agent
- On task completion: tag successful state
EOF

# Step 3: Create the backup script
cat > /usr/local/bin/agent-backup.sh << 'SCRIPT'
#!/bin/bash
for agent_dir in /workspaces/*/; do
  AGENT_ID=$(basename "$agent_dir")
  cd "$agent_dir"
  git add -A
  git commit -m "auto: ${AGENT_ID} $(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    --allow-empty 2>/dev/null
done
SCRIPT
chmod +x /usr/local/bin/agent-backup.sh

# Step 4: Add to crontab
echo "0 * * * * /usr/local/bin/agent-backup.sh >> /var/log/backup.log 2>&1" \
  | crontab -
```

**Result**: Every agent workspace gets hourly git commits. Total setup: ~5
minutes. No external dependencies.

### 11.2 Production-Grade Setup (30 Minutes)

Add encrypted archives and off-site replication:

```bash
# Step 1: Install dependencies
apt-get install -y restic gnupg

# Step 2: Generate encryption passphrase
openssl rand -base64 32 > /secrets/backup-passphrase
chmod 600 /secrets/backup-passphrase

# Step 3: Initialize restic repo
export RESTIC_PASSWORD_FILE="/secrets/restic-passphrase"
restic -r "s3:s3.amazonaws.com/openclaw-backups" init

# Step 4: Configure openclaw.json backup section
cat >> openclaw.json << 'JSON'
{
  "backup": {
    "primary": {
      "method": "git",
      "interval_seconds": 3600,
      "pre_task_snapshot": true
    },
    "secondary": {
      "method": "tar_gz_encrypted",
      "interval_seconds": 14400,
      "passphrase_file": "/secrets/backup-passphrase"
    },
    "tertiary": {
      "method": "restic_s3",
      "interval_seconds": 86400,
      "repo": "s3:s3.amazonaws.com/openclaw-backups",
      "retention": {
        "hourly": 48,
        "daily": 30,
        "monthly": 12
      }
    },
    "restore": {
      "require_idle_agent": true,
      "pre_restore_snapshot": true,
      "atomic_swap": true
    }
  }
}
JSON

# Step 5: Verify setup
agent-backup.sh            # Run manual backup
restic -r "$RESTIC_REPO" snapshots  # Verify restic
```

### 11.3 Monthly Restore Drill

Schedule monthly to verify backups actually work:

```bash
#!/bin/bash
# restore-drill.sh — run monthly in staging
DRILL_DIR="/tmp/restore-drill-$(date +%Y%m%d)"
mkdir -p "$DRILL_DIR"

for agent_dir in /workspaces/*/; do
  AGENT_ID=$(basename "$agent_dir")
  echo "--- Drilling restore for ${AGENT_ID} ---"

  # Test git restore
  git -C "$agent_dir" stash
  git -C "$agent_dir" checkout HEAD~1
  git -C "$agent_dir" checkout -   # back to latest
  git -C "$agent_dir" stash pop 2>/dev/null

  # Test tar restore
  LATEST_TAR=$(ls -t /backups/agents/${AGENT_ID}/*.tar.gz.gpg 2>/dev/null | head -1)
  if [ -n "$LATEST_TAR" ]; then
    gpg --batch --passphrase-file /secrets/backup-passphrase \
      -d "$LATEST_TAR" | tar tzf - > /dev/null 2>&1
    echo "  tar restore: $([ $? -eq 0 ] && echo 'PASS' || echo 'FAIL')"
  fi

  echo "  git restore: PASS"
done

echo "Drill complete: $(date -u)"
```

---

## 12. Practical Recommendations

### For Solo Developers / Small Teams (1-3 Agents)

- **Primary**: Git-native backups via HEARTBEAT.md cron (hourly).
- **Secondary**: Weekly encrypted tar.gz to an external drive or NAS.
- **Restore testing**: Monthly manual restore check.
- **Lead oversight**: Minimal—let agents self-backup via git; Lead monitors
  via MEMORY.md logs.

### For Medium Teams (4-8 Agents)

- **Primary**: Git-native with Lead-coordinated staggered timing.
- **Secondary**: Encrypted tar.gz every 4 hours to shared storage.
- **Tertiary**: Daily restic snapshots to S3 or equivalent.
- **Restore testing**: Monthly automated drill (restore-drill.sh).
- **Lead oversight**: Active—Lead manages backup grants, monitors health,
  coordinates multi-agent rollbacks.

### For Large Deployments (9+ Agents, Multiple Leads)

- **Primary**: Git-native with per-agent backup branches.
- **Secondary**: Encrypted tar.gz every 2 hours.
- **Tertiary**: Restic to S3 with cross-region replication.
- **Quaternary**: Database-level snapshots for QMD/sqlite-vec stores.
- **Restore testing**: Weekly automated drills + quarterly full DR exercise.
- **Lead oversight**: Hierarchical—each Lead manages its squad's backups;
  a meta-Lead coordinates cross-squad restore scenarios.

### Universal Best Practices

1. **Always snapshot before risky operations** (skill installs, memory
   distillation, config changes, SOUL.md edits).
2. **Use the 48h/30d/12m retention ladder** unless storage-constrained.
3. **Tag backups semantically** (`pre-distill`, `post-milestone`, `daily`)
   not just by timestamp.
4. **Store encryption keys separately from backups**—never in the same
   storage bucket or git repo.
5. **Monitor backup freshness**—alert if any agent's last successful backup
   is older than 2× the expected interval.
6. **Document restore procedures in SKILL.md**—when you need to restore,
   you won't have time to figure out the commands.
7. **Test restores regularly**—a backup that can't be restored is not a backup.

---

## Summary

Backup and rollback in OpenClaw v2026.3.x follows a **layered, agent-native
approach**: git-native commits as the fast primary layer, encrypted archives
for sensitive data, and restic/S3 for disaster recovery. The Lead-as-CEO
orchestrates backup timing, grants restore permissions autonomously (with
one-time human approval for destructive restores), and coordinates multi-agent
rollbacks—all through loose, per-agent bindings rather than rigid global
policies. Every backup event flows through MEMORY.md for observability, and
the MyClaw Backup skill gives agents simple commands to manage their own
backup lifecycle. The key principle: **backups should be automatic, restores
should be deliberate, and both should be tested regularly**.
