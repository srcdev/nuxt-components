# Package Setup for Nuxt 4 Component Testing

## Required devDependencies

```json
{
  "@nuxt/test-utils": ">=3.23.0",
  "@vue/test-utils": ">=2.4.0",
  "vitest": ">=3.x",
  "happy-dom": ">=20.x"
}
```

No additional installs are needed beyond what a standard Nuxt 4 project includes.

---

## vitest.config.ts

```ts
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    // If co-locating tests with components:
    include: ["**/*.{test,spec}.ts"],
    // If using a tests/ directory:
    // include: ["tests/unit/**/*.{test,spec}.ts"],
  },
});
```

> `environment: "nuxt"` is what enables `mountSuspended` and full Nuxt context.
> Without it, auto-imports and composables won't resolve.

---

## nuxt.config.ts (no changes needed)

`@nuxt/test-utils` works with a standard Nuxt 4 config out of the box.

---

## package.json scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest --run",
    "test:ui": "vitest --ui",
    "test:update": "vitest --update-snapshots"
  }
}
```

`test:update` is important — run it after intentional component changes to refresh snapshots.

---

## Import reference

```ts
// Always import from these paths:
import { describe, it, expect, afterEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { mount } from "@vue/test-utils"; // only for non-Nuxt pure Vue components
```
