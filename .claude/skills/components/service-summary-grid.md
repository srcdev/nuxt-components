# ServiceSummaryGrid Component

## Overview

`ServiceSummaryGrid` renders a vertical stack of [ServiceSummary](service-summary.md) components
from a `Service[]` array. Column order can be alternated on every other summary via
`useAlternateReverse`.

All routing decisions are delegated to the consumer via the `summary-link` scoped slot — the grid
forwards `serviceData` from each `ServiceSummary` iteration so the consumer can build hrefs and
labels freely.

This is the renamed successor to `ServicesSectionGrid`, following `ServicesSection`'s rename/
strip to `ServiceSummary` — see [service-summary.md](service-summary.md) for why the old "full
mode" content went away.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `servicesData` | `Service[]` | — | **yes** |
| `tag` | `"div" \| "section" \| "main"` | `"div"` | no |
| `useAlternateReverse` | `boolean` | `false` | no |
| `alignment` | `"start" \| "center" \| "end"` | `"center"` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

### `useAlternateReverse`

When `true`, odd-indexed summaries flip their image/content column order (`reverse` prop on each
`ServiceSummary`), creating a visual zigzag layout. Commonly used on services landing pages with
three or more services.

### `alignment`

Passed to every `ServiceSummary` as `alignment` — controls vertical alignment of the info column
content within the grid cell.

## Slots

| Slot | Slot props | Purpose |
|------|-----------|---------|
| `summary-link` | `{ serviceData: Service }` | Navigation link below the `whatIsIt` text in each summary |

The slot is forwarded from the inner `ServiceSummary` and receives the current iteration's
`serviceData` as a scoped prop. It is optional — omitting it leaves that area empty.

## CSS custom properties

| Token | Default | Controls |
|---|---|---|
| `--service-summary-grid-row-gap` | `4rem` | Gap between stacked `ServiceSummary` rows |

Each inner `ServiceSummary`'s own tokens (`--service-summary-*`) still apply — see
`CONSUMER-STYLING.md` in the `service-summary` component folder for the full list.

## Basic usage

```vue
<ServiceSummaryGrid
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
</ServiceSummaryGrid>
```

## Consumer page boilerplate

```vue
<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <h1 class="page-heading-1">Our Services</h1>
        </PageRow>

        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-20']">
          <ServiceSummaryGrid
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
          </ServiceSummaryGrid>
        </PageRow>
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
  .service-summary-grid {
    --service-summary-grid-row-gap: 6rem;
  }
}
</style>
```

## Notes

- Component is auto-imported in Nuxt — no import needed.
- The `Service` type is imported from `~/types/types.services`.
- Each `ServiceSummary` receives its array `index` for eager/lazy image loading decisions (first
  two summaries load eagerly).
- Pass `servicesData ?? []` as a safe fallback while data loads asynchronously.
- If a single page needs a per-item entry animation (e.g. wrapping each item in `EntryAnimation`
  for a scroll-in effect), render `ServiceSummary` directly in your own `v-for` loop instead of
  using this grid wrapper — `ServiceSummaryGrid` has no slot for wrapping individual items.
- See [service-summary.md](service-summary.md) for the full `ServiceSummary` prop and slot API.
