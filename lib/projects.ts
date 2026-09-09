import projectsData from "@/data/projects.json";
import type { ProjectsData, PortfolioProject } from "@/types/projects";

const { portfolio, otherProjects } = projectsData as ProjectsData;

export const portfolioProjects = portfolio;
export const otherProjectsList = otherProjects;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * URL slug for a portfolio project.
 *
 * Deliberately derived from `title`, not `id`. Several ids drifted away from
 * their project after renames — `vibecheck` now holds "MILO Robot",
 * `reimage` holds "IIT-GPU-Manager" — so id-based routes would read as the
 * wrong project. An explicit `slug` in projects.json overrides this, which is
 * how you rename a project without breaking an already-indexed URL.
 */
export function projectSlug(project: PortfolioProject): string {
  return project.slug ?? slugify(project.title);
}

export function projectPath(project: PortfolioProject): string {
  return `/projects/${projectSlug(project)}`;
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolio.find((project) => projectSlug(project) === slug);
}
