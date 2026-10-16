# CSS Dynamic Border Radius

## Overview

`.dynamic-border-radius` (global utility, `app/assets/styles/setup/06.utility-classes/_dynamic-border-radius.css`,
`utilities` layer) rounds an element's corners while it's narrower than its container, and squares them once it
spans the full container width. A capped-width image reads as a rounded card on wide screens and as an edge-to-edge
band on narrow ones, with no media query and no JS.

```css
.dynamic-border-radius {
  border-radius: clamp(0px, (100cqi - 100%) * 1e5, var(--dynamic-border-radius, 5rem));
}

.dynamic-border-radius-transition {
  max-inline-size: var(--dynamic-border-radius-max-width, 100%);
  border-radius: clamp(0px, (100cqi - var(--dynamic-border-radius-max-width, 100%)) * 1e5, var(--dynamic-border-radius, 5rem));

  @media (prefers-reduced-motion: no-preference) {
    transition: border-radius var(--dynamic-border-radius-duration, 300ms) var(--dynamic-border-radius-easing, ease-out);
  }
}
```

It's a utility class, not a component: it works on any element (`<img>`, `NuxtImg`, `<video>`, a card), and the
container it measures is an ancestor the element doesn't own.

Storybook: **Foundations/Utilities/Dynamic Border Radius**.

## Token

| Token | Default | Controls |
|---|---|---|
| `--dynamic-border-radius` | `5rem` | Radius while the element is narrower than its container. Set it on the element or any ancestor. |
| `--dynamic-border-radius-max-width` | `100%` | `.dynamic-border-radius-transition` only: the element's max width, as a length. Sets its `max-inline-size` and is what the container is compared against. |
| `--dynamic-border-radius-duration` | `300ms` | Transition duration, with `.dynamic-border-radius-transition`. |
| `--dynamic-border-radius-easing` | `ease-out` | Transition easing, with `.dynamic-border-radius-transition`. |

## Usage

```html
<div class="hero-media">
  <img class="dynamic-border-radius" src="/images/hero.jpg" alt="" width="1600" height="900">
</div>
```

```css
.hero-media {
  container-type: inline-size;

  img {
    display: block;
    inline-size: 100%;
    max-inline-size: 50rem;
    margin-inline: auto;
  }
}
```

## How it works

`100cqi` is the container's inline size; inside `border-radius`, `100%` is the element's own width. While the element
is narrower, the difference is positive, the `* 1e5` blows it up past the max, and `clamp()` caps it at the token.
When the element fills the container, the difference is 0 and so is the radius.

## Optional transition

Use `.dynamic-border-radius-transition` instead of the base class to ease the switch, and give it the element's max
width as a token (it sets `max-inline-size` from it, so don't also set `max-inline-size` yourself):

```html
<img class="dynamic-border-radius-transition" style="--dynamic-border-radius-max-width: 50rem" src="/images/hero.jpg" alt="" width="1600" height="900">
```

- **Why a different formula.** Don't just add a `transition` to the base class: it flickers while the container
  shrinks. A transition starts from the old *computed* value, where `100cqi` is already pixels (the previous
  frame's container width) but `100%` stays unresolved until layout, so it's re-evaluated against this frame's,
  smaller, element width. Previous container minus current element is positive, `* 1e5` clamps it to the full
  radius, and every resize frame restarts a transition from there. Comparing against a length token instead makes
  the computed value a plain length (full radius or 0): nothing changes while you resize either side of the
  threshold, and crossing it starts exactly one transition.
- **Without the token** it falls back to `100%`: the base formula, so it works but flickers on resize.
- **The token must match the element's real max width**, as a single length (`50rem`, not `min(50rem, 90%)`). If
  something else caps the element narrower (a consumer `max-inline-size`, a small intrinsic image size), the radius
  stays at 0 even though the element doesn't fill the container.
- It sets `transition`, which replaces any transition already on the element (the utilities layer beats
  `@layer components`). If the element needs its own transition too, add `border-radius` to your own combined
  `transition` instead (`transform 200ms, border-radius 300ms ease-out`).
- It only animates when the **container** resizes. If only the token changes (at a breakpoint), the value changes
  too, so that animates as well; an image loading doesn't affect it.
- The transition is skipped under `prefers-reduced-motion: reduce`; the radius still switches.

## Caveats

1. **It needs a `container-type: inline-size` ancestor.** Without one, `cqi` falls back to the viewport, so the
   radius only drops when the element is as wide as the screen. It doesn't error; it just looks wrong. Put the
   container on the element's direct layout wrapper: if the nearest container is wider than the element's real
   column, the element never "fills" it.
2. **It works partly by luck. Don't split it into horizontal and vertical radii.** The single value sets both radii, and
   the vertical one resolves `100%` against the element's *height*, so at full width it's usually still at the max.
   The corner is square anyway, because CSS draws a square corner when either radius is 0. A `border-radius: X / Y`
   rewrite, or a percentage max, can break this.
3. **The element must actually reach full width.** Give an image `display: block; inline-size: 100%` plus a
   `max-inline-size`. With only a max, an image whose intrinsic width is smaller than the container (a `w=400` CDN
   URL, for example) never fills it, so the radius never drops.
4. **Subpixel widths.** A 500.4px container around a 500px element keeps the radius on. That's correct (it isn't
   full width), but it can look like the switch is late at fractional zoom levels.
5. **Support:** container query units and `clamp()` with mixed units work in Safari 16, the layer's support
   baseline.

## Snippet

`.vscode/srcdev-utility-dynamic-border-radius.code-snippets`: `srcdev-dynamic-border-radius` (markup with the
container wrapper, transition class as an optional placeholder) and `srcdev-dynamic-border-radius-css` (the wrapper and image rules).
