# ClipElement — Consumer Styling Guide

## No public CSS token API

`ClipElement` has no `--clip-element-*` custom properties. Its only visual output is the
`clip-path` inset applied to `.clipped-element`, and that value is entirely computed at runtime
from the `maxClip` prop and the element's scroll position — there is no fixed appearance value a
consumer would plausibly want to override via CSS.

---

## Override surface

Use `styleClassPassthrough` to apply your own classes to the root `.clip-element-wrapper`:

```vue
<ClipElement :max-clip="150" style-class-passthrough="my-clip-wrapper">
  <img src="/images/hero.jpg" alt="Hero" />
</ClipElement>
```

```css
.my-clip-wrapper {
  border-radius: 1.6rem;
}
```

Style the slotted content directly for anything beyond the clip effect itself (sizing, object-fit,
borders, etc.) — `ClipElement` does not constrain it.

---

## Local overrides

There are no public tokens, so override the classes above with direct properties, scoped to an
element you own (a page or section class, or a class added with `:style-class-passthrough`). Keep
the block **unlayered** (no `@layer` wrapper) so it beats the library's `@layer components`. If your
own file uses `<style scoped>`, selectors that reach inside the component need `:deep()`. Patterns
and examples: `.claude/skills/component-local-style-override.md`.

