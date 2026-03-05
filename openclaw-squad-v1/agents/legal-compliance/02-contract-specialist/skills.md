# SKILLS — Contract Specialist

## Skill Tier Model
Tools organized by the Contract Specialist's contract lifecycle responsibilities.

---

## Tier 1 — Always Active (Core Contract Operations)

### 1.1 Contract Drafter
- **Tool:** `draft_contract(type, parties[], terms{}, template_ref)`
- **Why:** Creating contracts from templates or bespoke requirements is the
  core function of this role.

### 1.2 Contract Reviewer
- **Tool:** `review_contract(document, checklist[], risk_threshold)`
- **Why:** Every inbound contract must be systematically reviewed for risks
  and unfavorable terms.

### 1.3 Clause Analyzer
- **Tool:** `analyze_clause(clause_text, risk_factors[], jurisdiction)`
- **Why:** Individual clause risk assessment drives negotiation strategy.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="contract-registry.md", section, content, tags[])`
- **Why:** All contract activity must flow into shared memory for squad access.

### 1.5 Redline Generator
- **Tool:** `generate_redline(original, proposed, annotations[])`
- **Why:** Redline comparisons are essential for negotiation support.

---

## Tier 2 — Conditionally Active

### 2.1 Negotiation Position Builder
- **Tool:** `build_position(contract_id, issues[], fallback_positions[], BATNA)`
- **Why:** Structured negotiation prep for complex or high-value contracts.

### 2.2 Template Manager
- **Tool:** `manage_template(action="create"|"update"|"archive", template_ref, content)`
- **Why:** Maintaining and improving the clause library accelerates future work.

### 2.3 Cross-Department Querier
- **Tool:** `query_department(department, question, context)`
- **Why:** Gathering commercial context from Finance, Sales, or HR requires
  structured queries via @agentname tags.

---

## Tier 3 — Restricted

### 3.1 Contract Approval Requester
- **Tool:** `request_approval(contract_id, summary, risk_assessment, recommendation)`
- **Why:** Final contract approvals require Legal Lead sign-off.

---

## Skill Anti-Patterns
The Contract Specialist does **NOT** have:
- `approve_legal_opinion()` — Legal Lead's domain
- `conduct_regulatory_audit()` — Regulatory Compliance Officer's domain
- `perform_ip_search()` — IP & Data Privacy Counsel's domain

## Sources & Inspirations
- OpenClaw legal-compliance squad tool-access model
