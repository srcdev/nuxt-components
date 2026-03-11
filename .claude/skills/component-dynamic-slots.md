# Dynamic Slot Patterns

## Overview

Two distinct patterns exist for dynamic slots in this project. Choose based on who controls
the slot structure — the **consumer** (named dynamic slots) or the **component** (indexed dynamic slots).

---

## Pattern 1 — Named Dynamic Slots

The component renders whatever slots the consumer passes. Slot names are not known in advance.
Best for container/card components where consumers define the structure.

### When to use
- The component is a wrapper/shell (card, panel, dialog)
- Slot names are semantic and consumer-defined (e.g. `header`, `body`, `footer`, `media`)
- The number and naming of sections varies per usage

### Implementation

```vue
<template>
  <component :is="tag" class="my-component">
    <template v-for="(_, name) in $slots" :key="name">
      <div>
        <slot :name="name"></slot>
      </div>
    </template>
  </component>
</template>
```

No `useSlots()` call needed — `$slots` is available directly in the template.

### Consumer usage

```vue
<DisplayCardDynamic variant="solid">
  <template #header>...</template>
  <template #media>...</template>
  <template #body>...</template>
  <template #footer>...</template>
</DisplayCardDynamic>
```

Slots are rendered in document order. The component adds no structure beyond the wrapper `<div>`
per slot — all layout decisions belong to the consumer.

### Reference component
`app/components/display-card/DisplayCardDynamic.vue`

---

## Pattern 2 — Indexed Dynamic Slots

The component declares how many slots exist via an `itemCount` prop. Slot names follow a
predictable pattern (`item-0`, `item-1`, …). Best for layout/grid components where the
component manages the structural container.

### When to use
- The component manages layout structure (grid, columns, carousel)
- The number of items is explicit and uniform
- Consumers fill slots by index rather than by semantic name

### Implementation

```vue
<template>
  <div class="my-grid">
    <template v-for="index in itemCount" :key="index">
      <slot :name="`item-${index - 1}`"></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  itemCount: number;
}
const props = defineProps<Props>();
</script>
```

### Consumer usage

```vue
<LayoutGridByCols :item-count="3" :column-count="3">
  <template #item-0>First</template>
  <template #item-1>Second</template>
  <template #item-2>Third</template>
</LayoutGridByCols>
```

### Multi-type indexed slots

Some components pair multiple slot types per index (e.g. TabsCore):

```vue
<template v-for="index in itemCount" :key="index">
  <slot :name="`tab-${index}-trigger`"></slot>
  <slot :name="`tab-${index}-content`"></slot>
</template>
```

### Reference components
- `app/components/01.atoms/content-layouts/layout-grid/layout-grid-by-width/LayoutGridByWidth.vue`
- `app/components/01.atoms/content-layouts/layout-grid/layout-grid-by-cols/LayoutGridByCols.vue`
- `app/components/tabs/TabsCore.vue`

---

## Comparison

| | Named dynamic slots | Indexed dynamic slots |
|---|---|---|
| Slot names defined by | Consumer | Component |
| Number of slots | Open-ended | Fixed by `itemCount` prop |
| Template mechanism | `v-for="(_, name) in $slots"` | `v-for="index in itemCount"` |
| Typical use case | Card, panel, dialog | Grid, list, carousel, tabs |
| Slot naming convention | Semantic (`header`, `body`) | Indexed (`item-0`, `item-1`) |
