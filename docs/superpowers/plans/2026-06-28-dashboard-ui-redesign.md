# Dashboard UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `app/dashboard/DashboardClient.tsx` so the dashboard matches the site's editorial design language — off-white background, dark navy text, bottom-border inputs, navy rounded-full buttons, Portfolio.tsx-style numbered section headers, and mono uppercase labels — with zero logic changes.

**Architecture:** Single-file visual-only rewrite. All component logic (state, actions, validation) stays identical; only Tailwind class strings and JSX structure change. No new files, no new dependencies, no new tests needed — the existing 29 tests cover the logic and continue to pass unchanged. Visual verification is done by opening localhost:3000/dashboard.

**Tech Stack:** Tailwind v4, CSS custom properties from `app/globals.css`, React 19.

## Global Constraints

- Page background: `bg-background` (resolves to `#f8f8f8` via `--background`)
- Main text: `text-secondary` (resolves to `#1c1c2b` via `--secondary`)
- Muted text: `text-tertiary` (resolves to `#7b7b7b` via `--tertiary`)
- Dark accent / primary button bg: `bg-[#1c1c2b]`
- Body font: Aeonik — already applied globally; use `font-sans` when you need to explicitly assert it
- Mono font: `font-mono` (Geist Mono) for labels, tags, paths, and status messages
- Inputs: bottom-border only — `border-0 border-b border-gray-300` on a transparent background
- Primary button shape: `rounded-full bg-[#1c1c2b] text-white`
- Tech chip style exactly matches `Portfolio.tsx` line 278: `px-3 py-1.5 border border-gray-200 text-secondary rounded-full text-sm`
- Section cards: numbered with `font-mono text-tertiary` index matching Portfolio.tsx's `0{index+1}` pattern, separated by `border-t border-gray-200` — no box shadows, no heavy elevation
- No `bg-white` box cards with all-sides borders — the site does not use that pattern

---

### Task 1: Complete DashboardClient.tsx UI redesign

This is a single-cohesive visual rewrite. All logic is preserved verbatim; only class strings and layout structure change.

**Files:**
- Modify: `app/dashboard/DashboardClient.tsx` (full rewrite of JSX and class strings; logic unchanged)

**Interfaces:**
- Consumes: `ProjectsData`, `PortfolioProject`, `OtherProject` from `@/types/projects`; `saveProjectsAction`, `uploadImageAction`, `autofillFromRepoAction` from `./actions` — all unchanged
- Produces: same exported `default function DashboardClient({ initial })` — same props contract

- [ ] **Step 1: Confirm existing tests pass before touching anything**

```bash
npx vitest run
```

Expected: `Test Files  8 passed (8)` / `Tests  29 passed (29)`. If anything is failing, stop and fix it first.

- [ ] **Step 2: Replace `app/dashboard/DashboardClient.tsx` with the redesigned version**

Write the file below verbatim. Every logic path is identical to the current file — only class strings, layout wrappers, and visual structure change.

```tsx
"use client";

import { useState } from "react";
import type { ProjectsData, PortfolioProject, OtherProject } from "@/types/projects";
import {
  saveProjectsAction,
  uploadImageAction,
  autofillFromRepoAction,
} from "./actions";

// ---------------------------------------------------------------------------
// Shared design tokens — match the site's design language exactly
// ---------------------------------------------------------------------------
const inputCls =
  "w-full border-0 border-b border-gray-300 px-0 py-2.5 bg-transparent text-secondary placeholder:text-tertiary/60 focus:outline-none focus:border-secondary transition-colors text-base";
const labelCls = "text-xs font-mono uppercase tracking-wider text-tertiary";
const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-full bg-[#1c1c2b] px-4 py-2 text-white text-sm font-medium disabled:opacity-40 whitespace-nowrap transition-opacity hover:opacity-90";
const btnGhost =
  "text-tertiary hover:text-secondary transition-colors disabled:opacity-30 text-sm";

// ---------------------------------------------------------------------------
// AutofillRow
// ---------------------------------------------------------------------------
interface AutofillRowProps {
  kind: "portfolio" | "other";
  onFill: (result: {
    title: string;
    shortDescription: string;
    longDescription?: string;
    tech?: string[];
    link: string;
  }) => void;
}

function AutofillRow({ kind, onFill }: AutofillRowProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAutofill() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await autofillFromRepoAction(url.trim(), kind);
      onFill(result);
      setUrl("");
    } catch (e) {
      setError(`Autofill failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className={labelCls}>Autofill from GitHub</span>
      <div className="flex gap-3 items-end">
        <input
          type="url"
          placeholder="https://github.com/owner/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border-0 border-b border-gray-300 px-0 py-2 bg-transparent text-secondary placeholder:text-tertiary/60 focus:outline-none focus:border-secondary transition-colors text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleAutofill()}
        />
        <button
          onClick={handleAutofill}
          disabled={loading || !url.trim()}
          className={btnPrimary}
        >
          {loading ? "Filling…" : "Autofill"}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs font-mono mt-1">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ImageManager
