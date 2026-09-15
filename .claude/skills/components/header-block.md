---
name: HeaderBlock
description: HeaderBlock semantic-vs-visual heading wrapper — tagLevel/classLevel decoupling, page-heading-N global utility classes, id for aria-labelledby pairing, styleClassPassthrough
type: reference
---

# HeaderBlock

## Overview

`HeaderBlock` decouples a heading's **semantic level** (which `<h1>`-`<h6>` tag is rendered, for
document structure and accessibility) from its **visual size** (which `.page-heading-1`–
`.page-heading-6` global utility class is applied, for how big it reads on the page). These are
controlled by two independent props, `tagLevel` and `classLevel` — a component can be a semantic
`<h2>` (correct in the document outline) styled at the `page-heading-1` size (the biggest visual
size), or vice versa.

Use this whenever a page's visual hierarchy doesn't match its logical structure — e.g. a hero
section's heading needs to be the largest thing on the page but the page already has an `<h1>`
elsewhere, so the hero heading should be an `<h2>` styled at `page-heading-1` size.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tagLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` (or the numeric string equivalent) | `1` | Which `<h{n}>` tag is rendered. Out-of-range values fall back to `1`. |
| `classLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` (or the numeric string equivalent) | `1` | Which `.page-heading-{n}` utility class is applied — independent of `tagLevel`. Out-of-range values fall back to `1`. |
| `id` | `string \| null` | `null` | Rendered as the `id` attribute — bind a wrapping landmark's `aria-labelledby` target here (see "Pairing with a section's aria-labelledby" below). |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

Default slot — the heading content. Can contain nested markup (e.g. a `<span>` for partial
highlighting), not just plain text.

## Basic usage

```vue
<HeaderBlock :tag-level="1" :class-level="1">Page title</HeaderBlock>
```

## Decoupled semantic/visual example

```vue
<!-- Hero heading: visually the biggest thing on the page, but semantically an h2 because
     the page's real h1 lives elsewhere (e.g. in SiteHeader's branding). -->
<HeaderBlock :tag-level="2" :class-level="1">Welcome</HeaderBlock>
```

## Pairing with a section's aria-labelledby

A `<section>`/`<article>`/`<aside>` landmark needs `aria-labelledby` pointing at the `id` of a real
heading to have an accessible name. Bind the same id to both:

```vue
<section aria-labelledby="pricing-heading">
  <HeaderBlock id="pricing-heading" :tag-level="2" :class-level="1">Pricing</HeaderBlock>
</section>
```

Several components in this library (`PageRow`, `LayoutGridByCols`/`LayoutGridByWidth`,
`ProfileSection`, `ServiceSummary`, `ServiceDetail`, `PageHeroHighlights`) already generate this id
automatically via the `useAriaLabelledById` composable and expose it as a `heading-id` slot prop —
when composing inside one of those, bind `HeaderBlock`'s `id` to that slot prop instead of writing
your own id:

```vue
<PageRow tag="section" v-slot="{ headingId }">
  <HeaderBlock :id="headingId" :tag-level="2" :class-level="1">Pricing</HeaderBlock>
</PageRow>
```

## Styling

`HeaderBlock` has no CSS of its own — `classLevel` applies one of the global
`.page-heading-1`–`.page-heading-6` utility classes defined in
`app/assets/styles/setup/05.typography/02.utility-classes/_font-classes-page-heading.css`, each
setting `font-size` from a shared fluid type-scale token (`--step-3` through `--step-8`). All six
levels also reset `margin-block`/`padding-block` to `0rem` (deliberately, so a consumer adds
spacing themselves rather than fighting the browser's own varying per-level heading margins). See
`CONSUMER-STYLING.md` in this component's folder — overriding those tokens/values affects every
`page-heading-*` element site-wide, not just one `HeaderBlock` instance; use
`styleClassPassthrough` to customise a single instance.

## Migration note (2026-09-15)

Previously lived at `app/components/typography/HeaderBlock.vue` with an inline `defineProps<{...}>()`
type literal (no `withDefaults`) instead of the standard `interface Props` + `withDefaults` pattern.
Moved to `01.atoms/text-blocks/header-block/`, alongside `EyebrowText`/`HeroText`/`LinkText`. Also
added the `id` prop in the same pass — several sections need their heading to carry a specific id
for `aria-labelledby`, and `HeaderBlock` had no explicit way to receive one (matching `PageRow`'s
existing `id?: string | null` + `:id` convention).
