# OpeningHours — Consumer Styling Guide

`OpeningHours` renders a weekly opening-hours table as a `<dl>` of day/hours rows separated by
dividers, plus an optional "special opening times" block for exception dates. The row look
deliberately matches `PriceList`.

## Public token API

### Layout

| Token | Default | Controls |
|---|---|---|
| `--opening-hours-section-gap` | `3.2rem` | Gap between the weekly table and the exceptions block |

### Rows

| Token | Default | Controls |
|---|---|---|
| `--opening-hours-row-gap` | `1.2rem` | Gap between the day and hours columns |
| `--opening-hours-row-padding-block` | `1.2rem` | Vertical padding per row |
| `--opening-hours-row-padding-inline` | `0` | Horizontal padding per row (useful with a today background) |
| `--opening-hours-divider-width` | `1px` | Divider thickness |
| `--opening-hours-divider-colour` | `currentColor` | Divider colour |
| `--opening-hours-divider-opacity` | `0.15` | Divider opacity (0 to 1), mixed into the colour |
| `--opening-hours-day-font-size` | `1.4rem` | Day name / exception label size |
| `--opening-hours-day-colour` | `inherit` | Day name / exception label colour |
| `--opening-hours-hours-font-size` | `1.4rem` | Times and status text size |
| `--opening-hours-closed-colour` | `inherit` | Hours colour on closed rows |

### Sessions and notes

| Token | Default | Controls |
|---|---|---|
| `--opening-hours-session-gap` | `0.4rem` | Gap between stacked sessions (lunch/dinner) and the note |
| `--opening-hours-session-label-gap` | `0.75ch` | Space after a session label |
| `--opening-hours-session-label-colour` | `inherit` | Session label colour |
| `--opening-hours-note-font-size` | `1.2rem` | Note size |
| `--opening-hours-note-colour` | `inherit` | Note colour |

### Today

| Token | Default | Controls |
|---|---|---|
| `--opening-hours-today-font-weight` | `600` | Weight of today's row |
| `--opening-hours-today-colour` | `inherit` | Text colour of today's row |
| `--opening-hours-today-background-colour` | `transparent` | Background of today's row |

### Exceptions

| Token | Default | Controls |
|---|---|---|
| `--opening-hours-exceptions-heading-font-size` | `1.6rem` | Exceptions heading size |
| `--opening-hours-exceptions-heading-font-weight` | `600` | Exceptions heading weight |
| `--opening-hours-exceptions-heading-margin-block-end` | `1.2rem` | Space below the exceptions heading |
| `--opening-hours-date-font-size` | `1.2rem` | Exception date size |
| `--opening-hours-date-colour` | `inherit` | Exception date colour |

There are no private `--_` tokens.

---

## State hooks

| Hook | Where | When |
|---|---|---|
| `data-status="open" \| "closed" \| "24-hours" \| "by-appointment"` | `.opening-hours__row` | Always |
| `data-today` + `aria-current="date"` | `.opening-hours__row` | Row covers today (set after mount, see Notes) |

Inner element classes, safe to target:

| Class | Element |
|---|---|
| `.opening-hours` | Root |
| `.opening-hours__list` | Each `<dl>` (weekly and exceptions) |
| `.opening-hours__row` | One day, day range or exception |
| `.opening-hours__days` | `<dt>` |
| `.opening-hours__hours` | `<dd>` |
| `.opening-hours__session` | One opening session |
| `.opening-hours__session-label` | Session label ("Lunch") |
| `.opening-hours__status` | "Closed" / "Open 24 hours" / "By appointment only" |
| `.opening-hours__note` | Per-day or per-exception note |
| `.opening-hours__exceptions` | Exceptions wrapper |
| `.opening-hours__exceptions-heading` | Exceptions heading |
| `.opening-hours__exception-label` | Exception name ("Christmas") |
| `.opening-hours__date` | Exception date or date range |

---

## Global theming

```css
:where(html) {
  --opening-hours-divider-colour: var(--theme-border);
  --opening-hours-divider-opacity: 1;
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

## Recipe: highlighted today row

```css
.contact-page {
  --opening-hours-today-background-colour: var(--theme-surface);
  --opening-hours-row-padding-inline: 1.2rem;
}
```

Set the inline padding whenever you give today a background, or the text sits flush against the
background's edge.

---

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root `.opening-hours`
element. Reactive: changing the prop replaces the previous classes.

---

## Notes

- Today's highlight and the hiding of past exceptions are applied after mount, so a cached or
  prerendered page never shows a stale "today". Expect them to appear a moment after first paint.
