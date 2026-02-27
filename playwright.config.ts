import { defineConfig, devices } from "@playwright/test";

// playwright.config.ts
export default defineConfig({
  testMatch: ["**/*.playwright.ts", "**/tests/playwright/**/*.ts"],
  timeout: 30_000, // increase overall test timeout
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // add 1 local retry to absorb flakes
  workers: process.env.CI ? 1 : 3, // cap local workers — undefined is too aggressive for one server
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:6006",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
