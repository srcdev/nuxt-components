# MarqueeScroller — Consumer Styling Guide

## Public token API

### Region

| Token | Default | Controls |
|---|---|---|
| `--marquee-scroller-fade-width` | `10%` | Width of the transparent fade at each edge of the track (`mask-image`) |
| `--marquee-scroller-focus-outline-width` | `2px` | Outline width on the root region and the control button when keyboard-focused |
| `--marquee-scroller-focus-outline-colour` | `var(--theme-ring)` | Outline colour on the same two focus states |
| `--marquee-scroller-focus-outline-offset` | `2px` | Outline offset on the same two focus states |

### Items

| Token | Default | Controls |
|---|---|---|
| `--marquee-scroller-group-hover-filter` | `grayscale(1)` | Filter applied to every item when the pointer hovers anywhere over the scroller |
| `--marquee-scroller-item-hover-filter` | `grayscale(0)` | Filter applied to a single item when it is individually hovered (overrides the group filter for that item) |
| `--marquee-scroller-item-transition-duration` | `0.5s` | Transition duration for the item hover filter change |
| `--marquee-scroller-item-border-width` | `1px` | Item border width |
| `--marquee-scroller-item-border-colour` | `var(--slate-10)` | Item border colour |
| `--marquee-scroller-item-border-radius` | `4px` | Item border radius |

### Control button

| Token | Default | Controls |
|---|---|---|
| `--marquee-scroller-control-offset` | `8px` | Distance of the pause/play button from the top and end edges |
| `--marquee-scroller-control-background-colour` | `rgba(0, 0, 0, 0.7)` | Pause/play button background |
| `--marquee-scroller-control-background-colour-hover` | `rgba(0, 0, 0, 0.9)` | Pause/play button background on hover |
| `--marquee-scroller-control-text-colour` | `white` | Pause/play button icon colour |
| `--marquee-scroller-control-border-radius` | `4px` | Pause/play button border radius |
| `--marquee-scroller-control-padding` | `8px` | Pause/play button padding |
| `--marquee-scroller-control-font-size` | `14px` | Pause/play button icon font size |
| `--marquee-scroller-control-transition-duration` | `0.2s` | Pause/play button background-colour transition duration |
| `--marquee-scroller-control-border-width` | `1px` | Pause/play button border width under `prefers-contrast: high`. The border colour itself stays the system `ButtonText` keyword, see below. |

Private tokens (not public API): `--_fade-width`, `--_focus-outline` (width + colour, shared by
both focus states) and `--_track-shift` (the loop distance, computed from `itemConfig`).

---

## State hooks

The root `.marquee-scroller` carries:

| Attribute | When |
|---|---|
| `data-paused` | The track is paused (control button, spacebar, focus inside, or reduced motion) |
| `data-reverse` | `reverse` is `true` |
| `data-reduced-motion` | The user prefers reduced motion and `respect-reduced-motion` is on |

Inner elements: `.marquee-scroller-track` (the animated row), `.marquee-scroller-group` (one copy
of the items; the second is `aria-hidden` and `inert`), `.marquee-scroller-item` (one fixed-size
item box), `.marquee-scroller-control` (the pause/play `InputButton`) and
`.marquee-scroller-description` (the visually hidden instructions).

> **Changed 2026-10-17**: the generic class names were renamed so they can't collide with consumer
> CSS. `.item` → `.marquee-scroller-item`, `.control-btn` → `.marquee-scroller-control` (now an
> `InputButton`, so it also has `.input-button`), `.marquee-track` → `.marquee-scroller-track`,
> `.marquee-group` → `.marquee-scroller-group`, `.sr-only` → `.marquee-scroller-description`. The
> bare state classes became attributes: `.reverse` → `[data-reverse]`, `.paused` →
> `[data-paused]`, `.reduced-motion` → `[data-reduced-motion]`. The keyframes are now
> `marquee-scroller-move` (was `marqueeMove`).

---

## High-contrast mode colours are not tokenised

Under `prefers-contrast: high`, the control button switches to the system colour keywords
`ButtonFace`/`ButtonText` rather than the component's own background/text tokens. These aren't
exposed as overridable tokens on purpose: they track the user's OS-level high-contrast theme, which
a component-level override would defeat. Only the border *width* in that mode is a token
(`--marquee-scroller-control-border-width`), since it's a plain dimension with no such constraint.

---

## Item size and spacing are prop-driven, not tokens

Item `width`/`height`/`gap` and the animation duration are set via the `itemConfig` and
`animationRuntime` props (not CSS custom properties), since they also drive the component's own
loop math (`--_track-shift`) and the repeat measurement. Override those through props:

```vue
<MarqueeScroller
  :item-config="{ width: '80px', height: '80px', gap: '24px' }"
  animation-runtime="60s"
/>
```

Item boxes are a fixed size. Text in an item wraps (`overflow-wrap: anywhere`), but content taller
than `itemConfig.height` overflows, so size slot content to the box.

---

## Global theming

```css
:where(html) {
  --marquee-scroller-fade-width: 15%;
  --marquee-scroller-item-border-colour: var(--slate-04);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

```css
.partners-section {
  --marquee-scroller-item-border-colour: #b5651d;
  --marquee-scroller-control-background-colour: #1a1a1a;
  --marquee-scroller-fade-width: 20%;
}
```

---

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root `.marquee-scroller`
region.

---

## Notes

- Item content and the control button's icon and copy are covered in the skill doc
  (`marquee-scroller.md`): one slot per `marqueeData` id, `toggle-icon` slot, and the
  `playIcon`/`pauseIcon`/`playLabel`/`pauseLabel` props.
