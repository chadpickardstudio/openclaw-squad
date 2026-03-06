# TOOLS.md — Market Researcher

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong reasoning, research synthesis)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups)

## Tool Profile: Messaging + Browser

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, research/, briefs/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Strategist, Social Media Manager, Sales Rep
- memory_search: Vector search over past research and intelligence
- browser: Web research (limited to research domains)

### Future Tools (Pending Lead Grant)
- ahrefs_read: SEO keyword and backlink data (Tier 3)
- semrush_read: Competitive analysis data (Tier 3)
- gsc_read: Google Search Console data (Tier 3)
- firecrawl: Web scraping for competitor content analysis (Tier 3)

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
