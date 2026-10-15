# ProgressTracker — Consumer Styling Guide

## Public token API

All `--progress-tracker-*` tokens are the stable override surface. Set them on an ancestor you
own, or on a class added with `:style-class-passthrough`.

### Colours

| Token | Default | Controls |
|---|---|---|
| `--progress-tracker-accent` | `var(--theme-accent)` | Done indicator fill, current indicator outline and number, connectors below done steps, progress bar fill |
| `--progress-tracker-on-accent` | `var(--theme-on-surface)` | Tick colour on the done indicator; keep it in contrast with the accent |
| `--progress-tracker-track` | `--theme-text` mixed to 15% | Progress bar track, upcoming indicator outline, connectors below current and upcoming steps |
| `--progress-tracker-ring-colour` | `--theme-accent` mixed to 20% | Halo around the current indicator |
| `--progress-tracker-upcoming-text` | `--theme-text` mixed to 60% | Upcoming step numbers, titles and bodies |
| `--progress-tracker-title-colour` | `var(--theme-text)` | Done and current step titles |
| `--progress-tracker-body-colour` | `--theme-text` mixed to 80% | Done and current step bodies |
| `--progress-tracker-label-colour` | `--theme-text` mixed to 70% | Header label |

### Header

| Token | Default | Controls |
|---|---|---|
| `--progress-tracker-header-gap` | `2.4rem` | Space between the header and the first step |
| `--progress-tracker-label-font-family` | `inherit` | Header label font (e.g. a monospace stack) |
| `--progress-tracker-label-font-size` | `var(--step-4)` | Header label size |
| `--progress-tracker-label-font-weight` | `600` | Header label weight |
| `--progress-tracker-label-letter-spacing` | `0.12em` | Header label tracking |
| `--progress-tracker-label-text-transform` | `uppercase` | Header label case; `none` keeps the prop's casing |
| `--progress-tracker-bar-inline-size` | `16rem` | Preferred bar width; it shrinks first and wraps below the label when space runs out |
| `--progress-tracker-bar-height` | `0.6rem` | Bar thickness |
| `--progress-tracker-bar-radius` | `99rem` | Bar corner rounding |

### Steps and indicators

| Token | Default | Controls |
|---|---|---|
| `--progress-tracker-gap` | `4rem` | Space between the indicator column and the step content |
| `--progress-tracker-step-padding-block` | `1.2rem` | Vertical padding of each step row |
| `--progress-tracker-connector-width` | `0.2rem` | Connector line thickness |
| `--progress-tracker-indicator-size` | `4.4rem` | Indicator width and height; titles are centred against it |
| `--progress-tracker-indicator-border-width` | `0.2rem` | Indicator outline width |
| `--progress-tracker-indicator-radius` | `50%` | Indicator shape; `0.8rem` gives rounded squares |
| `--progress-tracker-indicator-font-size` | `var(--step-4)` | Step number size |
| `--progress-tracker-ring-width` | `0.6rem` | Halo width around the current indicator |
| `--progress-tracker-content-gap` | `0.8rem` | Space between title, body and slot content in a step |
| `--progress-tracker-slot-gap` | `0.8rem` | Extra space above the `#step-{n}` slot content |
| `--progress-tracker-title-font-size` | `var(--step-5)` | Step title size |
| `--progress-tracker-title-font-weight` | `600` | Step title weight |
| `--progress-tracker-title-line-clamp` | `none` | Lines before a title is cut off with an ellipsis (`1` is single-line) |
| `--progress-tracker-body-font-size` | `var(--step-4)` | Step body size |
| `--progress-tracker-body-line-clamp` | `none` | Lines before a body is cut off with an ellipsis |

### Focus card (current step)

| Token | Default | Controls |
|---|---|---|
| `--progress-tracker-card-surface` | `var(--theme-surface-subtle)` | Card background; set `#ffffff` (or similar) to lift it off a grey panel |
| `--progress-tracker-card-shadow` | soft two-layer shadow | Card shadow; `none` for a flat card |
| `--progress-tracker-card-radius` | `1.6rem` | Card corner rounding |
| `--progress-tracker-card-padding-block` | `1.6rem` | Card top and bottom padding; the current indicator moves down by the same amount to stay level with the title |
| `--progress-tracker-card-padding-inline` | `2rem` | Card side padding; the card bleeds left by the same amount so its text lines up with the other steps. Clearance between the current ring and the card is `--progress-tracker-gap` minus this minus `--progress-tracker-ring-width` (1.4rem by default), so raise the gap with it |

### Motion

| Token | Default | Controls |
|---|---|---|
| `--progress-tracker-transition-duration` | `200ms` | Bar fill and state colour transitions. Off under `prefers-reduced-motion: reduce` |

Private (not public API): `--_progress-tracker-progress`, the done fraction the component sets
inline on the bar.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `.is-complete` | root | The model equals `steps.length` |
| `.is-done`, `.is-current`, `.is-upcoming` | `.progress-tracker-step` and `.progress-tracker-indicator` | That step's state |
| `aria-current="step"` | `.progress-tracker-title` | The current step |

Inner classes: `.progress-tracker-header`, `.progress-tracker-label`, `.progress-tracker-bar`,
`.progress-tracker-bar-fill`, `.progress-tracker-list` (the StepperList root),
`.progress-tracker-indicator`, `.progress-tracker-indicator-icon`, `.progress-tracker-step`,
`.progress-tracker-title`, `.progress-tracker-body`, `.progress-tracker-slot`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat: StepperList tokens.** The list is a `StepperList`, and ProgressTracker sets its
`--stepper-list-*` tokens on `.progress-tracker-list` from its own tokens. A `--stepper-list-*`
value set on an ancestor never reaches it; use the `--progress-tracker-*` equivalents
(`-gap`, `-step-padding-block`, `-connector-width`, `-accent`, `-track`).

---

## Class passthrough

`style-class-passthrough` adds classes to the root `div`. Tokens set on a passthrough class apply to
the whole tracker. Reactive after mount.

---

## Notes

- Title centring against the indicator uses the `lh` unit. Safari before 16.4 ignores it and the
  title sits level with the top of the indicator instead.
