# InputCopy — Consumer Styling Guide

A readonly input and a copy button (an `InputButton` with `variant="inline"`, so the tokens below
style it rather than `InputButton`'s variant colours), with optional description text below.

> **Changed 2026-10-15**: compliance migration.
>
> - Colour defaults now come from the theme: input background `--theme-input-surface` (was
>   `--slate-00`), border `0.1rem solid var(--theme-border)` (was `1px solid var(--slate-03)`), input
>   and description text `--theme-text` (were `#333` / `#666`). Set the tokens if you relied on the
>   old greys.
> - Font sizes were `0.95rem` / `0.85rem` (9.5px / 8.5px on the 10px rem base); both now default to
>   `var(--step-4)`.
> - `--input-copy-description-margin` defaults to `0` (was `0.6rem 0 0 0`, doubling up with the
>   gap); spacing is the new `--input-copy-gap`.
> - `--input-copy-input-placeholder-color` is gone (the input always has a value). New:
>   `--input-copy-gap`, `--input-copy-focus-ring`, `--input-copy-description-line-clamp`.
> - The input's focus outline used the border-radius token as its colour; it's now a real
>   `:focus-visible` ring from `--input-copy-focus-ring`.
> - The button label is `InputButton`'s `.input-button-text` (was `.input-copy__button-text`, then `.button-text` until 2026-10-17), and it
>   hides below 48rem of the **component's** width (a container query), not a 480px viewport.

## Public token API

### Layout

| Token | Default | Controls |
|---|---|---|
| `--input-copy-gap` | `0.8rem` | Gap between input and button, and above the description |

### Input

| Token | Default | Controls |
|---|---|---|
| `--input-copy-input-bg` | `var(--theme-input-surface)` | Input background |
| `--input-copy-input-border` | `0.1rem solid var(--theme-border)` | Input border (shorthand) |
| `--input-copy-input-border-radius` | `0.4rem` | Input corner radius |
| `--input-copy-input-padding` | `0.8rem 1rem` | Input padding |
| `--input-copy-input-text-color` | `var(--theme-text)` | Input text colour |
| `--input-copy-input-font-size` | `var(--step-4)` | Input and button font size |
| `--input-copy-focus-ring` | `var(--theme-border-focus)` | `:focus-visible` outline colour on the input and the button |

### Button

| Token | Default | Controls |
|---|---|---|
| `--input-copy-button-bg` | `var(--input-button-primary-surface, var(--theme-surface))` | Button background |
| `--input-copy-button-bg-hover` | `var(--input-button-primary-surface-hover, var(--theme-surface-hover))` | Button background on hover |
| `--input-copy-button-text-color` | `var(--input-button-primary-text, var(--theme-on-surface))` | Button text and icon colour |
| `--input-copy-button-padding` | `0.8rem 1.2rem` | Button padding |
| `--input-copy-button-border-radius` | `0.4rem` | Button corner radius |
| `--input-copy-button-gap` | `0.6rem` | Gap between icon and label |

### Description

| Token | Default | Controls |
|---|---|---|
| `--input-copy-description-color` | `var(--theme-text)` | Description text colour |
| `--input-copy-description-font-size` | `var(--step-4)` | Description font size |
| `--input-copy-description-margin` | `0` | Description margin |
| `--input-copy-description-line-clamp` | `none` | Lines before the description is cut off with an ellipsis (`1` = single line) |

Private tokens (not public API): `--_input-font-size` on the root, the resolved input font size
shared by the input and the button.

## State hooks

- `.input-copy-copied` on the root for `copiedDuration` ms after a successful copy. The button then
  has `aria-disabled="true"` (it stays focusable and ignores clicks) and shows `copiedText` and
  `copiedIcon`.
- `disabled` on the button when `isDisabled` is set.
- Classes: `.input-copy` > `.input-copy__wrapper` > `.input-copy__input` and
  `.input-copy__button` (also `.input-button[data-variant="inline"]`, containing `.input-copy__icon` and
  `.input-button-text`); then `.input-copy__description` and a visually hidden `role="status"` span.
- Container: the root is `container: input-copy / inline-size`. Below `48rem` of its own width the
  button's `.input-button-text` is hidden and only the icon shows (the button keeps its aria-label).

## Global theming

```css
:where(html) {
  --input-copy-input-border-radius: 0.6rem;
  --input-copy-button-border-radius: 0.6rem;
}
```

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the
component need `:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

**Caveat:** the button sets `--input-button-text-white-space: normal` on itself so long labels wrap,
so a value set on an ancestor won't reach it.

## Class passthrough

`style-class-passthrough` adds classes to the root `.input-copy`, next to `.input-copy-copied`. It's
reachable in normal use and is a good place to set tokens for one instance.

## Notes

- The root is an inline-size container, so it can't size itself from its content: give it a width
  from its parent (it fills a block or grid cell; inside a flex row, give it `flex: 1` or a width).
- The button is capped at half the row (`max-inline-size: 50%`) and its label wraps, so a long
  translated label can't squeeze the input to nothing.
