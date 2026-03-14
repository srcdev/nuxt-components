# Export Component Types for Consumers

## Overview

Types defined inline in a `.vue` component file are not easily importable by consuming apps. This skill moves them into `app/types/components/` and re-exports via the barrel, so consumers can import from the package root.

## Steps

### 1. Create a types file

Create `app/types/components/<component-name>.d.ts` with the exported interfaces:

```ts
// app/types/components/navigation-horizontal.d.ts
export interface NavItem {
  text: string;
  href?: string;
  isExternal?: boolean;
  iconName?: string;
  cssName?: string;
}

export interface NavItemData {
  [key: string]: NavItem[];
}
```

### 2. Add to the barrel

In `app/types/components/index.ts`, add an export line:

```ts
export * from "./navigation-horizontal.d"
```

### 3. Update the component

Replace the inline `export interface` blocks in the `.vue` file with an import from the shared types file:

```ts
// Before
export interface NavItem { ... }
export interface NavItemData { ... }

// After
import type { NavItem, NavItemData } from "~/types/components/navigation-horizontal.d";
```

## Consuming app usage

Once published, consumers import from the package barrel:

```ts
import type { NavItem, NavItemData } from "nuxt-components/app/types/components";
```

## Notes

- The `.d.ts` extension is conventional for type-only files but is not required — plain `.ts` works too (see `hero-text.ts`).
- Keep the type file minimal: only types, no runtime code.
- If a type is already used by multiple components, consider a shared location like `app/types/components/shared.d.ts` rather than naming it after one component.
