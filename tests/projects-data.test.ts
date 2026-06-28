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
