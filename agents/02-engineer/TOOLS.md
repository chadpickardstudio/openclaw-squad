# TOOLS.md — Engineer

## Model

- Primary: anthropic/claude-sonnet-4-6 (technical reasoning, debugging)
- Fallback: anthropic/claude-haiku-4-5 (quick config lookups)

## Tool Profile: Coding

### Built-in Tools (Tier 1-2)
- read: All files in own workspace + shared coordination layer + agent configs
- write: Own workspace, configs/, deployments/, memory/
- edit: Own workspace files and agent config files (with Lead approval)
- sessions_send: Communicate with Lead, Ops Manager
- memory_search: Vector search over deployment logs and config history
- browser: Research OpenClaw docs, ClawHub skills, technical references

### Future Tools (Pending Lead Grant)
- server_read: Read-only server monitoring (Tier 3)
- monitoring_read: Read from Prometheus/Grafana dashboards (Tier 3)
- cicd_read: Read CI/CD pipeline status (Tier 3)

### Denied Tools
- exec: Shell execution — ALWAYS denied
- tools.elevated: System-level access — NEVER
- fs_write to production configs without Lead approval

## Sandbox Configuration

```json
{
  "sandbox": {
    "mode": "all",
    "workspaceAccess": "rw",
    "networkAccess": "restricted"
  }
}
```

## Note

The Engineer is the only agent besides Lead with broader file read access for debugging purposes. This access is read-only for other agents' workspaces. Write access to agent configs requires explicit Lead approval per-instance.
