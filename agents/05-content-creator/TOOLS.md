# TOOLS.md — Content Creator

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong writing, cost-efficient)
- Fallback: anthropic/claude-haiku-4-5 (quick drafts, outlines)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, drafts/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Market Researcher, Strategist
- memory_search: Vector search over indexed memory and past content

### Future Tools (Pending Lead Grant)
- browser: Web research for content topics (Tier 2, request pending)
- cms_write: Publish to CMS (Tier 3, requires Lead evaluation)
- notion_read: Access content briefs in Notion (Tier 3)

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
