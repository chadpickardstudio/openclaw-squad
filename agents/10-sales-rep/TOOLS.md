# TOOLS.md — Sales Rep

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong writing, good reasoning)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups, list building)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, pipeline/, prospects/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Client Manager, Market Researcher
- memory_search: Vector search over prospect history and past interactions

### Future Tools (Pending Lead Grant)
- browser: Prospect research on LinkedIn, company websites (Tier 2)
- gmail_draft: Draft outbound emails (Tier 3, requires Lead evaluation)
- gmail_send: Send outbound emails (Tier 4, requires human one-time approval)
- crm_write: Update CRM records (Tier 3)
- linkedin_read: Research prospects on LinkedIn (Tier 3)

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
