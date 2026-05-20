# ActionMenu

## Overview

`ActionMenu` is a trigger-and-popover component that shows a compact ellipsis button (`lucide:ellipsis`).
Clicking it opens an anchored menu list populated via indexed dynamic slots (`item-{n}`). Each slot
should contain a single `ActionMenuItemCore` — either a `<button>` (for actions) or a link (for
navigation). The popover API and CSS anchor positioning handle positioning and dismiss behaviour
natively; no JavaScript click-outside logic is needed.

**Location**: `app/components/02.molecules/action-menu/`

---

## Components

### ActionMenu

| Prop | Type | Default | Notes |
|---|---|---|---|
| `itemCount` | `number` | `0` | Number of `item-{n}` slots to render. |
| `label` | `string` | `"Open actions menu"` | Used as `aria-label` on the trigger and `aria-label` on the menu list. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root `<div>`. |

**Slots**

| Slot | When used |
|---|---|
| `item-{n}` | One per item, where `n` is 0-indexed up to `itemCount - 1`. Should contain one `ActionMenuItemCore`. |

---

### ActionMenuItemCore

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | **Required.** Visible text for the row. |
| `href` | `string` | `undefined` | If set, renders as `<a>` (external) or `NuxtLink` (internal `/…` path). Omit for a `<button>`. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the root element. |

**Slots**

| Slot | Content |
|---|---|
| `#icon` | Optional left icon (e.g. `<Icon name="lucide:pencil" />`). Wrapped in `aria-hidden` span. |

**Emits**

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fired on every click regardless of whether the item is a button or link. |

**Notes on routing**
- Internal paths (`/…`) resolve to `<NuxtLink>` via `resolveComponent`.
- External URLs or relative paths without a leading `/` render as plain `<a>`.
- `type="button"` is set automatically on `<button>` elements to prevent accidental form submission.

---

## Basic usage

```vue
<ActionMenu :item-count="3" label="Row actions">
  <template #item-0>
    <ActionMenuItemCore label="Edit" @click="handleEdit">
      <template #icon><Icon name="lucide:pencil" /></template>
    </ActionMenuItemCore>
  </template>
  <template #item-1>
    <ActionMenuItemCore label="View detail" href="/records/123">
      <template #icon><Icon name="lucide:eye" /></template>
    </ActionMenuItemCore>
  </template>
  <template #item-2>
    <ActionMenuItemCore label="Delete" @click="handleDelete">
      <template #icon><Icon name="lucide:trash-2" /></template>
    </ActionMenuItemCore>
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

- **Popover API + CSS anchor positioning** — the menu uses `popover` attribute and `position-anchor`.
  Both are broadly supported (Chrome 114+, Firefox 125+, Safari 17+). No polyfill is included.
- **Auto-close** — clicking any `<li>` row fires `hidePopover()` on the menu. The `ActionMenuItemCore`
  emitting `click` triggers normally before the menu closes.
- **Focus management** — on open the `toggle` event fires `handleToggle`, which moves focus to the
  first `[role="menuitem"]` inside the popover.
- **Right-aligned by default** — the menu's right edge aligns with the trigger's right edge
  (`right: anchor(right)`). Flips above the trigger near the bottom of the viewport
  (`position-try-fallbacks: flip-block`).
- **`anchorName` format** — internally generated as `--action-menu-anchor-{id}` (a valid CSS
  `<dashed-ident>`). Set via a CSS custom property on the root element so both the trigger's
  `anchor-name` and the popover's `position-anchor` can reference the same value.
- **Dynamic slots stability** — `item-{n}` slots enforce that only `ActionMenuItemCore` content
  enters the list; arbitrary HTML inside the popover is not supported and will break the ARIA
  `menu` / `menuitem` pattern.
