---
name: SectionParallax
description: SectionParallax CSS fixed-background parallax section — props, browser support, iOS Safari limitation, when to use vs ScrollRevealImage
type: reference
---

# SectionParallax

## Overview

`SectionParallax` is a full-width section that uses CSS `background-attachment: fixed` to create a parallax scrolling effect — the background image stays stationary while the page content scrolls over it. The effect is implemented with `@supports (background-attachment: fixed)` so it degrades gracefully.

**Important browser limitation:** `background-attachment: fixed` does not work on iOS Safari (and mobile Chrome on iOS). On those browsers the background renders as a static image with no parallax motion. Use `SectionParallax` for atmospheric/decorative breaks where this is an acceptable trade-off. For cross-browser scroll-driven parallax, use `ScrollRevealImage` or `ScrollRevealFrame` instead.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "aside"` | `"div"` | HTML element rendered as the root. |
| `backgroundImage` | `string` | `undefined` | Path to the background image. Bound as `url("...")` via `v-bind`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Optional content rendered inside the section. Often left empty — the component is typically used as a purely decorative atmospheric break. |

## Basic usage — decorative atmospheric break

```vue
<SectionParallax
  tag="section"
  background-image="/images/eucalyptus-lavender-and-oil.jpg"
/>
```

## With overlay content

```vue
<SectionParallax
  tag="section"
  background-image="/images/candle-and-stones.jpg"
  :style-class-passthrough="['has-overlay']"
>
  <div class="overlay-text">
    <p>A quiet moment.</p>
  </div>
</SectionParallax>
```

## How it works

The component sets:
- `background-image: url(...)` via `v-bind`
- `background-position: center`
- `background-size: inherit` (fallback when fixed is not supported)
- `min-height: 120vh`
- `background-color: light-dark(var(--slate-01), var(--slate-08))` (visible if image fails to load)

Inside `@supports (background-attachment: fixed)`:
- `background-attachment: fixed` — pins the image to the viewport
- `background-size: cover` — ensures the image fills the viewport
- `min-height: 120vh` — ensures enough scroll travel to see the parallax motion

## Controlling height

Override `min-height` with a consuming-page style:

```css
.my-page {
  .section-parallax {
    min-height: 60vh; /* shorter atmospheric break */
  }
}
```

## Browser support

| Browser | Support |
|---------|---------|
| Chrome / Edge (desktop) | ✅ Full parallax |
| Firefox (desktop) | ✅ Full parallax |
| Safari (desktop) | ✅ Full parallax |
| iOS Safari | ❌ Static background (no parallax) |
| Chrome on iOS | ❌ Static background (no parallax) |
| Android Chrome | ✅ Usually supported |

## When to use SectionParallax vs ScrollRevealImage

| Use case | Recommendation |
|----------|---------------|
| Atmospheric break between sections, desktop-first site | `SectionParallax` — simpler, no JS |
| Cross-browser scroll animation, mobile-first site | `ScrollRevealImage` or `ScrollRevealFrame` |
| Image with rounded corners, specific frame height | `ScrollRevealImage` |
| Image inlined within a content grid | `ScrollRevealImage` |

## Notes

- The `@supports` guard means the parallax activates only when the browser supports `background-attachment: fixed`. No JS is involved.
- Slot content is only rendered when the `default` slot is provided (`v-if="slots.default"`).
- The component has no built-in overlay or gradient — add one via the slot or a `::before` pseudo-element in your consuming-page styles.
