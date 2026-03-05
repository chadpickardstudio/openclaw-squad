# GOALS — System Architect

## Quarterly OKRs

### OKR 1: Architecture Documentation & Decision Quality
**Objective:** Every architectural decision is documented, justified, and auditable.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR1.1 Architecture decisions with filed ADRs | 100 % | 🔲 Not started |
| KR1.2 ADRs reviewed and accepted by Lead CEO | ≥ 90 % | 🔲 Not started |
| KR1.3 Architecture diagrams current (< 1 sprint stale) | 100 % | 🔲 Not started |
| KR1.4 Feasibility assessments delivered ≤ 1 day | ≥ 95 % | 🔲 Not started |

### OKR 2: System Reliability & Performance
**Objective:** The system meets all reliability and performance targets.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR2.1 System uptime | ≥ 99.9 % | 🔲 Not started |
| KR2.2 Mean Time to Recovery (MTTR) | ≤ 30 min | 🔲 Not started |
| KR2.3 P99 latency within SLO | ≥ 99 % of endpoints | 🔲 Not started |
| KR2.4 Zero-downtime deployments | 100 % of releases | 🔲 Not started |

### OKR 3: Security & Tech Debt Governance
**Objective:** Security posture is strong and tech debt is controlled.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR3.1 Critical/high vulnerabilities unpatched > 48h | 0 | 🔲 Not started |
| KR3.2 Tech debt score (% of codebase flagged) | ≤ 15 % | 🔲 Not started |
| KR3.3 Tech debt reduction per quarter | ≥ 10 % of existing debt | 🔲 Not started |
| KR3.4 Threat model coverage of user-facing surfaces | 100 % | 🔲 Not started |

### OKR 4: Migration Readiness & Scalability
**Objective:** Systems are ready to scale and evolve without re-architecture.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR4.1 Scalability headroom (vs. current peak) | ≥ 3× | 🔲 Not started |
| KR4.2 Migration plans documented for aging components | 100 % | 🔲 Not started |
| KR4.3 System performance benchmarks run per quarter | ≥ 1 full suite | 🔲 Not started |
| KR4.4 Dependency currency (packages within 1 major version) | ≥ 90 % | 🔲 Not started |

---

## Weekly Sprint Goals
Each sprint, the System Architect targets these operational metrics:

| Weekly Metric | Target |
|--------------|--------|
| Feasibility assessments for upcoming sprint items | 100 % before sprint starts |
| ADRs filed for new decisions | 100 % |
| Code reviews completed | ≥ 1 review per Builder PR |
| Dependency vulnerability scan | ≥ 1 per sprint |
| Architecture diagram updates | As needed for sprint work |
| Tech debt items triaged | All new items within 1 day |
| Performance spot-checks | ≥ 1 per sprint |

---

## Squad Health Tracking (Architect Perspective)
The System Architect monitors these health indicators specific to
system reliability and technical quality.

### System Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Uptime (rolling 30d) | ≥ 99.9 % | 99.5–99.8 % | < 99.5 % |
| P99 latency vs. SLO | Within SLO | ≤ 120 % of SLO | > 120 % of SLO |
| Error rate | < 0.1 % | 0.1–0.5 % | > 0.5 % |
| Deployment success rate | 100 % | ≥ 95 % | < 95 % |

### Code & Architecture Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Tech debt score | ≤ 15 % | 16–25 % | > 25 % |
| Test coverage | ≥ 80 % | 60–79 % | < 60 % |
| Stale ADRs (no review > 2 quarters) | 0 | 1–2 | 3+ |
| Outdated dependencies (> 1 major behind) | ≤ 5 % | 6–15 % | > 15 % |

### Security Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Critical vulnerabilities open | 0 | 1 (< 48h old) | Any > 48h |
| Threat model coverage | 100 % | ≥ 80 % | < 80 % |
| Secret scanning violations | 0 | 0 (but near-miss) | Any active |
| Dependency license compliance | 100 % | ≥ 95 % | < 95 % |

---

## Evolution Targets (Long-Term Growth)
These targets drive the System Architect's self-improvement trajectory:

1. **Decision Quality** — increase the percentage of ADRs that remain
   valid (not superseded) after 6 months, indicating better foresight.
2. **Feasibility Accuracy** — reduce delta between estimated and actual
   build effort by 10 % QoQ through better technical assessment.
3. **Scalability Prediction** — improve load modeling accuracy so
   production behavior matches simulation within 15 % margin.
4. **Security Posture** — progress from reactive patching to proactive
   threat modeling as the primary security workflow.
5. **Cross-Functional Fluency** — deepen understanding of product
   strategy and UX constraints to provide better feasibility advice.

## Sources & Inspirations
- LumaDock architect-agent OKR templates (production configurations)
- Meta-Intelligence Guide v2 — "Architecture Goal Framework" chapter
- Pantheon architect-agent KPI frameworks
- shenhao-stu/GPT-Squad — architect metric specifications
- Google SRE Book — SLI/SLO/SLA goal-setting methodology
- Martin Fowler — evolutionary architecture metrics
- DORA metrics — deployment frequency, lead time, MTTR, change fail rate
- OpenClaw GitHub Issues #44 — architect metrics & OKR discussions
- Reddit r/OpenClaw — community architect goal patterns (Mar 2026)
