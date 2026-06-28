import { describe, it, expect } from "vitest";

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
