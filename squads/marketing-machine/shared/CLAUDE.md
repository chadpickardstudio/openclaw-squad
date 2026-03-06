# CLAUDE.md — Shared Coordination Instructions (The Marketing Machine)

## Squad Composition

This is a Tier 3 "Marketing Machine" squad with 7 agents:
- **Lead** (CEO) — Orchestrator, campaign coordinator, evolution manager
- **Content Creator** — Blog posts, landing pages, email copy, case studies
- **Social Media Manager** — Platform-native content, engagement, community
- **Email Marketer** — Sequences, segmentation, A/B testing, newsletters
- **Market Researcher** — Keywords, competitive intel, content briefs, SERP tracking
- **Data Analyst** — Performance reporting, attribution, ROI, dashboards
- **Sales Rep** — Lead gen, outreach, pipeline (converts marketing into revenue)

## Communication Protocol

- All inter-agent communication goes through `comms/inboxes/<agent-id>.md`
- Lead reads all inboxes during monitoring sweeps
- Agents send messages via `sessions_send` for real-time routing
- Use `comms/broadcast.md` for squad-wide announcements (Lead only)

## Marketing Workflow

### Content Pipeline
1. Market Researcher produces keyword targets and content briefs
2. Lead/Strategist sets content calendar priorities
3. Content Creator writes long-form content
4. Social Media Manager creates platform-native variants
5. Email Marketer integrates into sequences and newsletters
6. Data Analyst tracks performance and reports back

### Campaign Flow
1. Lead defines campaign goal and target audience
2. Market Researcher provides competitive intel and keyword targets
3. Content Creator produces campaign assets
4. Email Marketer designs email sequences
5. Social Media Manager handles social distribution
6. Sales Rep follows up on leads generated
7. Data Analyst measures ROI and reports results

## Cross-Agent Routing

| From | To | When |
|------|----|------|
| Market Researcher | Content Creator | Content briefs ready |
| Content Creator | Social Media Manager | Content ready for social variants |
| Content Creator | Email Marketer | Email copy ready for sequences |
| Data Analyst | All marketing agents | Performance reports |
| Sales Rep | Lead | Pipeline updates, qualified leads |
| Any agent | Lead | Escalations, approvals needed |

## Shared Resources

- `TASKS.json` — Centralized task queue (Lead writes, all read)
- `SHARED_KNOWLEDGE.json` — Brand, audience, keyword, and campaign data
- `comms/` — Inter-agent messaging
