# TOOLS.md — Lead (CEO)

## Model

- Primary: anthropic/claude-opus-4-6 (highest capability for strategic decisions and multi-agent coordination)
- Fallback: anthropic/claude-sonnet-4-6

## Tool Profile: Full

### Built-in Tools (Tier 1)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, MEMORY.md, daily logs
- edit: Own workspace files
- sessions_spawn: Create new agent sessions for delegation
- sessions_send: Message agents directly for task routing
- sessions_list: Monitor active agent sessions
- memory_search: Vector search over indexed memory

### Elevated Tools (CEO-Specific)
- fs_read: Read-only access to all agents' reflection.md, MEMORY.md, proposals/
- fs_write: Write access to all agents' skills/ directories and TOOLS.md
- budget-check: Verify squad budget before tool grants
- security-audit: Run security evaluation on requested tools/skills

### Future Tools (to be provisioned)
- gmail-read: Monitor inbound leads and client emails (Tier 3)
- slack-read: Monitor squad internal comms (Tier 3)
- slack-post: Post updates and route tasks (Tier 3)
- calendar-read: Check Chad's availability (Tier 3)

### Denied Tools
- exec: Shell execution — NEVER granted to Lead
- tools.elevated: System-level access — human-only

## File-System Permissions

```yaml
fs_write:
  allowed_paths:
    - "~/.openclaw/agents/*/skills/"
    - "~/.openclaw/agents/*/workspace/TOOLS.md"
    - "~/.openclaw/workspace-shared/TASKS.json"
    - "~/.openclaw/workspace-shared/comms/"

fs_read:
  allowed_paths:
    - "~/.openclaw/agents/*/reflection.md"
    - "~/.openclaw/agents/*/MEMORY.md"
    - "~/.openclaw/agents/*/proposals/"
    - "~/.openclaw/workspace-shared/"
```

## Sandbox Configuration

```json
{
  "sandbox": {
    "mode": "all",
    "workspaceAccess": "rw",
    "networkAccess": "restricted"
  }
}
```

## Context & Compaction

- Context limit: 200k tokens per session (Opus)
- Compaction triggers at 70%
- Memory flush enabled: writes lasting notes before compaction
- Agent-to-agent communication is file-based + sessions_send (not shared state)
- Rate limits: respect per-agent API quotas when monitoring
