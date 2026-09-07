# DisplayTooltip — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-padding-block` | `0.8rem` | Vertical padding around the trigger row |
| `--display-tooltip-trigger-gap` | `0.8rem` | Space between `triggerContent` slot and the trigger button |
| `--display-tooltip-trigger-icon-box-size` | `2rem` | Trigger icon's box width/height |
| `--display-tooltip-trigger-icon-font-size` | `1.8rem` | Trigger icon glyph size |
| `--display-tooltip-trigger-icon-colour` | `var(--theme-text)` | Trigger icon colour |
| `--display-tooltip-trigger-outline-width` | `0.1rem` | Trigger button focus/hover outline width |
| `--display-tooltip-trigger-outline-colour-hover` | `var(--theme-ring)` | Trigger button outline colour on hover/focus-visible |
| `--display-tooltip-popover-width` | `30rem` | Popover panel width |
| `--display-tooltip-popover-padding` | `1.2rem` | Popover panel content padding |
| `--display-tooltip-popover-content-gap` | `1.2rem` | Gap between stacked children in the `tooltipContent` slot |
| `--display-tooltip-popover-outline-width` | `0.1rem` | Popover panel outline (border) width |
| `--display-tooltip-popover-outline-colour` | `light-dark(var(--slate-02), var(--slate-06))` | Popover panel outline (border) colour |
| `--display-tooltip-popover-text-colour` | `light-dark(var(--slate-09), var(--slate-01))` | Popover panel text colour |
| `--display-tooltip-popover-background-colour` | `light-dark(var(--slate-00), var(--slate-07))` | Popover panel background |
| `--display-tooltip-popover-border-radius` | `0.8rem` | Popover panel corner radius |
| `--display-tooltip-popover-shadow` | `light-dark(0 0.4rem 1.6rem rgba(0,0,0,.12), 0 0.4rem 1.6rem rgba(0,0,0,.5))` | Popover panel elevation shadow |
| `--display-tooltip-popover-offset` | `0.1rem` | Gap between the trigger and the popover panel |
| `--display-tooltip-close-button-colour` | `light-dark(var(--slate-09), var(--slate-01))` | Close button text colour (used by `DisplayTooltipDefined`) |
| `--display-tooltip-close-button-border-width` | `0.1rem` | Close button border width |
| `--display-tooltip-close-button-border-colour` | `light-dark(var(--slate-03), var(--slate-06))` | Close button border colour |
| `--display-tooltip-close-button-outline-width` | `0.1rem` | Close button outline width |
| `--display-tooltip-close-button-outline-colour` | `transparent` | Close button outline colour at rest (no permanent ring) |
| `--display-tooltip-close-button-border-colour-hover` | `light-dark(var(--slate-06), var(--slate-03))` | Close button border colour on hover/focus |
| `--display-tooltip-close-button-outline-colour-hover` | `light-dark(var(--slate-06), var(--slate-03))` | Close button outline colour on hover/focus |
| `--display-tooltip-close-button-padding` | `0.4rem 1rem` | Close button padding |

```css
.my-page {
  --display-tooltip-popover-background-colour: #1a1a1a;
  --display-tooltip-popover-text-colour: white;
  --display-tooltip-popover-outline-colour: transparent;
}
```

Or scope to a single instance via `styleClassPassthrough`:

```vue
<DisplayTooltip style-class-passthrough="promo-tooltip">...</DisplayTooltip>
```

## Notes

- Built on the native Popover API (`popover`/`popovertarget`) and CSS anchor-positioning
  (`anchor-name`/`position-anchor`/`anchor()`) — check current browser support before relying on
  it where broad support is a hard requirement.
- The `.display-tooltip-close-button` styled here is rendered by `DisplayTooltipDefined`, not this
  component directly — `DisplayTooltip` only provides the `tooltipContent` slot, so a plain
  `DisplayTooltip` usage supplies its own close affordance if it wants one (give it
  `style="align-self: flex-end;"` or a class to right-align it within the content's flex column,
  same as `DisplayTooltipDefined` does internally).
- 2026-09-07: default colours switched from raw `light-dark(black, white)` to the library's
  neutral `--slate-*` scale, and `.display-tooltip-popover-content` gained default `padding`,
  `display: flex; flex-direction: column;`, and `gap` (previously unstyled, meaning content sat
  flush against the panel edges) plus the popover gained a default elevation `box-shadow`
  (previously none) — the out-of-the-box look was flat and under-styled before this. All of these
  remain overridable via the tokens above.
