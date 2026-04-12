# ServicesSectionGrid Component

## Overview

`ServicesSectionGrid` renders a vertical stack of `ServicesSection` components (in summary mode) from a `Service[]` array. Each section includes a hardcoded `summary-link` (navigates to the service detail page) and a `cta` button. Column order can be alternated on every other section via `useAlternateReverse`.

All routing and CTA decisions are delegated to the consumer via scoped slots — the grid forwards `serviceData` from each `ServicesSection` iteration so the consumer can build hrefs, labels, and choose components freely.

## Props

| Prop                    | Type                           | Default     | Required |
| ----------------------- | ------------------------------ | ----------- | -------- |
| `servicesData`          | `Service[]`                    | —           | **yes**  |
| `tag`                   | `"div" \| "section" \| "main"` | `"div"`     | no       |
| `useAlternateReverse`   | `boolean`                      | `false`     | no       |
| `summaryAlignment`      | `"start" \| "center" \| "end"` | `"center"`  | no       |
| `styleClassPassthrough` | `string \| string[]`           | `[]`        | no       |

### `useAlternateReverse`

When `true`, odd-indexed sections flip their image/content column order (`reverse` prop on each `ServicesSection`), creating a visual zigzag layout. Commonly used on services landing pages with three or more services.

### `summaryAlignment`

Passed to every `ServicesSection` as `summaryAlignment` — controls vertical alignment of the info column content within the grid cell.

## Slots

| Slot           | Slot props                 | Purpose                                                   |
| -------------- | -------------------------- | --------------------------------------------------------- |
| `summary-link` | `{ serviceData: Service }` | Navigation link below the `whatIsIt` text in each section |

The slot is forwarded from the inner `ServicesSection` and receives the current iteration's `serviceData` as a scoped prop. It is optional — omitting it leaves that area empty.

> **Note**: `ServicesSectionGrid` always renders sections in summary mode (`isSummary: true`), so only `summary-link` is available. The `cta` slot (which lives inside a full-mode `GlassPanel`) is not reachable from this component.

## Basic usage

```vue
<ServicesSectionGrid
  :services-data="servicesData ?? []"
  :use-alternate-reverse="true"
  tag="section"
>
  <template #summary-link="{ serviceData }">
    <LinkText
      :to="`/services/${serviceData.slug}`"
      :link-text="`More about ${serviceData.title}`"
      :style-class-passthrough="['mb-20']"
    />
  </template>
</ServicesSectionGrid>
```

## Alternate reverse (zigzag) layout

```vue
<ServicesSectionGrid
  :services-data="servicesData ?? []"
  :use-alternate-reverse="true"
  tag="section"
>
  <!-- slots as above -->
</ServicesSectionGrid>
```

## Consumer page boilerplate

```vue
<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Our Services</h1>
        </LayoutRow>

        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServicesSectionGrid
            :services-data="servicesData ?? []"
            :use-alternate-reverse="true"
            tag="section"
          >
            <template #summary-link="{ serviceData }">
              <LinkText
                :to="`/services/${serviceData.slug}`"
                :link-text="`More about ${serviceData.title}`"
                :style-class-passthrough="['mb-20']"
              />
            </template>
          </ServicesSectionGrid>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

useHead({
  title: "Services",
  meta: [{ name: "description", content: "Browse our services" }],
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
  .services-grid {
    gap: 6rem;
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Each `ServicesSection` receives its array `index` for eager/lazy image loading decisions (first two sections load eagerly).
- Pass `servicesData ?? []` as a safe fallback while data loads asynchronously.
- See [services-section.md](./services-section.md) for the full `ServicesSection` prop and slot API.
