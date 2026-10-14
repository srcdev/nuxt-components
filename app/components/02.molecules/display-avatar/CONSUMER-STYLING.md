# DisplayAvatar — Consumer Styling Guide

## Public token API

### Size

| Token | Default | Controls |
|---|---|---|
| `--display-avatar-size` | the `size` step's value | Diameter, overriding the `size` prop's scale (one instance or a whole area) |
| `--display-avatar-font-size` | the `size` step's value | Initials/text size, overriding the scale |
| `--display-avatar-size-xs` / `-s` / `-md` / `-lg` / `-xl` | `2.4rem` / `3.2rem` / `4rem` / `4.8rem` / `5.6rem` | The diameter each `size` value maps to |
| `--display-avatar-font-size-xs` / `-s` / `-md` / `-lg` / `-xl` | `1.2rem` / `1.4rem` / `1.6rem` / `1.8rem` / `2rem` | The text size each `size` value maps to |

A custom `size` string (anything other than `xs`–`xl`) is set as `data-size` but maps to no
scale step, so it renders at `md` unless you set `--display-avatar-size` for it (target it with
`.display-avatar[data-size="<your-size>"]`).

If you size an image avatar beyond the scale, raise the `image-size` prop (default `112`, the
pixel width and height requested from `@nuxt/image`) to match, or the image is upscaled and blurry.

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

Private tokens (not public API): `--_avatar-size` and `--_avatar-font-size`, which each size step sets from its
scale token.

## State hooks

- `data-size` on the root: `xs`, `s`, `md`, `lg`, `xl` (or your custom `size` string).
- Classes: `.display-avatar` (root: size, font size, radius), `.display-avatar-surface` (fills the root,
  carries the background and text colour, and holds all content), `.display-avatar-image` (the image), `.display-avatar-fallback`
  (the initials or `text`; one line, clipped to the circle), `.display-avatar-icon` (opt-in, for
  your `#icon` slot content).
- With `chip`, the root is `DisplayChip`, so it also carries `.display-chip` and its
  `data-shape`/`data-status` attributes (status comes from the `status` prop). See `display-chip`
  for its tokens.

> **Changed 2026-10-14**: the size was a bare class on the root (`.display-avatar.lg`), which a
> consumer's own `.lg`/`.xl` utility classes could match. Replace `.display-avatar.<size>` with
> `.display-avatar[data-size="<size>"]`. Overlong fallback text is now clipped inside the circle, the
> avatar no longer shrinks in a flex row, and a broken image falls back to the initials.
> With `chip`, the status dot is its configured size again (it had picked up the avatar's diameter
> through a shared private `--_size` name). Content now sits in a full-size
> `.display-avatar-surface`, which carries the background: the chip's cutout used to land on the
> small initials span (cutting into the letters) and never reached the background. If you set
> `background` directly on `.display-avatar`, use `--display-avatar-background` instead.
>
> **Changed 2026-10-08**: chip status is the `status` prop (forwarded to `DisplayChip` as
> `data-status`), not an `online`/`idle`/`dnd` class through `style-class-passthrough`.
>
> **Changed 2026-09-27**: `.avatar-image` → `.display-avatar-image` and `.avatar-icon` →
> `.display-avatar-icon`.

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the size steps set `--_avatar-size`/`--_avatar-font-size` on the avatar itself, so changing the
scale (`--display-avatar-size-md` etc.) from an ancestor works, but a one-off diameter should use
`--display-avatar-size`, which beats the scale wherever it's set.

## Class passthrough

`style-class-passthrough` adds classes to the root, including when the root is `DisplayChip`.
