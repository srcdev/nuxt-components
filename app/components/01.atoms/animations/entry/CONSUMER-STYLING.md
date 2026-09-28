# EntryAnimation — Consumer Styling Guide

## Public token API

None. EntryAnimation has no `<style>` block and no `--entry-animation-*` tokens. It only applies
one of the shared animation utility classes; the keyframes, scroll timeline and
`prefers-reduced-motion` guard live in
`app/assets/styles/setup/06.utility-classes/animations/`, which don't expose tokens either.

No private `--_` tokens.

---

## State hooks

| Class | When |
|---|---|
| `.entry-slide-in` | `animation-type="entry-slide-in"` (default) and `skip-animation` is off |
| `.entry-zoom-reveal` | `animation-type="entry-zoom-reveal"` and `skip-animation` is off |
| `.entry-exit-blur` | `animation-type="entry-exit-blur"` and `skip-animation` is off |

With `skip-animation`, none of these is applied. The root has no class of its own beyond these and
any passthrough classes.

> Changed 2026-09-27: the animation class used to be added once at setup, so changing
> `animation-type` or `skip-animation` after mount left the old class in place. It's now bound
> reactively.

---

## Motion

- All three classes only animate inside `@media (prefers-reduced-motion: no-preference)`.
- They use `animation-timeline: view(...)` (scroll-driven). In a browser without scroll-driven
  animation support the animation completes immediately, so the content just appears in place.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** there are no tokens to set. To change the motion (distance, timeline range), override
the utility class's `animation`/`animation-timeline` on your own passthrough class, inside the
same `prefers-reduced-motion: no-preference` guard:

```css
@media (prefers-reduced-motion: no-preference) {
  .my-card.entry-slide-in {
    animation-timeline: view(60% 10%);
  }
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root element (the element that also carries the
animation class). It's applied whether or not `skip-animation` is on. A plain `class` attribute
falls through to the same element.
