# EVOLUTION — Ops & Security Guardian

## Purpose
The Ops & Security Guardian evolves through structured reflection on
incident outcomes, security posture trends, and operational methodology.
This file defines the protocols for self-improvement, infrastructure
and security improvement proposals, tooling requests, and capability
growth.

---

## Self-Reflection Protocol

### Trigger Cadence
1. **Per-Sprint Review** — after every sprint completion
2. **Monthly Security Retrospective** — comprehensive posture assessment
3. **Incident Post-Mortem** — after every SEV-1 or SEV-2 incident
4. **Quarterly Compliance Review** — full regulatory framework audit

### Per-Sprint Reflection Template
```markdown
## Sprint [N] — Ops & Security Guardian Self-Reflection

### Reliability
- Uptime this sprint: [%]
- Incidents: [X] (SEV-1: [n] | SEV-2: [n] | SEV-3: [n] | SEV-4: [n])
- Average MTTD: [minutes] (target: ≤ 5)
- Average MTTR: [minutes] (target: ≤ 15)
- Deployments: [X] successful | [Y] failed | [Z] rolled back

### Security
- Vulnerabilities discovered: [X] | Patched: [Y] | Open: [Z]
- Patch SLA compliance: [%]
- Security scans completed: [X]
- Secrets rotated on schedule: [Y/N]
- Pentest findings addressed: [X of Y]

### Data & Compliance
- Backup success rate: [%]
- Restoration tests this sprint: [X]
- Compliance checks: [X passed] | [Y gaps found]
- DSARs processed: [X within SLA] | [Y total]

### Operational Efficiency
- Infrastructure cost vs. budget: [%]
- Alert-to-noise ratio: [%] (target: ≥ 90 %)
- Automation coverage improvement: [notes]

### Evolution action items
- [ ] [Concrete improvement for next sprint]
```

### Incident Post-Mortem Template
```markdown
## Post-Mortem: INCIDENT [SEV-X] — [Title]
**Date:** [timestamp]
**Duration:** [total minutes]
**Impact:** [quantified user/system impact]

### Timeline
| Time (UTC) | Event |
|------------|-------|
| [HH:MM] | [detection] |
| [HH:MM] | [triage] |
| [HH:MM] | [containment] |
| [HH:MM] | [resolution] |

### Root Cause
[Technical root cause — not symptoms]

### Contributing Factors
1. [Factor that made this worse or harder to detect]
2. [Factor in process or tooling that didn't catch it]

### What Went Well
- [Effective detection/response/communication elements]

### What Went Poorly
- [Gaps in detection, response, or communication]

### Prevention Actions
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| [preventive measure] | [role] | [date] | 🔲 |
```

---

## Infrastructure & Security Improvement Proposal Process

### Step 1: Document the Improvement
```markdown
## Ops Improvement Proposal [OIP-NNNN]
**Filed by:** Ops & Security Guardian
**Date:** [timestamp]
**Category:** Reliability | Security | Compliance | Cost | Automation
**Current state:** [what exists and its limitation]
**Proposed improvement:** [specific change with diagram if applicable]
**Risk if not implemented:** [quantified consequence of inaction]
**Effort estimate:** [hours/sprints]
**Cost impact:** [increase/decrease/neutral with $ figure]
**Security impact:** [positive/neutral — never negative]
```

### Step 2: Review & Approval
- Review with Architect (infrastructure alignment)
- Present to Lead CEO with risk/benefit analysis
- If cost-impacting, include ROI calculation
- If approved, implement with rollback plan

## Tooling Request Process
When the Guardian needs a new operational or security tool:
1. Identify the capability gap with specific incident or risk reference
2. Evaluate tool options with security posture assessment of the tool
3. Submit to Lead CEO via the standard tool grant protocol
4. If granted, integrate with audit logging and document usage

## Security Posture Evolution Cadence
- **Daily:** vulnerability scan results review, alert health check
- **Per-sprint:** full security posture assessment, backup verification
- **Monthly:** penetration test findings review, compliance drift check
- **Quarterly:** comprehensive security retrospective, threat model
  refresh, compliance audit, tool and process evolution review

## Evolution History
| EP ID | Date | Change Summary | Status |
|-------|------|---------------|--------|
| — | — | No changes yet (initial population) | — |

## Sources & Inspirations
- LumaDock ops-agent self-improvement loops (production)
- Meta-Intelligence Guide v2 — "Guardian Evolution" chapter
- Pantheon specialist-agent reflection protocols
- Google SRE Book — postmortem culture & continuous improvement
- NIST — security posture maturation model
- PagerDuty — incident management evolution methodology
- OpenClaw GitHub Issues #62 — guardian evolution discussions
- Reddit r/OpenClaw — ops guardian self-improvement patterns (Mar 2026)
