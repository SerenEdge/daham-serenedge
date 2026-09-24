# Fable Review — daham-serenedge

**Date:** 2026-09-15
**Scope:** Full audit of the repository at commit `7c2319e` (branch `main`).
**Method:** Every source file under `app/`, `components/`, `lib/`, `hooks/`, `types/`, `tests/`, `data/` and all config files was read in full. Claims below were checked by running the toolchain, not inferred.

| Check run | Result |
|---|---|
| `npx next build` | Passes. 11 routes, 4 static project pages. |
| `npx vitest run` | 29/29 tests pass (8 files). |
| `npx eslint .` | **Fails to start** — `eslint-config-next@15.0.4` has no `core-web-vitals` flat-config export; project is on Next 16. Nothing has been linted since the Next 16 upgrade. |
| `npx tsc --noEmit` | **4 errors**, all in `tests/dashboard-actions.test.ts` (assigning to read-only `NODE_ENV`). |
| `npm audit` | 15 vulnerabilities: 1 critical (`next`), 7 high, 7 moderate. All have fixes available. |
| `npm outdated` | Every dependency is behind; `next` 16.1.6 vs 16.3.5, `resend` 6.9 vs 6.28, `eslint-config-next` 15.0.4 vs 16.3.5. |
| Secrets in git history | `.env.local` was never committed. No API-key patterns in tracked files. |

Severity scale used: **Critical** (exploitable now or breaks the product), **High** (real user/owner harm, easy to trigger), **Medium** (harm needs a specific path, or degrades quality broadly), **Low** (hygiene, cheap to fix).

---

## Executive summary

This is a well-presented single-page portfolio with a small dev-only content dashboard. The public surface is mostly static, which keeps the blast radius small, but five things need attention before anything else:

1. **Next.js 16.1.6 carries two critical advisories** (unauthenticated RCE in the Image Optimization API via AVIF; RCE on Windows-hosted servers) plus a dozen high ones covering Server Actions DoS, SSRF, and proxy bypass. The site uses `next/image` and Server Actions. Upgrade to 16.3.5 today. (S-1)
2. **The contact form is an open, unauthenticated email relay with HTML injection.** Anyone can make `daham@serenedge.com` send an auto-reply containing attacker-written HTML to any address they choose, with no rate limit or bot check. That is a phishing vector on your verified domain and a Resend quota/reputation risk. (S-2)
3. **The toolchain is silently broken.** Lint cannot run, type-check fails, and there is no CI, so none of this is caught. The last ~40 commits were made without a working linter. (U-1, U-2)
4. **The dashboard's "exactly four slots" design has already corrupted the data.** Moving a project out of a slot keeps the old `id`, so `vibecheck` now means "MILO Robot" and `imgharvest` means "AutoHub"; and the move helper truncates descriptions, which is why the live site shows "lets me ins..." on the VibeCheck card. (Y-2, Y-3)
5. **Keyboard and touch users cannot open portfolio details or read the "Other projects" fan.** Details are hover-only on desktop, click-only-on-a-div on mobile, and tablets (768–1279 px, which includes every iPad) get the hover-only fan. (X-1, X-2)

Beyond those, the codebase shows the fingerprints of several AI-agent sessions that stopped mid-refactor: a module named `gemini.ts` that calls Groq while three docs still say Gemini; two byte-identical abandoned scroll experiments; a Google verification file placed where Next.js will never serve it; a hook whose result is computed and discarded; and a test suite where two of eight files test nothing. None of these are dangerous individually, but together they make the project harder to change safely than its size warrants.

The recommended order of work: S-1 → S-2 → U-1/U-2 → Y-2/Y-3 (with the data fix) → X-1/X-2 → the rest.

---

## 1. Security

### S-1 · Critical · Next.js 16.1.6 has unpatched critical and high advisories

**What:** `npm audit` lists 30 advisories against the installed `next@16.1.6`, including:
- GHSA-2xp9-vwfh-vxw4 — Unauthenticated RCE in the Image Optimization API when AVIF files are used (fixed in 16.3.3). This site serves every image through `next/image`.
- GHSA-p293-qw3h-jr36 — Unauthenticated RCE on Windows-hosted servers (fixed in 16.3.3). Vercel is Linux, but `npm run dev` on this Windows machine is exposed to anything on the LAN.
- GHSA-m99w-x7hq-7vfj — DoS in App Router using Server Actions; GHSA-89xv-2m56-2m9x — SSRF in Server Actions; GHSA-955p-x3mx-jcvp — unauthenticated disclosure of internal Server Function endpoints (all fixed in 16.2.11). The site has three Server Action modules.
- GHSA-mq59-m269-xvcx — `null` origin bypasses Server Actions CSRF checks (fixed in 16.1.7).

**Where:** `package.json:17` (`"next": "^16.1.6"`), `package-lock.json` (resolved 16.1.6).

**Why it matters:** These are the only externally reachable code paths on the site that do anything dynamic. The AVIF RCE in particular needs no authentication.

**Fix:**
```bash
npm install next@16.3.5 eslint-config-next@16.3.5
npm audit fix
npm run build && npm test
```
Then add Dependabot (see G-3) so this does not recur.

### S-2 · High · Contact form is an unauthenticated email relay with HTML injection

**What:** `sendContactEmail` interpolates `name`, `email` and `message` straight into two HTML emails. The second email is sent **from** `daham@serenedge.com` **to** whatever address the submitter typed. There is no HTML escaping, no length limit, no email-format check on the server, no rate limiting, and no bot check.

**Where:** `app/actions.ts:8-16` (validation is only "all three non-empty"), `app/actions.ts:23-41` (admin email; `${name}`, `${email}`, `${message}` raw in HTML), `app/actions.ts:56-74` (auto-reply; `${name}` raw in HTML, `to: email` uncontrolled).

**Why it matters:**
- An attacker submits `name = <a href="https://evil.example/login">Please re-verify your SerenEdge account</a>` and `email = victim@example.com`. The victim receives a legitimately DKIM-signed message from your domain containing that link. That is a phishing relay, and it burns your domain reputation with Resend and mail providers.
- With no rate limit, a script can drain the Resend monthly quota in minutes and flood your inbox.
- `formData.get("name") as string` is a lie to the type-checker: a `File` entry becomes `[object File]` in the email.

**Fix (all of these, in order of value):**
1. Escape user input before it enters HTML, or send plain text. Minimal helper:
   ```ts
   const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
   ```
   Better: use Resend's `react:` option with a small `@react-email/components` template so escaping is automatic.
2. Validate on the server: `typeof x === "string"`, `name.length <= 100`, `message.length <= 5000`, `/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)`.
3. Add a honeypot field (hidden `website` input; reject if filled) and Cloudflare Turnstile (free, no cookies) verified server-side.
4. Rate-limit per IP. On Vercel the simplest durable option is `@upstash/ratelimit` with Vercel KV; 5 submissions per hour per IP is generous for a portfolio.
5. Reconsider the auto-reply entirely. If kept, make it plain text with only an escaped first name, and never include the message body.

### S-3 · Medium · Stored-XSS chain through JSON-LD when autofill output is accepted

