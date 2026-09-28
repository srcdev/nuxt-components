# PageHeroHighlights / PageHeroHighlightsHeader — Consumer Styling Guide

## Public token API

### Layout

| Token | Default | Controls |
|---|---|---|
| `--page-hero-highlights-max-width` | `1064px` | Central column cap (unless `width-constrained`) |
| `--page-hero-highlights-gutter-mobile` | `16px` | Side gutter |
| `--page-hero-highlights-gutter-tablet` | `40px` | Side gutter at 768px+ container width |
| `--page-hero-highlights-gutter-desktop` | `32px` | Side gutter at 1024px+ |
| `--page-hero-highlights-header-background` | `darkblue` | Header zone background |
| `--page-hero-highlights-content-background` | `var(--slate-01)` | Content zone background |
| `--page-hero-highlights-content-start-gap` | `1.2rem` | Space above the content panel |
| `--page-hero-highlights-content-end-gap` | `1.2rem` | Space below the content zone |
| `--page-hero-highlights-content-margin-block-start` | `2.4rem` | Space above the content slot |
| `--page-hero-highlights-content-margin` | the strip inset | Content slot inline/bottom margin |

### Highlights strip and items

| Token | Default | Controls |
|---|---|---|
| `--page-hero-highlights-strip-gap` | `1rem` | Gap between highlight items |
| `--page-hero-highlights-strip-inset` | `1.2rem` | Strip inline inset (with the content panel) |
| `--page-hero-highlights-title-height` | `1fr` | Title row height |
| `--page-hero-highlights-title-height-baseline` | `4rem` | Title row height with `highlight-title-baseline` |
| `--page-hero-highlights-item-padding` | `1.2rem` | Item padding |
| `--page-hero-highlights-item-padding-block-start` | the item padding | Item top padding |
| `--page-hero-highlights-item-padding-block-start-baseline` | `0` | Item top padding with `highlight-title-baseline` |
| `--page-hero-highlights-item-rows-gap` | `1.2rem` | Gap between item title and body |
| `--page-hero-highlights-item-background` | `white` | Item background |
| `--page-hero-highlights-item-border` | `1px solid black` | Item border |
| `--page-hero-highlights-item-border-radius` | `8px` | Item rounding |
| `--page-hero-highlights-item-colour` | `black` | Item text colour |

### Content panel (`content-panel`, on by default)

| Token | Default | Controls |
|---|---|---|
| `--page-hero-highlights-panel-background` | `var(--slate-00)` | Panel background |
| `--page-hero-highlights-panel-border` | `1px solid var(--slate-06)` | Panel border |
| `--page-hero-highlights-panel-outline` | `1px solid var(--slate-02)` | Panel outline |
| `--page-hero-highlights-panel-border-radius` | `0.8rem` | Panel rounding |

### PageHeroHighlightsHeader

| Token | Default | Controls |
|---|---|---|
| `--page-hero-highlights-header-gap` | `1.6rem` | Gap between start and end blocks |
| `--page-hero-highlights-header-end-gap` | `0.8rem` | Gap between items in the end block |
| `--page-hero-highlights-header-padding-block-mobile` | `1.6rem 3.2rem` | Block padding |
| `--page-hero-highlights-header-padding-block-tablet` | `2.4rem 4.8rem` | Block padding at 768px+ |
| `--page-hero-highlights-header-padding-block-desktop` | `3.2rem 6.4rem` | Block padding at 1024px+ |

Private (not public API): `--_max-width`, `--_gutter`, `--_strip-inset`, `--_title-height`,
`--_item-padding`, `--_item-padding-block-start`, `--_header-slot-grid-row`.

> Changed 2026-09-28: every token used to be declared on the root with its value, under generic
> names (`--max-width`, `--header-row-background-colour`, `--highlight-*`, `--content-row-*`,
> `--content-slot-*`, `--phh-*`), so a value set on an ancestor never landed and the names could
> collide with consumer variables. Both components' styles were also unlayered; they're now in
> `@layer components` like the rest of the library.

---

## State hooks

| Hook | Element | When |
|---|---|---|
| `.content-align-start` / `.content-align-center` | root | `content-align` |
| `.width-constrained` | root | `width-constrained` |
| `.has-content-panel` | root | `content-panel` (default on) |
| `.highlight-title-baseline` | root | `highlight-title-baseline` |
| `.equal-widths` / `.flexible-widths`, `.justify-*` | `.page-hero-highlights-strip` | `highlights-equal-widths`, `highlights-justify` |

Inner classes: `.page-hero-highlights-header-row`, `.page-hero-highlights-header-slot`,
`.page-hero-highlights-strip`, `.page-hero-highlights-content-row` (its `::before` is the content
panel), `.page-hero-highlights-content-slot`; header component `.page-hero-highlights-header-start`,
`.page-hero-highlights-header-end`.

**Highlight item contract:** give each element in the `#highlights` slot the class
`page-hero-highlights-item`, with `page-hero-highlights-item-title` and
`page-hero-highlights-item-body` children, to get the card styling and the title-row alignment.

> Changed 2026-09-28: renamed from `.header-row`, `.header-slot`, `.highlights-row`, `.content-row`,
> `.content-slot`, root `.start`/`.center`, `.highlight`/`.title`/`.body` and `.phh-start`/`.phh-end`.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

---

## Class passthrough

`style-class-passthrough` adds classes to each component's root. Reactive after mount.
