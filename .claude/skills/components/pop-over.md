---
name: PopOver
description: PopOver generic anchor-positioned disclosure panel with consumer-supplied trigger/content slots, placement prop, CSS token API
type: reference
---

# PopOver

## Overview

`PopOver` renders a fully consumer-supplied trigger that opens an anchor-positioned popover panel
with fully consumer-supplied content, built on the native Popover API
(`popover`/`popovertarget`) and CSS anchor-positioning (`anchor-name`/`position-anchor`/
`anchor()`). Unlike [`DisplayTooltip`](display-tooltip.md) (a fixed icon trigger for inline help
text) or `ActionMenu` (menu semantics with arrow-key navigation), `PopOver` makes no assumption
about what the trigger or content look like, and always renders its own visible close button.

**Browser support:** since 2026-10-05 open/close and positioning go through the shared
`useAnchoredPopover` composable, with `side` following the `placement` prop (see
`composable-anchored-popover.md`). Without anchor positioning (Safari 17–18) the panel is placed
from the trigger's measured position on the `placement` side, flipping to the opposite side when
there's no room. Without the Popover API (Safari 16) it opens and closes in JS, with outside-click
and Escape dismissal.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Which side of the trigger the popover panel opens on. Each side has a `position-try-fallbacks` so the browser flips it automatically if it would overflow the viewport. |
| `triggerAriaLabel` | `string` | `""` | aria-label on the trigger button — set this when the `trigger` slot is icon-only. Unset (no attribute) by default, since the trigger slot usually carries its own visible/accessible content. |
| `popoverAriaLabel` | `string` | `""` | aria-label on the popover content region — set this when the `content` slot has no visible heading. |
| `closeButtonAriaLabel` | `string` | `"Close"` | aria-label on the close button — override for localisation. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `trigger` | Content rendered inside the trigger button. |
| `content` | Content rendered inside the popover panel, below the close button. |

## Basic usage

```vue
<PopOver placement="bottom">
  <template #trigger>
    <span>Open popover</span>
  </template>
  <template #content>
    <p>This is some popover content.</p>
  </template>
</PopOver>
```

Icon-only trigger:

```vue
<PopOver trigger-aria-label="Show filters" popover-aria-label="Filter options">
  <template #trigger>
    <Icon name="lucide:filter" aria-hidden="true" />
  </template>
  <template #content>
    <p>Filter controls would go here.</p>
  </template>
</PopOver>
```

## Notes on content

The `content` slot's immediate children have their default UA top/bottom margins trimmed (via
`:first-child`/`:last-child`), so `--pop-over-content-padding`/`-content-padding-block-start` are
the only source of space above/below the slotted content — a plain `<p>` doesn't stack its own
`margin-block` on top of the panel's padding. Interior spacing between multiple slotted children
(e.g. two paragraphs) is untouched.

## Behaviour

- Clicking the trigger toggles the panel; the close button, Escape or an outside click hides it,
  and focus returns to the trigger. Natively this is the Popover API; on Safari 16 the composable
  does the same in JS. The trigger has `aria-expanded` in every browser.
- On open, focus moves to the close button (the composable's `onOpen`) so keyboard users land
  inside the panel immediately.

## CSS custom properties

See `CONSUMER-STYLING.md` for the full `--pop-over-*` token API (gap, trigger outline, panel
border/background/text/shadow/width, content padding, and close-button tokens).

## Notes

- Auto-imported in Nuxt — no manual import needed.
- 2026-09-13 migration: moved from an unplaced top-level folder (`app/components/pop-over/`) into
  `01.atoms/pop-over/`; converted options-style `defineProps` to `interface Props` +
  `withDefaults`; the slot named `popoverCotent` (typo) was renamed to `content`, and the required
  `popovertarget` prop was replaced with an auto-generated id (`useId()`) so consumers no longer
  need to wire up matching ids themselves; the `role="tooltip"` on the popover panel was removed
  (it described a tooltip, not this component's actual arbitrary-content disclosure semantics);
  added a real, visible close button (the original template referenced one with no styling or
  accessible label — literal `x` text); added `placement` (`top`/`right`/`bottom`/`left`, all with
  `position-try-fallbacks`) — the original only supported opening to the right, with several
  `@position-try` blocks commented out and unused; promoted every hardcoded value to a public CSS
  token; added tests, a Storybook story, this skill doc, and a VS Code snippet (all previously
  missing).
