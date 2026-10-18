# DisplayTooltipRich — Consumer Styling Guide

> Renamed 2026-10-18 from `DisplayTooltipDefined`. Every `--display-tooltip-defined-*` token is now
> `--display-tooltip-rich-*` (same suffixes and defaults), and the `.display-tooltip-defined*`
> classes are now `.display-tooltip-rich*`. Find and replace `display-tooltip-defined` with
> `display-tooltip-rich` in your CSS.

## Public token API

No private `--_` tokens of its own. This component renders `DisplayTooltip`, so every
`--display-tooltip-*` token (trigger, popover panel, close button) applies too: see
`DisplayTooltip`'s CONSUMER-STYLING.md.

### Layout

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-rich-content-gap` | `1.2rem` | Gap between title/body/action/close-button |
| `--display-tooltip-rich-close-button-margin-block` | `1.2rem 0` | Space above the close button, on top of the gap |

### Title (`contentText.tooltipTitle`)

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-rich-title-colour` | `inherit` | Text colour |
| `--display-tooltip-rich-title-margin-block` | `0 0` | Block margin |
| `--display-tooltip-rich-title-font-size` | `1.6rem` | Font size |
| `--display-tooltip-rich-title-font-weight` | `700` | Font weight |
| `--display-tooltip-rich-title-line-height` | `120%` | Line height |
| `--display-tooltip-rich-title-letter-spacing` | `normal` | Letter spacing |
| `--display-tooltip-rich-title-line-clamp` | `none` | Line cap with ellipsis (`1` is single-line ellipsis) |

### Body (`contentText.tooltipContent`)

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-rich-body-colour` | `inherit` | Text colour |
| `--display-tooltip-rich-body-margin-block` | `0 0` | Block margin |
| `--display-tooltip-rich-body-font-size` | `1.3rem` | Font size |
| `--display-tooltip-rich-body-font-weight` | `inherit` | Font weight |
| `--display-tooltip-rich-body-line-height` | `140%` | Line height |
| `--display-tooltip-rich-body-letter-spacing` | `normal` | Letter spacing |
| `--display-tooltip-rich-body-line-clamp` | `none` | Line cap with ellipsis |

### Action (`contentText.tooltipAction`)

| Token | Default | Controls |
|---|---|---|
| `--display-tooltip-rich-action-colour` | `inherit` | Text colour |
| `--display-tooltip-rich-action-margin-block` | `0 0` | Block margin |
| `--display-tooltip-rich-action-font-size` | `1.4rem` | Font size |
| `--display-tooltip-rich-action-font-weight` | `700` | Font weight |
| `--display-tooltip-rich-action-line-height` | `130%` | Line height |
| `--display-tooltip-rich-action-letter-spacing` | `normal` | Letter spacing |
| `--display-tooltip-rich-action-line-clamp` | `none` | Line cap with ellipsis |

The three `*-colour` tokens default to `inherit`, which resolves to the panel's own
`--display-tooltip-popover-text-colour`: override that for a uniform colour change, or one of these
three for a single field. Clamped text stays in the DOM, so screen readers still read all of it;
the panel has nowhere else to show the rest, which is why the clamps default to `none`.

> Changed 2026-10-18: the three `*-line-clamp` tokens are new. Long unbroken text in every field
> now wraps (`overflow-wrap: anywhere`).

---

## State hooks

Inner classes: `.display-tooltip-rich` (on the root, next to `.display-tooltip`),
`.display-tooltip-rich-content`, `.display-tooltip-rich-title`,
`.display-tooltip-rich-body`, `.display-tooltip-rich-action`, and the close button
`.display-tooltip-close-button.input-button`. The panel's open and placement hooks are
`DisplayTooltip`'s.

> Changed 2026-10-18: `.popover-content-defined`, `.tooltip-title`, `.tooltip-body` and
> `.tooltip-action` are now `.display-tooltip-rich-content`, `-title`, `-body` and `-action`
> (the old names were generic enough for a consumer's own CSS to match them). The undefined
> `subtitle-sm`, `body-sm` and `input-value` classes on the fields were removed. The close button is
> now an `InputButton` (`variant="inline"`) that keeps the `.display-tooltip-close-button` class and
> its tokens, and its right alignment and top margin now apply: `DisplayTooltip`'s close-button
> reset used to override them, so the button stretched the full panel width.

---

## Global theming

```css
:where(html) {
  --display-tooltip-rich-title-colour: var(--brand-accent);
  --display-tooltip-rich-title-font-size: 1.8rem;
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

`style-class-passthrough` is forwarded to `DisplayTooltip`'s root, alongside the
`display-tooltip-rich` class this component always adds, so tokens set on a passthrough class
reach the trigger, the panel and every field.
