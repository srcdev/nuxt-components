# ExpandingPanel Component

## Overview

`ExpandingPanel` is a single expand/collapse panel built on the native `<details>`/`<summary>` element. It animates open/close via a CSS grid-template-rows trick, supports `v-model` for controlled state, and can be locked open with `forceOpened`. Multiple panels can be grouped into a native accordion by sharing the same `name` prop (see `AccordianCore`).

---

## Props reference

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | `string` | `useId()` | Identifies the panel. Used in ARIA attributes (`id-{name}-trigger`, `id-{name}-content`). If omitted, a unique id is generated automatically. |
| `animationDuration` | `number` | `400` | Expand/collapse transition duration in milliseconds. Pass `0` to disable animation. |
| `forceOpened` | `boolean` | `false` | When `true`, the panel is always open. The toggle icon is hidden and clicks do not close the panel. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra CSS classes applied to the root `.expanding-panel` element. |

## Model

| Model | Type | Default | Notes |
|-------|------|---------|-------|
| `v-model` | `boolean` | `false` | Controls open/closed state. Bind to a `ref<boolean>` to manage state externally. |

---

## Slots

| Slot | Purpose |
|------|---------|
| `#summary` | Content rendered inside the clickable `<summary>` row (label area). |
| `#icon` | Custom toggle icon. Defaults to a `bi:caret-down-fill` icon that flips on open. Hidden when `forceOpened` is `true`. |
| `#content` | Content revealed when the panel is open. Can contain any markup. |

---

## Usage examples

### Basic uncontrolled panel

```vue
<ExpandingPanel name="delivery">
  <template #summary>
    <span>Delivery &amp; Returns</span>
  </template>
  <template #content>
    <p>Free standard delivery on orders over £50.</p>
  </template>
</ExpandingPanel>
```

### Controlled via v-model

```vue
<script setup lang="ts">
const isOpen = ref(false);
</script>

<template>
  <ExpandingPanel name="faq-1" v-model="isOpen">
    <template #summary><span>What is your returns policy?</span></template>
    <template #content><p>You can return any item within 30 days.</p></template>
  </ExpandingPanel>
  <button @click="isOpen = !isOpen">Toggle externally</button>
</template>
```

### Force opened (always visible, no toggle)

```vue
<ExpandingPanel name="notice" :force-opened="true">
  <template #summary><strong>Important notice</strong></template>
  <template #content>
    <p>This panel cannot be collapsed.</p>
  </template>
</ExpandingPanel>
```

### Custom icon

```vue
<ExpandingPanel name="custom-icon">
  <template #summary><span>Section title</span></template>
  <template #icon>
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M6 9L1 3h10z" fill="currentColor" />
    </svg>
  </template>
  <template #content><p>Content here.</p></template>
</ExpandingPanel>
```

### Slow animation

```vue
<ExpandingPanel name="slow" :animation-duration="800">
  <template #summary><span>Slow panel</span></template>
  <template #content><p>Opens and closes over 800 ms.</p></template>
</ExpandingPanel>
```

---

## ARIA / accessibility

The component wires ARIA automatically from the `name` prop:

| Element | Attribute | Value |
|---------|-----------|-------|
| `<summary>` | `id` | `id-{name}-trigger` |
| `<summary>` | `aria-controls` | `id-{name}-content` |
| `<summary>` | `aria-expanded` | `true` / `false` |
| content div | `id` | `id-{name}-content` |
| content div | `aria-labelledby` | `id-{name}-trigger` |
| content div | `role` | `region` |

Always supply a meaningful `name` prop when using multiple panels on the same page to avoid duplicate IDs.

---

## Notes

- The open/close animation uses `grid-template-rows: 0fr → 1fr` — no JS height measurement needed.
- When `forceOpened` is `true`, `open` stays `true` regardless of `v-model`, but `v-model` still updates internally on clicks (useful if you later set `forceOpened` back to `false`).
- Group panels into a native accordion (only one open at a time) by passing the same `name` to multiple panels or use `AccordianCore` which handles this automatically.
- Auto-imported in Nuxt — no manual import needed.
- File: `app/components/02.molecules/expandable/expanding-panel/ExpandingPanel.vue`
