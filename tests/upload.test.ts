import { describe, it, expect } from "vitest";
import { safeImageFilename } from "@/lib/upload";

describe("safeImageFilename", () => {
  it("slugifies the base name and keeps the extension", () => {
    expect(safeImageFilename("My Cool Shot.PNG", [])).toBe("my-cool-shot.png");
  });
  it("avoids collisions by appending a counter", () => {
    expect(safeImageFilename("a.webp", ["a.webp"])).toBe("a-1.webp");
    expect(safeImageFilename("a.webp", ["a.webp", "a-1.webp"])).toBe("a-2.webp");
  });
  it("strips unsafe characters", () => {
    expect(safeImageFilename("../../etc/passwd.jpg", [])).toBe("etc-passwd.jpg");
  });
});
