# DisplayTooltip — Consumer Styling Guide

## Public token API

Private tokens (`--_anchor-name`, `--_trigger-icon-size`, `--_trigger-padding`,
`--_trigger-border-width`, and the script-written `--_anchor-top`, `--_anchor-right`,
`--_anchor-left-inverse`) are not public API.

### Trigger

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-padding-block` | `0.8rem` | Vertical padding around the trigger row |
| `--display-tooltip-trigger-gap` | `0.8rem` | Space between `triggerContent` slot and the trigger button |
| `--display-tooltip-trigger-icon-box-size` | `1.6rem` | Trigger icon width/height |
| `--display-tooltip-trigger-icon-colour` | `var(--theme-text)` | Trigger icon colour |
| `--display-tooltip-trigger-padding` | `0rem` | Space between the icon and the trigger button edge (single length, see note) |
| `--display-tooltip-trigger-border-width` | `0.1rem` | Trigger button border width |
| `--display-tooltip-trigger-border-colour` | `transparent` | Trigger button border colour |
| `--display-tooltip-trigger-border-radius` | `100vw` | Trigger button corner radius (circular by default) |
| `--display-tooltip-trigger-outline-width` | `0.1rem` | Trigger button focus/hover outline width |
| `--display-tooltip-trigger-outline-colour-hover` | `var(--theme-ring)` | Trigger button outline colour on hover/focus-visible |

### Popover panel

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-popover-width` | `30rem` | Popover panel width (capped at `100vw - 3.2rem`) |
| `--display-tooltip-popover-padding` | `1.2rem` | Popover panel content padding |
| `--display-tooltip-popover-content-gap` | `1.2rem` | Gap between stacked children in the `tooltipContent` slot |
| `--display-tooltip-popover-font-size` | `1.4rem` | Popover text size (`DisplayTooltipDefined` sets its own per-element sizes) |
| `--display-tooltip-popover-line-height` | `1.4` | Popover text line height |
| `--display-tooltip-popover-outline-width` | `0.1rem` | Popover panel outline (border) width |
| `--display-tooltip-popover-outline-colour` | `var(--slate-02)` | Popover panel outline (border) colour |
| `--display-tooltip-popover-text-colour` | `var(--slate-09)` | Popover panel text colour |
| `--display-tooltip-popover-background-colour` | `var(--slate-00)` | Popover panel background |
| `--display-tooltip-popover-border-radius` | `0.8rem` | Popover panel corner radius |
| `--display-tooltip-popover-shadow` | `0 0.4rem 1.6rem rgba(0,0,0,.12)` | Popover panel elevation shadow |
| `--display-tooltip-popover-offset` | `0.1rem` | Gap between the trigger and the popover panel |
| `--display-tooltip-popover-z-index` | `999999` | Panel stacking order in browsers without CSS anchor positioning. Ignored where the panel renders in the top layer |

The panel uses the neutral `--slate-*` scale rather than `--theme-*`, like `PopOver`: a tooltip
reads as a neutral overlay whatever the surrounding theme.

### Close button (`.display-tooltip-close-button`)

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-close-button-colour` | `var(--slate-09)` | Close button text colour |
| `--display-tooltip-close-button-border-width` | `0.1rem` | Close button border width |
| `--display-tooltip-close-button-border-colour` | `var(--slate-03)` | Close button border colour |
| `--display-tooltip-close-button-outline-width` | `0.1rem` | Close button outline width |
| `--display-tooltip-close-button-outline-colour` | `transparent` | Close button outline colour at rest (no permanent ring) |
| `--display-tooltip-close-button-border-colour-hover` | `var(--slate-06)` | Close button border colour on hover/focus-visible |
| `--display-tooltip-close-button-outline-colour-hover` | `var(--slate-06)` | Close button outline colour on hover/focus-visible |
| `--display-tooltip-close-button-padding` | `0.4rem 1rem` | Close button padding |

`DisplayTooltipDefined` renders this button. A plain `DisplayTooltip` gets the same styling by
giving its own close button the `display-tooltip-close-button` class inside `tooltipContent`.

> Changed 2026-10-18: `--display-tooltip-close-button-outline-colour` was documented but never read
> (the resting outline was hardcoded `transparent`); it now works. The hover styles apply on
> `:focus-visible` instead of `:focus`, so a mouse click no longer leaves the ring on.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `[data-hidden]` | `.display-tooltip-trigger-button` | `hide-trigger` is set: the button collapses to zero width, leaves the tab order and is `aria-hidden` |
| `:popover-open` | `.display-tooltip-popover` | Panel open (Popover API) |
| `.display-tooltip-popover-open` | `.display-tooltip-popover` | Panel open without the Popover API (Safari 16) |
| `[data-placement="left"]` | `.display-tooltip-popover` | Fallback placement flipped to the left of the trigger |

Inner classes: `.display-tooltip` (root), `.display-tooltip-trigger-wrapper`,
`.display-tooltip-trigger-button`, `.display-tooltip-trigger-icon`, `.display-tooltip-popover`,
`.display-tooltip-popover-content`.

> Changed 2026-10-18: the root class was `.display-tooltip-core` and is now `.display-tooltip`, and
> the hidden trigger's `.hide` class is now `[data-hidden]` (a bare `.hide` collided with consumers'
> utility classes). Update overrides written against the old names. Token names are unchanged.

---

## Global theming

```css
:where(html) {
  --display-tooltip-popover-background-colour: #1a1a1a;
  --display-tooltip-popover-text-colour: white;
  --display-tooltip-popover-outline-colour: transparent;
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.display-tooltip`, so tokens set on a
passthrough class reach the trigger and the panel:

```vue
<DisplayTooltip style-class-passthrough="promo-tooltip">...</DisplayTooltip>
```

---

## Notes

- Direct children of the `tooltipContent` slot have their block margins reset to `0` (inside
  `:where()`, so any margin you set on them still wins): the gap token is the only spacing between
  them. Before 2026-10-05 a slotted `<p>` kept its browser `1em` margins on top of the padding.
- Long unbroken text wraps (`overflow-wrap: anywhere`) in both the trigger row and the panel, and
  the trigger button never shrinks, so a long label stays beside it in a narrow column.
- The trigger button is vertically centred on the first line of `triggerContent` text, using
  `--display-tooltip-trigger-icon-box-size`, `-padding` and `-border-width` to work out its height.
  Give `--display-tooltip-trigger-padding` a single length (e.g. `0.4rem`): a two-value shorthand
  breaks that calculation, and the button is square anyway.
- Built on the native Popover API and CSS anchor positioning, with fallbacks: without anchor
  positioning (e.g. Safari 17–18) the panel is placed with `position: fixed` from the trigger's
  measured position and flips left (`.display-tooltip-popover[data-placement="left"]`) when there's
  no room on the right. Without the Popover API (Safari 16) it opens and closes in JS, shows via
  `.display-tooltip-popover-open` (style it in a separate rule from `:popover-open`: a selector list
  containing `:popover-open` is dropped whole where unsupported), isn't in the top layer (so the
  z-index token applies), and an ancestor with `transform`, `filter` or `contain` can misplace it.
  The trigger's `aria-expanded` tracks the open state in every browser.
- 2026-09-07: default colours switched from raw `light-dark(black, white)` to the library's
  neutral `--slate-*` scale, and the panel gained default padding, a flex column with a gap, and a
  default elevation shadow.
