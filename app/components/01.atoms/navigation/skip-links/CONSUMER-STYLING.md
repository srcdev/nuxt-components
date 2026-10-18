# SkipLinks — Consumer Styling Guide

## Public token API

No private `--_` tokens.

### Panel (`.skip-links__nav`)

| Token | Default | Controls |
|---|---|---|
| `--skip-links-z-index` | `999999` | Stacking order of the revealed panel |
| `--skip-links-gap` | `0.2rem` | Gap between stacked skip links |
| `--skip-links-background-colour` | `var(--theme-surface-inverted)` | Panel background |
| `--skip-links-border-colour` | `var(--theme-on-surface)` | Panel border colour |
| `--skip-links-border-width` | `1px` | Panel border width |
| `--skip-links-padding` | `0.2rem` | Panel padding |
| `--skip-links-transition-duration` | `0.3s` | Duration of the reveal transition (off under `prefers-reduced-motion`) |

### Links (`.skip-links__link`)

| Token | Default | Controls |
|---|---|---|
| `--skip-links-text-colour` | `var(--theme-on-surface)` | Link text colour |
| `--skip-links-link-padding-block` | `0.8rem` | Link vertical padding |
| `--skip-links-link-padding-inline` | `1.2rem` | Link horizontal padding |
| `--skip-links-focus-outline-width` | `2px` | Focus outline width |
| `--skip-links-focus-outline-colour` | `var(--theme-on-surface)` | Focus outline colour |

> Changed 2026-10-18: the colours used to be hardcoded `black` (background) and `white` (text,
> border, focus ring). They now default to the darkest theme step (`--theme-surface-inverted`) and
> `--theme-on-surface`, keeping the high contrast while following the site's `data-theme` palette.
> Set the four colour tokens to `black`/`white` to get the old look back. `--skip-links-z-index`
> went from `1000` to `999999`, the library's overlay default, so the panel shows above sticky
> headers.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `:focus-within` | `.skip-links__nav` | A skip link has focus: the panel is revealed |

Inner classes: `.skip-links` (root), `.skip-links__home` (only when the `homeLink` slot is used),
`.skip-links__nav`, `.skip-links__link`.

The panel is hidden with `opacity`, `transform` and `pointer-events`, not `display` or
`visibility`, so the links stay in the tab order. It's positioned below the root
(`top: 100%; inset-inline-start: 0`), so in a right-to-left page it drops from the right edge. It
sizes to its longest link but never exceeds the viewport width (`100vw - 3.2rem`); longer labels
wrap. The `<nav>` isn't rendered at all when no link has both an `href` and a `label`.

> Changed 2026-10-18: links used to be `white-space: nowrap`, so a long label ran off-screen, and
> the panel was anchored with a physical `left: 0`.

---

## Global theming

```css
:where(html) {
  --skip-links-background-colour: #111;
  --skip-links-border-colour: #ffd700;
  --skip-links-focus-outline-colour: #ffd700;
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

`style-class-passthrough` adds classes to the root `.skip-links`, so tokens set on a passthrough
class reach the panel and the links.

---

## Notes

- The links are prop-driven (`links: { href, label }[]`), not slots: see the skill doc for the
  default value and localisation.
