---
name: DisplayTooltip
description: DisplayTooltip anchor-positioned popover trigger, browser support caveat, CSS token API
type: reference
---

# DisplayTooltip

## Overview

`DisplayTooltip` renders a trigger button that opens an anchor-positioned popover panel, built on
the native Popover API (`popover`/`popovertarget`) and CSS anchor-positioning
(`anchor-name`/`position-anchor`/`anchor()`). For a structured title/body/action content shape
with a built-in close button, see [`DisplayTooltipDefined`](display-tooltip-defined.md), which
composes this component.

**Browser support caveat:** CSS anchor-positioning and the Popover API are both comparatively
recent — check current browser support before relying on this where broad support is a hard
requirement, same caution as `DeepExpandingMenu`'s equivalent gap.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltipId` | `string` | `""` | Id linking the trigger button (`popovertarget`) to the popover panel (`id`). Auto-generated via `useId()` when omitted. |
| `hideTrigger` | `boolean` | `false` | Visually hides the trigger button (kept in the DOM, not removed) — e.g. when an equivalent trigger is supplied via the `triggerContent` slot. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

## Slots

| Slot | Description |
|------|-------------|
| `triggerContent` | Optional content rendered before the trigger button (e.g. a label the tooltip icon sits next to). |
| `tooltipContent` | Content rendered inside the popover panel. |

## Basic usage

```vue
<DisplayTooltip>
  <template #triggerContent>
    <span>Delivery cost</span>
  </template>
  <template #tooltipContent>
    <p>Free delivery on orders over £50.</p>
  </template>
</DisplayTooltip>
```

## CSS custom properties

See `CONSUMER-STYLING.md` for the full `--display-tooltip-*` token API (padding, gaps, icon size,
popover width/colours/radius, and the close-button tokens `DisplayTooltipDefined` uses).

## Notes

- Auto-imported in Nuxt — no manual import needed.
- `tooltipId` is only reactive at mount — changing it after mount does not regenerate the linked
  `popovertarget`/`id` pair reactively beyond Vue's normal re-render, since both derive from the
  same computed.
- 2026-09-07 migration: moved from an unplaced top-level folder into `01.atoms/display-tooltip/`;
  converted options-style `defineProps` to `interface Props` + `withDefaults`; fixed a real
  accessibility bug where the trigger button's hover/focus-visible state set `outline-offset` but
  never an `outline-color` (it stayed `transparent`), so the focus indicator was never actually
  visible; fixed two custom properties (`--nuxt-text-header`, `--nuxt-text-accessibility-blue`)
  that referenced tokens never declared anywhere in this repo (same class of bug as
  `AnimatedSvgText`, CLAUDE.md pitfall #21) — both now default to the real `--theme-text` token;
  removed a dead, unused `ref="popover1"` template ref; added the missing
  `resetElementClasses`/`watch` pairing for `styleClassPassthrough` (present on every other
  component in this library but missing here); promoted ~20 previously-hardcoded values to public
  CSS tokens; the previously-dead `hideTooltipTrigger` ref (declared, never mutated) is now the
  `hideTrigger` prop.
- 2026-09-07 (same day, follow-up): the initial migration carried over the original's bare,
  under-styled look (raw `light-dark(black, white)` outline/text/background, no padding on the
  content wrapper, no shadow) — it worked but didn't read as "a tooltip." Reworked the popover's
  default appearance: background/text/border now use the library's neutral `--slate-*` scale
  instead of pure black/white; `.display-tooltip-popover-content` gained default `padding`,
  `display: flex; flex-direction: column;`, and `gap` (new `--display-tooltip-popover-padding`/
  `-content-gap` tokens); the popover gained a default elevation `box-shadow` (new
  `--display-tooltip-popover-shadow` token); the close button's permanent resting outline was
  dropped in favour of a normal border, with the outline reserved for hover/focus (matching the
  trigger button's own convention). All existing token names are unchanged — only their default
  values and two new tokens were added, so this is non-breaking for anyone who already overrode a
  token.
- File: `app/components/01.atoms/display-tooltip/DisplayTooltip.vue`
