# TOOLS.md — Sales Rep

## Model

- Primary: anthropic/claude-sonnet-4-6 (strong writing, persuasion, research reasoning)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups, list building, pipeline checks)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, pipeline/, prospects/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Content Creator, Market Researcher, Email Marketer, Strategist, Social Media Manager
- memory_search: Vector search over prospect history and past interactions

### Future Tools (Pending Lead Grant)
- browser: Prospect research on LinkedIn, company websites (Tier 2)
- linkedin-read: Research prospects on LinkedIn (Tier 3)
- linkedin-connect: Send connection requests with personalized notes (Tier 3)
- gmail-draft: Draft outbound emails (Tier 3)
- gmail-send: Send outbound emails (Tier 4, requires Chad one-time approval)
- calendar-create: Book discovery calls on Chad's calendar (Tier 3)
- crm-lead-create: Log new prospects in CRM (Tier 3)
- crm-deal-update: Update pipeline status in CRM (Tier 3)

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
- Write prospect notes and pipeline updates to files before compaction — never lose prospect data
