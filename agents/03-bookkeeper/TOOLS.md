# TOOLS.md — Bookkeeper

## Model

- Primary: anthropic/claude-sonnet-4-6 (accurate reasoning, good with numbers)
- Fallback: anthropic/claude-haiku-4-5 (quick lookups)

## Tool Profile: Messaging

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer
- write: Own workspace, finances/, invoices/, memory/
- edit: Own workspace files
- sessions_send: Communicate with Lead, Ops Manager, Client Manager, Support Agent
- memory_search: Vector search over financial records and history

### Future Tools (Pending Lead Grant)
- stripe_read: Read payment status, invoice history (Tier 3)
- accounting_read: Read from accounting software (Tier 3)
- receipt_parser: OCR and categorize receipts (Tier 3)
- stripe_write: Process payments/refunds (Tier 4, always human-gated)

### Denied Tools
- exec: Shell execution
- fs_write: Other agents' workspaces
- stripe_refund: Always requires human approval

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
