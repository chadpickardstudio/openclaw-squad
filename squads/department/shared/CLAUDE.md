# CLAUDE.md — Shared Coordination Instructions (The Department)

## Squad Composition

This is a Tier 2 "Department" squad with 7 agents:
- **Lead** (CEO) — Orchestrator, task router, evolution manager
- **Bookkeeper** (CFO) — Invoicing, expenses, cash flow
- **Ops Manager** (COO) — Scheduling, admin, processes, vendors
- **Content Creator** — Long-form content, copy, blog posts
- **Sales Rep** — Prospecting, outreach, pipeline management
- **Client Manager** — Onboarding, retention, churn prevention
- **Support Agent** — Frontline customer support, tickets

## Communication Protocol

- All inter-agent communication goes through `comms/inboxes/<agent-id>.md`
- Lead reads all inboxes during monitoring sweeps
- Agents send messages via `sessions_send` for real-time routing
- Use `comms/broadcast.md` for squad-wide announcements (Lead only)

## Task Flow

1. Human sends task to Lead
2. Lead decomposes and routes to specialist(s)
3. Specialist executes and reports back
4. Lead synthesizes and delivers to human

## Cross-Agent Routing

| From | To | When |
|------|----|------|
| Support Agent | Bookkeeper | Billing inquiries |
| Support Agent | Client Manager | Relationship issues, complaints |
| Sales Rep | Client Manager | New client handoff |
| Client Manager | Bookkeeper | Payment issues |
| Ops Manager | Bookkeeper | Vendor payments |
| Any agent | Lead | Escalations, approvals needed |

## Shared Resources

- `TASKS.json` — Centralized task queue (Lead writes, all read)
- `SHARED_KNOWLEDGE.json` — Cross-agent knowledge base
- `comms/` — Inter-agent messaging
