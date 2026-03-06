# The Operator — Tier 1 Squad

**Agents:** 4 (Lead + Content Creator + Sales Rep + Client Manager)
**For:** Solo founders, small businesses just getting started with AI agents
**Monthly cost:** Lowest tier — entry product
**Value prop:** "Your first hire is actually four."

## What It Does

The Operator covers the 80% of what any small business needs on day one:
- **Lead (CEO):** Orchestrates everything, handles email triage, daily briefings
- **Content Creator:** Blog posts, website copy, email copy, case studies
- **Sales Rep:** Prospecting, cold outreach, follow-ups, pipeline management
- **Client Manager:** Onboarding, retention, check-ins, churn prevention

## Who It's For

- Solo founders wearing every hat
- Small businesses (1-5 people) who can't afford to hire
- Businesses that need marketing + sales + retention but have zero team
- Entry point for clients who will upgrade to The Department or Marketing Machine

## What It Doesn't Do

- No financial tracking (add Bookkeeper to upgrade)
- No operational processes (add Ops Manager to upgrade)
- No frontline customer support (add Support Agent to upgrade)
- No social media management (Content Creator handles basics)
- No email marketing automation (Content Creator handles basic emails)
- No analytics/reporting (Lead handles basic summaries)

## Deployment

1. Copy `openclaw.json` to `~/.openclaw/openclaw.json`
2. Copy agent workspace files from `agents/` to `~/.openclaw/workspace-<agentId>/`
3. Copy `shared/` contents to `~/.openclaw/workspace-shared/`
4. Customize `USER.md` in Lead's workspace for the client
5. Run `openclaw gateway` to start

## Upgrade Path

- **→ The Department:** Add Bookkeeper + Ops Manager + Support Agent
- **→ The Marketing Machine:** Add Social Media Manager + Email Marketer + Market Researcher + Data Analyst + Strategist
