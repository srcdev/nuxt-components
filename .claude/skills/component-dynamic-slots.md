# Dynamic Slot Patterns

## Overview

Two distinct patterns exist for dynamic slots in this project. Choose based on who controls
the slot structure — the **consumer** (named dynamic slots) or the **component** (indexed dynamic slots).

**Default to named dynamic slots.** Only use indexed dynamic slots when there is a specific
reason the component must know the count in advance (see decision guide below).

---

## Pattern 1 — Named Dynamic Slots

The component renders whatever slots the consumer passes. Slot names are not known in advance.
Best for container/card/layout components.

### When to use

- The component is a wrapper/shell (card, panel, grid, dialog)
- Slot names are consumer-defined (semantic or indexed — doesn't matter)
- `itemCount` would only be used to drive the slot loop and nothing else

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

### Slot name as CSS class

Since `name` is already available in the loop, it can be applied as a class on the wrapper element. This gives each slot section a targetable class derived automatically from the slot name — no extra props needed:

```vue
<template v-for="(_, name) in $slots" :key="name">
  <div class="card-row" :class="`card-row-${name}`">
    <slot :name="name"></slot>
  </div>
</template>
```

A consumer passing `#header` gets `<div class="card-row card-row-header">`, `#footer` gets `<div class="card-row card-row-footer">`, etc. The component's CSS can then target `.card-row-header`, `.card-row-footer` etc. for per-section styling.

### Consumer usage

Any slot names work — semantic or indexed:

```vue
<!-- Semantic names (card) -->
<DisplayCardDynamic variant="solid">
  <template #header>...</template>
  <template #body>...</template>
  <template #footer>...</template>
</DisplayCardDynamic>

<!-- Indexed names (grid) — consumer still uses v-for with dynamic slot names -->
<LayoutGridByCols :column-count="3">
  <template v-for="(item, i) in items" #[`item-${i}`] :key="i">
    {{ item }}
  </template>
</LayoutGridByCols>
```

Slots are rendered in document order.

### Reference components (named dynamic slots)

- `app/components/display-card/DisplayCardDynamic.vue`
- `app/components/01.atoms/content-layouts/layout-grid/layout-grid-by-cols/LayoutGridByCols.vue`
- `app/components/01.atoms/content-layouts/layout-grid/layout-grid-by-width/LayoutGridByWidth.vue`
- `app/components/container-glow/ContainerGlowCore.vue`

---

## Pattern 2 — Indexed Dynamic Slots

The component declares how many slots exist via an `itemCount` prop. Slot names follow a
predictable pattern (`item-0`, `item-1`, …).

### When to use — only when itemCount is needed for logic beyond slot iteration

| Reason to keep `itemCount` | Example |

|---|---|
| Multiple slot types per item must be grouped into one rendered element | `AccordianCore` — `summary`/`icon`/`content` per `<ExpandingPanel>` |
| Two parallel loops must stay in sync for aria linking | `TabsCore` — nav `<li>` loop + content `<div>` loop linked by id |
| `itemCount` drives non-slot logic (z-index, CSS scope, counters) | `WipeAwayVertical` — `z-index: itemCount - key`, `timelineScope` computed |
| `$slots` inspection per iteration is needed to conditionally render | `StepperList` — checks `$slots[indicator-N]` to toggle class per `<li>` |

If none of these apply and `itemCount` is **only** used to generate the slot loop — convert to named dynamic slots.

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

### Multi-type indexed slots

Some components pair multiple slot types per index (e.g. TabsCore):

```vue
<template v-for="index in itemCount" :key="index">
  <slot :name="`tab-${index}-trigger`"></slot>
  <slot :name="`tab-${index}-content`"></slot>
</template>
```

### Reference components (indexed dynamic slots)

- `app/components/tabs/TabsCore.vue`
- `app/components/accordian/AccordianCore.vue`
- `app/components/02.molecules/stepper-list/StepperList.vue`
- `app/components/view-timeline/WipeAwayVertical.vue`

---

## Comparison

| | Named dynamic slots | Indexed dynamic slots |
|---|---|---|
| Slot names defined by | Consumer | Component |
| Number of slots | Open-ended | Fixed by `itemCount` prop |
| Template mechanism | `v-for="(_, name) in $slots"` | `v-for="index in itemCount"` |
| Typical use case | Card, grid, panel, layout wrapper | Tabs, accordion, stepper, timeline |
| Slot naming convention | Any (semantic or indexed) | Enforced (`item-0`, `tab-0-trigger`) |
| Default choice? | ✅ Yes | Only when count is needed for logic |
