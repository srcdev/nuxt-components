# DisplayQrCode — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-qr-code-size` | the `size` prop (`256px`) | Width of the code; height follows via `aspect-ratio: 1 / 1`. Capped at `max-inline-size: 100%`, so it never overflows its container |

Module colours are props, not tokens: `black-color` (default `currentColor`) and `white-color`
(default `transparent`). They're written into the SVG by `nuxt-qrcode`. Because the dark modules
default to `currentColor`, setting `color` on the element or an ancestor recolours them.

> Changed 2026-09-27: `--display-qr-code-size` is new. When set, it takes precedence over the
> `size` prop, so a layout can resize codes without touching every instance.

No private `--_` tokens.

---

## State hooks

The root is the `nuxt-qrcode` SVG with class `.display-qr-code`, `role="img"` and an
`aria-label` (the `aria-label` prop, default `"QR code"`).

When the value is too long to encode, the root is instead a `<span>` with classes
`.display-qr-code.display-qr-code-fallback` and a `data-error` attribute, holding the `fallback`
slot. It keeps the same size and passthrough classes, centres its content, and has no role or
label (the slot content speaks for itself).

| Hook | Meaning |
|---|---|
| `.display-qr-code-fallback`, `[data-error]` | The value couldn't be encoded; the `fallback` slot is showing |

> Changed 2026-10-19: the fallback root is new (an over-capacity value used to throw during
> render), and the code is now capped at its container's width.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Page or section

```css
.my-page {
  --display-qr-code-size: 18rem;
  color: var(--brand-primary); /* dark modules, when black-color is left at currentColor */
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root SVG, or to the fallback `<span>` when the value
can't be encoded. Reactive after mount.
