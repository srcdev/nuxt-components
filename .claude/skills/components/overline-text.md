# OverlineText Component

> **Renamed 2026-11-24** from `EyebrowText` ("eyebrow" had become a cliché term). Also known as an
> eyebrow or kicker. Old → new: `EyebrowText` → `OverlineText`, `.eyebrow-text` → `.overline-text`,
> `--eyebrow-text-*` → `--overline-text-*`, `--colour-text-eyebrow` → `--colour-text-overline`. Related
> renames in other components are listed in skill `consumer-layer-upgrade.md`.

## Overview

`OverlineText` renders a short uppercase label — typically used above a heading to provide context or categorisation. It outputs a single string with configurable tag, size, and colour via CSS custom properties.

## Before Adding to a Page

Always ask the user for the following before placing the component:

1. **`textContent`** — what is the label text? (passed as-is — do not pre-uppercase)
2. **`fontSize`** — which size? (`large` | `medium` | `small`) — default is `medium`
3. **`tag`** — does it need to be inline? If yes, use `span`. Otherwise `p` or `div` (default).
4. **`styleClassPassthrough`** — any extra classes to add? (layout, spacing, custom styling hooks)

Do not assume placeholder text or default content.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `textContent` | `string` | — | yes |
| `tag` | `"p" \| "div" \| "span"` | `"div"` | no |
| `fontSize` | `"large" \| "medium" \| "small"` | `"medium"` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

## Basic Usage

```vue
<OverlineText text-content="Interior Design" />
```

## With Tag and Size

Use `tag="p"` for semantic paragraph context, or `tag="span"` when inline. Choose `fontSize` to match surrounding hierarchy.

```vue
<OverlineText
  tag="p"
  font-size="small"
  text-content="Featured Collection"
/>
```

## Paired with HeroText

OverlineText is commonly placed directly above a `HeroText` heading:

```vue
<OverlineText tag="p" text-content="Our Services" />
<HeroText
  tag="h2"
  :text-content="[
    { text: 'Crafted with', styleClass: 'normal' },
    { text: 'Care', styleClass: 'accent' },
  ]"
/>
```

## Font Size Scale

The prop is rendered as `data-font-size` on the root (not a class).

| Value | CSS variable |
|-------|-------------|
| `large` | `--overline-text-large` (default `1.4rem`) |
| `medium` | `--overline-text-medium` (default `1.2rem`) |
| `small` | `--overline-text-small` (default `1rem`) |

The library theme sets these on `:root`; the component has matching fallbacks. The text is filled
with `--overline-text-bg-img` (gold/rose gradient by default) via `background-clip: text`. Full
reference: `app/components/01.atoms/text-blocks/overline-text/CONSUMER-STYLING.md`.

## Styling

Key CSS custom properties (full list in `CONSUMER-STYLING.md`):

- `--overline-text-bg-img` — text fill (gradient via `background-clip: text`; use a single-colour gradient for a solid colour)
- `--overline-text-font-family`, `--overline-text-font-style` (default `italic`), `--overline-text-font-weight`, `--overline-text-letter-spacing` — typography

Text is always `text-transform: uppercase` — do not pass pre-uppercased strings, as this makes content harder to edit and search.

Override via `styleClassPassthrough` or a parent HOC `<style>` block targeting `.overline-text`.

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<OverlineText :style-class-passthrough="['my-overline']" text-content="Our Services" />

<style>
/* ─── OverlineText local overrides ──────────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.overline-text {
  &.my-overline {
    /* --overline-text-bg-img: linear-gradient(var(--brand-accent), var(--brand-accent)); */
    /* --overline-text-font-style: normal; */
    /* --overline-text-letter-spacing: 0.2em; */
  }
}
</style>
```

> **Note:** Font size is controlled via the `fontSize` prop and theme tokens `--overline-text-large/medium/small` — define these at theme level, not as local overrides.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- `tag` defaults to `"div"` which is block-level. Use `"span"` when the overline must be inline within a flow of text.
- Long text and unbroken strings wrap (`overflow-wrap: anywhere`). There is no line-clamp token: clamping needs `overflow: hidden`, which clips the italic overhang; `ServiceDetail` clamps its overline itself with an allowance.
- 2026-10-19 migration: the size moved from a bare `large`/`medium`/`small` class to `data-font-size`; added wrapping, a `StressTest` story and parent-story links.
