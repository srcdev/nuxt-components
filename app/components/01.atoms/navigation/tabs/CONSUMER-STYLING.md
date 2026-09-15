# TabsCore — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--tabs-nav-border` | `0.1rem solid var(--slate-06)` | Border between the tab list and its content (bottom border on `axis="x"`, left border on `axis="y"`) |
| `--tabs-hover-indicator-colour` | `var(--slate-07)` | Background of the moving hover highlight (`trackHover`) |
| `--tabs-hover-indicator-text-colour` | `var(--slate-00)` | Text colour of a hovered tab trigger's label — keep this in contrast with `--tabs-hover-indicator-colour` |
| `--tabs-active-indicator-colour` | `var(--slate-09)` | Background of the moving active-tab highlight (`trackActive`) |
| `--tabs-active-indicator-text-colour` | `var(--slate-00)` | Fallback text colour of the active tab trigger's label — keep this in contrast with `--tabs-active-indicator-colour` |
| `--tabs-underline-indicator-colour` | `var(--slate-10)` | Colour of the underline/sideline indicator (`trackIndicator`) |
| `--tabs-underline-indicator-height` | `0.4rem` | Thickness of the underline indicator (`axis="x"`) — also used as its width on `axis="y"` |
| `--tabs-list-item-opacity` | `0.7` | Opacity of an inactive tab trigger |
| `--tabs-list-item-colour` | `var(--slate-10)` | Text colour of an inactive tab trigger |
| `--tabs-list-item-colour-selected` | falls back to `--tabs-active-indicator-text-colour` | Text colour of the active tab trigger — set this directly to override without touching `--tabs-active-indicator-text-colour` |
| `--tabs-list-item-text-transform` | `uppercase` | `text-transform` of tab trigger labels |
| `--tabs-list-item-font-weight` | `500` | Font weight of tab trigger labels |
| `--tabs-list-item-padding-block` | `1em` | Vertical padding of a tab trigger |
| `--tabs-list-item-padding-inline` | `2em` | Horizontal padding of a tab trigger |
| `--tabs-list-item-colour-transition-duration` | `100ms` | Transition duration of the trigger text-colour change |
| `--tabs-list-item-focus-outline-width` | `2px` | Focus outline width on a tab trigger/panel (colour is `--theme-ring`) |
| `--tabs-list-item-focus-outline-offset` | `-2px` | Focus outline offset on a tab trigger |
| `--tabs-content-background-colour` | `var(--slate-09)` | Background of the content panel wrapper |
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

## Colour tokens are flat values, not light-dark() pairs

Every colour token above defaults to a single flat `--slate-*` value rather than a
`light-dark(lightValue, darkValue)` pair — this component doesn't bake in automatic light/dark
scheme-switching for its own defaults. If you want a token to adapt to `color-scheme`, wrap your
own override in `light-dark()`:

```css
.my-page {
  --tabs-active-indicator-colour: light-dark(#1a1a1a, #f5f5f5);
}
```

## Tab-label text colour tracks the indicator behind it

Hover and active can have different background colours (`--tabs-hover-indicator-colour` vs.
`--tabs-active-indicator-colour`), so the trigger label uses two separate text-colour tokens
rather than one shared "selected" colour — otherwise overriding just one indicator's background
risks making the label unreadable against it while leaving the other state fine. If you override
either indicator background, override its matching text-colour token to keep contrast:

```css
.my-page {
  --tabs-hover-indicator-colour: gold;
  --tabs-hover-indicator-text-colour: black;
  --tabs-active-indicator-colour: navy;
  --tabs-active-indicator-text-colour: white;
}
```

## Tabs spanned by a jump keep their normal styling

When the active tab (or hover) jumps across several tabs at once (e.g. clicking tab 5 while tab 1
is active), the sliding indicator animates across the tabs in between, but their own labels are
**not** recoloured to the active/hover text colour during that transition — they keep their normal
inactive styling throughout. An earlier version force-applied the active text colour to every
spanned tab for the whole transition, on the assumption the sliding indicator visually covered them
the entire time — it doesn't (a forward jump grows the indicator gradually from the old tab's
position, so it only reaches later tabs partway through), so intermediate labels could end up a
colour that matched neither their own background nor the indicator yet, making them briefly
invisible. Fixed 2026-09-15.

Since a non-active tab keeps its normal inactive text colour throughout, and the active indicator
still visually passes under it while sliding, `--tabs-active-indicator-colour`'s default
(`var(--slate-09)`) is deliberately *not* the same value as `--tabs-list-item-colour`'s default
(`var(--slate-10)`) — they used to be identical, which meant a passed-over tab's text became
literally the same colour as the indicator sliding beneath it (invisible). If you override
`--tabs-active-indicator-colour`, check it still differs enough from `--tabs-list-item-colour` (or
override that too) to avoid the same collision recurring.

## Indicator visibility is prop-driven, not tokens

Whether the hover highlight, active highlight, and underline indicator render at all is controlled
by the `trackHover`/`trackActive`/`trackIndicator` boolean props (all default `true`), since they
also gate whether the underlying DOM nodes are created — not just their styling.

## Movement/position values are private

`--_x-active`, `--_x-hovered`, `--_width-active`, `--_width-hovered`, `--_y-active`, `--_y-hovered`,
`--_y-height`, `--_y-width`, and `--_transition-duration` are computed at runtime from the tab
elements' measured layout (`offsetLeft`/`offsetWidth`/etc. in `useTabs`) and aren't meaningful to
override directly — use `transitionDuration` (a prop, in ms) to control indicator movement speed.
