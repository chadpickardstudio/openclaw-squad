# 27 - Team Communication Strategy

## Summary

Communication plan between Chad and Paul to keep both founders aligned as IntegrateAI moves toward launch.

## Phase 1: Now (Async Updates)

### Notion Activity Log
- **Where**: IntegrateAI HQ workspace > Activity Log database
- **What**: Structured entries with date, person, action, status, and tags
- **Notifications**: Both founders subscribe to the database so Notion pushes alerts on new entries
- **Use for**: Decisions made, tasks completed, blockers, questions for the other person

### GitHub Activity Log
- **Where**: `/ACTIVITY-LOG.md` in the openclaw-squad repo
- **What**: Markdown changelog mirroring Notion for devs who live in the repo
- **Use for**: Same as Notion, but accessible without leaving the codebase

### GitHub Notifications
- **Already active**: Both have access to the repo
- **Use for**: PR reviews, issue discussions, code-level decisions

## Phase 2: Pre-Launch (Real-Time Chat)

### Discord Server
- **When**: Set up as part of launch checklist (already planned)
- **Channels to create**:
  - `#founder-chat` - Private channel for Chad + Paul
  - `#activity-feed` - Webhook-connected to GitHub for automatic updates
  - `#decisions` - Important decisions that need agreement from both
  - `#general` - Day-to-day coordination
- **Webhooks**: Connect GitHub repo events to `#activity-feed` so pushes, PRs, and issues auto-post

## Phase 3: Post-Launch (Scale Communication)

### Automated Digests
- Weekly summary of all activity (can be generated from ACTIVITY-LOG.md)
- Agent performance reports from the squad system
- Revenue/metrics dashboard updates

## Rules of Engagement

1. **Response time**: Check the log at least once per work session
2. **Decisions**: Tag the other person and wait for acknowledgment before proceeding on anything that affects budget, public-facing content, or architecture
3. **Blockers**: Flag immediately - don't wait for the next check-in
4. **Updates**: No update is too small. "Started working on X" is useful context

## Notion Activity Log Database Schema

| Property | Type | Purpose |
|----------|------|---------|
| Title | Title | Brief description of the activity |
| Date | Date | When it happened |
| Person | Select (Chad/Paul) | Who did it |
| Type | Select | Update / Decision / Blocker / Question |
| Status | Select | Done / In Progress / Needs Response |
| Notify | Select (Chad/Paul/Both) | Who needs to see this |
| Details | Rich text | Full context and notes |
| Related | URL | Link to PR, Notion page, or doc |
