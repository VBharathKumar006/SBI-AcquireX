import { describe, it, expect, beforeAll } from "vitest";
import { generateToken, verifyToken, createUser, authenticateUser } from "../services/auth.js";

// Mock MongoDB to force in-memory mode
process.env.MONGODB_URI = "";

describe("auth utilities", () => {
  it("generates and verifies JWTs", () => {
    const token = generateToken({ id: "1", name: "Test", email: "test@test.com" });
    const decoded = verifyToken(token);
    expect(decoded.sub).toBe("1");
    expect(decoded.name).toBe("Test");
  });

  it("returns null for invalid tokens", () => {
    expect(verifyToken("invalid-token")).toBeNull();
  });
});

describe("auth service", () => {
  it("creates and authenticates users", async () => {
    const user = await createUser({ name: "Test User", email: "test@test.com", password: "secret123" });
    expect(user).not.toBeNull();
    expect(user.name).toBe("Test User");

    const authed = await authenticateUser("test@test.com", "secret123");
    expect(authed).not.toBeNull();
    expect(authed.email).toBe("test@test.com");
  });

  it("rejects duplicate emails", async () => {
    const dup = await createUser({ name: "Dup", email: "test@test.com", password: "other123" });
    expect(dup).toBeNull();
  });

  it("rejects wrong passwords", async () => {
    const authed = await authenticateUser("test@test.com", "wrongpass");
    expect(authed).toBeNull();
  });
});
