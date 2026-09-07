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
| `--display-tooltip-popover-outline-width` | `0.1rem` | Popover panel outline width |
| `--display-tooltip-popover-outline-colour` | `light-dark(black, white)` | Popover panel outline colour |
| `--display-tooltip-popover-text-colour` | `light-dark(black, white)` | Popover panel text colour |
| `--display-tooltip-popover-background-colour` | `light-dark(white, black)` | Popover panel background |
| `--display-tooltip-popover-border-radius` | `0.8rem` | Popover panel corner radius |
| `--display-tooltip-popover-offset` | `0.1rem` | Gap between the trigger and the popover panel |
| `--display-tooltip-close-button-colour` | `var(--theme-text)` | Close button text colour (used by `DisplayTooltipDefined`) |
| `--display-tooltip-close-button-border-width` | `0.1rem` | Close button border width |
| `--display-tooltip-close-button-border-colour` | `var(--theme-border)` | Close button border colour |
| `--display-tooltip-close-button-outline-width` | `0.1rem` | Close button outline width |
| `--display-tooltip-close-button-outline-colour` | `var(--theme-ring)` | Close button outline colour |
| `--display-tooltip-close-button-border-colour-hover` | `var(--theme-surface)` | Close button border colour on hover/focus |
| `--display-tooltip-close-button-outline-colour-hover` | `var(--theme-surface)` | Close button outline colour on hover/focus |
| `--display-tooltip-close-button-padding` | `0.8rem 1.2rem` | Close button padding |

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
  `DisplayTooltip` usage supplies its own close affordance if it wants one.
