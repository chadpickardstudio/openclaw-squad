# TOOLS.md — Compliance Officer

## Model

- Primary: anthropic/claude-sonnet-4-6 (regulatory reasoning, policy analysis)
- Fallback: anthropic/claude-haiku-4-5 (quick compliance lookups)

## Tool Profile: Messaging + Browser

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, policies/, audits/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Bookkeeper, Ops Manager, Client Manager, Support Agent
- memory_search: Vector search over regulations, policies, and audit history
- browser: Research regulatory updates, compliance requirements

### Future Tools (Pending Lead Grant)
- regulatory_feed: Subscribe to regulatory change notifications (Tier 3)
- audit_tool: Automated compliance checking (Tier 3)
- document_review: Analyze contracts for compliance clauses (Tier 3)

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
