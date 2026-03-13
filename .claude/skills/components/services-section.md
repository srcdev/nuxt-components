# ServicesSection Component

## Overview

`ServicesSection` renders a single service as a full two-column section: image on one side, detailed content on the other. It has two modes controlled by the `isSummary` prop:

- **Summary mode** (`isSummary: true`) — compact view: eyebrow, title, price/duration, `whatIsIt` text, and a `summary-link` slot for a navigational link.
- **Full mode** (`isSummary: false`, default) — complete view: all summary content plus long description, hero heading, process stepper, ideal-for stepper, aftercare, FAQs, and a `GlassPanel` with a `cta` slot for a booking/contact button.

All routing and CTA decisions are delegated to the consumer via slots.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `serviceData` | `Service` | — | **yes** |
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | no |
| `index` | `number` | `0` | no |
| `isSummary` | `boolean` | `false` | no |
| `summaryAlignment` | `"start" \| "center" \| "end"` | `"center"` | no |
| `reverse` | `boolean` | `false` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

### `index` and image loading

The `index` prop controls eager vs lazy image loading. The first two sections (`index` 0 and 1) load eagerly; all others load lazily. Pass the loop index when rendering a list of sections.

### `reverse`

Flips the image to the right column and content to the left (CSS `order: 2` on the image wrapper).

## Slots

| Slot | Slot props | Rendered when | Purpose |
|------|-----------|---------------|---------|
| `summary-link` | `{ serviceData: Service }` | `isSummary` is `true` | Navigation link below the `whatIsIt` text in summary mode |
| `cta` | `{ serviceData: Service }` | `isSummary` is `false` | CTA button/link inside the closing `GlassPanel` in full mode |

Both slots receive `serviceData` as a scoped prop.

## Summary mode usage

```vue
<ServicesSection :service-data="service" :is-summary="true" :index="i">
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
</ServicesSection>
```

## Full mode usage

```vue
<ServicesSection :service-data="service">
  <template #cta>
    <InputButtonCore
      variant="secondary"
      button-text="Get in touch"
      href="/contact"
      :style-class-passthrough="['mbs-24']"
    >
      <template #right>
        <Icon name="mdi:arrow-right" class="icon" />
      </template>
    </InputButtonCore>
  </template>
</ServicesSection>
```

## Multiple CTAs in full mode

```vue
<ServicesSection :service-data="service">
  <template #cta="{ serviceData }">
    <InputButtonCore variant="primary" button-text="Book now" href="/book" />
    <InputButtonCore variant="secondary" button-text="Get in touch" href="/contact" />
  </template>
</ServicesSection>
```

## Rendering a list (summary mode)

```vue
<ServicesSection
  v-for="(service, i) in services"
  :key="service.slug"
  :service-data="service"
  :index="i"
  :is-summary="true"
  :reverse="i % 2 !== 0"
  tag="section"
>
  <template #summary-link="{ serviceData }">
    <LinkText :to="`/services/${serviceData.slug}`" :link-text="`More about ${serviceData.title}`" />
  </template>
</ServicesSection>
```

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<ServicesSection :style-class-passthrough="['my-section']" :service-data="service">
  ...
</ServicesSection>

<style>
/* ─── ServicesSection local overrides ──────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.services-section {
  &.my-section {
    /* Geometry — image wrapper */
    /* .image-wrapper { border-radius: 1.2rem; } */
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- `summary-link` slot is guarded by `v-if="isSummary"` — it will not render in full mode even if provided.
- `cta` slot lives inside a `v-if="!isSummary"` `GlassPanel` — it will not render in summary mode.
- The section gets `aria-labelledby` automatically when `tag` is `"section"` or `"article"`, pointing to the internal heading id.
- `summaryAlignment` only has effect when `isSummary` is `true` — it aligns the info-wrapper content vertically within the grid cell.
