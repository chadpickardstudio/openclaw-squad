#!/usr/bin/env node
/**
 * IntegrateAI Advisors — Notion Workspace Setup
 *
 * Creates three core databases in your Notion workspace:
 *   1. CRM / Client Pipeline
 *   2. Launch Checklist (pre-populated from operations/04-launch-checklist.md)
 *   3. Decision Log    (pre-populated from operations/05-decision-log.md)
 *
 * Prerequisites:
 *   1. Create a Notion integration at https://www.notion.so/my-integrations
 *   2. Share a parent page with your integration (click ··· → Connections → Add your integration)
 *   3. Copy the parent page ID from its URL (the 32-char hex after the workspace name)
 *
 * Usage:
 *   NOTION_API_KEY=ntn_xxx NOTION_PARENT_PAGE=<page-id> node scripts/setup-notion.mjs
 *
 * Or if you have a .env file:
 *   node scripts/setup-notion.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Try loading .env manually (no dependencies needed)
try {
  const envPath = resolve(__dirname, "..", ".env");
  const envFile = readFileSync(envPath, "utf8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.+)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
} catch {
  // .env is optional
}

const NOTION_API_KEY = process.env.NOTION_API_KEY;
let NOTION_PARENT_PAGE = process.env.NOTION_PARENT_PAGE;

if (!NOTION_API_KEY) {
  console.error("✗ NOTION_API_KEY is required. Set it in .env or as an env var.");
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function notionRequest(method, endpoint, body) {
  const opts = { method, headers: HEADERS };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, opts);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API ${res.status}: ${err}`);
  }
  return res.json();
}

async function findOrCreateParentPage() {
  // Search for an existing "IntegrateAI HQ" page
  const search = await notionRequest("POST", "/search", {
    query: "IntegrateAI HQ",
    filter: { value: "page", property: "object" },
    page_size: 5,
  });

  const existing = search.results.find(
    (p) => p.object === "page" && !p.archived
  );

  if (existing) {
    console.log(`  Found existing parent page: ${existing.url}`);
    return existing.id;
  }

  // Create a new top-level page (the integration must have workspace-level access)
  // Try searching for ANY page we have access to and use it as context
  const anyPage = await notionRequest("POST", "/search", {
    filter: { value: "page", property: "object" },
    page_size: 1,
  });

  if (anyPage.results.length > 0) {
    // Create as a child of the first accessible page
    const parent = anyPage.results[0];
    const page = await notionRequest("POST", "/pages", {
      parent: { page_id: parent.id },
      icon: { type: "emoji", emoji: "🏢" },
      properties: {
        title: { title: richText("IntegrateAI HQ") },
      },
    });
    console.log(`  Created parent page: ${page.url}`);
    return page.id;
  }

  // No pages found — user needs to share a page with the integration
  console.error("✗ No pages accessible. Share a page with your Notion integration first.");
  console.error("  1. Open any Notion page");
  console.error("  2. Click ··· → Connections → Add your integration");
  console.error("  3. Run this script again");
  process.exit(1);
}

async function notionPost(endpoint, body) {
  return notionRequest("POST", endpoint, body);
}

function richText(text) {
  return [{ type: "text", text: { content: text } }];
}

// ---------------------------------------------------------------------------
// 1. CRM / Client Pipeline
// ---------------------------------------------------------------------------

async function createCRM() {
  console.log("\n→ Creating CRM / Client Pipeline...");

  const db = await notionPost("/databases", {
    parent: { type: "page_id", page_id: NOTION_PARENT_PAGE },
    icon: { type: "emoji", emoji: "🎯" },
    title: richText("CRM — Client Pipeline"),
    properties: {
      Name: { title: {} },
      Status: {
        select: {
          options: [
            { name: "Lead", color: "gray" },
            { name: "Contacted", color: "blue" },
            { name: "Discovery Call", color: "purple" },
            { name: "Assessment Sent", color: "yellow" },
            { name: "Proposal Sent", color: "orange" },
            { name: "Closed Won", color: "green" },
            { name: "Closed Lost", color: "red" },
          ],
        },
      },
      Contact: { email: {} },
      Phone: { phone_number: {} },
      Business: { rich_text: {} },
      Vertical: {
        select: {
          options: [
            { name: "Hospitality", color: "orange" },
            { name: "Trades", color: "blue" },
            { name: "Health & Wellness", color: "green" },
            { name: "Recruitment", color: "purple" },
            { name: "Legal", color: "gray" },
            { name: "Retail / E-commerce", color: "yellow" },
            { name: "Other", color: "default" },
          ],
        },
      },
      "Squad Type": {
        select: {
          options: [
            { name: "The Operator", color: "blue" },
            { name: "The Department", color: "purple" },
            { name: "The Marketing Machine", color: "orange" },
          ],
        },
      },
      "Monthly Value (£)": { number: { format: "pound" } },
      Owner: {
        select: {
          options: [
            { name: "Chad", color: "blue" },
            { name: "Paul", color: "green" },
          ],
        },
      },
      Location: { rich_text: {} },
      "Source": {
        select: {
          options: [
            { name: "Referral", color: "green" },
            { name: "LinkedIn", color: "blue" },
            { name: "Website", color: "purple" },
            { name: "Local Networking", color: "orange" },
            { name: "Cold Outreach", color: "gray" },
          ],
        },
      },
      "Next Action": { rich_text: {} },
      "Follow-up Date": { date: {} },
      Notes: { rich_text: {} },
    },
  });

  console.log(`  ✓ CRM created: ${db.url}`);
  return db.id;
}

// ---------------------------------------------------------------------------
// 2. Launch Checklist
// ---------------------------------------------------------------------------

async function createLaunchChecklist() {
  console.log("\n→ Creating Launch Checklist...");

  const db = await notionPost("/databases", {
    parent: { type: "page_id", page_id: NOTION_PARENT_PAGE },
    icon: { type: "emoji", emoji: "🚀" },
    title: richText("Launch Checklist"),
    properties: {
      Task: { title: {} },
      Status: {
        select: {
          options: [
            { name: "Not Started", color: "gray" },
            { name: "In Progress", color: "blue" },
            { name: "Done", color: "green" },
            { name: "Blocked", color: "red" },
          ],
        },
      },
      Owner: {
        select: {
          options: [
            { name: "Chad", color: "blue" },
            { name: "Paul", color: "green" },
            { name: "Squad", color: "purple" },
            { name: "Chad + Paul", color: "orange" },
          ],
        },
      },
      Week: {
        select: {
          options: [
            { name: "Week 1: Foundation", color: "blue" },
            { name: "Week 2: Channels & Tools", color: "purple" },
            { name: "Week 3: Communication & Automation", color: "orange" },
            { name: "Week 4: Internal & Launch", color: "green" },
          ],
        },
      },
      Category: {
        select: {
          options: [
            { name: "Domain & Website", color: "blue" },
            { name: "Blog & Newsletter", color: "purple" },
            { name: "Analytics & SEO", color: "green" },
            { name: "Local SEO", color: "orange" },
            { name: "Social Media", color: "pink" },
            { name: "CRM & Sales", color: "yellow" },
            { name: "Design", color: "red" },
            { name: "Team Communication", color: "blue" },
            { name: "Automation", color: "purple" },
            { name: "Invoicing", color: "gray" },
            { name: "Video", color: "orange" },
            { name: "Notion Setup", color: "green" },
            { name: "Squad Configuration", color: "blue" },
            { name: "Go Live", color: "green" },
          ],
        },
      },
      "Due Date": { date: {} },
      Notes: { rich_text: {} },
    },
  });

  console.log(`  ✓ Launch Checklist created: ${db.url}`);

  // Pre-populate with tasks from the checklist
  const tasks = [
    // Week 1: Foundation
    { task: "Verify integrate-ai.uk DNS records for Vercel", owner: "Chad", week: "Week 1: Foundation", cat: "Domain & Website" },
    { task: "Add Cal.com booking widget to website", owner: "Chad", week: "Week 1: Foundation", cat: "Domain & Website" },
    { task: "Add Beehiiv email capture form to website", owner: "Chad", week: "Week 1: Foundation", cat: "Domain & Website" },
    { task: "Create 3-5 location-specific landing pages (Witney, Oxford, Cheltenham, Cotswolds, Banbury)", owner: "Chad", week: "Week 1: Foundation", cat: "Domain & Website" },
    { task: "Create Beehiiv account (Launch plan — free)", owner: "Chad", week: "Week 1: Foundation", cat: "Blog & Newsletter" },
    { task: "Connect custom domain to Beehiiv", owner: "Chad", week: "Week 1: Foundation", cat: "Blog & Newsletter" },
    { task: "Set up SPF, DKIM, DMARC records", owner: "Chad", week: "Week 1: Foundation", cat: "Blog & Newsletter" },
    { task: "Set up subscriber welcome email", owner: "Chad", week: "Week 1: Foundation", cat: "Blog & Newsletter" },
    { task: "Create first 3 blog posts (local angle)", owner: "Squad", week: "Week 1: Foundation", cat: "Blog & Newsletter" },
    { task: "Create GA4 property + install tracking", owner: "Chad", week: "Week 1: Foundation", cat: "Analytics & SEO" },
    { task: "Set up Google Search Console + verify + submit sitemap", owner: "Chad", week: "Week 1: Foundation", cat: "Analytics & SEO" },
    { task: "Sign up for Ahrefs Webmaster Tools + verify domain", owner: "Chad", week: "Week 1: Foundation", cat: "Analytics & SEO" },
    { task: "Create Google Keyword Planner account", owner: "Chad", week: "Week 1: Foundation", cat: "Analytics & SEO" },
    { task: "Set up Microsoft Clarity + install tracking", owner: "Chad", week: "Week 1: Foundation", cat: "Analytics & SEO" },
    { task: "Create Looker Studio dashboard", owner: "Chad", week: "Week 1: Foundation", cat: "Analytics & SEO" },

    // Week 2: Channels & Tools
    { task: "Claim Google Business Profile", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Local SEO" },
    { task: "Add photos, services, hours, description to GBP", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Local SEO" },
    { task: "Get listed on Yell.com, FreeIndex, Yelp UK", owner: "Chad + Paul", week: "Week 2: Channels & Tools", cat: "Local SEO" },
    { task: "Join local Facebook business groups", owner: "Chad + Paul", week: "Week 2: Channels & Tools", cat: "Local SEO" },
    { task: "Register with West Oxfordshire Chamber of Commerce", owner: "Chad + Paul", week: "Week 2: Channels & Tools", cat: "Local SEO" },
    { task: "Create LinkedIn company page", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Social Media" },
    { task: "Optimise personal LinkedIn profiles", owner: "Chad + Paul", week: "Week 2: Channels & Tools", cat: "Social Media" },
    { task: "Create X/Twitter, Instagram, Facebook, TikTok accounts", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Social Media" },
    { task: "Connect LinkedIn, X, Instagram to Buffer (3 free channels)", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Social Media" },
    { task: "Create HubSpot account (free CRM)", owner: "Chad", week: "Week 2: Channels & Tools", cat: "CRM & Sales" },
    { task: "Set up HubSpot pipeline stages", owner: "Chad", week: "Week 2: Channels & Tools", cat: "CRM & Sales" },
    { task: "Create Cal.com account + 30-min discovery call event", owner: "Chad", week: "Week 2: Channels & Tools", cat: "CRM & Sales" },
    { task: "Connect Cal.com to Google Calendar", owner: "Chad", week: "Week 2: Channels & Tools", cat: "CRM & Sales" },
    { task: "Add booking link to website", owner: "Chad", week: "Week 2: Channels & Tools", cat: "CRM & Sales" },
    { task: "Create Canva account", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Design" },
    { task: "Set up brand kit (logo, colours, fonts)", owner: "Chad", week: "Week 2: Channels & Tools", cat: "Design" },
    { task: "Create social media templates", owner: "Squad", week: "Week 2: Channels & Tools", cat: "Design" },

    // Week 3: Communication & Automation
    { task: "Create Discord server", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Team Communication" },
    { task: "Set up Discord channels: #general, #content, #social, #sales, #analytics, #ops, #founder-only", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Team Communication" },
    { task: "Configure Discord bot/agent integrations", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Team Communication" },
    { task: "Paul: join Discord server + review channel structure", owner: "Paul", week: "Week 3: Communication & Automation", cat: "Team Communication" },
    { task: "Create Make.com account", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Automation" },
    { task: "Set up workflow: form submission → HubSpot contact", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Automation" },
    { task: "Set up workflow: new blog post → social share", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Automation" },
    { task: "Create Wave account", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Invoicing" },
    { task: "Set up branded invoice template", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Invoicing" },
    { task: "Configure payment methods", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Invoicing" },
    { task: "Install OBS Studio", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Video" },
    { task: "Create YouTube channel for unlisted demo uploads", owner: "Chad", week: "Week 3: Communication & Automation", cat: "Video" },

    // Week 4: Internal & Launch
    { task: "Create Notion workspace", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Import operations plans from repo", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Set up content calendar in Notion", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Set up client tracker in Notion", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Set up meeting notes template", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Paul: review Notion workspace + add missing items", owner: "Paul", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Share Notion workspace with Paul", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Notion Setup" },
    { task: "Configure all 8 agents with updated tool access", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Squad Configuration" },
    { task: "Update agent TOOLS.md files to reference new stack", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Squad Configuration" },
    { task: "Test agent squad with sample tasks", owner: "Chad", week: "Week 4: Internal & Launch", cat: "Squad Configuration" },
    { task: "Review all accounts and access", owner: "Chad + Paul", week: "Week 4: Internal & Launch", cat: "Go Live" },
    { task: "Agree on pricing strategy", owner: "Chad + Paul", week: "Week 4: Internal & Launch", cat: "Go Live" },
    { task: "Identify first 10 warm leads from personal networks", owner: "Chad + Paul", week: "Week 4: Internal & Launch", cat: "Go Live" },
    { task: "Begin prospecting and content creation", owner: "Squad", week: "Week 4: Internal & Launch", cat: "Go Live" },
    { task: "Log launch decision in decision log", owner: "Chad + Paul", week: "Week 4: Internal & Launch", cat: "Go Live" },
  ];

  console.log(`  → Populating ${tasks.length} tasks...`);

  // Batch in groups of 3 to avoid rate limits
  for (let i = 0; i < tasks.length; i += 3) {
    const batch = tasks.slice(i, i + 3);
    await Promise.all(
      batch.map((t) =>
        notionPost("/pages", {
          parent: { database_id: db.id },
          properties: {
            Task: { title: richText(t.task) },
            Status: { select: { name: "Not Started" } },
            Owner: { select: { name: t.owner } },
            Week: { select: { name: t.week } },
            Category: { select: { name: t.cat } },
          },
        })
      )
    );
  }

  console.log(`  ✓ ${tasks.length} tasks populated`);
  return db.id;
}

// ---------------------------------------------------------------------------
// 3. Decision Log
// ---------------------------------------------------------------------------

async function createDecisionLog() {
  console.log("\n→ Creating Decision Log...");

  const db = await notionPost("/databases", {
    parent: { type: "page_id", page_id: NOTION_PARENT_PAGE },
    icon: { type: "emoji", emoji: "📋" },
    title: richText("Decision Log"),
    properties: {
      Decision: { title: {} },
      Date: { date: {} },
      Rationale: { rich_text: {} },
      "Decided By": {
        select: {
          options: [
            { name: "Chad", color: "blue" },
            { name: "Paul", color: "green" },
            { name: "Both", color: "purple" },
          ],
        },
      },
      Category: {
        select: {
          options: [
            { name: "Tech Stack", color: "blue" },
            { name: "Go-to-Market", color: "green" },
            { name: "Pricing", color: "orange" },
            { name: "Product", color: "purple" },
            { name: "Operations", color: "gray" },
            { name: "Hiring", color: "yellow" },
          ],
        },
      },
      "Reference Doc": { rich_text: {} },
    },
  });

  console.log(`  ✓ Decision Log created: ${db.url}`);

  // Pre-populate existing decisions
  const decisions = [
    {
      decision: "Approved £0/mo launch stack",
      date: "2026-03-07",
      rationale: "Free tools cover all launch needs. No reason to pay for Ghost/Framer/Zapier when Beehiiv/Vercel/Make.com are free.",
      decidedBy: "Chad",
      category: "Tech Stack",
      ref: "operations/01-launch-stack.md",
    },
    {
      decision: "Discord over Slack for team comms",
      date: "2026-03-07",
      rationale: "Slack Free limits to 10 integrations (not enough for 8-agent squad + tools) and 90-day message history. Discord is unlimited on both.",
      decidedBy: "Chad",
      category: "Tech Stack",
      ref: "",
    },
    {
      decision: "Beehiiv over Ghost for blog + newsletter",
      date: "2026-03-07",
      rationale: "Ghost costs £9/mo with 500-member limit. Beehiiv Launch is free with 2,500 subscribers, blog, newsletter, and custom domain.",
      decidedBy: "Chad",
      category: "Tech Stack",
      ref: "",
    },
    {
      decision: "Local-first go-to-market (50-mile radius)",
      date: "2026-03-07",
      rationale: "Start with businesses near Milton under Wychwood. Face-to-face meetings, word-of-mouth, local SEO. Expand nationally after model is proven.",
      decidedBy: "Chad",
      category: "Go-to-Market",
      ref: "operations/02-target-market.md",
    },
    {
      decision: "Priority verticals: hospitality, trades, health & wellness",
      date: "2026-03-07",
      rationale: "Highest density in Cotswolds/Oxfordshire, clear pain points, low marketing maturity, right budget range.",
      decidedBy: "Chad",
      category: "Go-to-Market",
      ref: "operations/02-target-market.md",
    },
  ];

  for (const d of decisions) {
    await notionPost("/pages", {
      parent: { database_id: db.id },
      properties: {
        Decision: { title: richText(d.decision) },
        Date: { date: { start: d.date } },
        Rationale: { rich_text: richText(d.rationale) },
        "Decided By": { select: { name: d.decidedBy } },
        Category: { select: { name: d.category } },
        "Reference Doc": { rich_text: richText(d.ref) },
      },
    });
  }

  console.log(`  ✓ ${decisions.length} decisions populated`);
  return db.id;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  IntegrateAI Advisors — Notion Workspace Setup");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (!NOTION_PARENT_PAGE) {
    console.log("\n→ No NOTION_PARENT_PAGE set, auto-discovering...");
    NOTION_PARENT_PAGE = await findOrCreateParentPage();
  }

  const crmId = await createCRM();
  const checklistId = await createLaunchChecklist();
  const decisionLogId = await createDecisionLog();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  All done. Database IDs (save these):");
  console.log(`  CRM:            ${crmId}`);
  console.log(`  Launch Checklist: ${checklistId}`);
  console.log(`  Decision Log:   ${decisionLogId}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nAdd these to your .env:");
  console.log(`NOTION_CRM_DB=${crmId}`);
  console.log(`NOTION_CHECKLIST_DB=${checklistId}`);
  console.log(`NOTION_DECISIONS_DB=${decisionLogId}`);
}

main().catch((err) => {
  console.error("\n✗ Setup failed:", err.message);
  process.exit(1);
});
