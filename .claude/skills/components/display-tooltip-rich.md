---
name: DisplayTooltipRich
description: DisplayTooltipRich (Material 3 "rich tooltip", renamed from DisplayTooltipDefined) structured title/body/action tooltip content with close button, composes DisplayTooltip
type: reference
---

# DisplayTooltipRich

## Overview

`DisplayTooltipRich` composes [`DisplayTooltip`](display-tooltip.md), supplying a structured
title/body/action content shape (each rendered with a consumer-chosen tag) plus a built-in close
button wired to the popover's `popovertarget` and to `DisplayTooltip`'s scoped `close()`, so it also
closes the tooltip on Safari 16 (no Popover API). Use this when you want the standard tooltip content
layout without hand-building the `tooltipContent` slot markup each time; use plain `DisplayTooltip`
directly when you need full control over the popover's content.

The name follows Material 3's **rich tooltip** (subhead, supporting text, optional action, as
opposed to a plain one-line tooltip). Renamed from `DisplayTooltipDefined` on 2026-10-18: every
`display-tooltip-defined` class and `--display-tooltip-defined-*` token became `display-tooltip-rich`,
with the same suffixes and defaults. Older notes below use the new component name but keep the
class names of their date (`.popover-content-defined` is today's `.display-tooltip-rich-content`).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tooltipId` | `string` | `""` | Base id for the popover. Prefixed with `nuxt-tooltip-` when provided; when empty, an id generated once at setup via `useId()` (also prefixed) is used. Reactive. |
| `contentText` | `TooltipContentText` | `{}` | Title/body/action content. Each field is optional: omitted fields render nothing. An empty `tag` falls back to `p` (title, body) or `span` (action). Text renders as text, never HTML. |
| `triggerAriaLabel` | `string` | `"Toggle the popover"` | Forwarded to the underlying `DisplayTooltip`'s `triggerAriaLabel` — override for localisation. |
| `triggerIcon` | `string` | `undefined` | Forwarded to `DisplayTooltip`'s `triggerIcon` (its default question-mark icon when unset). |
| `closeButtonText` | `string` | `"Close"` | Visible text on the close button — override for localisation. |
| `closeButtonAriaLabel` | `string` | `"Close tool tip"` | aria-label on the close button: override for localisation, and keep the visible `closeButtonText` inside it (WCAG 2.5.3, label in name). |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes on the underlying `DisplayTooltip` root, which always also carries `display-tooltip-rich`. |

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
  <DisplayTooltipRich :content-text="contentText" />
</template>
```

## Close button

An `InputButton` (`variant="inline"`, `type="button"`) with the `.display-tooltip-close-button`
class. It carries `popovertarget` and `popovertargetaction="hide"` (which `useTooltipsGuide` looks
for) and calls `DisplayTooltip`'s scoped `close()`, so it also works without the Popover API.

## CSS custom properties

See `CONSUMER-STYLING.md` for the full `--display-tooltip-rich-*` list: per-field colour,
margin, font size and weight, line height, letter spacing and a `*-line-clamp` token (default
`none`) for the title, body and action, plus the content gap and the close button's top margin.
Every `--display-tooltip-*` token from the underlying `DisplayTooltip` applies too.

## Pairing with useTooltipsGuide

For a sequential, auto-advancing "guide" walkthrough (the pattern used in some guide intros — show
step 1, wait for dismissal, show step 2, ...), pair this component with
[`useTooltipsGuide`](../composable-tooltips-guide.md): put a ref on the container wrapping your
`DisplayTooltipRich`/`DisplayTooltip` instances and pass it to the composable. The composable
only needs native `[popover]`/`popovertarget` markup, which both components already emit, so no
extra wiring is required beyond the container ref. See the `GuidedTour` story in
`DisplayTooltipRich.stories.ts` for a full working example.

## Notes

- Auto-imported in Nuxt — no manual import needed.
- 2026-09-07 migration: moved from an unplaced top-level folder into
  `02.molecules/display-tooltip-rich/` (molecule tier, since it composes the `DisplayTooltip`
  atom); converted options-style `defineProps` to `interface Props` + `withDefaults`; moved the
  inline `TooltipContentText` interface out to `~/types/components/display-tooltip-rich.d.ts`
  so consumers can import it (inline `.vue` types aren't importable); fixed a dead CSS selector —
  the stylesheet targeted `.popover .popover-content .popover-content-defined`, but the actual
  rendered classes are `.display-tooltip-popover`/`.display-tooltip-popover-content`, so the rule
  never matched anything; replaced two custom properties referencing tokens never declared
  anywhere in this repo (`--nuxt-text-white-header`, `--nuxt-text-white-body`) with real public
  tokens defaulting to `inherit` (same class of bug as `AnimatedSvgText`, CLAUDE.md pitfall #21) —
  the title/body/action text had been rendering only by accident, via CSS falling back to the
  inherited colour when a `var()` reference is unresolvable, not by design.
- 2026-09-07 (same day, follow-up): `.popover-content-defined` gained `display: flex;
  flex-direction: column;` and a `gap` (new `--display-tooltip-rich-content-gap` token), and
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
- 2026-10-18 migration: generic classes `.popover-content-defined`, `.tooltip-title`,
  `.tooltip-body`, `.tooltip-action` renamed to `.display-tooltip-rich-content`, `-title`,
  `-body`, `-action`, and the root gained `.display-tooltip-rich`; undefined utility classes
  (`subtitle-sm`, `body-sm`, `input-value`) removed; the close button is now an `InputButton` (it
  had no `type`, so it submitted surrounding forms), and its right alignment and margin finally
  apply (`DisplayTooltip`'s `all: unset` close-button rule out-specified them, stretching it full
  width); the generated id is created once at setup instead of inside a `computed`; new
  `triggerIcon` prop, empty-tag fallback, `*-line-clamp` tokens and wrapping for worst-case content.
- File: `app/components/02.molecules/display-tooltip-rich/DisplayTooltipRich.vue`
