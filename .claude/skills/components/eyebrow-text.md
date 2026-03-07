# EyebrowText Component

## Overview

`EyebrowText` renders a short uppercase label — typically used above a heading to provide context or categorisation. It outputs a single string with configurable tag, size, and colour via CSS custom properties.

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

## Notes

- Component is auto-imported in Nuxt — no import needed.
- `tag` defaults to `"div"` which is block-level. Use `"span"` when the eyebrow must be inline within a flow of text.
