# Aria Landmark Labelling

## Overview

Components that accept a `tag` prop may render as a semantic landmark element (`section`, `main`, `article`, `aside`). Landmarks benefit from an accessible name via `aria-labelledby` pointing to a heading inside them. The `useAriaLabelledById` composable handles this automatically.

## The composable

`app/composables/useAriaLabelledById.ts`

Returns `{ headingId, ariaLabelledby }`:

- `headingId` — a stable ID (via `useId()`) to place on the heading element inside the slot
- `ariaLabelledby` — computed: set to `headingId` when `tag` is a landmark, `undefined` otherwise (which removes the attribute entirely)

Labelled tags: `section`, `main`, `article`, `aside`.

## Usage in a component

```vue
<template>
  <component
    :is="tag"
    :aria-labelledby="ariaLabelledby"
  >
    <slot name="header" :heading-id="headingId"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "main";
}
const props = withDefaults(defineProps<Props>(), { tag: "div" });

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);
</script>
```

The composable is auto-imported — no explicit import needed in `.vue` files.

## Consumer usage

When using `tag="section"` (or another landmark), the heading element inside the slot must consume `headingId`:

```vue
<MyComponent tag="section">
  <template #header="{ headingId }">
    <h1 :id="headingId">Page Title</h1>
  </template>
</MyComponent>
```

When `tag="div"` (default), the `aria-labelledby` attribute is absent and `headingId` may be ignored.

## Components already using this pattern

- `PageHeroHighlights` (04.templates)
- `ProfileSection` (02.molecules)
- `ServicesSection` (03.organisms)
- `LayoutGridByCols` (01.atoms)
- `LayoutGridByWidth` (01.atoms)

## Notes

- If a component does not expose a named slot with `:heading-id`, the `headingId` is still generated — the consumer simply places their own heading inside the slot without binding the id.
- `headingId` is stable across renders (SSR-safe via `useId()`).
- Do not replicate the old manual pattern (`const needsLabel = computed(() => props.tag === "section")`) — use this composable instead.
