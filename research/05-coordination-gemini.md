This is a phenomenal area of focus for your OpenClaw squad. The shift from rigid, programmatic LangChain-style pipelines to loose routing is the defining architectural change of 2026. Developers moving past local toys into always-on, multi-channel VPS deployments (like those on LumaDock) are realizing that hard-coded agent orchestration breaks at scale.
Here is the definitive deep dive into OpenClaw's Topic 5: Multi-agent coordination patterns, synthesized from the absolute latest official docs, the Meta-Intelligence guide, and production reports from top GitHub/Reddit practitioners.

1. Loose vs. Rigid Coordination Patterns
In early 2025, the standard was "ping-pong" pipelines: an LLM was put in charge of deciding when to pass the baton, leading to infinite debate loops and blown token budgets. By March 2026, the community standard is deterministic loose routing.
Feature
Rigid Pipelines (Anti-Pattern)
Loose Routing (2026 OpenClaw Standard)
Flow Control
LLM-driven orchestration (LLM decides next step).
Deterministic routing (sessions_send) via Lead agent.
State
Crammed entirely into the context window.
Shared via lightweight workspace files (plan.md).
Agent Lifespan
Long-running, conversational sub-agents.
Stateless workers that auto-archive upon task completion.
Failure Mode
"Ping-pong" debates, infinite recursion hell.
Sub-agent times out or fails; Lead cleanly reassigns.
Why loose routing wins: It relies on an event-driven state machine rather than hoping an LLM will gracefully manage the execution loop. It drastically reduces broadcast noise and prevents contextual contamination.
2. The Lead-as-CEO Coordination Role
In a successful multi-agent squad, you never have a democracy. You have a Lead-as-CEO.
The Lead receives the user request, decomposes it into sub-tasks, delegates to specialists, and synthesizes the final output.
* Memory Ownership: The Lead is the only agent that has write access to the private MEMORY.md.
* Stateless Workers: Specialists (like a coder or a researcher) have their memory explicitly disabled in openclaw.json ("memory": { "enabled": false }). This prevents them from accumulating context across tasks that pollutes future runs.
* Tool Tiering: The Lead holds the coordination tools (sessions_send, read, write). Specialists are granted only the tools they need to execute their specific task (e.g., web_search or exec).
Plaintext



                  [ Incoming Request (WhatsApp/Slack) ]
                                   │
                                   ▼
                         +-------------------+
                         |  LEAD AGENT (CEO) | <--- Reads/Writes MEMORY.md
                         |  (Pro Tier Model) | <--- Updates plan.md & status.md
                         +-------------------+
                                   │
              sessions_send(agent:specialist:task_id)
                                   │
                   +───────────────┴───────────────+
                   ▼                               ▼
            [Researcher]                      [Coder]
            (Stateless)                       (Stateless)
            (Fast/Cheap Model)                (Fast/Cheap Model)
                   │                               │
                   +───────────────┬───────────────+
                                   │ Returns summary payload
                                   ▼
                         +-------------------+
                         |  LEAD AGENT (CEO) | ---> Synthesizes & Replies
                         +-------------------+
3. Delegation Rules & Depth Limits
The number one failure mode reported in awesome-openclaw-coordination is "recursion hell," where a sub-agent sends a task back to the Lead, creating an infinite loop.
To solve this, 2026 configurations enforce strict depth limits:
* maxSpawnDepth: 1: The Lead can delegate to a specialist, but the specialist cannot delegate to another agent.
* One-way flow: No lateral communication. A researcher agent cannot talk directly to a coder agent unless specifically designed in a peer-to-peer adversarial setup (which requires extreme care). They must report back to the Lead.
4. sessions_send and Opt-In Messaging
Instead of broadcasting messages to a shared channel (which wastes tokens and causes multi-agent hallucination), OpenClaw uses addressable sessions.
The sessions_send tool allows the Lead to ping an agent directly using coordinates: agent:<agentId>:<project-id>.
Example sessions_send syntax:
JavaScript



