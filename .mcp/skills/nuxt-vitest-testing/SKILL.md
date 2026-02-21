---
name: nuxt-vitest-testing
description: >
  Use this skill whenever the user wants to write, update, or improve Vitest unit tests for
  Nuxt 4 components. Triggers on: "write tests for my component", "add unit tests", "test this
  Vue component", "add snapshot tests", "improve my spec file", "test my composable", or any
  request involving .test.ts / .spec.ts files in a Nuxt project. Also triggers when the user
  shares a Vue SFC and asks how to test it, or asks about testing strategy for Nuxt.
  Always use this skill before writing any Nuxt component test — it contains patterns and
  pitfalls discovered through real usage that significantly affect test quality.
---

# Nuxt 4 Component Testing with Vitest

## Stack (no extra installs needed for standard Nuxt 4 projects)

```json
"@nuxt/test-utils": ">=3.x",
"@vue/test-utils": ">=2.x",
"vitest": ">=3.x",
"happy-dom": ">=20.x"
```

> See `references/packages.md` for full setup and `vitest.config.ts` requirements.

---

## Core Principle

For Nuxt components, **HTML snapshot + targeted behavioural assertions** is the right
testing strategy. Snapshots catch structural regressions; behavioural tests document intent.
Avoid pixel/screenshot testing unless CSS variable rendering is the specific concern —
that requires a running browser (Playwright + dev server or Storybook + Chromatic).

---

## File Structure Convention

```
components/
  MyComponent.vue
  MyComponent.test.ts   ← co-located preferred
```

Or in a `tests/unit/` directory — either works with `@nuxt/test-utils`.

---

## Standard Test Template

```ts
import { describe, it, expect, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MyComponent from "../MyComponent.vue";

// Only add a vm interface if you're testing computed internals
interface MyComponentInstance {
  someComputed: boolean;
}

const createWrapper = async (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {}
) => {
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

    // Add a snapshot per meaningful visual state
  });

  // 2. Rendering — basic structure
  describe("Rendering", () => {
    it("renders root element with correct testid", async () => {
      wrapper = await createWrapper();
      expect(wrapper.find('[data-testid="my-component"]').exists()).toBe(true);
    });
  });

  // 3. Props
  describe("Props", () => { /* ... */ });

  // 4. Slots
  describe("Slots", () => { /* ... */ });

  // 5. Accessibility
  describe("Accessibility", () => { /* ... */ });

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

## Key Rules

### DO

- Use `mountSuspended` from `@nuxt/test-utils/runtime` — it provides full Nuxt context
  (plugins, composables, `useRouter`, `useState`, etc.)
- Put snapshots **first** in the describe block so they run before behavioural tests
- Add one snapshot per distinct visual state (default, variant, disabled, pending, etc.)
- Use `afterEach(() => wrapper?.unmount())` to clean up
- Type `createWrapper` return as `Awaited<ReturnType<typeof createWrapper>>` — avoids
  the manual interface workaround
- Assert against real rendered classes/attributes, not mock return values
- Loop over discrete enum values (variants, types) rather than duplicating tests

### DON'T

- **Do not mock `#imports`** — `vi.mock("#imports", ...)` intercepts Nuxt's auto-import
  layer and will silently break composable resolution. Let real composables run.
- Do not test mock return values — if you mock a composable, you're testing the mock
- Do not use `wrapper.vm` to access `elementClasses` when testing `styleClassPassthrough`
  — assert against the rendered DOM classes instead
- Do not leave tests referencing props/slots/classes that don't exist in the component —
  they give false confidence and may silently pass
- Do not use `beforeEach` to create wrappers — prefer `createWrapper()` per test for
  isolation and clarity

---

## Slot Testing Pattern

```ts
// Simple slot
wrapper = await createWrapper({}, { left: '<span data-testid="icon">←</span>' });
expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);

// Slot exclusion (e.g. iconOnly suppresses left/right)
wrapper = await createWrapper(
  {},
  {
    left: '<span>L</span>',
    iconOnly: '<span>I</span>',
  }
);
expect(wrapper.find('.btn-icon.left').exists()).toBe(false);
expect(wrapper.find('.btn-icon.icon-only').exists()).toBe(true);
```

---

## Props Loop Pattern

For props with a fixed set of valid values:

```ts
it("applies correct variant class", async () => {
  for (const variant of ["primary", "secondary", "tertiary"] as const) {
    const w = await mountSuspended(MyComponent, {
      props: { variant },
    });
    expect(w.find("button").classes()).toContain(variant);
    w.unmount();
  }
});
```

---

## Accessibility Checklist

Always assert:
- `aria-disabled` is `"false"` by default and `"true"` when readonly/disabled
- Screen-reader-only text (`.sr-only`) is present in DOM but visually hidden
- `type` attribute is correct on buttons (`button` | `submit` | `reset`)
- `data-testid` is stable and present

---

## When HTML Snapshots Aren't Enough

If you need real browser rendering (CSS variable output, hover states, animations):

| Need | Tool |
|---|---|
| CSS class/attribute regression | HTML snapshots (this skill) |
| Pixel-level visual regression | Storybook + Chromatic |
| Full page / user flow | Playwright against dev server |
| Component in real browser, no server | `@playwright/experimental-ct-vue` (pure components only — no Nuxt composables) |

See `references/visual-testing-options.md` for tradeoffs.

---

## Common Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Composable returns undefined | `vi.mock("#imports")` breaking auto-imports | Remove mock, let real composable run |
| `elementClasses` test passes but DOM is wrong | Testing mock return value not DOM | Assert `wrapper.find(...).classes()` instead |
| Test references `.fancy` class that doesn't exist | Stale test from old component version | Audit tests against current component template |
| Snapshot never updates | Forgot to run `vitest --update-snapshots` | Run `npx vitest --update-snapshots` after intentional changes |
| `wrapper.vm.someComputed` is undefined | Computed not exposed via `defineExpose` | Use `<script setup>` — all top-level vars are accessible via `vm` in tests |

---

## Reference Files

- `references/packages.md` — Full package list, vitest.config.ts, and nuxt.config.ts setup
- `references/visual-testing-options.md` — When to use Playwright, Storybook, Chromatic
