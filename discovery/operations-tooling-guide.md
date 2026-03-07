# IntegrateAI Advisors — Operations & Tooling Guide

> **Last updated:** 7 March 2026
> **Status:** APPROVED — £0/mo launch stack
> **Location:** Milton under Wychwood, Oxfordshire
> **Target market:** Local businesses within 50-mile radius (Oxfordshire, Cotswolds, Cheltenham, Swindon, Reading corridor)

---

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
| **Content Creator** | Blog posts, landing pages, email copy, case studies | Beehiiv, Canva |
| **Social Media Manager** | Daily posts (5 platforms), replies, engagement, trends | Buffer, Canva |
| **Email Marketer** | Sequences, newsletters, A/B tests, list hygiene | Beehiiv |
| **Market Researcher** | Keywords, competitor intel, content briefs, SERP tracking | GSC, Ahrefs Webmaster Tools, Google Keyword Planner |
| **Data Analyst** | Weekly dashboards, campaign reports, anomaly detection | GA4, GSC, Microsoft Clarity, Looker Studio |
| **Sales Rep** | Prospect research, cold outreach, follow-up, pipeline | HubSpot CRM, Cal.com, LinkedIn |

---

## Tech Stack — £0/month Launch

**Total cost: £1/year (domain only). Everything else is free.**

### Core Stack

| Tool | Function | Free Tier | What You Lose vs Paid |
|------|----------|-----------|----------------------|
| **Existing Vercel site** | Website | £0 | Already built. Custom domain, SSL, auto-deploy from Git. No monthly cost. |
| **Beehiiv (Launch)** | Blog + Newsletter | £0 — 2,500 subscribers, unlimited emails | No automations, no A/B testing, no monetisation tools, no polls. Custom domain included. Website builder included. |
| **HubSpot CRM** | Sales pipeline | £0 — 1,000 contacts, 1 pipeline | No automation workflows, HubSpot branding, 10 custom properties, 5 active lists. Forums-only support. |
| **Cal.com** | Discovery call booking | £0 — unlimited event types | No team scheduling. Integrates with Google Calendar. |
| **Buffer** | Social scheduling | £0 — 3 channels, 10 posts/channel | Only 10 posts queued per channel. Enough for 1-2x/day if you queue weekly. |
| **Canva** | Design | £0 — 1.6M+ templates, 5 GB storage | No background remover, no Magic Resize, no transparent PNG, no brand fonts. |
| **Google Analytics 4** | Website analytics | £0 — unlimited | Industry standard. Full data. |
| **Google Search Console** | SEO tracking | £0 — unlimited | Rankings, impressions, clicks, indexing. |
| **Ahrefs Webmaster Tools** | Site audit + backlinks | £0 — verified domains only | 5,000 crawl credits/mo, 1,000 backlinks visible. Your own domains only — no competitor research. |
| **Google Keyword Planner** | Keyword research | £0 — needs Google Ads account (no spend required) | Volume shown as ranges, not exact numbers. |
| **Microsoft Clarity** | Heatmaps + session recordings | £0 — unlimited | Free forever. Heatmaps, session replays, rage click detection. |
| **Google Looker Studio** | Dashboards + reporting | £0 — unlimited | Pull from GA4, GSC, Sheets. Free dashboards for Data Analyst. |
| **Discord** | Team communication | £0 — unlimited messages, voice, bots | No enterprise compliance (SOC 2, HIPAA). 8 MB file limit. Not "business" feeling. |
| **Notion** | Internal docs + tasks | £0 — free for personal, unlimited blocks | Team plan is £10/user/mo when needed. |
| **Make.com** | Automation | £0 — 1,000 operations/mo | 15-min minimum interval. 1,000 ops runs out fast with multi-step workflows. |
| **OBS Studio** | Video recording | £0 — unlimited, no watermarks | No cloud sharing — local file only. Upload to YouTube unlisted or Google Drive. |
| **Wave Starter** | Invoicing + bookkeeping | £0 — unlimited invoices | No bank auto-import, single user. Transaction fees: 2.9% + £0.60 (cards). |
| **Google Business Profile** | Local SEO | £0 | Critical for local visibility. Shows in Google Maps. |
| **integrate-ai.uk** | Domain | ~£1/yr | Already purchased. |

