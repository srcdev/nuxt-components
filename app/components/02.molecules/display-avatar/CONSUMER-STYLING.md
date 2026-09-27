# DisplayAvatar — Consumer Styling Guide

## Public token API

### Size

| Token | Default | Controls |
|---|---|---|
| `--display-avatar-size` | the size class's value | Diameter, overriding the `size` prop's scale (one instance or a whole area) |
| `--display-avatar-font-size` | the size class's value | Initials/text size, overriding the scale |
| `--display-avatar-size-xs` / `-s` / `-md` / `-lg` / `-xl` | `2.4rem` / `3.2rem` / `4rem` / `4.8rem` / `5.6rem` | The diameter each `size` value maps to |
| `--display-avatar-font-size-xs` / `-s` / `-md` / `-lg` / `-xl` | `1.2rem` / `1.4rem` / `1.6rem` / `1.8rem` / `2rem` | The text size each `size` value maps to |

A custom `size` string (anything other than `xs`–`xl`) is added as a class but maps to no scale
step, so it renders at `md` unless you set `--display-avatar-size` for it.

### Appearance

| Token | Default | Controls |
|---|---|---|
| `--display-avatar-background` | `var(--theme-surface-subtle)` | Circle background (shows behind initials; hidden by an image) |
| `--display-avatar-text-colour` | `var(--theme-text)` | Initials/text colour |
| `--display-avatar-border-radius` | `50%` | Shape (the image follows it) |
| `--display-avatar-icon-size` | `2.4rem` | Size of an icon given the `display-avatar-icon` class in the `#icon` slot |

> **Changed 2026-09-27**: sizes and colours were hardcoded. The font sizes were written for a 16px
> root (`0.75rem`–`1.25rem`), so on this library's `62.5%` root they rendered at 7.5–12.5px; they're
> now `1.2rem`–`2rem` (12–20px, the intended sizes). Diameters moved from px to the same values in
> rem. The circle had no background and light grey text (`--slate-03`), which made initials
> faint in light mode; it now uses the `--theme-*` surface and text tokens, so it follows light
> and dark mode.

Private tokens (not public API): `--_size` and `--_font-size`, which each size class sets from its
scale token.

## State hooks

- Size class on the root: `.xs`, `.s`, `.md`, `.lg`, `.xl` (or your custom `size` string).
- Classes: `.display-avatar` (root), `.display-avatar-image` (the image), `.display-avatar-icon`
  (opt-in, for your `#icon` slot content).
- With `chip`, the root is `DisplayChip`, so it also carries `.display-chip-core` and its shape
  class; status classes such as `.online` (through `style-class-passthrough`) are `DisplayChip`'s.
  See `display-chip` for its tokens.

> **Changed 2026-09-27**: `.avatar-image` → `.display-avatar-image` and `.avatar-icon` →
> `.display-avatar-icon`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the size classes set `--_size`/`--_font-size` on the avatar itself, so changing the
scale (`--display-avatar-size-md` etc.) from an ancestor works, but a one-off diameter should use
`--display-avatar-size`, which beats the scale wherever it's set.

## Class passthrough

`style-class-passthrough` adds classes to the root, including when the root is `DisplayChip`. That's
how chip status classes like `online` are applied.
