# Visual Testing Options for Nuxt 4

## Decision Tree

```
Do you need to check CSS variable output, pixel rendering, or animations?
│
├── No → HTML snapshots in Vitest (default, no extra tooling)
│
└── Yes
    │
    ├── Component is pure (no Nuxt composables)?
    │   └── @playwright/experimental-ct-vue
    │       • Mounts in real Chromium, no dev server needed
    │       • No Nuxt context — useRouter, useState etc. won't work
    │
    ├── Need visual regression CI (pixel diffs, PR previews)?
    │   └── Storybook + Chromatic
    │       • Best for design system / component library workflows
    │       • Chromatic catches pixel-level regressions across branches
    │       • Requires maintaining stories alongside components
    │
    └── Full page or user flow testing?
        └── Playwright against running dev server
            • npx playwright test
            • Needs `nuxi dev` or `nuxi build && nuxi preview` running
            • Best for integration/e2e, not component-level visual checks
```

---

## Option Comparison

| Approach                          | Browser        | Server needed | Nuxt context             | Best for                             |
| --------------------------------- | -------------- | ------------- | ------------------------ | ------------------------------------ |
| Vitest + HTML snapshots           | No (happy-dom) | No            | ✅ Full                  | Class/attribute/structure regression |
| `@playwright/experimental-ct-vue` | ✅ Real        | No            | ❌ None                  | Pure component pixel checks          |
| Storybook + Chromatic             | ✅ Real        | Storybook     | Partial (via decorators) | Design system visual regression CI   |
| Playwright e2e                    | ✅ Real        | ✅ Yes        | ✅ Full                  | User flows, page-level checks        |

---

## @playwright/experimental-ct-vue Setup (pure components only)

```bash
npm i -D @playwright/experimental-ct-vue
npx playwright install
```

```ts
// playwright-ct.config.ts
import { defineConfig } from "@playwright/experimental-ct-vue";

export default defineConfig({
  testDir: "./tests/ct",
  use: {
    ctPort: 3100,
  },
});
```

```ts
// tests/ct/MyComponent.ct.ts
import { test, expect } from "@playwright/experimental-ct-vue";
import MyComponent from "../../components/MyComponent.vue";

test("renders correctly", async ({ mount }) => {
  const component = await mount(MyComponent, {
    props: { buttonText: "Click me" },
  });
  await expect(component).toContainText("Click me");
});
```

**Limitation**: Nuxt auto-imports (`useRouter`, `useState`, custom composables) are not
available. You must mock or stub them in the mount entry point (`playwright/index.ts`).
This makes it practical only for presentational/pure components.

---

## Storybook + Chromatic

Already in this project's devDependencies (`@nuxtjs/storybook`, `@chromatic-com/storybook`).

Chromatic setup: <https://www.chromatic.com/docs/nuxt>

Workflow:

1. Write stories for each component visual state
2. `npm run build-storybook`
3. `npx chromatic --project-token=<token>`
4. Chromatic diffs screenshots in CI and flags regressions in PRs

Best suited when you're maintaining a component library and need non-developer stakeholders
to review visual changes.
