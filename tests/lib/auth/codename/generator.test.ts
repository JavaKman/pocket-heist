import { describe, it, expect } from "vitest";
import { generateCodename } from "@/lib/auth/codename/generator";

describe("generateCodename", () => {
  it("generates a codename", () => {
    const codename = generateCodename();
    expect(codename).toBeTruthy();
    expect(typeof codename).toBe("string");
  });

  it("generates codename in PascalCase format", () => {
    const codename = generateCodename();
    // Should start with uppercase letter
    expect(codename[0]).toMatch(/[A-Z]/);
    // Should not contain spaces or hyphens
    expect(codename).not.toMatch(/[\s-]/);
  });

  it("generates different codenames on multiple calls", () => {
    const codenames = new Set<string>();

    // Generate 20 codenames
    for (let i = 0; i < 20; i++) {
      codenames.add(generateCodename());
    }

    // With random selection, extremely unlikely to get duplicates
    // But account for small possibility with 50+ word pool
    expect(codenames.size).toBeGreaterThan(15);
  });

  it("generates codenames with reasonable length", () => {
    const codename = generateCodename();
    // 3 words, each 3-10 chars = roughly 9-30 chars total
    expect(codename.length).toBeGreaterThan(8);
    expect(codename.length).toBeLessThan(50);
  });

  it("generates codename containing three parts", () => {
    const codename = generateCodename();
    // Should have at least 3 uppercase letters (3 word starts)
    const uppercaseCount = (codename.match(/[A-Z]/g) || []).length;
    expect(uppercaseCount).toBeGreaterThanOrEqual(3);
  });
});
