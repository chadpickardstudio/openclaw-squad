# TOOLS.md — Email Marketer

## Model

- Primary: anthropic/claude-sonnet-4-6 (strategic copy, A/B analysis, sequence architecture)
- Fallback: anthropic/claude-haiku-4-5 (quick metric checks, short responses)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, sequences/, drafts/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Sales Rep, Data Analyst, Strategist, Market Researcher
- memory_search: Vector search over sequence templates and performance data

### Future Tools (Pending Lead Grant)
- email-campaign-draft: Create draft campaigns in ESP — Beehiiv/MailerLite (Tier 3)
- email-sequence-create: Build automated sequences in ESP (Tier 3)
- email-list-manage: Manage subscriber lists, segments, tags (Tier 3)
- email-analytics-read: Read open/click/conversion rates from ESP (Tier 3)
- esp_send: Send/schedule email campaigns live (Tier 4, requires Chad approval)

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
- Write sequence maps and test results to files before compaction
