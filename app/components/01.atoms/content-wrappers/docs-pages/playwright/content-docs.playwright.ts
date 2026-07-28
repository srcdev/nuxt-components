import { test, expect, type Page } from "@playwright/test";

// --- Config ---
const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "atoms-content-wrappers-contentdocs";
const ELEMENT_TIMEOUT = 15_000;

// --- Helpers ---
const getStoryUrl = (story: string): string => `${STORYBOOK_URL}/?path=/story/${STORY_BASE}--${story}`;

const getElement = async (page: Page, story: string, viewport?: { width: number; height: number }) => {
  if (viewport) await page.setViewportSize(viewport);
  await page.goto(getStoryUrl(story), { waitUntil: "load" });
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.locator("#storybook-root > *").waitFor({ state: "visible", timeout: ELEMENT_TIMEOUT });
  const el = frame.locator(".content-docs");
  await el.waitFor({ state: "visible", timeout: ELEMENT_TIMEOUT });
  return el;
};

// -------------------------
// Baseline (default story, default args)
// -------------------------
test.describe("ContentDocs — baseline", () => {
  test("default matches snapshot", async ({ page }) => {
    const el = await getElement(page, "default");
    await expect(el).toHaveScreenshot("default.png");
  });
});

// -------------------------
// Breakpoint states — docsNav (toggleable) and docsPageNav (forceOpened) summary
// rows must render at the same height so their content columns start aligned.
// See ExpandingPanel's icon-wrapper--hidden fix: the icon-wrapper is always kept
// in the DOM (not v-if'd away) so a forceOpened panel's row doesn't shrink relative
// to a toggleable sibling's.
// -------------------------
test.describe("ContentDocs — breakpoint states", () => {
  test("tablet: docsNav toggleable + docsPageNav forceOpened stay row-aligned", async ({ page }) => {
    const el = await getElement(page, "default", { width: 1300, height: 700 });
    await expect(el).toHaveScreenshot("state-tablet.png");
  });

  test("desktop: both panels forceOpened", async ({ page }) => {
    const el = await getElement(page, "default", { width: 1800, height: 700 });
    await expect(el).toHaveScreenshot("state-desktop.png");
  });

  test("mobile: both panels toggleable, collapsed by default", async ({ page }) => {
    const el = await getElement(page, "default", { width: 500, height: 900 });
    await expect(el).toHaveScreenshot("state-mobile.png");
  });
});
