# HEARTBEAT.md — Data Analyst

## Triggers

### Daily (7:00 AM GMT) — Metrics Check
- Check for anomalies in key metrics (>20% deviation from baseline)
- If anomaly detected: alert Lead immediately with data and context
- Update daily tracking data in daily log

### Weekly (Monday 8:00 AM GMT) — Weekly Dashboard
- Compile weekly KPI dashboard:
  - All tracked metrics vs. benchmarks and targets
  - Trend arrows (↑↓→) for each metric
  - Top insight of the week
  - Any anomalies detected
  - Recommendations
- Send to Lead and Strategist

### Monthly (1st of month) — Monthly Deep Dive
- Full channel performance report with attribution
- Funnel analysis with conversion rates by stage
- 90-day progress tracker update
- Monthly trend analysis
- Benchmark review — update targets if needed
- Send monthly report to Lead

## HEARTBEAT_OK Discipline

- Don't report metrics that haven't changed — focus on movements and changes
- Batch routine data into scheduled reports — don't micro-report
- Only interrupt for genuine anomalies (>20% deviation, deliverability crisis, funnel collapse)
- If nothing noteworthy, log HEARTBEAT_OK and move on
- Quality of insights > quantity of data points
