import { test, expect, type Page } from "@playwright/test";

// --- Config ---
const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "components-forms-input-button-inputbuttoncore";
const BUTTON_TIMEOUT = 15000;

// --- Helpers ---
const getStoryUrl = (story: string, args: Record<string, string> = {}) => {
  const argsParam = Object.entries(args)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  const url = `${STORYBOOK_URL}/?path=/story/${STORY_BASE}--${story}`;
  return argsParam ? `${url}&args=${argsParam}` : url;
};

const getButton = async (page: Page, story: string, args: Record<string, string> = {}) => {
  await page.goto(getStoryUrl(story, args));
  const frame = page.frameLocator("#storybook-preview-iframe");
  const button = frame.getByRole("button");
  await button.waitFor({ state: "visible", timeout: BUTTON_TIMEOUT });
  return button;
};

// --- Stories ---
const STORIES = [
  "default",
  // "with-both-emoji-icons",
  "with-both-nuxt-icon-components",
  // "emoji-icon-only",
  "nuxt-icon-only-component",
] as const;

// --- Variants to cycle through ---
const VARIANTS = ["primary", "secondary", "tertiary"] as const;
const THEMES = ["default", "success", "error", "warning"] as const;

// -------------------------
// Per-story baseline snapshots
// -------------------------
test.describe("InputButtonCore — story baselines", () => {
  for (const story of STORIES) {
    test(`${story} matches snapshot`, async ({ page }) => {
      const button = await getButton(page, story);
      await expect(button).toHaveScreenshot(`${story}.png`);
    });
  }
});

// -------------------------
// Variant snapshots (default story × each variant)
// -------------------------
test.describe("InputButtonCore — variants", () => {
  for (const variant of VARIANTS) {
    test(`default story — variant: ${variant}`, async ({ page }) => {
      const button = await getButton(page, "default", { variant });
      await expect(button).toHaveScreenshot(`default-variant-${variant}.png`);
    });
  }
});

// -------------------------
// Theme snapshots (default story × each theme)
// -------------------------
test.describe("InputButtonCore — themes", () => {
  for (const theme of THEMES) {
    test(`default story — theme: ${theme}`, async ({ page }) => {
      const button = await getButton(page, "default", { theme });
      await expect(button).toHaveScreenshot(`default-theme-${theme}.png`);
    });
  }
});

// -------------------------
// State snapshots
// -------------------------
test.describe("InputButtonCore — states", () => {
  test("readonly", async ({ page }) => {
    const button = await getButton(page, "default", { readonly: "true" });
    await expect(button).toHaveScreenshot("state-readonly.png");
  });

  test("isPending", async ({ page }) => {
    const button = await getButton(page, "default", { isPending: "true", hasPendingEffect: "true" });
    await expect(button).toHaveScreenshot("state-pending.png");
  });

  test("pill shape", async ({ page }) => {
    const button = await getButton(page, "default", { isPill: "true" });
    await expect(button).toHaveScreenshot("state-pill.png");
  });
});

// -------------------------
// Key combinations (variant × state — not exhaustive, just meaningful)
// -------------------------
test.describe("InputButtonCore — variant × state combinations", () => {
  const combinations: Array<{ story: string; args: Record<string, string>; name: string }> = [
    { story: "default", args: { variant: "secondary", isPill: "true" }, name: "secondary-pill" },
    { story: "default", args: { variant: "tertiary", readonly: "true" }, name: "tertiary-readonly" },
    { story: "default", args: { variant: "primary", isPending: "true" }, name: "primary-pending" },
    { story: "with-both-nuxt-icon-components", args: { variant: "secondary" }, name: "icons-secondary" },
    { story: "with-both-nuxt-icon-components", args: { variant: "tertiary" }, name: "icons-tertiary" },
    // { story: "emoji-icon-only", args: { variant: "secondary" }, name: "icon-only-secondary" },
  ];

  for (const { story, args, name } of combinations) {
    test(name, async ({ page }) => {
      const button = await getButton(page, story, args);
      await expect(button).toHaveScreenshot(`combo-${name}.png`);
    });
  }
});