### Why Discord Over Slack

| | Slack Free | Discord |
|--|-----------|---------|
| Message history | 90 days only | **Unlimited forever** |
| Integrations | 10 max | **Unlimited bots** |
| Voice/video | 1:1 calls only | **Group voice channels, always-on** |
| File limit | 5 GB total | 8 MB per file (use Drive for larger) |
| Bot/agent integrations | Choked at 10 apps | **Unlimited — critical for 8-agent squad** |

**Decision: Discord.** The 10-integration limit on Slack Free would block the squad. Revisit Slack Pro (£7.25/user/mo) when revenue supports it.

### Why Beehiiv Over Ghost

| | Ghost ($11/mo) | Beehiiv Free |
|--|---------------|-------------|
| Cost | £9/mo | **£0** |
| Subscribers | 500 members | **2,500 subscribers** |
| Newsletter | Built-in | **Built-in + unlimited sends** |
| Blog | Yes | **Yes — website builder included** |
| Custom domain | Yes | **Yes** |
| Segmentation | Basic | **Yes** |

**Decision: Beehiiv Launch.** Blog + newsletter in one free tool. Saves £9/mo vs Ghost. More subscribers on free tier.

---

## Growth Upgrades (When Revenue Supports It)

### Tier 2 — After First 1-2 Clients (~£80-110/month)

| Tool | Function | Cost | When to Add |
|------|----------|------|------------|
| **Beehiiv Scale** | Advanced email | £40/mo | When you need automations, A/B testing, monetisation |
| **Buffer Essentials** | All social channels | £25/mo | When you need 5+ channels with unlimited scheduling |
| **Canva Pro** | Advanced design | £12/mo | When you need brand kit, background remover, Magic Resize |
| **Ubersuggest** | SEO + keywords | £24/mo | When Market Researcher needs competitor tracking and keyword volume |

### Tier 3 — 5+ Clients (~£200-300/month)

| Tool | Function | Cost | When to Add |
|------|----------|------|------------|
| **Ahrefs Lite** | Enterprise SEO | £24/mo | Backlink analysis, content gap analysis, rank tracking at scale |
| **HubSpot Starter** | CRM (paid) | £17/mo | Email integration, sequences, reporting |
| **Stripe** | Payments | 1.5% + 20p/txn | Client payment processing |
| **Loom Business** | Video demos | £13/mo | Recorded demos for prospects, async client comms |
| **Zapier Starter** | Automation | £17/mo | When Make.com's 1,000 ops/mo isn't enough |
| **Slack Pro** | Team comms | £7.25/user/mo | If clients expect Slack or need business-grade compliance |

---

## Tool-to-Agent Mapping

| Agent | Launch (£0/mo) | Growth (Tier 2) | Scale (Tier 3) |
|-------|----------------|-----------------|----------------|
| **Lead** | Notion, Discord, internal files | + Slack | + Zapier |
| **Strategist** | Notion, GA4, GSC, Looker Studio | + Ubersuggest | + Ahrefs |
| **Content Creator** | Beehiiv (blog), Canva | + Canva Pro | + Loom |
| **Social Media Mgr** | Buffer (free), Canva | + Buffer paid, Canva Pro | + Later/Hootsuite |
| **Email Marketer** | Beehiiv (newsletter) | + Beehiiv Scale | + HubSpot email |
| **Market Researcher** | GSC, Ahrefs Webmaster Tools, Keyword Planner | + Ubersuggest | + Ahrefs |
| **Data Analyst** | GA4, GSC, Clarity, Looker Studio | + Ubersuggest data | + HubSpot reports |
| **Sales Rep** | HubSpot CRM (free), Cal.com | + HubSpot Starter | + Stripe, Loom |

---

## Local Business Focus — 50-Mile Radius Strategy

### Target Geography

Milton under Wychwood sits in West Oxfordshire. A 50-mile radius covers:

