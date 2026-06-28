"use server";

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { readProjects, writeProjects } from "@/lib/projects-store";
import { safeImageFilename } from "@/lib/upload";
import { fetchReadme, parseRepoUrl } from "@/lib/github";
import {
  extractProjectFromReadme,
  type AutofillKind,
  type AutofillResult,
} from "@/lib/gemini";
import type { ProjectsData } from "@/types/projects";

export async function assertDev(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Dashboard is disabled in production");
  }
}

export async function getProjectsAction(): Promise<ProjectsData> {
  await assertDev();
  return readProjects();
}

export async function saveProjectsAction(data: ProjectsData): Promise<{ ok: true }> {
  await assertDev();
  await writeProjects(data);
  return { ok: true };
}

export async function uploadImageAction(formData: FormData): Promise<{ path: string }> {
  await assertDev();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided.");

  const dir = join(process.cwd(), "public", "images", "projects");
  await mkdir(dir, { recursive: true });
  const existing = await readdir(dir).catch(() => [] as string[]);

  const dot = file.name.lastIndexOf(".");
  const baseName = dot >= 0 ? file.name.slice(0, dot) : file.name;
  const name = safeImageFilename(`${baseName}.webp`, existing);

  const bytes = Buffer.from(await file.arrayBuffer());
  const webpBytes = await sharp(bytes).webp({ quality: 85 }).toBuffer();
  await writeFile(join(dir, name), webpBytes);
  return { path: `/images/projects/${name}` };
}

export async function autofillFromRepoAction(
  repoUrl: string,
  kind: AutofillKind
): Promise<AutofillResult & { link: string }> {
  await assertDev();
  const { owner, repo } = parseRepoUrl(repoUrl);
  const readme = await fetchReadme(repoUrl);
  const result = await extractProjectFromReadme(readme, kind);
  return { ...result, link: `https://github.com/${owner}/${repo}` };
}
