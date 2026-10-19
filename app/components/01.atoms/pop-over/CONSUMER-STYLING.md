# PopOver — Consumer Styling Guide

## Public token API

| Token | Default | Controls |
|---|---|---|
| `--pop-over-gap` | `1rem` | Space between the trigger and the popover panel |
| `--pop-over-trigger-outline-width` | `0.1rem` | Trigger focus outline width |
| `--pop-over-trigger-outline-colour-hover` | `var(--theme-ring)` | Trigger outline colour on focus-visible |
| `--pop-over-width` | `30rem` | Popover panel width, capped at the viewport width minus `3.2rem` |
| `--pop-over-max-block-size` | `calc(100dvh - 3.2rem)` | Popover panel maximum height; taller content scrolls inside the panel |
| `--pop-over-border-width` | `0.1rem` | Popover panel border width |
| `--pop-over-border-colour` | `var(--slate-02)` | Popover panel border colour |
| `--pop-over-border-radius` | `0.8rem` | Popover panel corner radius |
| `--pop-over-background-colour` | `var(--slate-00)` | Popover panel background |
| `--pop-over-text-colour` | `var(--slate-09)` | Popover panel text colour |
| `--pop-over-shadow` | `0 0.4rem 1.6rem rgba(0,0,0,.12)` | Popover panel elevation shadow |
| `--pop-over-transition-duration` | `200ms` | Open/close fade duration |
| `--pop-over-z-index` | `999999` | Panel stacking order in browsers without CSS anchor positioning. Ignored where the panel renders in the top layer |
| `--pop-over-content-padding` | `1.6rem` | Padding around the `content` slot |
| `--pop-over-content-padding-block-start` | `3.2rem` | Extra top padding so content clears the close button |
| `--pop-over-close-button-offset` | `0.8rem` | Distance of the close button from the panel's block-start and inline-end edges (top right in left-to-right text, top left in right-to-left) |
| `--pop-over-close-button-size` | `2.4rem` | Close button box width/height |
| `--pop-over-close-button-border-radius` | `50%` | Close button corner radius |
| `--pop-over-close-button-colour` | `var(--slate-06)` | Close button icon colour |
| `--pop-over-close-button-icon-size` | `1.4rem` | Close button icon glyph size |
| `--pop-over-close-button-outline-width` | `0.1rem` | Close button focus/hover outline width |
| `--pop-over-close-button-surface-hover` | `var(--slate-01)` | Close button background on hover/focus-visible |
| `--pop-over-close-button-outline-colour-hover` | `var(--theme-ring)` | Close button outline colour on hover/focus-visible |

Private tokens (not public API): `--_anchor-name` (the generated CSS anchor name), and `--_anchor-top`, `--_anchor-right`, `--_anchor-bottom`, `--_anchor-left`, and their `-inverse` forms (measured trigger edges, set by `useAnchoredPopover` only where CSS anchor positioning is unsupported).

---

## State hooks

| Hook | Where | Meaning |
|---|---|---|
| `[data-placement]` | `.pop-over` root | The `placement` prop: `top`, `right`, `bottom` or `left` |
| `[data-placement]` | `.pop-over-popover` | The resolved side, which can be the opposite of the prop when there is no room (only set where CSS anchor positioning is unsupported) |
| `:popover-open` | `.pop-over-popover` | Panel open, where the Popover API exists |
| `.pop-over-popover-open` | `.pop-over-popover` | Panel open on Safari 16 (no Popover API). Style it in a separate rule from `:popover-open` |
| `[role="dialog"]` | `.pop-over-popover` | Present only when `popoverAriaLabel` is set |

Inner class names: `.pop-over-trigger` (the trigger `<button>`), `.pop-over-popover` (the panel),
`.pop-over-close-button` (an `InputButton variant="inline"`, so also `.input-button`),
`.pop-over-close-button-icon`, `.pop-over-content` (wraps the `content` slot).

> Changed 2026-10-19: the close button is now an `InputButton` (`variant="inline"`, icon-only, with
> the `closeButtonAriaLabel` text visually hidden) instead of a raw `<button>`, and sits at the
> inline end, so it moves to the left in right-to-left text. The panel now caps at the viewport
> width and height and wraps unbroken strings.

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### Page or section

```css
.my-page {
  --pop-over-background-colour: #1a1a1a;
  --pop-over-text-colour: white;
  --pop-over-width: 24rem;
}
```

### One instance

```vue
<PopOver style-class-passthrough="promo-pop-over">...</PopOver>
```

---

## Class passthrough

`style-class-passthrough` adds classes to the `.pop-over` root, which wraps both the trigger and the
panel, so tokens set on that class reach the panel too.

---

## Notes

- Built on the native Popover API and CSS anchor positioning, with fallbacks: without anchor
  positioning (e.g. Safari 17–18) the panel is placed with `position: fixed` from the trigger's
  measured position, and `.pop-over-popover[data-placement]` holds the resolved side (the
  `placement` prop's side, or its opposite when that has no room). Without the Popover API
  (Safari 16) it opens and closes in JS and shows via `.pop-over-popover-open` (style it in a
  separate rule from `:popover-open`: a selector list containing `:popover-open` is dropped whole
  where unsupported). It isn't in the top layer there, so the z-index token applies, and an
  ancestor with `transform`, `filter` or `contain` can misplace it.
- `placement` (`"top" | "right" | "bottom" | "left"`, default `"right"`) picks which side of the
  trigger the panel opens on; each side gets a `position-try-fallbacks` so the browser flips it
  automatically if it would overflow the viewport.
- Unlike `DisplayTooltip` (a fixed icon trigger for inline help text) or `ActionMenu` (menu
  semantics with arrow-key navigation), `PopOver` is a generic disclosure: both `trigger` and
  `content` slots are entirely consumer-supplied, and it always renders its own visible close
  button rather than relying on click-outside/Escape alone.

