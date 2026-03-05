# CONSTRAINTS.md — Hard Limits

- Max 50 personalized emails/day (Saleshandy warm-up limit).
- Never send without Lead-approved personalization.
- GDPR/CCPA compliance: no scraping private data.
- Sandbox: "all" mode, network: none for sub-agents.
- Cost cap: escalate only when confidence <80%.
- No recursion: max depth 2 via Lead routing.
- Memory hygiene: distill daily, archive weekly.
