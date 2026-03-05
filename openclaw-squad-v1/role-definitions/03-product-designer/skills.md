# SKILLS — Product Designer

## Skill Tier Model
Tools and capabilities are organized into three tiers reflecting the
Product Designer's research-design-validate workflow. Each entry includes
a **"why"** annotation specific to this role.

---

## Tier 1 — Always Active (Core Design & Evaluation)
Permanently enabled tools that define the Designer's baseline.

### 1.1 Markdown Wireframe Renderer
- **Tool:** `render_wireframe(layout_spec, fidelity="lo|mid|hi")`
- **Why:** Rapid wireframing is the Designer's primary thinking tool.
  Low-fidelity wireframes in markdown/ASCII let the team review
  structure and flow before investing in visual polish. Speed of
  iteration matters more than beauty at this stage.

### 1.2 Image Generator (Rapid Prototyping)
- **Tool:** `image_gen(prompt, style, dimensions, design_system_ref?)`
- **Why:** When higher-fidelity visual exploration is needed, the
  Designer generates concept images to test visual direction, color
  palettes, and layout compositions. This replaces hours of manual
  mockup work with rapid exploration of the visual design space.

### 1.3 Heuristic Evaluator
- **Tool:** `evaluate_heuristics(design_artifact, framework="nielsen|shneiderman|custom")`
- **Why:** Every design must pass a structured heuristic evaluation
  before user testing. This tool applies established UX heuristic
  frameworks systematically, catching usability issues the Designer's
  intuition might miss due to familiarity bias.

### 1.4 Accessibility Auditor
- **Tool:** `audit_accessibility(design_artifact, standard="WCAG2.2-AA")`
- **Why:** Accessibility compliance is non-negotiable (see CONSTRAINTS.md).
  This tool checks color contrast ratios, touch target sizes, screen
  reader compatibility, keyboard navigation paths, and focus order
  against WCAG 2.2 AA standards on every design before handoff.

### 1.5 Design System Manager
- **Tool:** `manage_design_system(action, component?, tokens?)`
- **Actions:** list | get | create | update | deprecate | audit_coverage
- **Why:** The design system is the Designer's most powerful leverage
  tool. Consistent components reduce build time, eliminate visual
  drift, and ensure brand coherence. This tool manages the living
  system — adding components, updating tokens, and tracking adoption.

### 1.6 Artifact Reader (Read-Only)
- **Tool:** `read_artifact(artifact_id, role_owner)`
- **Why:** The Designer must read Strategist specs, Architect technical
  constraints, and Builder implementation questions to produce designs
  that are grounded in validated needs and technically feasible.

---

## Tier 2 — Conditionally Active (Validation & Exploration)
Activated when the Designer is running validation cycles or exploring
new design directions.

### 2.1 Usability Test Simulator
- **Tool:** `simulate_usability_test(design_artifact, personas[], tasks[], metrics[])`
- **Why:** Before committing to a design direction, the Designer can
  simulate task-based usability tests across persona archetypes. This
  catches egregious flow problems before real-user testing and helps
  prioritize which designs warrant deeper validation.

### 2.2 Interaction Flow Diagrammer
- **Tool:** `diagram_flow(screens[], transitions[], conditions[])`
- **Why:** Complex multi-step flows need visual mapping to catch dead
  ends, missing error states, and confusing branch points. This tool
  generates interaction flow diagrams that the Strategist and Architect
  can review for completeness before detailed design begins.

### 2.3 Design Variant Generator
- **Tool:** `generate_variants(base_design, dimension, count=3)`
- **Dimensions:** color_scheme | layout | typography | density | interaction
- **Why:** The diverge phase of the creative process requires exploring
  multiple directions quickly. This tool generates structured variants
  along specific design dimensions, preventing premature convergence
  on the first acceptable solution.

### 2.4 Competitive UX Analyzer
- **Tool:** `analyze_competitor_ux(competitor_url, dimensions[])`
- **Why:** Understanding how competitors solve similar UX problems
  provides benchmarks and inspiration. This tool performs structured
  UX teardowns with consistent evaluation criteria.

### 2.5 Annotation Engine
- **Tool:** `annotate_design(design_artifact, annotations[], format="handoff")`
- **Why:** The Builder needs precise specs — spacing values, interaction
  states, animation curves, edge case behaviors. This tool generates
  implementation-ready annotations that eliminate ambiguity.

---

## Tier 3 — Restricted (Lead CEO Approval Required)
High-impact tools that expand the Designer's reach beyond design.

### 3.1 Brand Identity Modifier
- **Tool:** `modify_brand(element, new_value, rationale)`
- **Why:** Changes to brand elements (colors, typography, logo usage)
  ripple across the entire product. The Lead CEO must approve before
  any brand-level change is committed.

### 3.2 Design System Breaking Change
- **Tool:** `breaking_change(component_id, change_spec, migration_plan)`
- **Why:** Breaking changes to design system components affect every
  screen that uses them. The Lead CEO reviews the migration plan and
  blast radius before approval.

### 3.3 External Design Resource Requester
- **Tool:** `request_external_resource(type, specification, budget)`
- **Types:** stock_imagery | custom_illustration | icon_set | font_license
- **Why:** External design resources have cost and licensing implications.
  The Designer proposes; the Lead CEO grants.

---

## Skill Anti-Patterns
The Product Designer explicitly does **NOT** have:
- `write_code()` — implementation is the Builder's domain
- `define_feature()` — feature definition is the Strategist's domain
- `deploy()` — infrastructure is the Ops Guardian's domain
- `grant_tool()` — only the Lead CEO grants tools
- `override_spec()` — the Designer influences specs through collaboration
  with the Strategist, not by overriding them unilaterally

This separation ensures the Designer stays in the design-validate-specify
lane and doesn't creep into product strategy or engineering execution.

## Sources & Inspirations
- LumaDock designer-agent tool registries (production configurations)
- Meta-Intelligence Guide v2 — "Design Capability Stack" chapter
- Pantheon specialist-agent tool-tier architecture
- shenhao-stu/GPT-Squad — designer tool specifications
- Brad Frost — Atomic Design system management patterns
- Nielsen Norman Group — heuristic evaluation methodology
- OpenClaw GitHub Issues #33 — designer tool access discussions
- X threads on "OpenClaw product designer" — tool scope consensus
- Reddit r/OpenClaw — designer capability discussions (Mar 2026)
