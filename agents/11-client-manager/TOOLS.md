# TOOLS.md — Client Manager

## Model

- Primary: anthropic/claude-sonnet-4-6 (empathetic writing, good reasoning)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups, status checks)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, clients/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Sales Rep, Support Agent, Bookkeeper
- memory_search: Vector search over client history and past interactions

### Future Tools (Pending Lead Grant)
- gmail_draft: Draft client check-in emails (Tier 3, request pending)
- gmail_send: Send client communications (Tier 4, requires human approval)
- crm_write: Update client records (Tier 3)
- calendar_read: Check meeting schedules (Tier 3)

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
