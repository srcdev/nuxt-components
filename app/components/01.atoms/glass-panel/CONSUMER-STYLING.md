# GlassPanel — Consumer Styling Guide

`GlassPanel` is a container with a frosted-glass look: translucent background, blurred and
saturated backdrop, thin border, soft shadow, and an angled highlight across the top-left.
The effect only reads as glass when the panel sits over an image, gradient or other
textured background. Over a flat colour it looks like a plain translucent card.

## Public token API

Every token has a built-in default (the light-mode glass values), so the panel works without any
setup.

| Token | Default | Controls |
|---|---|---|
| `--glass-panel-bg` | `rgba(255, 255, 255, 0.55)` | Background. Keep some transparency or the blur behind it won't show |
| `--glass-panel-border-width` | `1px` | Border width |
| `--glass-panel-border-color` | `rgba(255, 255, 255, 0.8)` | Border colour |
| `--glass-panel-border-radius` | `1rem` | Corner radius (the highlight follows it) |
| `--glass-panel-shadow` | `0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)` | `box-shadow` value |
| `--glass-panel-backdrop-filter` | `blur(14px) saturate(180%)` | `backdrop-filter` value. `none` turns the frosting off |
| `--glass-panel-highlight` | `rgba(255, 255, 255, 0.9)` | Colour at the start of the highlight gradient |
| `--glass-panel-highlight-angle` | `135deg` | Direction of the highlight gradient |
| `--glass-panel-highlight-stop` | `55%` | Where the highlight fades to transparent |

> **Changed 2026-09-26**: the defaults used to be set globally in `03.theming/_default.css` with
> `light-dark()`, which older iPad Safari doesn't support (the panel lost its background, border,
> shadow and highlight there). They now live in the component as light-mode values only. **There
> is no built-in dark-mode glass any more.** For a dark page, set your own values, e.g. the
> previous dark defaults:
>
> ```css
> [data-color-scheme="dark"] {
>   --glass-panel-bg: rgba(12, 12, 20, 0.45);
>   --glass-panel-border-color: rgba(255, 255, 255, 0.07);
>   --glass-panel-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
>   --glass-panel-highlight: rgba(255, 255, 255, 0.04);
> }
> ```
>
> (Using `light-dark()` in your own app CSS is also fine if your audience's browsers support it.)

---

## Global theming — app-level CSS file

```css
:where(html) {
  --glass-panel-bg: oklch(98% 0.005 15 / 0.6);
  --glass-panel-border-color: oklch(100% 0 0 / 0.75);
  --glass-panel-highlight: oklch(100% 0 0 / 0.85);
}
```

## Scoped overrides

```css
.pricing-page {
  .glass-panel {
    --glass-panel-border-radius: 2.4rem;
    --glass-panel-backdrop-filter: blur(24px) saturate(140%);
  }
}
```

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root `.glass-panel`.

## Layout notes

- `overflow: hidden` is set on the root, so anything that needs to escape the panel (tooltips,
  dropdowns, PendingEffect borders on buttons inside it) must be portalled or given room.
- The highlight is a `::before` layer behind the panel's content (`z-index: -1` inside an
  `isolation: isolate` root), so it tints the background but never washes out text, and
  `pointer-events: none` means it never blocks clicks. The root is its own stacking context, so a
  `z-index` on something inside the panel can't lift it above elements outside the panel.
