# SEO Strategy Guide — Ranking #1 for "Daham" & "Daham Dissanayake"

**Written:** 2026-06-25  
**Goal:** Rank #1 on Google for "Daham Dissanayake" and "Daham"  
**Site:** https://daham.serenedge.com

---

## What's Already In Place (After Our Fixes)

Before anything else — here's what the site now has working for it:

| Signal | Status | Impact |
|--------|--------|--------|
| Page title with full name | ✅ Done | High |
| sr-only H1 — "Daham Dissanayake — Full Stack Developer..." | ✅ Done | High |
| Meta description with name | ✅ Done | Medium |
| JSON-LD `Person` schema with `@id`, `image`, `givenName`, `familyName` | ✅ Done | Very High |
| JSON-LD `ProfilePage` schema with `mainEntity → Person` | ✅ Done | Very High |
| JSON-LD `WebSite` schema | ✅ Done | Medium |
| `sameAs` links to GitHub, LinkedIn, Instagram | ✅ Done | High |
| `alumniOf` — IIT Sri Lanka | ✅ Done | Medium |
| `nationality` — Sri Lanka | ✅ Done | Medium |
| Canonical URL | ✅ Done | Medium |
| OpenGraph + Twitter Card with name in title | ✅ Done | Medium |
| Google Search Console verified | ✅ Done | Required |
| Sitemap at `/sitemap.xml` | ✅ Done | High |

The technical foundation is solid. Everything below is what you do **outside the code** to build the authority and entity signals Google needs to rank you first and eventually show a Knowledge Panel.

---

## Part 1 — Google Search Console (Do This First, Takes 10 Minutes)

### 1.1 Submit Your Sitemap

If you haven't done this yet, do it now:

1. Go to https://search.google.com/search-console
2. Select your property `daham.serenedge.com`
3. Left sidebar → **Sitemaps**
4. In the "Enter sitemap URL" box type: `sitemap.xml`
5. Hit **Submit**
6. You should see status: **Success**

If it shows an error, paste the full URL `https://daham.serenedge.com/sitemap.xml` in your browser and confirm you see XML content. If you do, resubmit.

---

### 1.2 Request Indexing for the Homepage

This is the single fastest way to speed up ranking. It tells Google to crawl your site NOW instead of waiting for its natural crawl schedule.

1. Left sidebar → **URL Inspection**
2. Paste `https://daham.serenedge.com` → press Enter
3. Wait for GSC to fetch the page (~10 seconds)
4. Click the **"Request Indexing"** blue button
5. A popup confirms it's queued — takes 30 seconds
6. Done. Google will recrawl within 1–3 days

You can only request indexing ~10 times per day per property.

---

### 1.3 Check the Coverage Report (Watch for Errors)

1. Left sidebar → **Indexing → Pages**
2. Make sure your homepage is listed under **"Indexed"**
3. If it's under "Discovered – currently not indexed" or "Crawled – currently not indexed", that's a problem — request indexing (step 1.2) and wait

---

### 1.4 Monitor Your Queries (Once Indexed)

After a few days of being indexed:

1. Left sidebar → **Search results** (under Performance)
2. Set date range to "Last 7 days"
3. Click **"+ New" → Query** and type `daham dissanayake`
4. You'll see: Impressions (how many times you showed in search), Clicks, and Average Position
5. Target: Position < 3 for "daham dissanayake" within 2–4 weeks

Check for these queries appearing:
- `daham dissanayake`
- `daham dissanayake portfolio`
- `daham dissanayake developer`
- `daham serenedge`
- `daham dissanayake iit`

If you're not showing for any of these after 2 weeks of being indexed, there's an issue to investigate.

---

### 1.5 Validate Your Structured Data

1. Go to https://search.google.com/test/rich-results
2. Enter `https://daham.serenedge.com` → Test URL
3. Confirm these three entities are detected without errors:
   - `Person` — Daham Dissanayake
   - `ProfilePage`
   - `WebSite`
4. Any red errors need to be fixed. Yellow warnings are OK.

Also validate at https://validator.schema.org/ — paste your URL or paste the raw JSON-LD from your site's page source.

