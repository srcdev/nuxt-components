# ActionMenu — Consumer Styling Guide

## Public token API

All `--action-menu-*` tokens are the stable override surface. Because action menus appear
repeatedly across the UI (tables, cards, list rows) the recommended approach is to set tokens
once in a **global CSS file** rather than per-instance via `styleClassPassthrough`.

### Trigger button

| Token | Default | Controls |
|---|---|---|
| `--action-menu-trigger-size` | `3.2rem` | Trigger button width and height |
| `--action-menu-trigger-border-radius` | `var(--button-border-radius-icon-only, 50%)` | Trigger corner rounding |
| `--action-menu-trigger-surface` | `transparent` | Trigger background (rest state) |
| `--action-menu-trigger-surface-hover` | `light-dark(var(--slate-01), var(--slate-09))` | Trigger background on hover/focus |
| `--action-menu-trigger-icon-size` | `2rem` | Ellipsis icon size |
| `--action-menu-trigger-icon-color` | `light-dark(var(--slate-07), var(--slate-03))` | Ellipsis icon colour |

### Menu popover

| Token | Default | Controls |
|---|---|---|
| `--action-menu-block-distance` | `0.4rem` | Gap between trigger bottom and menu top |
| `--action-menu-popover-background` | `light-dark(var(--slate-00), var(--slate-10))` | Menu panel background |
| `--action-menu-popover-border` | `0.1rem solid light-dark(var(--slate-03), var(--slate-07))` | Menu panel border shorthand |
| `--action-menu-popover-border-radius` | `0.8rem` | Menu panel corner rounding |
| `--action-menu-popover-min-width` | `20rem` | Minimum menu width |
| `--action-menu-popover-shadow` | `0 0.4rem 1.6rem light-dark(rgba(0,0,0,0.1), rgba(0,0,0,0.4))` | Menu panel drop shadow |
| `--action-menu-popover-transition-duration` | `200ms` | Open/close fade duration |

### Menu items (`ActionMenuItemCore`)

| Token | Default | Controls |
|---|---|---|
| `--action-menu-item-divider` | `0.1rem solid light-dark(var(--slate-02), var(--slate-08))` | Divider line between items |
| `--action-menu-item-surface-hover` | `light-dark(var(--slate-01), var(--slate-09))` | Item row background on hover/focus |
| `--action-menu-item-text-color` | `light-dark(var(--slate-09), var(--slate-01))` | Item label and icon colour |
| `--action-menu-item-icon-size` | `2rem` | Left icon container size |
| `--action-menu-item-padding-inline` | `1.6rem` | Item horizontal padding |
| `--action-menu-item-padding-block` | `1.2rem` | Item vertical padding |

---

## Global theming — recommended approach

Create `assets/styles/setup/07.components/action-menu.css` in the consuming app and set tokens
on `:root`. This applies to every `ActionMenu` across the site.

```css
/* assets/styles/setup/07.components/action-menu.css */
:root {
  --action-menu-trigger-border-radius: 0.4rem;
  --action-menu-trigger-surface-hover: var(--brand-surface-subtle);
  --action-menu-trigger-icon-color: var(--brand-text-muted);

  --action-menu-popover-background: var(--brand-surface);
  --action-menu-popover-border: 0.1rem solid var(--brand-border);
  --action-menu-popover-border-radius: 0.6rem;
  --action-menu-popover-shadow: 0 0.8rem 2.4rem rgba(0, 0, 0, 0.15);

  --action-menu-item-surface-hover: var(--brand-surface-subtle);
  --action-menu-item-text-color: var(--brand-text);
  --action-menu-item-divider: 0.1rem solid var(--brand-border);
  --action-menu-block-distance: 0.6rem;
}
```

---

## Page-scoped overrides

Override tokens for a specific section by scoping them under the page or layout wrapper.
No `:deep()` is required (component styles are unscoped).

```css
/* In the consuming page's unscoped <style> block */
.admin-table {
  .action-menu {
    --action-menu-trigger-size: 2.8rem;
    --action-menu-trigger-icon-size: 1.6rem;
    --action-menu-popover-min-width: 16rem;
    --action-menu-item-padding-block: 0.8rem;
  }
}
```

---

## Per-instance overrides via styleClassPassthrough

Use sparingly — prefer global or page-scoped CSS. When a single instance needs a distinct
visual style, pass a modifier class:

```vue
<ActionMenu
  :item-count="3"
  :style-class-passthrough="['danger-actions']"
>
  ...
</ActionMenu>
```

```css
.action-menu.danger-actions {
  --action-menu-trigger-icon-color: var(--color-danger);
  --action-menu-trigger-surface-hover: light-dark(var(--red-01), var(--red-09));
  --action-menu-item-surface-hover: light-dark(var(--red-01), var(--red-09));
  --action-menu-item-text-color: light-dark(var(--red-09), var(--red-01));
  --action-menu-item-divider: 0.1rem solid light-dark(var(--red-02), var(--red-08));
}
```

---

## Notes

- `--action-menu-block-distance` accepts any valid `<length>`. Negative values will cause the
  menu to overlap the trigger.
- The menu opens **below** the trigger and right-aligns with it by default. It flips above
  when near the bottom of the viewport (`position-try-fallbacks: flip-block`).
- `--action-menu-popover-min-width` sets the floor — long labels will naturally expand the
  menu wider. Set `width: max-content` on `.action-menu-popover` in a consumer override if
  you want to suppress that.
- The `--action-menu-item-*` tokens resolve on `.action-menu-item-core` elements, so they
  take effect even when items are used in other contexts.
