import { test, expect } from "@playwright/test";

test.describe("SBI AcquireX Smoke Tests", () => {

  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SBI AcquireX/);
  });

  test("main dashboard sections are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=SBI AcquireX").first()).toBeVisible();
    await expect(page.locator("text=Overview")).toBeVisible();
    await expect(page.locator("text=Customer Profile")).toBeVisible();
    await expect(page.locator("text=Products & Recommendations")).toBeVisible();
  });

  test("analytics dashboard loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Analytics Dashboard")).toBeVisible();
    await expect(page.locator("text=Total Leads").or(page.locator("text=Conversion Rate"))).toBeVisible();
  });

  test("AI Financial Planner page loads", async ({ page }) => {
    await page.goto("/planner");
    await expect(page.locator("text=Financial Planner").or(page.locator("text=AI Financial Planner"))).toBeVisible();
  });

  test("WhatsApp Banking page loads", async ({ page }) => {
    await page.goto("/whatsapp");
    await expect(page.locator("text=WhatsApp")).toBeVisible();
  });

  test("Voice Banking page loads", async ({ page }) => {
    await page.goto("/voice");
    await expect(page.locator("text=Voice").or(page.locator("text=voice"))).toBeVisible();
  });

  test("YONO integration page loads", async ({ page }) => {
    await page.goto("/yono");
    await expect(page.locator("text=YONO").first()).toBeVisible();
  });

  test("SME Banking page loads", async ({ page }) => {
    await page.goto("/sme");
    await expect(page.locator("text=SME").or(page.locator("text=SBI"))).toBeVisible();
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.locator("text=AcquireX")).toBeVisible();
  });

  test("backend health endpoint responds", async ({ page }) => {
    const response = await page.request.get("http://localhost:4000/health");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("products API returns data", async ({ page }) => {
    const response = await page.request.get("http://localhost:4000/api/products");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.products).toBeDefined();
  });

});
