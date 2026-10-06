# ServiceDetail Component

## Overview

`ServiceDetail` renders a single service as a full, standalone detail page: a full-bleed hero
banner (breadcrumb, eyebrow, title, price/duration pills over the service image), a two-column
body (long-form content in the main column, a sticky sidebar booking card + "You may also like"
related-services list), and a closing full-width CTA banner. The process steps reuse
[StepperList](stepper-list.md) (numbered circle indicators with connectors) rather than bespoke
markup — Ideal For and FAQs are still bespoke (2-column card grid, plain Q&A list) since neither
matches an existing molecule as directly.

The hero is a [GridStack](grid-stack.md) of two [PageRow](page-row.md) layers — an `image` layer
(default `variant="full"`, prop `heroImageVariant`) behind a `content` layer (default
`variant="content"`, prop `heroContentVariant`) — so the photo can bleed to whatever width
`ServiceDetail` itself is placed at (true edge-to-edge if there's no content-constraining wrapper
around it) while the breadcrumb/title/pills stay aligned to the page's normal content column by
default, independent of how wide the photo bleeds. The two-column body and the closing full-width
CTA banner are each their own `PageRow` too, with their own variant props (`bodyVariant`,
`finalCtaVariant`). All four variant props default to the values described above — override them
if a particular page wants a section to sit in a different track (e.g.
`heroContentVariant="inset-content"` for a narrower hero text column).

It is a different shape from [ServiceSummary](service-summary.md): `ServiceSummary` renders a
compact image-beside-content preview for a listing page; `ServiceDetail` is meant to *be* the
whole page for one service — `headerTag` defaults to `"h1"` accordingly, and there is no
summary/compact mode. There is no `v-if` gating of content — everything the component renders is
always rendered.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `serviceData` | `Service` | — | **yes** |
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | no |
| `headerTag` | `"h1" \| "h2" \| "h3"` | `"h1"` | no |
| `subheadingTag` | `"h2" \| "h3"` | `"h2"` | no |
| `breadcrumbItems` | `BreadcrumbItem[]` | auto-built from `serviceData` | no |
| `breadcrumbAriaLabel` | `string` | Breadcrumb's default | no |
| `pricePrefix` | `string` | `"From"` | no |
| `idealForIcon` | `string` | `"mdi:diamond-stone"` | no |
| `heroImageVariant` | `"full" \| "popout" \| "content" \| "inset-content"` | `"full"` | no |
| `heroContentVariant` | `"full" \| "popout" \| "content" \| "inset-content"` | `"content"` | no |
| `bodyVariant` | `"full" \| "popout" \| "content" \| "inset-content"` | `"content"` | no |
| `finalCtaVariant` | `"full" \| "popout" \| "content" \| "inset-content"` | `"content"` | no |
| `processHeading` | `string` | `"The Process"` | no |
| `idealForHeading` | `string` | `"Ideal For"` | no |
| `maintenanceHeading` | `string` | `"Aftercare & Maintenance"` | no |
| `faqsHeading` | `string` | `"Frequently Asked Questions"` | no |
| `bookingHeading` | `string` | `"Book This Service"` | no |
| `priceLabel` | `string` | `"Price"` | no |
| `durationLabel` | `string` | `"Duration"` | no |
| `locationLabel` | `string` | `"Location"` | no |
| `location` | `string` | `undefined` | no |
| `relatedServicesHeading` | `string` | `"You May Also Like"` | no |
| `relatedServices` | `Service[]` | `[]` | no |
| `finalCtaHeading` | `string` | `"Ready to book your appointment?"` | no |
| `finalCtaBody` | `string` | `"Get in touch to book your appointment."` | no |
| `imageLoading` | `"eager" \| "lazy"` | `"eager"` | no |
| `imageFetchPriority` | `"high" \| "auto" \| "low"` | `"high"` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

`location` and `relatedServices` are **props on ServiceDetail, not fields on the shared `Service`
type** — neither is universal enough to belong on `~/types/types.services`. The location row and
the whole "You may also like" block simply don't render when they're omitted.

`imageLoading`/`imageFetchPriority` default to eager/high because a `ServiceDetail` page normally
has exactly one hero image and it's always the LCP candidate — unlike `ServiceSummary`, which is
often looped and needs the `index` prop to lazy-load everything past the first two instances.

### `headerTag` vs `subheadingTag`

Unlike `ServiceSummary` (one `headerTag` prop applied to its single title heading),
`ServiceDetail` splits these: `headerTag` controls only the hero `<h1>` title; `subheadingTag`
controls every other heading (What Is It, Process, Ideal For, Aftercare, FAQs, final CTA heading).
This keeps the page's heading hierarchy correct when `ServiceDetail` is the page's own `<h1>`.

The FAQ question itself is a hardcoded `<h3>` — if you set `subheadingTag="h3"`, FAQ questions
end up at the same level as the FAQs section heading rather than one below it.

### `breadcrumbItems`

Defaults to a plain, non-linked two-item trail built from `serviceData.category` and
`serviceData.title` when omitted. Pass real routes once your app's URL structure is known:

```vue
<ServiceDetail
  :service-data="service"
  :breadcrumb-items="[
    { label: 'Services', to: '/services' },
    { label: service.title },
  ]"
/>
```

> **Changed 2026-10-06:** the hero price prefix (`pricePrefix`), breadcrumb label and ideal-for icon are
> props (the `From` and the icon were hardcoded). Sections with empty data, and headings set to `""`, are
> left out instead of rendering an orphan heading; empty fields render nothing; with no title, a landmark
> `tag` drops `aria-labelledby`. FAQ questions are one level below `subheadingTag` (were always `h3`).
> The hero tokens are now a real minimum height, so a long title grows the hero instead of being clipped.
> Ideal-for and related cards default to `--theme-surface-subtle` (were dark slate with no text colour).
> The `final-cta` slot sits in `.service-detail__final-cta-action`, which never shrinks, so long copy can't
> push its button out of the banner. Sidebar row labels size to their words (up to half the row); values wrap.

