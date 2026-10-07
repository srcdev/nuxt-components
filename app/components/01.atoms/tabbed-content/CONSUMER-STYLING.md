# TabbedContent — Consumer Styling Guide

> **Renamed 2026-10-07**: `TabsCore` → `TabbedContent`. Root class `.tabs-core` → `.tabbed-content`,
> and every inner class moved under the component prefix (see State hooks). Token names are
> unchanged (`--tabs-*`).

## Public token API

Colour defaults come from the `--theme-*` slots, so the component follows the site theme out of the
box.

> **Changed 2026-10-07**: colour defaults moved from fixed `--slate-*` steps to `--theme-*` slots.
> The content panel used to default to a dark `--slate-09` background with no text colour, so
> consumer text rendered dark on dark; it's now a light `--theme-surface-subtle` panel with
> `--theme-text`. The active highlight is `--theme-surface` (bold) with `--theme-on-surface` text,
> the underline is `--theme-accent`. To keep the old look, set the tokens below to the previous
> `--slate-*` values.

### Tab row

| Token | Default | Controls |
|---|---|---|
| `--tabs-nav-border` | `0.1rem solid color-mix(in oklch, var(--theme-text) 20%, transparent)` | Border between the tab row and the panels (bottom on `axis="x"`, left on `axis="y"`) |
| `--tabs-axis-y-gap` | `2em` | Gap between the tab column and the panels on `axis="y"` |
| `--tabs-axis-y-list-max-inline-size` | `50%` | Widest the tab column may get on `axis="y"`; long labels wrap inside it |

### Tab triggers

| Token | Default | Controls |
|---|---|---|
| `--tabs-list-item-colour` | `var(--theme-text)` | Text colour of an inactive trigger |
| `--tabs-list-item-opacity` | `0.7` | Opacity of an inactive trigger |
| `--tabs-list-item-colour-selected` | falls back to `--tabs-active-indicator-text-colour` | Text colour of the active trigger |
| `--tabs-list-item-text-transform` | `uppercase` | `text-transform` of trigger labels |
| `--tabs-list-item-font-weight` | `500` | Font weight of trigger labels |
| `--tabs-list-item-padding-block` | `1em` | Vertical padding of a trigger |
| `--tabs-list-item-padding-inline` | `2em` | Horizontal padding of a trigger |
| `--tabs-list-item-max-inline-size` | `24rem` | Widest a trigger may get on `axis="x"`; longer labels wrap inside it |
| `--tabs-list-item-colour-transition-duration` | `100ms` | Transition of the trigger text colour |
| `--tabs-list-item-focus-outline-offset` | `-0.2rem` | Focus outline offset on a trigger |
| `--tabs-focus-ring-width` | `0.2rem` | Focus outline width on triggers and panels |
| `--tabs-focus-ring-colour` | `var(--theme-border-focus)` | Focus outline colour on triggers and panels |

> **Changed 2026-10-07**: the focus outline used `--theme-ring`, the lightest theme step, which
> was close to invisible on a light page. It now defaults to `--theme-border-focus` behind the new
> `--tabs-focus-ring-colour` token. `--tabs-list-item-focus-outline-width` is replaced by
> `--tabs-focus-ring-width`.

### Moving indicators

| Token | Default | Controls |
|---|---|---|
| `--tabs-hover-indicator-colour` | `var(--theme-surface-subtle)` | Background of the hover highlight (`trackHover`) |
| `--tabs-hover-indicator-text-colour` | `var(--theme-text)` | Text colour of a hovered trigger; keep it in contrast with the hover background |
| `--tabs-active-indicator-colour` | `var(--theme-surface)` | Background of the active highlight (`trackActive`) |
| `--tabs-active-indicator-text-colour` | `var(--theme-on-surface)` | Text colour of the active trigger; keep it in contrast with the active background |
| `--tabs-underline-indicator-colour` | `var(--theme-accent)` | Colour of the underline/sideline (`trackIndicator`) |
| `--tabs-underline-indicator-height` | `0.4rem` | Thickness of the underline (`axis="x"`), also its width on `axis="y"` |
| `--tabs-hover-underline-indicator-colour` | `--tabs-underline-indicator-colour` | Colour of the thin underline/sideline that follows the hovered tab (`trackHover` and `trackIndicator`) |
| `--tabs-hover-underline-indicator-height` | `0.1rem` | Its thickness; `0` hides it. Sits under the active underline where they overlap |

