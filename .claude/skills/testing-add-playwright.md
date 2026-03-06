# Adding a Playwright Visual Test

## Overview

Playwright tests run pixel-level screenshot comparisons against a running Storybook instance.
Each test navigates to a story URL, locates the component element, and asserts it matches
a stored PNG baseline.

## Prerequisites

Storybook must be running before Playwright tests can execute. Use `npm run storybook:serve`
(build + serve static) for stable baselines, or `npm run storybook` (dev server) for quick
iteration.

## File location

```url
app/components/<component-folder>/playwright/<component-name>.playwright.ts
```

## Standard structure

```ts
import { test, expect, type Page } from "@playwright/test";

// --- Config ---
const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "category-subcategory-componentname"; // see derivation below
const ELEMENT_TIMEOUT = 15_000;

// --- Helpers ---
const getStoryUrl = (story: string, args: Record<string, string> = {}): string => {
  const argsParam = Object.entries(args)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  const url = `${STORYBOOK_URL}/?path=/story/${STORY_BASE}--${story}`;
  return argsParam ? `${url}&args=${argsParam}` : url;
};

const getElement = async (page: Page, story: string, args: Record<string, string> = {}) => {
  await page.goto(getStoryUrl(story, args), { waitUntil: "load" });
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.locator("#storybook-root > *").waitFor({ state: "visible", timeout: ELEMENT_TIMEOUT });
  const el = frame.locator(".component-name");
  await el.waitFor({ state: "visible", timeout: ELEMENT_TIMEOUT });
  return el;
};

// -------------------------
// Baseline (default story, default args)
// -------------------------
test.describe("ComponentName — baseline", () => {
  test("default matches snapshot", async ({ page }) => {
    const el = await getElement(page, "default");
    await expect(el).toHaveScreenshot("default.png");
  });
});

// -------------------------
// Prop variants (one describe per prop, iterate values)
// -------------------------
const VARIANTS = ["primary", "secondary", "tertiary"] as const;

test.describe("ComponentName — variants", () => {
  for (const variant of VARIANTS) {
    test(`variant-${variant}`, async ({ page }) => {
      const el = await getElement(page, "default", { variant });
      await expect(el).toHaveScreenshot(`variant-${variant}.png`);
    });
  }
});

// -------------------------
// State snapshots (named stories or arg overrides)
// -------------------------
test.describe("ComponentName — states", () => {
  test("with-error", async ({ page }) => {
    const el = await getElement(page, "default", { fieldHasError: "true" });
    await expect(el).toHaveScreenshot("state-error.png");
  });
});

// -------------------------
// Cross-variant combinations (meaningful pairs only)
// -------------------------
test.describe("ComponentName — combinations", () => {
  const combinations: Array<{ story: string; args: Record<string, string>; name: string }> = [
    { story: "default", args: { variant: "secondary", theme: "error" }, name: "secondary-error" },
  ];

  for (const { story, args, name } of combinations) {
    test(name, async ({ page }) => {
      const el = await getElement(page, story, args);
      await expect(el).toHaveScreenshot(`combo-${name}.png`);
    });
  }
});
```

## Deriving the STORY_BASE slug

Take the story `title` from the `.stories.ts` file, lowercase everything, remove spaces,
and replace `/` with `-`:

| Story `title`                                     | `STORY_BASE`                                    |
| ------------------------------------------------- | ----------------------------------------------- |
| `"Atoms/Text Blocks/HeroText"`                    | `atoms-text-blocks-herotext`                    |
| `"Components/Forms/Input Button/InputButtonCore"` | `components-forms-input-button-inputbuttoncore` |

The full story URL pattern is:

```url
http://127.0.0.1:6006/?path=/story/<STORY_BASE>--<story-export-name>
```

Story export names are lowercased and hyphenated: `Default` → `default`,
`WithError` → `with-error`.

## Locating the element

Prefer a semantic locator (role) when available, otherwise use the component's root class:

```ts
// By role (preferred for interactive elements)
const el = frame.getByRole("button");

// By class (preferred for display/layout components)
const el = frame.locator(".component-name");

// By test id (if set on the component)
const el = frame.getByTestId("component-name");
```

Always `await el.waitFor({ state: "visible", timeout })` before asserting.

## Screenshot naming conventions

| Scenario                  | File name pattern                          |
| ------------------------- | ------------------------------------------ |
| Default story, no args    | `default.png`                              |
| Single prop variant       | `variant-secondary.png`, `theme-error.png` |
| State override            | `state-readonly.png`, `state-pending.png`  |
| Named story baseline      | `<story-name>.png`                         |
| Cross-variant combination | `combo-secondary-error.png`                |

## Running tests

```bash
# Requires Storybook running at http://127.0.0.1:6006
npm run playwright

# Update baselines after an intentional visual change
npm run playwright:update

# View the HTML test report
npx playwright show-report
```

## Notes

- Baselines are stored per browser (Chromium, Firefox, WebKit) — expect three PNG files per
  `toHaveScreenshot()` call.
- Use `waitUntil: "load"` on `page.goto` for consistency — the iframe needs to fully render.
- Keep combinations focused on pairs that meaningfully interact visually. Don't exhaustively
  cross every prop — that creates a large, brittle baseline set.
- Comment out stories in the `STORIES` array rather than deleting them if they're temporarily
  broken, so intent is preserved.
