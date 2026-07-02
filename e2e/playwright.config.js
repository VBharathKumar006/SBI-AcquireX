// @ts-check
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.js",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure"
  },
  webServer: [
    {
      command: "cd backend && node api/server.js",
      port: 4000,
      timeout: 15000,
      reuseExistingServer: true
    },
    {
      command: "cd frontend && npm run dev",
      port: 3000,
      timeout: 30000,
      reuseExistingServer: true
    }
  ]
});