- **Oxfordshire:** Oxford, Witney, Chipping Norton, Banbury, Bicester, Abingdon, Didcot, Henley
- **Cotswolds:** Burford, Stow-on-the-Wold, Moreton-in-Marsh, Cirencester, Cheltenham, Stroud
- **Gloucestershire:** Gloucester, Cheltenham
- **Warwickshire:** Stratford-upon-Avon, Leamington Spa, Warwick
- **Buckinghamshire:** High Wycombe, Aylesbury
- **Berkshire:** Reading, Newbury
- **Wiltshire:** Swindon
- **Northamptonshire:** Banbury corridor

### Priority Verticals (Local)

Based on the density of small businesses in this area:

1. **Hospitality** — Pubs, restaurants, cafés, B&Bs (Cotswolds is saturated with these)
2. **Trades** — Builders, plumbers, electricians, landscapers (huge demand, zero marketing)
3. **Professional services** — Accountants, solicitors, financial advisers, estate agents
4. **Health & wellness** — Gyms, personal trainers, clinics, physiotherapists, dentists
5. **Retail** — Independent shops, farm shops, boutiques
6. **Tourism** — Activity providers, tour operators, holiday lets

### Local SEO — Critical at Launch

These are **free** and **essential** for local targeting:

| Action | Tool | Why |
|--------|------|-----|
| Claim Google Business Profile | Free | Appear in Google Maps, local pack results. Add photos, services, hours. |
| Get listed on Yell.com | Free | UK business directory. Backlink + citation. |
| Get listed on FreeIndex | Free | UK directory. Generates reviews. |
| Get listed on Yelp UK | Free | Reviews + local visibility. |
| Join local Facebook Groups | Free | Witney, Chipping Norton, Cotswolds business groups. Direct access to ICP. |
| LinkedIn local networking | Free | Connect with Oxfordshire business owners directly. |
| Create location-specific landing pages | Vercel (free) | "AI for businesses in Witney", "AI consultancy Cotswolds", etc. |
| Register with local Chamber of Commerce | Low cost | West Oxfordshire, Thames Valley. Networking + credibility. |

### Content Strategy — Local Angle

The Content Creator and Market Researcher should prioritise:

- **Local case studies** — "How we helped a Cotswolds pub save 20 hours/week"
- **Location-targeted blog posts** — "5 ways [Witney/Oxford/Cheltenham] businesses can use AI"
- **Industry-specific content** — "AI for hospitality businesses in the Cotswolds"
- **Google Business Profile posts** — Regular updates keep the listing active
- **Local keyword targeting** — "AI consultancy Oxfordshire", "business automation Cotswolds"

---

## Account Setup Checklist

### Before Squad Launch

**Domain & Hosting:**
- [ ] Register integrate-ai.uk ✅ (done — £1)
- [ ] Verify DNS records for Vercel
- [ ] Configure SSL (automatic with Vercel)

**Website (Vercel):**
- [ ] Connect integrate-ai.uk domain to Vercel
- [ ] Add Cal.com booking widget for discovery calls
- [ ] Add email capture form (connected to Beehiiv)
- [ ] Create location-specific landing pages for key towns

**Blog + Newsletter (Beehiiv):**
- [ ] Create Beehiiv account (Launch plan — free)
- [ ] Connect custom domain (blog.integrate-ai.uk or similar)
- [ ] Configure newsletter settings + sender domain
- [ ] Set up SPF, DKIM, DMARC records for email deliverability
- [ ] Set up subscriber welcome email
- [ ] Create first 3-5 blog posts (local angle + industry-specific)

**Analytics & SEO:**
- [ ] Create Google Analytics 4 property
- [ ] Install GA4 tracking on Vercel site
- [ ] Set up Google Search Console + verify domain + submit sitemap
- [ ] Sign up for Ahrefs Webmaster Tools (free) + verify domain
- [ ] Create Google Keyword Planner account (Google Ads, no spend needed)
- [ ] Set up Microsoft Clarity + install tracking snippet
- [ ] Create Google Looker Studio dashboard (GA4 + GSC data sources)

