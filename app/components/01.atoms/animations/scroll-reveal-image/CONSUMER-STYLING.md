# ScrollRevealImage — Consumer Styling Guide

`ScrollRevealImage` renders a `ScrollRevealFrame` with a single `NuxtImg` inside. Frame sizing uses
the frame's own tokens; this component adds the image crop tokens.

## Public token API

### Frame (from ScrollRevealFrame)

| Token | Default | Set by prop |
|---|---|---|
| `--scroll-reveal-frame-height` | `540px` | `frameHeight` |
| `--scroll-reveal-frame-parallax-offset` | `36rem` | `parallaxOffset` |
| `--scroll-reveal-frame-radius` | `0px` | `radius` |

See `ScrollRevealFrame`'s `CONSUMER-STYLING.md` for details.

### Image crop

| Token | Default | Set by prop | Controls |
|---|---|---|---|
| `--scroll-reveal-image-focal-x` | `50%` | `focalX` | Horizontal `object-position` (which slice stays in view when the frame is narrower than the image) |
| `--scroll-reveal-image-focal-y` | `0%` | none | Vertical `object-position` while the scroll animation runs |
| `--scroll-reveal-image-focal-y-static` | `50%` | none | Vertical `object-position` when there's no animation (reduced motion, or no `animation-timeline` support) |

A prop, when passed, writes its token inline on the root `<figure>` and beats any CSS. None of the
props has a default of its own, so leave one off to control that value from CSS.

> **Changed 2026-09-27**: the horizontal crop was a private `--_focal-x`, always written inline from
> a `focalX` prop that defaulted to `50%`, so CSS could never change it. The vertical crop was
> hardcoded (`0%` animated, `50%` static) with no token at all, which pushed consumers into
> overriding `object-position` on the image directly. Both are now public tokens.

Private tokens (not public API): `--_focal-x` on the image, which resolves the public focal-x once
for the three `object-position` declarations.

## State hooks

No `data-*` attributes. Classes:

- `.scroll-reveal-frame`: the root `<figure>` (from `ScrollRevealFrame`).
- `.scroll-reveal-frame-content`: the panning wrapper (from `ScrollRevealFrame`).
- `.scroll-reveal-image`: the `<img>`.

> **Changed 2026-09-27**: `.reveal-image` → `.scroll-reveal-image` (with the frame's
> `.reveal-frame`/`.reveal-content` renames in the same release).

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** `frameHeight`, `parallaxOffset`, `radius` and `focalX`, when passed, are written inline
on the root and override their tokens. To drive one from CSS, don't pass its prop.

## Recipe: different crop on small screens

```css
.welcome {
  --scroll-reveal-image-focal-y: 40%;

  @media (width >= 768px) {
    --scroll-reveal-image-focal-y: 0%;
  }
}
```

## Class passthrough

`style-class-passthrough` is forwarded to `ScrollRevealFrame` and lands on the root `<figure>`,
not the image. Reachable in normal use.
