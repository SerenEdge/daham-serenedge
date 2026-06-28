# Local Project Dashboard + Gemini Autofill — Design

**Date:** 2026-06-28
**Status:** Approved (design)
**Author:** Daham Dissanayake

## Problem

Portfolio and "Mini Projects" content is hardcoded as two arrays inside
`components/Portfolio.tsx`. Updating projects means editing code. We want a
small dashboard to manage this content without touching code, plus an
LLM-assisted autofill that reads a GitHub repo's README and fills the fields.

## Goals

1. A dashboard to manage the **4** Portfolio projects and the (unlimited)
   "Other projects" list without editing component code.
2. Paste a GitHub repo link → Google Gemini reads the repo `README.md` and
   fills the card fields (editable before saving).
3. Rename the "Mini Projects" heading to **"Other projects"**.
4. Redesign the "Other projects" section into a responsive folder-card grid
   that scales cleanly to 20+ cards while keeping the folder aesthetic and
   animation.
5. Image upload for the 4 Portfolio cards from within the dashboard.

## Non-Goals

- No live/production admin panel, no authentication, no database. The
  dashboard runs only in local dev; edits are committed to git and deployed
  via the normal Vercel push flow.
- No image management for "Other projects" cards (they remain text-only
  folder cards).
- No removal/refactor of the unused `MiniProjectsScrollDemo.tsx` /
  `Scrolltemp.tsx` experiments (out of scope).

## Context (current state)

- Next.js 16 (App Router), React 19, Tailwind v4, deployed on Vercel.
- Server Actions already used (`app/actions.ts`, Resend contact form).
- No database or CMS. `data` is hardcoded in `components/Portfolio.tsx`:
  `mainProjects` (4 items, with `images[]`) and `miniProjects` (8 items,
  text + link).
- `app/page.tsx` renders `Hero`, `RealMe`, `Portfolio`, `Footer`.
- `.env.local` (gitignored) holds `RESEND_API_KEY`, `DEV_PULSE_API_KEY/URL`.

## Architecture

### Persistence model

Local dev dashboard → committed JSON file. On Vercel the runtime filesystem
is read-only, so all writes (`data/projects.json`, uploaded images) happen
only during local `npm run dev`. The user reviews, then commits + pushes;
Vercel rebuilds and the new content ships. No auth needed because the
dashboard is unreachable in production.

### 1. Data layer

New file `data/projects.json` — the single source of truth:

```jsonc
{
  "portfolio": [        // exactly 4 entries, fixed slots
    {
      "id": "sotercare",
      "title": "SoterCare",
      "subtitle": "(2nd Year Project - Ongoing)",
      "description": "IoT & ML Based Elderly Care Monitoring System.",
      "longDescription": "…",
      "tech": ["IoT", "Raspberry Pi", "…"],
      "link": "https://sotercare.com",
      "images": ["/images/projects/sotercare-website.webp", "…"]
    }
  ],
  "otherProjects": [    // unlimited
    {
      "id": "visionslide",
      "title": "Visionslide",
      "description": "…",
      "link": "https://github.com/DahamDissanayake/vision-slide"
    }
  ]
}
```

Seeded on first run with the existing 4 portfolio + 8 other projects so
nothing is lost.

`types/projects.ts` exports shared types used by both the dashboard and the
site:

```ts
export interface PortfolioProject {
  id: string;
  title: string;
  subtitle?: string;
  description: string;       // short
  longDescription: string;
  tech: string[];
  link: string;
  images: string[];          // public-relative paths, e.g. /images/projects/x.webp
}

export interface OtherProject {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface ProjectsData {
  portfolio: PortfolioProject[];   // length 4
  otherProjects: OtherProject[];
}
```

### 2. Site changes — `components/Portfolio.tsx`

- Replace the two hardcoded arrays with `import data from "@/data/projects.json"`
  (typed as `ProjectsData`). Build-time import; updates ship on redeploy.
- Rename heading **"Mini Projects" → "Other projects"**. Keep the
  "Small tools built to simplify tasks" subline (or similar).
- Replace the tilted fan-stack ("Other projects") with a **responsive
  folder-card grid**:
  - Columns: 2 (mobile) / 3 (tablet) / 4 (desktop).
  - Keeps the dark `#1c1c2b` folder/file-tab card look (tab notch, rounded
    corners).
  - GSAP **stagger fade-in on scroll** (ScrollTrigger) and **hover lift/tilt**.
  - Removes the `windowWidth`/`spacing`/absolute-position math and the
    mobile-only carousel branch — the grid handles all breakpoints.
  - Each card: title, description, "View More →" link to the repo.
