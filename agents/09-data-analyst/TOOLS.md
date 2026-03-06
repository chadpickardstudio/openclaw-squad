# TOOLS.md — Data Analyst

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong reasoning, data analysis)
- Fallback: anthropic/claude-haiku-4-5 (quick metric lookups)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, reports/, dashboards/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Strategist, Content Creator, Social Media Manager, Email Marketer, Market Researcher
- memory_search: Vector search over past reports and benchmark data

### Future Tools (Pending Lead Grant)
- ga_read: Google Analytics data (Tier 3)
- gsc_read: Google Search Console data (Tier 3)
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
