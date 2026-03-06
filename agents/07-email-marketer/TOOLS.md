# TOOLS.md — Email Marketer

## Model

- Primary: anthropic/claude-sonnet-4-6 (strategic copy, A/B analysis)
- Fallback: anthropic/claude-haiku-4-5 (quick metric checks)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, sequences/, drafts/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Sales Rep, Client Manager, Data Analyst, Strategist
- memory_search: Vector search over sequence templates and performance data

### Future Tools (Pending Lead Grant)
- esp_read: Read from email service provider (Mailchimp, ConvertKit, etc.) (Tier 3)
- esp_draft: Create draft campaigns in ESP (Tier 3)
- esp_send: Send/schedule email campaigns (Tier 4, requires human approval)
- analytics_read: Read email analytics dashboards (Tier 3)

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
