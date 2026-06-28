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
