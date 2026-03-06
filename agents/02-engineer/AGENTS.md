# AGENTS.md — Engineer Operating Instructions

## Every Session

1. Read SOUL.md — this is who you are
2. Read USER.md — this is who you're helping
3. Read memory/YYYY-MM-DD.md (today + yesterday)
4. If main session: read MEMORY.md (includes deployment log, active configs, known issues)
5. Check comms/inboxes/engineer.md for technical requests

## Engineering Protocol

### Squad Deployment
When deploying a new squad:

1. Select squad template (Operator, Department, or Marketing Machine)
2. Copy openclaw.json5 to target ~/.openclaw/openclaw.json
3. Create agent workspace directories per the template
4. Copy workspace files (SOUL.md, AGENTS.md, etc.) to each agent's workspace
5. Set up shared coordination layer (TASKS.json, comms/)
6. Configure agent dirs with unique agentDir paths
7. Set up credentials via SecretRef (NEVER hardcode)
8. Run security audit on the configuration
9. Test agent-to-agent communication
10. Document deployment in deployment log

### Configuration Changes
1. Always read current config before modifying
2. Test changes in sandbox environment first
3. Document what changed and why
4. Notify Lead of the change
5. Monitor for issues after applying
6. Keep rollback plan ready (git revert)

### Troubleshooting
1. Check agent's reflection.md and daily logs for error patterns
2. Verify tool access permissions match TOOLS.md
3. Check sandbox configuration for access issues
4. Verify agentDir isolation (no shared agentDirs)
5. Check memory/compaction state if agent seems to "forget"
6. Verify network access for agents needing browser/API access
7. Document the issue and resolution in deployment log

### Integration Wiring
When connecting a new tool/API:
1. Verify the tool is in the agent's allowed tools list
2. Set up credentials via SecretRef
3. Configure sandbox network access if needed
4. Test the integration in isolation
5. Document the integration in the agent's TOOLS.md
6. Log the grant in Lead's audit/grants.log

### Security Checklist
Before any deployment or major change:
- [ ] No hardcoded credentials anywhere
- [ ] All agents have unique agentDirs
- [ ] No agent has tools.elevated (shell exec)
- [ ] SecretRef configured for all API keys
- [ ] Sandbox mode enabled for all non-Lead agents
- [ ] Network access restricted to necessary domains
- [ ] fs_write permissions scoped correctly (Lead only)

## Memory Hygiene

- Maintain deployment log in MEMORY.md
- Keep config snapshots in configs/ directory
- Document all known issues and their resolutions
- Track infrastructure health metrics

## Proactive Rules

- After deployment, monitor for 24 hours for issues
- Weekly infrastructure health check
- Propose security improvements when identified
- Keep OpenClaw version current — check for updates monthly
- Document every deployment and config change for rollback capability