// ---------------------------------------------------------------------------
interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function ImageManager({ images, onChange }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError(null);
    try {
      const paths: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const { path } = await uploadImageAction(fd);
        paths.push(path);
      }
      onChange([...images, ...paths]);
    } catch (err) {
      setUploadError(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(i: number) {
    onChange(images.filter((_, j) => j !== i));
  }

  function moveImage(i: number, dir: -1 | 1) {
    const arr = images.slice();
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className={labelCls}>Images</span>
      <label className="inline-flex items-center gap-2 cursor-pointer group w-fit">
        <span
          className={`text-sm font-medium border-b pb-0.5 transition-colors ${
            uploading
              ? "text-tertiary border-gray-200"
              : "text-secondary border-gray-300 group-hover:border-secondary"
          }`}
        >
          {uploading ? "Uploading…" : "Upload images"}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          disabled={uploading}
          className="sr-only"
        />
      </label>
      {uploadError && <p className="text-red-500 text-xs font-mono">{uploadError}</p>}
      {images.length > 0 && (
        <ul className="flex flex-col gap-2 mt-1">
          {images.map((src, i) => (
            <li key={src + i} className="flex items-center gap-3 border-b border-gray-100 pb-2">
              <span className="flex-1 truncate text-tertiary font-mono text-xs">{src}</span>
              <button
                onClick={() => moveImage(i, -1)}
                disabled={i === 0}
                className={btnGhost}
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(i, 1)}
                disabled={i === images.length - 1}
                className={btnGhost}
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => removeImage(i)}
                className="text-tertiary hover:text-red-500 transition-colors text-sm"
                title="Remove"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main DashboardClient
// ---------------------------------------------------------------------------
export default function DashboardClient({ initial }: { initial: ProjectsData }) {
  const [data, setData] = useState<ProjectsData>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function updatePortfolio(i: number, patch: Partial<PortfolioProject>) {
    setData((d) => {
      const portfolio = d.portfolio.slice();
      portfolio[i] = { ...portfolio[i], ...patch };
      return { ...d, portfolio };
    });
  }
  function updateOther(i: number, patch: Partial<OtherProject>) {
    setData((d) => {
      const otherProjects = d.otherProjects.slice();
      otherProjects[i] = { ...otherProjects[i], ...patch };
      return { ...d, otherProjects };
    });
  }
  function addOther() {
    setData((d) => ({
      ...d,
      otherProjects: [
        ...d.otherProjects,
        { id: crypto.randomUUID(), title: "", description: "", link: "" },
      ],
    }));
  }
  function removeOther(i: number) {
    setData((d) => ({
      ...d,
      otherProjects: d.otherProjects.filter((_, j) => j !== i),
    }));
  }
  function moveOther(i: number, dir: -1 | 1) {
    setData((d) => {
      const arr = d.otherProjects.slice();
      const j = i + dir;
      if (j < 0 || j >= arr.length) return d;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, otherProjects: arr };
    });
  }

  function findValidationError(d: ProjectsData): string | null {
    for (let i = 0; i < d.portfolio.length; i++) {
      const p = d.portfolio[i];
      const label = p.title.trim() ? `"${p.title.trim()}"` : `Portfolio slot ${i + 1}`;
      if (!p.title.trim()) return `Cannot save: ${label} is missing a title.`;
      if (!p.description.trim()) return `Cannot save: portfolio ${label} is missing a description.`;
      if (!p.longDescription.trim()) return `Cannot save: portfolio ${label} is missing a long description.`;
      if (!p.link.trim()) return `Cannot save: portfolio ${label} is missing a link.`;
      if (!p.images || p.images.length < 1) return `Cannot save: portfolio ${label} needs at least one image.`;
    }
    for (let i = 0; i < d.otherProjects.length; i++) {
      const p = d.otherProjects[i];
      const label = p.title.trim() ? `"${p.title.trim()}"` : `other project ${i + 1}`;
      if (!p.title.trim()) return `Cannot save: other project ${i + 1} is missing a title.`;
      if (!p.description.trim()) return `Cannot save: other project ${label} is missing a description.`;
      if (!p.link.trim()) return `Cannot save: other project ${label} is missing a link.`;
    }
    return null;
  }

  async function handleSave() {
    const validationError = findValidationError(data);
    if (validationError) {
      setStatus(validationError);
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await saveProjectsAction(data);
      setStatus("Saved ✓  — commit & push data/projects.json to publish");
    } catch (e) {
      setStatus(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-secondary">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-32 pt-16 space-y-20">

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="border-b border-gray-200 pb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-tertiary block mb-6">
            Dev only · not visible in production
          </span>
          <h1 className="text-6xl md:text-7xl font-medium tracking-tight text-secondary leading-none">
            Dashboard
          </h1>
          <p className="text-tertiary mt-4 text-sm font-mono">
            Edit → Save →{" "}
            <span className="text-secondary">git commit &amp;&amp; git push</span>
            {" "}→ Vercel rebuilds
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Portfolio section                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <div className="flex items-baseline gap-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-secondary">
              Portfolio
            </h2>
            <span className="text-tertiary font-mono text-sm uppercase tracking-wider hidden md:block">
              4 fixed slots
            </span>
          </div>

          <div className="flex flex-col">
            {data.portfolio.map((proj, i) => (
              <div key={proj.id} className="border-t border-gray-200 py-12 space-y-8">

                {/* Slot number + current title */}
                <div className="flex items-baseline gap-6">
                  <span className="text-3xl md:text-4xl font-medium text-tertiary font-mono">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-secondary">
                    {proj.title || "Untitled"}
                  </h3>
                </div>

                {/* Autofill */}
                <AutofillRow
                  kind="portfolio"
                  onFill={(result) =>
                    updatePortfolio(i, {
                      title: result.title,
                      description: result.shortDescription,
                      link: result.link,
                      ...(result.longDescription != null
                        ? { longDescription: result.longDescription }
                        : {}),
                      ...(result.tech != null ? { tech: result.tech } : {}),
                    })
                  }
                />

                {/* Title + Subtitle side by side on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updatePortfolio(i, { title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelCls}>Subtitle</label>
                    <input
                      type="text"
                      value={proj.subtitle ?? ""}
                      onChange={(e) =>
                        updatePortfolio(i, { subtitle: e.target.value || undefined })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Short Description</label>
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => updatePortfolio(i, { description: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Long Description</label>
                  <textarea
                    rows={4}
                    value={proj.longDescription}
                    onChange={(e) =>
                      updatePortfolio(i, { longDescription: e.target.value })
                    }
                    className={`${inputCls} resize-y`}
                  />
                </div>

                {/* Tech chips — exact match to Portfolio.tsx line 278 style */}
                <div className="flex flex-col gap-3">
                  <label className={labelCls}>Technologies</label>
                  <div className="flex flex-wrap gap-2 min-h-[2rem]">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-secondary rounded-full text-sm hover:border-gray-400 transition-colors"
                      >
                        {t}
                        <button
                          onClick={() =>
                            setData((d) => {
                              const portfolio = d.portfolio.slice();
                              portfolio[i] = {
                                ...portfolio[i],
                                tech: portfolio[i].tech.filter((x) => x !== t),
                              };
                              return { ...d, portfolio };
                            })
                          }
                          className="text-tertiary hover:text-red-500 transition-colors leading-none"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {proj.tech.length === 0 && (
                      <span className="text-tertiary/60 text-sm font-mono">No tags yet</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter…"
                    className={`${inputCls} text-sm`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = (e.currentTarget.value ?? "").trim();
                        if (val) {
                          setData((d) => {
                            const portfolio = d.portfolio.slice();
                            if (!portfolio[i].tech.includes(val)) {
                              portfolio[i] = {
                                ...portfolio[i],
                                tech: [...portfolio[i].tech, val],
                              };
                            }
                            return { ...d, portfolio };
                          });
                        }
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Link</label>
                  <input
                    type="url"
                    value={proj.link}
                    onChange={(e) => updatePortfolio(i, { link: e.target.value })}
                    className={inputCls}
                    placeholder="https://…"
                  />
                </div>

                <ImageManager
                  images={proj.images}
                  onChange={(images) => updatePortfolio(i, { images })}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Other projects section                                             */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-secondary">
              Other projects
            </h2>
            <button onClick={addOther} className={btnPrimary}>
              + Add project
            </button>
          </div>

          {data.otherProjects.length === 0 && (
            <div className="border-t border-gray-200 py-16 text-center">
              <p className="text-tertiary font-mono text-sm">No other projects yet —</p>
              <p className="text-tertiary font-mono text-sm">
                click &ldquo;+ Add project&rdquo; to add one.
              </p>
            </div>
          )}

          <div className="flex flex-col">
            {data.otherProjects.map((proj, i) => (
              <div key={proj.id} className="border-t border-gray-200 py-10 space-y-8">

                {/* Number + title + controls */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="text-xl font-medium text-tertiary font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-medium tracking-tight text-secondary">
                      {proj.title || "Untitled"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => moveOther(i, -1)}
                      disabled={i === 0}
                      className={btnGhost}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveOther(i, 1)}
                      disabled={i === data.otherProjects.length - 1}
                      className={btnGhost}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeOther(i)}
                      className="text-xs font-mono uppercase tracking-wider text-tertiary hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Autofill */}
                <AutofillRow
                  kind="other"
                  onFill={(result) =>
                    updateOther(i, {
                      title: result.title,
                      description: result.shortDescription,
                      link: result.link,
                    })
                  }
                />

                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateOther(i, { title: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={3}
                    value={proj.description}
                    onChange={(e) => updateOther(i, { description: e.target.value })}
                    className={`${inputCls} resize-y`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelCls}>Link</label>
                  <input
                    type="url"
                    value={proj.link}
                    onChange={(e) => updateOther(i, { link: e.target.value })}
                    className={inputCls}
                    placeholder="https://…"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Fixed save bar                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-background/90 backdrop-blur-sm px-6 md:px-12 py-4 flex items-center gap-6">
        {status && (
          <p
            className={`text-sm font-mono flex-1 ${
              status.startsWith("Saved") ? "text-green-700" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`ml-auto ${btnPrimary} px-6 py-3`}
        >
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Confirm tests still pass**

```bash
npx vitest run
```

Expected: `Test Files  8 passed (8)` / `Tests  29 passed (29)` — identical to Step 1. Zero logic changed, so zero tests should change.

- [ ] **Step 4: Visual verification**

Open `http://localhost:3000/dashboard` (dev server must be running: `npm run dev`).

Check all of the following:

| Check | Expected |
|-------|----------|
| Page background | Off-white `#f8f8f8` — not pure white, not dark |
| All text | Dark navy `#1c1c2b` — clearly readable |
| Labels | Tiny, grey, uppercase, monospaced (`AUTOFILL FROM GITHUB`) |
| Inputs | Bottom border only, no box, text turns dark on focus |
| "Autofill" button | Dark navy pill, white text |
| "Save all" button | Dark navy pill in bottom bar, white text |
| "+ Add project" button | Dark navy pill, white text |
| Tech chips | Outlined pill, dark navy text — matches site's Portfolio section |
| Portfolio headers | `01`, `02`, `03`, `04` in grey mono next to project title |
| Other project headers | `01`, `02` … in grey mono |
| Section dividers | Thin `1px` light-grey horizontal lines — no boxes |
| Save bar | Fixed bottom, frosted glass `bg-background/90 backdrop-blur-sm` |
| Success status | Green mono text left of save button |
| Error status | Red mono text left of save button |
| "Upload images" | Text link with underline, not a box button |
| Image list paths | Truncated mono text, grey, small |

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/DashboardClient.tsx
git commit -m "style: redesign dashboard UI to match site design language"
```
