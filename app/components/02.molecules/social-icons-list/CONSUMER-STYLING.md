# SocialIconsList — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--social-icons-list-icon-size` | `2.4rem` | Icon size (applied as `font-size`) |
| `--social-icons-list-gap` | `1.2rem` | Gap between icons |
| `--social-icons-list-hover-scale` | `1.15` | Scale on hover/focus (no scaling under `prefers-reduced-motion: reduce`) |
| `--social-icons-list-hover-opacity` | `0.85` | Opacity on hover/focus |

The focus outline uses `--theme-ring`, falling back to `currentColor`. Icon colour is whatever the
Iconify icon renders (`logos:` icons carry their own brand colours; mono sets follow `color`).

> Changed 2026-09-28: `--theme-social-icon-size` and `--theme-social-icon-gap` were renamed to
> `--social-icons-list-icon-size` and `--social-icons-list-gap`; the old names no longer work. The
> icon is now sized with `font-size` (it used an inline `width`/`height` style). The hover tokens
> are new, and the hover scale now respects reduced motion.

No private `--_` tokens.

---

## State hooks

Inner classes: `.social-icon-item` (each `<li>`), `.social-icon-link` (the `<a>`, opens in a new
tab), `.social-icon` (the icon, `aria-hidden`).

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `<ul>`. Reactive after mount.
