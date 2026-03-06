# The Department — Tier 2 Squad

**Agents:** 7 (Operator + Bookkeeper + Ops Manager + Support Agent)
**For:** Established small businesses (5-20 employees) needing full operational coverage
**Monthly cost:** Mid tier
**Value prop:** "A whole department, not just a few helpers."

## What It Does

Everything The Operator does, plus full back-office and support:
- **Lead (CEO):** Orchestrates everything
- **Content Creator:** All content production
- **Sales Rep:** Pipeline and outreach
- **Client Manager:** Retention and relationships
- **Bookkeeper (CFO):** Invoicing, expenses, cash flow, payment follow-up
- **Ops Manager (COO):** Scheduling, vendor coordination, process docs, admin
- **Support Agent:** Frontline customer support, ticket handling, FAQ

## Who It's For

- Growing businesses that need operational backbone alongside marketing/sales
- Businesses with enough clients to need dedicated support
- Companies drowning in admin, scheduling, and invoicing
- Gyms, professional services, agencies with client-facing operations

## Deployment

1. Copy `openclaw.json5` to `~/.openclaw/openclaw.json`
2. Copy agent workspace files from `agents/` for all 7 agents
3. Copy `shared/` contents to `~/.openclaw/workspace-shared/`
4. Customize `USER.md` in Lead's workspace for the client
5. Run `openclaw gateway` to start

## Upgrade Path

- **→ The Marketing Machine:** Replace back-office agents with marketing specialists
- **→ The Firm:** Add all remaining agents for full coverage
