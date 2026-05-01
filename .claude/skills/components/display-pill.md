# DisplayPill

## Overview

A classic pill/badge component for displaying status labels, tags, or metadata. Supports an icon slot and a text label, with reversible order, six colour variants, three sizes, and a full CSS custom property token API for consumer theming.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"span" \| "div" \| "button" \| "a"` | `"span"` | Root element. Use `"button"` or `"a"` for interactive pills — cursor auto-switches to pointer |
| `label` | `string` | `undefined` | Pill text. When set, renders inside `.pill-label` and suppresses the default slot |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `variant` | `"default" \| "primary" \| "success" \| "warning" \| "danger" \| "neutral"` | `"default"` | Colour variant |
| `reversed` | `boolean` | `false` | Reverses icon/label order (`flex-direction: row-reverse`) |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes merged onto the root element |

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Icon content — rendered before the label by default, after when `reversed=true` |
| `default` | Custom label content — only used when the `label` prop is not set |

## Basic usage

```vue
<DisplayPill label="Active" variant="success">
  <template #icon>
    <Icon name="material-symbols:circle" />
  </template>
</DisplayPill>
```

## Reversed order (text → icon)

```vue
<DisplayPill label="Draft" variant="warning" :reversed="true">
  <template #icon>
    <Icon name="material-symbols:edit-outline" />
  </template>
</DisplayPill>
```

## Icon only

```vue
<DisplayPill variant="danger" aria-label="Error">
  <template #icon>
    <Icon name="material-symbols:error-outline" />
  </template>
</DisplayPill>
```

## Custom slot content

When `label` is not set, the default slot is rendered instead:

```vue
<DisplayPill variant="primary">
  <template #icon>
    <Icon name="material-symbols:star" />
  </template>
  <strong>Pro</strong> plan
</DisplayPill>
```

## CSS token API

All tokens follow the `--theme-pill-*` convention and fall back to project colour tokens.

### Colour

| Token | Default |
|-------|---------|
| `--theme-pill-bg` | `var(--slate-01)` |
| `--theme-pill-color` | `var(--slate-09)` |
| `--theme-pill-primary-bg` | `var(--blue-01)` |
| `--theme-pill-primary-color` | `var(--blue-09)` |
| `--theme-pill-success-bg` | `var(--green-01)` |
| `--theme-pill-success-color` | `var(--green-10)` |
| `--theme-pill-warning-bg` | `var(--yellow-08, #fef9c3)` |
| `--theme-pill-warning-color` | `var(--yellow-03, #a16207)` |
| `--theme-pill-danger-bg` | `var(--red-01)` |
| `--theme-pill-danger-color` | `var(--red-10)` |
| `--theme-pill-neutral-bg` | `var(--slate-08)` |
| `--theme-pill-neutral-color` | `var(--slate-03)` |

### Border

| Token | Default |
|-------|---------|
| `--theme-pill-border-color` | `transparent` |
| `--theme-pill-border-width` | `1px` |
| `--theme-pill-border-style` | `solid` |
| `--theme-pill-border-radius` | `100vw` |

### Outline

| Token | Default |
|-------|---------|
| `--theme-pill-outline` | `none` |
| `--theme-pill-outline-offset` | `0px` |

### Typography & spacing

| Token | Default |
|-------|---------|
| `--theme-pill-font-size` | `1.2rem` |
| `--theme-pill-font-size-sm` | `1rem` |
| `--theme-pill-font-size-lg` | `1.4rem` |
| `--theme-pill-font-weight` | `500` |
| `--theme-pill-padding-x` | `1rem` |
| `--theme-pill-padding-y` | `0.4rem` |
| `--theme-pill-gap` | `0.5rem` |
| `--theme-pill-icon-size` | `1.4rem` |

## Theming via styleClassPassthrough

Override tokens by targeting `.your-class.display-pill` — no `:deep()` needed:

```vue
<DisplayPill label="New" variant="primary" style-class-passthrough="pill-new" />
```

```css
.pill-new.display-pill {
  --theme-pill-primary-bg: var(--green-01);
  --theme-pill-primary-color: var(--green-10);
  --theme-pill-border-color: currentColor;
  --theme-pill-border-width: 1.5px;
}
```

## Border and outline examples

```css
/* Solid border */
.bordered.display-pill {
  --theme-pill-border-color: currentColor;
  --theme-pill-border-width: 1.5px;
}

/* Dashed border */
.dashed.display-pill {
  --theme-pill-border-color: currentColor;
  --theme-pill-border-width: 1.5px;
  --theme-pill-border-style: dashed;
}

/* Focus-ring style outline */
.outlined.display-pill {
  --theme-pill-outline: 2px solid currentColor;
  --theme-pill-outline-offset: 3px;
}
```

## Notes

- `border-radius` defaults to `100vw` — this always collapses to the tightest possible radius on the shorter axis, making it geometry-independent (no magic number needed).
- `cursor: default` and `user-select: none` are applied unconditionally. `cursor: pointer` is applied automatically via `:is(button, a)` when `tag` is interactive.
- All variant colour pairs use a light-tint background (`--color-01`) with a dark text colour (`--color-09`/`--color-10`) to ensure WCAG AA contrast. The project colour scale runs `00` (lightest) → `10` (darkest) — the opposite of Tailwind.
