# DisplayPill

## Overview

A classic pill/badge component for displaying status labels, tags, or metadata. Supports an icon slot and a text label, with reversible order, six colour variants, three sizes, and a full CSS custom property token API for consumer theming.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"span" \| "div" \| "button" \| "a"` | `"span"` | Root element. Use `"button"` or `"a"` for interactive pills: cursor switches to pointer and a `:focus-visible` outline is shown. A `button` gets `type="button"`; pass `href` (falls through) for an `a`. |
| `label` | `string` | `undefined` | Pill text. When set (and not just whitespace), renders inside `.display-pill-label` and suppresses the default slot |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size, rendered as `data-size` |
| `variant` | `"default" \| "primary" \| "success" \| "warning" \| "danger" \| "neutral"` | `"default"` | Colour variant, rendered as `data-variant`; an unknown value gets the default colours |
| `reversed` | `boolean` | `false` | Reverses icon/label order (`flex-direction: row-reverse`), rendered as `data-reversed` |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes merged onto the root element |

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Icon content, wrapped in `.display-pill-icon` (sized by `--display-pill-icon-size`) — rendered before the label by default, after when `reversed=true` |
| `default` | Custom label content, wrapped in `.display-pill-label` (so it's line-clamped like `label`) — only used when the `label` prop is not set or is whitespace |

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

Colour resolves as **variant token → base token → variant default**: `--display-pill-background`/`-text-colour` restyle every variant; `--display-pill-success-background` etc. win for that variant only. Borders follow the same chain: `--display-pill-<variant>-border-colour` → `--display-pill-border-colour` → `transparent`. So do rings (`--display-pill-ring-width`, a box-shadow): `--display-pill-<variant>-ring-colour` → `--display-pill-ring-colour` → the pill's background. Sizes have `-sm`/`-lg` suffixed tokens for font size and icon size only; padding and gap are the icon size times a ratio (`--display-pill-padding-inline-ratio` 0.7, `-padding-inline-icon-ratio` 0.4, `-padding-block-ratio` 0.3, `-gap-ratio` 0.35), so spacing scales with the pill. Absolute `--display-pill-padding-inline`/`-padding-block`/`-gap` tokens still override. The icon side of a pill gets `--display-pill-padding-inline-icon` (tighter than `--display-pill-padding-inline`), placed by `data-icon-position` (`start`, `end` when `reversed`, `only` for icon-only, absent with no icon), so label-only pills stay evenly padded.

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

/* Two-tone: dark border in the variant's text colour, light ring in its background colour */
.two-tone.display-pill {
  --display-pill-border-colour: currentColor;
  --display-pill-ring-width: 0.2rem; /* --display-pill-ring-colour defaults to the variant background */
}

/* Offset outline (a gap between pill and line); unlike the ring, outline ignores border-radius before Safari 16.4 */
.offset-outline.display-pill {
  --display-pill-outline: 0.2rem solid currentColor;
  --display-pill-outline-offset: 0.3rem;
}
```

## Outlined variants

The default text steps (`-09`/`-10`) are near-black in every hue, so an outlined pill using
`currentColor` for its border makes the variants look alike (`warning` and `danger` especially).
Lift each variant's text to its `-07` step (all 48% lightness, so contrast stays even); the border
follows. Neutral is normally the dark inverted pill, so give it a dark text step here.

```css
.tag-list {
  --display-pill-background: transparent;
  --display-pill-border-colour: currentColor;
  --display-pill-text-colour: var(--slate-07);
  --display-pill-primary-text-colour: var(--blue-07);
  --display-pill-success-text-colour: var(--green-07);
  --display-pill-warning-text-colour: var(--orange-07);
  --display-pill-danger-text-colour: var(--red-07);
  --display-pill-neutral-text-colour: var(--slate-10);

  /* Optional 2px ring in each variant's -02 step */
  --display-pill-ring-width: 0.2rem;
  --display-pill-ring-colour: var(--slate-02);
  --display-pill-primary-ring-colour: var(--blue-02);
  --display-pill-success-ring-colour: var(--green-02);
  --display-pill-warning-ring-colour: var(--orange-02);
  --display-pill-danger-ring-colour: var(--red-02);
}
```

To keep the dark text and colour only the border, set `--display-pill-<variant>-border-colour`
instead (e.g. `var(--status-success)`). The ring is a box-shadow: it takes no layout space, so
leave a gap between ringed pills.

## Stories

`Default`, `AllVariants`, `OutlinedViaBaseTokens` (per-variant mid-step borders), `OutlinedMonochrome`
(the recipe above, with a story-only `ring` control), `RingedTwoTone` (dark border inside a light ring;
the `ring` control swaps the ring to `-02`), and `StressTest`. `labelLineClamp` and `ring` are
story-only controls that set CSS tokens, not props. The stories link to `ServiceSummary` and
`ServiceDetail`, which render neutral duration/price pills.

## Notes

- Since 2026-10-06 a pill never grows past its container: a label too long for the space ends in an ellipsis. Since 2026-10-08 that's a line clamp, `--display-pill-label-line-clamp` (default `1`); set `none` to let long labels wrap (worth it for text that must stay readable, like a price, in a narrow column).
- Since 2026-10-08 a pill with no text and no icon (empty or whitespace-only `label`, no slots) renders nothing visible (`:empty { display: none }`), and a whitespace-only `label` with an icon gives an icon-only pill.
- 2026-10-08 (breaking): size/variant/reversed moved from bare classes (`.sm`, `.primary`, `.is-reversed`) to `data-size`/`data-variant`/`data-reversed`, so a consumer's own `.primary`/`.success` utility classes can't hit the pill. Selectors like `.display-pill.primary` become `.display-pill[data-variant="primary"]`.
- `StressTest` story covers long/unbroken/RTL/emoji/HTML-like labels, empty and whitespace labels, a broken icon and an unknown variant at three container widths.
- `border-radius` defaults to `100vw` — this always collapses to the tightest possible radius on the shorter axis, making it geometry-independent (no magic number needed).
- `cursor: default` and `user-select: none` are applied unconditionally. `cursor: pointer` is applied automatically via `:is(button, a)` when `tag` is interactive.
- All variant colour pairs use a light-tint background (`--color-01`) with a dark text colour (`--color-09`/`--color-10`) to ensure WCAG AA contrast. The project colour scale runs `00` (lightest) → `10` (darkest) — the opposite of Tailwind.
- 2026-09-27 migration: tokens renamed `--theme-pill-*` → `--display-pill-*`; variants now fall back to the base colour tokens (so `ServiceSummary`/`ServiceDetail`'s pill overrides finally apply); `warning` moved from a non-existent `--yellow-*` ramp (hex fallbacks) to `--orange-01`/`--orange-10`; icon slot wrapped and sized (the icon-size tokens were unused); `.pill-label` → `.display-pill-label`; `button` pills get `type="button"` and a visible focus outline (the base `outline: none` suppressed it); single-use private pass-throughs inlined.
