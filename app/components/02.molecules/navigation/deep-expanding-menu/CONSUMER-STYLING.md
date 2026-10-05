# DeepExpandingMenu — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-gap` | `2.4rem` | Gap between top-level items |
| `--deep-expanding-menu-link-border-width` | `0.2rem` | Bottom border width on links and group toggles |
| `--deep-expanding-menu-link-padding-block` | `0.8rem` | Vertical padding on links and group toggles |
| `--deep-expanding-menu-link-border-colour-hover` | `var(--blue-10)` | Bottom border colour on hover/focus |
| `--deep-expanding-menu-icon-size` | `1.2rem` | Caret icon size |
| `--deep-expanding-menu-panel-width` | `min(100%, 50vw)` | Popover panel width |
| `--deep-expanding-menu-panel-background-colour` | `white` | Popover panel background |
| `--deep-expanding-menu-panel-border-width` | `0.1rem` | Popover panel border width |
| `--deep-expanding-menu-panel-border-colour` | `black` | Popover panel border colour |
| `--deep-expanding-menu-panel-border-radius` | `1.2rem` | Popover panel corner radius |
| `--deep-expanding-menu-panel-shadow` | `0 0 1rem rgba(0, 0, 0, 0.1)` | Popover panel box-shadow |
| `--deep-expanding-menu-panel-padding` | `1.2rem` | Popover panel padding |
| `--deep-expanding-menu-panel-heading-colour` | `var(--slate-10)` | `childLinksTitle` heading colour inside the panel |
| `--deep-expanding-menu-panel-list-gap` | `1.2rem` | Gap between child link grid items |
| `--deep-expanding-menu-group-link-colour` | `var(--slate-10)` | Child link text colour |
| `--deep-expanding-menu-group-link-border-colour-hover` | `var(--slate-10)` | Child link bottom border colour on hover/focus |
| `--deep-expanding-menu-panel-z-index` | `999999` | Panel stacking order in browsers without CSS anchor positioning. Ignored where the panel renders in the top layer |

```css
.my-page {
  --deep-expanding-menu-panel-background-colour: #1a1a1a;
  --deep-expanding-menu-panel-border-colour: transparent;
  --deep-expanding-menu-group-link-colour: white;
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<DeepExpandingMenu style-class-passthrough="main-nav">...</DeepExpandingMenu>
```

---

## Not tokenised

- The `1rem` gap between a toggle and its panel.
- Anchor names and popover target ids are generated per-instance via `useId()` and are not
  consumer-configurable — they only need to be unique, not meaningful.

---

## Open state and older browsers

| Hook | Meaning |
|---|---|
| `.navigation-group-toggle[aria-expanded="true"]` | Group open, every browser (flips the caret) |
| `.navigation-group-panel:popover-open` | Panel open, Popover API browsers |
| `.deep-expanding-menu-panel-open` | Panel open, browsers without the Popover API (Safari 16 and older). Style it in a **separate rule** from `:popover-open`: a selector list containing `:popover-open` is dropped whole where it's unsupported |
| `.navigation-group-panel[data-placement="above"]` | Flipped above the toggle, browsers without CSS anchor positioning only |

Without CSS anchor positioning (e.g. Safari 17–18) the panel is placed with `position: fixed` from
the toggle's measured position. Without the Popover API (Safari 16) the panel also opens and closes
in JS and isn't in the top layer, so `--deep-expanding-menu-panel-z-index` applies, and an ancestor
with `transform`, `filter` or `contain` becomes its containing block and can misplace it.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.
