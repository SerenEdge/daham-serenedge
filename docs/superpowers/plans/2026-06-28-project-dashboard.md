# Local Project Dashboard + Gemini Autofill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-dev-only dashboard at `/dashboard` that edits the portfolio's project content (4 portfolio cards + unlimited "Other projects") into a committed `data/projects.json`, with Google Gemini autofill from a GitHub repo README, and redesign the "Other projects" section into a responsive folder-card grid.

**Architecture:** Content lives in `data/projects.json` (single source of truth), imported by `components/Portfolio.tsx` at build time. A dev-only dashboard writes that file and uploads images into `public/images/projects/` via Next.js Server Actions. Pure, testable logic (validation, repo-URL parsing, README fetch, Gemini extraction) lives in `lib/`; actions are thin dev-guarded wrappers. Tests run on Vitest.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, GSAP/ScrollTrigger, `@google/genai`, Vitest.

## Global Constraints

- Next.js 16, React 19, App Router, TypeScript `strict: true`.
- Path alias: `@/*` → project root (e.g. `@/data/projects.json`, `@/lib/github`).
- `resolveJsonModule` is enabled — JSON may be imported directly.
- Dashboard and all its server actions MUST refuse to run when `process.env.NODE_ENV === "production"` (return `notFound()` for the route; throw for actions).
- No auth, no database. Persistence is the committed `data/projects.json` + files in `public/images/projects/`.
- Portfolio list is ALWAYS exactly 4 entries. "Other projects" is unlimited.
- Gemini model: `gemini-flash-latest`, via `@google/genai`, key `GEMINI_API_KEY`.
- Section heading must read **"Other projects"** (replacing "Mini Projects").
- Folder-card aesthetic colour: `#1c1c2b` background, white text.
- Commit after every task. Use `git add <exact files>`.

---

### Task 1: Test infrastructure + dependencies

**Files:**
- Modify: `package.json` (add deps + `test` script)
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a working `npm test` command and a `@` path alias resolvable in tests.

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install @google/genai
npm install -D vitest @vitejs/plugin-react
```
Expected: both complete; `@google/genai`, `vitest`, `@vitejs/plugin-react` appear in `package.json`.

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
```

- [ ] **Step 4: Write the smoke test**

`tests/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("test infra", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run it to verify the runner works**

Run: `npm test`
Expected: PASS — 1 test passing.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/smoke.test.ts
git commit -m "chore: add vitest test infra and @google/genai dependency"
```

---

### Task 2: Shared types + seed data file

**Files:**
- Create: `types/projects.ts`
- Create: `data/projects.json`
- Test: `tests/projects-data.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `PortfolioProject { id: string; title: string; subtitle?: string; description: string; longDescription: string; tech: string[]; link: string; images: string[] }`
  - `OtherProject { id: string; title: string; description: string; link: string }`
  - `ProjectsData { portfolio: PortfolioProject[]; otherProjects: OtherProject[] }`
  - `data/projects.json` conforming to `ProjectsData` (portfolio length 4).

- [ ] **Step 1: Create the types**

`types/projects.ts`:
```ts
export interface PortfolioProject {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription: string;
  tech: string[];
  link: string;
  images: string[];
}

