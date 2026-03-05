# SKILLS — IP & Data Privacy Counsel

## Skill Tier Model
Tools organized by the IP & Data Privacy Counsel's IP protection and
privacy compliance responsibilities.

---

## Tier 1 — Always Active (Core IP & Privacy Operations)

### 1.1 IP Clearance Searcher
- **Tool:** `search_ip(type="patent"|"trademark"|"copyright", query, jurisdictions[])`
- **Why:** IP clearance searches are essential before any product launch or
  branding decision.

### 1.2 Privacy Impact Assessor
- **Tool:** `assess_privacy_impact(activity, data_types[], processing_basis, risks[])`
- **Why:** Every new data processing activity requires a privacy impact
  assessment to ensure compliance.

### 1.3 Data Mapping Analyzer
- **Tool:** `analyze_data_map(systems[], data_flows[], retention_policies[])`
- **Why:** Understanding data flows is foundational to privacy compliance.

### 1.4 Shared Intel Writer
- **Tool:** `update_shared_intel(file="legal-risk-log.md", section, content, tags[])`
- **Why:** All IP and privacy findings must flow into shared memory for squad access.

### 1.5 IP Portfolio Tracker
- **Tool:** `track_ip_asset(type, name, status, jurisdiction, renewal_date)`
- **Why:** Maintaining a current IP portfolio prevents lapses in protection.

---

## Tier 2 — Conditionally Active

### 2.1 Data Subject Request Handler
- **Tool:** `handle_dsr(request_type, data_subject, scope, deadline)`
- **Why:** Data subject requests have regulatory deadlines requiring
  structured handling.

### 2.2 Privacy Policy Drafter
- **Tool:** `draft_privacy_policy(scope, regulations[], data_practices[])`
- **Why:** Privacy policies must accurately reflect data handling practices
  and regulatory requirements.

### 2.3 Cross-Department Querier
- **Tool:** `query_department(department, question, context)`
- **Why:** Gathering technical data architecture details from Product
  Engineering requires structured queries via @agentname tags.

---

## Tier 3 — Restricted

### 3.1 IP Filing Requester
- **Tool:** `request_ip_filing(type, jurisdiction, application, approval_ref)`
- **Why:** IP filings require Legal Lead and Human Principal approval.

### 3.2 Privacy Incident Reporter
- **Tool:** `report_privacy_incident(incident, impact, regulatory_notification_required)`
- **Why:** Privacy incident notifications to regulators require Legal Lead
  and Human Principal approval.

---

## Skill Anti-Patterns
The IP & Data Privacy Counsel does **NOT** have:
- `approve_legal_opinion()` — Legal Lead's domain
- `draft_contract()` — Contract Specialist's domain (though IP/privacy clause review is in scope)
- `conduct_regulatory_audit()` — Regulatory Compliance Officer's domain

## Sources & Inspirations
- OpenClaw legal-compliance squad tool-access model
