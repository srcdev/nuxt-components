# DeepExpandingMenu — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--deep-expanding-menu-gap` | `2.4rem` | Gap between top-level items |
| `--deep-expanding-menu-link-border-width` | `0.2rem` | Bottom border width on links and group toggles |
| `--deep-expanding-menu-link-padding-block` | `0.8rem` | Vertical padding on links and group toggles |
| `--deep-expanding-menu-link-border-colour-hover` | `light-dark(var(--blue-10), var(--slate-00))` | Bottom border colour on hover/focus |
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

## Not tokenised

- The `@position-try` fallback offsets (`--anchor-left`/`--anchor-right`) are fixed at `1rem` —
  these are CSS anchor-positioning fallback rules, not runtime custom properties, so they can't be
  overridden per-instance without a new `@position-try` block.
- Anchor names and popover target ids are generated per-instance via `useId()` and are not
  consumer-configurable — they only need to be unique, not meaningful.
