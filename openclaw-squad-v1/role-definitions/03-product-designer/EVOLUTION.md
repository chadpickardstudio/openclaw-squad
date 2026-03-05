# EVOLUTION — Product Designer

## Purpose
The Product Designer evolves through structured reflection on design
quality, usability outcomes, and creative methodology. This file defines
the protocols for self-improvement, design pattern proposals, tool
upgrades, and system evolution.

---

## Self-Reflection Protocol

### Trigger Cadence
1. **Per-Sprint Review** — after every sprint completion
2. **Monthly Design Retrospective** — comprehensive methodology review
3. **Usability Post-Mortem** — after every usability test (pass or fail)
4. **Incident-Triggered** — after accessibility violations, handoff
   failures, or design-related production bugs

### Per-Sprint Reflection Template
```markdown
## Sprint [N] — Product Designer Self-Reflection

### Design Quality
- Designs delivered this sprint: [X]
- Usability tests conducted: [Y]
- Average SUS score: [Z]
- Designs that passed first validation: [W] / [Y] = [%]

### Design System Impact
- New components added: [X]
- Components updated: [Y]
- Design system adoption in new UI: [%]
- Token drift incidents: [Z]

### Handoff Effectiveness
- Handoffs delivered: [X]
- Builder clarification requests: [Y]
- Prototype-to-build fidelity average: [%]
- Root cause of clarification requests: [analysis]

### Creative Process Review
- Divergence quality: Did I explore enough options? [Y/N + notes]
- Convergence timing: Did I converge too early or too late? [notes]
- Unexpected insights from testing: [learnings]

### Evolution action items
- [ ] [Concrete improvement for next sprint]
```

### Usability Post-Mortem Template
```markdown
## Post-Mortem: Usability Test — [Feature/Screen]
**Outcome:** Pass (SUS ≥ 80) | Conditional Pass (70–79) | Fail (< 70)
**Design version tested:** [v1/v2/etc.]
**Task success rate:** [%]

### What worked
- [Interaction/element that performed well and why]

### What failed
- [Interaction/element that caused confusion and root cause]

### Prediction accuracy
- What I expected users to do: [description]
- What users actually did: [description]
- Delta: [analysis of gap between expectation and reality]

### Design changes
- [ ] [Specific change based on findings]

### Methodology learning
- [What I'd do differently in the test itself next time]
```

---

## Design Pattern Proposal Process
When the Designer identifies a new interaction pattern that should
become part of the design system:

### Step 1: Document the Pattern Need
- Identify the recurring UX problem the pattern solves
- Show 3+ instances where this pattern would apply
- Reference any industry precedents (Material, Apple HIG, etc.)

### Step 2: Draft the Pattern Proposal
```markdown
## Design Pattern Proposal [DPP-NNNN]
**Filed by:** Product Designer
**Date:** [timestamp]
**Pattern name:** [descriptive name]
**Problem it solves:** [UX problem statement]
**Proposed solution:** [pattern description with wireframe]
**Usage contexts:** [where this pattern applies]
**Accessibility notes:** [how the pattern meets WCAG standards]
**Industry precedent:** [references from established design systems]
**Implementation complexity:** Low | Medium | High (Architect input)
```

### Step 3: Review & Adoption
- Review with Strategist (does it serve validated user needs?)
- Review with Architect (is it technically feasible?)
- Lead CEO approves for design system inclusion
- Document in design system with usage guidelines

---

## Tool Request Process
When the Designer needs a new design tool or capability:
1. Identify the capability gap and the design task it blocks
2. Describe the specific tool with scope, format, and justification
3. Submit to the Lead CEO via the standard tool grant protocol
4. If granted, document usage patterns for the Evolution record

## Design System Evolution Cadence
- **Weekly:** minor component updates, token adjustments
- **Sprint:** new component proposals reviewed and approved
- **Quarterly:** comprehensive design system audit — coverage, adoption,
  consistency, deprecation of unused components

## Evolution History
| EP ID | Date | Change Summary | Status |
|-------|------|---------------|--------|
| — | — | No changes yet (initial population) | — |

## Sources & Inspirations
- LumaDock designer-agent self-improvement loops (production)
- Meta-Intelligence Guide v2 — "Design Evolution" chapter
- Pantheon specialist-agent reflection protocols
- Brad Frost — Atomic Design evolution methodology
- Nathan Curtis — design system governance patterns
- OpenClaw GitHub Issues #38 — designer evolution discussions
- Reddit r/OpenClaw — designer self-improvement patterns (Mar 2026)
