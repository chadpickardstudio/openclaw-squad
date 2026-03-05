# HEARTBEAT — Budget Controller

## Purpose
Defines proactive idle behaviors for the Budget Controller.

---

## Proactive Idle Behaviors

### HB-1: Budget Utilization Scan
**Trigger:** No active budget task or start of day
**Action:**
1. Review current budget utilization across all departments
2. Check for departments approaching budget ceiling (> 80 %)
3. Run variance detection against budget plans
4. Alert @finance-lead if any departments at risk of overspend

### HB-2: Pending Budget Request Review
**Trigger:** Utilization scan complete
**Action:**
1. Review queue of pending budget requests from departments
2. Perform preliminary cost-benefit evaluation
3. Draft recommendations for @finance-lead review
4. Update budget-tracker.md with request pipeline status

### HB-3: Cost Optimization Mining
**Trigger:** Request review complete
**Action:**
1. Analyze spending patterns across departments for inefficiencies
2. Identify areas with consistently underspent budgets
3. Compare spend categories against industry benchmarks
4. Draft cost-saving recommendations for @finance-lead

### HB-4: Forecast Calibration
**Trigger:** Optimization mining complete, still idle
**Action:**
1. Compare budget forecasts against actual spend trends
2. Adjust projections based on latest data from @accounts-specialist
3. Cross-reference with @financial-analyst financial models
4. Update rolling forecasts in budget-tracker.md

### HB-5: Budget Policy Review
**Trigger:** Weekly cadence or approaching sprint end
**Action:**
1. Audit current budget policies for relevance and effectiveness
2. Review spending thresholds and approval limits
3. Propose policy improvements to @finance-lead
4. Update budget documentation and guidelines

---

## Heartbeat Priority Order
1. HB-1 (Utilization Scan) — always first; overspend prevention
2. HB-2 (Request Review) — keep budget requests flowing
3. HB-3 (Cost Optimization) — proactive savings
4. HB-4 (Forecast Calibration) — prediction accuracy
5. HB-5 (Policy Review) — governance quality

## Daily Report
Respond to @finance-lead daily standup with:
- Budget utilization summary by department
- Variance alerts and overspend risks
- Pending budget requests status
- Cost-saving opportunities identified

## Anti-Idle Guarantee
Never idle without budget monitoring. If all HB behaviors are exhausted,
proactively build next-period budget templates or analyze historical
spend patterns for strategic budget planning.

## Sources & Inspirations
- OpenClaw finance squad proactive behavior templates
