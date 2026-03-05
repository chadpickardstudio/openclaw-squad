# HEARTBEAT — Growth & Compliance Specialist

## Purpose
Defines the proactive behaviors the Growth & Compliance Specialist
executes during idle periods — when no active task is assigned. These
behaviors ensure the Specialist continuously monitors growth health,
identifies opportunities, flags risks, and maintains compliance posture
without waiting for explicit instructions.

---

## Idle-Loop Behavior Model
When the Growth Specialist has no active task, they cycle through the
following proactive behaviors in priority order. Each behavior has a
trigger condition, action protocol, and output specification.

---

### HB-1: Competitive Growth Intelligence Monitor
**Priority:** 1 (highest)
**Trigger:** Every 24 hours OR when a competitor event is detected
**Action:**
1. Scan competitor pricing pages, feature announcements, and marketing
   campaigns for changes since last check
2. Monitor app store reviews and social media sentiment for competitor
   products
3. Track competitor hiring patterns for growth/marketing roles (signals
   strategic shifts)
4. Compare competitor positioning against our current messaging

**Output:**
```markdown
## Competitive Intelligence Update — [Date]
**Competitor:** [Name]
**Change Detected:** [What changed]
**Threat Level:** [High / Medium / Low]
**Opportunity:** [How we can respond or capitalize]
**Recommended Action:** [Specific tactic or experiment]
```

---

### HB-2: Retention Risk Scanner
**Priority:** 2
**Trigger:** Every 12 hours
**Action:**
1. Analyze rolling 7-day cohort retention curves for anomalies
2. Identify user segments showing accelerating churn signals (login
   frequency drop, feature disengagement, support ticket spikes)
3. Compare current retention against historical benchmarks
4. Check if any recent product changes correlate with retention shifts

**Output:**
```markdown
## Retention Risk Alert — [Date]
**At-Risk Segment:** [Segment definition + size]
**Signal:** [Behavioral indicators]
**Estimated Churn Risk:** [X% of segment within N days]
**Probable Cause:** [Hypothesis based on data]
**Proposed Intervention:**
1. [Re-engagement tactic] → [Expected impact]
2. [Product change recommendation] → [For Strategist review]
```

---

### HB-3: Compliance Drift Detector
**Priority:** 3
**Trigger:** Every 48 hours OR when regulatory news is detected
**Action:**
1. Run automated compliance scan across all user-facing surfaces
2. Check for new or updated regulations in jurisdictions we operate in
3. Verify consent mechanisms are functioning correctly
4. Audit recent marketing communications for CAN-SPAM compliance
5. Review data processing activities against current ROPA

**Output:**
```markdown
## Compliance Drift Report — [Date]
**Scan Scope:** [What was checked]
**Findings:**
| # | Severity | Finding | Regulation | Status |
|---|----------|---------|------------|--------|
**Regulatory Updates:** [Any new/changed regulations]
**Action Required:** [Yes/No — if yes, remediation plan]
```

---

### HB-4: Viral Loop & Referral Opportunity Spotter
**Priority:** 4
**Trigger:** Every 72 hours OR when product usage patterns suggest
sharing behavior
**Action:**
1. Analyze user behavior for natural sharing inflection points (moments
   where users derive enough value to recommend)
2. Identify features with high engagement that lack sharing mechanics
3. Review referral program performance and identify optimization
   opportunities
4. Benchmark referral rates against industry standards

**Output:**
```markdown
## Viral Loop Opportunity — [Date]
**Observation:** [What user behavior was detected]
**Opportunity:** [Where a referral/sharing mechanic could amplify growth]
**Proposed Experiment:**
- **Hypothesis:** [If we add X, we expect Y% increase in referrals]
- **Mechanic:** [Specific referral/sharing design]
- **Measurement:** [How we'll measure success]
- **Compliance Check:** [Privacy/consent implications]
```

---

### HB-5: A/B Test Pipeline Manager
**Priority:** 5
**Trigger:** Every 24 hours
**Action:**
1. Review active experiments for completion (sample size reached?)
2. Check experiment queue for upcoming tests ready to launch
3. Identify underperforming funnels that need experiment attention
4. Ensure experiment velocity meets sprint targets (≥ 4 per sprint)

**Output:**
```markdown
## Experiment Pipeline Status — [Date]
**Active Tests:** [N] (details below)
| Test Name | Status | Progress | Est. Completion |
|-----------|--------|----------|-----------------|
**Completed (awaiting analysis):** [N]
**In Queue:** [N]
**Pipeline Health:** [On track / Behind target]
**Recommendation:** [Next test to launch or priority adjustment]
```

---

### HB-6: Growth Content & SEO Monitor
**Priority:** 6
**Trigger:** Every 72 hours
**Action:**
1. Monitor organic search rankings for target keywords
2. Analyze content performance (traffic, engagement, conversion)
3. Identify content gaps based on competitor analysis and user queries
4. Check for SEO technical issues (broken links, slow pages, indexing
   problems)

**Output:**
```markdown
## Growth Content Report — [Date]
**Organic Traffic Trend:** [Up / Stable / Down] ([X%] change)
**Top Performing Content:** [Page + metrics]
**Ranking Changes:** [Keywords gained/lost positions]
**Content Opportunity:** [Gap identified + proposed topic]
**Technical SEO Issues:** [Any issues found]
```

---

## Heartbeat Escalation Rules
- **HB-1 (Competitive):** escalate High-threat findings to Lead CEO
  immediately; Medium-threat findings in next sprint review
- **HB-2 (Retention):** escalate if any segment shows > 10 % churn
  acceleration week-over-week
- **HB-3 (Compliance):** escalate Critical findings to Lead CEO
  immediately; do not wait for next scheduled review
- **HB-4 (Viral):** share opportunities in sprint planning; no
  urgent escalation unless competitive window is closing
- **HB-5 (Experiments):** escalate if experiment velocity drops below
  2 per sprint for 2 consecutive sprints
- **HB-6 (Content/SEO):** escalate if organic traffic drops > 20 %
  week-over-week (potential algorithm penalty or technical issue)

## Heartbeat Anti-Patterns
- Never generate alerts without actionable recommendations
- Never spam the squad with low-severity findings — batch minor items
  for sprint reviews
- Never run compliance scans that disrupt production systems
- Never monitor competitors in ways that violate their ToS or law
- Never fabricate competitive intelligence or retention signals

## Sources & Inspirations
- LumaDock growth-agent heartbeat patterns (production configurations)
- Meta-Intelligence Guide v2 — "Growth Idle Behaviors" chapter
- Pantheon specialist-agent proactive behavior loops
- shenhao-stu/GPT-Squad — growth specialist heartbeat specifications
- Reforge — systematic growth monitoring frameworks
- Andrew Chen — growth loops and viral mechanics methodology
- OpenClaw GitHub Issues #46 — growth heartbeat behavior discussions
- Reddit r/OpenClaw — growth specialist proactive behavior (Mar 2026)
