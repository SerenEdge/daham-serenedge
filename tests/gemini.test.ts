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
