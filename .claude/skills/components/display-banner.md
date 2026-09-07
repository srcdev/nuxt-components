---
name: DisplayBanner
description: DisplayBanner canvas/content stacked overlay banner — props, slots, CSS tokens
type: reference
---

# DisplayBanner

## Overview

`DisplayBanner` stacks a `canvas` slot (background media) and a `content` slot (overlaid
text/CTAs) into a single grid area, so content renders on top of the canvas. Either slot may be
omitted; an unused slot contributes no empty wrapper `<div>` to the DOM.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "p" \| "span" \| "section" \| "article" \| "aside" \| "header" \| "footer" \| "main" \| "nav" \| "ul" \| "ol"` | `"div"` | Root element tag. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `canvas` | Background media (image, video, or any visual). Rendered first, so it sits behind `content`. |
| `content` | Overlaid content (text, CTAs). Rendered after `canvas`, so it sits on top. |

## Basic usage

```vue
<DisplayBanner>
  <template #canvas>
    <NuxtImg src="/hero.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
  </template>
  <template #content>
    <h2>Banner heading</h2>
  </template>
</DisplayBanner>
```

## CSS custom properties

| Property | Default | Controls |
|----------|---------|----------|
| `--display-banner-min-height` | `auto` | Minimum height of the banner |

See `CONSUMER-STYLING.md` for the full token API.

## Notes

- `container-type: inline-size` is set on the root, so slot content can use container queries.
- No sizing/aspect-ratio is imposed on the `canvas` slot's content itself (e.g. an image needs its
  own `width`/`height`/`object-fit`) — `DisplayBanner` only positions the two slots, it doesn't
  style what's inside them.
- 2026-09-07 migration: removed a dead `.canvas .image { object-fit: cover; ... }` CSS rule that
  assumed consumer-slotted content would use a generic `.image` class — nothing in the template
  ever rendered that class, and styling a generic class name inside a slot risks colliding with a
  consumer's own `.image` class (see CLAUDE.md pitfall #16). Style slotted media directly on the
  element you put in the slot instead.
