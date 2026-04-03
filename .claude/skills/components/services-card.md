# ServicesCard Component

## Overview

`ServicesCard` renders a single service as a portrait card: image, subtitle (eyebrow), title, short description, and an `actions` slot for any CTA content. The component owns the layout and data display; all routing and button decisions are delegated to the consumer via the slot.

## Props

| Prop                    | Type                              | Default | Required |
| ----------------------- | --------------------------------- | ------- | -------- |
| `serviceData`           | `Service`                         | —       | **yes**  |
| `tag`                   | `"div" \| "section" \| "article"` | `"div"` | no       |
| `eyebrowConfig`         | `EyebrowConfig`                   | `{}`    | no       |
| `heroConfig`            | `HeroConfig`                      | `{}`    | no       |
| `styleClassPassthrough` | `string \| string[]`              | `[]`    | no       |

### EyebrowConfig

| Key        | Type                              | Default    |
| ---------- | --------------------------------- | ---------- |
| `tag`      | `"p" \| "div" \| "span"`         | `"div"`    |
| `fontSize` | `"large" \| "medium" \| "small"` | `"large"`  |

### HeroConfig

| Key        | Type                                                           | Default     |
| ---------- | -------------------------------------------------------------- | ----------- |
| `tag`      | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"`              | `"h2"`      |
| `fontSize` | `"display" \| "title" \| "heading" \| "subheading" \| "label"` | `"heading"` |

Config objects are partial — only specify the keys you want to override. Unset keys fall back to the defaults shown above.

## Slots

| Slot      | Slot props                 | Purpose                                                                |
| --------- | -------------------------- | ---------------------------------------------------------------------- |
| `actions` | `{ serviceData: Service }` | CTA area below the description — buttons, links, or any action content |

The `actions` slot receives `serviceData` as a scoped prop so the consumer can construct routes or labels from the service data without additional props.

## CSS custom properties

Set on `.services-card` (or scoped to a page class):

| Token                          | Default                       | Controls                        |
| ------------------------------ | ----------------------------- | ------------------------------- |
| `--_eyebrow-text-margin-block` | `0.8rem 0`                    | Space above/below the eyebrow   |
| `--_hero-text-margin-block`    | `2rem 1rem`                   | Space above/below the title     |
| `--_description-text-colour`   | `var(--colour-text-secondary)` | Description paragraph colour    |

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

## With config overrides

```vue
<ServicesCard
  :service-data="service"
  :eyebrow-config="{ fontSize: 'small' }"
  :hero-config="{ tag: 'h3', fontSize: 'title' }"
>
  <template #actions="{ serviceData }">
    <InputButtonCore variant="secondary" :button-text="`Enquire`" :href="`/services/${serviceData.slug}`" />
  </template>
</ServicesCard>
```

## Consumer page boilerplate

```vue
<template>
  <ServicesCard
    :service-data="service"
    :eyebrow-config="{ fontSize: 'large' }"
    :hero-config="{ tag: 'h2', fontSize: 'heading' }"
  >
    <template #actions="{ serviceData }">
      <InputButtonCore
        variant="secondary"
        :button-text="`Enquire about ${serviceData.title}`"
        :href="`/services/${serviceData.slug}`"
        :style-class-passthrough="['mbs-24']"
      >
        <template #right>
          <Icon name="mdi:arrow-right" class="icon" />
        </template>
      </InputButtonCore>
    </template>
  </ServicesCard>
</template>

<style lang="css">
.page-my-page {
  .services-card {
    --_eyebrow-text-margin-block: 0.8rem 0;
    --_hero-text-margin-block: 2rem 1rem;
    --_description-text-colour: var(--colour-text-secondary);
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Grid rows are sized `auto auto auto 5lh auto` — the `5lh` row locks description height so actions align across cards.
- Image has a `3/4` aspect ratio with a subtle scale-on-hover effect.
- Usually consumed via `ServicesCardGrid` rather than directly.
