import { test, expect, type Page, type Locator } from "@playwright/test";

// --- Config ---
const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "atoms-text-blocks-eyebrowtext";
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

const getEyebrow = async (page: Page, args: Args = {}): Promise<Locator> => {
  await page.goto(getStoryUrl(args), { waitUntil: "load" });

  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.locator("#storybook-root > *").waitFor({ state: "visible", timeout: HEADING_TIMEOUT });

  const eyebrow = frame.locator(".eyebrow-text");
  await eyebrow.waitFor({ state: "visible", timeout: HEADING_TIMEOUT });
  return eyebrow;
};

// -------------------------
// Baseline snapshot (default args)
// -------------------------
test.describe("EyebrowText — baseline", () => {
  test("default matches snapshot", async ({ page }) => {
    const eyebrow = await getEyebrow(page);
    await expect(eyebrow).toHaveScreenshot("default.png");
  });
});

// -------------------------
// Tag variants (hold fontSize at default)
// -------------------------
test.describe("EyebrowText — tag variants", () => {
  for (const tag of TAGS) {
    test(`tag-${tag}`, async ({ page }) => {
      const eyebrow = await getEyebrow(page, { tag });
      await expect(eyebrow).toHaveScreenshot(`tag-${tag}.png`);
    });
  }
});

// -------------------------
// fontSize variants (hold tag at default)
// -------------------------
test.describe("EyebrowText — fontSize variants", () => {
  for (const fontSize of FONT_SIZES) {
    test(`fontSize-${fontSize}`, async ({ page }) => {
      const eyebrow = await getEyebrow(page, { fontSize });
      await expect(eyebrow).toHaveScreenshot(`fontSize-${fontSize}.png`);
    });
  }
});