export interface OtherProject {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface ProjectsData {
  portfolio: PortfolioProject[];
  otherProjects: OtherProject[];
}
```

- [ ] **Step 2: Create the seed data**

`data/projects.json` — port the existing content from `components/Portfolio.tsx`. Every portfolio entry MUST have an `images` array (convert ReImage's single `image` to a one-element `images` array). Use these exact 4 portfolio + 8 other entries:

```json
{
  "portfolio": [
    {
      "id": "sotercare",
      "title": "SoterCare",
      "subtitle": "(2nd Year Project - Ongoing)",
      "description": "IoT & ML Based Elderly Care Monitoring System.",
      "longDescription": "SoterCare is an innovative IoT and Machine Learning-driven elderly care monitoring system designed to provide proactive, dignified safety. Unlike traditional reactive SOS buttons, it predicts falls and detects urinary incontinence in real-time. By integrating wearable sensor nodes with a dedicated edge gateway, the system ensures continuous vitals monitoring and automated emergency alerts, offering a comprehensive safety net for seniors while maintaining their independence.",
      "tech": ["IoT", "Raspberry Pi", "React Native", "C++", "NestJS", "Python", "PostgreSQL", "Docker", "Redis", "RAG", "Edge Impulse"],
      "link": "https://sotercare.com",
      "images": ["/images/projects/sotercare-website.webp", "/images/projects/sotercareteam.webp", "/images/projects/sotercare-finaldevice.webp", "/images/projects/sotercare-prototype1v.webp", "/images/projects/sotercare-studio.webp", "/images/projects/sotercare-mobileapp.webp", "/images/projects/sotercare-gitorg.webp"]
    },
    {
      "id": "imgharvest",
      "title": "ImgHarvest",
      "subtitle": "Powered by WSO2 Ballerina & Choreo",
      "description": "Image dataset collection tool for ML models",
      "longDescription": "I built Image Harvest to streamline the collection of high-quality image datasets for training image recognition ML models. The backend is powered by WSO2's Ballerina language, providing a robust and scalable integration layer for image fetching. Paired with a modern React frontend, the tool allows users to effortlessly search and download image batches. The complete application will soon be deployed and hosted on WSO2 Choreo for enterprise-grade reliability.",
      "tech": ["Ballerina", "Next.js", "TypeScript", "Docker", "WSO2 Choreo", "SerpApi", "GrokApi"],
      "link": "https://github.com/DahamDissanayake/img-harvest-ballerina",
      "images": ["/images/projects/imgharvest1.webp", "/images/projects/imgharvest2.webp"]
    },
    {
      "id": "vibecheck",
      "title": "VibeCheck [Chrome Extension]",
      "subtitle": "Available on the Chrome Web Store.",
      "description": "Visual web layout debugging assistant",
      "longDescription": "I built VibeCheck to bridge the gap between spotting visual layout bugs and fixing them. It’s a Chrome Extension available on the chrome web store, built with JavaScript, HTML5, and CSS3 (Manifest V3) that lets me inspect pages, overlay precision grids, and click to mark 'friction points.' The tool automatically synthesizes this visual data into structured prompts for AI assistants, drastically streamlining the process of turning design feedback into code.",
      "tech": ["JavaScript", "HTML5", "CSS3", "Manifest V3"],
      "link": "https://github.com/DahamDissanayake/web-design-prompt-extension",
      "images": ["/images/projects/vibecheck1.webp", "/images/projects/vibecheck2.webp"]
    },
    {
      "id": "reimage",
      "title": "ReImage Agent",
      "subtitle": "(Ongoing)",
      "description": "AI-powered constant avatars for communities.",
      "longDescription": "I built ReImage-Agent to unify user identities across platforms, like clubs requiring consistent member avatars. By leveraging a custom prompt pipeline, it automatically transforms photos into cohesive, stylized cartoons while preserving facial features. The system is built with Next.js and Tailwind CSS for a sleek frontend, backed by FastAPI and Google's Gemini 2.5 Flash model for high-performance, intelligent image generation.",
      "tech": ["Next.js", "FastAPI", "Python", "Gemini (Nano Banana)"],
      "link": "https://github.com/DahamDissanayake/ReImage-Agent",
      "images": ["/images/projects/reimage.webp"]
    }
  ],
  "otherProjects": [
    { "id": "visionslide", "title": "Visionslide", "description": "VisionSlide v2.1 is a Python-based hands-free presentation controller that uses your webcam as a gesture interface. Built with OpenCV and PyAutoGUI, it detects vertical hand movements to trigger ‘Up’ and ‘Down’ key presses, enabling smooth slide or document navigation. A CustomTkinter UI, visual feedback, and adjustable sensitivity enhance usability.", "link": "https://github.com/DahamDissanayake/vision-slide" },
    { "id": "imposter-game", "title": "Imposter Game", "description": "Built using React and Vite, this custom Imposter Game is my answer to the trend of paywalled gaming apps. I created this project to provide a completely free, feature-rich alternative where users can enjoy all modes without payment. Hosted on GitHub Pages, it ensures a seamless and accessible experience for everyone to play together.", "link": "https://github.com/DahamDissanayake/Imposter-Game-But-Customized-V2" },
    { "id": "dev-pulse-api", "title": "Dev-Pulse API", "description": "Dev-Pulse is a cloud-native BFF service that aggregates GitHub API data to generate a live Dev-Pulse Score. Built with Ballerina Swan Lake and hosted on WSO2 Choreo, it securely injects tokens at runtime, enabling real-time portfolio insights without exposing sensitive data.", "link": "https://github.com/DahamDissanayake/dev-pulse-api" },
    { "id": "flood-watch", "title": "Flood-Watch [NullProduct]", "description": "Flood-Watch is a real-time, offline-capable flood warning system designed to protect vulnerable communities in Sri Lanka. Winning runners-up at the Vertex'25 IoT competition, we built it using Edge Computing on ESP32 Magicbit and Ultrasonic Sensors to detect flash floods instantly. It ensures life-saving alerts even when internet connectivity fails.", "link": "https://github.com/DahamDissanayake/NullProduct-VERTEX25" },
    { "id": "keyboard-macro-writer", "title": "Keyboard Macro Writer", "description": "I developed this Python-based Keystroke Simulator to automate data entry with a human touch. Utilizing pynput for precise keyboard control and tkinter for an intuitive GUI, the tool lets me pre-record text and replay it with randomized delays. My goal was to create a seamless way to mimic natural typing patterns, making automated inputs indistinguishable from manual keystrokes.", "link": "https://github.com/DahamDissanayake/keyboard-macro-writer" },
    { "id": "apple-photo-sorter", "title": "Apple Photo Sorter", "description": "I developed this Python and Tkinter application because copying photos from an iPhone often results in a messy, disorganized file structure. This tool solves that by automating the backup process: it scans the chaotic source folders and neatly sorts every image into clean, year-based directories at your chosen destination, ensuring a structured archive.", "link": "https://github.com/DahamDissanayake/Apple-Photo-Sorter" },
    { "id": "tripwire-yolo", "title": "Tripwire-YOLO", "description": "I built Tripwire-YOLO as an intelligent security solution to monitor my space in real time. It allows me to draw a virtual line on a live webcam feed, triggering instant alerts and snapshots when crossed. Powered by YOLOv8 and CustomTkinter, it runs on a threaded architecture for smooth performance.", "link": "https://github.com/DahamDissanayake/tripwire-YOLO" },
    { "id": "apple-homekit-automation", "title": "Apple HomeKit Automation", "description": "This is a native HomeKit-integrated IoT switch that enables direct voice control over high-voltage home electronics. By implementing the Apple HomeKit Accessory Protocol (HAP) on an ESP8266, the project allows for seamless pairing with the Apple Home app via QR code. Users can trigger a physical relay to toggle appliances—such as lamps or fans—using Siri commands or automated scenes, all while maintaining local, bridge-free communication for low latency and enhanced privacy.", "link": "https://github.com/DahamDissanayake/Apple-homekit-esp8266" }
  ]
}
```

- [ ] **Step 3: Write the failing test**

`tests/projects-data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import data from "@/data/projects.json";
import type { ProjectsData } from "@/types/projects";

describe("seed projects.json", () => {
  const d = data as ProjectsData;

  it("has exactly 4 portfolio projects", () => {
    expect(d.portfolio).toHaveLength(4);
  });

  it("every portfolio project has required fields and a non-empty images array", () => {
    for (const p of d.portfolio) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.longDescription).toBeTruthy();
      expect(Array.isArray(p.tech)).toBe(true);
      expect(p.link).toMatch(/^https?:\/\//);
      expect(Array.isArray(p.images)).toBe(true);
      expect(p.images.length).toBeGreaterThan(0);
    }
  });

  it("every other project has id, title, description, link", () => {
    expect(d.otherProjects.length).toBeGreaterThan(0);
    for (const o of d.otherProjects) {
      expect(o.id).toBeTruthy();
      expect(o.title).toBeTruthy();
      expect(o.description).toBeTruthy();
      expect(o.link).toMatch(/^https?:\/\//);
    }
  });

  it("all ids are unique", () => {
    const ids = [...d.portfolio, ...d.otherProjects].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 4: Run the test**

Run: `npm test -- tests/projects-data.test.ts`
Expected: PASS (4 tests). If it fails, fix `data/projects.json`.

- [ ] **Step 5: Commit**

```bash
git add types/projects.ts data/projects.json tests/projects-data.test.ts
git commit -m "feat: add shared project types and seed projects.json"
```

---

### Task 3: GitHub repo URL parsing + README fetch

**Files:**
- Create: `lib/github.ts`
- Test: `tests/github.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `parseRepoUrl(url: string): { owner: string; repo: string }` — throws `Error` on invalid input.
  - `fetchReadme(url: string, fetchImpl?: typeof fetch): Promise<string>` — returns README markdown; throws `Error("README not found")` if none of the candidates resolve.

- [ ] **Step 1: Write the failing test**

`tests/github.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { parseRepoUrl, fetchReadme } from "@/lib/github";

describe("parseRepoUrl", () => {
  it("parses a standard https url", () => {
    expect(parseRepoUrl("https://github.com/DahamDissanayake/vision-slide"))
      .toEqual({ owner: "DahamDissanayake", repo: "vision-slide" });
  });
  it("strips a trailing .git and slash", () => {
    expect(parseRepoUrl("https://github.com/a/b.git/"))
      .toEqual({ owner: "a", repo: "b" });
  });
  it("ignores extra path segments", () => {
    expect(parseRepoUrl("https://github.com/a/b/tree/main"))
      .toEqual({ owner: "a", repo: "b" });
  });
  it("throws on non-github url", () => {
    expect(() => parseRepoUrl("https://example.com/a/b")).toThrow();
  });
  it("throws on garbage", () => {
    expect(() => parseRepoUrl("not a url")).toThrow();
  });
});

describe("fetchReadme", () => {
  it("returns the first branch/casing that resolves 200", async () => {
    const fake = vi.fn(async (u: string) => {
      if (u.includes("/HEAD/README.md")) {
        return { ok: true, text: async () => "# Hello\nbody" } as Response;
      }
      return { ok: false, text: async () => "" } as Response;
    });
    const md = await fetchReadme("https://github.com/a/b", fake as unknown as typeof fetch);
    expect(md).toContain("# Hello");
  });

  it("throws when no candidate resolves", async () => {
    const fake = vi.fn(async () => ({ ok: false, text: async () => "" } as Response));
    await expect(
      fetchReadme("https://github.com/a/b", fake as unknown as typeof fetch)
    ).rejects.toThrow(/README not found/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/github.test.ts`
Expected: FAIL — cannot find module `@/lib/github`.

- [ ] **Step 3: Implement `lib/github.ts`**

```ts
export interface RepoRef {
  owner: string;
  repo: string;
}

export function parseRepoUrl(url: string): RepoRef {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
  if (!/(^|\.)github\.com$/.test(u.hostname)) {
    throw new Error(`Not a github.com URL: ${url}`);
  }
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`URL is missing owner/repo: ${url}`);
  }
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");
  if (!owner || !repo) {
    throw new Error(`Could not parse owner/repo from: ${url}`);
  }
  return { owner, repo };
}

const README_NAMES = ["README.md", "readme.md", "Readme.md"];
const BRANCHES = ["HEAD", "main", "master"];

export async function fetchReadme(
  url: string,
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const { owner, repo } = parseRepoUrl(url);
  for (const branch of BRANCHES) {
    for (const name of README_NAMES) {
      const raw = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`;
      try {
        const res = await fetchImpl(raw);
        if (res.ok) {
          const text = await res.text();
          if (text.trim().length > 0) return text;
        }
      } catch {
        // try next candidate
      }
    }
  }
  throw new Error(`README not found for ${owner}/${repo}`);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tests/github.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts tests/github.test.ts
git commit -m "feat: add github repo url parsing and README fetch"
```

---

### Task 4: Gemini structured extraction

**Files:**
- Create: `lib/gemini.ts`
- Test: `tests/gemini.test.ts`

**Interfaces:**
- Consumes: nothing (the `@google/genai` client is injected for testability).
- Produces:
  - `type AutofillKind = "portfolio" | "other"`
  - `interface AutofillResult { title: string; shortDescription: string; longDescription?: string; tech?: string[] }`
  - `interface GenAILike { models: { generateContent(args: unknown): Promise<{ text: string }> } }`
  - `extractProjectFromReadme(readme: string, kind: AutofillKind, client?: GenAILike): Promise<AutofillResult>` — throws if `readme` is blank, or if `GEMINI_API_KEY` is missing when no client is injected.

- [ ] **Step 1: Write the failing test**

`tests/gemini.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { extractProjectFromReadme, type GenAILike } from "@/lib/gemini";

function fakeClient(json: object): GenAILike {
  return {
    models: {
      generateContent: vi.fn(async () => ({ text: JSON.stringify(json) })),
    },
  };
}

describe("extractProjectFromReadme", () => {
  it("maps the model JSON into an AutofillResult for portfolio", async () => {
    const client = fakeClient({
      title: "Vision Slide",
      shortDescription: "Gesture slide controller",
      longDescription: "A webcam gesture tool built with OpenCV.",
      tech: ["Python", "OpenCV"],
    });
    const r = await extractProjectFromReadme("# Vision Slide\nstuff", "portfolio", client);
    expect(r.title).toBe("Vision Slide");
    expect(r.shortDescription).toBe("Gesture slide controller");
    expect(r.longDescription).toContain("OpenCV");
    expect(r.tech).toEqual(["Python", "OpenCV"]);
  });

  it("returns title + shortDescription for kind other", async () => {
    const client = fakeClient({ title: "X", shortDescription: "Y" });
    const r = await extractProjectFromReadme("# X", "other", client);
    expect(r).toMatchObject({ title: "X", shortDescription: "Y" });
  });

  it("throws on blank readme", async () => {
    const client = fakeClient({});
    await expect(extractProjectFromReadme("   ", "other", client)).rejects.toThrow();
  });

  it("throws a clear error when the model returns invalid JSON", async () => {
    const bad: GenAILike = {
      models: { generateContent: vi.fn(async () => ({ text: "not json" })) },
    };
    await expect(extractProjectFromReadme("# X", "other", bad)).rejects.toThrow(/parse/i);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/gemini.test.ts`
Expected: FAIL — cannot find module `@/lib/gemini`.

- [ ] **Step 3: Implement `lib/gemini.ts`**

```ts
import { GoogleGenAI } from "@google/genai";

export type AutofillKind = "portfolio" | "other";

export interface AutofillResult {
  title: string;
  shortDescription: string;
  longDescription?: string;
  tech?: string[];
}

export interface GenAILike {
  models: {
    generateContent(args: unknown): Promise<{ text: string }>;
  };
}

const MODEL = "gemini-flash-latest";

function buildPrompt(readme: string, kind: AutofillKind): string {
  const fields =
    kind === "portfolio"
      ? `- title: the project name (short)
- shortDescription: one sentence, max ~12 words
- longDescription: 2-4 sentences describing what it does and how it's built, first person ("I built...")
- tech: array of the main technologies/languages/frameworks used`
      : `- title: the project name (short)
- shortDescription: 2-4 sentences describing what it does and how it's built, first person ("I built...")`;

  return `You are extracting structured portfolio metadata from a GitHub project's README.
Return ONLY the requested fields based on the README. Do not invent facts not supported by the README.

Fields:
${fields}

README:
"""
${readme.slice(0, 12000)}
"""`;
}

function buildSchema(kind: AutofillKind) {
  const properties: Record<string, unknown> = {
    title: { type: "string" },
    shortDescription: { type: "string" },
  };
  const required = ["title", "shortDescription"];
  if (kind === "portfolio") {
    properties.longDescription = { type: "string" };
    properties.tech = { type: "array", items: { type: "string" } };
    required.push("longDescription", "tech");
  }
  return { type: "object", properties, required };
}

export async function extractProjectFromReadme(
  readme: string,
  kind: AutofillKind,
  client?: GenAILike
): Promise<AutofillResult> {
  if (!readme || readme.trim().length === 0) {
    throw new Error("README is empty — nothing to extract.");
  }

  const genai: GenAILike =
    client ??
    (() => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
      return new GoogleGenAI({ apiKey }) as unknown as GenAILike;
    })();

  const res = await genai.models.generateContent({
    model: MODEL,
    contents: buildPrompt(readme, kind),
    config: {
      responseMimeType: "application/json",
      responseSchema: buildSchema(kind),
    },
  });

  let parsed: AutofillResult;
  try {
    parsed = JSON.parse(res.text) as AutofillResult;
  } catch {
    throw new Error("Failed to parse Gemini response as JSON.");
  }
  if (!parsed.title || !parsed.shortDescription) {
    throw new Error("Gemini response missing required fields.");
  }
  return parsed;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tests/gemini.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/gemini.ts tests/gemini.test.ts
git commit -m "feat: add Gemini README extraction"
```

---

### Task 5: Projects store (validate + read/write) and image filename helper

**Files:**
- Create: `lib/projects-store.ts`
- Create: `lib/upload.ts`
- Test: `tests/projects-store.test.ts`
- Test: `tests/upload.test.ts`

**Interfaces:**
- Consumes: `ProjectsData`, `PortfolioProject`, `OtherProject` from `@/types/projects`.
- Produces:
  - `validateProjectsData(data: unknown): ProjectsData` — throws `Error` on invalid shape (portfolio length ≠ 4, missing required fields).
  - `readProjects(file?: string): Promise<ProjectsData>`
  - `writeProjects(data: ProjectsData, file?: string): Promise<void>` (validates, pretty-prints with 2 spaces + trailing newline). Default file: `data/projects.json` at repo root.
  - `safeImageFilename(original: string, existing: string[]): string` — returns a slugified, collision-free filename.

- [ ] **Step 1: Write the failing tests**

`tests/projects-store.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mkdtemp, readFile } from "node:fs/promises";
import { validateProjectsData, writeProjects, readProjects } from "@/lib/projects-store";
import type { ProjectsData } from "@/types/projects";

const valid: ProjectsData = {
  portfolio: Array.from({ length: 4 }, (_, i) => ({
    id: `p${i}`,
    title: `T${i}`,
    description: "short",
    longDescription: "long",
    tech: ["x"],
    link: "https://example.com",
    images: ["/images/projects/a.webp"],
  })),
  otherProjects: [
    { id: "o1", title: "O", description: "d", link: "https://example.com" },
  ],
};

describe("validateProjectsData", () => {
  it("accepts a valid payload", () => {
    expect(validateProjectsData(valid)).toEqual(valid);
  });
  it("rejects portfolio length != 4", () => {
    const bad = { ...valid, portfolio: valid.portfolio.slice(0, 3) };
    expect(() => validateProjectsData(bad)).toThrow(/exactly 4/);
  });
  it("rejects a portfolio item with no images", () => {
    const bad = {
      ...valid,
      portfolio: [{ ...valid.portfolio[0], images: [] }, ...valid.portfolio.slice(1)],
    };
    expect(() => validateProjectsData(bad)).toThrow(/images/);
  });
  it("rejects an other project missing a link", () => {
    const bad = { ...valid, otherProjects: [{ id: "o", title: "t", description: "d" }] };
    expect(() => validateProjectsData(bad as unknown)).toThrow(/link/);
  });
});

describe("read/write round-trip", () => {
  it("writes then reads identical data", async () => {
    const dir = await mkdtemp(join(tmpdir(), "proj-"));
    const file = join(dir, "projects.json");
    await writeProjects(valid, file);
    const raw = await readFile(file, "utf8");
    expect(raw.endsWith("\n")).toBe(true);
    const back = await readProjects(file);
    expect(back).toEqual(valid);
  });

  it("write rejects invalid data without creating a file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "proj-"));
    const file = join(dir, "nope.json");
    const bad = { ...valid, portfolio: [] };
    await expect(writeProjects(bad as ProjectsData, file)).rejects.toThrow();
    await expect(readFile(file, "utf8")).rejects.toBeTruthy();
  });
});
```

`tests/upload.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { safeImageFilename } from "@/lib/upload";

describe("safeImageFilename", () => {
  it("slugifies the base name and keeps the extension", () => {
    expect(safeImageFilename("My Cool Shot.PNG", [])).toBe("my-cool-shot.png");
  });
  it("avoids collisions by appending a counter", () => {
    expect(safeImageFilename("a.webp", ["a.webp"])).toBe("a-1.webp");
    expect(safeImageFilename("a.webp", ["a.webp", "a-1.webp"])).toBe("a-2.webp");
  });
  it("strips unsafe characters", () => {
    expect(safeImageFilename("../../etc/passwd.jpg", [])).toBe("etc-passwd.jpg");
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm test -- tests/projects-store.test.ts tests/upload.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `lib/upload.ts`**

```ts
export function safeImageFilename(original: string, existing: string[]): string {
  const dot = original.lastIndexOf(".");
  const rawExt = dot >= 0 ? original.slice(dot + 1) : "";
  const rawBase = dot >= 0 ? original.slice(0, dot) : original;

  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base =
    rawBase
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image";

  const taken = new Set(existing);
  const candidate = ext ? `${base}.${ext}` : base;
  if (!taken.has(candidate)) return candidate;

  let n = 1;
  for (;;) {
    const next = ext ? `${base}-${n}.${ext}` : `${base}-${n}`;
    if (!taken.has(next)) return next;
    n++;
  }
}
```

- [ ] **Step 4: Implement `lib/projects-store.ts`**

```ts
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectsData, PortfolioProject, OtherProject } from "@/types/projects";

const DEFAULT_FILE = join(process.cwd(), "data", "projects.json");

function isStr(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function validatePortfolio(p: unknown, i: number): PortfolioProject {
  if (typeof p !== "object" || p === null) throw new Error(`portfolio[${i}] is not an object`);
  const o = p as Record<string, unknown>;
  if (!isStr(o.id)) throw new Error(`portfolio[${i}].id is required`);
  if (!isStr(o.title)) throw new Error(`portfolio[${i}].title is required`);
  if (!isStr(o.description)) throw new Error(`portfolio[${i}].description is required`);
  if (!isStr(o.longDescription)) throw new Error(`portfolio[${i}].longDescription is required`);
  if (!isStr(o.link)) throw new Error(`portfolio[${i}].link is required`);
  if (!Array.isArray(o.tech)) throw new Error(`portfolio[${i}].tech must be an array`);
  if (!Array.isArray(o.images) || o.images.length === 0)
    throw new Error(`portfolio[${i}].images must be a non-empty array`);
  return {
    id: o.id,
    title: o.title,
    subtitle: isStr(o.subtitle) ? o.subtitle : undefined,
    description: o.description,
    longDescription: o.longDescription,
    tech: o.tech.map(String),
    link: o.link,
    images: o.images.map(String),
  };
}

function validateOther(p: unknown, i: number): OtherProject {
  if (typeof p !== "object" || p === null) throw new Error(`otherProjects[${i}] is not an object`);
  const o = p as Record<string, unknown>;
  if (!isStr(o.id)) throw new Error(`otherProjects[${i}].id is required`);
  if (!isStr(o.title)) throw new Error(`otherProjects[${i}].title is required`);
  if (!isStr(o.description)) throw new Error(`otherProjects[${i}].description is required`);
  if (!isStr(o.link)) throw new Error(`otherProjects[${i}].link is required`);
  return { id: o.id, title: o.title, description: o.description, link: o.link };
}

export function validateProjectsData(data: unknown): ProjectsData {
  if (typeof data !== "object" || data === null) throw new Error("data must be an object");
  const o = data as Record<string, unknown>;
  if (!Array.isArray(o.portfolio)) throw new Error("portfolio must be an array");
  if (o.portfolio.length !== 4) throw new Error("portfolio must contain exactly 4 projects");
  if (!Array.isArray(o.otherProjects)) throw new Error("otherProjects must be an array");
  return {
    portfolio: o.portfolio.map(validatePortfolio),
    otherProjects: o.otherProjects.map(validateOther),
  };
}

export async function readProjects(file: string = DEFAULT_FILE): Promise<ProjectsData> {
  const raw = await readFile(file, "utf8");
  return validateProjectsData(JSON.parse(raw));
}

export async function writeProjects(
  data: ProjectsData,
  file: string = DEFAULT_FILE
): Promise<void> {
  const valid = validateProjectsData(data);
  await writeFile(file, JSON.stringify(valid, null, 2) + "\n", "utf8");
}
```

- [ ] **Step 5: Run to verify they pass**

Run: `npm test -- tests/projects-store.test.ts tests/upload.test.ts`
Expected: PASS (all tests).

- [ ] **Step 6: Commit**

```bash
git add lib/projects-store.ts lib/upload.ts tests/projects-store.test.ts tests/upload.test.ts
git commit -m "feat: add projects store validation/io and image filename helper"
```

---

### Task 6: Dev-guarded server actions

**Files:**
- Create: `app/dashboard/actions.ts`
- Test: `tests/dashboard-actions.test.ts`

**Interfaces:**
- Consumes: `readProjects`, `writeProjects` (`@/lib/projects-store`); `safeImageFilename` (`@/lib/upload`); `fetchReadme` (`@/lib/github`); `extractProjectFromReadme`, `AutofillKind`, `AutofillResult` (`@/lib/gemini`); `ProjectsData` (`@/types/projects`).
- Produces (all `"use server"`, all throw if `NODE_ENV === "production"`):
  - `assertDev(): void` (exported for testing) — throws `Error("Dashboard is disabled in production")` when `process.env.NODE_ENV === "production"`.
  - `saveProjectsAction(data: ProjectsData): Promise<{ ok: true }>`
  - `uploadImageAction(formData: FormData): Promise<{ path: string }>` — reads `file` field, writes to `public/images/projects/`, returns `/images/projects/<name>`.
  - `autofillFromRepoAction(repoUrl: string, kind: AutofillKind): Promise<AutofillResult & { link: string }>`

- [ ] **Step 1: Write the failing test (production guard)**

`tests/dashboard-actions.test.ts`:
```ts
import { describe, it, expect, afterEach } from "vitest";
import { assertDev } from "@/app/dashboard/actions";

const original = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = original;
});

describe("assertDev", () => {
  it("throws in production", () => {
    process.env.NODE_ENV = "production";
    expect(() => assertDev()).toThrow(/production/);
  });
  it("passes in development", () => {
    process.env.NODE_ENV = "development";
    expect(() => assertDev()).not.toThrow();
  });
  it("passes in test", () => {
    process.env.NODE_ENV = "test";
    expect(() => assertDev()).not.toThrow();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- tests/dashboard-actions.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `app/dashboard/actions.ts`**

```ts
"use server";

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readProjects, writeProjects } from "@/lib/projects-store";
import { safeImageFilename } from "@/lib/upload";
import { fetchReadme } from "@/lib/github";
import {
  extractProjectFromReadme,
  type AutofillKind,
  type AutofillResult,
} from "@/lib/gemini";
import { parseRepoUrl } from "@/lib/github";
import type { ProjectsData } from "@/types/projects";

export function assertDev(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Dashboard is disabled in production.");
  }
}

export async function getProjectsAction(): Promise<ProjectsData> {
  assertDev();
  return readProjects();
}

export async function saveProjectsAction(data: ProjectsData): Promise<{ ok: true }> {
  assertDev();
  await writeProjects(data);
  return { ok: true };
}

export async function uploadImageAction(formData: FormData): Promise<{ path: string }> {
  assertDev();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided.");

  const dir = join(process.cwd(), "public", "images", "projects");
  await mkdir(dir, { recursive: true });
  const existing = await readdir(dir).catch(() => [] as string[]);
  const name = safeImageFilename(file.name, existing);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, name), bytes);
  return { path: `/images/projects/${name}` };
}

export async function autofillFromRepoAction(
  repoUrl: string,
  kind: AutofillKind
): Promise<AutofillResult & { link: string }> {
  assertDev();
  const { owner, repo } = parseRepoUrl(repoUrl);
  const readme = await fetchReadme(repoUrl);
  const result = await extractProjectFromReadme(readme, kind);
  return { ...result, link: `https://github.com/${owner}/${repo}` };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- tests/dashboard-actions.test.ts`
Expected: PASS (3 tests).

> Note: `"use server"` files may only export async functions. `assertDev` is synchronous, so if Next's compiler rejects it at build time, change it to `export async function assertDev()` and `await assertDev()` at each call site, and make the test `await`. Verify with `npm run build` in Task 9.

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/actions.ts tests/dashboard-actions.test.ts
git commit -m "feat: add dev-guarded dashboard server actions"
```

---

### Task 7: Site refactor — Portfolio reads JSON + "Other projects" grid

**Files:**
- Modify: `components/Portfolio.tsx`
- Test: `tests/portfolio-render.test.tsx`

**Interfaces:**
- Consumes: `data/projects.json` (via `import data from "@/data/projects.json"`), `ProjectsData` type.
- Produces: a `Portfolio` component whose project content comes entirely from JSON and whose "Other projects" section is a responsive grid.

- [ ] **Step 1: Replace the hardcoded arrays with the JSON import**

In `components/Portfolio.tsx`, remove the inline `const mainProjects = [...]` and `const miniProjects = [...]` arrays. At the top of the file (after the existing imports) add:
```tsx
import projectsData from "@/data/projects.json";
import type { ProjectsData } from "@/types/projects";

const { portfolio: mainProjects, otherProjects } = projectsData as ProjectsData;
```
Then move these `const` lines OUT of the component function body (they were defined inside `Portfolio()`), to module scope shown above. Inside the component, delete the old array literals.

> Note: `mainProjects` items now always use `project.images` (no `project.image`). In the single-image render branch, replace `project.image || (project.images && project.images[0]) || ""` with `project.images[0] ?? ""`.

- [ ] **Step 2: Rename the heading and replace the mini-projects markup**

Replace the entire `{/* Mini Projects */}` block (the `<div ref={miniProjectsRef} className="py-6">` ... through its closing `</div>` before the section's closing tags) with this grid implementation that maps over `otherProjects`:

```tsx
{/* Other projects */}
<div ref={miniProjectsRef} className="py-6">
    <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-medium mb-2">Other projects</h2>
        <p className="text-lg text-tertiary">Small tools built to simplify tasks</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {otherProjects.map((project, index) => (
            <a
                key={project.id ?? index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="other-card group relative flex flex-col justify-between bg-[#1c1c2b] text-white rounded-b-2xl rounded-tr-2xl rounded-tl-none p-6 min-h-[220px] transition-transform duration-300 ease-out hover:-translate-y-2 hover:rotate-[-1deg] shadow-[0_16px_32px_rgba(0,0,0,0.28)]"
            >
                {/* File tab */}
                <span className="absolute -top-6 left-0 w-20 h-6 bg-[#1c1c2b] rounded-t-xl" />
                <div className="relative z-10 overflow-hidden">
                    <h3 className="text-lg md:text-xl font-medium mb-3">{project.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-5">
                        {project.description}
                    </p>
                </div>
                <span className="relative z-10 mt-5 inline-flex items-center gap-1 text-sm text-white/90 underline underline-offset-4 group-hover:text-white">
                    View More →
                </span>
            </a>
        ))}
    </div>
</div>
```

- [ ] **Step 3: Replace the mini-projects reveal animation with a grid stagger**

In the second `useLayoutEffect` (the GSAP block), replace the `gsap.from(miniProjectsRef.current, {...})` call (the "Separate animation for Mini Projects" block) with a stagger over the cards:

```tsx
// Stagger-reveal the "Other projects" cards
const otherCards = miniProjectsRef.current
    ? gsap.utils.toArray<HTMLElement>(".other-card", miniProjectsRef.current)
    : [];
if (otherCards.length) {
    gsap.from(otherCards, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
            trigger: miniProjectsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
        },
    });
}
```

- [ ] **Step 4: Remove now-dead mini-card state and handlers**

Delete the following from the component (they were only used by the old stacked layout and mobile carousel): `hoveredMiniCard`/`setHoveredMiniCard`, `activeCardIndex`/`setActiveCardIndex`, and the `carouselRef`. Leave `isMobile`/`isTablet`/`isDesktop`/`windowWidth` (still used by the portfolio accordion + slider). Run the linter to confirm nothing else references them:

Run: `npm run lint`
Expected: no errors referencing removed identifiers. Fix any that appear.

- [ ] **Step 5: Write a render smoke test**

`tests/portfolio-render.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeAll } from "vitest";

// jsdom-free smoke: assert the data contract the component relies on.
import data from "@/data/projects.json";
import type { ProjectsData } from "@/types/projects";

describe("Portfolio data contract", () => {
  const d = data as ProjectsData;
  it("exposes 4 portfolio + N other projects with the fields the grid reads", () => {
    expect(d.portfolio).toHaveLength(4);
    for (const o of d.otherProjects) {
      expect(o.title).toBeTruthy();
      expect(o.description).toBeTruthy();
      expect(o.link).toBeTruthy();
    }
  });
});
```

> Rationale: a full DOM render of `Portfolio` would pull in GSAP/ScrollTrigger and `next/image`, which need heavy mocks. The data-contract test guards the exact fields the new grid consumes; visual correctness is verified manually in Task 9.

- [ ] **Step 6: Run tests + lint**

Run: `npm test -- tests/portfolio-render.test.tsx && npm run lint`
Expected: test PASS; lint clean.

- [ ] **Step 7: Commit**

```bash
git add components/Portfolio.tsx tests/portfolio-render.test.tsx
git commit -m "feat: portfolio reads projects.json; redesign Other projects grid"
```

---

### Task 8: Dashboard UI

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/DashboardClient.tsx`

**Interfaces:**
- Consumes: `getProjectsAction`, `saveProjectsAction`, `uploadImageAction`, `autofillFromRepoAction` (`@/app/dashboard/actions`); `ProjectsData`, `PortfolioProject`, `OtherProject` (`@/types/projects`).
- Produces: the `/dashboard` route (dev-only) rendering the editor.

- [ ] **Step 1: Create the dev-guarded server page**

`app/dashboard/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { getProjectsAction } from "./actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const data = await getProjectsAction();
  return <DashboardClient initial={data} />;
}
```

- [ ] **Step 2: Create the client editor**

`app/dashboard/DashboardClient.tsx` — a `"use client"` component holding the full editable state. It must:
  - Hold `data` in `useState<ProjectsData>(initial)`.
  - Render the 4 portfolio slots (no add/remove). Each slot edits: `title`, `subtitle`, `description`, `longDescription`, `tech` (chip input: type + Enter to add, click ✕ to remove), `link`, and an image manager (file `<input type="file" multiple>` → `uploadImageAction`, append returned paths to `images`; list current images with remove + move-up/down).
  - Render the "Other projects" list with add (`{ id: crypto.randomUUID(), title: "", description: "", link: "" }`), remove, and move-up/down. Each edits `title`, `description`, `link`.
  - On every card (portfolio + other) provide a repo URL input + "Autofill" button calling `autofillFromRepoAction(url, kind)` where `kind="portfolio"` for portfolio cards and `kind="other"` for other cards; on success, set `title`, `description`(=shortDescription), `link`, and for portfolio also `longDescription` + `tech`. Show a per-card loading + error state.
  - A sticky "Save all" button calling `saveProjectsAction(data)`; show success/error; disable while saving.

Use this exact skeleton and fill the field bindings; keep it a single focused file:

```tsx
"use client";

import { useState } from "react";
import type { ProjectsData, PortfolioProject, OtherProject } from "@/types/projects";
import {
  saveProjectsAction,
  uploadImageAction,
  autofillFromRepoAction,
} from "./actions";

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

  async function handleSave() {
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

  // Render: portfolio slots (map data.portfolio with updatePortfolio + AutofillRow
  //   kind="portfolio" + ImageManager), then other projects (map data.otherProjects
  //   with updateOther/removeOther/moveOther + AutofillRow kind="other"), then a
  //   sticky Save bar showing {status}. Implement AutofillRow and ImageManager as
  //   small inline components in this file using autofillFromRepoAction and
  //   uploadImageAction. Style with Tailwind (max-w-3xl mx-auto p-8 space-y-8,
  //   inputs: w-full border rounded px-3 py-2).
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Project Dashboard (dev only)</h1>
      {/* TODO bindings per the comment above */}
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
```

> The `// Render:` comment is the implementation contract: build the portfolio slots, other-projects list, `AutofillRow`, and `ImageManager` inline. `AutofillRow` = a text input bound to local state + a button that calls `autofillFromRepoAction(url, kind)` and applies the result via the parent's update fn. `ImageManager` = `<input type="file" multiple>` that for each file builds a `FormData` (`fd.append("file", file)`), calls `uploadImageAction(fd)`, and appends `path` to that slot's `images`, plus a list with remove + move-up/down buttons.

- [ ] **Step 3: Manually verify the route loads in dev**

Run: `npm run dev`, then open `http://localhost:3000/dashboard`.
Expected: the dashboard renders with the 4 portfolio slots prefilled from `data/projects.json` and the 8 other projects listed. (Full interaction is verified in Task 9.)

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx app/dashboard/DashboardClient.tsx
git commit -m "feat: add dev-only project dashboard UI"
```

---

### Task 9: Env, docs, and full manual verification

**Files:**
- Create: `.env.example`
- Modify: `.env.local` (add `GEMINI_API_KEY` placeholder line — gitignored, not committed)
- Modify: `README.md` (add a "Editing projects" section)

**Interfaces:**
- Consumes: everything above.
- Produces: documented env + a verified end-to-end flow.

- [ ] **Step 1: Create `.env.example`**

```bash
# Resend (contact form)
RESEND_API_KEY=

# Dev-Pulse API (Choreo)
DEV_PULSE_API_KEY=
DEV_PULSE_API_URL=

# Google Gemini (dashboard autofill — local dev only)
GEMINI_API_KEY=
```

- [ ] **Step 2: Add the key to `.env.local`**

Append `GEMINI_API_KEY=` to `.env.local` (the user pastes their key after the `=`). This file is gitignored — do NOT commit it.

- [ ] **Step 3: Document in README**

Add a section to `README.md`:
```markdown
## Editing projects

Project content lives in `data/projects.json`. To edit it with a UI, run the
app locally and open `/dashboard` (dev only — the route 404s in production):

```bash
npm run dev
# open http://localhost:3000/dashboard
```

You can edit the 4 portfolio cards and the "Other projects" list, upload
images, and autofill fields from a GitHub repo's README (requires
`GEMINI_API_KEY` in `.env.local`). Click **Save all**, then commit & push
`data/projects.json` (and any new images in `public/images/projects/`) to
publish.
```

- [ ] **Step 4: Run the full test suite + build**

Run: `npm test && npm run build`
Expected: all tests PASS; `next build` completes with no type errors. (If the build flags `assertDev` as a non-async `"use server"` export, apply the async fix noted in Task 6 Step 4 and re-run.)

- [ ] **Step 5: Manual end-to-end verification (with a real `GEMINI_API_KEY` set)**

Run `npm run dev` and verify:
1. `/dashboard` loads; portfolio slots + other projects are prefilled.
2. On an "Other projects" card, paste `https://github.com/DahamDissanayake/vision-slide`, click Autofill → title + description populate.
3. Add a new other project, fill it, move it up/down, remove one.
4. On a portfolio slot, upload an image → it appears in the image list and the file lands in `public/images/projects/`.
5. Click **Save all** → success message; `data/projects.json` reflects the changes.
6. Open `http://localhost:3000/` → the home page shows the edits and the "Other projects" grid renders cleanly. Temporarily duplicate entries in the JSON to ~20 and confirm the grid stacks in clean rows (2/3/4 cols), then revert.
7. Confirm production guard: `npm run build && npm start`, open `/dashboard` → 404.

- [ ] **Step 6: Commit**

```bash
git add .env.example README.md
git commit -m "docs: document GEMINI_API_KEY and the project dashboard"
```

---

## Self-Review

**Spec coverage:**
- Dashboard to edit portfolio + other projects → Tasks 6, 8.
- Exactly 4 portfolio, unlimited other → enforced in `validateProjectsData` (Task 5), UI (Task 8).
- LLM autofill from repo README via Gemini → Tasks 3, 4, 6, 8.
- `GEMINI_API_KEY` env + env update → Task 9.
- Rename "Mini Projects" → "Other projects" → Task 7.
- Folder-card grid scaling to 20+ with animation → Task 7 (grid + GSAP stagger) verified in Task 9 Step 5.6.
- Image upload for portfolio → Tasks 5 (`safeImageFilename`), 6 (`uploadImageAction`), 8 (ImageManager).
- Local-dev persistence to committed JSON → Tasks 2, 5, 6.
- Dev-only guard → Tasks 6, 8.

**Placeholder scan:** The only intentional "fill-in" is the `DashboardClient` render body (Task 8 Step 2), which is specified by an explicit implementation contract (field list, components, action wiring) rather than left vague — acceptable because the UI is broad but mechanical and fully constrained by the typed actions.

**Type consistency:** `ProjectsData`/`PortfolioProject`/`OtherProject` are defined once (Task 2) and consumed unchanged everywhere. Action names (`getProjectsAction`, `saveProjectsAction`, `uploadImageAction`, `autofillFromRepoAction`, `assertDev`) match between Task 6 (definition) and Task 8 (consumption). `extractProjectFromReadme`/`fetchReadme`/`parseRepoUrl`/`validateProjectsData`/`safeImageFilename` signatures match their consumers.
