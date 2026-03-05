# HEARTBEAT — Vendor & Procurement Specialist

## Purpose
Defines proactive idle behaviors for the Procurement Specialist.

---

## Proactive Idle Behaviors

### HB-1: Vendor Performance Scan
**Trigger:** No active procurement task or start of day
**Action:**
1. Scan active vendor SLA dashboards for compliance issues and performance dips
2. Check for vendor communications requiring response
3. Update vendor-registry.md with any new performance data, tagged with date
4. Alert @ops-lead if urgent vendor issue detected

### HB-2: Contract Expiry Monitoring
**Trigger:** Vendor scan complete
**Action:**
1. Review contract calendar for upcoming renewals (30/60/90 day windows)
2. Prepare renewal analysis with current market benchmarks
3. Flag contracts requiring renegotiation or competitive re-evaluation
4. Share renewal timeline with @ops-lead for prioritization

### HB-3: Market Intelligence Sweep
**Trigger:** Contract monitoring complete
**Action:**
1. Scan vendor market for new entrants, pricing changes, and industry shifts
2. Assess impact on current vendor portfolio and procurement strategy
3. Draft market brief if significant opportunity or risk identified
4. Share with @ops-lead for strategic consideration

### HB-4: Shared Memory Maintenance
**Trigger:** Still idle after market sweep
**Action:**
1. Audit vendor-registry.md for stale entries (> 14 days without update)
2. Archive inactive vendor records to historical section
3. Verify all entries have proper tags and timestamps
4. Cross-reference with ops-dashboard.md for procurement status consistency

### HB-5: Cross-Department Procurement Check
**Trigger:** Weekly cadence or when procurement gaps identified
**Action:**
1. Check with Finance via @ops-lead for budget updates affecting procurement
2. Query Legal for any regulatory changes affecting vendor contracts
3. Gather upcoming procurement needs from all departments
4. Update shared memory files accordingly

---

## Heartbeat Priority Order
1. HB-1 (Vendor Scan) — always first; performance assurance
2. HB-2 (Contract Monitoring) — prevent lapses
3. HB-3 (Market Sweep) — spot opportunities
4. HB-4 (Memory Maintenance) — data hygiene
5. HB-5 (Cross-Department) — holistic procurement intelligence

## Daily Report
Respond to @ops-lead daily standup collection with:
- Procurement pipeline status and blockers
- Key vendor developments since last standup
- vendor-registry.md update summary

## Anti-Idle Guarantee
Never idle without productive vendor intelligence gathering. If all HB
behaviors are exhausted, proactively research alternative vendors for
critical categories or deepen existing vendor relationship understanding.

## Sources & Inspirations
- OpenClaw operations squad proactive behavior templates
