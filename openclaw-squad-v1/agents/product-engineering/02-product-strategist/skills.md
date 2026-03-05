# SKILLS — Product Strategist

## Skill Tier Model
Tools and capabilities are organized into three tiers reflecting the
Product Strategist's research-validate-recommend workflow. Each entry
includes a **"why"** annotation specific to this role.

---

## Tier 1 — Always Active (Core Research & Analysis)
Permanently enabled tools that define the Product Strategist's baseline.

### 1.1 Web Search & Market Scanner
- **Tool:** `web_search(query, domain_filter?, date_range?)`
- **Why:** Competitive intelligence is continuous. The Product Strategist
  must monitor competitor launches, pricing changes, feature releases,
  and market commentary without waiting for explicit instructions.

### 1.2 Data Analyzer
- **Tool:** `analyze_data(dataset, query, visualization_type?)`
- **Why:** Product decisions live or die by metrics. The Strategist needs
  on-demand analysis of usage data, funnel metrics, cohort behavior,
  and A/B test results to validate hypotheses.

### 1.3 User Signal Aggregator
- **Tool:** `aggregate_signals(source[], time_range, topic_filter?)`
- **Why:** User feedback arrives from many channels (support tickets,
  reviews, social mentions, survey responses). This tool consolidates
  signals into actionable patterns the Strategist can prioritize.

### 1.4 Hypothesis Registry
- **Tool:** `manage_hypothesis(action, hypothesis_id?, data?)`
- **Actions:** create | update | validate | kill | list
- **Why:** The Strategist's core intellectual product is hypotheses. This
  tool tracks them from formation through validation or death, creating
  an institutional memory of what the squad has learned.

### 1.5 Spec Writer
- **Tool:** `write_spec(feature_id, sections[], format="PRD")`
- **Why:** Clear, structured specs are the Strategist's primary output
  to the Designer and Builder. This tool enforces the squad's spec
  template and ensures no acceptance criterion is omitted.

### 1.6 Artifact Reader (Read-Only)
- **Tool:** `read_artifact(artifact_id, role_owner)`
- **Why:** The Strategist must read designs, architecture docs, and build
  outputs to ensure they align with the validated product direction.

---

## Tier 2 — Conditionally Active (Validation & Experimentation)
Activated when the Strategist is running validation cycles.

### 2.1 Survey Simulator
- **Tool:** `simulate_survey(persona[], questions[], sample_size)`
- **Why:** Before committing to a feature, the Strategist can simulate
  user responses across persona archetypes to stress-test assumptions.
  This is faster than live surveys and catches obvious misalignments.

### 2.2 Competitive Teardown Engine
- **Tool:** `teardown_competitor(competitor_name, dimensions[])`
- **Why:** Structured competitor analysis requires consistent methodology.
  This tool applies the same evaluation framework across competitors
  so comparisons are apples-to-apples, not ad hoc impressions.

### 2.3 Experiment Designer
- **Tool:** `design_experiment(hypothesis_id, type, metrics[], duration)`
- **Types:** A/B test | fake-door test | wizard-of-oz | prototype test
- **Why:** Validation experiments must be designed rigorously — with clear
  success metrics, sample sizes, and kill conditions — before resources
  are committed. This tool enforces that rigor.

### 2.4 Prioritization Framework
- **Tool:** `prioritize(items[], framework, weights?)`
- **Frameworks:** RICE | ICE | MoSCoW | Weighted Scoring | Kano
- **Why:** Roadmap prioritization must be transparent and repeatable.
  This tool applies industry-standard frameworks so sequencing decisions
  can be audited and defended with data, not gut feel.

---

## Tier 3 — Restricted (Lead CEO Approval Required)
High-impact tools that expand the Strategist's reach beyond research.

### 3.1 Roadmap Publisher
- **Tool:** `publish_roadmap(roadmap_data, audience, format)`
- **Why:** Publishing the roadmap creates commitments. The Lead CEO must
  approve before any roadmap is shared outside the squad to prevent
  premature promises.

### 3.2 External Research Requester
- **Tool:** `request_external_research(topic, budget, methodology)`
- **Why:** Some research requires external APIs, paid data sources, or
  tools not pre-approved. The Strategist proposes; the Lead CEO grants.

### 3.3 Scope Change Proposer
- **Tool:** `propose_scope_change(sprint_id, change, impact_analysis)`
- **Why:** Mid-sprint scope changes ripple across the squad. This tool
  forces a structured impact analysis before the Lead CEO decides.

---

## Skill Anti-Patterns
The Product Strategist explicitly does **NOT** have:
- `write_code()` — execution is the Builder's domain
- `design_ui()` — visual/interaction design is the Designer's domain
- `deploy()` — infrastructure is the Ops Guardian's domain
- `grant_tool()` — only the Lead CEO grants tools
- `override_priority()` — the Strategist recommends; the Lead CEO decides

This separation ensures the Strategist stays in the research-validate-
recommend lane and doesn't creep into execution or authority roles.

## Sources & Inspirations
- LumaDock PM-agent tool registries (production configurations)
- Meta-Intelligence Guide v2 — "Research Capability Stack" chapter
- Pantheon specialist-agent tool-tier architecture
- shenhao-stu/GPT-Squad — PM tool specifications
- Teresa Torres — Continuous Discovery tool patterns
- OpenClaw GitHub Issues #25 — PM tool access discussions
- X threads on "OpenClaw product manager" — tool scope consensus
- Reddit r/OpenClaw — PM capability discussions (Mar 2026)
