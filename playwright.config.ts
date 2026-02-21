import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Pick up both co-located .playwright.ts files and the legacy tests/playwright/ directory
  testMatch: ["**/*.playwright.ts", "**/tests/playwright/**/*.ts"],
  timeout: 15 * 1000,
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      // Tolerate minor sub-pixel rendering differences across platforms
      maxDiffPixelRatio: 0.02,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    // Storybook for visual/component tests
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
