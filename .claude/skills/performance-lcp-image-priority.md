# LCP Image — fetchpriority and loading

## Overview

When a component renders images in a loop, the first item is typically the LCP candidate. Without explicit hints, the browser treats all images equally and delays fetching the first one — inflating the "resource load delay" metric in Lighthouse.

Two props work together:

| Prop | `index === 0` | `index === 1` | `index > 1` |
|------|--------------|--------------|-------------|
| `fetchpriority` | `"high"` | `"auto"` | `"auto"` |
| `loading` | `"eager"` | `"eager"` | `"lazy"` |

## When to apply

Apply this pattern to any component that:
- renders a `<NuxtImg>` or `<img>` in a list driven by an `index` prop, **and**
- is likely to appear above or near the fold on first load

Do **not** apply `fetchpriority="high"` to more than one image per page — it cancels out the benefit.

## Steps

### 1. Accept an `index` prop

```ts
interface Props {
  index?: number
  // ...other props
}
const props = withDefaults(defineProps<Props>(), {
  index: 0,
})
```

### 2. Derive loading and fetchpriority

```ts
const imageLoading = computed(() =>
  props.index > 1 ? "lazy" : "eager"
)

const imageFetchPriority = computed(() =>
  props.index === 0 ? "high" : "auto"
)
```

### 3. Bind both to the image

```vue
<NuxtImg
  :src="item.image"
  :alt="item.title"
  :loading="imageLoading"
  :fetchpriority="imageFetchPriority"
/>
```

### 4. Pass the loop index from the consumer

```vue
<MyComponent
  v-for="(item, i) in items"
  :key="item.slug"
  :index="i"
/>
```

## Notes

- `fetchpriority="high"` signals to the browser to fetch the resource in the high-priority queue, reducing resource load delay — the main driver of LCP latency.
- Indices 0 and 1 both load eagerly because the second item is often partially visible on load (e.g. in a two-column grid). Only index 0 gets high priority.
- If the LCP element is not inside a loop (e.g. a standalone hero image), bind `fetchpriority="high"` directly without the computed.
- For non-Nuxt `<img>` elements, the attribute is identical: `<img fetchpriority="high" />`.
