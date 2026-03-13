# EyebrowText Component

## Overview

`EyebrowText` renders a short uppercase label — typically used above a heading to provide context or categorisation. It outputs a single string with configurable tag, size, and colour via CSS custom properties.

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
<EyebrowText textContent="Interior Design" />
```

## With Tag and Size

Use `tag="p"` for semantic paragraph context, or `tag="span"` when inline. Choose `fontSize` to match surrounding hierarchy.

```vue
<EyebrowText
  tag="p"
  fontSize="small"
  textContent="Featured Collection"
/>
```

## Paired with HeroText

EyebrowText is commonly placed directly above a `HeroText` heading:

```vue
<EyebrowText tag="p" textContent="Our Services" />
<HeroText
  tag="h2"
  :textContent="[
    { text: 'Crafted with', styleClass: 'normal' },
    { text: 'Care', styleClass: 'accent' },
  ]"
/>
```

## Font Size Scale

| Value | CSS variable |
|-------|-------------|
| `large` | `--eyebrow-text-large` |
| `medium` | `--eyebrow-text-medium` |
| `small` | `--eyebrow-text-small` |

Define these CSS custom properties in your consuming app to control sizes.

## Styling

Key CSS custom properties:

- `--colour-text-eyebrow` — text colour (defaults to an accent/muted tone)

Text is always `text-transform: uppercase` — do not pass pre-uppercased strings, as this makes content harder to edit and search.

Override via `styleClassPassthrough` or a parent HOC `<style>` block targeting `.eyebrow-text`.

## Local style override scaffold

When consuming this component, scaffold a style block using `styleClassPassthrough`. Delete the block if unused.

See [component-local-style-override.md](../component-local-style-override.md) for the full pattern.

```vue
<EyebrowText :style-class-passthrough="['my-eyebrow']" text-content="Our Services" />

<style>
/* ─── EyebrowText local overrides ──────────────────────────────────
   Colours, borders, geometry only — do not override behaviour.
   Delete this block if no overrides are needed.
   ─────────────────────────────────────────────────────────────────── */
.eyebrow-text {
  &.my-eyebrow {
    /* Colours */
    /* --colour-text-eyebrow: var(--brand-accent); */
  }
}
</style>
```

> **Note:** Font size is controlled via the `fontSize` prop and theme tokens `--eyebrow-text-large/medium/small` — define these at theme level, not as local overrides.

## Notes

- Component is auto-imported in Nuxt — no import needed.
- `tag` defaults to `"div"` which is block-level. Use `"span"` when the eyebrow must be inline within a flow of text.
