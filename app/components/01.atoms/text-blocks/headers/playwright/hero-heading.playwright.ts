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

  const heading = frame.locator(".hero-heading");
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
// Tag variants (hold axis and fontSize at default)
// -------------------------
test.describe("HeroHeading — tag variants", () => {
  for (const tag of TAGS) {
    test(`tag-${tag}`, async ({ page }) => {
      const heading = await getHeading(page, { tag });
      await expect(heading).toHaveScreenshot(`tag-${tag}.png`);
    });
  }
});

// -------------------------
// Axis variants (hold tag and fontSize at default)
// -------------------------
test.describe("HeroHeading — axis variants", () => {
  for (const axis of AXES) {
    test(`axis-${axis}`, async ({ page }) => {
      const heading = await getHeading(page, { axis });
      await expect(heading).toHaveScreenshot(`axis-${axis}.png`);
    });
  }
});

// -------------------------
// fontSize variants (hold tag and axis at default)
// -------------------------
test.describe("HeroHeading — fontSize variants", () => {
  for (const fontSize of FONT_SIZES) {
    test(`fontSize-${fontSize}`, async ({ page }) => {
      const heading = await getHeading(page, { fontSize });
      await expect(heading).toHaveScreenshot(`fontSize-${fontSize}.png`);
    });
  }
});

// -------------------------
// Axis + fontSize cross variants (tag held at default)
// These interact visually — vertical axis changes layout weight of sized text
// -------------------------
test.describe("HeroHeading — axis × fontSize variants", () => {
  for (const axis of AXES) {
    for (const fontSize of FONT_SIZES) {
      test(`axis-${axis}_fontSize-${fontSize}`, async ({ page }) => {
        const heading = await getHeading(page, { axis, fontSize });
        await expect(heading).toHaveScreenshot(`axis-${axis}_fontSize-${fontSize}.png`);
      });
    }
  }
});
