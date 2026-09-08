---
name: DisplayTooltipDefined
description: DisplayTooltipDefined structured title/body/action tooltip content with close button, composes DisplayTooltip
type: reference
---

# DisplayTooltipDefined

## Overview

`DisplayTooltipDefined` composes [`DisplayTooltip`](display-tooltip.md), supplying a structured
title/body/action content shape (each rendered with a consumer-chosen tag) plus a built-in close
button wired to the popover's `popovertarget`. Use this when you want the standard tooltip content
layout without hand-building the `tooltipContent` slot markup each time; use plain `DisplayTooltip`
directly when you need full control over the popover's content.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltipId` | `string` | `""` | Base id for the popover. Prefixed with `nuxt-tooltip-` when provided; auto-generated via `useId()` (also prefixed) when omitted. |
| `contentText` | `TooltipContentText` | `{}` | Title/body/action content. Each field is optional — omitted fields render nothing. |
| `triggerAriaLabel` | `string` | `"Toggle the popover"` | Forwarded to the underlying `DisplayTooltip`'s `triggerAriaLabel` — override for localisation. |
| `closeButtonText` | `string` | `"Close"` | Visible text on the close button — override for localisation. |
| `closeButtonAriaLabel` | `string` | `"Close tool tip"` | aria-label on the close button — override for localisation. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the underlying `DisplayTooltip` root element. |

`TooltipContentText` is exported from `~/types/components`:

```ts
interface TooltipContentTextItem {
  tag: string;   // e.g. "h4", "p", "span"
  text: string;
}

interface TooltipContentText {
  tooltipTitle?: TooltipContentTextItem;
  tooltipContent?: TooltipContentTextItem;
  tooltipAction?: TooltipContentTextItem;
}
```

## Slots

| Slot | Description |
|------|-------------|
| `triggerContent` | Passed through to the underlying `DisplayTooltip`'s `triggerContent` slot. |

## Basic usage

```vue
<script setup lang="ts">
import type { TooltipContentText } from "~/types/components";

const contentText: TooltipContentText = {
  tooltipTitle: { tag: "h4", text: "Free delivery" },
  tooltipContent: { tag: "p", text: "Orders over £50 qualify for free standard delivery." },
  tooltipAction: { tag: "span", text: "See delivery policy" },
};
</script>

<template>
  <DisplayTooltipDefined :content-text="contentText" />
</template>
```

## CSS custom properties

| Property | Default | Controls |
|----------|---------|----------|
| `--display-tooltip-defined-content-gap` | `1.2rem` | Gap between title/body/action/close-button |
| `--display-tooltip-defined-title-colour` | `inherit` | `tooltipTitle` text colour |
| `--display-tooltip-defined-title-margin-block` | `0 0` | `tooltipTitle` block margin |
| `--display-tooltip-defined-title-font-size` | `1.6rem` | `tooltipTitle` font size |
| `--display-tooltip-defined-title-font-weight` | `700` | `tooltipTitle` font weight |
| `--display-tooltip-defined-title-line-height` | `120%` | `tooltipTitle` line height |
| `--display-tooltip-defined-title-letter-spacing` | `normal` | `tooltipTitle` letter spacing |
| `--display-tooltip-defined-body-colour` | `inherit` | `tooltipContent` text colour |
| `--display-tooltip-defined-body-margin-block` | `0 0` | `tooltipContent` block margin |
| `--display-tooltip-defined-body-font-size` | `1.3rem` | `tooltipContent` font size |
| `--display-tooltip-defined-body-font-weight` | `inherit` | `tooltipContent` font weight |
| `--display-tooltip-defined-body-line-height` | `140%` | `tooltipContent` line height |
| `--display-tooltip-defined-body-letter-spacing` | `normal` | `tooltipContent` letter spacing |
| `--display-tooltip-defined-action-colour` | `inherit` | `tooltipAction` text colour |
| `--display-tooltip-defined-action-margin-block` | `0 0` | `tooltipAction` block margin |
| `--display-tooltip-defined-action-font-size` | `1.4rem` | `tooltipAction` font size |
| `--display-tooltip-defined-action-font-weight` | `700` | `tooltipAction` font weight |
| `--display-tooltip-defined-action-line-height` | `130%` | `tooltipAction` line height |
| `--display-tooltip-defined-action-letter-spacing` | `normal` | `tooltipAction` letter spacing |
| `--display-tooltip-defined-close-button-margin-block` | `1.2rem 0` | Space above the close button |

