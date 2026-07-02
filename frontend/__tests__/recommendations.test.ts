import { describe, it, expect } from "vitest";
import { generateRecommendations, calculateKycProgress, customerPresets } from "../lib/recommendations";

describe("generateRecommendations", () => {
  it("returns 3 recommendations sorted by fitScore", () => {
    const profile = { name: "Test", age: 30, occupation: "Engineer", income: 800000, goal: "savings", riskAppetite: "low" };
    const recs = generateRecommendations(profile);
    expect(recs).toHaveLength(3);
    expect(recs[0].fitScore).toBeGreaterThanOrEqual(recs[1].fitScore);
  });

  it("adjusts scores based on income and age", () => {
    const highIncome = { name: "Rich", age: 35, occupation: "Doctor", income: 2000000, goal: "wealth", riskAppetite: "high" };
    const lowIncome = { name: "Low", age: 35, occupation: "Teacher", income: 300000, goal: "wealth", riskAppetite: "high" };
    const highRecs = generateRecommendations(highIncome);
    const lowRecs = generateRecommendations(lowIncome);
    expect(highRecs[0].fitScore).toBeGreaterThanOrEqual(lowRecs[0].fitScore);
  });
});

describe("customerPresets", () => {
  it("has 4 presets", () => {
    expect(customerPresets).toHaveLength(4);
  });

  it("each preset has a label and profile", () => {
    customerPresets.forEach((p) => {
      expect(p).toHaveProperty("label");
      expect(p).toHaveProperty("profile");
      expect(p.profile).toHaveProperty("name");
    });
  });
});

describe("calculateKycProgress", () => {
  it("computes progress correctly", () => {
    const recs = [{ documents: ["PAN card", "Aadhaar or identity proof"] }];
    const result = calculateKycProgress(["pan", "aadhaar"], recs);
    expect(result.percent).toBe(100);
    expect(result.completed).toBe(2);
  });
});