- The 4 portfolio cards keep their existing accordion + image-slider UI, now
  fed from JSON (`project.images` / single `image` handling preserved).

### 3. Dashboard — `app/dashboard/page.tsx` (dev-only)

- Guard: if `process.env.NODE_ENV === "production"` → `notFound()`. Only
  functions under local `npm run dev`.
- **Portfolio editor:** 4 fixed slots. Each slot edits: title, subtitle,
  short description, long description, tech tags (add/remove chips), link, and
  an **image uploader** (multiple images; add / remove / reorder). Enforces
  exactly 4 — no add/delete of slots.
- **Other projects editor:** list with **add / remove / reorder**; each card
  edits title, description, link.
- **"Autofill from GitHub repo"** control on every card: paste a repo URL →
  calls the autofill action → fields populate → user reviews/edits → **Save**.
- **Save** calls `saveProjects` to persist `data/projects.json`.

### 4. Server actions — `app/dashboard/actions.ts` (all dev-guarded)

Each action throws if `process.env.NODE_ENV === "production"`.

- `saveProjects(data: ProjectsData)` → validates shape (portfolio length 4),
  writes `data/projects.json` (pretty-printed) via `fs/promises`.
- `uploadImage(formData)` → saves the file into `public/images/projects/`
  (slugified, collision-safe filename), returns the `/images/projects/…` path.
- `autofillFromRepo(repoUrl, kind)` →
  1. Parse `owner/repo` from the URL.
  2. Fetch `README.md` from the public raw URL
     (`https://raw.githubusercontent.com/{owner}/{repo}/HEAD/README.md`),
     trying `main`/`master`/`HEAD` and common casings; fall back to the GitHub
     contents API if needed (no token required for public repos).
  3. Call `lib/gemini.ts` to extract structured fields.
  4. Return `{ title, shortDescription, longDescription?, tech? }` plus the
     normalized repo link.

### 5. Gemini integration — `lib/gemini.ts`

- Official `@google/genai` SDK. Model **`gemini-flash-latest`**. Reads
  `GEMINI_API_KEY`.
- Uses structured output (`responseMimeType: "application/json"` +
  `responseSchema`) so README → fields is reliable.
- `kind` controls requested fields:
  - `"portfolio"` → `{ title, shortDescription, longDescription, tech[] }`
  - `"other"` → `{ title, shortDescription }`
- Returns a typed object; throws a clear error if the key is missing or the
  README is empty.

### 6. Environment

- Add `GEMINI_API_KEY=` to `.env.local` (user pastes the value).
- Add a committed `.env.example` documenting all keys
  (`RESEND_API_KEY`, `DEV_PULSE_API_KEY`, `DEV_PULSE_API_URL`,
  `GEMINI_API_KEY`).

### 7. Dependency

- Add `@google/genai`.

## Data flow

1. **Edit:** dashboard (dev) → `saveProjects` → `data/projects.json` on disk.
2. **Autofill:** dashboard → `autofillFromRepo` → raw README fetch →
   `lib/gemini.ts` → structured fields → form (editable) → Save.
3. **Image:** dashboard file input → `uploadImage` → `public/images/projects/`
   → path stored in JSON.
4. **Render:** `Portfolio.tsx` imports `data/projects.json` at build → site.
5. **Publish:** user commits `data/projects.json` + new images, pushes →
   Vercel rebuilds.

## Error handling

- Autofill: invalid URL, README not found (404 across branch/casing
  attempts), missing `GEMINI_API_KEY`, or Gemini error → surfaced inline in
  the dashboard with a retry; fields remain manually editable.
- Save: schema validation (portfolio must be length 4; required fields
  present) before writing; failure shows an error, no partial write.
- Production guard: dashboard route and all actions refuse to run in
  production.

## Testing

- Unit test the README→fields mapping in `lib/gemini.ts` with a mocked
  Gemini client (fixture README in → expected structured fields out).
- Unit test `saveProjects` read/write round-trip and schema validation
  (incl. rejecting portfolio length ≠ 4) against a temp file.
- Unit test the repo-URL parser and README-URL resolution.
- Manual verification: run `npm run dev`, open `/dashboard`, autofill from a
  real public repo, upload an image, save, confirm the home page reflects the
  change and the grid renders 20+ "Other projects" cleanly.

## Open questions

None.
