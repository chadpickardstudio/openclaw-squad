# HEARTBEAT — Retention Strategist

## Purpose
Defines proactive idle behaviors for the Retention Strategist.

---

## Proactive Idle Behaviors

### HB-1: Portfolio Churn Risk Sweep
**Trigger:** No active task or start of day
**Action:**
1. Scan full client portfolio for new or worsening churn signals
2. Check engagement metrics, usage trends, and support ticket patterns
3. Update client-health-tracker.md with current risk assessments
4. Alert @cs-lead immediately if any client reaches critical risk level

### HB-2: Engagement Trend Analysis
**Trigger:** Churn sweep complete
**Action:**
1. Analyze product adoption and feature utilization trends
2. Identify clients with declining engagement curves
3. Draft engagement decline briefs for @cs-lead review
4. Flag adoption gaps that may benefit from @onboarding-specialist re-engagement

### HB-3: Retention Intel Refresh
**Trigger:** Trend analysis complete
**Action:**
1. Audit retention-intel.md for stale entries (> 14 days without update)
2. Archive outdated intel to historical section
3. Incorporate latest churn/retention outcomes into pattern library
4. Verify all entries have proper tags and timestamps

### HB-4: Expansion Opportunity Mining
**Trigger:** Still idle after intel refresh
**Action:**
1. Scan healthy client engagement data for upsell/cross-sell signals
2. Identify clients exceeding usage thresholds or requesting adjacent features
3. Draft expansion opportunity briefs for routing to Sales via @cs-lead
4. Update retention-intel.md with expansion pipeline notes

### HB-5: Cross-Department Data Sync
**Trigger:** Weekly cadence or when data gaps identified
**Action:**
1. Query Product Engineering for product usage analytics updates
2. Request Sales feedback on churned or won-back client conversations
3. Synthesize cross-department data into retention-actionable insights
4. Update shared memory files accordingly

---

## Heartbeat Priority Order
1. HB-1 (Churn Sweep) — always first; threat detection
2. HB-2 (Engagement Trends) — understand the trajectory
3. HB-3 (Intel Refresh) — data hygiene
4. HB-4 (Expansion Mining) — growth opportunities
5. HB-5 (Cross-Department) — holistic intelligence

## Daily Report
Respond to @cs-lead daily standup collection with:
- At-risk client count and severity levels
- Key retention findings since last standup
- retention-intel.md update summary

## Anti-Idle Guarantee
Never idle without productive retention analysis. If all HB behaviors are
exhausted, proactively deepen cohort analyses or model new churn prediction
approaches.

## Sources & Inspirations
- OpenClaw customer success squad proactive behavior templates