**What:** Three pages inject `JSON.stringify(jsonLd)` into a `<script type="application/ld+json">` via `dangerouslySetInnerHTML`. `JSON.stringify` does not escape `</script>`. The data comes from `data/projects.json`, which the dashboard populates from an LLM reading an arbitrary third-party GitHub README.

**Where:** `components/JsonLd.tsx:108-111`, `app/projects/page.tsx:52-55`, `app/projects/[slug]/page.tsx:94-97`. Source of untrusted text: `lib/gemini.ts:64` (README passed to the model), `app/dashboard/DashboardClient.tsx:408-418` (result written into fields).

**Why it matters:** A README containing `</script><script>...` that survives the model and a quick review would ship as executable script on your own site. Low likelihood, high impact, and the fix is one line.

**Fix:** Serialize with `JSON.stringify(jsonLd).replace(/</g, "\\u003c")` in one shared helper (`lib/jsonld.ts`) used by all three call sites.

### S-4 · Medium · No security headers

**What:** The app sets no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or `frame-ancestors`. Vercel adds HSTS but nothing else.

**Where:** `next.config.ts` (no `headers()`).

**Why it matters:** Clickjacking of the contact form, MIME sniffing of the uploaded WebP files, and referrer leakage to the external links are all trivially preventable. A full nonce-based CSP is harder because of the inline splash script (`app/layout.tsx:98-119`) and the JSON-LD blocks, so start with the headers that cost nothing.

**Fix:**
```ts
// next.config.ts
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
];
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() { return [{ source: "/(.*)", headers: securityHeaders }]; },
  // ...
};
```
Move the splash script to a tiny external file under `public/` later so a `script-src` directive becomes possible.

### S-5 · Medium · 10 MB request bodies accepted on every Server Action, including the public one

**What:** `serverActions.bodySizeLimit: "10mb"` is global. It exists for dashboard image uploads but also applies to `sendContactEmail`, which anyone can POST to.

**Where:** `next.config.ts:6-10`.

**Why it matters:** Combined with S-2's missing rate limit, this is a cheap amplification vector: 10 MB per request, parsed and interpolated into an email body, sent to Resend.

**Fix:** The dashboard only runs in development, so scope the limit:
```ts
serverActions: { bodySizeLimit: process.env.NODE_ENV === "development" ? "10mb" : "1mb" },
```
And cap `message` at the application level (S-2).

### S-6 · Medium · Dev-only tooling relies on a single `NODE_ENV` check and leaks an extra endpoint

**What:** The dashboard actions are guarded by `assertDev()`, which is correct, but:
- `assertDev` is itself an exported `async` function in a `"use server"` module, so Next registers it as a public Server Action endpoint in production. It was exported only so a test could import it.
- The production client bundle still references all three action IDs because `DashboardClient` imports them; GHSA-955p (S-1) shows those IDs can be enumerated.
- `/dashboard` returns 404 only because the page component calls `notFound()`; there is no route-level exclusion.

**Where:** `app/dashboard/actions.ts:16-20`, `app/dashboard/DashboardClient.tsx:5-9`, `app/dashboard/page.tsx:25`, `tests/dashboard-actions.test.ts:2`.

**Why it matters:** Defence in depth. Today the guard holds; one refactor that moves `assertDev` below a file read, or a Next bug like GHSA-mq59 (CSRF bypass), and a production write to `public/` or `data/` becomes possible.

