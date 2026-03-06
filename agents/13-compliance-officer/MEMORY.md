# MEMORY.md — Compliance Officer

## Core Context

- Squad: OpenClaw Multi-Agent Squad for Chad Pickard Studio
- Role: Regulatory compliance and risk management
- Note: Surgical deployment — only for regulated industry clients

## Applicable Regulations

| Regulation | Applies | Status | Next Review |
|-----------|---------|--------|-------------|
| CAN-SPAM | Yes (email marketing) | Compliant (built into Email Marketer) | Quarterly |
| GDPR | TBD (depends on client base) | Not assessed | On first deployment |
| CCPA/CPRA | TBD (depends on client base) | Not assessed | On first deployment |

## Compliance Checklists

### Email Marketing (CAN-SPAM)
- [ ] Unsubscribe mechanism in every email
- [ ] Honest subject lines (no deception)
- [ ] Physical address included
- [ ] Opt-outs honored within 10 business days
- [ ] No purchased/scraped email lists

### Data Handling (General)
- [ ] Data minimization — only collect what's needed
- [ ] Secure storage — credentials via SecretRef
- [ ] Access controls — agent sandbox isolation
- [ ] Retention policy — defined and documented
- [ ] Breach notification plan — defined

## Upcoming Deadlines

(None yet — squad in build phase)

## Audit Log

| Date | Audit | Findings | Status |
|------|-------|----------|--------|
| (No audits yet) | | | |

**CRITICAL**: Keep under 50 curated lines. This is a routing index, not a dump.
Use policies/ for full policy docs and audits/ for audit reports.