## Line-clamp tokens

All default to `none` (show everything). `1` is single-line ellipsis; any other number caps the lines
with an ellipsis on the last. Set them in the consumer's own CSS, e.g.
`.service-page { --service-detail-hero-title-line-clamp: 3; }`.

| Token | Clamps |
|---|---|
| `--breadcrumb-item-line-clamp` | Each hero breadcrumb label (Breadcrumb's own token) |
| `--service-detail-hero-eyebrow-line-clamp` | Hero eyebrow (`subtitle`) |
| `--service-detail-hero-title-line-clamp` | Hero title |
| `--service-detail-sidebar-label-line-clamp` | "Book This Service" / "You May Also Like" labels |
| `--service-detail-sidebar-value-line-clamp` | Sidebar row values (price, duration, location) |
| `--service-detail-related-title-line-clamp` | Related service titles (default item only, not the `related-service` slot) |
| `--service-detail-final-cta-heading-line-clamp` | Final CTA heading |
| `--service-detail-final-cta-body-line-clamp` | Final CTA body |

The long-form body sections (description, process, FAQs) have no clamp on purpose: this is the page
people come to read in full.

## Slots

| Slot | Slot props | Purpose |
|------|-----------|---------|
| `book-cta` | `{ serviceData: Service }` | Booking button inside the sidebar's booking card — its row (`v-if="$slots['book-cta']"`) only renders when content is passed |
| `sidebar-note` | — | Freeform note under the booking button (e.g. patch-test wording) — empty by default, deliberately not hardcoded since this library also serves non-hair-and-beauty apps |
| `related-service` | `{ service: Service, index: number }` | Replaces one related-service item's whole default (non-clickable) thumbnail/title/price markup — use to wrap it in a real link |
| `final-cta` | `{ serviceData: Service }` | Button in the closing full-width CTA banner |

All routing decisions (breadcrumb links, book-cta href, related-service links, final-cta href)
are delegated to the consumer, matching `ServiceSummary`'s slot-based routing pattern.

## Usage

```vue
<ServiceDetail
  :service-data="service"
  location="Mobile — across Bath"
  :related-services="relatedServices"
>
  <template #book-cta>
    <InputButton tag="a" href="/contact" button-text="Book now" variant="primary" />
  </template>
  <template #sidebar-note>
    A patch test is required at least 48 hours before any colour treatment.
  </template>
  <template #related-service="{ service: related }">
    <NuxtLink :to="`/services/${related.slug}`">{{ related.title }} — {{ related.price }}</NuxtLink>
  </template>
  <template #final-cta>
    <InputButton tag="a" href="/contact" button-text="Book now" variant="secondary" />
  </template>
</ServiceDetail>
```

## Local style override scaffold

```vue
<ServiceDetail :style-class-passthrough="['my-service-page']" :service-data="service">
  ...
</ServiceDetail>

<style>
/* ─── ServiceDetail local overrides ──────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.service-detail {
  &.my-service-page {
    --service-detail-hero-border-radius: 1.2rem;
    --service-detail-process-index-colour: var(--brand-accent);
  }
}
</style>
```

See [component-local-style-override.md](../component-local-style-override.md) for the general
pattern, and `CONSUMER-STYLING.md` in the component's own folder for the full token API.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`; `BreadcrumbItem` from
  `~/types/components/breadcrumb`.
- No content gating — this component always renders everything it's given. If you need a compact
  summary card for a services listing page, use [ServiceSummary](service-summary.md) (via
  [ServiceSummaryGrid](service-summary-grid.md)) or [ServicesCard](services-card.md) instead, and
  reserve `ServiceDetail` for the individual `/services/[slug]` page.
- Uses [Breadcrumb](breadcrumb.md) internally for the hero banner breadcrumb.
- The two-/three-column layout breakpoints (body columns, ideal-for grid, final CTA row) are
  `@container` queries against the component's own width, not the viewport.
- Internal element classes are BEM-namespaced under `service-detail__*` (`service-detail__hero`,
  `service-detail__process`, `service-detail__sidebar`, `service-detail__related`, etc.) — see
  `CONSUMER-STYLING.md` for the full list alongside their tokens.
- `bodyVariant` (default `"content"`) sets the `PageRow` variant wrapping the two-column body, and
  `finalCtaVariant` (default `"content"`) sets the `PageRow` variant wrapping the closing CTA
  banner — a consumer no longer needs to wrap `ServiceDetail` in its own outer `PageRow` purely to
  constrain either section's width, though wrapping it in a wider outer `PageRow` is still the way
  to unlock a genuinely full-bleed hero image (see the GridStack/PageRow note above).
- `heroImageVariant` (default `"full"`) and `heroContentVariant` (default `"content"`) are each a
  `PageRow` variant in their own right, not a wrapper around one — a `PageRow`'s own box always
  spans the full width of its parent regardless of variant, only its children default into the
  variant's grid column, so `.service-detail__hero-overlay` (the `heroContentVariant` element) can
  carry the full-bleed scrim while its child still lands in the configured column.
- The section gets `aria-labelledby` automatically when `tag` is `"section"`, `"article"`, or
  `"aside"`, pointing at the id `ServiceDetail` binds to its own title `HeroText` internally —
  same mechanism as `ServiceSummary`. `tag="main"` renders a `<main>` element but is never
  auto-labelled.
