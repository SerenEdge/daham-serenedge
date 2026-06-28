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
