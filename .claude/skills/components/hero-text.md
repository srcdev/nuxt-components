# HeroText Component

## Overview

`HeroText` renders a styled heading with support for mixed text styling (normal/accent segments), configurable font size, layout axis, and an optional icon. It uses Playfair Display font with italic variation for accent segments.

## Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `tag` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | — | yes |
| `textContent` | `TextConfig[]` | — | yes |
| `id` | `string` | `undefined` | no |
| `axis` | `"horizontal" \| "vertical"` | `"horizontal"` | no |
| `fontSize` | `"display" \| "title" \| "heading" \| "subheading" \| "label"` | `"title"` | no |
| `icon` | `string` | `undefined` | no |
| `styleClassPassthrough` | `string \| string[]` | `[]` | no |

### TextConfig

```ts
interface TextConfig {
  text: string;
  styleClass?: "normal" | "accent";
}
```

- `"normal"` — default unstyled text
- `"accent"` — italic, coloured with `--colour-text-accent`

## Basic Usage

```vue
<HeroText
  tag="h1"
  :textContent="[
    { text: 'Designing', styleClass: 'normal' },
    { text: 'Artistry', styleClass: 'accent' },
    { text: 'at Home', styleClass: 'normal' },
  ]"
/>
```

## With Icon

`icon` accepts any icon name from `@nuxt/icon` (e.g. Iconify identifiers).

```vue
<HeroText
  tag="h2"
  icon="lucide:sparkles"
  fontSize="heading"
  :textContent="[{ text: 'Featured', styleClass: 'accent' }]"
/>
```

## Vertical Axis

Use `axis="vertical"` to stack text segments in a column instead of a row.

```vue
<HeroText
  tag="h1"
  axis="vertical"
  fontSize="display"
  :textContent="[
    { text: 'Modern', styleClass: 'normal' },
    { text: 'Living', styleClass: 'accent' },
  ]"
/>
```

## Font Size Scale

| Value | CSS variable |
|-------|-------------|
| `display` | `--hero-text-display` |
| `title` | `--hero-text-title` |
| `heading` | `--hero-text-heading` |
| `subheading` | `--hero-text-subheading` |
| `label` | `--hero-text-label` |

Define these CSS custom properties in your consuming app to control sizes.

## Styling

Override via `styleClassPassthrough` or a parent HOC `<style>` block targeting `.hero-text`.

Key CSS custom properties:
- `--colour-text-accent` — colour applied to `.accent` spans and the icon
- `--hero-text-{scale}` — font size per scale value

## Notes

- Text segments are trimmed and a trailing space is automatically appended between segments in horizontal axis — do not manually pad `text` values.
- The icon is sized to match the font size. At `subheading` scale it is explicitly capped at `0.75 * --hero-text-subheading`.
- Component is auto-imported in Nuxt — no import needed.
