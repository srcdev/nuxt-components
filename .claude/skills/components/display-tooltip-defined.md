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
| `--display-tooltip-defined-title-colour` | `inherit` | `tooltipTitle` text colour |
| `--display-tooltip-defined-body-colour` | `inherit` | `tooltipContent` text colour |
| `--display-tooltip-defined-action-colour` | `inherit` | `tooltipAction` text colour |

Also renders every `--display-tooltip-*` token from the underlying `DisplayTooltip` — see its
CONSUMER-STYLING.md for the full list.

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
- File: `app/components/02.molecules/display-tooltip-defined/DisplayTooltipDefined.vue`
