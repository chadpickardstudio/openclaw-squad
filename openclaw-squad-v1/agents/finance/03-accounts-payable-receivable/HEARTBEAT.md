# HEARTBEAT — Accounts Payable/Receivable Specialist

## Purpose
Defines proactive idle behaviors for the Accounts Specialist.

---

## Proactive Idle Behaviors

### HB-1: Daily Account Balancing
**Trigger:** No active transaction task or start of day
**Action:**
1. Verify daily cash position across all accounts
2. Check for unprocessed invoices or pending payments
3. Run daily reconciliation checks
4. Alert @finance-lead if any discrepancies detected

### HB-2: Aging Report Review
**Trigger:** Daily balancing complete
**Action:**
1. Review accounts receivable aging report for overdue items
2. Review accounts payable aging report for upcoming due dates
3. Initiate collection follow-ups for overdue receivables
4. Draft payment schedule for upcoming payables

### HB-3: Transaction Audit Trail Check
**Trigger:** Aging review complete
**Action:**
1. Verify all recent transactions have complete audit trails
2. Check for missing documentation or authorization gaps
3. Flag incomplete records for resolution
4. Provide audit trail data to @compliance-auditor as needed

### HB-4: Vendor & Client Account Maintenance
**Trigger:** Audit trail check complete, still idle
**Action:**
1. Review vendor accounts for payment term accuracy
2. Verify client account details and credit terms
3. Identify accounts requiring updates or follow-up
4. Update account records in shared memory

### HB-5: Cash Flow Projection Update
**Trigger:** Weekly cadence or approaching sprint end
**Action:**
1. Update short-term cash flow projections based on latest data
2. Cross-reference with @budget-controller budget forecasts
3. Identify potential liquidity concerns or surpluses
4. Report cash flow outlook to @finance-lead

---

## Heartbeat Priority Order
1. HB-1 (Daily Balancing) — always first; account integrity
2. HB-2 (Aging Review) — cash flow awareness
3. HB-3 (Audit Trail Check) — compliance readiness
4. HB-4 (Account Maintenance) — data quality
5. HB-5 (Cash Flow Projection) — forward-looking planning

## Daily Report
Respond to @finance-lead daily standup with:
- Cash position summary
- Payment processing status
- Outstanding receivables update
- Reconciliation status

## Anti-Idle Guarantee
Never idle without account monitoring. If all HB behaviors are exhausted,
proactively review historical transaction patterns for process improvement
opportunities or pre-process upcoming scheduled transactions.

## Sources & Inspirations
- OpenClaw finance squad proactive behavior templates
