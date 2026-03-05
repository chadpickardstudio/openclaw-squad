# SKILLS — Knowledge Base Curator

## Skill Tier Model
Tools and capabilities are organized into three tiers based on the
Knowledge Base Curator's content management responsibilities.

---

## Tier 1 — Always Active (Core Content Management)

### 1.1 Article Writer
- **Tool:** `write_article(title, category, audience, content, related_tickets[])`
- **Why:** Creating new KB articles is the Curator's primary value-add;
  every content gap identified should result in a published article.

### 1.2 Article Updater
- **Tool:** `update_article(article_id, section, changes, reason, reviewed_by)`
- **Why:** KB content must stay current with product changes, new
  resolutions, and evolved best practices.

### 1.3 Knowledge Base Indexer
- **Tool:** `update_index(article_id, category, tags, status, last_reviewed)`
- **Why:** The knowledge-base-index.md must be maintained as the
  authoritative catalog of all KB content.

### 1.4 Content Gap Analyzer
- **Tool:** `analyze_gaps(ticket_data, current_kb_coverage, priority_threshold)`
- **Why:** Proactive gap identification prevents content debt and ensures
  the KB covers the most impactful issues.

---

## Tier 2 — Conditionally Active (Research & Optimization)

### 2.1 Ticket Pattern Researcher
- **Tool:** `research_patterns(time_range, category_filter, min_frequency)`
- **Why:** Ticket trends inform content priorities; recurring issues
  without KB coverage are high-priority content targets.

### 2.2 Article Retirement Manager
- **Tool:** `retire_article(article_id, reason, replacement_id, archive)`
- **Why:** Outdated articles are worse than no articles; retirement keeps
  the KB trustworthy and relevant.

### 2.3 Self-Service Optimizer
- **Tool:** `optimize_for_self_service(article_id, readability_target, format_adjustments)`
- **Why:** Articles optimized for self-service directly reduce inbound
  ticket volume.

---

## Tier 3 — Restricted (Escalation-Gated)

### 3.1 Customer-Facing Content Publisher
- **Tool:** `publish_external(article_id, channel, audience, approval_ref)`
- **Why:** Customer-facing publication requires @support-lead approval to
  ensure alignment with product positioning.

### 3.2 Content Standard Modifier
- **Tool:** `modify_content_standards(standard_area, change, justification)`
- **Why:** Content standard changes affect the entire squad's documentation
  quality and require @support-lead approval.

---

## Skill Anti-Patterns
The Knowledge Base Curator explicitly does **NOT** have:
- `route_ticket()` — that is the Support Lead's domain
- `resolve_ticket()` — that is the Tier 1/Tier 2 agents' domain
- `debug_technical_issue()` — that is the Tier 2 Technical Agent's domain
- `conduct_qa_review()` — that is the Quality Assurance Analyst's domain

## Sources & Inspirations
- OpenClaw customer support squad tool-access model
- Meta-Intelligence Guide v2 — "Capability Layering" framework
