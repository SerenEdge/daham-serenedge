# SEO Audit Report — daham.serenedge.com

**Audited:** 2026-06-25  
**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS  
**Audited files:** `app/layout.tsx`, `app/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`, `components/JsonLd.tsx`, `components/Hero.tsx`, `components/RealMe.tsx`, `components/Portfolio.tsx`, `components/Footer.tsx`, `components/Navbar.tsx`, `public/manifest.json`

---

## Summary

| Priority | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🟠 High | 6 |
| 🟡 Medium | 7 |
| 🟢 Low / Polish | 5 |

---

## 🔴 Critical Issues

### 1. All Content Components Are `"use client"` — No Server-Side HTML

**Affected files:** `Hero.tsx`, `RealMe.tsx`, `Portfolio.tsx`, `Footer.tsx`, `Navbar.tsx`

Every single visible component on the page has `"use client"` at the top. This means when Google (or any crawler) fetches `daham.serenedge.com`, the initial HTML response is essentially an empty shell — all the content (name, bio, projects, skills) is injected by JavaScript after the page loads.

While Googlebot does execute JavaScript, there are serious downsides:
- Content indexing is delayed (2nd-wave crawl, which can take days to weeks).
- Less reliable — if Googlebot times out or errors, the content is never indexed.
- Hurts **LCP (Largest Contentful Paint)** because the main content isn't in the initial HTML payload.
- Most other search engines (Bing, DuckDuckGo) don't execute JavaScript as reliably as Google.

**Root cause:** GSAP animations, scroll triggers, and state management require the browser DOM, which requires `"use client"`. However, the *content itself* (text, images, project data) does NOT need to be client-rendered.

**Fix:** Split each component into a server-rendered shell (static HTML with content) + a client wrapper (just the animation layer). For example, in `Hero.tsx`, the `<h1>`, `<p>`, social links, and image can be rendered on the server. GSAP can attach to those elements on the client via `useLayoutEffect`. This is Next.js's intended pattern.

---

### 2. `<h1>` Tag Is "Hello" — Completely Non-Descriptive

**Affected file:** `components/Hero.tsx` — line 157

```tsx
<h1 className="text-[min(25vw,300px)] ...">
  Hello
</h1>
```

The only `<h1>` on the entire page says "Hello". Google treats `<h1>` as the strongest on-page content signal. "Hello" tells Google nothing about who you are or what this page is about.

The meaningful intro text (`-It's Daham Dissanayake`) is in a `<p>` tag — invisible to Google as a heading signal.

Your page `<title>` is "Daham Dissanayake | SerenEdge" but the H1 doesn't reinforce it at all. This is a direct contradiction and a missed SEO opportunity.

**Fix options:**
- Make the `<h1>` visually large ("Hello") but add a *visually hidden* descriptive H1 via `sr-only` class: `<h1 className="sr-only">Daham Dissanayake – Full Stack Developer & CS Undergraduate</h1>`, and turn the current "Hello" into a `<div>` or `<span>`.
- OR restructure so "Hello, I'm Daham Dissanayake" is the actual H1, keeping "Hello" as the large display element and the full name as part of the same H1.

---

### 3. No `<noscript>` Fallback Content

**Affected file:** `app/layout.tsx`

