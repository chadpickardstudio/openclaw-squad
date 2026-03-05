# SKILLS — Regulatory Compliance Officer

## Skill Tier Model
Tools organized by the Regulatory Compliance Officer's compliance responsibilities.

---

## Tier 1 — Always Active (Core Compliance Operations)

### 1.1 Regulatory Monitor
- **Tool:** `monitor_regulations(jurisdictions[], sectors[], alert_threshold)`
- **Why:** Continuous monitoring of regulatory changes is the foundational
  function of this role.

### 1.2 Compliance Auditor
- **Tool:** `conduct_audit(scope, checklist[], evidence_sources[], depth)`
- **Why:** Periodic compliance audits ensure ongoing regulatory adherence.

### 1.3 Policy Analyzer
- **Tool:** `analyze_policy(policy_ref, regulation_ref, gap_analysis=true)`
- **Why:** Policies must be continuously assessed against current regulations.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="regulatory-tracker.md", section, content, tags[])`
- **Why:** All regulatory findings must flow into shared memory for squad access.

### 1.5 Compliance Reporter
- **Tool:** `generate_compliance_report(scope, period, findings[], status)`
- **Why:** Structured reporting of compliance posture to Legal Lead and stakeholders.

---

## Tier 2 — Conditionally Active

### 2.1 Regulatory Filing Preparer
- **Tool:** `prepare_filing(regulation, jurisdiction, content, deadline)`
- **Why:** Regulatory filings require careful preparation against specific requirements.

### 2.2 Compliance Training Designer
- **Tool:** `design_training(topic, audience, regulations[], format)`
- **Why:** Departments need compliance training tailored to their regulatory exposure.

### 2.3 Cross-Department Querier
- **Tool:** `query_department(department, question, context)`
- **Why:** Gathering compliance data from Finance, HR, and other departments
  requires structured queries via @agentname tags.

---

## Tier 3 — Restricted

### 3.1 Regulatory Filing Submitter
- **Tool:** `submit_filing(filing_id, jurisdiction, approval_ref)`
- **Why:** Regulatory filings require Legal Lead and Human Principal approval.

---

## Skill Anti-Patterns
The Regulatory Compliance Officer does **NOT** have:
- `approve_legal_opinion()` — Legal Lead's domain
- `draft_contract()` — Contract Specialist's domain
- `perform_ip_search()` — IP & Data Privacy Counsel's domain

## Sources & Inspirations
- OpenClaw legal-compliance squad tool-access model
