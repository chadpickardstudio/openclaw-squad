# TOOLS.md — Strategist

## Model

- Primary: anthropic/claude-sonnet-4-6 (strategic thinking, planning, brief architecture)
- Fallback: anthropic/claude-haiku-4-5 (quick briefs, status checks)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, strategy/, campaigns/, calendar/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Social Media Manager, Email Marketer, Market Researcher, Data Analyst, Sales Rep
- memory_search: Vector search over strategy docs and campaign history

### Future Tools (Pending Lead Grant)
- analytics_read: Read from analytics dashboards — GA, social metrics (Tier 3)
- project_mgmt: Access project management tools for campaign tracking (Tier 3)
- notion_read: Read strategy docs from Notion (Tier 3)
- browser: Research strategy trends and competitive landscape (Tier 3)

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

## Context & Compaction

- Compaction mode: safeguard
- Reserve token floor: 15,000
- Memory flush enabled (soft threshold: 3,000 tokens)
- Write campaign plans and strategic decisions to files before compaction
