# GOALS — Ops & Security Guardian

## Quarterly OKRs

### OKR 1: System Reliability
**Objective:** Production systems are available, performant, and recoverable.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR1.1 System uptime (rolling 90d) | ≥ 99.9 % | 🔲 Not started |
| KR1.2 Mean Time to Detect (MTTD) | ≤ 5 min | 🔲 Not started |
| KR1.3 Mean Time to Recovery (MTTR) | ≤ 15 min | 🔲 Not started |
| KR1.4 Zero-downtime deployment rate | 100 % | 🔲 Not started |

### OKR 2: Security Posture
**Objective:** Zero successful attacks; all vulnerabilities patched within SLA.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR2.1 Critical vulnerabilities patched within 24h | 100 % | 🔲 Not started |
| KR2.2 High vulnerabilities patched within 48h | 100 % | 🔲 Not started |
| KR2.3 Security incidents (successful attacks) | 0 | 🔲 Not started |
| KR2.4 Penetration test findings (critical/high) | 0 per quarter | 🔲 Not started |
| KR2.5 Secret rotation compliance | 100 % on schedule | 🔲 Not started |

### OKR 3: Backup & Compliance
**Objective:** Data is protected and all compliance requirements are met.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR3.1 Backup success rate | 100 % | 🔲 Not started |
| KR3.2 Backup restoration tests per quarter | ≥ 3 | 🔲 Not started |
| KR3.3 Compliance audit pass rate (all frameworks) | 100 % | 🔲 Not started |
| KR3.4 GDPR/CCPA data request SLA | 100 % within legal timeframe | 🔲 Not started |

### OKR 4: Observability & Cost Efficiency
**Objective:** Full visibility into systems with optimized spending.
| Key Result | Target | Status |
|-----------|--------|--------|
| KR4.1 Observability coverage (production services) | 100 % | 🔲 Not started |
| KR4.2 Alert-to-noise ratio (actionable alerts) | ≥ 90 % | 🔲 Not started |
| KR4.3 Infrastructure cost vs. budget | ≤ 105 % | 🔲 Not started |
| KR4.4 Cost optimization savings identified per quarter | ≥ 5 % | 🔲 Not started |

---

## Weekly Sprint Goals
Each sprint, the Ops & Security Guardian targets these operational metrics:

| Weekly Metric | Target |
|--------------|--------|
| Vulnerability scans completed | ≥ 1 full scan |
| Backup verification | 100 % of scheduled backups verified |
| Alert review (noise reduction) | ≥ 1 alert audit |
| CI/CD pipeline health check | 100 % green |
| Secret rotation compliance check | All credentials current |
| Cost anomaly review | ≥ 1 per sprint |
| Compliance drift check | All frameworks passing |
| Incident postmortems filed (if any) | 100 % within 24h |

---

## Squad Health Tracking (Guardian Perspective)
The Guardian monitors these health indicators specific to operational
security and infrastructure reliability.

### Reliability Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Uptime (rolling 30d) | ≥ 99.9 % | 99.5–99.8 % | < 99.5 % |
| MTTR | ≤ 15 min | 15–30 min | > 30 min |
| Deployment success rate | ≥ 99 % | 95–98 % | < 95 % |
| CI/CD pipeline availability | ≥ 99.5 % | 98–99.4 % | < 98 % |

### Security Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Open critical vulnerabilities | 0 | 1 (< 24h old) | Any > 24h |
| Open high vulnerabilities | 0 | 1–2 (< 48h old) | Any > 48h |
| Failed login anomalies | Baseline | 2× baseline | 5× baseline |
| Secret age (vs. rotation policy) | All current | 1 approaching | Any overdue |

### Data & Compliance Health
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Backup success rate | 100 % | ≥ 99 % | < 99 % |
| Last restoration test | < 30 days | 30–45 days | > 45 days |
| Compliance score | 100 % | ≥ 95 % | < 95 % |
| Cost vs. budget | ≤ 100 % | 100–105 % | > 105 % |

---

## Evolution Targets (Long-Term Growth)
1. **Detection Speed** — reduce MTTD by 20 % QoQ through better
   anomaly detection and smarter alert correlation.
2. **Automation Coverage** — increase percentage of runbook steps that
   are fully automated, targeting 100 % for common incident types.
3. **Security Posture** — achieve zero pentest critical/high findings
   for 2 consecutive quarters.
4. **Cost Efficiency** — reduce infrastructure cost per unit of traffic
   by 10 % QoQ through optimization and right-sizing.
5. **Cross-Training** — ensure at least one other role can perform
   emergency operational procedures, reducing bus factor.

## Sources & Inspirations
- LumaDock ops-agent OKR templates (production configurations)
- Meta-Intelligence Guide v2 — "Guardian Goal Architecture" chapter
- Pantheon guardian-agent KPI frameworks
- shenhao-stu/GPT-Squad — ops-security metric specifications
- Google SRE Book — SLI/SLO/SLA goal-setting for operations
- NIST Cybersecurity Framework — security posture metrics
- OpenClaw GitHub Issues #60 — guardian metrics & OKR discussions
- Reddit r/OpenClaw — community ops goal patterns (Mar 2026)
