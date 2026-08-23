# ServiceDetail Component

## Overview

`ServiceDetail` renders a single service as a full, standalone detail page: a full-bleed hero
banner (breadcrumb, eyebrow, title, price/duration pills over the service image), a two-column
body (long-form content in the main column, a sticky sidebar booking card + "You may also like"
related-services list), and a closing full-width CTA banner. The process steps reuse
[StepperList](stepper-list.md) (numbered circle indicators with connectors) rather than bespoke
markup — Ideal For and FAQs are still bespoke (2-column card grid, plain Q&A list) since neither
matches an existing molecule as directly.

It is a different shape from [ServicesSection](services-section.md): `ServicesSection` renders
image-beside-content (used both as a compact summary card in a list and, in full mode, as a
same-page detail block); `ServiceDetail` is meant to *be* the whole page for one service —
`headerTag` defaults to `"h1"` accordingly, and there is no summary/compact mode. There is no
`isSummary` prop and no `v-if` gating of content — everything the component renders is always
rendered.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `serviceData` | `Service` | — | **yes** |
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | no |
| `headerTag` | `"h1" \| "h2" \| "h3"` | `"h1"` | no |
| `subheadingTag` | `"h2" \| "h3"` | `"h2"` | no |
| `breadcrumbItems` | `BreadcrumbItem[]` | auto-built from `serviceData` | no |
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
has exactly one hero image and it's always the LCP candidate — unlike `ServicesSection`, which is
often looped and needs the `index` prop to lazy-load everything past the first two instances.

### `headerTag` vs `subheadingTag`

Unlike `ServicesSection` (one `headerTag` prop applied to every heading, title included),
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

## Slots

| Slot | Slot props | Purpose |
|------|-----------|---------|
| `book-cta` | `{ serviceData: Service }` | Booking button inside the sidebar's booking card |
| `sidebar-note` | — | Freeform note under the booking button (e.g. patch-test wording) — empty by default, deliberately not hardcoded since this library also serves non-hair-and-beauty apps |
| `related-service` | `{ service: Service, index: number }` | Replaces one related-service item's whole default (non-clickable) thumbnail/title/price markup — use to wrap it in a real link |
| `final-cta` | `{ serviceData: Service }` | Button in the closing full-width CTA banner |

All routing decisions (breadcrumb links, book-cta href, related-service links, final-cta href)
are delegated to the consumer, matching `ServicesSection`'s slot-based routing pattern.

## Usage

```vue
<ServiceDetail
  :service-data="service"
  location="Mobile — across Bath"
  :related-services="relatedServices"
>
  <template #book-cta>
    <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="primary" />
  </template>
  <template #sidebar-note>
    A patch test is required at least 48 hours before any colour treatment.
  </template>
  <template #related-service="{ service: related }">
    <NuxtLink :to="`/services/${related.slug}`">{{ related.title }} — {{ related.price }}</NuxtLink>
  </template>
  <template #final-cta>
    <InputButtonCore tag="a" href="/contact" button-text="Book now" variant="secondary" />
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
- No `isSummary` mode and no content gating — this component always renders everything it's
  given. If you need a compact summary card for a services listing page, use
  [ServicesSection](services-section.md) in summary mode or [ServicesCard](services-card.md)
  instead, and reserve `ServiceDetail` for the individual `/services/[slug]` page.
- Uses [Breadcrumb](breadcrumb.md) internally for the hero banner breadcrumb.
- The two-/three-column layout breakpoints (body columns, ideal-for grid, final CTA row) are
  `@container` queries against the component's own width, not the viewport.
- Internal element classes are BEM-namespaced under `service-detail__*` (`service-detail__hero`,
  `service-detail__process`, `service-detail__sidebar`, `service-detail__related`, etc.) — see
  `CONSUMER-STYLING.md` for the full list alongside their tokens.
- The section gets `aria-labelledby` automatically when `tag` is `"section"`, `"article"`, or
  `"aside"`, pointing at the id `ServiceDetail` binds to its own title `HeroText` internally —
  same mechanism as `ServicesSection`. `tag="main"` renders a `<main>` element but is never
  auto-labelled.
