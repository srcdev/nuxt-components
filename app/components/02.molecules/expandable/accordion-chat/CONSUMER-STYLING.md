# AccordionChat — Consumer Styling Guide

Every visual property is a token. The defaults take colours from the `--theme-*` slots; the
Storybook **Default** and **Dark Theme** stories are two complete token sets for the same markup, to
copy from.

## Public token API

### Layout and shape (resolved on `.accordion-chat`)

| Token | Default | Controls |
|---|---|---|
| `--accordion-chat-gap` | `1.4rem` | Space between panels |
| `--accordion-chat-answer-gap` | `1rem` | Space between a question and its answer |
| `--accordion-chat-bubble-max-width` | `82%` | Maximum width of both bubbles |
| `--accordion-chat-radius` | `2rem` | Bubble corner radius |
| `--accordion-chat-tail-radius` | `0.6rem` | The "tail" corner: bottom-end of the question, bottom-start of the answer (logical, so it flips in RTL) |
| `--accordion-chat-transition-duration` | `200ms` | Question colour change; the icon rotation takes 1.25× this |
| `--accordion-chat-entrance-duration` | `260ms` | Answer bubble fade-and-settle when it opens |
| `--accordion-chat-focus-ring-width` | `0.2rem` | Question focus outline width |
| `--accordion-chat-focus-ring-colour` | `var(--theme-border-focus)` | Question focus outline colour |

### Question bubble (the panel's `summary`)

| Token | Default | Controls |
|---|---|---|
| `--accordion-chat-question-surface` | `var(--theme-surface-subtle)` | Background, closed |
| `--accordion-chat-question-colour` | `var(--theme-text)` | Text, closed |
| `--accordion-chat-question-border` | `transparent` | Border colour, closed |
| `--accordion-chat-question-surface-open` | `var(--theme-surface-inverted)` | Background, open |
| `--accordion-chat-question-colour-open` | `var(--theme-text-inverted)` | Text, open |
| `--accordion-chat-question-border-open` | `var(--accordion-chat-question-border)` | Border colour, open |
| `--accordion-chat-question-border-width` | `0.1rem` | Border width |
| `--accordion-chat-question-font-family` | `inherit` | Font family |
| `--accordion-chat-question-font-size` | `1.6rem` | Font size |
| `--accordion-chat-question-font-weight` | `600` | Font weight |
| `--accordion-chat-question-line-height` | `1.3` | Line height |
| `--accordion-chat-question-padding-block` | `1.3rem` | Vertical padding |
| `--accordion-chat-question-padding-inline` | `2rem 1.8rem` | Start and end padding |
| `--accordion-chat-question-icon-gap` | `1.4rem` | Space between the text and the icon |

### Icon (default `+` that turns to `×` when open)

| Token | Default | Controls |
|---|---|---|
| `--accordion-chat-icon-size` | `2.2rem` | Icon circle size |
| `--accordion-chat-icon-glyph-size` | `1.4rem` | The `+` glyph size |
| `--accordion-chat-icon-surface` | `rgb(0 0 0 / 0.07)` | Circle fill, closed |
| `--accordion-chat-icon-surface-open` | `rgb(255 255 255 / 0.16)` | Circle fill, open |

The glyph takes the question's text colour.

### Answer bubble

| Token | Default | Controls |
|---|---|---|
| `--accordion-chat-answer-surface` | `var(--theme-text-inverted)` | Background (the lightest theme step) |
| `--accordion-chat-answer-colour` | `var(--theme-text)` | Text |
| `--accordion-chat-answer-border` | `var(--theme-surface-subtle)` | Border colour |
| `--accordion-chat-answer-border-width` | `0.1rem` | Border width |
| `--accordion-chat-answer-font-family` | `inherit` | Font family |
| `--accordion-chat-answer-font-size` | `1.55rem` | Font size |
| `--accordion-chat-answer-font-weight` | `400` | Font weight |
| `--accordion-chat-answer-line-height` | `1.6` | Line height |
| `--accordion-chat-answer-padding-block` | `1.4rem` | Vertical padding |
| `--accordion-chat-answer-padding-inline` | `1.8rem` | Horizontal padding |

