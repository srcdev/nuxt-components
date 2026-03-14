# PageHeroHighlights Component

## Overview

`PageHeroHighlights` is a page-level layout template that creates a "hero + highlights strip" grid. It has:

- A **header zone** — full edge-to-edge background, content drives the row height
- A **highlights strip** — straddles the header/content boundary (overlaps both), sits above via `z-index`
- A **content zone** — background fills behind the highlights strip, actual content sits below it

The layout uses a 4-row CSS Grid with `subgrid` — no `translate`, negative margins, or absolute positioning.

## Props

| Prop                    | Type                                                                | Default     | Description                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `tag`                   | `"div" \| "section" \| "main"`                                      | `"div"`     | Root element tag                                                                                                                |
| `highlightsEqualWidths` | `boolean`                                                           | `false`     | Equal-width grid columns for highlight items                                                                                    |
| `highlightsJustify`     | `"start" \| "center" \| "end" \| "space-between" \| "space-around"` | `"start"`   | Alignment of highlight items along the main axis                                                                                |
| `maxWidth`              | `string`                                                            | `undefined` | Cap the central content column (e.g. `"1064px"`). Gutters grow to enforce the constraint; below this width they hold at `16px`. |
| `contentAlign`          | `"start" \| "center"`                                               | `"center"`  | When `maxWidth` is set: `"center"` grows gutters equally; `"start"` pins content to the left with a fixed `16px` left gutter.   |
| `styleClassPassthrough` | `string \| string[]`                                                | `[]`        | Extra classes on the root element                                                                                               |

## Slots

| Slot         | Slot props              | Purpose                             |
| ------------ | ----------------------- | ----------------------------------- |
| `header`     | `{ headingId: string }` | Header zone — text, title, subtitle |
| `highlights` | —                       | Highlight cards in the strip        |
| `content`    | —                       | Page body content below the strip   |

## Basic usage

```vue
<PageHeroHighlights>
  <template #header>
    <p class="page-heading-1">Dashboard</p>
    <p class="page-body-normal">Overview of your account activity.</p>
  </template>

  <template #highlights>
    <div class="card">Total Revenue: £24,500</div>
    <div class="card">Active Users: 1,284</div>
    <div class="card">Open Tasks: 37</div>
  </template>

  <template #content>
    <p class="page-heading-2">Recent Activity</p>
  </template>
</PageHeroHighlights>
```

## Composition with other library components

Each slot accepts any content, but these library components are natural fits:

| Slot          | Component                         | Notes                                                                                           |
| ------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `#header`     | `HeroText`                        | Heading with accent text, icon, and configurable size — wires `headingId` for `aria-labelledby` |
| `#highlights` | `ServicesCard` (×n)               | Portrait cards with image, title, description, and CTA slot                                     |
| `#highlights` | `LayoutGridByCols` wrapping cards | When you want a responsive column grid rather than a single row of cards                        |
| `#content`    | Any content component             | Below the straddle — safe to use `LayoutRow`, `ServicesSection`, etc.                           |

Example with `HeroText` in the header slot:

```vue
<PageHeroHighlights tag="section" max-width="1064px">
  <template #header="{ headingId }">
    <HeroText :heading-id="headingId" text="Welcome back" accent-text="Simon" />
  </template>

  <template #highlights>
    <ServicesCard v-for="item in highlights" :key="item.id" v-bind="item">
      <template #actions>
        <LinkText :href="item.href">View</LinkText>
      </template>
    </ServicesCard>
  </template>

  <template #content>
    <!-- page body -->
  </template>
</PageHeroHighlights>
```

## With aria-labelledby (section tag)

When `tag="section"`, `aria-labelledby` is set automatically. Wire the heading id via the scoped slot prop:

```vue
<PageHeroHighlights tag="section">
  <template #header="{ headingId }">
    <h1 :id="headingId" class="page-heading-1">Dashboard</h1>
  </template>
  ...
</PageHeroHighlights>
```

See [component-aria-landmark.md](../component-aria-landmark.md) for the full pattern.

## Equal-width highlights

By default, highlight items size to their content (`flex-wrap`). Pass `:highlights-equal-widths="true"` to switch to a grid where all items share equal column widths:

```vue
<PageHeroHighlights :highlights-equal-widths="true">
  ...
</PageHeroHighlights>
```

## Constraining the central column width

Pass `max-width` to cap the content column. The gutters grow to enforce it — full-bleed backgrounds are unaffected and `subgrid` continues to work. Use `content-align` to pin to the left or centre:

