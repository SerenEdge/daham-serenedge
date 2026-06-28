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
