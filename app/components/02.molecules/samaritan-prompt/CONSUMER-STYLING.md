# SamaritanPrompt — Consumer Styling Guide

`SamaritanPrompt` and `SamaritanPromptMixed` render the same markup: an animated line of
uppercase monospace text over an underline, with a pulsing cursor glyph below it. They share one
class set and one token API, so everything here applies to both.

## Public token API

### Text

| Token | Default | Controls |
|---|---|---|
| `--samaritan-prompt-font-family` | `"Mono MMM 5", "Nova Mono", "Courier New", monospace` | Font stack |
| `--samaritan-prompt-font-size` | `2rem` | Text size (the underline and gaps don't scale with it) |
| `--samaritan-prompt-letter-spacing` | `0.08em` | Letter spacing |
| `--samaritan-prompt-text-transform` | `uppercase` | Text case (`none` keeps messages as written) |
| `--samaritan-prompt-text-colour` | `#ffffff` | Text colour |

### Underline

| Token | Default | Controls |
|---|---|---|
| `--samaritan-prompt-underline-colour` | `#ffffff` | Underline colour |
| `--samaritan-prompt-underline-height` | `0.15rem` | Underline thickness |
| `--samaritan-prompt-underline-gap` | `0.6rem` | Space between text and underline |

### Cursor

| Token | Default | Controls |
|---|---|---|
| `--samaritan-prompt-cursor-colour` | `#cc0000` | Cursor colour at the peak of the pulse |
| `--samaritan-prompt-cursor-colour-off` | `transparent` | Cursor colour at the trough of the pulse |
| `--samaritan-prompt-cursor-size` | `2.4rem` | Cursor glyph size |
| `--samaritan-prompt-cursor-pulse-duration` | `2.5s` | One full pulse cycle |
| `--samaritan-prompt-cursor-gap` | `0.6rem` | Space between underline and cursor |

Private, not public API: `--_fade-duration` (set inline on the root from the `fadeDuration` prop,
or the current message's `fadeDuration` in `SamaritanPromptMixed`).

> **Changed 2026-09-27**: all tokens were renamed from `--samaritan-*` to `--samaritan-prompt-*`,
> and `color` became `colour` (`--samaritan-color-text` is now `--samaritan-prompt-text-colour`,
> `--samaritan-color-cursor-off` is now `--samaritan-prompt-cursor-colour-off`, and so on). The
> old names no longer do anything. The underline height, both gaps, cursor size, pulse duration
> and text transform were hardcoded and are new tokens.

---

## State hooks

| Hook | Where | When |
|---|---|---|
| `data-paused` | `.samaritan-prompt` | Pointer is over the component; the sequence and cursor pulse are paused |

Inner element classes, safe to target:

| Class | Element |
|---|---|
| `.samaritan-prompt` | Root |
| `.samaritan-prompt__content` | Text and underline wrapper; its opacity animates for word-pulse. `aria-hidden` |
| `.samaritan-prompt__stage` | Centres the text and reserves one line of height |
| `.samaritan-prompt__text` | The animated text |
| `.samaritan-prompt__underline` | Underline bar |
| `.samaritan-prompt__cursor` | Cursor glyph (the `cursor` slot, `▲` by default). `aria-hidden` |
| `.samaritan-prompt__sr-text` | Visually hidden live region; don't restyle it visible |

---

## Motion

- The cursor pulses between `--samaritan-prompt-cursor-colour` and `-colour-off`; set both to the
  same value for a steady cursor.
- `prefers-reduced-motion: reduce` removes the cursor pulse and the word-pulse fade transition.
  The text sequence itself keeps running (it is the content), and pauses on hover like always.

---

## Global theming

The defaults assume a dark page. For a site that switches colour scheme, point the colours at the
theme tokens once:

```css
:where(html) {
  --samaritan-prompt-text-colour: var(--theme-text);
  --samaritan-prompt-underline-colour: var(--theme-text);
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

`:style-class-passthrough` (string or string array) adds classes to the root `.samaritan-prompt`
element. Reactive: changing the prop replaces the previous classes.

---

## Notes

- The component brings no page layout of its own. Centre it in its container yourself (e.g.
  `display: grid; place-items: center` on the parent).

  > **Changed 2026-09-27**: `SamaritanPromptMixed`'s styles used to apply only inside a
  > `.samaritan-stage` ancestor, which also forced `min-block-size: 100dvh` and flex centring on
  > that ancestor. Its styles now apply wherever it's used, and `.samaritan-stage` means nothing
  > to the library.

- The `Mono MMM 5` font loads from `/fonts/monoMMM_5.ttf`, shipped in this layer's `public/`.
