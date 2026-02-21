---
name: nuxt-vitest-testing
description: >
  Use this skill whenever the user wants to write, update, or improve Vitest unit tests OR
  Playwright visual tests for Nuxt 4 components. Triggers on: "write tests for my component",
  "add unit tests", "test this Vue component", "add snapshot tests", "improve my spec file",
  "test my composable", "add visual tests", "playwright storybook tests", "screenshot tests",
  or any request involving .test.ts / .spec.ts / .playwright.ts files in a Nuxt project.
  Also triggers when the user shares a Vue SFC and asks how to test it, or asks about testing
  strategy for Nuxt. Always use this skill before writing any Nuxt component test — it contains
  patterns and pitfalls discovered through real usage that significantly affect test quality.
---

# Nuxt 4 Component Testing with Vitest + Playwright

## Stack (no extra installs needed for standard Nuxt 4 projects)

```json
"@nuxt/test-utils": ">=3.x",
"@vue/test-utils": ">=2.x",
"vitest": ">=3.x",
"happy-dom": ">=20.x",
"@playwright/test": ">=1.x"
```

> See `references/packages.md` for full setup, `vitest.config.ts`, and `playwright.config.ts`.

---

## Two-Layer Testing Strategy

| Layer                  | File suffix      | Tool                   | What it catches                                   |
| ---------------------- | ---------------- | ---------------------- | ------------------------------------------------- |
| Unit + HTML snapshots  | `.test.ts`       | Vitest                 | Structure, classes, attributes, logic, a11y       |
| Visual pixel snapshots | `.playwright.ts` | Playwright + Storybook | Font weight, colour, spacing, CSS variable output |

HTML snapshots alone are not enough to catch CSS changes (font-weight, colour, spacing).
Playwright tests against a real Storybook browser catch what Vitest cannot — but require
Storybook to be running first.

---

## File Structure Convention

```
components/
  MyComponent.vue
  MyComponent.test.ts         ← Vitest: unit + HTML snapshots
  MyComponent.playwright.ts   ← Playwright: pixel snapshots via Storybook
```

Distinct suffixes let Vitest and Playwright configs each target their own files without
overlap. See `references/packages.md` for the config that enforces this.

---

## Vitest: Standard Test Template

```ts
import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MyComponent from "../MyComponent.vue";

// Only add a vm interface if you're testing computed internals
interface MyComponentInstance {
  someComputed: boolean;
}

const createWrapper = async (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
  return mountSuspended(MyComponent, {
    props: { ...props },
    slots,
  });
};

describe("MyComponent", () => {
  let wrapper: Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => wrapper?.unmount());

  // 1. Snapshots first — structural baseline
  describe("Snapshots", () => {
    it("default state", async () => {
      wrapper = await createWrapper();
      expect(wrapper.html()).toMatchSnapshot();
    });
    // Add one snapshot per meaningful visual state
  });

  // 2. Rendering — basic structure
  describe("Rendering", () => {
    it("renders root element with correct testid", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find('[data-testid="my-component"]').exists()).toBe(true);
    });
  });

  // 3. Props
  describe("Props", () => {
    /* ... */
  });

  // 4. Slots
  describe("Slots", () => {
    /* ... */
  });

  // 5. Accessibility
  describe("Accessibility", () => {
    /* ... */
  });

  // 6. Computed internals (only when logic is non-trivial)
  describe("Computed properties", () => {
    it("someComputed is true when condition met", async () => {
      wrapper = await createWrapper({ someProp: true });
      expect((wrapper.vm as unknown as MyComponentInstance).someComputed).toBe(true);
    });
  });
});
```

---

## Vitest: Key Rules

### DO

- Use `mountSuspended` from `@nuxt/test-utils/runtime` — provides full Nuxt context
  (plugins, composables, `useRouter`, `useState`, etc.)
- Put snapshots **first** so they run before behavioural tests
- Add one snapshot per distinct visual state (default, variant, disabled, pending, etc.)
- Use `afterEach(() => wrapper?.unmount())` to clean up
- Type `createWrapper` return as `Awaited<ReturnType<typeof createWrapper>>`
- Assert against real rendered classes/attributes, not mock return values
- Loop over discrete enum values (variants, types) rather than duplicating tests

### DON'T

- **Do not mock `#imports`** — `vi.mock("#imports", ...)` intercepts Nuxt's auto-import
  layer and silently breaks composable resolution. Let real composables run.
- Do not test mock return values — if you mock a composable, you're testing the mock
- Do not assert `wrapper.vm.elementClasses` for `styleClassPassthrough` — assert
  `wrapper.find(...).classes()` against the real DOM instead
- Do not leave tests referencing props/slots/classes that don't exist in the component
- Do not use `beforeEach` to create wrappers — prefer `createWrapper()` per test

---

## Vitest: Slot Testing Pattern

```ts
// Simple slot
wrapper = await createWrapper({}, { left: '<span data-testid="icon">←</span>' });
expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);

// Slot exclusion (e.g. iconOnly suppresses left/right)
wrapper = await createWrapper({}, { left: "<span>L</span>", iconOnly: "<span>I</span>" });
expect(wrapper.find(".btn-icon.left").exists()).toBe(false);
expect(wrapper.find(".btn-icon.icon-only").exists()).toBe(true);
```

---

## Vitest: Props Loop Pattern

