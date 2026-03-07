# IntegrateAI Advisors — Operations & Tooling Guide

## Who Does What

### Founders (Chad & Paul)

| Function | What You Do | What the Squad Does |
|----------|------------|-------------------|
| **Sales** | Take discovery calls, close deals, set pricing | Squad prospects, qualifies, books calls, preps briefs |
| **Content** | Review and approve (Phase 1), set direction | Squad writes, publishes, repurposes — everything |
| **Social** | Review and approve (Phase 1) | Squad creates, schedules, engages — every platform |
| **Email** | Review sequences before launch | Squad designs, writes, segments, monitors — all of it |
| **Strategy** | Set vision and big bets | Squad plans campaigns, calendars, positioning |
| **Analytics** | Read weekly reports, make decisions | Squad tracks, reports, flags anomalies |
| **Operations** | Approve tools, manage budget | Lead agent handles squad orchestration |

### Agent Squad (8 agents)

| Agent | Daily Work | Needs Access To |
|-------|-----------|----------------|
| **Lead (CEO)** | Route tasks, review outputs, morning briefings, quality gate | Internal comms layer only |
| **Strategist (CMO)** | Content calendar, campaign briefs, channel strategy | Strategy docs, performance data |
| **Content Creator** | Blog posts, landing pages, email copy, case studies | CMS/blog, design tool |
| **Social Media Manager** | Daily posts (5 platforms), replies, engagement, trends | Social scheduler, design tool |
| **Email Marketer** | Sequences, newsletters, A/B tests, list hygiene | Email service provider (ESP) |
| **Market Researcher** | Keywords, competitor intel, content briefs, SERP tracking | SEO tool, web browser |
| **Data Analyst** | Weekly dashboards, campaign reports, anomaly detection | Google Analytics, GSC, platform analytics |
| **Sales Rep** | Prospect research, cold outreach, follow-up, pipeline | CRM, email, LinkedIn |

---

## Recommended Tech Stack

### Tier 1 — Launch Day (£30-40/month total)

These are the minimum tools to get the squad operational.

| Tool | Function | Plan | Cost | Why This One |
|------|----------|------|------|-------------|
| **Framer** | Website | Mini ($5/mo) | £5/mo | Beautiful, fast, SEO-friendly, no-code. Perfect for a consultancy landing page. Custom domain included. |
| **Ghost** | Blog + Newsletter | Starter ($9/mo) | £8/mo | Blog AND email newsletters in one tool. Built-in subscriber management. Clean, fast, SEO-optimised. |
| **HubSpot CRM** | Sales pipeline | Free | £0 | Unlimited contacts, deals, pipeline tracking. Best free CRM. Sales Rep needs this. |
| **Cal.com** | Discovery call booking | Free | £0 | Open-source Calendly alternative. Unlimited event types. Integrates with Google Calendar. |
| **Buffer** | Social scheduling | Free (3 channels) | £0 | Schedule posts on LinkedIn, X, Instagram. 10 posts per channel queued. Enough for launch. |
| **Canva** | Design (social graphics) | Free | £0 | Social media graphics, blog headers, carousels. Free tier covers 90% of needs. |
| **Google Analytics 4** | Website analytics | Free | £0 | Traffic, behaviour, conversions. Industry standard. |
| **Google Search Console** | SEO tracking | Free | £0 | Rankings, impressions, clicks, indexing. Essential. |
| **Notion** | Internal docs + tasks | Free | £0 | Content calendar, meeting notes, process docs. Free for small teams. |
| **Domain** | integrate-ai.uk | Annual | ~£10/yr | .uk domain — trustworthy for UK market. |

**Launch day total: ~£15-20/month + £10/yr domain**

---

### Tier 2 — Growth (after first 1-2 clients, £80-120/month total)

Upgrade when you're generating revenue and need more capacity.

| Tool | Function | Plan | Cost | When to Add |
|------|----------|------|------|------------|
| **Beehiiv** | Advanced email | Scale ($49/mo) | £40/mo | When you outgrow Ghost's newsletter features or need advanced automations, segmentation, and A/B testing |
| **Buffer** | Social (all channels) | Essentials ($6/channel/mo) | £30/mo | When you need to schedule across 5 channels (LinkedIn, X, Instagram, TikTok, Facebook) |
| **Canva Pro** | Advanced design | Pro ($13/mo) | £11/mo | When you need brand kit, background remover, premium templates, resize magic |
| **Ubersuggest** | SEO + keywords | Individual ($29/mo) | £24/mo | When Market Researcher needs keyword volume data, SERP analysis, competitor tracking |
| **Framer** | Website (upgraded) | Basic ($15/mo) | £13/mo | When you need CMS collections, more pages, analytics |

