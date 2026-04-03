# ServicesCardGrid Component

## Overview

`ServicesCardGrid` renders a responsive auto-fit CSS grid of `ServicesCard` components from a `Service[]` array. It owns the grid layout; card-level presentation (eyebrow/hero typography) and slot content are configured via pass-through props and a scoped `#actions` slot.

## Props

| Prop                    | Type                              | Default  | Required |
| ----------------------- | --------------------------------- | -------- | -------- |
| `servicesData`          | `Service[]`                       | —        | **yes**  |
| `tag`                   | `"div" \| "section" \| "main"`    | `"div"`  | no       |
| `eyebrowConfig`         | `EyebrowConfig`                   | `{}`     | no       |
| `heroConfig`            | `HeroConfig`                      | `{}`     | no       |
| `styleClassPassthrough` | `string \| string[]`              | `[]`     | no       |

Both config props are passed through to every `ServicesCard` in the grid unchanged. See [services-card.md](./services-card.md) for the full `EyebrowConfig` / `HeroConfig` key reference.

## Slots

| Slot      | Slot props                 | Purpose                                          |
| --------- | -------------------------- | ------------------------------------------------ |
| `actions` | `{ serviceData: Service }` | CTA rendered inside each card below description  |

## CSS custom properties

Set on `.services-card-grid` (or scoped to a page class):

| Token                  | Default   | Controls                              |
| ---------------------- | --------- | ------------------------------------- |
| `--_gap`               | `4rem`    | Gap between grid cells                |
| `--_column-min-width`  | `250px`   | Minimum column width before wrapping  |

## Consumer page boilerplate

```vue
<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Services</h1>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesCardGrid
            :services-data="servicesData ?? []"
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
          </ServicesCardGrid>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

useHead({
  title: "Services",
  meta: [{ name: "description", content: "Our services" }],
  bodyAttrs: { class: "page-services" },
});

const store = useServicesStore();
const { servicesData } = storeToRefs(store);

if (servicesData.value.length === 0) {
  await store.fetchServicesData();
}
</script>

<style lang="css">
.page-services {
  /* Page-level CSS token overrides — delete any you don't need */
  .services-card-grid {
    --_gap: 4rem;
    --_column-min-width: 250px;

    .services-card {
      --_eyebrow-text-margin-block: 0.8rem 0;
      --_hero-text-margin-block: 2rem 1rem;
      --_description-text-colour: var(--colour-text-secondary);
    }
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Uses `repeat(auto-fit, minmax(var(--_column-min-width), 1fr))` — columns grow to fill available space and wrap when below the minimum width.
- The `#actions` slot template is passed down into each `ServicesCard`; `serviceData` is the scoped prop for the current iteration item.
- Data fetching is the page's responsibility — pass an empty array as fallback while loading (`servicesData ?? []`).