```ts
it("applies correct variant class", async () => {
  for (const variant of ["primary", "secondary", "tertiary"] as const) {
    const w = await mountSuspended(MyComponent, { props: { variant } });
    expect(w.find("button").classes()).toContain(variant);
    w.unmount();
  }
});
```

---

## Playwright: Storybook Visual Test Template

Requires Storybook running at `http://127.0.0.1:6006` before running tests.

```ts
import { test, expect, type Page } from "@playwright/test";

const STORYBOOK_URL = "http://127.0.0.1:6006";
const STORY_BASE = "components-mycomponent"; // matches Storybook title slug

// Storybook args use colon-separated key:value pairs joined by semicolons
const getStoryUrl = (story: string, args: Record<string, string> = {}) => {
  const argsParam = Object.entries(args)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  const url = `${STORYBOOK_URL}/?path=/story/${STORY_BASE}--${story}`;
  return argsParam ? `${url}&args=${argsParam}` : url;
};

const getComponent = async (page: Page, story: string, args: Record<string, string> = {}) => {
  await page.goto(getStoryUrl(story, args));
  const frame = page.frameLocator("#storybook-preview-iframe");
  const el = frame.getByRole("button"); // adjust selector to component type
  await el.waitFor({ state: "visible", timeout: 10000 });
  return el;
};
```

---

## Playwright: Test Structure Pattern

Organise into four describe blocks to avoid combinatorial explosion:

```ts
const STORIES = ["default", "with-icons", "icon-only"] as const;
const VARIANTS = ["primary", "secondary", "tertiary"] as const;

// 1. One snapshot per exported story — source of truth baselines
test.describe("story baselines", () => {
  for (const story of STORIES) {
    test(story, async ({ page }) => {
      const el = await getComponent(page, story);
      await expect(el).toHaveScreenshot(`${story}.png`);
    });
  }
});

// 2. Cycle discrete prop values against the default story
test.describe("variants", () => {
  for (const variant of VARIANTS) {
    test(`variant: ${variant}`, async ({ page }) => {
      const el = await getComponent(page, "default", { variant });
      await expect(el).toHaveScreenshot(`default-variant-${variant}.png`);
    });
  }
});

// 3. States
test.describe("states", () => {
  test("readonly", async ({ page }) => {
    const el = await getComponent(page, "default", { readonly: "true" });
    await expect(el).toHaveScreenshot("state-readonly.png");
  });
  test("pending", async ({ page }) => {
    const el = await getComponent(page, "default", { isPending: "true", hasPendingEffect: "true" });
    await expect(el).toHaveScreenshot("state-pending.png");
  });
});

// 4. Hand-picked meaningful combinations only — not every permutation
test.describe("combinations", () => {
  const combinations = [
    { story: "default", args: { variant: "secondary", isPill: "true" }, name: "secondary-pill" },
    { story: "default", args: { variant: "tertiary", readonly: "true" }, name: "tertiary-readonly" },
  ];
  for (const { story, args, name } of combinations) {
    test(name, async ({ page }) => {
      const el = await getComponent(page, story, args);
      await expect(el).toHaveScreenshot(`combo-${name}.png`);
    });
  }
});
```

---

## Playwright: Key Rules

- Use `toHaveScreenshot()` not `expect(await el.screenshot()).toMatchSnapshot()` —
  the former handles diff tolerance, retry logic, and file naming automatically
- Storybook URL args use `:` not `=`, and `;` between multiple args:
  `&args=variant:secondary;isPill:true`
- Boolean args must be strings: `{ readonly: "true" }` not `{ readonly: true }`
- Snapshots are stored per browser — expect three PNGs per test across chromium/firefox/webkit
- Do not snapshot every variant × theme × state × story — pick genuinely distinct visual states
- Run `--update-snapshots` after intentional visual changes, not to silence flaky tests

---

## Accessibility Checklist (Vitest)

Always assert:

- `aria-disabled` is `"false"` by default and `"true"` when readonly/disabled
- Screen-reader-only text (`.sr-only`) is present in DOM but not visually shown
- `type` attribute is correct on buttons (`button` | `submit` | `reset`)
- `data-testid` is stable and present

---

## Common Pitfalls

| Symptom                                       | Cause                                       | Fix                                                          |
| --------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| Composable returns undefined                  | `vi.mock("#imports")` breaking auto-imports | Remove mock, let real composable run                         |
| `elementClasses` test passes but DOM is wrong | Testing mock return value not DOM           | Assert `wrapper.find(...).classes()` instead                 |
| Stale test references missing class/prop      | Test not updated with component             | Audit tests against current component template               |
| Vitest snapshot never updates                 | Forgot `--update-snapshots` flag            | Run `npx vitest --update-snapshots`                          |
| Playwright visual test flaky cross-browser    | Sub-pixel font rendering differences        | Set `maxDiffPixelRatio: 0.02` in `playwright.config.ts`      |
| Playwright args not applied in Storybook      | Wrong URL args format                       | Use `key:value` pairs joined with `;`, not `&`               |
| `wrapper.vm.someComputed` is undefined        | Not using `<script setup>`                  | All `<script setup>` top-level vars are auto-exposed to `vm` |

---

## Reference Files

- `references/packages.md` — Package list, vitest.config.ts, and playwright.config.ts
- `references/visual-testing-options.md` — When to use Playwright, Storybook, Chromatic
