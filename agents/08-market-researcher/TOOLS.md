# TOOLS.md — Market Researcher

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong reasoning, research synthesis, analytical depth)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups, simple queries)

## Tool Profile: Messaging + Browser

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, research/, briefs/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Strategist, Social Media Manager, Sales Rep, Data Analyst
- memory_search: Vector search over past research and intelligence
- browser: Web research for competitor analysis, keyword research, trend monitoring (restricted to research domains)

### Future Tools (Pending Lead Grant)
- gsc-read: Google Search Console data — rankings, impressions, clicks (Tier 3)
- ga-read: Google Analytics — traffic sources, user behavior (Tier 3)
- ahrefs_read: SEO keyword data, backlink profiles, competitor analysis (Tier 3)
- semrush_read: Competitive analysis, keyword gaps, market positioning (Tier 3)
- firecrawl: Web scraping for competitor content analysis at scale (Tier 3)
- web-search: Enhanced search for market intelligence (Tier 2)

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
- Reserve token floor: 20,000 (higher — research requires more context)
- Memory flush enabled (soft threshold: 4,000 tokens)
- Write research findings and content briefs to files before compaction — never lose research
