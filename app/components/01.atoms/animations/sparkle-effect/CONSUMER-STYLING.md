# SparkleEffect — Consumer Styling Guide

## Public token API

| Token | Default | Description |
|---|---|---|
| `--sparkle-effect-colour` | `var(--theme-border)` | Glow colour, and the base hue the sparkles shift from. With relative colour support each sparkle is a lightened, hue-shifted version of it; without, they use it as-is. |
| `--sparkle-effect-size` | `0.7rem` | Width of one sparkle arm (each arm is 1:3, and each sparkle scales this by its preset). |
| `--sparkle-effect-blur` | `1px` | Blur on each sparkle. `0` gives crisp sparkles; the original pen used `3px`. |
| `--sparkle-effect-duration` | `1.5s` | Base travel time; each sparkle multiplies it by its own speed. |
| `--sparkle-effect-radius` | `100vw` | Corner shape of the path the sparkles follow and of the glow. Match the slotted element's radius. Also set by the `radius` prop. |
| `--sparkle-effect-glow-blur` | `1.2rem` | Blur of the glow behind the slot. |
| `--sparkle-effect-glow-opacity` | `0.5` | Glow opacity while active. |

Private tokens, not public API: `--_sparkle-effect-colour` (the resolved colour) and the per-sparkle
`--_sparkle-effect-spark-*` values (colour, scale, translate, offset, speed, timing), which
the component writes inline on each sparkle from its preset table.

## State hooks

| Selector | Meaning |
|---|---|
| `.sparkle-effect` | Root element (`span` or `div`, per `tag`). |
| `.sparkle-effect::before` | The glow, behind the slot. |
| `.sparkle-effect-sparks` | `aria-hidden` layer holding the sparkles, over the slot. |
| `.sparkle-effect-spark` | One sparkle. |
| `.sparkle-effect[data-continuous]` | Set by the `continuous` prop: sparkles loop while active. |

The effect runs on `.sparkle-effect:hover` and when anything inside has `:focus-visible`. It's
suppressed while the slotted element (direct child) is `:disabled` or `[aria-disabled="true"]`.

## Motion and browser support

- Sparkles travel along the wrapper's border box with `offset-path: border-box`. They render only
  where that's supported (Chrome 116+, Safari 17.2+, Firefox 122+). Elsewhere, including Safari
  16, the glow still works.
- Under `prefers-reduced-motion: reduce` the sparkles are hidden and only the glow fades in.
- Sparkles start at the top-left of the path and snap back when the pointer leaves, so each hover
  replays the effect. With `continuous`, each sparkle loops instead (`sparkle-effect-travel` keyframes:
  travel, drift and fade in one), at its own speed, until the hover or focus ends.

## Shape

The wrapper shrinks to its slot (`inline-grid` for `span`, `grid` for `div`) and can't read the
slotted element's own `border-radius`, so set `--sparkle-effect-radius` (or `radius`) to match it:
the default `100vw` suits pill buttons, a card might need `1.2rem`, a round icon button `50%`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the `radius` prop writes `--sparkle-effect-radius` inline on the root, so when it's set
an ancestor's value for that token never lands.

## Class passthrough

`styleClassPassthrough` adds classes to the root, for sizing or placing the wrapper (e.g.
`inline-size: 100%` around a full-width card) or for setting the tokens above on one instance.

```vue
<SparkleEffect style-class-passthrough="promo-sparkle">
  <InputButton button-text="Join the waitlist" is-pill />
</SparkleEffect>
```

```css
.promo-sparkle {
  --sparkle-effect-colour: hsl(260 80% 70%);
  --sparkle-effect-duration: 2s;
}
```
