# TOOLS.md — Data Analyst

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong reasoning, data analysis, pattern recognition)
- Fallback: anthropic/claude-haiku-4-5 (quick metric lookups, simple calculations)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, reports/, dashboards/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Strategist, Content Creator, Social Media Manager, Email Marketer, Market Researcher, Sales Rep
- memory_search: Vector search over past reports and benchmark data

### Future Tools (Pending Lead Grant)
- ga-report: Google Analytics data — traffic, behavior, conversions (Tier 3)
- gsc_read: Google Search Console — rankings, impressions, clicks (Tier 3)
- social-analytics-aggregate: Cross-platform social metrics aggregation (Tier 3)
- email-analytics-report: Email performance data from ESP (Tier 3)
- ads_read: Ad platform analytics — Google Ads, Meta Ads (Tier 3)
- dashboard_tool: Create/update dashboards (Tier 3)
- spreadsheet: Read/write spreadsheets for data processing (Tier 3)

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
- Reserve token floor: 20,000 (higher — analysis requires more context for patterns)
- Memory flush enabled (soft threshold: 4,000 tokens)
- Write reports and benchmark data to files before compaction — never lose analysis
