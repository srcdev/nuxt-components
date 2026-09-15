# TabsCore — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--tabs-nav-border` | `0.1rem solid var(--slate-06)` | Border between the tab list and its content (bottom border on `axis="x"`, left border on `axis="y"`) |
| `--tabs-hover-indicator-colour` | `light-dark(var(--slate-07), var(--slate-03))` | Background of the moving hover highlight (`trackHover`) |
| `--tabs-hover-indicator-text-colour` | `light-dark(var(--slate-00), var(--slate-10))` | Text colour painted under the hover highlight |
| `--tabs-active-indicator-colour` | `light-dark(var(--slate-10), var(--slate-00))` | Background of the moving active-tab highlight (`trackActive`) |
| `--tabs-active-indicator-text-colour` | `light-dark(var(--slate-00), var(--slate-10))` | Text colour painted under the active highlight |
| `--tabs-underline-indicator-colour` | `light-dark(var(--slate-10), var(--slate-00))` | Colour of the underline/sideline indicator (`trackIndicator`) |
| `--tabs-underline-indicator-height` | `0.4rem` | Thickness of the underline indicator (`axis="x"`) — also used as its width on `axis="y"` |
| `--tabs-list-item-opacity` | `0.7` | Opacity of an inactive tab trigger |
| `--tabs-list-item-colour` | `light-dark(var(--slate-10), var(--slate-00))` | Text colour of an inactive tab trigger |
| `--tabs-list-item-colour-selected` | `light-dark(var(--slate-00), var(--slate-10))` | Text colour of a hovered, active, or transitioning tab trigger |
| `--tabs-list-item-text-transform` | `uppercase` | `text-transform` of tab trigger labels |
| `--tabs-list-item-font-weight` | `500` | Font weight of tab trigger labels |
| `--tabs-list-item-padding-block` | `1em` | Vertical padding of a tab trigger |
| `--tabs-list-item-padding-inline` | `2em` | Horizontal padding of a tab trigger |
| `--tabs-list-item-colour-transition-duration` | `100ms` | Transition duration of the trigger text-colour change |
| `--tabs-list-item-focus-outline-width` | `2px` | Focus outline width on a tab trigger/panel (colour is `--theme-ring`) |
| `--tabs-list-item-focus-outline-offset` | `-2px` | Focus outline offset on a tab trigger |
| `--tabs-content-background-colour` | `light-dark(var(--slate-09), var(--slate-10))` | Background of the content panel wrapper |
| `--tabs-content-border-width` | `0.1rem` | Border/outline width of the content panel wrapper |
| `--tabs-content-border-colour` | `var(--slate-06)` | Border/outline colour of the content panel wrapper |
| `--tabs-content-border-radius` | `0` | Corner radius of the content panel wrapper |
| `--tabs-axis-y-gap` | `2em` | Gap between the tab list and content when `axis="y"` |

```css
.my-page {
  --tabs-active-indicator-colour: #1a1a1a;
  --tabs-underline-indicator-colour: #b5651d;
  --tabs-content-border-radius: 0.8rem;
}
```

## Indicator visibility is prop-driven, not tokens

Whether the hover highlight, active highlight, and underline indicator render at all is controlled
by the `trackHover`/`trackActive`/`trackIndicator` boolean props (all default `true`), since they
also gate whether the underlying DOM nodes are created — not just their styling.

## Movement/position values are private

`--_x-active`, `--_x-hovered`, `--_width-active`, `--_width-hovered`, `--_y-active`, `--_y-hovered`,
`--_y-height`, `--_y-width`, and `--_transition-duration` are computed at runtime from the tab
elements' measured layout (`offsetLeft`/`offsetWidth`/etc. in `useTabs`) and aren't meaningful to
override directly — use `transitionDuration` (a prop, in ms) to control indicator movement speed.
