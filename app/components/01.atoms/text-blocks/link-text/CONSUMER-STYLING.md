# LinkText — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--link-text-colour` | `currentColor` | Text and icon colour; also the focus outline colour |
| `--link-text-colour-hover` | `--link-text-colour` | Colour on hover/focus |
| `--link-text-decoration` | `underline` | Text decoration at rest |
| `--link-text-decoration-hover` | `none` | Text decoration on hover/focus |
| `--link-text-underline-offset` | `0.2em` | Underline offset |
| `--link-text-font-size` | `inherit` | Font size |
| `--link-text-gap` | `0.4em` | Gap between icon slots and label |

Transitions read the library-wide `--control-transition-duration` (`200ms`) and
`--control-transition-ease` (`ease`).

> Changed 2026-09-27: `--link-text-colour-hover` now falls back to `--link-text-colour`. It fell
> back to `currentColor`, which in a `color` declaration means the parent's colour, so a link with
> a custom colour switched to the surrounding text colour on hover.

Private (not public API): `--_colour` (the resolved resting colour).

---

## State hooks

Inner classes: `.link-text__label`, `.link-text__icon` with `.link-text__icon--left` /
`.link-text__icon--right` (only rendered when the `left`/`right` slot is used).

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root link element. Reactive after mount.
