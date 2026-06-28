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
