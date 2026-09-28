# ProfileSection — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--profile-section-gap` | `2rem` | Gap between picture and info, single column (below 768px) |
| `--profile-section-gap-wide` | `4rem` | Gap between picture and info columns (768px+) |
| `--profile-section-picture-width` | `384px` | Picture column width (768px+) |
| `--profile-section-picture-aspect-ratio` | `3 / 4` | Picture frame aspect ratio |
| `--profile-section-picture-border-radius` | `8px` | Picture frame corner rounding |
| `--profile-section-info-block-gap` | `1.5rem` | Space after each `profile-info-N` block |
| `--profile-section-links-gap` | `1rem` | Gap between items in the `profileLinks` slot |

Highlight colours inside info blocks read the global `--colour-text-accent`,
`--colour-link-default` and `--colour-link-hover` (see **State hooks**).

> Changed 2026-09-27: all of these were hardcoded values; they're now tokens with the same
> defaults.

No private `--_` tokens.

---

## State hooks

Inner classes: `.profile-section-header`, `.profile-section-inner` (the grid),
`.profile-section-picture` (frame), `.profile-section-image` (the `NuxtImg`),
`.profile-section-info`, `.profile-section-info-content`, `.profile-section-info-block` (one per
`profile-info-N` slot), `.profile-section-links`.

Content hooks inside info blocks: an element with class `location` or `services` containing a
`.highlight` gets a bold accent (`location`) or link (`services`) colour.

> Changed 2026-09-27: renamed from `.picture`, `.profile-picture`, `.profile-info`,
> `.profile-info-content`, `.profile-info-block` and `.profile-links`. `.picture` in particular
> collided with any consumer class of the same name.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to the root element. Reactive after mount.