**Fix:**
1. Move the guard to `lib/dev-guard.ts` (plain module, not `"use server"`) and import it in `actions.ts`; test it from there.
2. Add `proxy.ts` (Next 16's middleware file) that returns 404 for `/dashboard*` when `NODE_ENV === "production"`.
3. Keep `sharp` and `node:fs` imports inside the action functions (dynamic import) so the production server bundle for the actions is inert even if invoked.

### S-7 · Low · Partial API key written to production logs

**What:** `DevPulseCard` logs the first four characters of `DEV_PULSE_API_KEY` whenever `process.env.VERCEL` is set.

**Where:** `components/DevPulseCard.tsx:23-26`.

**Why it matters:** The component is not imported anywhere, so this is dormant, but the pattern is wrong and the file will be copied from. Four characters of a bearer token plus a known URL narrows a brute-force meaningfully for short tokens.

**Fix:** Delete `components/DevPulseCard.tsx` and the `DEV_PULSE_*` lines in `.env.example` and `.env.local` (see A-3).

### S-8 · Medium (legal) · Commercial font served without evidence of a web license

**What:** `public/fonts/fonnts.com-Aeonik-Regular.ttf` and `-Bold.ttf`. Aeonik is a commercial typeface from CoType Foundry; the `fonnts.com-` prefix indicates the files came from a font-sharing site rather than a purchase. They are publicly downloadable from the site.

**Where:** `public/fonts/`, `app/globals.css:3-15`, `app/globals.css:45`.

**Why it matters:** Distributing unlicensed font files from a domain with your name on it is the kind of thing foundries' automated scanners find. It is also the only third-party asset in the repo with an unclear provenance.

**Fix:** Either purchase a web license for Aeonik (and then load it via `next/font/local` with a non-guessable path, see X-12), or switch to an open alternative with a similar grotesk feel. `Geist` (already partly loaded for mono) and `Inter` (already loaded and unused) are both zero-cost swaps.

### S-9 · Medium · Remaining dependency advisories

**What:** Besides `next`, `npm audit` flags direct dependencies `sharp` (libvips/libheif CVEs — used at dev-time for uploads and bundled inside Next for image optimization), `resend` (via `svix` → `uuid`), and `vitest` (`@vitest/mocker` path traversal, dev only), plus transitive `postcss` (XSS via unescaped `</style>` in stringified output — build-time), `picomatch`, `brace-expansion`, `js-yaml`, `flatted`, `nanoid`, `baseline-browser-mapping`, `@humanfs/node`.

**Where:** `package.json`, `package-lock.json`.

**Fix:** `npm audit fix` resolves every one without a major bump except `vitest` (4.1.11 is within range; 5.x is optional). Re-run `npm test` and `npm run build` afterwards.

### S-10 · Low · External links open new windows without `rel`

**What:** Several `target="_blank"` links omit `rel="noopener noreferrer"`. Modern browsers imply `noopener`, so this is consistency rather than exposure, but the same file does it correctly elsewhere.

**Where:** `components/Portfolio.tsx:319-326`, `components/Portfolio.tsx:393-400`, `components/DevPulseCard.tsx:105-108`, `components/Footer.tsx:129-135`.

**Fix:** Add `rel="noopener noreferrer"`; or create one `ExternalLink` component and use it everywhere.

### S-11 · Low · Repository hygiene around tooling output and personal data

**What:**
- `graphify-out/` (50 tracked files, 561 KB) is committed. It contains LLM-extracted summaries of the CV, dev logs and code, plus a `cost.json`. Nothing secret, but it is tool output, not source.
- `.superpowers/` (agent session reports and review diffs) is untracked but **not** gitignored, so one `git add .` publishes it.
- Phone number (`components/Footer.tsx:123-128`) and personal Gmail (`Hero.tsx:179`, `Navbar.tsx:168`, `Footer.tsx:106`, `app/actions.ts:22`) are in the public HTML. This is a choice, but note that the contact form already exists so the raw address is optional, and scrapers do harvest `mailto:` and `tel:` links.

**Fix:** Add `graphify-out/`, `.superpowers/` and `dev-logs/` to `.gitignore` and `git rm -r --cached graphify-out`. Consider showing the phone only in the PDF CV.

### Verified as fine
- `.env.local` never entered git history; `.env*` is ignored.
- `safeImageFilename` neutralises path traversal (`tests/upload.test.ts:12-14` covers `../../etc/passwd.jpg`).
- Uploads are re-encoded through `sharp` to WebP, so polyglot files cannot survive.
- The Google verification token in `app/layout.tsx:86` is designed to be public.
- Project routes use `dynamicParams = false`, so `/projects/<anything>` cannot reach the page component.

---

## 2. Systemic issues

### Y-1 · High · Four independent readers of `projects.json`, only one of which validates

**What:** `lib/projects.ts` exists as the typed accessor, but three other modules import the JSON directly and cast it with `as ProjectsData`. Validation (`validateProjectsData`) runs only when the dashboard writes; a hand edit to the JSON (the README explicitly tells you to commit and push it) bypasses it.

**Where:**
- `lib/projects.ts:1-7` (the intended source)
- `components/Portfolio.tsx:9-15` (direct import + cast)
- `components/JsonLd.tsx:1-7` (direct import + cast)
- `app/llms.txt/route.ts:1-10` (direct import + cast)
- `lib/projects-store.ts:57-60` (runtime read, validated — dashboard only)

**Why it matters:** A project with an empty `images` array passes `next build` and then throws at render in `Portfolio.tsx:234` (`project.images[0] ?? ""` becomes `<Image src="">`, which Next rejects) and `app/projects/page.tsx:85`. Two writers with different rules always drift; this one already has (Y-2).

**Fix:** Make `lib/projects.ts` the only importer and validate at module load so a bad file fails the build with a readable message:
```ts
// lib/projects.ts
import raw from "@/data/projects.json";
import { validateProjectsData } from "./projects-store-validate"; // split validation out of the fs module so it is client-safe
const data = validateProjectsData(raw);
export const portfolioProjects = data.portfolio;
export const otherProjectsList = data.otherProjects;
```
Then replace the three direct imports with these exports. Note `projects-store.ts` imports `node:fs`, so the validator must live in a file without Node imports for `Portfolio.tsx` (a client component) to use it.

### Y-2 · High · The fixed-four-slot design corrupts project identity

**What:** `moveToOtherProjects` copies a project into "Other projects" with a fresh UUID, then **blanks the slot but keeps its old `id`**. The next project typed into that slot inherits a foreign id. The emptied slot also fails validation, so the author cannot save until they invent a replacement project on the spot.

**Where:** `app/dashboard/DashboardClient.tsx:254-277` (`id: proj.id` on the blanked slot), `lib/projects-store.ts:49` (`portfolio.length !== 4`), `app/dashboard/DashboardClient.tsx:279-288` (pre-save validation rejects the blank slot).

**Evidence it already happened:** `data/projects.json` — id `vibecheck` holds "MILO Robot", `reimage` holds "IIT-GPU-Manager", `imgharvest` holds "AutoHub". `lib/projects.ts:17-25` contains a comment explaining that routes had to be derived from titles instead of ids *because of this*.

**Why it matters:** Ids are used as React keys in the dashboard (`DashboardClient.tsx:353`), as the uniqueness key in tests (`tests/projects-data.test.ts:35-38`), and were the intended route key. Every future feature that touches identity (analytics, per-project OG images, redirects) will trip on this.

**Fix:**
1. In `moveToOtherProjects`, give the blanked slot `id: crypto.randomUUID()` (or better, remove the slot entirely).
2. Replace the hard `=== 4` with a range (`1..6`); `Portfolio.tsx` already renders any count.
3. Add a "Remove from portfolio" that deletes the slot, and an "Add to portfolio" on Other-project cards that promotes one (the inverse operation is currently impossible without hand-editing JSON).
4. Repair the data: rename the three drifted ids to match their titles (`milo-robot`, `iit-gpu-manager`, `autohub`) and drop the now-unneeded slug workaround comment.

### Y-3 · High · Destructive summarisation shipped truncated copy to production

**What:** `summarizeForOther` hard-cuts the description at 217 characters and appends `...`. That output was saved and is live.

**Where:** `app/dashboard/DashboardClient.tsx:189-197`; the damage is in `data/projects.json` (VibeCheck: `…that lets me ins...`), rendered on `/` (Other projects card), `/projects`, and `/llms.txt`.

**Why it matters:** Visitors and AI crawlers read a sentence that ends mid-word. The heuristic decided on the author's behalf and did not surface that it had cut anything.

**Fix:** Move the full `longDescription` across unchanged (the card body already scrolls: `Portfolio.tsx:319`, `393`) and let the author trim in the textarea. Delete `summarizeForOther`. Restore the VibeCheck text from its git history (`git log -p -- data/projects.json`).

### Y-4 · Medium · Page layering works by convention, not structure

**What:** The hero portrait is `md:fixed` to the viewport (`Hero.tsx:193`). To hide it, every later section must be opaque and declare a higher z-index: RealMe `z-20`, Portfolio `z-20`, Footer `z-30`, Navbar `z-[100]`, Splash `z-[9999]`. Nothing documents this.

**Where:** `components/Hero.tsx:190-208`, `components/RealMe.tsx:152`, `components/Portfolio.tsx:120` (no z-index on the section; its sidebar has `z-20` at line 125), `components/Footer.tsx:75`.

**Why it matters:** Any new section without `relative z-20 bg-background` will show the portrait bleeding through it. The Portfolio section itself does not set a z-index on its root; it happens to work because the sticky sidebar and the article backgrounds cover the area.

**Fix:** Keep the parallax inside the hero. Either give the hero `overflow: clip` with the portrait `position: sticky; top: 0` inside a taller inner wrapper, or use `ScrollTrigger.create({ pin: portrait, endTrigger: heroEnd })`. Then remove the incidental z-indexes.

### Y-5 · Medium · GSAP ticker callback is never removed (Lenis leak)

**What:** `gsap.ticker.add(fn)` is passed one arrow function and `gsap.ticker.remove(...)` a *different* arrow function. The removal is a no-op; the original keeps calling `raf` on a destroyed Lenis instance.

**Where:** `components/SmoothScroll.tsx:31-40`.

**Why it matters:** React 19 StrictMode double-mounts effects in development, so there are always two tickers running locally, one of them driving a dead instance. Any client-side remount of the layout (error recovery, Fast Refresh) does the same in production.

**Fix:**
```ts
const update = (time: number) => lenisInstance.raf(time * 1000);
gsap.ticker.add(update);
return () => { gsap.ticker.remove(update); lenisInstance.destroy(); setLenis(null); };
```

### Y-6 · Medium · Menu close animation never plays

**What:** The navbar builds a **new** paused timeline inside `gsap.context` on every toggle. When `isMenuOpen` flips to `false`, the previous context's `revert()` snaps the curtain and links back instantly; then `tl.reverse()` runs on a fresh timeline at progress 0 and does nothing.

**Where:** `components/Navbar.tsx:38-76`.

**Why it matters:** The open animation is one second of choreography; the close is an instant cut. It looks like a glitch, and the code reads as if it were symmetric.

**Fix:** Build the timeline once in a `useLayoutEffect(..., [])` and keep it in a ref; play/reverse in a second effect keyed on `isMenuOpen`. Do not `revert()` between toggles.

### Y-7 · Medium · No error boundaries; one unguarded storage read can blank the site

**What:** There is no `app/error.tsx` or `app/global-error.tsx`. `SplashScreen` reads `sessionStorage` without a try/catch, while the inline script in the layout *does* guard the same call. In browsers that throw on storage access (blocked site data, some embedded webviews), the effect throws, React unmounts the tree, and the visitor sees a dark page with no content or message.

**Where:** `components/SplashScreen.tsx:14`, `app/layout.tsx:101-116` (the guarded version).

**Fix:** Wrap the read (`try { … } catch { return; }`) and add `app/error.tsx` with a plain "Something went wrong — reload" and a link home.

### Y-8 · Medium · Splash/scroll-lock ownership is split three ways

**What:** The scroll lock is set by the inline script (class + a 4 s failsafe), by `SplashScreen` (`body.style.overflow = "hidden"`), and by CSS (`.splash-active … overflow: hidden !important`). It is released by the failsafe (`overflow = ''`) or by the exit timeline (`overflow = "auto"`), whichever fires first. On a slow load the 4 s failsafe unlocks scrolling while the overlay is still on screen, and `"auto"` overrides the stylesheet's `overflow-x: hidden` on `body`.

**Where:** `app/layout.tsx:98-119`, `components/SplashScreen.tsx:12-20, 32-42`, `app/globals.css:32-36`.

**Fix:** One owner. Keep the inline script (it prevents flash before hydration), but have both the failsafe and the component only toggle the `.splash-active` class; delete the inline `style.overflow` writes. The class already carries the lock.

### Y-9 · Medium · The dashboard's production 500 was patched around, not diagnosed

**What:** The page comment says a module-scope import of `./actions` returned 500 in production, that the cause "was never captured", and to keep the lazy import "regardless".

**Where:** `app/dashboard/page.tsx:18-30`.

**Why it matters:** A superstition in code is a trap for the next person. The two plausible causes are: (a) `sharp` failing to load its platform binary inside the Vercel function (the `allowScripts: { sharp: false }` in `package.json:33` disables sharp's postinstall, which can matter on some install paths), or (b) something in the `"use server"` module graph throwing at evaluation. Either is checkable in the Vercel function logs.

**Fix:** Reproduce with `vercel build && vercel dev` or read the function log for the original deploy. If it is sharp, add `serverExternalPackages: ["sharp"]` to `next.config.ts`. Once known, replace the comment with the fact and consider removing the lazy import if it was cause (b). Pair with S-6's `proxy.ts` 404 so production never evaluates this route at all.

### Y-10 · Medium · Non-atomic write of the file that the whole site builds from

**What:** `writeProjects` overwrites `data/projects.json` in place. A crash or `Ctrl+C` mid-write leaves a truncated file; `lib/projects.ts` imports it at build time, so the next `next build` fails for every route.

**Where:** `lib/projects-store.ts:62-68`.

**Fix:** Write to `projects.json.tmp` then `rename` (atomic on the same filesystem):
```ts
const tmp = `${file}.tmp`;
await writeFile(tmp, JSON.stringify(valid, null, 2) + "\n", "utf8");
await rename(tmp, file);
```

### Y-11 · Medium · Sub-pages have no navigation, footer, or contact

**What:** `Navbar` is rendered *inside* `Hero`, and its links are hash anchors (`#realme`, `#portfolio`, `#contact`) scrolled via Lenis. `/projects` and `/projects/[slug]` therefore have no menu, no logo, no footer, and no way to reach the contact form except the browser back button or the small "Home" breadcrumb.

**Where:** `components/Hero.tsx:141`, `components/Navbar.tsx:10-15, 30-36`, `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`.

**Why it matters:** These pages exist to be landed on from search (the sitemap advertises them at priority 0.8–0.9). A visitor arriving there gets a dead end.

**Fix:** Move `Navbar` into `app/layout.tsx`; make links route-aware (`/#realme`); in `handleScroll`, use `lenis.scrollTo` only when `usePathname() === "/"`, otherwise let `next/link` navigate. Render `Footer` on the project pages too, or at least a contact CTA.

### Y-12 · Low · Five different breakpoint systems

**What:** Hero switches JS logic at 720 px and CSS at both `min-[720px]` and `md:` (768 px); Portfolio uses 768/1280; `useScale` uses 720; the two abandoned scroll demos use 720/1024; Tailwind's own `md` is 768.

**Where:** `components/Hero.tsx:27-28, 145-213`, `components/Portfolio.tsx:68-79`, `hooks/useScale.ts`, `components/MiniProjectsScrollDemo.tsx:19-30`.

**Why it matters:** Between 720 and 767 px the hero is in a mixed state (image column uses `min-[720px]:col-span-6`, text column uses `md:col-span-6`). Every component also registers its own `resize` listener.

**Fix:** Declare breakpoints once in `@theme` (`--breakpoint-sm: 720px` if 720 is the real design breakpoint) and use only Tailwind prefixes for layout. Where JS must know, one `useMediaQuery("(min-width: 768px)")` hook built on `useSyncExternalStore` replaces five listeners and avoids the SSR-false flash (X-11).

---

## 3. UX

### X-1 · High · Portfolio details are unreachable by keyboard and awkward on touch

**What:** Each project is an `<article>` with `onMouseEnter` (desktop) and `onClick` (mobile, decided by `isMobile`). There is no button, no `aria-expanded`, no keyboard handler. The collapsed panel is hidden with `max-height: 0; opacity: 0` but its contents (the "View More" link) stay in the tab order, so keyboard users tab onto invisible links.

**Where:** `components/Portfolio.tsx:139-149` (event handlers), `components/Portfolio.tsx:172-178` (collapse), `components/Portfolio.tsx:251-257` (focusable link inside).

**Why it matters:** The four flagship projects are the point of the site. Screen-reader and keyboard users cannot open them; touch-laptop users in "desktop" widths get hover-only behaviour.

**Fix:** Make the header a `<button aria-expanded={open} aria-controls={panelId}>`; toggle on click for every device (keep hover-to-open as an *addition* under `@media (hover: hover)`); put `inert` (or `hidden` after the transition) on the collapsed panel; use `<h3><button>…</button></h3>` so headings still read.

### X-2 · High · "Other projects" fan is unreadable on touch tablets and by keyboard

**What:** For widths 768–1279 px the fan layout is used, and card content appears only while `hoveredMiniCard === index`. iPads (768–1024 portrait, 1024–1366 landscape) have no hover, so they see rotated vertical titles and cannot reach the links. Cards are `<div>`s with no focusable element until hovered, so keyboard users cannot open them at any width.

**Where:** `components/Portfolio.tsx:294-297` (width-based branch), `components/Portfolio.tsx:365-374` (hover state), `components/Portfolio.tsx:387-414` (content only when hovered).

**Fix:** Choose the layout by input capability, not width: `matchMedia("(hover: hover) and (pointer: fine)")` → fan, otherwise → carousel. In the fan, render content always (visually collapsed with CSS) and expand on `:hover`, `:focus-within`, and tap; give each card a real `<a>` as its first child.

### X-3 · Medium · Expanded project panel is clipped at 1024–1279 px

**What:** The reveal uses a fixed `maxHeight: 900px` (desktop) / `1200px` (mobile). At `lg` widths the panel stacks the 400 px image above the text (`lg:col-span-12`, `xl:col-span-7`). For SoterCare (7-line description, 11 tech chips, `mb-8` × 3, `pb-16`) the stacked content is roughly 950–1000 px, so the bottom of the tech list is cut off and cannot be scrolled to.

**Where:** `components/Portfolio.tsx:175`, `components/Portfolio.tsx:179-181`.

**Fix:** Animate with `grid-template-rows: 0fr → 1fr` on a wrapper (`overflow: hidden` on the inner `min-h-0` child) — no magic number, works for any content length. Fallback: measure `panelRef.current.scrollHeight` when opening.

### X-4 · Medium · Copy defects visible on the live site

**What / Where:**
- `data/projects.json` VibeCheck: description ends `lets me ins...` (see Y-3).
- `data/projects.json` MILO subtitle `"On Going!"` → "Ongoing"; AutoHub subtitle `"Will OSS soon!!"`; AutoHub body `"I have reduce the security vulnerabilities"`.
- `components/RealMe.tsx:34`: `"I interested in ML and IoT"`.
- `components/Hero.tsx:166`: the page's only `<h1>` is `-It's Daham Dissanayake`. The leading hyphen is read aloud by screen readers and is what Google shows as the H1.
- `components/RealMe.tsx:25, 34, 43, 200`: straight `"` quotes used as decorative quotation marks; typographic `“ ”` would match the rest of the type.

**Fix:** Edit the strings. For the H1, drop the hyphen and make it the actual name: `Daham Dissanayake`; keep "YES!" as the decorative aria-hidden element it already is.

### X-5 · Medium · Splash screen blocks every first visit for 2.5–3.5 s and cannot be skipped

**What:** The exit waits `max(2.5 s, window.load)` then adds a 0.3 s delay and 0.6 s fade. On a fast connection that is 3.4 s of a dark screen with a logo before any content is interactive. There is no skip, and `prefers-reduced-motion` is ignored.

**Where:** `components/SplashScreen.tsx:55-65` (2.5 s timer), `components/SplashScreen.tsx:47-52` (0.3 + 0.6).

**Why it matters:** This is the single biggest contributor to perceived load time and to INP on first visit; the site's own `dev-logs/SEOissues.md` cites Core Web Vitals as a concern.

**Fix:** Exit as soon as `load` has fired and at least ~900 ms has elapsed; skip the splash entirely under `(prefers-reduced-motion: reduce)`; allow tap/keypress to dismiss.

### X-6 · Medium · Motion preferences are ignored everywhere

**What:** Lenis smooth-scroll, the hero parallax, the rotating role "dice" animation, the RealMe marquee, the menu curtain, and the card hover transforms all run regardless of `prefers-reduced-motion`.

**Where:** `components/SmoothScroll.tsx:15-24`, `components/Hero.tsx:33-137`, `components/RealMe.tsx:84-137`, `components/Navbar.tsx:38-76`, `components/Portfolio.tsx:82-114`.

**Fix:** Wrap GSAP setup in `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", …)` and only construct Lenis inside the same condition. Add a global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }`.

### X-7 · Medium · Menu button and overlay are not accessible

**What:** The toggle has no `aria-label`, `aria-expanded`, or `aria-controls`. When closed, the overlay's links remain in the DOM at `opacity-0` with `pointer-events-none`, so Tab reaches them invisibly. No Escape to close, no focus trap, no focus return to the button on close.

**Where:** `components/Navbar.tsx:120-126` (button), `components/Navbar.tsx:129-172` (overlay).

**Fix:** `aria-label={isMenuOpen ? "Close menu" : "Open menu"}`, `aria-expanded`, `aria-controls="site-menu"`; set `inert` on the overlay when closed; `onKeyDown` Escape handler; move focus to the first link on open and back to the button on close.

### X-8 · Low · Contact form feedback is inconsistent and not announced

**What:** Success replaces the form with an overlay; errors are a small red line with no `aria-live`, so screen readers are not told. The server returns a success string that the client discards in favour of its own copy (two sources of the same message). "Send another message" resets `formStatus` but not the stale `statusMessage`. No `maxLength` on inputs, so the S-2 limits will surprise users after submission rather than before.

**Where:** `components/Footer.tsx:50-72`, `components/Footer.tsx:150-161`, `components/Footer.tsx:203-205`, `app/actions.ts:81`.

**Fix:** Wrap status in `<p role="status" aria-live="polite">`; use `useActionState` so the server's message is the only message; add `maxLength` matching the server; clear both state values on reset.

### X-9 · Medium · Default body text colour is white on a light page

**What:** `--foreground` is `#ffffff` and `body { color: var(--foreground) }`, with `--background: #f8f8f8`. Every visible element overrides with `text-secondary`, so nothing is broken today, but any new paragraph without a colour class renders invisible. The `prefers-color-scheme: dark` block sets `--background` to the same light value, so it does nothing.

**Where:** `app/globals.css:17-24`, `app/globals.css:50-55`, `app/globals.css:78-84`.

**Fix:** `--foreground: #1c1c2b` (the real text colour); delete the dark-scheme block or implement dark mode properly. `--primary` and `--secondary` are identical (`#1c1c2b`) — collapse them or give them distinct roles.

### X-10 · Low · Mobile carousel dots drift between 527 and 767 px

**What:** The active dot is computed from `window.innerWidth * 0.85 + 16`, but cards are capped at `max-w-md` (448 px). Above ~527 px the real card width is 448 + gap, so the index is wrong and the dots lag or skip.

**Where:** `components/Portfolio.tsx:305-310`.

**Fix:** Measure `container.firstElementChild.firstElementChild.offsetWidth + 16`, or use an `IntersectionObserver` on the cards with `threshold: 0.6`.

### X-11 · Low · Layout flashes on mobile because breakpoint state starts as desktop

**What:** `isMobile`/`isTablet` default to `false` and are set in a layout effect after hydration. A phone therefore paints the desktop hover layout for a frame, then re-renders the mobile accordion and carousel.

**Where:** `components/Portfolio.tsx:23-25, 68-79`, `components/Hero.tsx:21, 27-31`.

**Fix:** Prefer CSS for layout differences (both branches rendered, one hidden via `md:hidden` / `hidden md:block`) — it also removes the resize listeners. Where JS state is unavoidable, use `useSyncExternalStore` with `matchMedia` and a server snapshot that matches the most common device (mobile).

### X-12 · Low · Font loading causes invisible text; an unused font is downloaded

**What:** Aeonik is loaded via a raw `@font-face` with no `font-display`, so browsers hide text until the TTF arrives (FOIT). No preload hint exists. `Inter` is loaded through `next/font` (`app/layout.tsx:17-20`), exposed as `--font-inter` in `@theme`, and never used by any class.

**Where:** `app/globals.css:3-15, 47`, `app/layout.tsx:17-20, 122`.

**Fix:** Load Aeonik (or its replacement, S-8) with `next/font/local` (`display: "swap"`, automatic preload, self-hosted hashed URL). Delete the `Inter` import and the `--font-inter` token.

### X-13 · Low · Hero portrait ships a 1000–2000 px image to phones

**What:** `<Image width={1000} height={1200} priority>` with no `sizes` prop. Without `sizes`, `next/image` emits a `1x/2x` srcset at 1000 and 2000 px, so a 390 px-wide phone downloads the 1000 px (or 2000 px on 2× DPR) variant as the LCP image.

**Where:** `components/Hero.tsx:199-206`.

**Fix:** `sizes="(max-width: 768px) 100vw, 60vw"`.

### Verified as fine
- Semantic headings on project pages, breadcrumb `aria-label`, decorative arrows `aria-hidden`.
- All social icon links have `aria-label`.
- The 404 page is clear and has a working home link.
- `<address>` used correctly in the footer; `not-italic` applied.

---

## 4. AI-agent-introduced logic issues

These are places where the code reads as though it was written or edited without full context of the rest of the repo: half-finished migrations, contradictory assumptions between files, dead paths, or duplicated logic.

### A-1 · Medium · `lib/gemini.ts` calls Groq; three documents still say Gemini

**What:** Commit `9624c2c` switched the autofill provider from Gemini to Groq but only changed the fetch call. The module is still named `gemini.ts`, `.env.example` carries an apologetic comment (`lib/gemini.ts calls Groq, not Gemini`), and `README.md:44-46`, `dev-logs/dashboard-setup.md:11-31`, and `docs/superpowers/specs/2026-06-28-project-dashboard-design.md` all instruct the reader to obtain a **Gemini** key and set `GEMINI_API_KEY`. Following the README leaves the autofill button failing with `GROQ_API_KEY is not set`.

**Where:** `lib/gemini.ts:13-16`, `.env.example:9-10`, `README.md:44-46`, `dev-logs/dashboard-setup.md`.

**Fix:** `git mv lib/gemini.ts lib/autofill.ts`; update the three imports and `tests/gemini.test.ts`; fix README; delete `dev-logs/dashboard-setup.md` or add a "superseded" banner; also revisit the pinned model `llama-3.1-8b-instant`, which Groq has been rotating — read it from `GROQ_MODEL` with a default.

### A-2 · Low · Google verification file placed where Next.js never serves it

**What:** `app/google5ecffaaeec0becce.html` is not a route file, so the App Router ignores it; `https://daham.serenedge.com/google5ecffaaeec0becce.html` is a 404. Verification works only because the meta-tag method is *also* configured (`app/layout.tsx:85-87`).

**Where:** `app/google5ecffaaeec0becce.html`.

**Fix:** Delete the file (meta tag is sufficient) or move it to `public/` if you want the file method as a backup.

### A-3 · Medium · Dead code and dead configuration

**What / Where:**
- `hooks/useScale.ts` — imported and invoked in `components/Hero.tsx:24`, result stored in `scale`, never read. A whole resize listener for nothing.
- `components/Hero.tsx:21-31` — `isMobile` is set from a listener but only appears as an effect dependency; it is never used in render. (Re-running the parallax on breakpoint change may be intended; then name it `breakpointKey` and say so.)
- `components/Hero.tsx:17-18` — `scrollRef`, `mobileScrollRef` typed `useRef(null)` (implicitly `null` forever in TS terms); fine at runtime, wrong types.
- `components/DevPulseCard.tsx` — never imported; references `DEV_PULSE_API_KEY/URL`, which `.env.example` and `.env.local` still document as required.
- `components/MiniProjectsScrollDemo.tsx` and `components/Scrolltemp.tsx` — **byte-identical** 184-line files, never imported, containing invented projects ("Weather App", "Chat Bot", "Portfolio Builder") with `href="#"`. The design spec (`docs/superpowers/specs/…:31-32`) explicitly declared their removal out of scope, and nobody came back.
- `babel-plugin-react-compiler` is a devDependency while `reactCompiler` is commented out in `next.config.ts:6`.
- `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` — create-next-app leftovers.
- 21 unreferenced files in `public/images/` (listed under G-6).

**Why it matters:** Each of these is a place a future edit (human or agent) will "fix" or extend by mistake. The two demo files in particular look like real components.

**Fix:** Delete all of the above. Remove `DEV_PULSE_*` from `.env.example`. Either enable `reactCompiler: true` (G-4) or uninstall the plugin.

### A-4 · Low · Server action shaped for `useActionState`, called as a plain function

**What:** `sendContactEmail(prevState: any, formData)` has the `(prevState, formData)` signature that `useActionState` expects, but `Footer` calls it directly with `null`, tracks pending state by hand, and ignores the returned `success` string in favour of a hard-coded one.

**Where:** `app/actions.ts:8`, `components/Footer.tsx:50-72`.

**Fix:** Adopt `useActionState` (gives `pending`, progressive enhancement, and the server's own message), or drop `prevState` and return a typed `{ ok: true } | { ok: false; error: string }`.

### A-5 · Medium · Tests that test nothing, and a test that fails type-checking

**What / Where:**
- `tests/smoke.test.ts` asserts `1 + 1 === 2`.
- `tests/portfolio-render.test.tsx` is titled "render" and "jsdom-free smoke", renders nothing, and duplicates `tests/projects-data.test.ts`. It is the only `.tsx` test and the only reason `@vitejs/plugin-react` is installed.
- `tests/dashboard-actions.test.ts:6, 11, 15, 19` assign to `process.env.NODE_ENV`, which Next's types declare `readonly`. `tsc --noEmit` fails with four TS2540 errors; vitest passes only because it does not type-check.

**Fix:** Delete the first two files and `@vitejs/plugin-react`. In the third, use `vi.stubEnv("NODE_ENV", "production")` and `vi.unstubAllEnvs()` in `afterEach`.

### A-6 · Low · Contradictory caching on `/llms.txt`

**What:** The route is `force-static` (prerendered at build) but sets `Cache-Control: public, max-age=0, must-revalidate`, telling every client to revalidate a file that cannot change between deploys.

**Where:** `app/llms.txt/route.ts:7, 62`.

**Fix:** Remove the header; let Vercel's static caching apply.

### A-7 · Medium · Root-layout canonical silently claims every page is the homepage

**What:** `alternates.canonical: "https://daham.serenedge.com"` in the root metadata is inherited by every route that does not override it. `/projects` and `/projects/[slug]` do override; `/_not-found` and `/dashboard` are `noindex` so it is harmless there. The next page anyone adds will be canonicalised to `/` and de-indexed.

**Where:** `app/layout.tsx:82-84`.

**Fix:** Delete it from the root layout; set `alternates.canonical: "/"` in `app/page.tsx` instead (with `metadataBase` it resolves correctly).

### A-8 · Low · Comment-driven workaround kept "regardless"

Covered in Y-9. Listed here because the comment itself is the artefact: it records that the cause is unknown and instructs future editors not to investigate.

### A-9 · Low · Five `resize` listeners with five thresholds

Covered in Y-12. The duplicated `handleResize` bodies in `Hero.tsx`, `Portfolio.tsx`, `useScale.ts`, and the two demo files are copy-paste with drift.

### A-10 · Medium · The bio and contact details are hard-coded in nine places

**What:** The one-sentence description ("Full Stack Developer, Edge AI & Robotics Researcher…") appears with small variations in `app/layout.tsx:33, 48, 62`, `components/JsonLd.tsx:38, 83, 96`, `app/llms.txt/route.ts:25-29`, `public/manifest.json:4`, and the `<noscript>` in `app/layout.tsx:127`. The email address appears in `Hero.tsx:179`, `Navbar.tsx:168`, `Footer.tsx:106`, `app/actions.ts:22`. Social URLs appear in Hero, Navbar, Footer, JsonLd, and llms.txt.

**Why it matters:** The commit history shows the tagline being revised three times in July (`bb90a05`, `2f0df64`, `69c8291`); each revision had to find every copy, and the copies are already inconsistent (`layout.tsx:62` drops "from Sri Lanka").

**Fix:** Extend `lib/site.ts` with `PROFILE = { name, tagline, description, email, phone, socials: [...] }` and import it everywhere. `manifest.json` can become `app/manifest.ts` to share it too.

### A-11 · Low · React keys by index where ids exist

**What:** Portfolio articles use `key={index}` while the dashboard reorders the same list by `id`; the other-projects cards use `key={project.id ?? index}` for a field the type declares required.

**Where:** `components/Portfolio.tsx:144, 315, 367`.

**Fix:** `key={project.id}` in all three places.

### A-12 · Low · Validation accepts `slug` but never checks uniqueness

**What:** `validatePortfolio` passes through an optional `slug`, and routes are derived from `slug ?? slugify(title)`. Nothing checks that four projects produce four distinct slugs; two identical titles would make `getProjectBySlug` return the first and the second page unreachable.

**Where:** `lib/projects-store.ts:24`, `lib/projects.ts:26-36`.

**Fix:** In `validateProjectsData`, compute the slugs and throw on duplicates; add a unit test.

### A-13 · Low · `assertDev` exported from a Server Action module to make it testable

Covered in S-6. The test-driven export created a public endpoint.

### A-14 · Low · README is still the create-next-app template

**What:** The first 40 lines of `README.md` are the unmodified template (Geist font claims, "edit `app/page.tsx`"), with the project-specific section appended below and pointing at the wrong env var (A-1).

**Fix:** Replace with: what the site is, `npm run dev`, env vars (`RESEND_API_KEY`, `GROQ_API_KEY`), the dashboard flow, and the content-validation command from G-11.

### A-15 · Low · `next dev --turbo` is redundant on Next 16

**What:** Turbopack is the default dev bundler in Next 16; the flag is a no-op.

**Where:** `package.json:6`.

**Fix:** `"dev": "next dev"`.

---

## 5. Unnecessary complexity

### C-1 · The four-slot dashboard model

The fixed "exactly four" invariant creates `moveToOtherProjects`, `summarizeForOther`, two confirmation states (`pendingMoveIndex`, `pendingRemoveIndex`), the blank-slot validation trap, and the id drift. A single `projects[]` array with `featured: boolean` and an order field removes ~120 lines from `DashboardClient.tsx`, the `=== 4` rule, and the whole class of bugs in Y-2/Y-3. `Portfolio.tsx` renders `filter(p => p.featured)`, `/projects` renders the rest. **Where:** `app/dashboard/DashboardClient.tsx:189-297`, `lib/projects-store.ts:49`.

### C-2 · Nine-URL README probing

`fetchReadme` tries `HEAD/main/master × README.md/readme.md/Readme.md` sequentially. `HEAD` already resolves the default branch, so `main`/`master` are redundant, and the casing list is a guess. The GitHub API does this in one request:
```ts
const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: { Accept: "application/vnd.github.raw+json" } });
```
**Where:** `lib/github.ts:28-51`.

### C-3 · Two abandoned scroll experiments

370 lines across `components/MiniProjectsScrollDemo.tsx` and `components/Scrolltemp.tsx`, identical, unused (A-3). Delete.

### C-4 · Lenis + GSAP ticker + ScrollTrigger sync for a four-section page

Lenis hijacks native scrolling, which breaks find-in-page scrolling, anchor jumps on load, scroll restoration on back-navigation, and reduced-motion. The site's actual scroll-driven effects are two parallax offsets and a few reveal-on-enter animations, all of which `ScrollTrigger` handles on native scroll. If the smooth feel is essential, keep Lenis but fix Y-5 and gate it behind the motion query (X-6). If not, removing `components/SmoothScroll.tsx` deletes a dependency, a context, and the `useLenis` coupling in `Navbar`.

### C-5 · Custom upload pipeline

`uploadImageAction` + `safeImageFilename` + `readdir` collision scan + `sharp` re-encode exists so one author can add images without a file manager. It works and is tested, but the collision scan is racy (two uploads in the same tick can pick the same name) and `sharp` is the heaviest dependency in the tree. Cheapest simplification: keep sharp, replace `readdir` + `Set` with `writeFile(path, bytes, { flag: "wx" })` in a retry loop. **Where:** `app/dashboard/actions.ts:33-50`, `lib/upload.ts`.

### C-6 · Three mechanisms for one splash screen

Inline `<script>` in `<head>`, a CSS class, and component state with two timers (Y-8). A single `SplashScreen` that renders `null` when `sessionStorage` says so, plus the inline script setting one class, is enough.

### C-7 · Duplicate robots rule

The `AI_USER_AGENTS` block is identical to the wildcard rule; the comment says it exists as a placeholder for future opt-outs. It costs nothing at runtime, but it is 15 lines that promise a policy the site does not have. Keep or delete deliberately. **Where:** `app/robots.ts:10-24, 37-41`.

### C-8 · Process artefacts in the product repo

`graphify-out/` (50 files), `dev-logs/`, `docs/superpowers/`, and untracked `.superpowers/` are agent-session outputs. They are useful history but they are not the site. Move them to a `notes/` branch or gitignore them (S-11).

### C-9 · Trivial and duplicate tests

`tests/smoke.test.ts` and `tests/portfolio-render.test.tsx` (A-5), plus the `@vitejs/plugin-react` devDependency that exists only for the latter.

---

## 6. Upgrade opportunities

### G-1 · Repair the toolchain (do first)

- `npm install -D eslint-config-next@16.3.5` (must match `next`). Then `npm run lint` will run for the first time since the Next 16 upgrade; expect `no-explicit-any` (`app/actions.ts:8`), `prefer-const` (`RealMe.tsx:85`), and unused-variable findings.
- Fix A-5 so `tsc --noEmit` is clean, and add `"typecheck": "tsc --noEmit"` to `package.json`.
- Add `"engines": { "node": ">=22" }` and an `.nvmrc`; bump `@types/node` to match the Vercel runtime (22).

### G-2 · Add CI

No workflow exists. Minimal `.github/workflows/ci.yml`:
```yaml
name: ci
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npm audit --audit-level=high
```
Note that `next build` currently passes even though `tsc --noEmit` fails: Next's build-time type check does not surface the errors in `tests/`. That is exactly why a separate `typecheck` step is needed in CI, and why G-1 (fixing those errors) is a prerequisite for this workflow to go green.

### G-3 · Dependency updates and automation

| Package | Installed | Latest | Note |
|---|---|---|---|
| next | 16.1.6 | 16.3.5 | Security (S-1). |
| eslint-config-next | 15.0.4 | 16.3.5 | Lint is broken until this matches. |
| resend | 6.9.3 | 6.28.0 | Clears svix/uuid advisories. |
| sharp | 0.35.2 | 0.35.4 | libvips CVEs. |
| react / react-dom | 19.2.3 | 19.3.0 | |
| tailwindcss / @tailwindcss/postcss | 4.1.18 | 4.3.3 | |
| vitest | 4.1.9 | 4.1.11 / 5.0.1 | 4.1.11 clears the mocker advisory. |
| eslint | 9.39.2 | 10.10.0 | Check `eslint-config-next` peer range first. |
| typescript | 5.9.3 | 7.0.2 | TS 7 is the native-port release; confirm the Next TS plugin supports it before jumping. |
| @vercel/analytics | 1.6.1 | 2.0.1 | |
| gsap / lenis / react-icons | minor behind | | |

Add `.github/dependabot.yml` (npm, weekly, grouped minor/patch) so the audit never accumulates 15 items again.

### G-4 · Enable the React Compiler or remove the plugin

`babel-plugin-react-compiler@1.0.0` is installed; `reactCompiler: true` in `next.config.ts` would enable automatic memoisation. The GSAP-heavy components mutate refs in effects, which the compiler handles, but verify the hero role animation and the Portfolio carousel manually after enabling. If not wanted, uninstall the plugin (A-3).

### G-5 · Fonts

`next/font/local` for the body face (X-12, S-8); delete `Inter`. This removes one network request, adds preload and `font-display: swap`, and hides the font file behind a hashed URL.

### G-6 · Asset cleanup

21 files in `public/` are referenced nowhere in `app/`, `components/`, `lib/`, `data/`, or `manifest.json`:
`images/Dahamimagefornow.png`, `images/Dahamimagefornow-dark.png`, `images/daham-sign-strokeicon.ico`, `images/DAMAPortraitfinal.webp`, `images/DAMAPortrait-png.png`, `images/DAMAPortrait-webp.webp`, `images/projects/devpulse1.webp`, `devpulse2.webp`, `img-6241.webp`, `img-6273.webp`, `img-6319.webp`, `img-6319-1.webp`, `imgharvest1.webp`, `imgharvest2.webp`, `reimage.webp`, `sotercare-mobileapp.webp`, `sotercareteam.webp`, `sotercare-website.webp`, `vibecheck1.webp`, `vibecheck2.webp`, `visionslide.webp`; plus the five template SVGs. The dashboard has no "delete image" action, so this list will only grow. Add one, or add a `scripts/prune-assets.ts` that lists orphans, and run it in CI as a warning.

### G-7 · Contact form modernisation

`useActionState` (A-4) + server-side validation with `zod` + Turnstile + rate limit (S-2) + `@react-email` templates (S-2). Together these replace ~60 lines of string-built HTML and hand-rolled state.

### G-8 · Error and loading surfaces

Add `app/error.tsx` and `app/global-error.tsx` (Y-7). The project pages are static so `loading.tsx` is unnecessary.

### G-9 · Security headers

See S-4. Also `poweredByHeader: false`.

### G-10 · Testing that exercises the product

Current coverage is pure functions only. Highest-value additions:
- `@testing-library/react` tests for `DashboardClient`: move/reorder/remove, validation messages, that moving a project preserves its full description (would have caught Y-3).
- Playwright smoke: home renders and the H1 is the name; menu opens/closes with keyboard; `/projects/sotercare` returns 200 and has a canonical; contact form rejects empty fields client-side; `/dashboard` is 404 in a production build.

### G-11 · Content validation in CI

A `scripts/validate-content.ts` that runs `validateProjectsData` on `data/projects.json`, checks every `images[]` path exists in `public/`, checks slug uniqueness (A-12), and flags text ending in `...`. Wire into `npm test` so a bad hand edit fails before Vercel builds it.

### G-12 · Route-level production exclusion for the dashboard

`proxy.ts` returning 404 for `/dashboard` in production (S-6), which also lets you drop the lazy-import superstition (Y-9).

### G-13 · Performance quick wins

- `sizes` on the hero portrait (X-13).
- Shorter splash (X-5); both together are the LCP/INP story for first visits.
- `Portfolio.tsx` renders all 10 SoterCare images inside a hidden panel on first paint; with `fill` and `sizes` they are lazy, but the `<Image>` elements still exist. Render the carousel only when the panel is open.
- The RealMe marquee measures `scrollWidth` at mount, before fonts load, so the loop seam jumps once fonts swap in. Re-measure on `document.fonts.ready`.

---

## Appendix — file-by-file index of findings

| File | Findings |
|---|---|
| `app/actions.ts` | S-2, S-3 (source), S-5, A-4, A-10 |
| `app/dashboard/actions.ts` | S-6, A-13, C-5 |
| `app/dashboard/DashboardClient.tsx` | Y-2, Y-3, C-1 |
| `app/dashboard/page.tsx` | Y-9, A-8, G-12 |
| `app/layout.tsx` | S-4, Y-8, A-7, A-10, X-12 |
| `app/llms.txt/route.ts` | Y-1, A-6, A-10 |
| `app/projects/page.tsx`, `app/projects/[slug]/page.tsx` | S-3, Y-11 |
| `app/robots.ts` | C-7 |
| `app/google5ecffaaeec0becce.html` | A-2 |
| `app/globals.css` | X-9, X-12, S-8 |
| `components/Hero.tsx` | Y-4, Y-12, A-3, A-9, X-4, X-11, X-13 |
| `components/Navbar.tsx` | Y-6, Y-11, X-7 |
| `components/Portfolio.tsx` | Y-1, X-1, X-2, X-3, X-10, X-11, A-11, S-10 |
| `components/RealMe.tsx` | X-4, X-6, G-13 |
| `components/Footer.tsx` | X-8, A-4, S-10, S-11 |
| `components/SplashScreen.tsx` | Y-7, Y-8, X-5, C-6 |
| `components/SmoothScroll.tsx` | Y-5, C-4, X-6 |
| `components/JsonLd.tsx` | S-3, Y-1, A-10 |
| `components/DevPulseCard.tsx` | S-7, A-3 |
| `components/MiniProjectsScrollDemo.tsx`, `components/Scrolltemp.tsx` | A-3, C-3 |
| `hooks/useScale.ts` | A-3 |
| `lib/gemini.ts` | A-1 |
| `lib/github.ts` | C-2 |
| `lib/projects.ts` | Y-1, Y-2, A-12 |
| `lib/projects-store.ts` | Y-1, Y-2, Y-10, A-12 |
| `data/projects.json` | Y-2, Y-3, X-4 |
| `next.config.ts` | S-4, S-5, A-3, G-4 |
| `package.json` | S-1, S-9, G-1, G-3, A-15 |
| `tests/*` | A-5, C-9, G-10 |
| `public/` | S-8, S-11, G-6 |
| `.gitignore`, `graphify-out/`, `.superpowers/` | S-11, C-8 |
| `README.md`, `dev-logs/`, `.env.example` | A-1, A-3, A-14 |
