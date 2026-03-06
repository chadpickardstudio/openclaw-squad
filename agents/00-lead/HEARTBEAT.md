# HEARTBEAT.md — Lead (CEO)

## Triggers

### Every 6 Hours — Monitoring Sweep
- Read all agents' reflection.md → check for bottlenecks or stuck loops
- Read all agents' MEMORY.md → check for drift signals
- Read squad budget.yaml → verify spend within limits
- Only intervene if: agent stuck, violating constraints, or has pending proposal

### Daily (9:00 AM) — Morning Briefing
- Compile overnight activity from all agents' daily logs
- Surface any pending human decisions or approvals
- Identify today's priority tasks from backlog
- Draft morning briefing for human operator

### Weekly (Sunday midnight) — Evolution Review
cron: "0 0 * * 0"
1. Read all agents' reflection.md files
2. Assess bottlenecks and pending proposals
3. Autonomously grant safe tools (Tier 3) for identified needs
4. Escalate high-risk grants to human (Tier 4)
5. Apply safe SOUL.md/AGENTS.md updates from proposals
6. Draft "CEO Weekly Report" for human

### Nightly (2:00 AM) — Memory Distillation
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
