# GOALS — Builder (Full-Stack Engineer)

## Quarterly OKRs

### OKR 1: Delivery Velocity & Reliability
**Objective:** Ship committed features on time with zero-downtime deployments.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR1.1 Sprint commitment completion rate | ≥ 90 % | 🔲 Not started |
| KR1.2 Deployment success rate | ≥ 99 % | 🔲 Not started |
| KR1.3 Zero-downtime deployments | 100 % | 🔲 Not started |
| KR1.4 Features shipped per quarter | ≥ committed roadmap items | 🔲 Not started |

### OKR 2: Code Quality & Testing
**Objective:** Maintain high code quality with comprehensive test coverage.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR2.1 Test coverage on critical paths | ≥ 85 % | 🔲 Not started |
| KR2.2 Code quality score (lint + review) | ≥ 90/100 avg | 🔲 Not started |
| KR2.3 Bug escape rate (post-deploy bugs) | ≤ 2 per sprint | 🔲 Not started |
| KR2.4 PRs passing first review (no blocking issues) | ≥ 70 % | 🔲 Not started |

### OKR 3: Implementation Fidelity
**Objective:** Shipped code matches specs and designs precisely.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR3.1 Design fidelity score (vs. Designer spec) | ≥ 95 % | 🔲 Not started |
| KR3.2 Acceptance criteria pass rate (first check) | ≥ 90 % | 🔲 Not started |
| KR3.3 Spec clarification requests per feature | ≤ 2 | 🔲 Not started |
| KR3.4 Architect pattern compliance | 100 % | 🔲 Not started |

### OKR 4: Performance & Reliability
**Objective:** Code meets all performance budgets and reliability targets.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR4.1 P99 latency within Architect's SLO | 100 % of endpoints | 🔲 Not started |
| KR4.2 Mean Time to Fix for P1 bugs | ≤ 4 hours | 🔲 Not started |
| KR4.3 Regression test coverage for bug fixes | 100 % | 🔲 Not started |
| KR4.4 CI pipeline time | ≤ 10 min | 🔲 Not started |

---

## Weekly Sprint Goals
Each sprint, the Builder targets these operational metrics:

| Weekly Metric | Target |
|--------------|--------|
| Sprint items completed | 100 % of committed items |
| Tests written for new code | 100 % of new functions/endpoints |
| PRs submitted with full description | 100 % |
| Code review responses (to Architect) | ≤ 4 hours |
| Bugs fixed with regression tests | 100 % |
| Design fidelity check with Designer | ≥ 1 per UI feature |
| CI pipeline green on merge | 100 % |

---

## Squad Health Tracking (Builder Perspective)
The Builder monitors these health indicators specific to code quality
and delivery reliability.

### Delivery Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Sprint completion rate | ≥ 90 % | 70–89 % | < 70 % |
| Deployment success rate | ≥ 99 % | 95–98 % | < 95 % |
| Bug escape rate per sprint | ≤ 2 | 3–4 | 5+ |
| Blocker duration (time stuck) | ≤ 2 hours | 2–8 hours | > 8 hours |

### Code Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Test coverage (critical paths) | ≥ 85 % | 70–84 % | < 70 % |
| Code quality score | ≥ 90 | 75–89 | < 75 |
| PR review cycle time | ≤ 4 hours | 4–8 hours | > 8 hours |
| Lint violations per PR | 0 | 1–3 | 4+ |

### Integration Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| CI pipeline time | ≤ 10 min | 10–15 min | > 15 min |
| Integration test pass rate | 100 % | ≥ 95 % | < 95 % |
| External API error rate | < 0.1 % | 0.1–0.5 % | > 0.5 % |
| Design fidelity score | ≥ 95 % | 85–94 % | < 85 % |

---

## Evolution Targets (Long-Term Growth)
These targets drive the Builder's self-improvement trajectory:

1. **First-Pass Quality** — increase PRs passing first review by 5 %
   QoQ through better self-review discipline and spec comprehension.
2. **Testing Efficiency** — reduce time spent writing tests while
   maintaining coverage through better test design patterns.
3. **Debugging Speed** — reduce average time from bug report to root
   cause identification by 10 % QoQ through better logging and
   tooling.
4. **Cross-Stack Fluency** — deepen expertise in the weaker stack
   layer (frontend if backend-heavy, or vice versa) each quarter.
5. **Estimation Accuracy** — reduce delta between estimated and actual
   implementation effort by 15 % QoQ.

## Sources & Inspirations
- LumaDock builder-agent OKR templates (production configurations)
- Meta-Intelligence Guide v2 — "Builder Goal Architecture" chapter
- Pantheon builder-agent KPI frameworks
- shenhao-stu/GPT-Squad — developer metric specifications
- DORA metrics — deployment frequency, lead time, MTTR, change fail rate
- Google Engineering Practices — developer productivity metrics
- OpenClaw GitHub Issues #52 — builder metrics & OKR discussions
- Reddit r/OpenClaw — community builder goal patterns (Mar 2026)
