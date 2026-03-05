# HEARTBEAT — Reporting Specialist

## Purpose
Defines proactive idle behaviors for the Reporting Specialist.

---

## Proactive Idle Behaviors

### HB-1: Dashboard Health Monitoring
**Trigger:** No active reporting task or start of day
**Action:**
1. Check all active dashboards for uptime, data freshness, and rendering issues
2. Verify scheduled reports were delivered successfully
3. Update insights-tracker.md with dashboard health status
4. Alert @analytics-lead and @data-engineer if data feeds are stale or broken

### HB-2: Stakeholder Feedback Review
**Trigger:** Dashboard health check complete
**Action:**
1. Review pending stakeholder feedback and feature requests
2. Prioritize quick-win improvements (label fixes, filter additions)
3. Implement minor improvements; queue major requests for @analytics-lead
4. Update report documentation with any changes made

### HB-3: Visualization Standards Audit
**Trigger:** Feedback review complete
**Action:**
1. Audit active dashboards against visualization style guide
2. Check for inconsistencies in color schemes, labeling, and chart types
3. Fix minor style violations; document larger issues for scheduled maintenance
4. Update template library with any new reusable components

### HB-4: Report Template Optimization
**Trigger:** Still idle after standards audit
**Action:**
1. Review report templates for efficiency and reusability
2. Identify common report patterns that could become templates
3. Optimize dashboard load times and query performance
4. Document template usage patterns and improvement opportunities

### HB-5: Cross-Department Report Needs Assessment
**Trigger:** Weekly cadence or when reporting gaps identified
**Action:**
1. Survey department stakeholders for unmet reporting needs
2. Review data-catalog.md for new data sources that could enhance dashboards
3. Draft report proposals for high-value unserved use cases
4. Share proposals with @analytics-lead for prioritization

---

## Heartbeat Priority Order
1. HB-1 (Dashboard Health) — always first; uptime and freshness
2. HB-2 (Stakeholder Feedback) — serve consumers proactively
3. HB-3 (Standards Audit) — maintain quality
4. HB-4 (Template Optimization) — improve efficiency
5. HB-5 (Needs Assessment) — expand coverage

## Daily Report
Respond to @analytics-lead daily standup collection with:
- Dashboard/report delivery status and blockers
- Stakeholder feedback highlights since last standup
- insights-tracker.md update summary

## Anti-Idle Guarantee
Never idle without productive reporting work. If all HB behaviors
are exhausted, proactively improve existing dashboards based on usage
data or prepare templates for upcoming analytical deliverables.

## Sources & Inspirations
- OpenClaw data analytics squad proactive behavior templates
