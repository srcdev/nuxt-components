# CarouselFlip

## Overview

A FLIP-animated carousel that reorders items in the DOM using CSS `order` and animates transitions with the FLIP technique (First, Last, Invert, Play). Supports swipe, keyboard navigation, and marker dots. The prev/next buttons and controls bar can be placed in several layouts via a single prop.

---

## Implementation guide

When a dev asks to implement CarouselFlip, work through the following questions before writing any code. Each answer maps directly to a prop or CSS decision. You do not need to ask all questions at once — use context clues where the answer is obvious.

### Step 1 — Data source

Ask: **"Where is the carousel data coming from — a static array, an API, or a Nuxt `useFetch`?"**

- **Static array**: Define `carouselDataIds` directly as a `const`.
- **API / useFetch**: Derive `carouselDataIds` as a `computed` from the response. Gate the component with `v-if="status === 'success'"` to avoid a flash of empty slots.

```vue
<!-- API pattern -->
const { data, status } = await useFetch<MyType>("/api/items");
const carouselDataIds = computed(() => data.value?.items.map(i => i.id) ?? []);

<CarouselFlip v-if="status === 'success'" :carousel-data-ids="carouselDataIds">
  <template v-for="item in data.items" :key="item.id" #[item.id]>
    <!-- slot content -->
  </template>
</CarouselFlip>
```

### Step 2 — Button layout

Ask: **"Where should the prev/next buttons sit?"** Show these options:

| Value | Visual description |
|---|---|
| `"sides"` | Buttons float on the left and right edges of the carousel frame, centred vertically — the classic look |
| `"controls-flanking"` | Buttons move down into the controls row: prev · markers · next |
| `"controls-grouped-right"` | Markers stretch left, both buttons grouped together at the far right of the controls row |
| `"overlay"` | Buttons stay on the sides; the markers bar overlays the bottom edge of the carousel frame |

Set via `:button-layout="..."`. Default is `"sides"`.

### Step 3 — Show or hide the markers bar

Ask: **"Do you want the dot/marker navigation bar visible?"**

- **Yes** (default): omit the prop or pass `:show-controls="true"`.
- **No**: pass `:show-controls="false"`. The element is fully removed from the DOM — no layout space, no keyboard listener.

> If `showControls` is false and `buttonLayout` is `"controls-flanking"` or `"controls-grouped-right"`, the controls row collapses entirely — only the buttons remain. Recommend switching `buttonLayout` to `"sides"` or `"overlay"` in that case.

### Step 4 — Edge peek (overflow)

Ask: **"Should adjacent carousel items peek in from the sides?"**

- **No peek** (default): `:allow-carousel-overflow="false"` — clean, contained look.
- **Peek visible**: `:allow-carousel-overflow="true"` — items bleed slightly out of the container. Requires CSS custom properties to control how much:

```css
.my-carousel.carousel-flip {
  --_carousel-item-track-gap: 16px;
  --_carousel-item-edge-preview-width: 32px; /* keep at 2× track-gap */
  --_carousel-container-max-inline-size: 900px;
}
```

### Step 5 — Animation style

Ask: **"What animation feel are you going for?"**

| Prop | Effect |
|---|---|
| `:use-flip-animation="false"` (default) | Slides — items translate horizontally |
| `:use-flip-animation="true"` | FLIP reorder — items swap position with a physics-aware delta animation |
| `:use-spring-effect="true"` | Adds spring easing to FLIP transitions. Requires `var(--spring-easing)` in the theme |
| `:transition-speed="400"` | Duration in ms. Default `200`. Recommended range: `200`–`1200` |

### Step 6 — Minimal working implementation

Once the above decisions are made, assemble the component:

```vue
<CarouselFlip
  :carousel-data-ids="carouselDataIds"
  :allow-carousel-overflow="true"
  :transition-speed="600"
  :use-flip-animation="true"
  :use-spring-effect="false"
  button-layout="sides"
  :show-controls="true"
  :style-class-passthrough="['my-carousel']"
>
  <template v-for="item in items" :key="item.id" #[item.id]>
    <div class="my-carousel__item">
      <!-- item content -->
    </div>
  </template>
</CarouselFlip>
```

### Step 7 — Style the component

Always scope overrides using `styleClassPassthrough` + a page/section wrapper class. Required tokens for a usable carousel:

```css
.my-carousel.carousel-flip {
  --_carousel-item-track-gap: 16px;
  --_carousel-container-max-inline-size: 900px;
  --_carousel-item-edge-preview-width: 32px; /* 2× track-gap when overflow is on */

  /* Items */
  .item {
    border-radius: 1.2rem;
    overflow: hidden;
  }

  /* Markers */
  .btn-marker {
    width: 10px;
    height: 10px;
    border-radius: 100vw;
    background: oklch(70% 0 0);

    &.active { background: white; }
  }

  /* Prev/next buttons */
  .btn-action {
    padding: 10px;
    background: oklch(0% 0 0 / 0.4);
    border: none;
    border-radius: 100vw;
    color: white;
  }
}
```

---

## Props reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `carouselDataIds` | `string[]` | `[]` | Ordered list of unique IDs — each becomes a named slot |
| `transitionSpeed` | `number` | `200` | Animation duration in ms |
| `allowCarouselOverflow` | `boolean` | `false` | Allows peeking items outside the container bounds |
| `useFlipAnimation` | `boolean` | `false` | Enables FLIP reorder animation on prev/next |
| `useSpringEffect` | `boolean` | `false` | Uses spring easing (`var(--spring-easing)`) instead of `ease` |
| `buttonLayout` | `"sides" \| "controls-flanking" \| "controls-grouped-right" \| "overlay"` | `"sides"` | Controls placement of prev/next buttons relative to the carousel frame and controls bar |
| `showControls` | `boolean` | `true` | Show or hide the markers/controls bar. When `false` the element is removed from the DOM; `controlsContainerRef` becomes null and its keyboard listener detaches automatically |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Classes applied to the root element |

## CSS custom properties

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
  div.controls-container            ← grid-area: controls — markers bar (v-if="showControls")
    div.markers-container
      ul.markers-list
        li.markers-item
          button.btn-marker
  div.buttons-container             ← display: contents by default (transparent to grid)
    button.btn-action.btn-prev      ← grid-area: prev (row 1, col 1)
    button.btn-action.btn-next      ← grid-area: next (row 1, col 3)
```

`buttons-container` uses `display: contents` so `.btn-prev`/`.btn-next` participate directly in the parent grid. In the `controls-grouped-right` variant the component sets `display: flex` on it, making it the grid child instead.

## Notes

- **Opacity fade-in**: The root starts at `opacity: 0` and gets `.mounted` (opacity 1) after `initialSetup()` completes. This prevents a flash of unstyled layout on mount.
- **z-index**: `.btn-prev`/`.btn-next` have `z-index: 1` to sit above `.item-container` which uses `isolation: isolate` (carousel items are translated and can overlap the button columns).
- **ResizeObserver**: `initialSetup()` re-runs on resize to recalculate item widths. CSS `translate` on `.item` is driven by the measured `itemWidth` via `v-bind`.
- **Spring easing**: `useSpringEffect` switches to `var(--spring-easing)`. Make sure this custom property is defined in your theme or global CSS when enabling it.
- **buttonLayout + showControls combo**: `"controls-flanking"` and `"controls-grouped-right"` place buttons in the controls row. If `showControls` is false that row collapses — use `"sides"` or `"overlay"` instead.
