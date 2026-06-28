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
  function movePortfolio(i: number, dir: -1 | 1) {
    setData((d) => {
      const portfolio = d.portfolio.slice();
      const j = i + dir;
      if (j < 0 || j >= portfolio.length) return d;
      [portfolio[i], portfolio[j]] = [portfolio[j], portfolio[i]];
      return { ...d, portfolio };
    });
  }
  function moveToOtherProjects(i: number) {
    setData((d) => {
      const portfolio = d.portfolio.slice();
      const proj = portfolio[i];
      const asOther: OtherProject = {
        id: crypto.randomUUID(),
        title: proj.title,
        description: proj.description,
        link: proj.link,
      };
      // Clear the portfolio slot so the user can fill it with a new project
      portfolio[i] = {
        id: proj.id,
        title: "",
        subtitle: undefined,
        description: "",
        longDescription: "",
        tech: [],
        link: "",
        images: [],
      };
      return { ...d, portfolio, otherProjects: [...d.otherProjects, asOther] };
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
              Always 4 · reorderable
            </span>
          </div>

          <div className="flex flex-col">
            {data.portfolio.map((proj, i) => (
              <div key={proj.id} className="border-t border-gray-200 py-12 space-y-8">

                {/* Slot number + title + reorder/move controls */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-6">
                    <span className="text-3xl md:text-4xl font-medium text-tertiary font-mono">
                      0{i + 1}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-secondary">
                      {proj.title || "Untitled"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 pt-1 shrink-0">
                    <button
                      onClick={() => movePortfolio(i, -1)}
                      disabled={i === 0}
                      className={btnGhost}
                      title="Move up"
                    >↑</button>
                    <button
                      onClick={() => movePortfolio(i, 1)}
                      disabled={i === data.portfolio.length - 1}
                      className={btnGhost}
                      title="Move down"
                    >↓</button>
                    <button
                      onClick={() => moveToOtherProjects(i)}
                      className="text-xs font-mono uppercase tracking-wider text-tertiary hover:text-secondary transition-colors"
                      title="Move this project to Other projects and clear this slot"
                    >
                      → Other projects
                    </button>
                  </div>
                </div>

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

                {/* Tech chips — exact match to Portfolio.tsx technology pills */}
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
