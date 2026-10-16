# SocialIconsList — Consumer Styling Guide

## Public token API

### List

| Token | Default | Controls |
|---|---|---|
| `--social-icons-list-gap` | `1.2rem` | Gap between items |

### Link (the tile)

| Token | Default | Controls |
|---|---|---|
| `--social-icons-list-link-padding` | `0` | Padding inside each link: set it to turn links into tiles or pills |
| `--social-icons-list-link-gap` | `0.8rem` | Gap between the icon and the visible label |
| `--social-icons-list-link-border` | `none` | Border shorthand |
| `--social-icons-list-link-radius` | `0` | Corner radius (the focus outline follows it) |
| `--social-icons-list-link-background` | `transparent` | Background |
| `--social-icons-list-link-background-hover` | the resting background | Background on hover/focus |
| `--social-icons-list-link-shadow` | `none` | Box shadow |
| `--social-icons-list-link-shadow-hover` | the resting shadow | Box shadow on hover/focus (a glow) |
| `--social-icons-list-hover-scale` | `1.15` | Scale on hover/focus (no scaling under `prefers-reduced-motion: reduce`) |
| `--social-icons-list-hover-opacity` | `0.85` | Opacity on hover/focus |
| `--social-icons-list-focus-ring-colour` | `var(--theme-ring, currentColor)` | Keyboard focus outline colour |

### Icon

| Token | Default | Controls |
|---|---|---|
| `--social-icons-list-icon-size` | `2.4rem` | Icon size (a `font-size` on the icon wrapper) |
| `--social-icons-list-icon-colour` | `currentColor` | Colour of mono icons (sets that draw in `currentColor`, e.g. `bi:instagram`). No effect on `logos:` icons, whose colours are fixed in the SVG |
| `--social-icons-list-icon-colour-hover` | the resting icon colour | Mono icon colour on hover/focus |
| `--social-icons-list-icon-wrapper-padding` | `0` | Padding around the icon's fixed `1em` square: uniform padding with a background and `50%` radius gives a circle, whatever the `icon` slot holds |
| `--social-icons-list-icon-wrapper-border` | `none` | Border shorthand around the icon |
| `--social-icons-list-icon-wrapper-radius` | `0` | Corner radius of the icon wrapper |
| `--social-icons-list-icon-wrapper-background` | `transparent` | Background behind the icon |

### Label (`show-label` or the `label` slot)

| Token | Default | Controls |
|---|---|---|
| `--social-icons-list-label-colour` | `currentColor` | Label text colour (set on the link) |
| `--social-icons-list-label-font-size` | `var(--step-4, 1.6rem)` | Label font size |
| `--social-icons-list-label-font-weight` | `600` | Label font weight |

### Brand colour (data, not a default)

`--social-icons-list-brand-colour` is set inline on each `.social-icons-list-item` from that item's
`brandColour`. The component doesn't use it; it's there so your tokens can (hover colour, glow,
circle fill). See the caveat under Local overrides.

`logos:` icons carry their own brand colours. Some are dark (`logos:instagram-icon`, `logos:x`,
`logos:github-icon`) and vanish on a dark background: use a mono icon there (`bi:instagram`,
`mdi:instagram`, ...) and colour it with `--social-icons-list-icon-colour`.

> Changed 2026-10-16: the inner classes were renamed so they can't collide with a site's own
> `.social-icon` styles: `.social-icon-item` is now `.social-icons-list-item`, `.social-icon-link` is
> `.social-icons-list-link` and `.social-icon` is `.social-icons-list-icon`. Update any selector that
> used the old names. The icon now sits in a `.social-icons-list-icon-wrapper` span, which carries
> the icon size (so a missing icon still leaves a focus target). New: the link, icon wrapper and
> label tokens above, `--social-icons-list-focus-ring-colour` (the outline read `--theme-ring`
> directly), and per-item `--social-icons-list-brand-colour`. Items whose href isn't http(s),
> mailto, tel or site-relative are skipped. The focus outline's fixed `2px` radius is now
> `--social-icons-list-link-radius` (default `0`).
>
> Changed 2026-10-14: new `--social-icons-list-icon-colour` token for mono icons.
>
> Changed 2026-09-28: `--theme-social-icon-size` and `--theme-social-icon-gap` were renamed to
> `--social-icons-list-icon-size` and `--social-icons-list-gap`; the old names no longer work. The
> icon is now sized with `font-size` (it used an inline `width`/`height` style). The hover tokens
> are new, and the hover scale now respects reduced motion.

No private `--_` tokens.

---

## State hooks

Inner classes: `.social-icons-list-item` (each `<li>`, carries `--social-icons-list-brand-colour`),
`.social-icons-list-link` (the `<a>`, opens in a new tab), `.social-icons-list-icon-wrapper` (the
`aria-hidden` span around the icon or the `icon` slot), `.social-icons-list-icon` (the default
icon), `.social-icons-list-label` (visible text, only with `show-label` or the `label` slot).

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** a token whose value reads `--social-icons-list-brand-colour` must be set on
`.social-icons-list-item` (or deeper), not on the list or an ancestor. A `var()` inside a custom
property resolves on the element that declares it, and the brand colour only exists on each item,
so set on the root it finds nothing and falls back to the default.

```css
.my-section .social-icons-list-item {
  --social-icons-list-icon-colour-hover: var(--social-icons-list-brand-colour);
}
```

---

## Recipes

Four looks built only from the tokens above and consumer CSS, each on a class passed through
`style-class-passthrough`. The full CSS is in `stories/social-icons-list-recipes.css` next to the
component, and each has a Storybook story (`Recipe: …`). All use mono `bi:` icons plus a
`brandColour` per item.

- **Mono tiles, brand colour on hover**: tile tokens (`link-padding`, `-radius`, `-background`,
  `-background-hover`), then `--social-icons-list-icon-colour-hover: var(--social-icons-list-brand-colour)`
  on `.social-icons-list-item`.
- **Dark dock with glow**: the dock is the list root (padding, border, radius and
  `inline-size: fit-content` on your class), dark tiles inside, and
  `--social-icons-list-link-shadow-hover` mixed from the brand colour on `.social-icons-list-item`.
  Black brand colours (X, TikTok) don't show on a dark dock: give those items a light or accent
  `brandColour` there.
- **Labelled pills**: `show-label`, a pill link (`link-padding`, `-border`, `99rem` radius), and the
  icon wrapper as a brand-coloured circle (`icon-wrapper-padding`, `50%` radius,
  `icon-wrapper-background` from the brand colour on the item).
- **Overlapping stack**: circles from the icon wrapper tokens, a negative `margin-inline-start` on
  every `.social-icons-list-item + .social-icons-list-item`, reset on the list's `:hover` and
  `:focus-within` so keyboard users get the fan-out too. Put the transition inside
  `@media (prefers-reduced-motion: no-preference)`. A "Follow us" caption is your own text beside
  the component.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `<ul>`. Reactive after mount.
