import { describe, it, expect } from "vitest";
import { buildCustomerProfile, recommendProducts, calculateKycReadiness, createRecoveryPlan } from "../services/acquirexEngine.js";

describe("buildCustomerProfile", () => {
  it("returns a structured profile from input", () => {
    const profile = buildCustomerProfile({ name: "Test", age: 30, occupation: "Engineer", income: 800000, goal: "savings", riskAppetite: "medium" });
    expect(profile.name).toBe("Test");
    expect(profile.age).toBe(30);
    expect(profile.lifecycleStage).toBe("growth");
  });

  it("defaults missing fields", () => {
    const profile = buildCustomerProfile({ name: "", age: 20, occupation: "", income: 0, goal: "", riskAppetite: "" });
    expect(profile.name).toBe("Customer");
    expect(profile.riskAppetite).toBe("medium");
  });
});

describe("recommendProducts", () => {
  it("returns top 3 products sorted by fitScore", () => {
    const profile = buildCustomerProfile({ name: "Aarav", age: 24, occupation: "Engineer", income: 900000, goal: "wealth creation", riskAppetite: "medium" });
    const recs = recommendProducts(profile);
    expect(recs).toHaveLength(3);
    expect(recs[0].fitScore).toBeGreaterThanOrEqual(recs[1].fitScore);
  });

  it("matches goal keywords to products", () => {
    const profile = buildCustomerProfile({ name: "Ravi", age: 22, occupation: "Student", income: 120000, goal: "education loan", riskAppetite: "low" });
    const recs = recommendProducts(profile);
    expect(recs.some((r) => r.category === "Loan")).toBe(true);
  });
});

describe("calculateKycReadiness", () => {
  it("calculates correct percentage", () => {
    const recs = [{ documents: ["PAN", "Aadhaar", "photo"] }];
    const result = calculateKycReadiness(recs, ["PAN"]);
    expect(result.percent).toBe(33);
    expect(result.missingDocuments).toEqual(["Aadhaar", "photo"]);
  });
});

describe("createRecoveryPlan", () => {
  it("returns high risk for long idle time", () => {
    const profile = { name: "Test", goal: "savings" };
    const plan = createRecoveryPlan(profile, "document upload", 72);
    expect(plan.riskLevel).toBe("high");
    expect(plan.channel).toBe("Call");
  });

  it("returns low risk for short idle time", () => {
    const profile = { name: "Test", goal: "savings" };
    const plan = createRecoveryPlan(profile, "profile review", 6);
    expect(plan.riskLevel).toBe("low");
  });
});
