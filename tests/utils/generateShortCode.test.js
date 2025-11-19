import { describe, it, expect } from "vitest";
import { generateShortCode } from "../../src/utils/generateShortCode.js";

describe("generateShortCode", () => {
  it("returns a 6-character string", () => {
    const code = generateShortCode();
    expect(typeof code).toBe("string");
    expect(code).toHaveLength(6);
  });

  it("produces URL-safe character", () => {
    const code = generateShortCode();
    expect(/^[A-Za-z0-9_-]{6}$/.test(code)).toBe(true);
  });

  it("generates unique codes most of the time", () => {
    const codes = new Set(
      Array.from({ length: 50 }, () => generateShortCode()),
    );
    expect(codes.size).toBeGreaterThan(45);
  });
});
