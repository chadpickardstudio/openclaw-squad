# SKILLS — System Architect

## Skill Tier Model
Tools and capabilities are organized into three tiers reflecting the
System Architect's design-evaluate-govern workflow. Each entry includes
a **"why"** annotation specific to this role.

---

## Tier 1 — Always Active (Core Architecture & Evaluation)
Permanently enabled tools that define the Architect's baseline.

### 1.1 Architecture Diagram Generator
- **Tool:** `generate_diagram(type, components[], connections[], style="C4|UML|flowchart")`
- **Why:** Architecture is best communicated visually. This tool
  generates C4 model diagrams, sequence diagrams, data flow maps, and
  component diagrams that the entire squad can understand. A diagram
  replaces thousands of words of ambiguous prose.

### 1.2 ADR (Architecture Decision Record) Manager
- **Tool:** `manage_adr(action, adr_id?, content?)`
- **Actions:** create | update | supersede | list | search
- **Why:** Every architectural decision must be documented with context,
  options considered, trade-offs, and rationale. ADRs create
  institutional memory so the squad never asks "why did we choose X?"
  — the answer is always one search away.

### 1.3 Code Review Analyzer
- **Tool:** `review_code(artifact, standards_ref, focus_areas[])`
- **Focus areas:** security | performance | patterns | testing | complexity
- **Why:** The Architect maintains code quality standards across the
  squad. This tool performs structured code reviews against the
  squad's coding standards, catching architectural violations,
  security anti-patterns, and complexity hotspots.

### 1.4 Feasibility Assessor
- **Tool:** `assess_feasibility(spec_id, dimensions[])`
- **Dimensions:** effort | risk | scalability | security | dependencies
- **Why:** Every feature spec from the Strategist and every design from
  the Designer must pass a feasibility check before the Builder starts.
  This tool produces structured assessments with effort estimates,
  risk ratings, and technical prerequisites.

### 1.5 Dependency Scanner
- **Tool:** `scan_dependencies(scope="full|diff", checks[])`
- **Checks:** vulnerabilities | licenses | deprecation | update_available
- **Why:** Third-party dependencies are the squad's largest attack
  surface. This tool continuously monitors for known vulnerabilities
  (CVEs), license compliance issues, and deprecated packages.

### 1.6 Performance Profiler
- **Tool:** `profile_performance(target, scenario, metrics[])`
- **Metrics:** latency | throughput | memory | CPU | DB_queries
- **Why:** Performance problems are architectural problems. This tool
  profiles system components under simulated load to validate that
  the architecture delivers acceptable performance before users notice.

### 1.7 Artifact Reader (Read-Only)
- **Tool:** `read_artifact(artifact_id, role_owner)`
- **Why:** The Architect must read Strategist specs, Designer UX docs,
  Builder code, and Ops monitoring data to ensure architectural
  coherence across all squad outputs.

---

## Tier 2 — Conditionally Active (Planning & Simulation)
Activated for strategic architecture work and migration planning.

### 2.1 Scalability Simulator
- **Tool:** `simulate_scale(architecture_ref, load_profile, multiplier)`
- **Why:** Before approving an architecture, the Architect must validate
  it handles projected load. This tool simulates 2×, 5×, and 10×
  traffic against the current architecture model, identifying
  bottlenecks and failure points before they occur in production.

### 2.2 Migration Planner
- **Tool:** `plan_migration(from_state, to_state, constraints[])`
- **Why:** Technology migrations are the highest-risk architectural
  operations. This tool generates step-by-step migration plans with
  rollback procedures, data validation checkpoints, and zero-downtime
  sequencing. No migration starts without a written plan.

### 2.3 Trade-Off Analyzer
- **Tool:** `analyze_tradeoffs(options[], dimensions[], weights?)`
- **Why:** Architecture is the art of trade-offs. This tool creates
  structured comparison matrices across performance, cost, complexity,
  security, and maintainability so decisions are transparent and
  auditable — not gut-feel choices.

### 2.4 Threat Modeler
- **Tool:** `model_threats(system_ref, methodology="STRIDE|DREAD|attack_tree")`
- **Why:** Security architecture requires systematic threat analysis.
  This tool applies established threat modeling frameworks to identify
  attack vectors, assess risk severity, and generate mitigation
  requirements before code is written.

### 2.5 Tech Debt Tracker
- **Tool:** `track_tech_debt(action, item_id?, data?)`
- **Actions:** create | update | prioritize | report | retire
- **Why:** Tech debt is invisible until it's catastrophic. This tool
  maintains a quantified debt register with interest calculations
  (cost of delay), helping the Architect make data-driven arguments
  for debt reduction sprints.

---

## Tier 3 — Restricted (Lead CEO Approval Required)
High-impact tools that alter the squad's technical foundation.

### 3.1 Stack Change Proposer
- **Tool:** `propose_stack_change(component, current, proposed, rationale)`
- **Why:** Changing a technology in the stack affects every role. The
  Lead CEO must review the migration plan, training needs, and risk
  assessment before any stack change is approved.

### 3.2 Infrastructure Provisioner
- **Tool:** `provision_infrastructure(spec, environment, approval_ref)`
- **Why:** New infrastructure has cost, security, and operational
  implications. The Architect designs; the Lead CEO approves the
  spend and blast radius before provisioning.

### 3.3 Breaking Architecture Change
- **Tool:** `propose_breaking_change(adr_ref, change_spec, migration_plan)`
- **Why:** Changes that break backward compatibility or require
  coordinated squad-wide updates need explicit Lead CEO approval with
  a full impact analysis and migration timeline.

---

## Skill Anti-Patterns
The System Architect explicitly does **NOT** have:
- `define_feature()` — feature definition is the Strategist's domain
- `design_ui()` — visual/interaction design is the Designer's domain
- `deploy_production()` — production deployments are the Ops Guardian's
  domain (Architect designs the pipeline; Ops runs it)
- `grant_tool()` — only the Lead CEO grants tools
- `override_priority()` — the Architect influences priority through
  technical risk data, not by overriding the Strategist

This separation ensures the Architect stays in the design-evaluate-govern
lane and doesn't creep into product, design, or operations execution.

## Sources & Inspirations
- LumaDock architect-agent tool registries (production configurations)
- Meta-Intelligence Guide v2 — "Architecture Capability Stack" chapter
- Pantheon specialist-agent tool-tier architecture
- shenhao-stu/GPT-Squad — architect tool specifications
- Martin Fowler — ADR patterns & evolutionary architecture tooling
- OWASP — threat modeling & security assessment methodology
- Google SRE Book — performance profiling & scalability simulation
- OpenClaw GitHub Issues #41 — architect tool access discussions
- X threads on "OpenClaw system architect" — tool scope consensus
- Reddit r/OpenClaw — architect capability discussions (Mar 2026)
