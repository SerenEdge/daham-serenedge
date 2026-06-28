import { describe, it, expect, afterEach } from "vitest";
import { assertDev } from "@/app/dashboard/actions";

const original = process.env.NODE_ENV;
afterEach(() => {
  process.env.NODE_ENV = original;
});

describe("assertDev", () => {
  it("throws in production", () => {
    process.env.NODE_ENV = "production";
    expect(() => assertDev()).toThrow(/production/);
  });
  it("passes in development", () => {
    process.env.NODE_ENV = "development";
    expect(() => assertDev()).not.toThrow();
  });
  it("passes in test", () => {
    process.env.NODE_ENV = "test";
    expect(() => assertDev()).not.toThrow();
  });
});
