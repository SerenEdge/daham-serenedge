"use client";

import { useState } from "react";
import type { ProjectsData, PortfolioProject, OtherProject } from "@/types/projects";
import {
  saveProjectsAction,
  uploadImageAction,
  autofillFromRepoAction,
} from "./actions";

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
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="GitHub repo URL for autofill…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleAutofill()}
        />
        <button
          onClick={handleAutofill}
          disabled={loading || !url.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Filling…" : "Autofill"}
        </button>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFiles}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-gray-500">Uploading…</p>}
      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
      {images.length > 0 && (
        <ul className="flex flex-col gap-1">
          {images.map((src, i) => (
            <li key={src + i} className="flex items-center gap-2 text-sm">
              <span className="flex-1 truncate text-gray-600">{src}</span>
              <button
                onClick={() => moveImage(i, -1)}
                disabled={i === 0}
                className="px-2 py-0.5 border rounded text-xs disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => moveImage(i, 1)}
                disabled={i === images.length - 1}
                className="px-2 py-0.5 border rounded text-xs disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => removeImage(i)}
                className="px-2 py-0.5 border rounded text-xs text-red-600 hover:bg-red-50"
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
      setStatus("Saved ✓  (commit & push data/projects.json to publish)");
    } catch (e) {
      setStatus(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Project Dashboard (dev only)</h1>

      {/* ------------------------------------------------------------------ */}
      {/* Portfolio slots (fixed 4)                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">Portfolio Projects</h2>
        {data.portfolio.map((proj, i) => (
          <div key={proj.id} className="border rounded-lg p-5 space-y-4 bg-white shadow-sm">
            <h3 className="font-medium text-gray-800">Slot {i + 1}</h3>

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

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => updatePortfolio(i, { title: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={proj.subtitle ?? ""}
                onChange={(e) =>
                  updatePortfolio(i, { subtitle: e.target.value || undefined })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description (short) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Description (short)
              </label>
              <input
                type="text"
                value={proj.description}
                onChange={(e) => updatePortfolio(i, { description: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Long description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Long Description
              </label>
              <textarea
                rows={4}
                value={proj.longDescription}
                onChange={(e) =>
                  updatePortfolio(i, { longDescription: e.target.value })
                }
                className="w-full border rounded px-3 py-2 resize-y"
              />
            </div>

            {/* Tech chips */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Tech</label>
              <div className="flex flex-wrap gap-2">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-sm"
                  >
                    {t}
                    <button
                      onClick={() =>
                        setData((d) => {
                          const portfolio = d.portfolio.slice();
                          portfolio[i] = { ...portfolio[i], tech: portfolio[i].tech.filter((x) => x !== t) };
                          return { ...d, portfolio };
                        })
                      }
                      className="text-gray-500 hover:text-red-600 text-xs leading-none"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type and press Enter to add tech tag…"
                className="w-full border rounded px-3 py-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.currentTarget.value ?? "").trim();
                    if (val) {
                      setData((d) => {
                        const portfolio = d.portfolio.slice();
                        if (!portfolio[i].tech.includes(val)) {
                          portfolio[i] = { ...portfolio[i], tech: [...portfolio[i].tech, val] };
                        }
                        return { ...d, portfolio };
                      });
                    }
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>

            {/* Link */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Link</label>
              <input
                type="url"
                value={proj.link}
                onChange={(e) => updatePortfolio(i, { link: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Image manager */}
            <ImageManager
              images={proj.images}
              onChange={(images) => updatePortfolio(i, { images })}
            />
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Other projects list                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-xl font-semibold">Other Projects</h2>
          <button
            onClick={addOther}
            className="bg-gray-800 text-white px-4 py-1.5 rounded text-sm"
          >
            + Add project
          </button>
        </div>

        {data.otherProjects.map((proj, i) => (
          <div key={proj.id} className="border rounded-lg p-5 space-y-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Other #{i + 1}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => moveOther(i, -1)}
                  disabled={i === 0}
                  className="px-2 py-1 border rounded text-sm disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveOther(i, 1)}
                  disabled={i === data.otherProjects.length - 1}
                  className="px-2 py-1 border rounded text-sm disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeOther(i)}
                  className="px-2 py-1 border rounded text-sm text-red-600 hover:bg-red-50"
                  title="Remove"
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

            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => updateOther(i, { title: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={proj.description}
                onChange={(e) => updateOther(i, { description: e.target.value })}
                className="w-full border rounded px-3 py-2 resize-y"
              />
            </div>

            {/* Link */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Link</label>
              <input
                type="url"
                value={proj.link}
                onChange={(e) => updateOther(i, { link: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        ))}

        {data.otherProjects.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No other projects yet. Click &quot;+ Add project&quot; to add one.
          </p>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky save bar                                                     */}
      {/* ------------------------------------------------------------------ */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full shadow-lg disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save all"}
      </button>
      {status && <p className="fixed bottom-6 left-6 text-sm">{status}</p>}
    </main>
  );
}
