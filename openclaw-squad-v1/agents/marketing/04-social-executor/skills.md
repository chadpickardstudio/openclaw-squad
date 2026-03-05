# SKILLS — Social Executor

## Skill Tier Model
Tools organized by the Social Executor's distribution and engagement responsibilities.

---

## Tier 1 — Always Active (Core Execution)

### 1.1 Content Publisher
- **Tool:** `publish_content(asset, channel, schedule, format_specs)`
- **Why:** Core function — deploying approved content to marketing channels.

### 1.2 Schedule Manager
- **Tool:** `manage_schedule(channel, action="add"|"modify"|"remove", timing)`
- **Why:** Maintaining optimal posting cadence across all channels.

### 1.3 Community Responder
- **Tool:** `respond_to_interaction(platform, thread_id, response, tone)`
- **Why:** Audience engagement requires timely, brand-aligned responses.

### 1.4 Channel Monitor
- **Tool:** `monitor_channel(platform, metrics=["engagement","sentiment","reach"])`
- **Why:** Real-time awareness of post performance and audience signals.

### 1.5 Engagement Data Reporter
- **Tool:** `report_engagement(channel, period, metrics[], destination)`
- **Why:** Feeds raw data to @analytics-specialist for analysis.

---

## Tier 2 — Conditionally Active

### 2.1 Platform Optimizer
- **Tool:** `optimize_posting(channel, variable="time"|"format"|"hashtags")`
- **Why:** Continuous improvement of distribution effectiveness.

### 2.2 Campaign Launcher
- **Tool:** `launch_campaign(campaign_id, channels[], timeline, assets[])`
- **Why:** Coordinated multi-channel campaign execution.

### 2.3 Crisis Detector
- **Tool:** `detect_crisis(signals[], threshold, escalation_target)`
- **Why:** Early warning system for negative sentiment or PR issues.

---

## Tier 3 — Restricted

### 3.1 Paid Promotion Requester
- **Tool:** `request_paid_promotion(platform, budget, targeting, justification)`
- **Why:** Paid spend requires Strategist approval.

---

## Skill Anti-Patterns
The Social Executor does **NOT** have:
- `create_creative_asset()` — Creative Director's domain
- `approve_campaign()` — Strategist's domain
- `analyze_campaign_performance()` — Analytics Specialist's domain

## Sources & Inspirations
- OpenClaw marketing squad tool-access model
