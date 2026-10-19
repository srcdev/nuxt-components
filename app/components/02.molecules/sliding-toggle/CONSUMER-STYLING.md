# SlidingToggle — Consumer Styling Guide

## Public token API

### Track

| Token | Default | Controls |
|---|---|---|
| `--sliding-toggle-surface` | `var(--theme-surface-subtle)` | Track background |
| `--sliding-toggle-padding` | `0.4rem` | Space between the track edge and the options (the indicators sit inside it too) |
| `--sliding-toggle-gap` | `0.4rem` | Space between options |
| `--sliding-toggle-border-radius` | `0.8rem` | Track corner radius |
| `--sliding-toggle-corner-shape` | `round` | `corner-shape` of the track, both indicators and the options (`squircle`, `superellipse(n)`, `bevel`, `scoop`, `notch`). Chromium 139+ only; other browsers ignore it and keep `border-radius` |

### Indicators

| Token | Default | Controls |
|---|---|---|
| `--sliding-toggle-indicator-surface` | `var(--theme-on-surface)` | Background of the selected option's sliding indicator |
| `--sliding-toggle-indicator-shadow` | `0 0.1rem 0.3rem rgb(0 0 0 / 0.1)` | Shadow on the selected indicator |
| `--sliding-toggle-hover-indicator-surface` | `color-mix(in oklch, var(--theme-surface-subtle), var(--theme-text) 6%)` | Background of the hover indicator, one step darker than the track |
| `--sliding-toggle-indicator-stretch` | `1` | Multiplies both indicators' edge delays: `1` stretches then catches up, `0` slides both edges together, values between shorten the stretch |
| `--sliding-toggle-marker-height` | `0.2rem` | Height of the accent line along the selected indicator's bottom edge (`0` hides it) |
| `--sliding-toggle-marker-colour` | `var(--theme-accent)` | Colour of that line |

### Options

| Token | Default | Controls |
|---|---|---|
| `--sliding-toggle-option-padding` | `0.8rem 1.6rem` | Option padding |
| `--sliding-toggle-option-border-radius` | `0.6rem` | Corner radius of the options and both indicators |
| `--sliding-toggle-option-flex` | `0 1 auto` | Option `flex`. `1 1 0` gives equal widths (stretch the root too) |
| `--sliding-toggle-option-font-size` | `inherit` | Label font size |
| `--sliding-toggle-option-font-weight` | `500` | Label font weight |
| `--sliding-toggle-option-white-space` | `normal` | Label `white-space`; `nowrap` keeps each label on one line |
| `--sliding-toggle-option-colour` | `color-mix(in oklch, var(--theme-text) 70%, transparent)` | Label colour |
| `--sliding-toggle-option-colour-active` | `var(--theme-text)` | Selected option's label colour |
| `--sliding-toggle-transition-duration` | `200ms` | Label colour fade. The indicator slide is the `transitionDuration` prop |
| `--sliding-toggle-focus-ring-width` | `0.2rem` | Focus ring width |
| `--sliding-toggle-focus-ring-colour` | `var(--theme-border-focus)` | Focus ring colour |

Private (not public API): `--_sliding-toggle-active-*` and `--_sliding-toggle-hover-*` (`-start`,
`-end`, `-duration`, `-start-delay`, `-end-delay`), written on the root by `useSlidingIndicator`
from the measured option positions.

---

## State hooks

| Hook | Where | Meaning |
|---|---|---|
| `[data-ready]` | root | Mounted and measured. Before this (SSR, first paint) the indicators are hidden and the selected option paints its own background and marker |
| `[data-has-selection]` | root | `v-model` matches an option |
| `[data-hovering]` | root | The pointer is over an enabled option (with `trackHover`) |
| `[aria-disabled="true"]` | root | The `disabled` prop |
| `[aria-checked="true"]` | `.sliding-toggle-option` | The selected option |
| `:disabled` | `.sliding-toggle-option` | A disabled option, or the whole group |

Inner classes: `.sliding-toggle-option` (each `<button role="radio">`), `.sliding-toggle-indicator`
with `.sliding-toggle-indicator-active` and `.sliding-toggle-indicator-hover`. The marker is the
active indicator's `::after`.

---

## Motion

The indicator edges slide with `useSlidingIndicator`: on a move the edge in the direction of travel
goes first and the other follows one `transitionDuration` later. `--sliding-toggle-indicator-stretch: 0`
turns the stretch into a plain slide for both indicators (same as TabbedContent's
`--tabs-indicator-stretch`). Under `prefers-reduced-motion` both edges snap and the label colour
doesn't fade.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Equal-width options

```css
.billing-switch {
  --sliding-toggle-option-flex: 1 1 0;
  --sliding-toggle-corner-shape: squircle;
}

.billing-switch .sliding-toggle {
  inline-size: 100%;
}
```

---

## Class passthrough

`style-class-passthrough` adds classes to the root `.sliding-toggle` (the radiogroup). Reactive
after mount.

---

## Notes

- The root is `inline-size: fit-content` capped at `max-inline-size: 100%`; labels shrink and wrap
  (`overflow-wrap: anywhere`) rather than overflow, and the indicators re-measure as they do.
- No line-clamp token: labels name the choice and must stay readable.
