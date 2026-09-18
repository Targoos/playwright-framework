import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  webServer: {
    command: "npm run mock-server",
    url: "http://localhost:3001/api/users",
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
  use: {
    baseURL: process.env.BASE_URL || "https://www.saucedemo.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: "api",
      testMatch: /tests\/api\/.*/,
    },
  ],
});