### Avatar

| Token | Default | Controls |
|---|---|---|
| `--accordion-chat-avatar-size` | `3rem` | Circle size |
| `--accordion-chat-avatar-gap` | `1rem` | Space between avatar and bubble |
| `--accordion-chat-avatar-surface` | `var(--theme-surface-inverted)` | Circle fill |
| `--accordion-chat-avatar-colour` | `var(--theme-text-inverted)` | Initials colour |
| `--accordion-chat-avatar-font-family` | `inherit` | Initials font |
| `--accordion-chat-avatar-font-size` | `1.2rem` | Initials size |
| `--accordion-chat-avatar-font-weight` | `600` | Initials weight |

Private (not public API): `--_accordion-chat-radius`, `--_accordion-chat-tail-radius`,
`--_accordion-chat-bubble-max-width` and `--_accordion-chat-duration`, each read by several rules.

## State hooks

| Selector | Meaning |
|---|---|
| `.accordion-chat` | Root |
| `.accordion-chat-item` | Each panel (an `ExpandingPanelClassic` root) |
| `.accordion-chat-item .expanding-panel-classic-details[open]` | That panel is open |
| `.accordion-chat-item .expanding-panel-classic-summary` | Question bubble |
| `.accordion-chat-icon`, `.accordion-chat-icon-glyph` | Default icon circle and glyph |
| `.accordion-chat-answer` | Answer row (avatar + bubble), inside the panel's `.inner` |
| `.accordion-chat-avatar` | Avatar circle (`aria-hidden`) |
| `.accordion-chat-bubble` | Answer bubble |

## Motion

Opening animates the row height (ExpandingPanelClassic, `grid-template-rows`, every browser), then
the answer bubble fades in and settles from a slight offset. Under `prefers-reduced-motion: reduce`
the entrance animation and the icon rotation's transition are off; colours still change.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** each panel re-declares `--expanding-panel-classic-icon-size` and
`--expanding-panel-classic-summary-gap` from `--accordion-chat-icon-size` and
`--accordion-chat-question-icon-gap`, so set those `--accordion-chat-*` tokens; an ancestor's
`--expanding-panel-classic-*` value for them never lands.

## Recipe: dark, serif theme

```css
.faq-section {
  --accordion-chat-question-font-family: "Playfair Display", Georgia, serif;
  --accordion-chat-question-font-size: 1.9rem;
  --accordion-chat-question-font-weight: 400;
  --accordion-chat-question-surface: #1a1615;
  --accordion-chat-question-colour: #f2ece2;
  --accordion-chat-question-border: #2b2422;
  --accordion-chat-question-surface-open: #c9a961;
  --accordion-chat-question-colour-open: #14100f;
  --accordion-chat-question-border-open: #c9a961;
  --accordion-chat-icon-surface: rgb(255 255 255 / 0.08);
  --accordion-chat-icon-surface-open: rgb(0 0 0 / 0.12);
  --accordion-chat-answer-surface: #1a1615;
  --accordion-chat-answer-border: #2b2422;
  --accordion-chat-answer-colour: #cbbfb4;
  --accordion-chat-answer-font-weight: 300;
  --accordion-chat-answer-line-height: 1.7;
  --accordion-chat-avatar-surface: #c9a961;
  --accordion-chat-avatar-colour: #14100f;
  --accordion-chat-focus-ring-colour: #c9a961;
}
```

## Class passthrough

`style-class-passthrough` adds classes to the root `.accordion-chat` (reactive after mount). Panels
always get `.accordion-chat-item`.

## Notes

- The answer bubble is a wrapper inside the panel's `#content` slot. Never style the panel's
  `.inner` (it must keep `overflow: hidden` and no padding for the row-height animation).
- Images and videos inside an answer are capped at the bubble's width.
