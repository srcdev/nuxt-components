# DisplayPill

## Overview

A classic pill/badge component for displaying status labels, tags, or metadata. Supports an icon slot and a text label, with reversible order, six colour variants, three sizes, and a full CSS custom property token API for consumer theming.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"span" \| "div" \| "button" \| "a"` | `"span"` | Root element. Use `"button"` or `"a"` for interactive pills: cursor switches to pointer and a `:focus-visible` outline is shown. A `button` gets `type="button"`; pass `href` (falls through) for an `a`. |
| `label` | `string` | `undefined` | Pill text. When set, renders inside `.display-pill-label` and suppresses the default slot |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size variant |
| `variant` | `"default" \| "primary" \| "success" \| "warning" \| "danger" \| "neutral"` | `"default"` | Colour variant |
| `reversed` | `boolean` | `false` | Reverses icon/label order (`flex-direction: row-reverse`) |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes merged onto the root element |

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Icon content, wrapped in `.display-pill-icon` (sized by `--display-pill-icon-size`) — rendered before the label by default, after when `reversed=true` |
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

Full token list in `CONSUMER-STYLING.md` next to the component. All tokens are `--display-pill-*` (renamed from `--theme-pill-*` on 2026-09-27; `bg`/`color` became `background`/`text-colour`).

Colour resolves as **variant token → base token → variant default**: `--display-pill-background`/`-text-colour` restyle every variant; `--display-pill-success-background` etc. win for that variant only. Sizes have `-sm`/`-lg` suffixed tokens for font size, padding and icon size. The icon side of a pill gets `--display-pill-padding-inline-icon` (tighter than `--display-pill-padding-inline`), placed by `data-icon-position` (`start`, `end` when `reversed`, `only` for icon-only, absent with no icon), so label-only pills stay evenly padded.

```vue
<DisplayPill label="New" variant="primary" style-class-passthrough="pill-new" />
```

```css
.pill-new.display-pill {
  --display-pill-primary-background: var(--green-01);
  --display-pill-primary-text-colour: var(--green-10);
  --display-pill-border-colour: currentColor;
  --display-pill-border-width: 0.15rem;
}

/* Dashed border */
.dashed.display-pill {
  --display-pill-border-colour: currentColor;
  --display-pill-border-style: dashed;
}

/* Decorative outline ring */
.ringed.display-pill {
  --display-pill-outline: 0.2rem solid currentColor;
  --display-pill-outline-offset: 0.3rem;
}
```

## Notes

- `border-radius` defaults to `100vw` — this always collapses to the tightest possible radius on the shorter axis, making it geometry-independent (no magic number needed).
- `cursor: default` and `user-select: none` are applied unconditionally. `cursor: pointer` is applied automatically via `:is(button, a)` when `tag` is interactive.
- All variant colour pairs use a light-tint background (`--color-01`) with a dark text colour (`--color-09`/`--color-10`) to ensure WCAG AA contrast. The project colour scale runs `00` (lightest) → `10` (darkest) — the opposite of Tailwind.
- 2026-09-27 migration: tokens renamed `--theme-pill-*` → `--display-pill-*`; variants now fall back to the base colour tokens (so `ServiceSummary`/`ServiceDetail`'s pill overrides finally apply); `warning` moved from a non-existent `--yellow-*` ramp (hex fallbacks) to `--orange-01`/`--orange-10`; icon slot wrapped and sized (the icon-size tokens were unused); `.pill-label` → `.display-pill-label`; `button` pills get `type="button"` and a visible focus outline (the base `outline: none` suppressed it); single-use private pass-throughs inlined.
