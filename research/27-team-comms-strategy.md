# 27 - Team Communication Strategy

## Summary

Communication plan between Chad and Paul to keep both founders aligned as IntegrateAI moves toward launch. Discord is the primary hub (free, unlimited members). Notion stays as a solo workspace for content/ops, not for shared comms.

> **Note**: Notion free plan only supports 1 member. Using Discord instead for all shared communication.

## Phase 1: Now (Discord + GitHub)

### Discord Server (Primary Comms Hub)
- **Cost**: Free (unlimited members, channels, and integrations)
- **Server name**: IntegrateAI HQ
- **Channels**:
  - `#general` - Day-to-day coordination
  - `#founder-chat` - Private channel for Chad + Paul (important decisions)
  - `#activity-feed` - Webhook-connected to GitHub for automatic updates on pushes, PRs, issues
  - `#decisions` - Important decisions that need agreement from both founders
  - `#blockers` - Flag issues immediately so the other person sees them
  - `#ideas` - Low-pressure space for brainstorming
- **Webhooks**: Connect GitHub repo to `#activity-feed` so all code activity auto-posts
- **Notifications**: Both founders enable notifications for `#founder-chat`, `#decisions`, and `#blockers`

### GitHub Activity Log
- **Where**: `/ACTIVITY-LOG.md` in the openclaw-squad repo
- **What**: Structured changelog for major milestones and decisions
- **Use for**: Permanent record of what was done and when (Discord messages scroll away, this doesn't)

### GitHub Notifications
- **Already active**: Both have access to the repo
- **Use for**: PR reviews, issue discussions, code-level decisions

## Phase 2: Post-Launch (Scale Communication)

### Discord Additions
- `#customer-feedback` - Relay customer insights
- `#metrics` - Bot-posted weekly metrics summaries
- `#agent-status` - Agent squad performance updates

### Automated Digests
- Weekly summary of all activity (can be generated from ACTIVITY-LOG.md)
- Agent performance reports from the squad system
- Revenue/metrics dashboard updates

## Rules of Engagement

1. **Response time**: Check Discord at least once per work session
2. **Decisions**: Post in `#decisions` and wait for the other person to react/respond before proceeding on anything that affects budget, public-facing content, or architecture
3. **Blockers**: Post in `#blockers` immediately - don't wait for the next check-in
4. **Updates**: No update is too small. "Started working on X" is useful context
5. **Activity Log**: Update ACTIVITY-LOG.md for major milestones (it's the permanent record)

## Discord Setup Checklist

- [ ] Create Discord server "IntegrateAI HQ"
- [ ] Create channels: `#general`, `#founder-chat`, `#activity-feed`, `#decisions`, `#blockers`, `#ideas`
- [ ] Set `#founder-chat` as private (Chad + Paul only)
- [ ] Add GitHub webhook to `#activity-feed` (Settings > Integrations > Webhooks)
- [ ] Invite Paul
- [ ] Both enable notifications for `#founder-chat`, `#decisions`, `#blockers`
- [ ] Pin the rules of engagement in `#general`