---

## Part 2 — The Entity Graph (This Is What Actually Ranks You)

Google doesn't just rank pages — it ranks **entities**. An entity is a real-world thing Google knows about: a person, a place, an organization. When Google is confident an entity exists and is who they say they are, it shows them prominently.

For "Daham Dissanayake" to rank first, Google needs to be confident that:

1. A real person named Daham Dissanayake exists
2. Their official website is `daham.serenedge.com`
3. They are the same person as the LinkedIn profile, the GitHub account, and the Instagram
4. They are a developer / CS student from Sri Lanka

**Our JSON-LD already does steps 1–4.** But Google needs **external corroboration** — i.e., other websites also agree these things are true. That's what the sections below are about.

---

## Part 3 — LinkedIn (Most Important External Signal)

LinkedIn is treated by Google as a high-authority source for professional identity. For a personal name search, LinkedIn often ranks #1 or #2. You want your LinkedIn to directly reinforce the site.

### 3.1 Set Your Website Link

1. Go to linkedin.com/in/daham-dissanayake
2. Click **Edit profile → Contact info**
3. In the **Website** field, add: `https://daham.serenedge.com`
4. Set the label to "Portfolio"

This creates a backlink from a DA-95 domain (LinkedIn's domain authority) to your site. This is one of the most powerful backlinks you can get for free.

### 3.2 Optimize Your LinkedIn Headline

Your headline is what Google shows as the snippet for your LinkedIn result. It should reinforce the same identity:

```
Full Stack Developer | CS Undergraduate at IIT Sri Lanka | IoT & ML Enthusiast
```

Avoid just "Student at IIT" — include your skills and full name in your About section.

### 3.3 Your LinkedIn About Section — Mention Your Site Explicitly

In the "About" section, add a line like:
> "I maintain my full portfolio at daham.serenedge.com, where you can see my projects in IoT, ML, and web development."

Google reads LinkedIn About sections. An explicit mention of your domain name in text strengthens the association between "Daham Dissanayake" and "daham.serenedge.com".

---

## Part 4 — GitHub (Critical for Developer Searches)

GitHub has very high domain authority and ranks well for developer names. Your `sameAs` already points to your GitHub. Now make GitHub point back.

### 4.1 GitHub Profile Bio

Go to your GitHub profile → Edit → Bio field:

```
Full Stack Developer · CS Undergrad @ IIT Sri Lanka · IoT & ML · Portfolio: daham.serenedge.com
```

### 4.2 GitHub Website Field

In your GitHub profile settings, there's a "Website" field. Set it to:
```
https://daham.serenedge.com
```

### 4.3 Pin Your Repos

Pin your best 6 repos (SoterCare, ImgHarvest, VibeCheck, etc.). This makes your GitHub profile content-rich, which helps it rank higher when people search your name. Higher-ranking GitHub = more signals pointing to your domain.

### 4.4 GitHub README Profile

Create a special `DahamDissanayake/DahamDissanayake` repo (same name as your username). The README of this repo appears on your GitHub profile. Add:

```markdown
# Hi, I'm Daham Dissanayake 👋

Full Stack Developer, CS Undergraduate at IIT Sri Lanka, IoT & ML Enthusiast.

🔗 Portfolio: [daham.serenedge.com](https://daham.serenedge.com)
🔗 LinkedIn: [daham-dissanayake](https://linkedin.com/in/daham-dissanayake)
```

This creates another indexed page with your name and a link to your portfolio.

---

## Part 5 — Other Platform Profiles (Each One Adds a Signal)

Every profile you create on a high-authority site that:
1. Uses your real name "Daham Dissanayake"
2. Links back to `daham.serenedge.com`

...adds another data point to Google's entity graph.

### Platforms to Set Up (in order of priority)

| Platform | Why It Matters | What to Add |
|----------|---------------|-------------|
| **Dev.to** | DA-93, developer community, Google indexes it fast | Create a profile at dev.to/@dahamdissanayake with full name and website link |
| **Twitter / X** | `@dhmdissanayake` already in your JSON-LD `sameAs` | Add website to bio: daham.serenedge.com |
| **Product Hunt** | DA-90, good for indie makers/developers | Create profile with real name and link |
| **Stack Overflow** | DA-99, very high authority | Add website to your profile |
| **Behance / Dribbble** | Less relevant but still counts | If you have any UI/design work |
| **About.me** | Specifically designed as a personal identity hub | Set up about.me/daham and link to site |
| **Linktree** | Simple hub — create one, link to site | Low effort, adds a citation |

### The Key Rule for All Profiles

Use the **exact same name**: `Daham Dissanayake` — not "Daham D." or "dhm_dissanayake" or any variation. Google's entity resolver matches by exact name consistency. Every variation weakens the signal.

---

## Part 6 — Wikidata (Unlocks the Knowledge Panel)

This is the single most powerful move for getting a Google Knowledge Panel. Wikidata is Google's trusted public database of entities. When Google sees a Wikidata entry for a person that matches your JSON-LD entity, it often triggers the Knowledge Panel box on the right side of search results.

**Eligibility:** You're an eligible Wikidata subject if you have:
- A verifiable online presence (your portfolio site)
- Professional/academic achievements (IIT degree, hackathon wins like Vertex'25)
- Notable projects (SoterCare, VibeCheck on Chrome Web Store)

VibeCheck being on the Chrome Web Store is a legitimate notability signal.

### How to Create a Wikidata Entry

1. Go to https://www.wikidata.org/wiki/Special:NewItem
2. Create a new item with label: `Daham Dissanayake`
3. Description: `Sri Lankan software engineer and computer science student`
4. Add these statements:

| Property | Value |
|----------|-------|
| `P31` (instance of) | `Q5` (human) |
| `P21` (sex or gender) | `Q6581097` (male) |
| `P27` (country of citizenship) | `Q854` (Sri Lanka) |
| `P106` (occupation) | `Q5482740` (software developer) |
| `P69` (educated at) | `Q` (find IIT Sri Lanka's Wikidata entry first) |
| `P856` (official website) | `https://daham.serenedge.com` |
| `P2037` (GitHub username) | `DahamDissanayake` |
| `P4016` (Slack username) | skip |
| `P2002` (Twitter username) | `dhmdissanayake` |
| `P6634` (LinkedIn personal profile ID) | `daham-dissanayake` |

5. Save the item and note the Q-number (e.g., Q12345678)

Once your Wikidata item exists, add its URL to your JSON-LD `sameAs` array:
```json
"sameAs": [
  "https://github.com/DahamDissanayake",
  "https://www.linkedin.com/in/daham-dissanayake/",
  "https://www.instagram.com/dhmdissanayake/",
  "https://www.wikidata.org/wiki/Q[YOUR-Q-NUMBER]"
]
```

Timeline: Knowledge Panels typically appear 4–8 weeks after a Wikidata entry is created and Google recrawls the site.

---

## Part 7 — For "Daham" Alone (Harder, But Achievable)

"Daham" is also a Sinhala word meaning "Dhamma/truth" and several other people share this given name. Ranking #1 for just "Daham" requires Google to understand you as the most authoritative result for that name in context.

### What Helps

1. **Volume of search intent** — If people consistently search "Daham" and click your result (vs others), Google learns you're the right result. Share your portfolio link when people ask about you — drive direct traffic from searches.

2. **`givenName: "Daham"` in schema** — Already done. This is the explicit signal.

3. **Anchor text from other sites** — If someone links to your site using anchor text "Daham" or "Daham Dissanayake", that's a strong name-association signal. Ask friends, classmates, professors to link to your portfolio.

4. **Your LinkedIn URL slug** — If your LinkedIn URL is `linkedin.com/in/daham-dissanayake` (which it is), and Google indexes it for the "daham" query, it will also associate your portfolio (linked from LinkedIn) with that query.

5. **Geo-targeting** — Searches for "Daham" from Sri Lanka will naturally be more likely to surface your results first. If your target audience is Sri Lankan, this works in your favor.

### Realistic Expectation

- "Daham Dissanayake" → #1 within 2–4 weeks of indexing. Very achievable.
- "Daham developer Sri Lanka" → #1 within 2–4 weeks.
- "Daham" alone → Top 3 within 4–12 weeks IF your profile dominates the name across platforms.

---

## Part 8 — Content Amplification (Do This Every Time You Ship Something)

Every time you build a new project, write about it somewhere indexed. This creates content that mentions "Daham Dissanayake" + your technical skills + your site URL, which reinforces all three together.

### High-Impact Content Channels

**Dev.to articles** (easiest, fastest indexed):
- Write a 500-word post about SoterCare, VibeCheck, or any project
- Title: "How I built [ProjectName] — Daham Dissanayake"
- End with: "See more of my work at daham.serenedge.com"
- Dev.to articles rank on Google within 24–48 hours

**LinkedIn posts/articles:**
- Post about your projects, wins (Vertex'25 runners-up), or tech opinions
- Google indexes LinkedIn posts

**GitHub repo descriptions:**
- Every repo description and README is indexed. Add "by Daham Dissanayake" to your repo descriptions.
- Example: `A hands-free presentation controller using OpenCV — by Daham Dissanayake`

**IIT Sri Lanka / University mentions:**
- If your Vertex'25 competition win was mentioned anywhere on the IIT website or any news site, find that page. That's an educational institution backlink, which is extremely valuable.
- If it's not mentioned, ask your department to add it to their news/achievements page.

---

## Part 9 — Backlink Strategy (Quality Over Quantity)

A backlink is another website linking to yours. The quality of the linking site matters enormously. One link from LinkedIn is worth thousands of links from random blogs.

### Backlinks You Can Get Without Asking Anyone

| Source | How to Get It | Authority |
|--------|--------------|-----------|
| LinkedIn profile website field | Set it in settings | Very High |
| GitHub profile website field | Set in settings | Very High |
| Dev.to profile website field | Set in settings | High |
| Stack Overflow profile | Set website in settings | Very High |
| Google Search Console | Verification = signal | High |
| Chrome Web Store (VibeCheck) | Already there if listed | High |

### Backlinks Worth Pursuing

| Source | What to Do | Timeline |
|--------|-----------|----------|
| IIT Sri Lanka achievements page | Email your department with a link to your portfolio | 1–4 weeks |
| Vertex'25 competition website/social | If the competition has a page listing participants/winners, ask to be linked | Varies |
| Tech blog mentions | If you've helped anyone with code, ask them to credit your portfolio | Ongoing |
| Fellow students' portfolios | Cross-link with classmates who have portfolios | Quick |

### Backlinks to Avoid

- Link farms (sites that sell "1000 backlinks for $10") — Google penalizes these
- Irrelevant sites (a food blog linking to a dev portfolio looks unnatural)
- Any link where you had to pay for it (violates Google's guidelines)

---

## Part 10 — Technical Monitoring Checklist (Run Monthly)

### Monthly GSC Checks

1. **Performance → Search results**: Is your average position for "daham dissanayake" moving up?
2. **Indexing → Pages**: No new "Discovered but not indexed" pages?
3. **Experience → Core Web Vitals**: Green across the board?
4. **Security & Manual Actions**: Should always be empty/green

### Tools to Bookmark

| Tool | What It Does | URL |
|------|-------------|-----|
| Google Search Console | Your primary SEO dashboard | search.google.com/search-console |
| Rich Results Test | Validates your JSON-LD schemas | search.google.com/test/rich-results |
| Schema.org Validator | Deep-validates structured data | validator.schema.org |
| Google PageSpeed Insights | Core Web Vitals scores | pagespeed.web.dev |
| Ahrefs Backlink Checker (free) | See who's linking to your site | ahrefs.com/backlink-checker |

### What to Do When Something Drops

If your position drops significantly:
1. Check GSC for manual penalties (Security & Manual Actions tab — should be empty)
2. Check if the page is still indexed (URL Inspection)
3. Check if any recent code changes affected the metadata or JSON-LD
4. Request re-indexing

---

## Part 11 — The Knowledge Panel (The End Goal)

A Knowledge Panel is the box on the right side of Google search results that shows a summary of who you are. It's the clearest signal that Google has recognized you as a verified entity.

```
┌─────────────────────────────────────┐
│  [Photo]  Daham Dissanayake         │
│           Software Developer        │
│                                     │
│  Computer Science Undergraduate     │
│  at IIT Sri Lanka. Full Stack       │
│  Developer and IoT Enthusiast.      │
│                                     │
│  Website: daham.serenedge.com       │
│  [GitHub] [LinkedIn] [Instagram]    │
└─────────────────────────────────────┘
```

### What Triggers It

Google needs high confidence that:
1. You are a real, notable person (entity exists)
2. Multiple high-authority sources agree on your identity
3. There's a clear "official" page for you

### The Checklist to Trigger It

- [ ] JSON-LD `ProfilePage` + `Person` schema live on site ✅ (done)
- [ ] LinkedIn website field pointing to your portfolio
- [ ] GitHub website field pointing to your portfolio
- [ ] Wikidata entry created (see Part 6)
- [ ] At least 3–5 external mentions of your name linking to the site
- [ ] Google indexes and recrawls the site with all above in place
- [ ] Wait 4–12 weeks

### After the Knowledge Panel Appears

Google lets you claim and edit your Knowledge Panel:
1. Search "Daham Dissanayake" on Google
2. Scroll to the bottom of the Knowledge Panel → "Claim this knowledge panel"
3. Verify via Google Search Console
4. You can then suggest corrections, add a profile photo, update your description

---

## Part 12 — Timeline Summary

| Milestone | Expected Timeline | What Drives It |
|-----------|------------------|----------------|
| Homepage fully indexed | 1–3 days after requesting indexing | GSC URL inspection + request |
| #1 for "Daham Dissanayake" | 1–4 weeks after indexing | Strong on-page signals + JSON-LD |
| #1 for "Daham Dissanayake developer" | 1–3 weeks | Page title + H1 + schema |
| Top 3 for "Daham" | 4–12 weeks | Entity authority across platforms |
| LinkedIn + GitHub ranking alongside site | 1–2 weeks | Profile optimization (Part 3 & 4) |
| Knowledge Panel appears | 4–16 weeks | Wikidata + cross-platform consistency |

---

## Quick Action List (Do These Today)

Copy this checklist and tick off each item:

```
TODAY (30 minutes):
[ ] GSC → Submit sitemap.xml
[ ] GSC → URL Inspection → Request Indexing for daham.serenedge.com
[ ] GSC → Rich Results Test — verify Person + ProfilePage + WebSite schemas show
[ ] LinkedIn → Add daham.serenedge.com to website field
[ ] GitHub → Add daham.serenedge.com to website field + update bio

THIS WEEK (1–2 hours):
[ ] Create Dev.to profile with full name and website link
[ ] Update Twitter/X bio to include website link
[ ] Create GitHub profile README with name and portfolio link
[ ] Pin best 6 repos on GitHub
[ ] Set up Stack Overflow profile with website link

THIS MONTH (2–4 hours):
[ ] Create Wikidata entry (Part 6 step-by-step above)
[ ] Write 1 Dev.to article about a project (links back to portfolio)
[ ] Contact IIT department about listing Vertex'25 win with portfolio link
[ ] Add Wikidata URL to sameAs in JsonLd.tsx after creating entry

ONGOING:
[ ] Post about each new project on LinkedIn and Dev.to
[ ] Check GSC Search Results monthly for position tracking
[ ] Run Rich Results Test after any JSON-LD code changes
```

---

## Notes

- **Don't buy backlinks or use SEO services** that promise "guaranteed #1" — these use black-hat tactics that Google penalizes. Everything in this guide is white-hat.
- **Consistency beats speed** — doing things in the right order matters more than doing everything at once.
- **The Wikidata step** is the highest-leverage thing not in the codebase. It's free, takes 30 minutes, and is the clearest path to a Knowledge Panel.
- **VibeCheck on the Chrome Web Store** is a genuine notability signal. If you haven't listed it properly there (with your real name as developer), do it — Chrome Web Store developer profiles are indexed by Google and count as a citation.
