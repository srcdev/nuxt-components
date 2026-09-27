---
name: AlertMaskCore
description: AlertMaskCore SVG border/background mask sized to slotted content; config-prop-driven geometry/colour, no CSS token API
type: reference
---

# AlertMaskCore

## Overview

`AlertMaskCore` draws a border + background around its default slot content using an SVG `<mask>`,
sized to the content's measured dimensions via `ResizeObserver`. It's the low-level primitive
`AlertMaskedContent` (`app/components/02.molecules/alert-masked-content/`) builds on for its
accent-bordered alert shape.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `AlertMaskConfig` | `{}` | Border/background colour and geometry (see below). All fields optional. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

### `AlertMaskConfig` (`app/types/components/alert-mask-core.d.ts`)

| Field | Type | Default | Description |
|---|---|---|---|
| `backgroundColour` | `string` | `"rgba(0,0,0,0.25)"` | Inner fill colour. |
| `borderColour` | `string` | `"var(--orange-08)"` | Border fill colour. |
| `radiusLeft` | `number` | `12` | Left-side corner radius (px). |
| `radiusRight` | `number` | `12` | Right-side corner radius (px). |
| `borderLeft` | `number` | `8` | Left border thickness (px). |
| `borderTop` | `number` | `8` | Top border thickness (px). |
| `borderRight` | `number` | `8` | Right border thickness (px). |
| `borderBottom` | `number` | `8` | Bottom border thickness (px). |

## Basic usage

```vue
<AlertMaskCore>
  <p>Alert content</p>
</AlertMaskCore>

<AlertMaskCore
  :config="{
    borderColour: 'var(--theme-accent)',
    backgroundColour: 'rgba(0, 0, 0, 0.3)',
    radiusLeft: 8,
    radiusRight: 4,
    borderLeft: 6,
    borderTop: 1,
    borderRight: 1,
    borderBottom: 1,
  }"
>
  <p>Accent-bordered alert content</p>
</AlertMaskCore>
```

## How it works

- The default-slot content is measured via `ResizeObserver` (initial measurement runs after
  `nextTick` on mount).
- An SVG outer path (rounded rect using `radiusLeft`/`radiusRight`) and inner path (the same rect
  inset by the border thicknesses) are computed from that measurement, and the region between them
  is masked to `borderColour`; the inner region is filled with `backgroundColour`.
- Each instance gets its own mask id (`alert-mask-<useId>`), so several masks on one page don't
  share a shape. The SVG is `aria-hidden`.
- `borderColour`/`backgroundColour` are applied as `fill` **styles**, not attributes, so a `var()`
  value (e.g. `var(--theme-accent)`, or a consumer token) resolves against the element's ancestors.
  A `var(--theme-*)` colour needs a `data-theme` ancestor to resolve.
- The `ResizeObserver` is disconnected on unmount.
- The slot content itself sits in a separate `.alert-mask-content` div, inset by the same border
  thicknesses via internal `--_inset-*` custom properties, so it visually sits inside the drawn
  border without overlapping it.

## No CSS token API

Unlike most components in this library, `AlertMaskCore` has no public `--alert-mask-core-*` CSS
custom properties — the SVG path geometry can't be driven by `var()`, so `config` is the entire
override surface (colour included). Colour strings may be `var()` references, so a wrapper
component can expose its own tokens through them (as `AlertMaskedContent` does with
`--alert-masked-content-border-colour`/`-background`). See CONSUMER-STYLING.md.

## Notes

- 2026-09-20 migration: moved from `app/components/alert-mask/` (unplaced) into
  `01.atoms/alert-mask/`; converted from options-style `defineProps({...})` to
  `interface Props` + `withDefaults`; renamed the internal `--alertHeight`/`--insetInlineStart`/
  `--insetInlineEnd`/`--insetBlockStart`/`--insetBlockEnd` custom properties to private
  `--_height`/`--_inset-inline-start`/`--_inset-inline-end`/`--_inset-block-start`/
  `--_inset-block-end` (they're JS-computed plumbing, not a consumer override surface — `config`
  already covers that). No behaviour change.
- Changed 2026-09-27: the mask id was a hardcoded `borderMask`, so with more than one instance on a
  page (e.g. stacked masked toasts) every instance used the first one's mask shape; now unique per
  instance via `useId()`. Also: SVG marked `aria-hidden`, colours applied as `fill` styles so `var()`
  resolves reliably, and the `ResizeObserver` is disconnected on unmount (it previously leaked).
  Stories now render over a photo/gradient backdrop with a `data-theme` wrapper; on the plain canvas
  they looked flat grey.
