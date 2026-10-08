# DisplayChip Component

> **Changed 2026-10-08 (breaking):** status is the new `status` prop (`data-status`), not an `online`/`idle`/`dnd` class through `styleClassPassthrough`. Shape is `data-shape`, not a `.circle`/`.square` class. Inner classes are `.display-chip-icon`/`.display-chip-label` (were `.chip-icon`/`.chip-label`), with `data-length` instead of `.length-N`. Every `config` field is optional and falls back to a public `--display-chip-*` geometry token. Labels are counted and truncated by grapheme, so emoji are never split. New `statusLabel` prop for screen-reader text.

> **Renamed 2026-09-27:** root class `.display-chip-core` → `.display-chip`. Status colours are now public tokens (`--display-chip-colour-*`, were unprefixed `--color-*`); the geometry vars fed from `config` are private (`--_chip-*`).

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
| `status`                   | `DisplayChipStatus`        | `"offline"` | `"offline" \| "online" \| "idle" \| "dnd"`. Sets the dot colour via `data-status`. |
| `status-label`             | `string`                   | `""`       | Screen-reader text for the status (e.g. "Online"), so it isn't conveyed by colour alone. Pass translated copy. |
| `:config`                  | `DisplayChipConfig`        | `{}`       | Geometry and optional content. Every field is optional. |
| `:style-class-passthrough` | `string \| string[]`       | `[]`       | Extra CSS classes on the root.                     |

### DisplayChipConfig

```ts
interface DisplayChipConfig {
  size?: string       // chip dot diameter, e.g. "12px"
  maskWidth?: string  // cutout ring width around the chip, e.g. "4px"
  offset?: string     // extra distance from the parent edge, e.g. "0px"
  angle?: string      // position around the parent (0–360deg), e.g. "45deg"
  icon?: string       // Iconify icon name rendered inside the chip (decorative, aria-hidden)
  label?: string      // short text rendered inside the chip (max 3 characters)
}
```

A missing geometry field falls back to its token: `--display-chip-size` (`1.2rem`),
`--display-chip-mask-width` (`0.4rem`), `--display-chip-offset` (`0rem`), `--display-chip-angle`
(`90deg`). A field set in `config` beats the token. Negative `size`/`maskWidth` clamp to `0`; values
without units (`"45"`) are invalid CSS and hide the dot.

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

Set with the `status` prop:

| `status` | Token | Default |
| --- | --- | --- |
| `offline` (default) | `--display-chip-colour-offline` | `var(--status-neutral)` |
| `online` | `--display-chip-colour-online` | `var(--status-success)` |
| `idle` | `--display-chip-colour-idle` | `var(--status-warning)` |
| `dnd` | `--display-chip-colour-dnd` | `var(--status-danger)` |

Defaults come from the global status tokens (changed 2026-10-07, were neon `rgb()` values); see
`.claude/skills/theming-status-tokens.md`.

Icon and label colour: `--display-chip-text-colour` (default `black`). Full reference:
`app/components/02.molecules/display-chip/CONSUMER-STYLING.md`.

```vue
<DisplayChip status="online" status-label="Online">...</DisplayChip>
```

---

## Label constraints

- Max 3 characters, counted as graphemes: an emoji (including ZWJ sequences like 👨‍👩‍👧‍👦 and flags) counts as one and is never split. Longer values are truncated with a `console.warn`. Whitespace is trimmed; a whitespace-only label renders nothing.
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
  status="online"
>
  <div class="avatar">SRC</div>
</DisplayChip>
```

### Status dot on a square card thumbnail

```vue
<DisplayChip
  shape="square"
  :config="{ size: '10px', maskWidth: '3px', offset: '2px', angle: '135deg' }"
  status="idle"
>
  <img src="/thumbnail.jpg" alt="Card thumbnail" />
</DisplayChip>
```

### With an icon inside the chip

```vue
<DisplayChip
  :config="{ size: '16px', maskWidth: '4px', offset: '0px', angle: '45deg', icon: 'bi:check-circle-fill' }"
  status="online"
>
  <div class="avatar">SRC</div>
</DisplayChip>
```

### With a label inside the chip

```vue
<!-- 1–3 characters only; longer values are truncated with a warning -->
<DisplayChip
  :config="{ size: '16px', maskWidth: '4px', offset: '0px', angle: '45deg', label: '+2' }"
  status="dnd"
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
  <DisplayChip shape="circle" :config="chipConfig" status="online">
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
  status="online"
  status-label="Online"
/>
```

See [display-avatar.md](./display-avatar.md) for the full API.

---

## Local style override scaffold

```vue
<DisplayChip
  :config="chipConfig"
  status="online"
  :style-class-passthrough="['my-chip']"
>
  <div class="avatar">SRC</div>
</DisplayChip>

<style>
/* ─── DisplayChip local overrides ──────────────────────────────────
   Scope by your wrapper class, then nest .display-chip directly.
   No :deep() needed (component styles are unscoped).
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.my-page-section {
  .display-chip {
    &.my-chip {
      /* override colour vars, e.g. */
      --display-chip-colour-online: hotpink;
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
- The mask cutout is applied to all direct children of `.display-chip` except `.display-chip-icon`, `.display-chip-label` and the `.sr-only` status text — ensure the host element is a direct child.
- The `StressTest` story shows the worst-case labels and config values.
- `DisplayChipConfig` and `DisplayChipProps` are both exported from the layer types. Use `DisplayChipConfig` when passing geometry values (the `config` prop). Use `DisplayChipProps` only if you need to pass the full component prop set (e.g. when building a wrapper component).
