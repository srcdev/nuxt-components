---
name: AlertMask
description: AlertMask SVG border and fill sized to slotted content; config-prop geometry, --alert-mask-* colour tokens
type: reference
---

# AlertMask

> **Renamed 2026-10-17**: `AlertMaskCore` → `AlertMask` (Control/Field naming), root class
> `.alert-mask-core` → `.alert-mask`, types file `alert-mask-core.d.ts` → `alert-mask.d.ts`
> (`AlertMaskConfig` unchanged). Props and slot unchanged.

## Overview

`AlertMask` draws a border + background around its default slot content using an SVG `<mask>`,
sized to the content's measured dimensions via `ResizeObserver`. It's the low-level primitive
`AlertMaskedContent` (`app/components/02.molecules/alert-masked-content/`) builds on for its
accent-bordered alert shape.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `AlertMaskConfig` | `{}` | Border/background colour and geometry (see below). All fields optional. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element. |

### `AlertMaskConfig` (`app/types/components/alert-mask.d.ts`)

| Field | Type | Default | Description |
|---|---|---|---|
| `backgroundColour` | `string` | token `--alert-mask-background-colour` | Inner fill colour; overrides the token. |
| `borderColour` | `string` | token `--alert-mask-border-colour` | Border fill colour; overrides the token. |
| `radiusLeft` | `number` | `12` | Left-side corner radius (px). |
| `radiusRight` | `number` | `12` | Right-side corner radius (px). |
| `borderLeft` | `number` | `8` | Left border thickness (px). |
| `borderTop` | `number` | `8` | Top border thickness (px). |
| `borderRight` | `number` | `8` | Right border thickness (px). |
| `borderBottom` | `number` | `8` | Bottom border thickness (px). |

Sides are physical, matching the drawn path. Negative or non-finite sizes fall back to `0` and the
default respectively; radii are clamped to half the box's smaller side (inner radii to the inner
box), and borders that leave no inner box drop the fill.

## Basic usage

```vue
<AlertMask>
  <p>Alert content</p>
</AlertMask>

<AlertMask
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
</AlertMask>
```

## How it works

- The default-slot content is measured via `ResizeObserver` (initial measurement runs after
  `nextTick` on mount). Only the content size is stored; the SVG size is computed from it plus the
  current borders, so a `config` change redraws without waiting for a resize. Nothing draws until
  the first measurement.
- An SVG outer path (rounded rect using `radiusLeft`/`radiusRight`) and inner path (the same rect
  inset by the border thicknesses) are computed from that measurement, and the region between them
  is masked to `borderColour`; the inner region is filled with `backgroundColour`.
- Each instance gets its own mask id (`alert-mask-<useId>`), so several masks on one page don't
  share a shape. The SVG is `aria-hidden`.
- Colours come from `--alert-mask-border-colour` / `--alert-mask-background-colour` (theme
  defaults). A `config` colour is applied as an inline `fill` **style**, so it wins and a `var()`
  value resolves against the element's ancestors.
- The `ResizeObserver` is disconnected on unmount.
- The slot content itself sits in a separate `.alert-mask-content` div, inset by the same border
  thicknesses via private `--_inset-left|right|top|bottom` (physical `margin`, so right-to-left
  layouts keep the content clear of a left accent bar).

## Styling

Colour tokens `--alert-mask-border-colour` and `--alert-mask-background-colour`; geometry through
`config`. `AlertMaskedContent` passes both colours through `config` from its own
`--alert-masked-content-*` tokens. See CONSUMER-STYLING.md.

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
- 2026-10-17 migration: renamed from `AlertMaskCore`. Fixed: content margins used `0` when
  `config` omitted a border while the path used the default `8` (content overlapped the border);
  the SVG size only updated on a content resize, so a `config` border change left it stale; no
  clamping, so an oversized radius or negative border drew a broken path; content margins were
  logical while the path is physical (right-to-left content overlapped the left accent bar);
  passthrough didn't react. Colours became `--alert-mask-*` tokens with `--theme-*` defaults.
  The snippet's tab stops (`$38` read as stop 38) were fixed. `StressTest` story added.
