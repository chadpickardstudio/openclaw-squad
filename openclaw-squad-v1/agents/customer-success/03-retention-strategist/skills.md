# SKILLS — Retention Strategist

## Skill Tier Model
Tools organized by the Retention Strategist's churn-prevention responsibilities.

---

## Tier 1 — Always Active (Core Retention Analysis)

### 1.1 Churn Risk Scanner
- **Tool:** `scan_churn_risk(client_id | "portfolio", signals[], threshold)`
- **Why:** Continuous monitoring of churn signals across the client portfolio.

### 1.2 Engagement Analyzer
- **Tool:** `analyze_engagement(client_id, metrics[], timeframe)`
- **Why:** Tracking product adoption and engagement patterns reveals retention risks.

### 1.3 Retention Intel Writer
- **Tool:** `update_shared_intel(file="retention-intel.md", section, content, tags[])`
- **Why:** All retention findings must flow into shared memory for squad access.

### 1.4 Health Score Calculator
- **Tool:** `calculate_health_score(client_id, dimensions[], weights[])`
- **Why:** Multi-dimensional health scoring drives prioritization of at-risk clients.

### 1.5 Trend Reporter
- **Tool:** `generate_trend_report(metric, timeframe, segments[], format)`
- **Why:** Longitudinal trend analysis reveals systemic retention patterns.

---

## Tier 2 — Conditionally Active

### 2.1 Retention Campaign Designer
- **Tool:** `design_campaign(segment, intervention_type, timeline, expected_outcome)`
- **Why:** Structured retention campaigns require data-backed design before CS Lead approval.

### 2.2 Expansion Opportunity Flagger
- **Tool:** `flag_expansion(client_id, opportunity_type, evidence, value_estimate)`
- **Why:** Upsell and cross-sell signals routed to Sales via @cs-lead.

### 2.3 Cohort Analyzer
- **Tool:** `analyze_cohort(segment, entry_period, retention_curve)`
- **Why:** Cohort analysis reveals onboarding and lifecycle effectiveness.

---

## Tier 3 — Restricted

### 3.1 Win-Back Campaign Requester
- **Tool:** `request_winback(client_id, justification, proposed_offer, risk)`
- **Why:** Win-back campaigns involving concessions require CS Lead approval.

---

## Skill Anti-Patterns
The Retention Strategist does **NOT** have:
- `approve_lifecycle_decision()` — CS Lead's domain
- `conduct_client_outreach()` — Client Advocate's domain
- `execute_onboarding_workflow()` — Onboarding Specialist's domain

## Sources & Inspirations
- OpenClaw customer success squad tool-access model
