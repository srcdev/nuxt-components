# DisplayChip Component

## Overview

`DisplayChip` renders a small status indicator dot (or icon/label badge) that is absolutely positioned on a parent element using CSS trigonometric functions. It works by applying a radial-gradient mask to the parent's content, creating a clean cutout behind the chip. Supports circle and square parent shapes.

Used directly for standalone chip overlays, and internally by `DisplayAvatar` when its `chip` prop is set.

---

## Props reference

> **Hyphenation rule**: Vue's ESLint config enforces `vue/attribute-hyphenation`. Always write camelCase prop names hyphenated in templates: `:style-class-passthrough`.

| Prop (template form)       | Type                       | Default    | Notes                                              |
| -------------------------- | -------------------------- | ---------- | -------------------------------------------------- |
| `tag`                      | `"div" \| "span"`          | `"span"`   | Root element tag.                                  |
| `shape`                    | `"circle" \| "square"`     | `"circle"` | Affects position maths — must match the parent shape. |
| `:config`                  | `DisplayChipConfig`        | see below  | Controls chip geometry and optional content.       |
| `:style-class-passthrough` | `string \| string[]`       | `[]`       | Extra CSS classes — use for status colour variants. |

### DisplayChipConfig

```ts
interface DisplayChipConfig {
  size: string       // chip dot diameter, e.g. "12px"
  maskWidth: string  // cutout ring width around the chip, e.g. "4px"
  offset: string     // extra distance from the parent edge, e.g. "0px"
  angle: string      // position around the parent (0–360deg), e.g. "45deg"
  icon?: string      // Iconify icon name rendered inside the chip
  label?: string     // short text rendered inside the chip (max 3 characters)
}
```

Default config: `{ size: "12px", maskWidth: "4px", offset: "0px", angle: "90deg" }`.

### Angle reference

| Angle    | Position     |
| -------- | ------------ |
| `0deg`   | Top          |
| `45deg`  | Top-right    |
| `90deg`  | Right        |
| `135deg` | Bottom-right |
| `180deg` | Bottom       |
| `225deg` | Bottom-left  |
| `270deg` | Left         |
| `315deg` | Top-left     |

---

## Status colours

Apply status via `styleClassPassthrough` — the component has built-in colour variants:

| Class      | Colour                  |
| ---------- | ----------------------- |
| (none)     | `slategrey` (offline)   |
| `online`   | `rgb(0, 255, 135)`      |
| `idle`     | `rgb(255, 185, 51)`     |
| `dnd`      | `rgb(255, 40, 80)`      |

```vue
<DisplayChip :style-class-passthrough="['online']">...</DisplayChip>
```

---

## Label constraints

- Max 3 characters. Longer values are silently truncated with a `console.warn`.
- Font-size scales automatically with chip size via `--_font-size-adjust`:
  - 1 char → `0.7 × size`
  - 2 chars → `0.6 × size`
  - 3 chars → `0.5 × size`

---

## Slots

| Slot      | Purpose                                    |
| --------- | ------------------------------------------ |
| `default` | The host element the chip is positioned on. Must be a single block element. |

---

## Usage examples

### Simple status dot on a circular avatar

```vue
<DisplayChip
  shape="circle"
  :config="{ size: '12px', maskWidth: '4px', offset: '0px', angle: '45deg' }"
  :style-class-passthrough="['online']"
>
  <div class="avatar">SRC</div>
</DisplayChip>
```

### Status dot on a square card thumbnail

```vue
<DisplayChip
  shape="square"
  :config="{ size: '10px', maskWidth: '3px', offset: '2px', angle: '135deg' }"
  :style-class-passthrough="['idle']"
>
  <img src="/thumbnail.jpg" alt="Card thumbnail" />
</DisplayChip>
```

### With an icon inside the chip

```vue
<DisplayChip
  :config="{ size: '16px', maskWidth: '4px', offset: '0px', angle: '45deg', icon: 'bi:check-circle-fill' }"
  :style-class-passthrough="['online']"
>
  <div class="avatar">SRC</div>
</DisplayChip>
```

### With a label inside the chip

```vue
<!-- 1–3 characters only; longer values are truncated with a warning -->
<DisplayChip
  :config="{ size: '16px', maskWidth: '4px', offset: '0px', angle: '45deg', label: '+2' }"
  :style-class-passthrough="['dnd']"
>
  <div class="avatar">SRC</div>
</DisplayChip>
```

### Reactive config (QA panel / form pattern)

```vue
<script setup lang="ts">
import type { DisplayChipConfig } from 'srcdev-nuxt-components/types/components'

const size = ref(12)
const angle = ref(45)

const chipConfig = computed((): DisplayChipConfig => ({
  size: `${size.value}px`,
  maskWidth: '4px',
  offset: '0px',
  angle: `${angle.value}deg`,
}))
</script>

<template>
  <DisplayChip shape="circle" :config="chipConfig" :style-class-passthrough="['online']">
    <div class="avatar">SRC</div>
  </DisplayChip>
</template>
```

### Via DisplayAvatar (recommended for avatar use cases)

Prefer `DisplayAvatar` with its `chip` prop over wiring `DisplayChip` directly:

```vue
<DisplayAvatar
  src="/images/profile.jpg"
  alt="Jane Smith"
  :chip="{ size: '12px', maskWidth: '4px', offset: '0px', angle: '45deg' }"
  :style-class-passthrough="['online']"
/>
```

See [display-avatar.md](./display-avatar.md) for the full API.

---

## Local style override scaffold

```vue
<DisplayChip
  :config="chipConfig"
  :style-class-passthrough="['my-chip']"
>
  <div class="avatar">SRC</div>
</DisplayChip>

<style>
/* ─── DisplayChip local overrides ──────────────────────────────────
   Scope by your wrapper class, then nest .display-chip-core directly.
   No :deep() needed (component styles are unscoped).
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.my-page-section {
  .display-chip-core {
    &.my-chip {
      /* override colour vars, e.g. */
      --color-online: hotpink;
    }
  }
}
</style>
```

---

## Notes

- Auto-imported in Nuxt — no manual import needed.
- `shape` must match the actual shape of the slot content — the position maths differs between `circle` (radius-based) and `square` (clamped corner-aware).
- `config` values are geometric inputs to CSS `calc(cos())` / `calc(sin())` expressions. Pass them as strings with units (`"12px"`, `"45deg"`), not plain numbers.
- The chip dot is rendered via `::after` pseudo-element; icon and label sit above it at `z-index: 2`.
- The mask cutout is applied to all direct children of `.display-chip-core` except `.chip-icon` and `.chip-label` — ensure the host element is a direct child.
- `DisplayChipConfig` and `DisplayChipProps` are both exported from the layer types. Use `DisplayChipConfig` when passing geometry values (the `config` prop). Use `DisplayChipProps` only if you need to pass the full component prop set (e.g. when building a wrapper component).