sessions_send(
  "agent:research-specialist:project-alpha",
  "Find the latest LumaDock API rate limits. Return a 3-bullet summary and terminate.",
  300 // timeout in seconds
)
Note: Because this is routed explicitly, it bypasses the channel entirely, happening strictly within the OpenClaw Gateway.
5. Shared Lightweight Files for Handoffs
In the ~/.openclaw/workspace/ directory, agents share state using append-only or strictly formatted lightweight files. This is your "shared plan.md" concept.
* goal.md: The master objective (Written by Lead).
* plan.md: The execution breakdown and subtask assignments (Written by Lead).
* status.md: Current state of subtasks ([ ] pending, [x] complete, [!] blocked).
* log.md: Append-only execution trace for auditing.
plan.md Template:
Markdown



# Current SPRINT_CURRENT
## Task: Implement Redis Cache
- [x] Researcher: Identify Redis connection limits (Completed via agent:research:12)
- [ ] Coder: Implement connection pooling in src/db.ts (Delegated to agent:coder:13)
- [ ] Reviewer: Pending coder completion
6. Channel Bindings System
Bindings map specific agentIds to specific channels (e.g., Discord, WhatsApp, Telegram). The requireMention rule is critical for shared groups:
Code snippet



// openclaw.json
{
  "bindings": [
    {
      "agentId": "lead-ceo",
      "channel": "discord",
      "guildId": "123456789",
      "requireMention": true, // Only wakes up if @Lead is pinged
      "priority": 100 // Most-specific-first routing
    },
    {
      "agentId": "background-scout",
      "channel": "local", // No external chat interface
      "priority": 10
    }
  ]
}
7. Real 2026 Production Examples
A. shenhao-stu 9-Agent Team (Adversarial Collaboration)
This highly popular GitHub setup uses 8 sub-agents (Planner, Ideator, Critic, Surveyor, Coder, Writer, Reviewer, Scout) and 1 main Lead. It famously uses adversarial tension—the Ideator and Critic are bound to the same task queue, where the Critic enforces "SHARP taste gates" before allowing the Lead to synthesize the Ideator's work. It deploys via a BOOTSTRAP.md self-merge.
B. Pantheon 14-Agent Squad
A research-heavy architecture built for data ingestion. The Lead orchestrates specialized workers handling the Scholar API, SEC filings, and Twitter streams. The key here is Cost Optimization: The Lead runs on an expensive, high-reasoning model (like Gemini 3.1 Pro), while the 13 extraction specialists run on highly constrained, cheap models (like Gemini 3 Flash or Claude 3.5 Haiku).
C. LumaDock 19-Agent Fleet
Running on an AMD EPYC VPS, this setup uses Docker sandboxing to isolate tool execution. The Lead orchestrates a massive parallel pipeline where multiple instances of a summarizer agent process disparate data streams simultaneously, writing directly to SHARED_KNOWLEDGE.json without ever communicating directly with one another.
8. Step-by-Step Setup Commands
Here is the practical workflow to establish this architecture from your CLI:
1. Create the specialized workspace:
Bash



openclaw workspace init --dir ~/.openclaw/workspace/squad-alpha
2. Generate the agents:
Bash



openclaw agents add lead --model "gemini-3.1-pro" --tools "sessions_send,read,write,memory_search"
openclaw agents add coder --model "gemini-3-flash" --tools "exec,read,write" --no-memory
3. Configure channel bindings:
Bash



openclaw channels bind lead --channel discord --require-mention true
openclaw channels bind coder --channel local
4. Deploy the Gateway:
Bash



openclaw gateway start --workspace ~/.openclaw/workspace/squad-alpha

Would you like me to draft a specific openclaw.json configuration tailored to your squad's exact model routing and tool permissions?
If you want to see a practical walkthrough of setting up an isolated squad environment and figuring out the rough edges of local hosting, Building a Team of AI Agents covers the strategic hardware, security, and interface decisions needed for OpenClaw.