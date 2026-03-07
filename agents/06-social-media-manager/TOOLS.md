# TOOLS.md — Social Media Manager

## Model

- Primary: anthropic/claude-sonnet-4-6 (creative writing, cultural awareness, platform-native tone)
- Fallback: anthropic/claude-haiku-4-5 (quick replies, engagement responses)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, calendar/, drafts/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Strategist, Market Researcher, Data Analyst, Sales Rep
- memory_search: Vector search over past content and engagement data

### Future Tools (Pending Lead Grant)
- browser: Trend monitoring, competitor social analysis (Tier 2)
- social_scheduler: Schedule posts via Buffer/Later (Tier 3)
- linkedin_api: Read/draft LinkedIn posts and analytics (Tier 3)
- x_api: Read/draft tweets and view analytics (Tier 3)
- instagram-post: Create and schedule Instagram content via Meta Business API (Tier 3)
- facebook-post: Create and schedule Facebook content via Meta Business API (Tier 3)
- tiktok-post: Create and schedule TikTok content (Tier 3)
- social_post: Publish posts live to platforms (Tier 4, requires founder approval)
- meta-insights: Read Instagram/Facebook analytics (Tier 3)

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
- Write post drafts and engagement notes to files before compaction
