# InputOtp — Consumer Styling Guide

## Public token API

Colour tokens fall back to the shared `--theme-*` tokens, so leaving them unset keeps the
component in step with every other themed form control. See `theming-component-token-pattern.md`
for the two-tier shape.

### Boxes (`InputOtp`)

| Token | Default | Controls |
|---|---|---|
| `--input-otp-gap` | `0.8rem` | Space between boxes |
| `--input-otp-box-inline-size` | `4.4rem` | Preferred box width (boxes shrink below it when the row is too narrow) |
| `--input-otp-box-block-size` | `5.2rem` | Box height |
| `--input-otp-font-size` | `2rem` | Digit size |
| `--input-otp-border-radius` | `var(--form-input-border-radius)` | Box corner radius (`normal` variant) |
| `--input-otp-surface` | `var(--theme-input-surface)` | Box background |
| `--input-otp-text-color` | `var(--theme-input-text-color-normal)` | Digit colour |
| `--input-otp-border` | `var(--theme-border)` | Box border (`normal`) or bottom border (`underlined`) |
| `--input-otp-border-hover` | `var(--input-otp-border-focus)` | Outline colour on hover (`normal` variant) |
| `--input-otp-border-focus` | `var(--theme-border-focus)` | Outline colour on `:focus-visible`, and the bottom border colour on focus (`underlined`) |

### Field (`InputOtpField`)

| Token | Default | Controls |
|---|---|---|
| `--input-otp-field-gap` | `0.8rem` | Space between the boxes and the error strip |

The legend uses `FormFieldset`'s `--form-fieldset-legend-*` tokens (see its CONSUMER-STYLING.md).
Border/outline widths and transition duration are the shared form geometry tokens
(`--form-element-border-width`, `--form-element-outline-width-focus`, etc.), see
`theming-form-geometry-tokens.md`.

Private tokens (not public API): `--_border` and `--_border-focus` on `.input-otp`, which only
resolve the two public border tokens once for reuse across the variant rules.

## State hooks

| Hook | Where | Meaning |
|---|---|---|
| `[data-invalid]` | `.input-otp`, and the `.input-otp-field` fieldset | Error state. Switches the colour ramp to the error colours, so `--theme-border` (and everything defaulting from it) turns red without a separate error token. |
| `[data-theme]` | `.input-otp`, `.input-otp-field` | The `theme` prop. |
| `.normal` / `.underlined` | `.input-otp` | The `inputVariant` prop. |
| `.input-otp-box` | each digit `<input>` | One box. |

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

## Class passthrough

- `InputOtp`: `style-class-passthrough` classes land on the `.input-otp` root (the row of boxes).
- `InputOtpField`: `style-class-passthrough` classes land on the `.input-otp-field` fieldset; the
  inner `InputOtp` gets none.
