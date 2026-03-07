#!/usr/bin/env node
// Run: node scripts/post-project-update.mjs
// Posts a full project highlights summary to Discord channels

const ACTIVITY_LOG = "https://discord.com/api/webhooks/1479942096453501048/7A17tb2b0sqPri6GzI69_0gQUUiioIQTMvnLTuTPSxdQOOVL-m-DfA2sYBGbcv3VCOtR";
const ANNOUNCEMENTS = "https://discord.com/api/webhooks/1479942525262495835/EpvY636dvTrbmGdo6yfjMDsQTtks7CyBb9ct0ohr6KcsvfzNeO2IGB7v4tWc2fKp5UHm";
const AGENT_STATUS = "https://discord.com/api/webhooks/1479942608544464948/IhMjQwoLF328qEGB8pGZNngYP3yj4NaAzBz4ggBOm5ca80XDOaYiUxS-z0AnhTQuXXyu";

async function post(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error(`  ❌ HTTP ${res.status}: ${await res.text()}`);
  } else {
    console.log(`  ✅ Posted successfully`);
  }
  // Rate limit: wait 500ms between posts
  await new Promise((r) => setTimeout(r, 500));
}

async function main() {
  console.log("\n🚀 Posting OpenClaw Squad project highlights to Discord...\n");

  // ── #announcements — Big Picture Summary ──
  console.log("📢 Posting to #announcements...");
  await post(ANNOUNCEMENTS, {
    username: "IntegrateAI HQ",
    embeds: [
      {
        title: "🚀 OpenClaw Squad — Project Highlights (3-7 Mar 2026)",
        description:
          "Full summary of everything built this week. From zero to a production-ready AI consultancy platform in 5 days.",
        color: 3066993,
        fields: [
          {
            name: "📚 21 Research Topics Completed",
            value:
              "Deep research across folder structure, skills, API costs, security, coordination, prompt engineering, context management, error recovery, testing, compliance, and more. Every topic synthesised from Opus + Grok + Gemini.",
          },
          {
            name: "🤖 14 Elite Agent Blueprints Built",
            value:
              "Lead CEO, Content Creator, Sales Rep, Client Manager, Bookkeeper, Ops Manager, Support Agent, 4x Marketing specialists, Strategist, Engineer, Compliance Officer. Each with full 8-file config.",
          },
          {
            name: "🏗️ 3 Squad Deployment Templates",
            value:
              "Operator Squad, Department Squad, Marketing Machine — ready to deploy for any client.",
          },
          {
            name: "📋 Client Pipeline System",
            value:
              "Discovery assessment, squad router, onboarding packet — end-to-end client intake flow built.",
          },
          {
            name: "🏢 IntegrateAI Advisors Configured",
            value:
              "Our own 8-agent squad fully configured and deployed. Ops guide, Notion workspace, Discord server, CI/CD — all live.",
          },
        ],
        footer: { text: "42 PRs merged | 100+ commits | 5 days" },
      },
    ],
  });

  // ── #activity-log — Detailed Timeline ──
  console.log("📋 Posting to #activity-log (Part 1)...");
  await post(ACTIVITY_LOG, {
    username: "OpenClaw Squad — Activity Log",
    embeds: [
      {
        title: "📅 Day 1-2: Research & Foundation (3-4 Mar)",
        color: 3447003,
        fields: [
          {
            name: "✅ Completed",
            value: [
              "• Initialised ADR + Research Repo + Living Spec (21 topics)",
              "• Synthesised Topics 01-04: folder structure, skills, API costs, independence",
              "• Completed Topics 05-21: coordination, security, hybrid setups, prompt engineering, context windows, error recovery, personality tuning, scalability, audit/observability, tool chaining, backup/rollback, testing, legal/compliance, future-proofing, tool access, agent evolution, Lead-as-CEO",
              "• **All 21 research topics done** — master docs from multi-AI synthesis",
            ].join("\n"),
          },
          {
            name: "PRs",
            value: "#1 through #24 merged",
            inline: true,
          },
        ],
      },
      {
        title: "📅 Day 3: Squad Architecture (4-5 Mar)",
        color: 10181046,
        fields: [
          {
            name: "✅ Completed",
            value: [
              "• Root README + squad blueprints folder",
              "• First blueprint: Elite Software/App Team",
              "• Full role definitions: Lead CEO, Product Strategist, Product Designer, System Architect, Full-Stack Engineer, Ops Guardian, Growth Specialist",
              "• Each role: deep research + elite population (all 8 files)",
              "• Department-based structure with numbered subfolders",
            ].join("\n"),
          },
          {
            name: "PRs",
            value: "#25 through #35 merged",
            inline: true,
          },
        ],
      },
    ],
  });

  console.log("📋 Posting to #activity-log (Part 2)...");
  await post(ACTIVITY_LOG, {
    username: "OpenClaw Squad — Activity Log",
    embeds: [
      {
        title: "📅 Day 4: Department Population & Restructure (5 Mar)",
        color: 16776960,
        fields: [
          {
            name: "✅ Completed",
            value: [
              "• Sales SDR/BDR agent — full config",
              "• Marketing — elite 5-role squad setup",
              "• All 8 remaining departments populated to elite standard",
              "• Major restructure: single `agents/` folder as source of truth",
              "• Analysis: identified what was wrong with v1 department system",
            ].join("\n"),
          },
          {
            name: "PRs",
            value: "#36 through #42 merged",
            inline: true,
          },
        ],
      },
      {
        title: "📅 Day 5: The Rebuild — Consultancy Model (6 Mar)",
        color: 15105570,
        fields: [
          {
            name: "✅ Completed",
            value: [
              "• Stripped v1 department system entirely",
              "• Established consultancy mission + universal agent library",
              "• Built **14-agent roster** organised by department",
              "• Core Four: Lead, Content Creator, Sales Rep, Client Manager",
              "• Tier 2: Bookkeeper, Ops Manager, Support Agent",
              "• Marketing: 4 specialist agents",
              "• Specialists: Strategist, Engineer, Compliance Officer",
              "• 3 squad deployment templates (Operator, Department, Marketing Machine)",
              "• Operational docs: Deployment Playbook, Skills Blueprint, Testing Checklist",
              "• Client discovery pipeline: assessment → router → onboarding",
              "• All cost estimates fixed to Doc 03 optimisation methodology",
              "• Research note 26: All-Anthropic model strategy decision",
            ].join("\n"),
          },
        ],
      },
    ],
  });

  console.log("📋 Posting to #activity-log (Part 3)...");
  await post(ACTIVITY_LOG, {
    username: "OpenClaw Squad — Activity Log",
    embeds: [
      {
        title: "📅 Day 5-6: IntegrateAI Launch & Infra (6-7 Mar)",
        color: 3066993,
        fields: [
          {
            name: "✅ Completed",
            value: [
              "• Chad Pickard Studio discovery assessment completed",
              "• Business renamed to **IntegrateAI Advisors**",
              "• Lead CEO agent configured for IntegrateAI",
              "• All 7 specialist agents configured",
              "• Founder info + domain fixed across all 8 agents",
              "• Operations & tooling guide (£0/mo stack)",
              "• Notion workspace setup script (CRM, Launch Checklist, Decision Log)",
              "• GitHub Actions workflow for Notion setup",
              "• Team activity log + comms strategy (switched from Notion → Discord)",
              "• Discord bot built for IntegrateAI HQ server",
              "• One-shot Discord server setup script (4 categories, 11 channels)",
              "• **GitHub Actions → Discord notifications workflow** (auto-posts commits, PRs, issues, CI results)",
              "• Discord webhook secrets configured via GitHub API",
            ].join("\n"),
          },
          {
            name: "PRs",
            value: "42 total PRs merged to date",
            inline: true,
          },
        ],
      },
    ],
  });

  // ── #agent-status — Current System Status ──
  console.log("🤖 Posting to #agent-status...");
  await post(AGENT_STATUS, {
    username: "CI/CD Status",
    embeds: [
      {
        title: "✅ System Status — All Systems Operational",
        color: 3066993,
        fields: [
          {
            name: "📦 Repo",
            value: "openclaw-squad — 100+ commits, 42 PRs merged",
            inline: true,
          },
          {
            name: "🤖 Agents",
            value: "14 blueprints + 8 deployed (IntegrateAI)",
            inline: true,
          },
          {
            name: "🔧 Infrastructure",
            value: [
              "• Discord bot: ✅ Built",
              "• Discord channels: ✅ 11 channels across 4 categories",
              "• Discord notifications: ✅ GitHub Actions → webhooks",
              "• Notion workspace: ✅ Setup script ready",
              "• GitHub Actions: ✅ 2 workflows configured",
              "• GitHub Secrets: ✅ 3 webhook URLs stored",
            ].join("\n"),
          },
          {
            name: "📋 What's Next",
            value:
              "Ready for client deployments. Squad templates, agent library, and client pipeline all operational.",
          },
        ],
        footer: { text: "Last updated: 7 Mar 2026" },
      },
    ],
  });

  console.log("\n🎉 All updates posted to Discord!\n");
}

main().catch(console.error);
