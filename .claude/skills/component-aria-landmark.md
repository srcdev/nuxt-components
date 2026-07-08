# Aria Landmark Labelling

## Overview

Components that accept a `tag` prop may render as a semantic landmark element (`section`, `article`, `aside` — not `main`, see below). Landmarks benefit from an accessible name via `aria-labelledby` pointing to a heading inside them. The `useAriaLabelledById` composable handles generating and applying the attribute — but **binding the id to an actual heading is still the consumer's responsibility**; see "Built-in safety net" below for how that mistake gets caught.

## The composable

`app/composables/useAriaLabelledById.ts`

Returns `{ headingId, ariaLabelledby }`:

- `headingId` — a stable ID (via `useId()`) to place on the heading element inside the slot
- `ariaLabelledby` — computed: set to `headingId` when `tag` is a landmark, `undefined` otherwise (which removes the attribute entirely)

Labelled tags: `section`, `article`, `aside`.

**`main` is deliberately excluded.** A `<main>` landmark doesn't need an accessible name unless a
page has more than one — auto-labelling it produced broken references in practice (the layout's
top-level `<main>` wraps arbitrary page content with no single natural heading to bind).

### Built-in safety net

The composable itself checks, `onMounted`, whether `document.getElementById(headingId)` actually
resolves whenever `ariaLabelledby` is set. If it doesn't, it `console.warn`s immediately with the
tag name and id. This exists because the whole pattern is opt-in for the *consumer* — the
composable has no way to force a heading to bind, so instead it makes the mistake loud instead of
silent. **Do not treat the absence of a compile-time/type error as confirmation this is wired up
correctly** — always check the console (or run an accessibility audit) after adding `tag="section"`
(or `article`/`aside`) to any component using this pattern.

This bug class previously shipped to production undetected: eight sections across one site had
`aria-labelledby` pointing at ids that were never applied to anything, only surfaced by a WAVE
audit. Two components (`ServicesSection`, `AutoGrid`) were also found to be *structurally* broken
— they set `aria-labelledby` from `tag` alone without ever exposing `headingId` anywhere a
consumer could bind it, so it was impossible to satisfy correctly. `ServicesSection` now binds
`headingId` to its own internal title heading; `AutoGrid` has no heading concept at all, so it no
longer sets `aria-labelledby` under any circumstance (pass `aria-label` directly if needed).

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

Consumer-bound (the component exposes `headingId` via a slot prop; whoever uses the component
must bind it to their own heading):

- `PageRow` (01.atoms) — default slot
- `PageHeroHighlights` (04.templates) — `#header` slot
- `ProfileSection` (02.molecules) — `#heroText` slot

Self-bound (the component renders its own heading and binds `headingId` internally — no consumer
action needed):

- `ServicesSection` (03.organisms) — binds it to its own title `HeroText`
- `LayoutGridByCols` / `LayoutGridByWidth` (01.atoms) — render their own visually-hidden `<p>` from the `label` prop

Not using this pattern:

- `AutoGrid` (01.atoms) — has no heading concept; never sets `aria-labelledby` regardless of `tag`

## Notes

- If a component does not expose a named slot with `:heading-id`, the `headingId` is still generated — the consumer simply places their own heading inside the slot without binding the id. **This is the failure mode to watch for** — nothing prevents it at compile time, only the runtime console warning described above.
- `headingId` is stable across renders (SSR-safe via `useId()`).
- Do not replicate the old manual pattern (`const needsLabel = computed(() => props.tag === "section")`) — use this composable instead.
- When adding `useAriaLabelledById` to a *new* component, prefer the self-bound pattern (render the heading yourself, or a `LayoutGridByCols`-style hidden label from a `label` prop) over the consumer-bound pattern wherever the component already controls its own heading markup — it structurally cannot go wrong the way the consumer-bound pattern can.