**Local SEO:**
- [ ] Claim Google Business Profile for IntegrateAI Advisors
- [ ] Add business photos, services, hours, description
- [ ] Get listed on Yell.com, FreeIndex, Yelp UK
- [ ] Join local Facebook business groups (Witney, Chipping Norton, Cotswolds)
- [ ] Register with West Oxfordshire Chamber of Commerce

**Social Media:**
- [ ] Create LinkedIn company page (IntegrateAI Advisors)
- [ ] Optimise personal LinkedIn profiles (Chad & Paul)
- [ ] Create X/Twitter account
- [ ] Create Instagram business account
- [ ] Create TikTok account
- [ ] Create Facebook business page
- [ ] Connect LinkedIn, X, Instagram to Buffer (3 free channels)

**CRM & Sales:**
- [ ] Create HubSpot account (free CRM)
- [ ] Set up pipeline stages: Prospect → Outreach → Replied → Qualified → Discovery → Proposal → Won
- [ ] Create Cal.com account + set up 30-min discovery call event type
- [ ] Connect Cal.com to Google Calendar
- [ ] Add booking link to website

**Design:**
- [ ] Create Canva account
- [ ] Set up brand kit (logo, colours, fonts) on free tier
- [ ] Create social media templates (LinkedIn, X, Instagram)

**Team Communication:**
- [ ] Create Discord server for IntegrateAI
- [ ] Set up channels: #general, #content, #social, #sales, #analytics, #ops, #founder-only
- [ ] Set up bot integrations for agent notifications

**Automation:**
- [ ] Create Make.com account (free — 1,000 ops/mo)
- [ ] Set up core workflows: form submission → HubSpot, new blog → social share

**Invoicing:**
- [ ] Create Wave account (free) OR use Stripe Invoicing
- [ ] Set up branded invoice template
- [ ] Configure payment methods (card + bank transfer)

**Video:**
- [ ] Install OBS Studio
- [ ] Set up recording scene (screen + camera)
- [ ] Create YouTube channel (unlisted uploads for demos/proposals)

**Internal:**
- [ ] Create Notion workspace
- [ ] Set up content calendar template
- [ ] Set up meeting notes template
- [ ] Set up client tracker
- [ ] Import company operations plans (see /operations folder)

---

## Monthly Cost Summary

| Stage | Monthly Cost | What You Get |
|-------|-------------|-------------|
| **Launch** | **£0/mo** + £1/yr domain | Website + blog + newsletter + CRM + booking + social (3 channels) + analytics + heatmaps + dashboards + SEO tools + design + comms + automation + invoicing + video |
| **Growth** | £80-110/mo | + advanced email + all social channels + SEO tool + pro design |
| **Scale** | £200-300/mo | + enterprise SEO + paid CRM + advanced social + payments + automation |

All prices exclude API costs for running the AI squad (~£7-15/month depending on usage).

---

## What This Means Day-to-Day

**A typical week once the squad is running:**

**Monday:**
- Lead sends morning briefing to founders (Discord #founder-only)
- Strategist reviews content calendar for the week
- Content Creator writes 1-2 blog posts (local angle)
- Social Media Manager schedules the week's posts across all platforms
- Sales Rep reviews pipeline and sends follow-ups

**Tuesday-Thursday:**
- Content Creator finishes blog posts, writes email copy
- Social Media Manager posts daily, engages with local business accounts
- Email Marketer sends weekly newsletter via Beehiiv
- Market Researcher delivers keyword briefs and competitor updates (local focus)
- Sales Rep sends outreach to 5-10 local prospects per day
- Data Analyst monitors metrics daily for anomalies

**Friday:**
- Data Analyst compiles weekly performance report (Looker Studio dashboard)
- Strategist reviews performance and adjusts next week's plan
- Lead sends weekly CEO report to founders
- Sales Rep updates pipeline status in HubSpot

**You (Chad & Paul):**
- Review and approve content batch (30 min, 2-3x per week in Phase 1)
- Take discovery calls (as they come in)
- Read weekly CEO report (10 min)
- Make strategic decisions when flagged (ad hoc)

That's it. The squad does everything else.
