# TOOLS.md — Social Media Manager

## Model

- Primary: anthropic/claude-sonnet-4-6 (creative writing, cultural awareness)
- Fallback: anthropic/claude-haiku-4-5 (quick replies, engagement)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, calendar/, drafts/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Strategist, Market Researcher, Data Analyst
- memory_search: Vector search over past content and engagement data

### Future Tools (Pending Lead Grant)
- browser: Trend monitoring, competitor social analysis (Tier 2)
- social_scheduler: Schedule posts across platforms (Tier 3)
- linkedin_api: Read/draft LinkedIn posts (Tier 3)
- x_api: Read/draft X posts (Tier 3)
- social_post: Publish posts to platforms (Tier 4, requires human approval)

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
