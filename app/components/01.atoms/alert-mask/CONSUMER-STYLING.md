# AlertMaskCore — Consumer Styling Guide

## No public CSS token API

`AlertMaskCore` draws its border/background via an SVG `<mask>` whose path geometry is computed
from measured content dimensions, so it can't expose colour/radius/thickness as CSS custom
properties the way most components do — a `var()` can't be interpolated into an SVG path or
resized reactively the way a `fill` attribute can. Instead, the override surface is the `config`
prop (`AlertMaskConfig`):

```vue
<AlertMaskCore
  :config="{
    backgroundColour: '#1a1a1a',
    borderColour: 'var(--theme-accent)',
    radiusLeft: 8,
    radiusRight: 4,
    borderLeft: 6,
    borderTop: 1,
    borderRight: 1,
    borderBottom: 1,
  }"
>
  <p>Alert content</p>
</AlertMaskCore>
```

All fields are optional and fall back to `backgroundColour: "rgba(0,0,0,0.25)"`,
`borderColour: "var(--orange-08)"`, `radiusLeft`/`radiusRight: 12`, `borderLeft`/`borderTop`/
`borderRight`/`borderBottom: 8`.

## Class passthrough

Use `styleClassPassthrough` to add classes to the root `.alert-mask-core` element for layout
purposes (positioning, sizing) — it doesn't affect the mask's own colours or geometry, which stay
governed by `config`.

```vue
<AlertMaskCore style-class-passthrough="my-alert-mask">...</AlertMaskCore>
```

## Internal (non-overridable) custom properties

`--_height`, `--_inset-inline-start`, `--_inset-inline-end`, `--_inset-block-start`, and
`--_inset-block-end` are set inline from measured content size and `config` border widths. They're
private implementation plumbing, not a consumer override surface — use `config` instead.