Because 100% of visible content is client-rendered (see Issue #1), crawlers that don't execute JavaScript see a completely blank page. There is no `<noscript>` fallback providing even minimal text about who you are.

**Fix:** Add a `<noscript>` block in `layout.tsx` with a brief text summary (name, role, contact info). This is a safety net, not a full solution — Issue #1 is the real fix.

```tsx
<noscript>
  <p>Daham Dissanayake — Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast from Sri Lanka. Visit daham.serenedge.com for the full experience.</p>
</noscript>
```

---

## 🟠 High Priority Issues

### 4. JSON-LD Person Schema Missing `image` and `@id`

**Affected file:** `components/JsonLd.tsx`

The `Person` schema is missing two important fields:

1. **`image`** — Google uses this to display your photo in Knowledge Panel results. Without it, no image can be attributed to your entity.
2. **`@id`** — Without a stable `@id` URI, Google cannot reliably link your Person entity across different pages or external references.

**Current:**
```json
{
  "@type": "Person",
  "name": "Daham Dissanayake",
  ...
}
```

**Should be:**
```json
{
  "@type": "Person",
  "@id": "https://daham.serenedge.com/#person",
  "name": "Daham Dissanayake",
  "image": "https://daham.serenedge.com/images/og-image.png",
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Informatics Institute of Technology (IIT), Sri Lanka"
  },
  ...
}
```

Also: the `worksFor` field currently says `{ "name": "SerenEdge" }` — SerenEdge is your own brand, not an employer. This is potentially misleading to Google's entity graph. Replace with `alumniOf` for your university.

---

### 5. JSON-LD WebSite Schema Missing `@id` and `description`

**Affected file:** `components/JsonLd.tsx`

The `WebSite` schema is missing `@id` and `description`. The `@id` lets Google link the WebSite to the Person entity.

**Should be:**
```json
{
  "@type": "WebSite",
  "@id": "https://daham.serenedge.com/#website",
  "name": "Daham Dissanayake | SerenEdge",
  "url": "https://daham.serenedge.com",
  "description": "Portfolio of Daham Dissanayake — CS Undergraduate, Full Stack Developer, and IoT Enthusiast.",
  "author": {
    "@type": "Person",
    "@id": "https://daham.serenedge.com/#person"
  }
}
```

---

### 6. 404 Page Has No Metadata

**Affected file:** `app/not-found.tsx`

The 404 page exports no `metadata`. While Google shouldn't index 404 pages, search engines do crawl them. Without a proper title, some SEO tools flag this as an issue, and social sharing of 404 URLs would use the layout's default metadata (misleading).

**Fix:**
```tsx
export const metadata: Metadata = {
  title: "404 – Page Not Found",
  description: "This page does not exist.",
  robots: { index: false, follow: false },
};
```

---

### 7. Sitemap Uses `new Date()` for `lastModified`

**Affected file:** `app/sitemap.ts` — line 9

```ts
lastModified: new Date(),
```

This re-generates to the current timestamp on every build/deployment. Google uses `lastModified` to understand when content actually changed. If this date is always "right now," Google may:
- Over-crawl the page expecting new content.
- Distrust the value entirely (which hurts crawl budget efficiency).

**Fix:** Use a hardcoded date tied to your last major content update:
```ts
lastModified: new Date("2025-06-01"),
```
Update it manually when you make significant content changes.

---

### 8. robots.ts Has a Placeholder Disallow Comment

**Affected file:** `app/robots.ts` — line 11

```ts
disallow: "/private/", // Example of standard disallow
```

You're actively blocking `/private/` in your robots.txt even though that path doesn't exist. The comment says it's just an "example." This is leftover boilerplate that should be removed.

**Fix:** Remove the disallow rule entirely (or keep it empty `disallow: ""`) since there's nothing you want to block:
```ts
rules: {
  userAgent: "*",
  allow: "/",
},
```

---

### 9. Hero Image alt Text Has a Typo

**Affected file:** `components/Hero.tsx` — line 206

```tsx
alt="Daham Dissanayake - ComputerScience Undergraduate"
```

"ComputerScience" is missing a space. Alt text is an SEO signal (Google Images uses it for indexing). The corrected version is also a stronger keyword phrase:

```tsx
alt="Daham Dissanayake - Computer Science Undergraduate and Full Stack Developer"
```

---

## 🟡 Medium Priority Issues

### 10. No Page-Level Metadata on `app/page.tsx`

**Affected file:** `app/page.tsx`

The homepage has no `export const metadata` of its own. It relies entirely on `layout.tsx`. While this works, Next.js recommends page-level metadata for the homepage because:
- It signals explicit intent (vs. "fell through to layout defaults").
- If you ever add a template `%s` or per-page overrides, the homepage needs its own export.

**Fix:** Add a simple export:
```tsx
export const metadata: Metadata = {
  title: "Daham Dissanayake | Full Stack Developer & CS Undergraduate",
  description: "Portfolio of Daham Dissanayake — Computer Science Undergraduate, Full Stack Developer, and IoT Enthusiast from Sri Lanka. Explore projects in IoT, ML, and web development.",
};
```

---

### 11. Manifest.json Uses the Same `logo.png` for Both Icon Sizes

**Affected file:** `public/manifest.json`

```json
{ "src": "/images/logo.png", "sizes": "192x192", "type": "image/png" },
{ "src": "/images/logo.png", "sizes": "512x512", "type": "image/png" }
```

Both entries point to the same file. Browsers and Google use the 512×512 version for splash screens and app icons. If `logo.png` is not actually 512×512, the browser will scale it up and it will appear blurry. Google's PWA audit will flag this.

**Fix:** Create properly sized icon files (`icon-192.png` and `icon-512.png`) and reference them separately.

---

### 12. Social Links in Hero Have No `aria-label`

**Affected file:** `components/Hero.tsx` — lines 168–171

```tsx
<Link href="https://github.com/DahamDissanayake" target="_blank" rel="noopener noreferrer">
  <FiGithub />
</Link>
```

These icon-only links have no accessible label. Accessibility issues are also SEO issues — Google uses accessibility signals in quality scoring. The Footer's social links have `aria-label` (correct), but the Hero's don't.

**Fix:** Add `aria-label` to each:
```tsx
<Link href="..." aria-label="GitHub Profile"><FiGithub /></Link>
<Link href="..." aria-label="LinkedIn Profile"><FiLinkedin /></Link>
<Link href="..." aria-label="Instagram Profile"><FiInstagram /></Link>
<Link href="mailto:..." aria-label="Send Email"><FiMail /></Link>
```

---

### 13. Core Web Vitals Risk — LCP and CLS

**Affected files:** `components/Hero.tsx`, `components/SplashScreen.tsx`, `app/layout.tsx`

Google uses Core Web Vitals as a ranking signal. Three risks identified:

- **LCP:** The hero image (`DAMAPortraitfinal2.webp`, 1000×1200 at `width={1000}`) is the likely LCP element. With client-side rendering (Issue #1), it loads late. The `priority` prop is set correctly (good), but CSR delays when that priority kick-in.
- **CLS:** The splash screen changes the layout between the initial paint and the actual content appearing. The `sessionStorage` check in `layout.tsx` adds a class to `<html>` that hides content — this can cause layout shift on repeat visits.
- **FID/INP:** Multiple `useLayoutEffect` hooks initializing GSAP on mount delay time-to-interactive.

**Fix:** After fixing Issue #1 (CSR→SSR), measure CWV in PageSpeed Insights. Add explicit `width` and `height` to all images that don't use `fill`, so the browser reserves space before load.

---

### 14. Keywords Array Missing Key Terms

**Affected file:** `app/layout.tsx` — line 34

While keyword meta tags are less important than they used to be, they still inform Google about topical relevance. Current keywords are missing:

- "portfolio"
- "ESP32 developer"
- "Machine Learning engineer"
- "Computer Science student Sri Lanka"
- "IIT Sri Lanka"
- "React Native developer"

**Fix:** Extend the keywords array with the above terms. More importantly, ensure these terms appear naturally in the *actual visible content* of the page (which requires fixing Issue #1 to make content visible to crawlers).

---

### 15. Duplicate Google Verification Methods

**Affected files:** `app/layout.tsx` (line 84), `app/google5ecffaaeec0becce.html`

You have two active Google Search Console verification methods:
1. Meta tag via `verification: { google: "JZbYOAdrz10YPPu4FBfxAQS8xdykd42xtzFKDa9XkSI" }` in layout.tsx
2. A physical HTML file at `app/google5ecffaaeec0becce.html`

Both work, but the HTML file is redundant and is served as a route (accessible at `/google5ecffaaeec0becce`). This adds an unnecessary public endpoint. The meta-tag method via `layout.tsx` is cleaner.

**Fix:** Delete `app/google5ecffaaeec0becce.html`. Keep only the `verification` object in `metadata`.

---

### 16. `alumniOf` / Education Missing From JSON-LD

**Affected file:** `components/JsonLd.tsx`

Your metadata description mentions "Computer Science Undergraduate" and "IIT" is referenced in the keywords array, but the JSON-LD Person schema doesn't include your university affiliation. Education is a strong entity signal for Google's Knowledge Graph.

**Fix (covered in Issue #4 fix):** Add `alumniOf` with the IIT entry.

---

## 🟢 Low Priority / Polish

### 17. `worksFor` Points to Your Own Brand

**Affected file:** `components/JsonLd.tsx`

`worksFor: { "@type": "Organization", "name": "SerenEdge" }` implies SerenEdge is an employer, but it's your personal brand. This is confusing for Google's entity resolver.

**Fix:** Remove `worksFor` entirely or change to `"founder"` relationship. Add `alumniOf` as covered in Issue #4.

---

### 18. No `potentialAction` SearchAction on WebSite Schema

**Affected file:** `components/JsonLd.tsx`

For personal portfolio sites, adding a `SearchAction` to the `WebSite` schema can enable a Google sitelinks search box. For a single-page site, this is optional but adds structured data richness.

---

### 19. Sitemap Only Lists Root URL — Section Anchors Missing

**Affected file:** `app/sitemap.ts`

The sitemap has only the root URL. The page uses anchor navigation (`#realme`, `#portfolio`, `#contact`). You could add these as separate entries with lower priority to help Google understand the page structure:

```ts
{ url: `${baseUrl}/#realme`, priority: 0.7 },
{ url: `${baseUrl}/#portfolio`, priority: 0.8 },
{ url: `${baseUrl}/#contact`, priority: 0.6 },
```

This is optional but can help Google understand the SPA's content structure.

---

### 20. `Geist_Mono` Font May Be Redundant

**Affected file:** `app/layout.tsx` — line 12

`Geist_Mono` is loaded and set as `--font-geist-mono`, but the CSS in Tailwind uses `font-mono` which maps to the system monospace stack. If `--font-geist-mono` isn't explicitly used in the CSS config, this is an unnecessary font download (~30–60KB) that hurts performance.

**Fix:** Check `tailwind.config` — if `geistMono` isn't mapped to `font-mono`, remove it.

---

### 21. Navbar Logo Link Has No `aria-label` or Title Text

**Affected file:** `components/Navbar.tsx` — line 101

```tsx
<Link href="#" onClick={(e) => handleScroll(e, "#")}>
  <Image src="/images/daham-sign-dark.png" alt="Daham Signature" ... />
</Link>
```

The image alt is "Daham Signature" which is descriptive for the image, but the link itself has no context about where it goes (back to top). Minor accessibility/SEO polish.

**Fix:**
```tsx
<Link href="#" aria-label="Back to top" ...>
```

---

## Quick-Win Checklist (in priority order)

1. [ ] Fix `robots.ts` — remove the placeholder `/private/` disallow rule
2. [ ] Fix hero image alt typo (`ComputerScience` → `Computer Science Undergraduate and Full Stack Developer`)
3. [ ] Add `metadata` export to `not-found.tsx` with `robots: { index: false }`
4. [ ] Add `@id` and `image` to JSON-LD Person schema; fix `worksFor` → `alumniOf`
5. [ ] Add `@id` and `description` to JSON-LD WebSite schema
6. [ ] Fix `sitemap.ts` `lastModified` to a real date instead of `new Date()`
7. [ ] Add `aria-label` to social links in `Hero.tsx`
8. [ ] Add `<noscript>` fallback in `layout.tsx`
9. [ ] Add page-level `metadata` export to `app/page.tsx`
10. [ ] Delete the redundant `app/google5ecffaaeec0becce.html` verification file
11. [ ] Add properly sized `icon-192.png` and `icon-512.png` for the manifest
12. [ ] Address the H1 "Hello" problem (visually hidden SEO H1 or restructure)
13. [ ] Investigate and fix client-side rendering — separate static content from animation logic

---

## What's Already Good

- `metadataBase` is set correctly in `layout.tsx`
- OpenGraph metadata is complete with image dimensions
- Twitter Card is configured with `summary_large_image`
- Google Search Console verification is active
- Canonical URL is set
- `lang="en"` on `<html>`
- `robots` metadata + `robots.ts` file both exist
- `sitemap.ts` generates a sitemap
- JSON-LD structured data exists with both `Person` and `WebSite` schemas
- `sameAs` links to GitHub, LinkedIn, Instagram in JSON-LD
- `manifest.json` exists for PWA support
- Apple touch icon is set
- `priority` on the hero image (correct LCP hint)
- Social links in Footer have `aria-label` (correct)
- `<address>` semantic element used correctly in Footer
- `<article>` element used for project cards in Portfolio
- `<footer id="contact">` uses correct semantic element
