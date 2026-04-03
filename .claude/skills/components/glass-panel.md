---
name: GlassPanel
description: GlassPanel props, slots, CSS token API, and theming override
type: reference
---

# GlassPanel

## Overview

`GlassPanel` is a semantic container with a frosted-glass visual effect — blurred background, border, drop shadow, and an angled specular highlight on the top-left corner. All visual properties are driven by CSS custom properties so they can be overridden per-theme.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tag` | `"div" \| "section" \| "article" \| "main" \| "header" \| "footer"` | `"div"` | Rendered HTML element |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root element |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Panel content |

## Basic usage

```vue
<GlassPanel tag="section" :style-class-passthrough="['p-8']">
  <p>Content here</p>
</GlassPanel>
```

## CSS token API

All four tokens must be defined — the component has no built-in fallbacks.

| Token | What it controls |
|-------|-----------------|
| `--glass-panel-bg` | Panel background (use `rgba` / `oklch` with alpha for the glass effect) |
| `--glass-panel-border-color` | 1px border colour (typically a translucent white) |
| `--glass-panel-shadow` | `box-shadow` value |
| `--glass-panel-highlight` | Colour of the `135deg` specular gradient overlay (`::before`) |

## Layer defaults

**Light mode** (`:root` / `[data-color-scheme="light"]`):
```css
--glass-panel-bg:           rgba(255, 255, 255, 0.55);
--glass-panel-border-color: rgba(255, 255, 255, 0.8);
--glass-panel-shadow:       0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
--glass-panel-highlight:    rgba(255, 255, 255, 0.9);
```

**Dark mode** (`[data-color-scheme="dark"]`):
```css
--glass-panel-bg:           rgba(12, 12, 20, 0.45);
--glass-panel-border-color: rgba(255, 255, 255, 0.07);
--glass-panel-shadow:       0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
--glass-panel-highlight:    rgba(255, 255, 255, 0.04);
```

## Overriding in a consuming app

Add overrides to `app/assets/styles/setup/03.theming/default/_light.css` and `_dark.css`.

For this site the background is dark/warm, so the dark-mode values are the primary brand values. Warm rose tints work well for the border and highlight:

```css
/* _dark.css — example warm-rose override */
--glass-panel-bg:           oklch(12% 0.01 15 / 0.5);   /* warm near-black, semi-transparent */
--glass-panel-border-color: oklch(60% 0.06 15 / 0.15);  /* muted rose border */
--glass-panel-shadow:       0 8px 32px oklch(0% 0 0 / 0.6), 0 2px 8px oklch(0% 0 0 / 0.4);
--glass-panel-highlight:    oklch(80% 0.04 15 / 0.06);  /* faint rose specular */
```

```css
/* _light.css — example warm-rose override */
--glass-panel-bg:           oklch(98% 0.005 15 / 0.6);
--glass-panel-border-color: oklch(100% 0 0 / 0.75);
--glass-panel-shadow:       0 8px 32px oklch(0% 0 0 / 0.06), 0 2px 8px oklch(0% 0 0 / 0.03);
--glass-panel-highlight:    oklch(100% 0 0 / 0.85);
```

## Notes

- The `backdrop-filter: blur(14px) saturate(180%)` is baked into the component — the blurred-background effect only looks right when the panel is layered over an image or textured background.
- `overflow: hidden` is set on the root — ensure content that needs to escape (e.g. tooltips, dropdowns) is portalled outside.
- The `::before` highlight overlay is `pointer-events: none` so it never blocks clicks.
