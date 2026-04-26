# CarouselFlip

## Overview

A FLIP-animated carousel that reorders items in the DOM using CSS `order` and animates transitions with the FLIP technique (First, Last, Invert, Play). Supports swipe, keyboard navigation, and marker dots. The prev/next buttons and controls bar can be placed in several layouts via a single prop.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `carouselDataIds` | `string[]` | `[]` | Ordered list of unique IDs — each becomes a named slot |
| `transitionSpeed` | `number` | `200` | Animation duration in ms |
| `allowCarouselOverflow` | `boolean` | `false` | Allows peeking items outside the container bounds |
| `useFlipAnimation` | `boolean` | `false` | Enables FLIP reorder animation on prev/next |
| `useSpringEffect` | `boolean` | `false` | Uses spring easing (`var(--spring-easing)`) instead of `ease` |
| `buttonLayout` | `"sides" \| "controls-flanking" \| "controls-grouped-right" \| "overlay"` | `"sides"` | Controls placement of prev/next buttons relative to the carousel frame and controls bar |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes applied to the root element |

## Slot API

Each string in `carouselDataIds` becomes a named slot. Pass content for each item by matching the slot name to the ID:

```vue
<CarouselFlip :carousel-data-ids="['item-a', 'item-b', 'item-c']">
  <template #item-a>
    <img src="/a.jpg" alt="A" />
  </template>
  <template #item-b>
    <img src="/b.jpg" alt="B" />
  </template>
  <template #item-c>
    <img src="/c.jpg" alt="C" />
  </template>
</CarouselFlip>
```

A common pattern is to derive both `carouselDataIds` and the slot loop from the same data array:

```vue
<CarouselFlip :carousel-data-ids="items.map(i => i.id)">
  <template v-for="item in items" :key="item.id" #[item.id]>
    <div>{{ item.title }}</div>
  </template>
</CarouselFlip>
```

## Button layout variants

Set via `:button-layout`. The component renders on a CSS grid with named areas:

```text
"prev  carousel  next"   ← row 1 (1fr)
".     controls  .   "   ← row 2 (auto)
```

| Value | Behaviour |
|---|---|
| `"sides"` | Default. Prev/next buttons occupy the `prev`/`next` areas in row 1, vertically centred on the carousel frame |
| `"controls-flanking"` | Buttons move to row 2 — prev left of markers, next right of markers |
| `"controls-grouped-right"` | Single-column grid; buttons share the `controls` grid area with `justify-self: end`, markers remain centred |
| `"overlay"` | Markers bar overlaid at the bottom edge of the carousel frame (row 2 collapses); buttons remain on sides |

The variant is applied via a `data-button-layout` attribute on the root, so consumers can also switch layouts with CSS alone:

```css
.my-wrapper .carousel-flip {
  /* force overlay layout regardless of prop */
  &[data-button-layout] {
    .controls-container {
      grid-area: carousel;
      align-self: end;
      z-index: 1;
    }
  }
}
```

## CSS custom properties

Override these on `.carousel-flip` (or a wrapper) to control sizing:

| Property | Purpose |
|---|---|
| `--_carousel-item-track-gap` | Gap between carousel items (default `10px`) |
| `--_carousel-container-max-inline-size` | Max width of the visible carousel window |
| `--_carousel-item-edge-preview-width` | How much of adjacent items to reveal (edge peek). Keep at `2× --_carousel-item-track-gap` |
| `--_carousel-display-max-width` | Max width of the whole component inc. controls |

## HTML structure

```text
section.carousel-flip               ← grid root, data-button-layout="..."
  div.item-container                ← grid-area: carousel — flex row of items
    div.item[data-id]               ← one per carouselDataIds entry
  div.controls-container            ← grid-area: controls — markers bar
    div.markers-container
      ul.markers-list
        li.markers-item
          button.btn-marker
  div.buttons-container             ← display: contents by default (transparent to grid)
    button.btn-action.btn-prev      ← grid-area: prev (row 1, col 1)
    button.btn-action.btn-next      ← grid-area: next (row 1, col 3)
```

`buttons-container` uses `display: contents` so `.btn-prev`/`.btn-next` participate directly in the parent grid. In the `controls-grouped-right` variant the component sets `display: flex` on it, making it the grid child instead.

## Consumer styling example

```vue
<CarouselFlip
  :carousel-data-ids="ids"
  :allow-carousel-overflow="true"
  :use-flip-animation="true"
  button-layout="overlay"
  :style-class-passthrough="['my-carousel']"
>
  ...
</CarouselFlip>
```

```css
.my-carousel.carousel-flip {
  --_carousel-item-track-gap: 16px;
  --_carousel-container-max-inline-size: 900px;
  --_carousel-item-edge-preview-width: 32px;

  .item {
    border-radius: 1.2rem;
    overflow: hidden;
  }

  .controls-container {
    gap: 16px;
    padding-inline: 2rem;
  }

  .btn-marker {
    width: 10px;
    height: 10px;
    border-radius: 100vw;
    background: oklch(70% 0 0);

    &.active {
      background: white;
    }
  }

  .btn-action {
    padding: 10px;
    background: oklch(0% 0 0 / 0.4);
    border: none;
    color: white;
  }
}
```

## Notes

- **Opacity fade-in**: The root starts at `opacity: 0` and gets `.mounted` (opacity 1) after `initialSetup()` completes. This prevents a flash of unstyled layout on mount.
- **z-index**: `.btn-prev`/`.btn-next` have `z-index: 1` to sit above `.item-container` which uses `isolation: isolate` (carousel items are translated and can overlap the button columns).
- **ResizeObserver**: `initialSetup()` re-runs on resize to recalculate item widths. CSS `translate` on `.item` is driven by the measured `itemWidth` via `v-bind`.
- **Spring easing**: `useSpringEffect` switches to `var(--spring-easing)`. Make sure this custom property is defined in your theme or global CSS when enabling it.
