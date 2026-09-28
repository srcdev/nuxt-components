# EyebrowText — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--eyebrow-text-bg-img` | `linear-gradient(135deg, #c2a770, #b4747e, #d1bd94)` | Fill of the text (`background-clip: text` over `color: transparent`) |
| `--eyebrow-text-large` | `1.4rem` | Font size for `font-size="large"` |
| `--eyebrow-text-medium` | `1.2rem` | Font size for `font-size="medium"` (default) |
| `--eyebrow-text-small` | `1rem` | Font size for `font-size="small"` |

The library theme also sets all four on `:root` (`03.theming/_default.css` and
`05.typography/01.tokens/_reponsive-font-sizes.css`) with the same values.

> Changed 2026-09-27: the component now carries those values as fallbacks too. Before, an app that
> replaced the library theme files without defining `--eyebrow-text-bg-img` got invisible text,
> since the colour is `transparent`.

No private `--_` tokens.

---

## State hooks

| Class | When |
|---|---|
| `.eyebrow-text.large`, `.medium`, `.small` | The `font-size` prop |

---

## Global theming

```css
:where(html) {
  --eyebrow-text-bg-img: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
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

`style-class-passthrough` adds classes to the root `.eyebrow-text` element. Reactive after mount.
