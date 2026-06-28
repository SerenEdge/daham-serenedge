import { describe, it, expect, afterEach } from "vitest";
import { assertDev } from "@/app/dashboard/actions";

const original = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = original;
});

describe("assertDev", () => {
  it("throws in production", async () => {
    process.env.NODE_ENV = "production";
    await expect(assertDev()).rejects.toThrow(/production/);
  });
  it("passes in development", async () => {
    process.env.NODE_ENV = "development";
    await expect(assertDev()).resolves.toBeUndefined();
  });
  it("passes in test", async () => {
    process.env.NODE_ENV = "test";
    await expect(assertDev()).resolves.toBeUndefined();
  });
});
