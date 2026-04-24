---
name: GridStack
description: GridStack CSS Grid z-axis stacking component — slot API, z-order rules, sizing behaviour, consumer patterns (video+overlay, image+text)
type: reference
---

# GridStack

## Overview

`GridStack` stacks slot content in the z-axis using a single `grid-template-areas: "stack"` — no `position: absolute` needed. Every slot is wrapped in a `.grid-stack__layer` div sharing that grid area. The container sizes itself from the tallest layer; all layers stretch to fill that height.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "main"` | `"div"` | HTML element rendered as the root. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slot API

Any named slot is accepted — there are no declared slot names. Convention is `layer-1`, `layer-2`, `layer-3` etc., but any name works. The component iterates `$slots` and wraps each in a `.grid-stack__layer`.

**Z-order rule: DOM order = z-order. The last slot is on top.**

```vue
<GridStack>
  <template #layer-1><!-- base, behind everything --></template>
  <template #layer-2><!-- middle --></template>
  <template #layer-3><!-- on top --></template>
</GridStack>
```

## Basic usage

```vue
<GridStack>
  <template #layer-1>
    <img src="/images/hero.jpg" alt="" />
  </template>
  <template #layer-2>
    <div class="hero-overlay">
      <h1>Heading over image</h1>
    </div>
  </template>
</GridStack>
```

## Common patterns

### Video background + overlay

```vue
<GridStack>
  <template #layer-1>
    <BannerVideo
      src="/videos/hero.mp4"
      poster="/images/hero-poster.jpg"
      alt=""
      depth="lg"
    />
  </template>
  <template #layer-2>
    <div class="video-overlay">
      <h1>Content over video</h1>
    </div>
  </template>
</GridStack>
```

### Decorative background + content

```vue
<GridStack tag="section">
  <template #layer-1>
    <div class="decorative-bg" aria-hidden="true"></div>
  </template>
  <template #layer-2>
    <div class="section-content">
      <p>Real content here</p>
    </div>
  </template>
</GridStack>
```

## Sizing

The container height is determined by the tallest child layer. All layers stretch to match. If layers have different intrinsic heights, the shorter ones will stretch — use `align-self` on the layer's inner content to control vertical position within the stretched space.

To pin the stack to a fixed height, set it on the root from the consuming page:

```css
.my-page {
  .grid-stack {
    block-size: 60rem;
  }
}
```

## CSS classes

| Class | Element |
|---|---|
| `.grid-stack` | Root element |
| `.grid-stack__layer` | Wrapper div around each slot — all share `grid-area: stack` |

## Consumer styling

No `:deep()` needed — `@layer components` means page styles win automatically.

```vue
<style>
.my-page {
  .grid-stack {
    border-radius: 1.2rem;
    overflow: hidden; /* clips layers to rounded corners */
  }

  /* Style the overlay layer by targeting content inside it */
  .my-overlay {
    display: grid;
    place-items: center;
    pointer-events: none; /* let clicks through to the layer below */
  }
}
</style>
```

## Notes

- `pointer-events: none` on overlay layers (and `pointer-events: auto` on interactive children within them) is the standard pattern for overlays that shouldn't block interaction with layers behind them.
- There is no built-in `z-index` — stacking is handled purely by DOM order. If a consumer applies `z-index` on a layer for other reasons, be aware it creates a new stacking context.
- The slot name is used as the Vue `:key` on the layer wrapper, so slot names must be unique.