### More menu (`overflowMode="menu"`, `axis="x"`)

| Token | Default | Controls |
|---|---|---|
| `--tabs-more-margin-inline-start` | `auto` | Pushes the More button to the end of the tab row; `0` keeps it straight after the last visible tab |
| `--tabs-more-trigger-padding-inline` | `1.2em` | Horizontal padding of the More button (vertical padding follows `--tabs-list-item-padding-block`); its colours follow the trigger tokens |
| `--tabs-more-icon-size` | `1.25em` | More button icon size (the `⋯` state) |
| `--tabs-more-chevron-size` | `1em` | Chevron after the active tab's label on the More button (flips while the menu is open) |
| `--tabs-more-popover-surface` | `var(--page-bg, var(--theme-surface-subtle))` | Menu background |
| `--tabs-more-popover-text-colour` | `var(--theme-text)` | Menu text colour |
| `--tabs-more-popover-border` | `0.1rem solid color-mix(in oklch, var(--theme-text) 20%, transparent)` | Menu border (shorthand) |
| `--tabs-more-popover-border-radius` | `0.6rem` | Menu corner radius |
| `--tabs-more-popover-shadow` | `0 0.4rem 1.6rem rgb(0 0 0 / 12%)` | Menu shadow |
| `--tabs-more-popover-min-inline-size` | `16rem` | Narrowest the menu gets (widest is `--tabs-list-item-max-inline-size`, capped to the viewport) |
| `--tabs-more-popover-max-block-size` | `70vh` | Tallest the menu gets before it scrolls |
| `--tabs-more-popover-distance` | `0.4rem` | Gap between the More button and the menu |
| `--tabs-more-popover-transition-duration` | `200ms` | Menu fade |
| `--tabs-more-popover-z-index` | `999999` | Stacking where the menu can't use the top layer (Safari 16) |
| `--tabs-more-item-padding-block` / `-inline` | `0.8em` / `1.2em` | Menu row padding |
| `--tabs-more-item-surface-hover` | `color-mix(in oklch, var(--theme-text) 8%, transparent)` | Menu row background on hover/focus |
| `--tabs-more-item-colour-selected` | `var(--theme-accent)` | Text colour of the menu row for the active tab |

### Panels

| Token | Default | Controls |
|---|---|---|
| `--tabs-content-background-colour` | `var(--theme-surface-subtle)` | Panel background |
| `--tabs-content-text-colour` | `var(--theme-text)` | Panel text colour |
| `--tabs-content-border-width` | `0.1rem` | Panel border width |
| `--tabs-content-border-colour` | `color-mix(in oklch, var(--theme-text) 20%, transparent)` | Panel border colour |
| `--tabs-content-border-radius` | `0` | Panel corner radius |

### Private tokens