Also renders every `--display-tooltip-*` token from the underlying `DisplayTooltip` — see its
CONSUMER-STYLING.md for the full list.

## Pairing with useTooltipsGuide

For a sequential, auto-advancing "guide" walkthrough (the pattern used in some guide intros — show
step 1, wait for dismissal, show step 2, ...), pair this component with
[`useTooltipsGuide`](../composable-tooltips-guide.md): put a ref on the container wrapping your
`DisplayTooltipDefined`/`DisplayTooltip` instances and pass it to the composable. The composable
only needs native `[popover]`/`popovertarget` markup, which both components already emit, so no
extra wiring is required beyond the container ref. See the `GuidedTour` story in
`DisplayTooltipDefined.stories.ts` for a full working example (it recreates the old
`app/pages/ui/tooltips.vue` demo page, removed 2026-08-23 when Storybook became the only demo
surface).

## Notes

- Auto-imported in Nuxt — no manual import needed.
- 2026-09-07 migration: moved from an unplaced top-level folder into
  `02.molecules/display-tooltip-defined/` (molecule tier, since it composes the `DisplayTooltip`
  atom); converted options-style `defineProps` to `interface Props` + `withDefaults`; moved the
  inline `TooltipContentText` interface out to `~/types/components/display-tooltip-defined.d.ts`
  so consumers can import it (inline `.vue` types aren't importable); fixed a dead CSS selector —
  the stylesheet targeted `.popover .popover-content .popover-content-defined`, but the actual
  rendered classes are `.display-tooltip-popover`/`.display-tooltip-popover-content`, so the rule
  never matched anything; replaced two custom properties referencing tokens never declared
  anywhere in this repo (`--nuxt-text-white-header`, `--nuxt-text-white-body`) with real public
  tokens defaulting to `inherit` (same class of bug as `AnimatedSvgText`, CLAUDE.md pitfall #21) —
  the title/body/action text had been rendering only by accident, via CSS falling back to the
  inherited colour when a `var()` reference is unresolvable, not by design.
- 2026-09-07 (same day, follow-up): `.popover-content-defined` gained `display: flex;
  flex-direction: column;` and a `gap` (new `--display-tooltip-defined-content-gap` token), and
  its close button is now right-aligned (`align-self: flex-end`) rather than sitting inline after
  the action text — part of the same visual-polish pass as `DisplayTooltip` itself (see its skill
  doc). Note `align-self` only works because `.popover-content-defined` (the button's actual DOM
  parent) is the flex container — the shared `.display-tooltip-popover-content` wrapper one level
  up is a different, outer flex context and can't align this button directly.
- 2026-09-07 (user follow-up): fixed a real spacing bug, not a preference tweak — `contentText.*.tag`
  lets the consumer pick any tag (`h3`, `h4`, `p`, ...), and a heading tag carries its own
  non-zero UA default `margin-block` (e.g. `1em`/`1em`), which was stacking on top of
  `.popover-content-defined`'s flex `gap` and visually doubling the space between title/body/action.
  `margin-block: 0 0` now resets that UA default on all three regardless of which tag is chosen, so
  `gap` is the only spacing mechanism — see the comment in the component. Also gave each of
  `tooltipTitle`/`tooltipContent`/`tooltipAction` a full typographic token set — `font-size`,
  `font-weight`, `line-height`, `letter-spacing`, and `margin-block` (all overridable, in case a
  consumer genuinely wants extra margin on top of `gap`) — rather than only `colour`. The close
  button gained its own `margin-block` token to separate it from the action text above it.
- File: `app/components/02.molecules/display-tooltip-defined/DisplayTooltipDefined.vue`