**Growth total: ~£80-120/month**

---

### Tier 3 — Scale (5+ clients, £200-300/month total)

Full professional stack when revenue supports it.

| Tool | Function | Plan | Cost | Why Upgrade |
|------|----------|------|------|------------|
| **Ahrefs** | Enterprise SEO | Lite ($29/mo) | £24/mo | Replaces Ubersuggest when you need backlink analysis, content gap analysis, rank tracking at scale |
| **HubSpot** | CRM (paid) | Starter ($20/mo) | £17/mo | Email integration, meeting links, sequences, reporting |
| **Later/Hootsuite** | Social (enterprise) | Pro ($25/mo) | £21/mo | Advanced scheduling, analytics, team workflows, more platforms |
| **Stripe** | Payments | Pay-as-you-go | 1.4% + 20p | When you're processing client payments |
| **Loom** | Video demos | Business ($15/mo) | £13/mo | Recorded demos for prospects, async client comms |
| **Zapier** | Automation | Starter ($20/mo) | £17/mo | Connect tools together — CRM to email, form to Slack, etc. |

---

## Tool-to-Agent Mapping

Which agent uses what:

| Agent | Launch (Tier 1) | Growth (Tier 2) | Scale (Tier 3) |
|-------|----------------|-----------------|----------------|
| **Lead** | Notion, internal files | Notion, Slack | Notion, Slack, Zapier |
| **Strategist** | Notion, GA4, GSC | + Ubersuggest data | + Ahrefs data |
| **Content Creator** | Ghost (blog), Canva | + Canva Pro | + Loom |
| **Social Media Mgr** | Buffer (free), Canva | + Buffer paid, Canva Pro | + Later/Hootsuite |
| **Email Marketer** | Ghost (newsletter) | + Beehiiv | + HubSpot email |
| **Market Researcher** | GSC, browser | + Ubersuggest | + Ahrefs |
| **Data Analyst** | GA4, GSC, platform analytics | + Ubersuggest data | + HubSpot reports |
| **Sales Rep** | HubSpot CRM (free), Cal.com | + HubSpot Starter | + Stripe, Loom |

---

## Why Ghost + Framer (Not Just One)

- **Framer** = your main website. Landing page, services page, about page. Beautiful, conversion-optimised. This is what prospects see first.
- **Ghost** = your blog + newsletter engine. SEO-optimised articles, subscriber capture, email sends. Content Creator publishes here. Email Marketer sends from here (Tier 1).

At Tier 2, when email needs get more complex (advanced automations, segmentation, A/B testing), move newsletters to **Beehiiv** and keep Ghost purely as the blog.

### Alternative: Ghost Only (Simplest)

If you want ONE tool for website + blog + email:
- **Ghost Creator ($25/mo)** handles all three
- Downside: website design not as polished as Framer
- Upside: one tool, one login, simpler

### Alternative: Framer + Beehiiv (Skip Ghost)

- **Framer** for website + blog (Framer has a blog CMS)
- **Beehiiv Free** for email (up to 1,000 subscribers)
- Downside: Framer's blog is less mature than Ghost's
- Upside: Beehiiv's email features are stronger from day one

**My recommendation: Framer + Ghost** for Tier 1. Best of both worlds at £13/month.

---

## Account Setup Checklist

### Before Squad Launch

**Domain & Hosting:**
- [ ] Register integrate-ai.uk (if not already done)
- [ ] Set up DNS records
- [ ] Configure SSL (automatic with Framer/Ghost)

**Website (Framer):**
- [ ] Create Framer account
- [ ] Connect integrate-ai.uk domain
- [ ] Build landing page (hero, services, about, CTA)
- [ ] Add Cal.com booking widget for discovery calls
- [ ] Add email capture form (connected to Ghost or Beehiiv)

**Blog (Ghost):**
- [ ] Create Ghost account (ghost.org hosted, or self-host)
- [ ] Connect blog subdomain (blog.integrate-ai.uk) or subfolder
- [ ] Configure newsletter settings
- [ ] Set up subscriber welcome email
- [ ] Add social sharing meta tags

