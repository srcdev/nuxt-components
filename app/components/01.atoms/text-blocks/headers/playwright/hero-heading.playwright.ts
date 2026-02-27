import { test, expect, type Page, type Locator } from "@playwright/test";

// --- Config ---
const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "atoms-text-blocks-heroheading";
const HEADING_TIMEOUT = 20_000;

// --- Types ---
type Args = Record<string, string>;

// --- Constants ---
const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
const AXES = ["horizontal", "vertical"] as const;
const FONT_SIZES = ["large", "medium", "small"] as const;

// --- Helpers ---
const getStoryUrl = (args: Args = {}): string => {
  const url = `${STORYBOOK_URL}/?path=/story/${STORY_BASE}--default`;
  const argsParam = Object.entries(args)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return argsParam ? `${url}&args=${argsParam}` : url;
};

const getHeading = async (page: Page, args: Args = {}): Promise<Locator> => {
  await page.goto(getStoryUrl(args), { waitUntil: "load" });

  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.locator("#storybook-root > *").waitFor({ state: "visible", timeout: HEADING_TIMEOUT });

  const heading = frame.locator(".block-heading");
  await heading.waitFor({ state: "visible", timeout: HEADING_TIMEOUT });
  return heading;
};

// -------------------------
// Baseline snapshot (default args)
// -------------------------
test.describe("HeroHeading — baseline", () => {
  test("default matches snapshot", async ({ page }) => {
    const heading = await getHeading(page);
    await expect(heading).toHaveScreenshot("default.png");
  });
});

// -------------------------
// Tag, axis, and fontSize variants (all via args on the Default story)
// -------------------------
test.describe("HeroHeading — tag, axis, fontSize variants", () => {
  for (const tag of TAGS) {
    for (const axis of AXES) {
      for (const fontSize of FONT_SIZES) {
        test(`tag-${tag}_axis-${axis}_fontSize-${fontSize}`, async ({ page }) => {
          const heading = await getHeading(page, { tag, axis, fontSize });
          await expect(heading).toHaveScreenshot(`tag-${tag}_axis-${axis}_fontSize-${fontSize}.png`);
        });
      }
    }
  }
});
