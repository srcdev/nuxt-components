# Export Component Types for Consumers

## Overview

Types defined inline in a `.vue` component file are not easily importable by consuming apps. This skill moves them into `app/types/components/` and re-exports via the barrel, so consumers can import from the package root.

## Steps

### 1. Create a types file

Create `app/types/components/<component-name>.d.ts` with the exported interfaces:

```ts
// app/types/components/select-menu.d.ts
export interface SelectMenuOption {
  value: string | number;
  label: string;
  icon?: string;
  dotColor?: string;
}
```

### 2. Add to the barrel

In `app/types/components/index.ts`, add an export line:

```ts
export * from "./select-menu.d"
```

### 3. Update the component

Replace the inline `export interface` blocks in the `.vue` file with an import from the shared types file:

```ts
// Before
export interface SelectMenuOption { ... }

// After
import type { SelectMenuOption } from "~/types/components/select-menu";
```

## Consuming app usage

The chain that makes this work:

```text
app/types/components/<component>.d.ts
  → app/types/components/index.ts   (export * from "./<component>.d")
  → types.d.ts                      (export * from "./app/types/components")
  → consumer import
```

`types.d.ts` is the `"types"` entry point in `package.json`, so once a type is added to the barrel it is importable directly from the package name:

```ts
import type { SelectMenuOption } from "srcdev-nuxt-components";
```

## Notes

- The `.d.ts` extension is conventional for type-only files but is not required — plain `.ts` works too (see `hero-text.ts`).
- Keep the type file minimal: only types, no runtime code.
- If a type is already used by multiple components, consider a shared location like `app/types/components/shared.d.ts` rather than naming it after one component.
