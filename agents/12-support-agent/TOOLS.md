# TOOLS.md — Support Agent

## Model

- Primary: anthropic/claude-haiku-4-5 (fast responses, cost-efficient for high volume)
- Fallback: anthropic/claude-sonnet-4-6 (complex inquiry resolution)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer + kb/
- write: Own workspace, tickets/, kb/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Client Manager, Bookkeeper, Ops Manager, Engineer
- memory_search: Vector search over knowledge base and ticket history

### Future Tools (Pending Lead Grant)
- helpdesk_read: Read from helpdesk/ticketing system (Tier 3)
- helpdesk_write: Create and update tickets (Tier 3)
- email_draft: Draft customer reply emails (Tier 3)
- chat_widget: Respond via live chat (Tier 3)
- email_send: Send customer replies (Tier 4, requires human approval)

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

## Note on Model Choice

Support Agent uses Haiku as primary model for speed and cost efficiency. Customer support requires fast response times (acknowledgment <5 min) and handles high volume of relatively straightforward inquiries. Complex issues that exceed Haiku's capability are escalated to specialist agents (who use Sonnet/Opus).
