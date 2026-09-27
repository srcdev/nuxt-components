# ScrollRevealFrame — Consumer Styling Guide

## Public token API

| Token | Default | Set by prop | Controls |
|---|---|---|---|
| `--scroll-reveal-frame-height` | `540px` | `frameHeight` | Height of the visible clipping frame |
| `--scroll-reveal-frame-parallax-offset` | `36rem` | `parallaxOffset` | How much taller the content is than the frame, and so how far it travels |
| `--scroll-reveal-frame-radius` | `0px` | `radius` | Frame `border-radius` (content is clipped to it) |

Each prop, when passed, writes its token as an inline style on the root `<figure>`, which beats any
CSS you set. Leave the prop off to control the value from CSS instead (e.g. per breakpoint). Props
have no default of their own; the defaults above live in the CSS.

> **Changed 2026-09-27**: these were private `--_frame-height`/`--_parallax-offset`/`--_radius`
> tokens, always written inline from props that had defaults. Any CSS override (including the
> responsive example the skill doc used to recommend) could never win against the inline style.
> They're now public tokens, and the props only write them when passed.

Private tokens (not public API): `--_parallax-offset` on `.scroll-reveal-frame-content`, which
resolves the public offset once for both the content height and the keyframes.

## State hooks

No `data-*` attributes. Inner elements:

- `.scroll-reveal-frame`: the root `<figure>` (clipping window, `overflow: hidden`, `margin: 0`).
- `.scroll-reveal-frame-content`: the taller wrapper that pans; slot content fills it.

> **Changed 2026-09-27**: renamed from the generic `.reveal-frame`/`.reveal-content`. The keyframes
> (`scroll-reveal-frame-pan`) and view timeline (`--scroll-reveal-frame-timeline`) were renamed to
> match.

## Motion

Driven by a CSS scroll-driven animation (`view-timeline` on the frame, `animation-timeline` on the
content), running from the frame entering the viewport to it leaving. The content moves up by the
parallax offset over that range. No JavaScript.

Under `prefers-reduced-motion: reduce`, and in browsers without `animation-timeline` support, the
animation is removed and the content is sized to the frame (a static crop).

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** a prop you pass is written inline on the root and overrides these tokens, whether set on
an ancestor or on the frame itself. To drive a value from CSS, don't pass its prop.

## Recipe: responsive frame

```css
.welcome {
  --scroll-reveal-frame-height: 320px;
  --scroll-reveal-frame-parallax-offset: 20rem;

  @media (width >= 768px) {
    --scroll-reveal-frame-height: 540px;
    --scroll-reveal-frame-parallax-offset: 36rem;
  }
}
```

```vue
<section class="welcome">
  <ScrollRevealFrame radius="1.6rem">...</ScrollRevealFrame>
</section>
```

## Class passthrough

`style-class-passthrough` adds classes to the root `<figure class="scroll-reveal-frame">`. It's
reachable in normal use and is the simplest place to set the tokens for one instance.
