# ServicesCard Component

## Overview

`ServicesCard` renders a single service as a portrait card: image, subtitle (eyebrow), title, short description, and an `actions` slot for any CTA content. The component owns the layout and data display; all routing and button decisions are delegated to the consumer via the slot.

## Props

| Prop                    | Type                              | Default | Required |
| ----------------------- | --------------------------------- | ------- | -------- |
| `serviceData`           | `Service`                         | —       | **yes**  |
| `tag`                   | `"div" \| "section" \| "article"` | `"div"` | no       |
| `styleClassPassthrough` | `string \| string[]`              | `[]`    | no       |

## Slots

| Slot      | Slot props                 | Purpose                                                                |
| --------- | -------------------------- | ---------------------------------------------------------------------- |
| `actions` | `{ serviceData: Service }` | CTA area below the description — buttons, links, or any action content |

The `actions` slot receives `serviceData` as a scoped prop so the consumer can construct routes or labels from the service data without additional props.

## Basic usage

```vue
<ServicesCard :service-data="service">
  <template #actions="{ serviceData }">
    <InputButtonCore
      variant="secondary"
      :button-text="`More about ${serviceData.title}`"
      :href="`/services/${serviceData.slug}`"
    >
      <template #right>
        <Icon name="mdi:arrow-right" class="icon" />
      </template>
    </InputButtonCore>
  </template>
</ServicesCard>
```

## Multiple actions

```vue
<ServicesCard :service-data="service">
  <template #actions="{ serviceData }">
    <InputButtonCore
      variant="secondary"
      :button-text="`More about ${serviceData.title}`"
      :href="`/services/${serviceData.slug}`"
    />
    <NuxtLink :to="`/services/${serviceData.slug}/contact`">Get in touch</NuxtLink>
  </template>
</ServicesCard>
```

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<ServicesCard :style-class-passthrough="['my-card']" :service-data="service">
  ...
</ServicesCard>

<style>
/* ─── ServicesCard local overrides ─────────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.services-card {
  &.my-card {
    /* Geometry — image */
    /* .image-wrapper { border-radius: 1.2rem; } */

    /* Colours */
    /* .description { color: var(--brand-text-secondary); } */
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Grid rows are sized `auto 2ch auto 5lh auto` — the last row (`auto`) accommodates the `actions` slot at any height.
- Image has a `3/4` aspect ratio with a subtle scale-on-hover effect.
