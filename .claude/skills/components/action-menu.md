# ActionMenu

> **Renamed 2026-09-27:** `ActionMenuItemCore` → `ActionMenuItem`; root class `.action-menu-item-core` → `.action-menu-item`.

## Overview

`ActionMenu` is a trigger-and-popover component that shows a compact ellipsis button (`lucide:ellipsis`).
Clicking it opens an anchored menu list populated via indexed dynamic slots (`item-{n}`). Each slot
should contain a single `ActionMenuItem` — either a `<button>` (for actions) or a link (for
navigation). The popover API and CSS anchor positioning handle positioning and dismiss behaviour
natively, with a JS fallback for older Safari (see Notes).

**Location**: `app/components/02.molecules/action-menu/`

---

## Components

### `ActionMenu`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `"Open actions menu"` | Used as `aria-label` on the trigger and `aria-label` on the menu list. |
| `triggerIcon` | `string` | `"lucide:ellipsis"` | Icon on the trigger button. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root `<div>`. |

#### Slots

| Slot | When used |
|---|---|
| `item-{n}` | One per item, `n` 0-indexed. The row count is derived from which `item-{n}` slots are present (re-evaluated every render, so items added after mount appear). Should contain one `ActionMenuItem`. |

---

### `ActionMenuItem`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | **Required.** Visible text for the row. |
| `href` | `string` | `undefined` | If set, renders as `<a>` (external) or `NuxtLink` (internal `/…` path). Omit for a `<button>`. |
| `arrowIcon` | `string` | `"lucide:arrow-right"` | Decorative trailing arrow icon. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root element. |

#### Slots

| Slot | Content |
|---|---|
| `#icon` | Optional left icon (e.g. `<Icon name="lucide:pencil" />`). Wrapped in `aria-hidden` span. |

#### Emits

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fired on every click regardless of whether the item is a button or link. |

#### Notes on routing

- Internal paths (`/…`) resolve to `<NuxtLink>` via `resolveComponent`.
- External URLs or relative paths without a leading `/` render as plain `<a>`.
- `type="button"` is set automatically on `<button>` elements to prevent accidental form submission.

---

## Basic usage

```vue
<ActionMenu label="Row actions">
  <template #item-0>
    <ActionMenuItem label="Edit" @click="handleEdit">
      <template #icon><Icon name="lucide:pencil" /></template>
    </ActionMenuItem>
  </template>
  <template #item-1>
    <ActionMenuItem label="View detail" href="/records/123">
      <template #icon><Icon name="lucide:eye" /></template>
    </ActionMenuItem>
  </template>
  <template #item-2>
    <ActionMenuItem label="Delete" @click="handleDelete">
      <template #icon><Icon name="lucide:trash-2" /></template>
    </ActionMenuItem>
  </template>
</ActionMenu>
```

---

## Link vs button items

| Scenario | Use |
|---|---|
| Triggers a JS handler (delete, share, copy…) | Omit `href` — renders as `<button>` |
| Navigates to an internal Nuxt route | `href="/path"` — renders as `<NuxtLink>` |
| Navigates to an external URL | `href="https://…"` — renders as `<a>` |

---

## CSS token API

See `CONSUMER-STYLING.md` in the component folder for the full token reference and override
examples. Prefer global CSS for action menus — they appear site-wide in tables, cards, and lists.

Quick reference:

```css
/* assets/styles/setup/07.components/action-menu.css */
:root {
  --action-menu-block-distance: 0.6rem;
  --action-menu-trigger-border-radius: 0.4rem;
  --action-menu-trigger-surface-hover: var(--brand-surface-subtle);
  --action-menu-trigger-icon-color: var(--brand-text-muted);

  --action-menu-popover-background: var(--brand-surface);
  --action-menu-popover-border: 0.1rem solid var(--brand-border);
  --action-menu-popover-border-radius: 0.6rem;

  --action-menu-item-surface-hover: var(--brand-surface-subtle);
  --action-menu-item-text-color: var(--brand-text);
}
```

---

## Notes

- **Popover API + CSS anchor positioning, with fallbacks** — open/close and positioning go through
  the shared `useAnchoredPopover` composable (`align: "end"`), same as `SelectMenu`. Without anchor
  positioning (Safari 17–18) JS measures the trigger and writes `--_popover-top`/`-bottom`/`-right`
  for the `@supports not (anchor-name: --a)` block. Without the Popover API (Safari 16) the trigger
  toggles `isOpen`, `.action-menu-popover-open` shows the menu, outside pointerdown and Escape
  close it, and `--action-menu-popover-z-index` (default `999999`) applies. See the `select-menu`
  skill doc for the details and the `:popover-open` selector-list caveat.
- **`aria-expanded`** on the trigger tracks the open state in every browser (added 2026-10-05).
- **Auto-close** — clicking any `<li>` row calls the composable's `hide()` (native `hidePopover()`
  or the fallback). The `ActionMenuItem` emitting `click` triggers normally before the menu closes.
- **Focus management** — on open (the `toggle` event, or after render in the fallback), focus moves
  to the first `[role="menuitem"]` inside the popover.
- **Keyboard navigation `currentIndex === -1` guard** — `handleKeydown` computes the current
  position via `items.indexOf(document.activeElement)`. When focus is outside the menu this returns
  `-1`. Always guard explicitly before applying wrap-around math: `ArrowDown` should focus
  `items[0]`; `ArrowUp` should focus `items[items.length - 1]`. Without the guard, the modulo
  formula gives `items[n-2]` for `ArrowUp` — the second-to-last item instead of the last.
- **Right-aligned by default** — the menu's right edge aligns with the trigger's right edge
  (`right: anchor(right)`). Flips above the trigger near the bottom of the viewport
  (`position-try-fallbacks: flip-block`).
- **`anchorName` format** — internally generated as `--action-menu-anchor-{id}` (a valid CSS
  `<dashed-ident>`). Set via a CSS custom property on the root element so both the trigger's
  `anchor-name` and the popover's `position-anchor` can reference the same value.
- **Dynamic slots stability** — `item-{n}` slots enforce that only `ActionMenuItem` content
  enters the list; arbitrary HTML inside the popover is not supported and will break the ARIA
  `menu` / `menuitem` pattern.
