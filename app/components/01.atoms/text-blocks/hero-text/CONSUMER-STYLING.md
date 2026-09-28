# HeroText — Consumer Styling Guide

## Public token API

### Type scale

| Token | Default | Used when |
|---|---|---|
| `--hero-text-display` | `clamp(4.8rem, 4vw + 2rem, 9.6rem)` | `font-size="display"` |
| `--hero-text-title` | `clamp(3.6rem, 4vw + 2rem, 4.8rem)` | `font-size="title"` (default) |
| `--hero-text-heading` | `clamp(2.8rem, 4vw + 2rem, 3rem)` | `font-size="heading"` |
| `--hero-text-subheading` | `2.4rem` | `font-size="subheading"` |
| `--hero-text-label` | `1.75rem` | `font-size="label"` |

### Appearance

| Token | Default | Controls |
|---|---|---|
| `--hero-text-font-family` | `"Playfair Display"` | Font family of the whole heading |
| `--hero-text-margin` | `0` | Margin on the root |
| `--hero-text-horizontal-gap` | `0.5ch` | Gap between segments, `axis="horizontal"` |
| `--hero-text-vertical-gap` | `0.4em` | Gap between segments, `axis="vertical"` |
| `--hero-text-bg-img` | `linear-gradient(135deg, #c2a770, #b4747e, #d1bd94)` | Fill of `accent` segments (`background-clip: text`) |
| `--hero-text-accent-offset` | `0.2em` | Extra bottom padding (and matching negative margin) on `accent` segments so descenders aren't clipped |
| `--hero-text-icon-colour` | `var(--colour-text-accent)` | Icon colour |

The library theme sets the type scale and `--hero-text-bg-img` on `:root` with the same values.

> Changed 2026-09-27: the component now carries those values as fallbacks (an app replacing the
> theme files got invisible accent text). `--hero-text-icon-colour` is new. The subheading icon is
> now sized with `font-size: 0.75em`; it used `width ... !important`, which fought
> `@nuxt/icon`'s own sizing.

Private (not public API): `--_hero-text-accent-offset`.

---

## State hooks

| Hook | When |
|---|---|
| `.hero-text.display`, `.title`, `.heading`, `.subheading`, `.label` | The `font-size` prop |
| `.axis-horizontal`, `.axis-vertical` | The `axis` prop (vertical is a flex column) |
| `.accent` | A segment with `styleClass: "accent"` |

Inner elements: `.hero-text__icon`, and one `<span class="text-block-{n}">` per segment (plus its
own `styleClass`).

---

## Global theming

```css
:where(html) {
  --hero-text-font-family: var(--font-family-display);
  --hero-text-bg-img: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root heading element. Reactive after mount.
