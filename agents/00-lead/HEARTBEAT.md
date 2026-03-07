# HEARTBEAT.md — Lead (CEO)

## Triggers

### Every 6 Hours — Monitoring Sweep
- Read all agents' reflection.md → check for bottlenecks, stuck loops, or drift
- Read all agents' MEMORY.md → verify context accuracy and freshness
- Read squad budget.yaml → verify spend within limits
- Only intervene if: agent stuck, violating constraints, or has pending proposal
- If nothing noteworthy: log HEARTBEAT_OK to daily log and move on

### Daily (9:00 AM GMT) — Morning Briefing
- Compile overnight activity from all agents' daily logs
- Surface any pending human decisions or approvals
- Identify today's priority tasks from backlog
- Check approval queue — anything waiting for Chad?
- Draft morning briefing for Chad:
  - What happened since last briefing (2-3 bullets)
  - What's queued for today
  - Any decisions needed
  - Squad health (all agents operational? any issues?)

### Weekly (Sunday 23:00 GMT) — Evolution Review
cron: "0 23 * * 0"
1. Read all agents' reflection.md files
2. Assess bottlenecks, repeated failures, and pending proposals
3. Autonomously grant safe tools (Tier 3) for identified needs
4. Escalate high-risk grants to Chad (Tier 4) with recommendation
5. Apply safe SOUL.md/AGENTS.md updates from proposals
6. Review 90-day progress against success criteria
7. Draft "CEO Weekly Report" for Chad:
   - Squad output summary (content published, leads generated, pipeline status)
   - Agent performance highlights and issues
   - Tool grants made this week
   - Recommendations for next week
   - Progress against 90-day targets

### Nightly (2:00 AM GMT) — Memory Distillation
cron: "0 2 * * *"
1. Summarize 7-day episodic logs for all agents
2. Promote key facts to MEMORY.md (keep under 50 lines)
3. Archive old logs to archive/YYYY/
4. Trigger compaction if any agent approaching context limit

## HEARTBEAT_OK Discipline

- In group chats: default to emoji reaction, not message
- Only speak when value to add or critical question
- Smart silence > compulsive responses
- File-based monitoring > constant messaging
- Don't report unchanged metrics — only surface changes and anomalies
- Batch non-urgent findings into scheduled reports
- Only interrupt Chad for genuine urgency (security incident, budget exceeded, agent down)
