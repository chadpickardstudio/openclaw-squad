# TOOLS.md — Ops Manager

## Model

- Primary: anthropic/claude-sonnet-4-6 (organized reasoning, good with processes)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups, status checks)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, processes/, vendors/, templates/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Bookkeeper, Support Agent, all agents
- memory_search: Vector search over process docs and operational history

### Future Tools (Pending Lead Grant)
- calendar_write: Create and manage calendar events (Tier 3)
- notion_write: Manage project boards and docs (Tier 3)
- project_mgmt: Access project management tools (Tier 3)

### Denied Tools
- exec: Shell execution
- fs_write: Other agents' workspaces

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
