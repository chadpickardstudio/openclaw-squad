# CLAUDE.md — Shared Coordination Instructions (The Operator)

## Squad Composition

This is a Tier 1 "Operator" squad with 4 agents:
- **Lead** (CEO) — Orchestrator, task router, evolution manager
- **Content Creator** — Long-form content, copy, blog posts
- **Sales Rep** — Prospecting, outreach, pipeline management
- **Client Manager** — Onboarding, retention, churn prevention

## Communication Protocol

- All inter-agent communication goes through `comms/inboxes/<agent-id>.md`
- Lead reads all inboxes during monitoring sweeps
- Agents send messages via `sessions_send` for real-time routing
- Use `comms/broadcast.md` for squad-wide announcements (Lead only)

## Task Flow

1. Human sends task to Lead
2. Lead decomposes and routes to specialist(s)
3. Specialist executes and reports back via inbox or sessions_send
4. Lead synthesizes and delivers to human

## Shared Resources

- `TASKS.json` — Centralized task queue
- `SHARED_KNOWLEDGE.json` — Cross-agent knowledge base
- `comms/` — Inter-agent messaging

## Rules

- Only Lead may write to TASKS.json
- All agents may read shared resources
- Agents write to their own outbox, Lead routes to appropriate inbox
- No agent may access another agent's private workspace