**Analytics:**
- [ ] Create Google Analytics 4 property
- [ ] Install GA4 tracking on Framer site
- [ ] Install GA4 tracking on Ghost blog
- [ ] Set up Google Search Console
- [ ] Verify domain in GSC
- [ ] Submit sitemap

**Social Media:**
- [ ] Create LinkedIn company page (IntegrateAI Advisors)
- [ ] Create personal LinkedIn profiles if not already optimised
- [ ] Create X/Twitter account (@integrateai or similar)
- [ ] Create Instagram business account
- [ ] Create TikTok account
- [ ] Create Facebook business page
- [ ] Connect all accounts to Buffer

**CRM & Sales:**
- [ ] Create HubSpot account (free CRM)
- [ ] Set up pipeline stages (Prospect → Outreach → Replied → Qualified → Discovery → Proposal → Won)
- [ ] Create Cal.com account
- [ ] Set up discovery call event type (30 min)
- [ ] Connect Cal.com to Google Calendar
- [ ] Add booking link to Framer website

**Email:**
- [ ] Set up Ghost newsletter (Tier 1)
- [ ] Configure sender domain (newsletter@integrate-ai.uk)
- [ ] Set up SPF, DKIM, DMARC records for deliverability
- [ ] Create welcome email for new subscribers

**Design:**
- [ ] Create Canva account
- [ ] Set up brand kit (logo, colours, fonts) — even on free tier
- [ ] Create social media templates (LinkedIn, X, Instagram)

**Internal:**
- [ ] Create Notion workspace
- [ ] Set up content calendar template
- [ ] Set up meeting notes template
- [ ] Set up client tracker

---

## Monthly Cost Summary

| Stage | Monthly Cost | What You Get |
|-------|-------------|-------------|
| **Launch** | £15-20/mo | Website + blog + newsletter + CRM + scheduling + social (3 channels) + analytics + design |
| **Growth** | £80-120/mo | + advanced email + all social channels + SEO tool + pro design |
| **Scale** | £200-300/mo | + enterprise SEO + paid CRM + advanced social + payments + automation |

All prices exclude API costs for running the AI squad (~£7-15/month depending on usage).

---

## Decision Matrix — Tools You Need to Pick Now

| Decision | Options | My Recommendation |
|----------|---------|-------------------|
| **Website builder** | Framer vs Ghost vs WordPress | **Framer** — fastest to beautiful, best for consultancy |
| **Blog platform** | Ghost vs Framer blog vs WordPress | **Ghost** — best for SEO + newsletter combo |
| **ESP (launch)** | Ghost newsletter vs Beehiiv free vs MailerLite free | **Ghost** — already paying for blog, newsletter included |
| **CRM** | HubSpot vs Notion vs spreadsheet | **HubSpot Free** — proper pipeline, free forever |
| **Booking** | Cal.com vs Calendly | **Cal.com** — free, open-source, no branding |
| **Social scheduler** | Buffer vs Later vs manual | **Buffer Free** — 3 channels, 10 posts each, enough to start |
| **Design** | Canva vs Figma vs manual | **Canva Free** — social graphics, templates, instant |
| **SEO tool** | Free tools only vs Ubersuggest vs Ahrefs | **Free tools first** (GSC + GA4), add Ubersuggest at Tier 2 |

---

## What This Means Day-to-Day

**A typical week once the squad is running:**

**Monday:**
- Lead sends morning briefing to founders
- Strategist reviews content calendar for the week
- Content Creator writes 1-2 blog posts
- Social Media Manager schedules the week's posts across all platforms
- Sales Rep reviews pipeline and sends follow-ups

**Tuesday-Thursday:**
- Content Creator finishes blog posts, writes email copy
- Social Media Manager posts daily, engages with ICP accounts
- Email Marketer sends weekly newsletter
- Market Researcher delivers keyword briefs and competitor updates
- Sales Rep sends outreach to 5-10 prospects per day
- Data Analyst monitors metrics daily for anomalies

**Friday:**
- Data Analyst compiles weekly performance report
- Strategist reviews performance and adjusts next week's plan
- Lead sends weekly CEO report to founders
- Sales Rep updates pipeline status

**You (Chad & Paul):**
- Review and approve content batch (30 min, 2-3x per week in Phase 1)
- Take discovery calls (as they come in)
- Read weekly CEO report (10 min)
- Make strategic decisions when flagged (ad hoc)

That's it. The squad does everything else.