```vue
<!-- Centred, capped at 1064px -->
<PageHeroHighlights max-width="1064px" content-align="center">...</PageHeroHighlights>

<!-- Left-pinned, capped at 1064px (right side takes remaining space) -->
<PageHeroHighlights max-width="1064px" content-align="start">...</PageHeroHighlights>
```

See [css-grid-max-width-gutters.md](../css-grid-max-width-gutters.md) for the full pattern explanation.

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. The block below lists every available CSS custom property — update the values you need and delete the rest.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<PageHeroHighlights :style-class-passthrough="['my-page-hero']">
  ...
</PageHeroHighlights>

<style>
/* ─── PageHeroHighlights local overrides ────────────────────────────
   Update values as needed. Delete tokens you are not overriding.
   ─────────────────────────────────────────────────────────────────── */
.page-hero-highlights {
  &.my-page-hero {
    /* Header zone */
    /* --header-row-background-colour: darkblue; */

    /* Highlights strip */
    /* --highlights-row-item-gap: 1rem; */
    /* --highlights-row-initial-item-offset: 1.2rem; */

    /* Highlight cards */
    /* --highlight-rows-gap: 1.2rem; */
    /* --highlight-title-height: 1fr; */ /* see: highlight-title-baseline prop */
    /* --highlight-padding-block-start: 1.2rem; */
    /* --highlight-padding: 1.2rem; */
    /* --highlight-background-color: white; */
    /* --highlight-border: 1px solid black; */
    /* --highlight-border-radius: 8px; */
    /* --highlight-color: black; */

    /* Content zone */
    /* --content-row-background-color: var(--slate-01); */ /* transparent */
    /* --content-row-start-gap: 1.2rem; */
    /* --content-row-end-gap: 1.2rem; */

    /* Content slot decorative border */
    /* --content-slot-margin-block-start: 2.4rem; */
    /* --content-slot-margin: var(--highlights-row-initial-item-offset); */
    /* --content-slot-background-color: var(--slate-00); */
    /* --content-slot-border: 1px solid var(--slate-06); */
    /* --content-slot-border-radius: 0.8rem; */
    /* --content-slot-outline: 1px solid var(--slate-02); */

    /* When using :highlight-title-baseline="true" */
    /* &.highlight-title-baseline { */
    /*   --highlight-title-height: 4rem; */ /* proportional value preferred */
    /*   --highlight-padding-block-start: 0; */
    /* } */
  }
}
</style>
```

> **Note:** The minimum gutter width (`16px`) and layout behaviour are not overridable via CSS custom properties. Use the `max-width` and `content-align` props to control column constraints.

## Grid structure (reference)

```text
col:  [gutter] [centre] [gutter]
row1: header content (height driven by slot)
row2: highlights top half  ← highlights spans rows 2–3, z-index: 1
row3: highlights bottom half
row4: page content (never underflows highlights)
```

`.header-row` spans cols 1–3, rows 1–2 (edge-to-edge bg). `.header-slot` is placed in row 1 only.
`.content-row` spans cols 1–3, rows 3–4 (bg fills behind highlights; `.content-slot` is placed in row 4 only). The decorative border behind `.content-slot` is rendered via `.content-row:before` — there is no separate DOM element for it.

## Layout pitfall: do not use `grid-template-rows: subgrid` inside `.highlights-row`

The `.highlights-row` element spans rows 2–3 of the parent grid (the "straddle"). If you add an inner grid to `.highlights-row` (e.g. to extend `equal-widths` behaviour) and include `grid-template-rows: subgrid`, auto-placed items will only occupy row 1 of the subgrid (= parent row 2). Parent row 3 collapses to 0-height, destroying the straddle effect — `.content-row` appears immediately below the highlights instead of overlapping it.

```css
/* ❌ — breaks the straddle when items are auto-placed by column flow */
&.equal-widths {
  display: grid;
  grid-template-rows: subgrid; /* row 3 collapses */
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
}

/* ✅ — single implicit row; items stretch to fill combined height of rows 2–3 */
&.equal-widths {
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
}
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- Lives in `app/components/04.templates/page-hero-highlights/`.
- Storybook title: `"Templates/PageHeroHighlights"`.
- **Minimum gutter is fixed at `16px`** — it is baked into the `gridColumns` computed and cannot be overridden by a CSS custom property. If a consumer needs a different minimum (e.g. `24px`), it requires a prop or a fork of the component.
- **`contentAlign` has no effect without `maxWidth`** — both sides always hold `16px` when `maxWidth` is not set.
