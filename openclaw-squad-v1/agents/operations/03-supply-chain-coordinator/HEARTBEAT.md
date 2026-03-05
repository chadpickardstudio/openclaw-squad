# HEARTBEAT — Supply Chain Coordinator

## Purpose
Defines proactive idle behaviors for the Supply Chain Coordinator.

---

## Proactive Idle Behaviors

### HB-1: Fulfillment Pipeline Scan
**Trigger:** No active logistics task or start of day
**Action:**
1. Scan all active orders for delivery status and ETA accuracy
2. Check fulfillment metrics dashboards for SLA violations or near-misses
3. Update ops-dashboard.md with current logistics status, tagged with date
4. Alert @ops-lead if urgent fulfillment issue detected

### HB-2: Inventory Level Monitoring
**Trigger:** Fulfillment scan complete
**Action:**
1. Monitor inventory levels against demand forecasts and safety stock thresholds
2. Identify items approaching stockout or overstock conditions
3. Generate replenishment recommendations for at-risk items
4. Flag inventory anomalies for @ops-lead review

### HB-3: Supplier Performance Check
**Trigger:** Inventory monitoring complete
**Action:**
1. Review recent supplier delivery performance against SLAs
2. Check for upcoming deliveries and confirm schedules with suppliers
3. Draft supplier performance notes for @vendor-procurement
4. Update vendor-registry.md with performance observations

### HB-4: Shared Memory Maintenance
**Trigger:** Still idle after supplier check
**Action:**
1. Audit ops-dashboard.md logistics sections for stale entries (> 7 days)
2. Archive completed fulfillment records to historical section
3. Verify all entries have proper tags and timestamps
4. Cross-reference with vendor-registry.md for consistency

### HB-5: Demand & Capacity Planning
**Trigger:** Weekly cadence or when capacity gaps identified
**Action:**
1. Reach out to Sales via @ops-lead for updated demand forecasts
2. Query Product Engineering for upcoming resource requirements
3. Synthesize demand signals into supply planning recommendations
4. Update shared memory files accordingly

---

## Heartbeat Priority Order
1. HB-1 (Fulfillment Scan) — always first; delivery assurance
2. HB-2 (Inventory Monitoring) — prevent stockouts
3. HB-3 (Supplier Check) — maintain supplier performance
4. HB-4 (Memory Maintenance) — data hygiene
5. HB-5 (Demand Planning) — forward-looking readiness

## Daily Report
Respond to @ops-lead daily standup collection with:
- Logistics tasks in progress and blockers
- Key fulfillment metrics since last standup
- ops-dashboard.md logistics update summary

## Anti-Idle Guarantee
Never idle without productive logistics monitoring. If all HB behaviors
are exhausted, proactively analyze upcoming demand patterns or deepen
supplier relationship intelligence.

## Sources & Inspirations
- OpenClaw operations squad proactive behavior templates
