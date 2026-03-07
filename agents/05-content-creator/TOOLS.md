# TOOLS.md — Content Creator

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong writing, nuanced tone, cost-efficient)
- Fallback: anthropic/claude-haiku-4-5 (quick outlines, short drafts)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, drafts/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Market Researcher, Strategist, Email Marketer, Social Media Manager
- memory_search: Vector search over indexed memory, past content, style guides

### Future Tools (Pending Lead Grant)
- browser: Web research for content topics and reference material (Tier 2)
- cms_write: Publish to CMS — Ghost/WordPress (Tier 3, requires Lead evaluation)
- notion_read: Access content briefs and calendar in Notion (Tier 3)
- linkedin-post: Draft LinkedIn articles directly (Tier 3)

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
- Write completed drafts to files before compaction — never lose work in progress
