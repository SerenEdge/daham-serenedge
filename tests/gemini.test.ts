import { describe, it, expect } from "vitest";
import { extractProjectFromReadme } from "@/lib/gemini";

function fakeLLM(json: object) {
  return async (_prompt: string) => JSON.stringify(json);
}

describe("extractProjectFromReadme", () => {
  it("maps the model JSON into an AutofillResult for portfolio", async () => {
    const r = await extractProjectFromReadme(
      "# Vision Slide\nstuff",
      "portfolio",
      fakeLLM({
        title: "Vision Slide",
        shortDescription: "Gesture slide controller",
        longDescription: "A webcam gesture tool built with OpenCV.",
        tech: ["Python", "OpenCV"],
      })
    );
    expect(r.title).toBe("Vision Slide");
    expect(r.shortDescription).toBe("Gesture slide controller");
    expect(r.longDescription).toContain("OpenCV");
    expect(r.tech).toEqual(["Python", "OpenCV"]);
  });

  it("returns title + shortDescription for kind other", async () => {
    const r = await extractProjectFromReadme(
      "# X",
      "other",
      fakeLLM({ title: "X", shortDescription: "Y" })
    );
    expect(r).toMatchObject({ title: "X", shortDescription: "Y" });
  });

  it("throws on blank readme", async () => {
    await expect(
      extractProjectFromReadme("   ", "other", fakeLLM({}))
    ).rejects.toThrow();
  });

  it("throws a clear error when the model returns invalid JSON", async () => {
    await expect(
      extractProjectFromReadme("# X", "other", async () => "not json")
    ).rejects.toThrow(/parse/i);
  });
});
