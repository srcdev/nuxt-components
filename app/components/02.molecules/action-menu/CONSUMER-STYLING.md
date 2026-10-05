# ActionMenu — Consumer Styling Guide

## Public token API

All `--action-menu-*` tokens are the stable override surface. Action menus repeat across the UI
(tables, cards, list rows), so setting them once globally is usually the right scope.

> Changed 2026-09-27: this table previously listed `light-dark()` defaults that the component
> never actually used. The values below are the real ones. The menu is a fixed light panel in
> both colour schemes; give it a dark variant by overriding the tokens (see **Recipe** below).

### Trigger button (resolved on `.action-menu`)

| Token | Default | Controls |
|---|---|---|
| `--action-menu-trigger-size` | `3.2rem` | Trigger button width and height |
| `--action-menu-trigger-border-radius` | `var(--button-border-radius-icon-only, 50%)` | Trigger corner rounding |
| `--action-menu-trigger-surface` | `transparent` | Trigger background (rest) |
| `--action-menu-trigger-surface-hover` | `var(--slate-01)` | Trigger background on hover/focus |
| `--action-menu-trigger-icon-size` | `2rem` | Trigger icon size (applied as `font-size`) |
| `--action-menu-trigger-icon-color` | `var(--slate-07)` | Trigger icon colour |

### Menu popover (resolved on `.action-menu`)

| Token | Default | Controls |
|---|---|---|
| `--action-menu-block-distance` | `0.4rem` | Gap between trigger and menu |
| `--action-menu-popover-background` | `var(--slate-00)` | Menu panel background |
| `--action-menu-popover-border` | `0.1rem solid var(--slate-03)` | Menu panel border shorthand |
| `--action-menu-popover-border-radius` | `0.8rem` | Menu panel corner rounding |
| `--action-menu-popover-min-width` | `20rem` | Minimum menu width |
| `--action-menu-popover-shadow` | `0 0.4rem 1.6rem rgba(0, 0, 0, 0.1)` | Menu panel drop shadow |
| `--action-menu-popover-transition-duration` | `200ms` | Open/close fade duration |
| `--action-menu-popover-z-index` | `999999` | Stacking order in browsers without CSS anchor positioning (see Positioning). Ignored where the popover renders in the top layer |
| `--action-menu-item-divider` | `0.1rem solid var(--slate-02)` | Divider between list rows |

### Menu items (`ActionMenuItem`, resolved on `.action-menu-item`)

| Token | Default | Controls |
|---|---|---|
| `--action-menu-item-surface-hover` | `var(--slate-01)` | Row background on hover/focus |
| `--action-menu-item-text-color` | `var(--slate-09)` | Label and icon colour |
| `--action-menu-item-icon-size` | `2rem` | Leading icon box size; also its `font-size`, so a slotted `<Icon>` fills it |
| `--action-menu-item-arrow-size` | `1.6rem` | Trailing arrow icon size |
| `--action-menu-item-gap` | `1.2rem` | Space between icon, label and arrow |
| `--action-menu-item-padding-inline` | `1.6rem` | Row horizontal padding |
| `--action-menu-item-padding-block` | `1.2rem` | Row vertical padding |

> Changed 2026-09-27: item `light-dark()` defaults replaced by their light values (older iPad
> Safari lacks `light-dark()`), matching the already-light panel. Icon sizes are applied as
> `font-size`; the old `width`/`height` on the trigger and arrow icons was silently overridden by
> `@nuxt/icon`. `--action-menu-item-arrow-size` is new.

Private (not public API): `--_trigger-size`, `--_popover-transition-duration`, `--_gap` and
`--_icon-size` (each reused across several declarations; set the public token instead), and
`--_anchor-name` (the per-instance CSS anchor set inline on the root).

---

## State hooks

| Hook | When |
|---|---|
| `.action-menu-popover:popover-open` | Menu is open, Popover API browsers |
| `.action-menu-popover-open` | Menu is open, browsers without the Popover API (Safari 16 and older). Style it in a **separate rule** from `:popover-open`: a selector list containing `:popover-open` is dropped whole where it's unsupported |
| `.action-menu-trigger[aria-expanded="true"]` | Menu is open, every browser |
| `.action-menu-popover[data-placement="top"]` | Flipped above the trigger, browsers without CSS anchor positioning only |

Inner classes: `.action-menu-trigger`, `.action-menu-trigger-icon`, `.action-menu-popover`,
`.action-menu-list`, `.action-menu-list-item`; on each item `.action-menu-item`,
`.action-menu-item-icon`, `.action-menu-item-label`, `.action-menu-item-arrow`,
`.action-menu-item-arrow-icon`.

> Changed 2026-09-27: the item root class is `.action-menu-item` (was `.action-menu-item-core`,
> renamed with the component).

---

## Positioning

The menu uses the Popover API plus CSS anchor positioning: it opens below the trigger,
right-aligned, and flips above near the bottom of the viewport (`position-try-fallbacks:
flip-block`).

Fallbacks, via the shared `useAnchoredPopover` composable:

- **No anchor positioning** (e.g. Safari 17–18): the popover is placed with `position: fixed` from
  the trigger's measured position, re-measured on scroll and resize, and flipped above when there's
  no room below.
- **No Popover API** (Safari 16 and older): the menu also opens and closes in JS, with
  outside-click and Escape dismissal. It isn't in the top layer in this mode, so
  `--action-menu-popover-z-index` matters, and an ancestor with `transform`, `filter` or `contain`
  becomes its containing block and can misplace it.

---

## Global theming

```css
:where(html) {
  --action-menu-trigger-border-radius: 0.4rem;
  --action-menu-popover-border-radius: 0.6rem;
  --action-menu-block-distance: 0.6rem;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the popover is a top-layer element, but it's still a DOM descendant of `.action-menu`,
so tokens set on an ancestor still reach it.

---

## Recipe: dark-scheme menu

```css
.my-page {
  --action-menu-trigger-surface-hover: light-dark(var(--slate-01), var(--slate-09));
  --action-menu-trigger-icon-color: light-dark(var(--slate-07), var(--slate-03));
  --action-menu-popover-background: light-dark(var(--slate-00), var(--slate-10));
  --action-menu-popover-border: 0.1rem solid light-dark(var(--slate-03), var(--slate-07));
  --action-menu-item-divider: 0.1rem solid light-dark(var(--slate-02), var(--slate-08));
  --action-menu-item-surface-hover: light-dark(var(--slate-01), var(--slate-09));
  --action-menu-item-text-color: light-dark(var(--slate-09), var(--slate-01));
}
```

`light-dark()` is fine in your own CSS if your supported browsers have it; the library just
doesn't rely on it for its defaults.

---

## Class passthrough

`style-class-passthrough` on `ActionMenu` adds classes to the root `.action-menu`; on
`ActionMenuItem` it adds them to the item root. Both are reactive after mount.

---

## Notes

- Negative `--action-menu-block-distance` values make the menu overlap the trigger.
- `--action-menu-popover-min-width` is a floor; long labels widen the menu. Set
  `width: max-content` on `.action-menu-popover` to change that.
