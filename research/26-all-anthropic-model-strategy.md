# 26. All-Anthropic Model Strategy — Single Vendor, Three Tiers

> **Status**: Decision Record · **Date**: March 2026
> **Context**: Strategic decision to standardise on Anthropic models exclusively
> **Supersedes**: Multi-vendor hybrid approach described in research notes 03 and 07

---

## Decision

All OpenClaw squad agents will run exclusively on Anthropic models, using a three-tier structure:

| Tier | Model | Model ID | Cost (per 1M in/out) | Role |
|------|-------|----------|---------------------|------|
| **Premium** | Claude Opus 4.6 | `anthropic/claude-opus-4-6` | $10.00 / $30.00 | Lead (CEO), Strategist, escalation |
| **Pro** | Claude Sonnet 4.6 | `anthropic/claude-sonnet-4-6` | $3.00 / $15.00 | All specialist workers (default) |
| **Budget** | Claude Haiku 4.5 | `anthropic/claude-haiku-4-5` | $0.80 / $4.00 | High-volume, simple tasks, triage, heartbeats |

---

## Reasoning

### Why Single Vendor Over Multi-Vendor Hybrid

Research notes 03 (API Cost Optimization) and 07 (Hybrid Local + Cloud) documented a multi-vendor approach using DeepSeek V3, Gemini Flash, and local Qwen models alongside Anthropic. That approach optimised purely for cost. This decision prioritises **strategic simplicity and future-proofing** over marginal cost savings.

**Arguments for all-Anthropic:**

1. **Single API key, single billing relationship.** One vendor means one invoice, one dashboard, one support channel, one set of terms of service. Operational overhead drops significantly.

2. **Future-proofing.** Anthropic is on a trajectory of increasing intelligence at decreasing cost. Each model generation has been cheaper per token than the last. Betting on this trajectory means the squad gets smarter and cheaper over time without migration effort.

3. **Consistent behaviour across tiers.** All three models share the same instruction-following patterns, tool-calling conventions, and output formatting. A prompt that works on Sonnet works on Haiku and Opus with predictable quality scaling. Cross-vendor prompts require more careful testing and occasional vendor-specific workarounds.

4. **Simpler fallback chains.** Fallbacks stay within the same model family: Opus falls back to Sonnet, Sonnet falls back to Haiku. No cross-provider auth failures, no OpenRouter dependency, no routing complexity.

5. **No dependency on third-party routers.** Eliminates the need for OpenRouter, ClawRouter, or LiteLLM proxy layers. Fewer moving parts, fewer points of failure.

6. **Data privacy simplicity.** All data stays with one provider under one data processing agreement. No tokens flowing through intermediary routing services.

**What we give up:**

- DeepSeek V3 worker agents at ~$0.27/M input (vs Haiku at $0.80/M) — roughly 3x cost increase on budget-tier tasks
- Local Qwen for zero-cost heartbeats — Haiku heartbeats will cost ~$0.001 per check
- The theoretical $6/month squad becomes roughly $15-25/month — still well within budget

**Why the tradeoff is acceptable:**

The cost difference between multi-vendor ($6-10/month) and all-Anthropic ($15-25/month) is $10-15/month. For that price, we get architectural simplicity, one vendor relationship, consistent model behaviour, and automatic improvement as Anthropic releases cheaper/smarter models. The squad's daily budget of $0.35 accommodates the all-Anthropic approach comfortably.

---

## Current Squad Configuration

The squad configs already implement this strategy. No changes needed.

### Department Squad (`squads/department/openclaw.json5`)

| Agent | Model | Tier |
|-------|-------|------|
| Lead (CEO) | Opus 4.6 | Premium |
| Bookkeeper | Sonnet 4.6 (default) | Pro |
| Ops Manager | Sonnet 4.6 (default) | Pro |
| Content Creator | Sonnet 4.6 (default) | Pro |
| Sales Rep | Sonnet 4.6 (default) | Pro |
| Client Manager | Sonnet 4.6 (default) | Pro |
| Support Agent | **Haiku 4.5** | Budget |

### Operator and Marketing Machine Squads

Same pattern: Lead on Opus, all workers on Sonnet (default), with Haiku available for high-volume roles.

---

## Recommended Haiku Expansion

Currently only the Support Agent uses Haiku. Other agents that could benefit from Haiku (speed + cost savings, with Sonnet as fallback):

| Agent | Current | Recommended | Rationale |
|-------|---------|-------------|-----------|
| Support Agent | Haiku 4.5 | Keep as-is | High-volume, simple routing — Haiku is ideal |
| Heartbeat checks | Sonnet 4.6 | Haiku 4.5 | Status checks don't need Pro intelligence |
| Data Analyst (simple queries) | Sonnet 4.6 | Haiku 4.5 | Basic data extraction and formatting |
| Social Media Manager | Sonnet 4.6 | Consider Haiku | High-volume posting, Lead reviews output anyway |

The Lead's quality gate means Haiku workers produce the same final output quality — the Lead (on Opus) synthesises and reviews everything before it reaches the client.

---

## Fallback Chain

```
Opus 4.6 (Premium)
  └── fallback → Sonnet 4.6 (Pro)
        └── fallback → Haiku 4.5 (Budget)
```

All within the Anthropic family. No cross-provider auth failures possible.

---

## Cost Projection: All-Anthropic vs Multi-Vendor

### 14-Agent Squad — Monthly Estimate

| Approach | Lead | Workers (12) | Monitor (1) | Total |
|----------|------|-------------|-------------|-------|
| **Multi-vendor** (Doc 03) | Sonnet: $2.25 | DeepSeek/Gemini: $4.20 | Local Qwen: $0.00 | ~$6.45 |
| **All-Anthropic** | Opus: $4.50 | Sonnet (8) + Haiku (4): $12.00 | Haiku: $0.30 | ~$16.80 |

Delta: ~$10/month. The simplicity premium.

---

## Escalation Policy (Unchanged)

The escalation principle from Doc 03 still applies within the Anthropic family:

1. **Default to cheapest viable tier.** Haiku for simple tasks, Sonnet for standard work.
2. **Escalate on low confidence.** If Haiku reports < 80% confidence, escalate to Sonnet. If Sonnet struggles, escalate to Opus.
3. **One retry maximum.** One failed attempt on current tier, then escalate immediately. No retry loops.
4. **Lead as quality gate.** The Lead (Opus) reviews all worker output. Worker tier affects speed and cost, not final quality.

---

## When to Revisit This Decision

- **Anthropic releases a model cheaper than Haiku** — expand Budget tier usage
- **Anthropic pricing drops significantly** — may enable Sonnet for all agents including heartbeats
- **A competitor offers dramatically better price/performance** — re-evaluate, but the simplicity premium would need to be overcome by >50% cost savings
- **Squad scales beyond 20 agents** — cost pressure may warrant reintroducing budget models from other providers for the lowest-tier tasks

---

## Relationship to Other Research Notes

| Note | Impact |
|------|--------|
| 03 — API Cost Optimization | Multi-vendor tiering remains valid strategy; this decision chooses single-vendor variant |
| 07 — Hybrid Local + Cloud | Local models no longer needed for cost tier; hybrid approach archived for reference |
| 18 — Model Migration | Alias/abstraction architecture still essential — enables future Anthropic model upgrades with one config change |
| 19 — Tool Access Tiering | Unchanged — tool permissions are model-independent |
| 21 — Lead CEO Responsibility | Reinforced — Lead on Opus is the quality gate for all Haiku/Sonnet worker output |

---

*Decision made March 2026. Revisit quarterly or when Anthropic releases new model tiers.*
