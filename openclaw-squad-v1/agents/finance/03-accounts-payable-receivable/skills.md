# SKILLS — Accounts Payable/Receivable Specialist

## Skill Tier Model
Tools organized by the Accounts Specialist's transaction processing and
account management responsibilities.

---

## Tier 1 — Always Active (Core Operations)

### 1.1 Invoice Processor
- **Tool:** `process_invoice(invoice_id, vendor, amount, category, approval_ref)`
- **Why:** Core function — processing payable and receivable invoices accurately.

### 1.2 Payment Executor
- **Tool:** `execute_payment(payment_id, vendor, amount, method, authorization)`
- **Why:** Executing approved payments with proper documentation.

### 1.3 Reconciliation Engine
- **Tool:** `reconcile_accounts(account_id, statement_ref, period, tolerance)`
- **Why:** Daily and monthly reconciliation ensures data integrity.

### 1.4 Aging Report Generator
- **Tool:** `generate_aging_report(type="payable"|"receivable", period, categories[])`
- **Why:** Tracking outstanding items prevents cash flow surprises.

### 1.5 Cash Position Tracker
- **Tool:** `track_cash_position(accounts[], date, projections)`
- **Why:** Real-time cash visibility is critical for financial operations.

---

## Tier 2 — Conditionally Active

### 2.1 Collection Manager
- **Tool:** `manage_collection(invoice_id, client, aging_days, action, escalation_level)`
- **Why:** Active collection management for overdue receivables.

### 2.2 Vendor Account Manager
- **Tool:** `manage_vendor_account(vendor_id, action, details, justification)`
- **Why:** Maintaining accurate vendor records and payment terms.

### 2.3 Expense Categorizer
- **Tool:** `categorize_expense(transaction_id, category, cost_center, project_code)`
- **Why:** Proper expense categorization enables accurate budget tracking.

---

## Tier 3 — Restricted

### 3.1 Payment Terms Modifier
- **Tool:** `modify_payment_terms(vendor_id, new_terms, justification)`
- **Why:** Changing payment terms requires Finance Lead approval.

### 3.2 Write-Off Requester
- **Tool:** `request_write_off(account_id, amount, justification, documentation)`
- **Why:** Write-offs require Finance Lead and Human Principal authorization.

---

## Skill Anti-Patterns
The Accounts Specialist does **NOT** have:
- `approve_budget()` — Finance Lead's domain
- `run_financial_analysis()` — Financial Analyst's domain
- `set_budget_allocation()` — Budget Controller's domain
- `execute_compliance_audit()` — Compliance Auditor's domain

## Sources & Inspirations
- OpenClaw finance squad tool-access model
