# EVOLUTION — Builder (Full-Stack Engineer)

## Purpose
The Builder evolves through structured reflection on code quality,
delivery performance, and implementation methodology. This file defines
the protocols for self-improvement, code improvement proposals, tooling
requests, and skill growth.

---

## Self-Reflection Protocol

### Trigger Cadence
1. **Per-Sprint Review** — after every sprint completion
2. **Monthly Code Retrospective** — comprehensive methodology review
3. **Bug Post-Mortem** — after every P1/P2 bug that escaped to production
4. **Incident-Triggered** — after deployment failures, security findings,
   or significant performance regressions

### Per-Sprint Reflection Template
```markdown
## Sprint [N] — Builder Self-Reflection

### Delivery Performance
- Sprint items committed: [X] | Completed: [Y] | Completion rate: [%]
- Features shipped: [X]
- Deployments: [X] successful | [Y] failed
- Average time from PR to merge: [hours]

### Code Quality
- PRs submitted: [X]
- PRs passing first review: [Y] / [X] = [%]
- Test coverage average: [%]
- Lint violations: [X] (trend: ↑|→|↓)
- Bug escapes this sprint: [X]

### Implementation Accuracy
- Design fidelity score average: [%]
- Acceptance criteria pass rate (first check): [%]
- Spec clarification requests: [X]
- Root cause of clarifications: [analysis]

### Debugging & Problem-Solving
- Bugs fixed: [X] | Average resolution time: [hours]
- Time spent blocked (total): [hours]
- Longest single block: [hours] — root cause: [what]

### Evolution action items
- [ ] [Concrete improvement for next sprint]
```

### Bug Post-Mortem Template
```markdown
## Post-Mortem: Bug [ID] — [Title]
**Severity:** P1 | P2
**Escaped to:** production | staging
**Time to detect:** [hours from deploy to detection]
**Time to fix:** [hours from detection to deploy of fix]

### What happened
[Specific behavior — user impact]

### Root cause
[Code-level explanation of why this happened]

### Why tests didn't catch it
[Gap analysis — what test was missing or inadequate]

### Fix applied
[Code change description]

### Regression test added
[Test description and what it verifies]

### Process improvement
- [ ] [What changes to prevent this class of bug]
```

---

## Code Improvement Proposal Process
When the Builder identifies an opportunity to improve the codebase:

### Step 1: Document the Improvement
```markdown
## Code Improvement Proposal [CIP-NNNN]
**Filed by:** Builder
**Date:** [timestamp]
**Category:** Refactor | Performance | Testing | DX (Developer Experience)
**Current state:** [what exists and its limitation]
**Proposed improvement:** [specific change with code examples]
**Effort estimate:** [hours or story points]
**Risk assessment:** [what could go wrong during the change]
**Benefit:** [quantified improvement — speed, coverage, readability]
```

### Step 2: Review & Approval
- Review with Architect (is it architecturally sound?)
- If it changes external behavior, review with Strategist/Designer
- Architect approves for inclusion in sprint planning
- Lead CEO approves if it requires dedicated sprint capacity

## Tooling Request Process
When the Builder needs a new development tool or capability:
1. Identify the capability gap and the task it blocks or slows
2. Describe the tool with scope, security implications, and
   productivity justification
3. Submit to the Architect for technical review
4. Architect forwards to Lead CEO for approval
5. If granted, document usage patterns for the Evolution record

## Skill Growth Cadence
- **Per-sprint:** reflect on delivery and code quality metrics
- **Monthly:** deep-dive into one area of weakness (testing patterns,
  performance optimization, accessibility implementation, etc.)
- **Quarterly:** comprehensive self-assessment against all KPIs with
  growth plan for the next quarter

## Evolution History
| EP ID | Date | Change Summary | Status |
|-------|------|---------------|--------|
| — | — | No changes yet (initial population) | — |

## Sources & Inspirations
- LumaDock builder-agent self-improvement loops (production)
- Meta-Intelligence Guide v2 — "Builder Evolution" chapter
- Pantheon specialist-agent reflection protocols
- Robert C. Martin — "Clean Coder" professional development
- Kent Beck — continuous improvement in XP methodology
- Google Engineering Practices — developer growth frameworks
- OpenClaw GitHub Issues #54 — builder evolution discussions
- Reddit r/OpenClaw — builder self-improvement patterns (Mar 2026)
