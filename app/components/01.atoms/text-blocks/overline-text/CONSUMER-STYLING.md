# OverlineText — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--overline-text-bg-img` | `linear-gradient(135deg, #c2a770, #b4747e, #d1bd94)` | Fill of the text (`background-clip: text` over `color: transparent`) |
| `--overline-text-large` | `1.4rem` | Font size for `font-size="large"` |
| `--overline-text-medium` | `1.2rem` | Font size for `font-size="medium"` (default) |
| `--overline-text-small` | `1rem` | Font size for `font-size="small"` |
| `--overline-text-font-family` | `inherit` | Font family |
| `--overline-text-font-style` | `italic` | Font style, e.g. `normal` for upright text |
| `--overline-text-font-weight` | `inherit` | Font weight |
| `--overline-text-letter-spacing` | `inherit` | Letter-spacing, e.g. `0.25em` for wide tracking |

The library theme also sets the colour and size tokens on `:root` (`03.theming/_default.css` and
`05.typography/01.tokens/_reponsive-font-sizes.css`) with the same values.

> Changed 2026-09-27: the component now carries those values as fallbacks too. Before, an app that
> replaced the library theme files without defining `--overline-text-bg-img` got invisible text,
> since the colour is `transparent`.

No private `--_` tokens.

No line-clamp token: an overline is a short label, and clamping needs `overflow: hidden`, which
clips the default italic overhang. Long text wraps (`overflow-wrap: anywhere`). A parent that needs
a cap clamps it itself with an allowance for the overhang, as `ServiceDetail` does.

---

## State hooks

| Class | When |
|---|---|
| `[data-font-size="large" \| "medium" \| "small"]` | The `font-size` prop |

> Changed 2026-10-19: the size was a bare `large`/`medium`/`small` class on the root, which a
> consumer's own `.small` or `.large` rule could restyle. Select `.overline-text[data-font-size="small"]`
> instead of `.overline-text.small`.

---

## Global theming

```css
:where(html) {
  --overline-text-bg-img: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
}
```

For a plain solid colour, use a single-colour gradient:
`linear-gradient(var(--brand-primary), var(--brand-primary))`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.overline-text` element. Reactive after mount.
