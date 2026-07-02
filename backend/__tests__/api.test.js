import { describe, it, expect } from "vitest";
import { getProductCatalog, getIntegrationStatus } from "../services/acquirexEngine.js";

describe("API backend services", () => {
  it("returns 7 products in catalog", () => {
    const catalog = getProductCatalog();
    expect(catalog).toHaveLength(7);
    expect(catalog[0]).toHaveProperty("id");
    expect(catalog[0]).toHaveProperty("name");
  });

  it("integration status includes expected services", () => {
    const statuses = getIntegrationStatus();
    const names = statuses.map((s) => s.name);
    expect(names).toContain("JWT authentication");
    expect(names).toContain("Gemini API / Vision");
    expect(names).toContain("MongoDB");
  });
});
