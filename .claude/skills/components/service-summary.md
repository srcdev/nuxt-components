# ServiceSummary Component

## Overview

`ServiceSummary` renders a single service as a compact two-column preview: image on one side,
eyebrow/title/price-duration pills/`whatIsIt` text on the other, with a `summary-link` slot for
navigating to the full service page. All routing decisions are delegated to the consumer via the
slot.

This is a renamed, stripped-down successor to `ServicesSection` — `ServicesSection` used to have
a second "full mode" (`isSummary: false`) with process/ideal-for/maintenance/FAQ/CTA content, but
that content shape is now [ServiceDetail](service-detail.md)'s job (a dedicated full-page
component). `ServiceSummary` only ever renders the compact preview; there is no `isSummary` prop
because there is no other mode.

Usually consumed via [ServiceSummaryGrid](service-summary-grid.md) rather than directly.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `serviceData` | `Service` | — | **yes** |
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | no |
| `headerTag` | `"h1" \| "h2" \| "h3"` | `"h2"` | no |
| `index` | `number` | `0` | no |
| `alignment` | `"start" \| "center" \| "end"` | `"center"` | no |
| `reverse` | `boolean` | `false` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

### `index` and image loading

The `index` prop controls both eager/lazy loading and fetch priority. The first two summaries
(`index` 0 and 1) load eagerly; all others load lazily. Only `index 0` gets `fetchpriority="high"`
(LCP candidate). Pass the loop index when rendering a list.

### `reverse`

Flips the image to the right column and content to the left (CSS `order: 2` on the image
wrapper).

### `alignment`

Vertical alignment of the info column's content within the grid cell — useful when the image is
taller than the text content and you want the eyebrow/title/pills/link block anchored to the top,
center, or bottom of that space rather than stretching.

## Slots

| Slot | Slot props | Purpose |
|------|-----------|---------|
| `summary-link` | `{ serviceData: Service }` | Navigation link below the `whatIsIt` text |

## Duration/price pills

Duration and price render as `DisplayPill` instances (`variant="neutral"`, `size="md"`) — the
same pattern `ServiceDetail`'s hero uses — rather than the icon+text row the old `ServicesSection`
had. There are no icon-customisation props (`durationIcon`/`priceIcon` are gone along with the
icon row).

## Row height and image aspect ratio

By default `.service-summary` has no fixed height — the row sizes to its content: the image
sizes itself via `--service-summary-image-aspect-ratio` (default `1 / 1`), and the text column
sizes to its own content, independently. Set `--service-summary-height-mobile`/`-tablet`/
`-desktop` (on `.service-summary` itself, via `styleClassPassthrough` or page-scoped CSS — there
is no prop for this) to force a shared row height instead: both the image (which then crops via
`object-fit: cover`, and the aspect-ratio token stops having any visible effect) and the text
column (which then has real leftover space for `alignment` to position within) fill that height.
See `CONSUMER-STYLING.md` for the full token list and the mobile-stacked-layout caveat.

## Basic usage

```vue
<ServiceSummary :service-data="service" :index="i">
  <template #summary-link="{ serviceData }">
    <LinkText
      :to="`/services/${serviceData.slug}`"
      :link-text="`More about ${serviceData.title}`"
      :style-class-passthrough="['mb-20']"
    >
      <template #right>
        <Icon name="mdi:arrow-right" />
      </template>
    </LinkText>
  </template>
</ServiceSummary>
```

## Rendering a list

Prefer [ServiceSummaryGrid](service-summary-grid.md) for this — it already handles alternating
`reverse` and index-based image loading. Rendering the loop by hand looks like:

```vue
<ServiceSummary
  v-for="(service, i) in services"
  :key="service.slug"
  :service-data="service"
  :index="i"
  :reverse="i % 2 !== 0"
  tag="section"
>
  <template #summary-link="{ serviceData }">
    <LinkText :to="`/services/${serviceData.slug}`" :link-text="`More about ${serviceData.title}`" />
  </template>
</ServiceSummary>
```

## Local style override scaffold

When consuming this component, prefer the `--service-summary-*` CSS custom properties documented
in `CONSUMER-STYLING.md` (in the component's own folder) over raw class overrides. For anything
the tokens don't cover, scaffold a style block using `styleClassPassthrough`. Delete the block if
unused.

See [component-local-style-override.md](../component-local-style-override.md) for the general
pattern.

```vue
<ServiceSummary :style-class-passthrough="['my-summary']" :service-data="service">
  ...
</ServiceSummary>

<style>
/* ─── ServiceSummary local overrides ──────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.service-summary {
  &.my-summary {
    --service-summary-image-border-radius: 1.2rem;
    --service-summary-height-tablet: 32rem;
    --service-summary-height-desktop: 40rem;
    --service-summary-image-aspect-ratio: 1 / 1;
    --service-summary-image-padding-block-mobile: 1.2rem;
    --service-summary-image-padding-inline-mobile: 1.2rem;

    /* Deeper overrides target the BEM element classes directly, e.g.: */
    /* .service-summary__pills { } */
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Internal element classes are BEM-namespaced: `service-summary__grid`,
  `service-summary__image-wrapper`, `service-summary__image`, `service-summary__info-wrapper`,
  `service-summary__pills`.
- The section gets `aria-labelledby` automatically when `tag` is `"section"`, `"article"`, or
  `"aside"`, pointing at the id `ServiceSummary` binds to its own title `HeroText` internally — no
  consumer action needed. (`tag="main"` renders a `<main>` element but is never auto-labelled; see
  [component-aria-landmark.md](../component-aria-landmark.md).)
- For a full single-service page (process, ideal-for, aftercare, FAQs, booking CTA, related
  services), use [ServiceDetail](service-detail.md) instead — that's the component this one used
  to duplicate in its old "full mode".
- The two-column breakpoint, the row-height tokens (`--service-summary-height-*`), and the image
  padding tokens (`--service-summary-image-padding-block-*`/`-inline-*`, each `-mobile`/`-tablet`/
  `-desktop`) are all **`@container` queries** against `.service-summary`'s own inline size, not
  `@media` viewport queries — this keeps the layout correct when the component sits next to a
  persistent side nav that shrinks its available width without shrinking the viewport. See
  `CONSUMER-STYLING.md` for the token defaults and fallback
  chain.
