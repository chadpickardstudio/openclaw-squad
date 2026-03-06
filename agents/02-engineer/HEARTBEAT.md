# HEARTBEAT.md — Engineer

## Triggers

### Daily (6:00 AM) — Infrastructure Check
- Check all agent health (are they responsive?)
- Monitor for error patterns in agent logs
- Verify sandbox and memory systems are healthy
- Flag any issues to Lead

### Weekly (Sunday) — Maintenance Window
- Review agent reflection logs for technical issues
- Check for OpenClaw platform updates
- Verify credential expiration dates
- Run security audit on current configuration
- Send infrastructure health report to Lead

### On Demand — Deployment & Troubleshooting
- Deploy new squads when requested by Lead
- Troubleshoot agent issues when escalated
- Wire new integrations when Lead approves tool grants

## HEARTBEAT_OK Discipline

- Don't touch configs that are working — if it ain't broke, don't fix it
- Batch non-urgent maintenance into weekly windows
- Only alert for genuine infrastructure issues
