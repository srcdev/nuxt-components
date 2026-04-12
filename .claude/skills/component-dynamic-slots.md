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
<CardCore variant="solid">
  <template #header>...</template>
  <template #body>...</template>
  <template #footer>...</template>
</CardCore>

<!-- Indexed names (grid) — consumer still uses v-for with dynamic slot names -->
<LayoutGridByCols :column-count="3">
  <template v-for="(item, i) in items" #[`item-${i}`] :key="i">
    {{ item }}
  </template>
</LayoutGridByCols>
```

Slots are rendered in document order.

### Reference components (named dynamic slots)

- `app/components/01.atoms/card/CardCore.vue`
- `app/components/01.atoms/content-wrappers/layout-grid/layout-grid-by-cols/LayoutGridByCols.vue`
- `app/components/01.atoms/content-wrappers/layout-grid/layout-grid-by-width/LayoutGridByWidth.vue`
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

## Pattern 3 — Prefixed Slot Inference

The component iterates over a **named subset** of provided slots, filtered by a prefix pattern. Consumer adds `profile-info-1`, `profile-info-2`, etc. and the component renders exactly those — no count prop required.

Use this when:

- Slot names follow a predictable prefix+index convention (`prefix-N`)
- The component should render however many the consumer passes, without needing a count prop kept in sync
- A fallback count is still useful for demos/Storybook when no matching slots are provided

### Implementation

```vue
<template>
  <div v-for="slotName in prefixedSlots" :key="slotName" class="item-block">
    <slot :name="slotName">
      <p>Fallback content for {{ slotName }}</p>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  itemCount?: number; // fallback only — used when no matching slots are provided
}
const props = withDefaults(defineProps<Props>(), { itemCount: 3 });

const slots = useSlots();

const prefixedSlots = computed(() => {
  const provided = Object.keys(slots)
    .filter((key) => /^my-prefix-\d+$/.test(key))
    .sort((a, b) => parseInt(a.split("-")[2] ?? "0") - parseInt(b.split("-")[2] ?? "0"));
  return provided.length > 0
    ? provided
    : Array.from({ length: props.itemCount }, (_, i) => `my-prefix-${i + 1}`);
});
</script>
```

### Key details

- `useSlots()` is required (not `$slots`) because the filtering logic lives in `<script setup>`
- Sort numerically, not lexicographically — `"10"` must come after `"9"`
- The `itemCount` fallback keeps demos and Storybook working without needing real slot content
- Do **not** pass `:heading-id` or other scoped props via these slots unless the consumer genuinely needs them — it creates duplicate-id risk when the same value is forwarded to multiple slots

### Consumer usage

No count prop needed — just add slots:

```vue
<ProfileSection>
  <template #profile-info-1>...</template>
  <template #profile-info-2>...</template>
  <template #profile-info-3>...</template>
  <template #profile-info-4>...</template>  <!-- automatically picked up -->
</ProfileSection>
```

### Examples (prefixed slot inference)

- `app/components/02.molecules/profile-section/ProfileSection.vue`

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