`--_focus-ring` (composed from the two focus tokens), and the runtime values `useTabs` writes from
measured layout, per indicator (`active` / `hovered`): `--_{kind}-start` / `--_{kind}-end` (edge
insets from the bar's start and end along the axis), `--_{kind}-duration`,
`--_{kind}-start-delay` / `--_{kind}-end-delay`; each indicator reads them through its own
`--_start` / `--_end` / `--_duration` / `--_start-delay` / `--_end-delay`. Not public API; use the
`transitionDuration` prop for indicator speed (one edge moves for that long, then the other).

> **Changed 2026-10-08**: indicators were a bar-wide box moved with `translate` and sized with
> `scale` (`--_x-*`, `--_width-*`, `--_y-*`, a shared `--_transition-duration`), with a timer
> to "settle" after a stretch. Rightward moves changed both properties at once and could visibly
> step backwards. Each edge is now its own `left`/`right` (`top`/`bottom` on `axis="y"`) inset:
> the edge in the direction of travel moves first and the trailing edge follows after one
> duration, so the movement is the same both ways, with no timer.

---

## State hooks

| Hook | Where | Meaning |
|---|---|---|
| `.axis-x` / `.axis-y` | root `.tabbed-content` | The `axis` prop |
| `.overflow-menu` / `.overflow-scroll` | root | The `overflowMode` prop |
| `.tabbed-content-bar` | wraps the tablist, the More menu and the indicators | Carries `--tabs-nav-border`; scrolls sideways with `overflowMode="scroll"` |
| `.tabbed-content-list` | `role="tablist"` | The tab row/column |
| `.tabbed-content-trigger[hidden]` | trigger | Collapsed into the More menu |
| `.tabbed-content-more` / `.is-idle` | More menu wrapper | Idle (measured but invisible) while every tab fits |
| `.tabbed-content-more-trigger` / `.is-active` | More button | `.is-active` while the active tab is one of the collapsed ones: the button shows that tab's label (`.tabbed-content-more-label`) and a chevron instead of `⋯`, takes the normal tab padding, and the indicators sit on it |
| `.tabbed-content-more-popover` | menu popover | Open: `:popover-open`, or `.tabbed-content-more-popover-open` without the Popover API (style the two in separate rules) |
| `.tabbed-content-more-item[aria-checked="true"]` | menu row | The active tab's row |
| `.tabbed-content-trigger` | each `role="tab"` button | A tab trigger |
| `.tabbed-content-trigger[aria-selected="true"]` | trigger | The active tab |
| `.tracks-active` | root | `trackActive` is on: label colour follows `[data-under-active]` instead of `aria-selected` |
| `[data-under-active]` | trigger, More button | The active highlight covers at least half of it right now (updated every frame while it slides) |
| `.tabbed-content-indicator-hover` / `-active` / `-underline` / `-underline-hover` | inside `.tabbed-content-bar` | The moving indicators, rendered only when their `track*` prop is on (`-underline-hover` needs both `trackHover` and `trackIndicator`) |
| `.tabbed-content-panels` | panel wrapper | Background, border and text colour live here |
| `.tabbed-content-panel` / `[hidden]` | each `role="tabpanel"` | A panel; inactive ones carry `hidden` |

> **Changed 2026-10-07**: `.tabs-list` → `.tabbed-content-list` (now a `<div>`, was a `<ul>` with
> `<li>`s), `.tabs-list-item` → `.tabbed-content-trigger`, `.nav__hovered` / `.nav__active` /
> `.nav__active-indicator` → `.tabbed-content-indicator-hover` / `-active` / `-underline`,
> `.tab-content-wrapper` → `.tabbed-content-panels`, `.tab-content` → `.tabbed-content-panel`.
> Inactive panels use the `hidden` attribute instead of inline `display: none` and `aria-hidden`.

---

## Tab-label text colour tracks the indicator behind it

Hover and active can have different backgrounds, so the trigger label has a text-colour token per
state. If you override either indicator background, override its matching text-colour token too:

```css
.my-page {
  --tabs-hover-indicator-colour: gold;
  --tabs-hover-indicator-text-colour: black;
  --tabs-active-indicator-colour: navy;
  --tabs-active-indicator-text-colour: white;
}
```

With `trackActive` on, label colour follows what's actually behind each tab while the active
highlight slides: a tab it covers by at least half (`[data-under-active]`) takes the active text
colour, and the newly selected tab keeps its resting colour until the highlight reaches it. So a
jump from tab 1 to tab 5 never puts dark text on the dark highlight, or light text on the light
row. With `trackActive` off there's no moving highlight, and `aria-selected` sets the colour as
before.

> **Changed 2026-10-08**: passed-over labels used to keep their resting colour while the active
> highlight slid under them (dark on dark), and the selected tab turned light before the
> highlight arrived (light on light).

---

## Indicator visibility is prop-driven

Whether each indicator renders is set by `trackHover` / `trackActive` / `trackIndicator`, not
tokens. They can change after mount.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` classes land on the root `.tabbed-content`, so tokens set on that class
reach every part of the component.

> **Changed 2026-10-07**: passthrough classes used to land on the tab list, not the root, so tokens
> set on them never reached the panels.

---

## Notes

- **Dark mode**: defaults are light-only, like the rest of the library. Override the `--theme-*`
  slots (or these tokens) in your own dark scheme; `light-dark()` in your own override values is
  fine, it's only kept out of the library's defaults.
- **Right-to-left**: indicators are positioned from measured `offsetLeft`, so they line up in RTL,
  but arrow keys aren't mirrored (ArrowRight always moves to the next tab in DOM order).
