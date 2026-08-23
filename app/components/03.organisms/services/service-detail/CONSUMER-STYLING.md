# ServiceDetail — Consumer Styling Guide

## Public token API

### Hero banner

| Token | Default | Controls |
|---|---|---|
| `--service-detail-hero-border-radius` | `0.8rem` | Corner rounding on the hero image |
| `--service-detail-hero-min-height` | `32rem` | Minimum height of the hero banner |
| `--service-detail-hero-padding` | `2.4rem` | Padding around the breadcrumb/title/pills content |
| `--service-detail-hero-scrim` | `linear-gradient(0deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 10%) 60%, transparent 100%)` | Overlay gradient behind the hero text, for legibility over the image |
| `--service-detail-hero-text-colour` | `white` | Colour of the breadcrumb, eyebrow, and title over the hero image |
| `--service-detail-breadcrumb-margin-block-end` | `0.8rem` | Space below the breadcrumb |
| `--service-detail-hero-pills-gap` | `0.8rem` | Gap between the duration and price pills |
| `--service-detail-hero-pill-bg` | `transparent` | Background of the price/duration pills (via `DisplayPill`'s `--theme-pill-bg`) |
| `--service-detail-hero-pill-border-colour` | `currentColor` | Border colour of the price/duration pills |

### Body layout

| Token | Default | Controls |
|---|---|---|
| `--service-detail-body-gap` | `3rem` | Gap between the main column and sidebar |
| `--service-detail-body-margin-block-start` | `3rem` | Space above the two-column body |
| `--service-detail-main-section-gap` | `2.4rem` | Gap between stacked sections in the main column |

The body becomes two columns at a **900px container width** (`@container`, not viewport) — the
main column is flexible, the sidebar is `minmax(28rem, 34rem)`.

### Process / Ideal For / FAQs

The process list is rendered with `StepperList` (`indicator-variant="circle"`, connectors on) —
these tokens are `ServiceDetail`'s own names, mapped internally onto the matching
`--stepper-list-*` tokens scoped to `.service-detail__process`:

| Token | Default | Controls |
|---|---|---|
| `--service-detail-process-step-gap` | `1.6rem` | Gap between the number circle and its text (`--stepper-list-gap`) |
| `--service-detail-process-step-padding-block` | `1.6rem` | Vertical padding per process step (`--stepper-list-padding-block`) |
| `--service-detail-process-divider-colour` | `currentColor` | Connector line between process steps (`--stepper-list-connector-color`) |
| `--service-detail-process-index-colour` | `var(--colour-text-accent)` | Colour and border of the step number circles (`--stepper-list-counter-circle-text`/`-border`) |
| `--service-detail-process-index-font-size` | `1.4rem` | Font size of the step numbers (`--stepper-list-counter-font-size`) |

For anything not covered by these (e.g. the circle's own size, `--stepper-list-counter-size`),
target `--stepper-list-*` directly under `.service-detail__process` — see
[stepper-list.md](../../../../../.claude/skills/components/stepper-list.md) for the full token API.

| Token | Default | Controls |
|---|---|---|
| `--service-detail-ideal-for-gap` | `1.2rem` | Gap between ideal-for cards |
| `--service-detail-ideal-for-item-gap` | `1rem` | Gap between icon and text within a card |
| `--service-detail-ideal-for-item-padding` | `1.6rem` | Padding inside a card |
| `--service-detail-ideal-for-item-background` | `var(--slate-09)` | Card background colour |
| `--service-detail-ideal-for-item-border-colour` | `var(--slate-06)` | Card border colour |
| `--service-detail-ideal-for-item-border-radius` | `0.4rem` | Card corner rounding |
| `--service-detail-ideal-for-icon-size` | `1.6rem` | Icon size |
| `--service-detail-ideal-for-icon-colour` | `var(--colour-text-accent)` | Icon colour |
| `--service-detail-faq-padding-block` | `1.6rem` | Vertical padding per FAQ entry |
| `--service-detail-faq-divider-colour` | `currentColor` | Divider line between FAQ entries |
| `--service-detail-faq-question-font-size` | `1.6rem` | FAQ question font size |
| `--service-detail-faq-question-margin-block-end` | `0.8rem` | Space between an FAQ question and its answer |

The ideal-for grid becomes 2 columns at a **500px container width**.

### Sidebar

| Token | Default | Controls |
|---|---|---|
| `--service-detail-sidebar-gap` | `2rem` | Gap between the booking card and related-services block |
| `--service-detail-sidebar-sticky-offset` | `2rem` | `top` offset while the sidebar is stuck |
| `--service-detail-sidebar-label-font-size` | `1.2rem` | Font size of "Book This Service" / "You May Also Like" labels |
| `--service-detail-sidebar-label-margin-block-end` | `1.6rem` | Space below a sidebar label |
| `--service-detail-sidebar-label-letter-spacing` | `0.05em` | Letter spacing of a sidebar label |
| `--service-detail-booking-card-padding` | `2.4rem` | Padding inside the booking `GlassPanel` |
| `--service-detail-sidebar-row-gap` | `1rem` | Gap between a row's label and value |
| `--service-detail-sidebar-row-padding-block` | `1rem` | Vertical padding per price/duration/location row |
| `--service-detail-sidebar-row-divider-colour` | `currentColor` | Divider line above each price/duration/location row |
| `--service-detail-sidebar-row-label-font-size` | `1.2rem` | Font size of a row's label (e.g. "Price") |
| `--service-detail-sidebar-note-font-size` | `1.2rem` | Font size of the `sidebar-note` slot content |
| `--service-detail-sidebar-note-margin-block-start` | `1.2rem` | Space above the `sidebar-note` slot content |
| `--service-detail-related-items-gap` | `1rem` | Gap between related-service item cards |
| `--service-detail-related-item-background` | `var(--slate-09)` | Background colour of a related-service item's card |
| `--service-detail-related-item-padding` | `1rem` | Padding inside a related-service item's card |
| `--service-detail-related-item-border-colour` | `var(--slate-06)` | Border colour of a related-service item's card |
| `--service-detail-related-item-border-radius` | `0.4rem` | Corner rounding of a related-service item's card |
| `--service-detail-related-item-gap` | `1.2rem` | Gap between a related item's thumbnail and its text |
| `--service-detail-related-image-size` | `5.6rem` | Width/height of a related-service thumbnail |
| `--service-detail-related-image-border-radius` | `0.4rem` | Corner rounding of a related-service thumbnail |
| `--service-detail-related-price-font-size` | `1.2rem` | Font size of a related item's price |
| `--service-detail-muted-opacity` | `0.7` | Opacity shared by every secondary/muted text element (sidebar label, sidebar note, related price, final CTA body) |

The booking card is a `GlassPanel` — its own `--glass-panel-*` tokens also apply.

### Final CTA banner

| Token | Default | Controls |
|---|---|---|
| `--service-detail-final-cta-gap` | `1.6rem` | Gap between the copy and the `final-cta` slot content |
| `--service-detail-final-cta-margin-block-start` | `4rem` | Space above the banner |
| `--service-detail-final-cta-padding-block-start` | `3.2rem` | Padding above the banner content, below its divider |
| `--service-detail-final-cta-divider-colour` | `currentColor` | Divider line above the banner |

The banner becomes a single row (copy left, CTA right) at a **700px container width**.

---

## Text content — props, not CSS

Section headings, sidebar labels, and CTA copy are **props**, not hardcoded strings:

| Prop | Default |
|---|---|
| `processHeading` | `"The Process"` |
| `idealForHeading` | `"Ideal For"` |
| `maintenanceHeading` | `"Aftercare & Maintenance"` |
| `faqsHeading` | `"Frequently Asked Questions"` |
| `bookingHeading` | `"Book This Service"` |
| `priceLabel` | `"Price"` |
| `durationLabel` | `"Duration"` |
| `locationLabel` | `"Location"` |
| `relatedServicesHeading` | `"You May Also Like"` |
| `finalCtaHeading` | `"Ready to book your appointment?"` |
| `finalCtaBody` | `"Get in touch to book your appointment."` |

```vue
<ServiceDetail
  :service-data="service"
  final-cta-heading="Ready to book your colour appointment?"
  final-cta-body="Mobile service across Bath — I come to you."
/>
```

---

## Global theming — recommended approach

```css
/* assets/styles/setup/07.components/service-detail.css */
:root {
  --service-detail-hero-border-radius: 1.2rem;
  --service-detail-process-index-colour: var(--brand-accent);
  --service-detail-ideal-for-icon-colour: var(--brand-accent);
}
```

## Page-scoped overrides

```css
.our-services-page {
  .service-detail {
    --service-detail-body-gap: 4rem;
    --service-detail-sidebar-sticky-offset: 8rem; /* clear a fixed site header */
  }
}
```

---

## Notes

- Routing is entirely delegated to the consumer via slots: `book-cta` (scoped `serviceData`),
  `final-cta` (scoped `serviceData`), and `related-service` (scoped `service`, `index`) — same
  pattern as `ServicesSection`'s `cta`/`summary-link` slots. Only `sidebar-note` has no scoped
  data (it's plain content, e.g. patch-test wording).
- `related-service`'s fallback content is a non-clickable thumbnail + title + price — pass the
  slot yourself to wrap it in a real link once you have a routing convention.
- The `location` row and the entire "You May Also Like" block only render when `location` /
  `relatedServices` are actually passed — neither exists on the shared `Service` type, so nothing
  breaks for consumer apps that don't have this data.
- `breadcrumbItems` defaults to a plain, non-linked `[category, title]` trail built from
  `serviceData` — pass real `to` routes once your app's URL structure is known.
- `headerTag` (default `"h1"`) controls only the hero title; `subheadingTag` (default `"h2"`)
  controls every other heading in the component (What Is It, Process, Ideal For, Aftercare, FAQs,
  final CTA) — unlike `ServicesSection`, which uses one `headerTag` prop for all of them. This
  component is meant to be the whole page's `<h1>`, so its subheadings need their own level.
- The FAQ question is a hardcoded `<h3>` — if you set `subheadingTag="h3"`, the FAQ questions will
  sit at the same level as their own section heading rather than one below it.
- Two-/three-column breakpoints (900px body, 500px ideal-for grid, 700px final CTA) use
  `@container` queries against the component's own width, not the viewport — they are not tokens
  since resizing them would need corresponding `minmax()`/`grid-template-columns` changes too, not
  just spacing (same rationale as `ServicesSection`'s `--services-section-grid-gap-desktop`).
