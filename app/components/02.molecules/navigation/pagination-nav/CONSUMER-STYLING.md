# PaginationNav — Consumer Styling Guide

## Public token API

### Layout and type

| Token | Default | Controls |
|---|---|---|
| `--pagination-nav-justify` | `center` | `justify-content` of the row inside the `nav` |
| `--pagination-nav-gap` | `0.4rem` | Gap between every control and slot (also used by the marker's position maths) |
| `--pagination-nav-font-size` | `1.6rem` | Font size of numbers, ellipses and the compact summary |
| `--pagination-nav-icon-size` | `2rem` | Size of the default arrow icons |

### Items (numbers and arrows)

| Token | Default | Controls |
|---|---|---|
| `--pagination-nav-item-size` | `4rem` | Minimum width and height of every item; number slots grow to the widest number |
| `--pagination-nav-item-padding-inline` | `0.8rem` | Inline padding inside each item |
| `--pagination-nav-item-radius` | `var(--button-border-radius)` | Corner radius of items and of the `background` marker |
| `--pagination-nav-item-border-width` | `0.1rem` | Item border width |
| `--pagination-nav-item-colour` | `var(--theme-text)` | Text and icon colour; also the fallback for ellipsis and summary colours |
| `--pagination-nav-item-background` | `transparent` | Item background |
| `--pagination-nav-item-border-colour` | `transparent` | Item border colour |
| `--pagination-nav-item-colour-hover` | item colour | Hover text colour |
| `--pagination-nav-item-background-hover` | `var(--theme-surface-subtle)` | Hover background |
| `--pagination-nav-item-border-colour-hover` | item border colour | Hover border colour |
| `--pagination-nav-ring-focus` | `var(--theme-ring)` | Focus ring colour (width and offset come from `--button-focus-ring-width` and `--button-focus-ring-offset`) |
| `--pagination-nav-disabled-opacity` | `0.4` | Opacity of a disabled arrow at either end |

### Current page and marker

| Token | Default | Controls |
|---|---|---|
| `--pagination-nav-current-font-weight` | `700` | Weight of the current page number, in every marker mode |
| `--pagination-nav-current-colour` | `var(--theme-on-surface)` | Current page text colour (`none` and `background` markers) |
| `--pagination-nav-current-background` | `var(--theme-surface)` | Current page fill (`none`), and the default marker fill (`background`) |
| `--pagination-nav-current-border-colour` | current background | Current page border (`none` only) |
| `--pagination-nav-marker-background` | current background | Fill of the sliding `background` marker |
| `--pagination-nav-marker-duration` | `250ms` | Slide duration; the current page's text colour switches halfway through |
| `--pagination-nav-underline-thickness` | `0.3rem` | Height (and corner radius) of the `underline` marker |
| `--pagination-nav-underline-colour` | `var(--theme-surface)` | Colour of the `underline` marker |

### Ellipsis and summary

| Token | Default | Controls |
|---|---|---|
| `--pagination-nav-ellipsis-colour` | item colour | Ellipsis colour |
| `--pagination-nav-summary-colour` | item colour | Compact summary text colour |
| `--pagination-nav-summary-line-clamp` | `none` | Max lines of the compact summary, with an ellipsis on the last. `1` is single-line ellipsis |

Private tokens (not public API): `--_pagination-nav-gap`, `--_pagination-nav-item-size`,
`--_pagination-nav-item-radius`, `--_pagination-nav-item-colour`, `--_pagination-nav-current-background`,
`--_pagination-nav-duration`, and the script-written `--_pagination-nav-count` and
`--_pagination-nav-marker-index`.

```css
.listing-page {
  --pagination-nav-item-border-colour: var(--theme-border);
  --pagination-nav-item-radius: 100vw;
  --pagination-nav-current-background: var(--colour-theme-8);
}
```

---

## State hooks

| Hook | When |
|---|---|
| `.pagination-nav[data-marker="none" \| "background" \| "underline"]` | The `marker` prop |
| `.pagination-nav[data-compact]` | Compact layout is showing (forced, or `auto` and the full row doesn't fit) |
| `.pagination-nav-page[aria-current="page"]` | The current page |
| `.pagination-nav-control[readonly]` | A disabled arrow at either end (`aria-disabled="true"`, still focusable) |
| `[data-control="first" \| "previous" \| "page" \| "next" \| "last"]` | Each control |

Inner classes: `.pagination-nav-row`, `.pagination-nav-pages`, `.pagination-nav-list`, `.pagination-nav-item`,
`.pagination-nav-page`, `.pagination-nav-control`, `.pagination-nav-icon`, `.pagination-nav-ellipsis`,
`.pagination-nav-summary`, `.pagination-nav-marker-layer`, `.pagination-nav-marker`. Items are
`InputButton variant="inline"`, so each also carries `.input-button`.

---

## Sizing and the marker

Number slots share one equal-width grid, so every slot is as wide as the widest number in the window,
and the marker sits in a second identical grid stacked behind it. That is why the marker needs no
measuring, and why (with `boundaries` of at least 1, which keeps the widest number in view) the control
keeps its width as the page changes. Under `prefers-reduced-motion` the marker jumps instead of sliding.
Numbers never wrap inside their buttons.

The `nav` is `inline-size: 100%` and centres its row with `--pagination-nav-justify`. The `auto` layout
measures whether the full row fits the nav's content box (padding excluded) and shows the compact layout
(arrows plus summary text) only when it doesn't. Because the nav fills the width it's given, this works in
a centring parent and in a flex row: next to a sibling such as "Showing 1 to 20 of 200", it takes the
remaining space. On first server render it is always the full row, so a narrow viewport can see it switch
after hydration; pass `layout="compact"` where you know the space is small to avoid that.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** items are `InputButton`s, but the `--input-button-*` tokens don't reach them: the `inline`
variant has no colours of its own, and every colour comes from the `--pagination-nav-*` tokens.

---

## Class passthrough

`style-class-passthrough` adds classes to the root `nav.pagination-nav`. Reactive after mount.
