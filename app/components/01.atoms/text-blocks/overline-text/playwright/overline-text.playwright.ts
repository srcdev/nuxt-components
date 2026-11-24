import { test, expect, type Page, type Locator } from "@playwright/test";

// --- Config ---
const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "atoms-text-blocks-overline-text";
const HEADING_TIMEOUT = 20_000;

// --- Types ---
type Args = Record<string, string>;

// --- Constants ---
const TAGS = ["p", "div", "span"] as const;
const FONT_SIZES = ["large", "medium", "small"] as const;

// --- Helpers ---
const getStoryUrl = (args: Args = {}): string => {
  const url = `${STORYBOOK_URL}/?path=/story/${STORY_BASE}--default`;
  const argsParam = Object.entries(args)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return argsParam ? `${url}&args=${argsParam}` : url;
};

const getOverline = async (page: Page, args: Args = {}): Promise<Locator> => {
  await page.goto(getStoryUrl(args), { waitUntil: "load" });

  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.locator("#storybook-root > *").waitFor({ state: "visible", timeout: HEADING_TIMEOUT });

  const overline = frame.locator(".overline-text");
  await overline.waitFor({ state: "visible", timeout: HEADING_TIMEOUT });
  return overline;
};

// -------------------------
// Baseline snapshot (default args)
// -------------------------
test.describe("OverlineText — baseline", () => {
  test("default matches snapshot", async ({ page }) => {
    const overline = await getOverline(page);
    await expect(overline).toHaveScreenshot("default.png");
  });
});

// -------------------------
// Tag variants (hold fontSize at default)
// -------------------------
test.describe("OverlineText — tag variants", () => {
  for (const tag of TAGS) {
    test(`tag-${tag}`, async ({ page }) => {
      const overline = await getOverline(page, { tag });
      await expect(overline).toHaveScreenshot(`tag-${tag}.png`);
    });
  }
});

// -------------------------
// fontSize variants (hold tag at default)
// -------------------------
test.describe("OverlineText — fontSize variants", () => {
  for (const fontSize of FONT_SIZES) {
    test(`fontSize-${fontSize}`, async ({ page }) => {
      const overline = await getOverline(page, { fontSize });
      await expect(overline).toHaveScreenshot(`fontSize-${fontSize}.png`);
    });
  }
});
