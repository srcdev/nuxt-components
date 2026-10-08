# SelectMenu — Consumer Styling Guide

## Public token API

All `--select-menu-*` tokens are the stable override surface, each falling back to a `--theme-*`
global token so it matches the rest of the design system out of the box.

### Trigger button

| Token | Default | Controls |
|---|---|---|
| `--select-menu-trigger-gap` | `0.8rem` | Gap between icon / label / chevron |
| `--select-menu-trigger-min-height` | `4.4rem` | Trigger minimum height |
| `--select-menu-trigger-padding-block` | `0.8rem` | Trigger vertical padding |
| `--select-menu-trigger-padding-inline` | `1.2rem` | Trigger horizontal padding |
| `--select-menu-trigger-border-width` | `0.1rem` | Trigger border thickness |
| `--select-menu-trigger-border-width-underlined` | `var(--form-element-border-bottom-width-underlined, 0.3rem)` | Bottom border thickness in the `underlined` variant |
| `--select-menu-trigger-border` | `var(--theme-border)` | Trigger border colour (rest state) |
| `--select-menu-trigger-border-focus` | `var(--theme-border-focus)` | Trigger border colour on hover/focus |
| `--select-menu-trigger-border-radius` | `0.5rem` | Trigger corner rounding |
| `--select-menu-trigger-surface` | `var(--theme-input-surface)` | Trigger background |
| `--select-menu-trigger-text-color` | `var(--theme-text)` | Trigger label text colour |
| `--select-menu-trigger-font-size` | `1.6rem` | Trigger label font size |
| `--select-menu-trigger-outline-width` | `0.2rem` | Focus-visible outline width (trigger and items) |
| `--select-menu-trigger-icon-size` | `2rem` | Leading icon size in the trigger (selected option's icon or `triggerIcon`) |
| `--select-menu-trigger-icon-color` | `currentcolor` | Leading icon colour (monochrome icon sets only) |
| `--select-menu-trigger-count-surface` | `var(--theme-surface-subtle)` | Count badge background (`indicator="count"`) |
| `--select-menu-trigger-count-text-color` | `var(--theme-text)` | Count badge text colour |
| `--select-menu-trigger-count-font-size` | `1.4rem` | Count badge font size |
| `--select-menu-trigger-count-font-weight` | `600` | Count badge font weight |
| `--select-menu-trigger-count-min-width` | `2.4rem` | Count badge minimum width, so 1 and 12 read as the same shape |
| `--select-menu-trigger-count-padding-block` | `0.2rem` | Count badge vertical padding |
| `--select-menu-trigger-count-padding-inline` | `0.6rem` | Count badge horizontal padding |
| `--select-menu-trigger-count-border-radius` | `0.4rem` | Count badge corner rounding (`999rem` for a pill) |
| `--select-menu-trigger-count-margin-inline` | `1.2rem 0` | Extra space around the count badge, on top of `--select-menu-trigger-gap` (start, end) |
| `--select-menu-trigger-dot-size` | `0.8rem` | Status dot diameter (`indicator="dot"`) |
| `--select-menu-trigger-dot-margin-inline` | `1.2rem 0` | Extra space around the status dot, on top of `--select-menu-trigger-gap` (start, end) |
| `--select-menu-trigger-dot-color` | `var(--theme-accent)` | Status dot colour when the selected option has no `dotColor` |
| `--select-menu-trigger-chevron-size` | `1.6rem` | Chevron icon size |

### Menu popover

| Token | Default | Controls |
|---|---|---|
| `--select-menu-block-distance` | `0.4rem` | Gap between trigger bottom and menu top |
| `--select-menu-popover-border-width` | `0.1rem` | Popover border thickness |
| `--select-menu-popover-border` | `var(--theme-border)` | Popover border colour |
| `--select-menu-popover-surface` | `var(--theme-input-surface)` | Popover background |
| `--select-menu-popover-border-radius` | `0.5rem` | Popover corner rounding |
| `--select-menu-popover-min-width` | `18rem` | Minimum popover width |
| `--select-menu-popover-max-width` | `calc(100vw - 3.2rem)` | Maximum popover width; longer option labels wrap (see `--select-menu-item-label-line-clamp`) |
| `--select-menu-popover-max-height` | `32rem` | Maximum popover height before scrolling |
| `--select-menu-popover-shadow` | `0 0.4rem 1.6rem rgb(0 0 0 / 12%)` | Popover drop shadow |
| `--select-menu-popover-z-index` | `999999` | Stacking order in browsers without CSS anchor positioning (see Notes). Ignored where the popover renders in the top layer |
| `--select-menu-transition-duration` | `200ms` | Open/close fade and chevron-flip duration |

### Options

| Token | Default | Controls |
|---|---|---|
| `--select-menu-item-gap` | `0.8rem` | Gap between checkmark / icon / label in a row |
| `--select-menu-item-padding-block` | `1rem` | Option row vertical padding |
| `--select-menu-item-padding-inline` | `1.2rem` | Option row horizontal padding |
| `--select-menu-item-text-color` | `var(--theme-text)` | Option label colour |
| `--select-menu-item-font-size` | `1.5rem` | Option label font size |
| `--select-menu-item-surface-hover` | `var(--theme-input-surface-hover)` | Option row background on hover/focus |
| `--select-menu-item-surface-selected` | `var(--theme-surface-subtle)` | Background of selected/checked option rows (hover/focus still wins) |
| `--select-menu-item-text-color-selected` | `--select-menu-item-text-color` | Selected row label colour (the checkmark follows via `currentcolor`) |
| `--select-menu-item-font-weight` | inherited | Option row font weight |
| `--select-menu-item-font-weight-selected` | `--select-menu-item-font-weight` | Selected row font weight; the popover reserves the bolder width, so selecting doesn't resize it |
| `--select-menu-item-border-width` | `0` | Block (top/bottom) border width on **every** row, so a selected border never shifts layout |
| `--select-menu-item-border` | `transparent` | Resting row border colour |
| `--select-menu-item-border-selected` | `--select-menu-item-border` | Selected row border colour. Two adjacent selected rows show both borders where they meet |
| `--select-menu-item-text-color-hover` | the row's current colour | Label colour on hover/focus. Unset, a selected row keeps its selected colour |
| `--select-menu-item-border-hover` | the row's current border | Border colour on hover/focus. Unset, a selected row keeps its selected border |
| `--select-menu-item-check-size` | `1.6rem` | Checkmark icon box size |
| `--select-menu-item-check-color` | `currentcolor` | Checkmark icon colour |
| `--select-menu-item-icon-size` | `1.8rem` | Per-option icon size |
| `--select-menu-item-dot-size` | `0.8rem` | Per-option status dot size (options with `dotColor` and no `icon`) |
| `--select-menu-item-label-line-clamp` | `none` | Lines an option label may take before it's cut with an ellipsis. `none` wraps the full label, `1` is single-line ellipsis |

> Changed 2026-10-08: long values used to push things off screen. The root now caps at its
> container's width (`max-inline-size: 100%`), so a long trigger label truncates with its ellipsis
> instead of overflowing. The popover caps at `--select-menu-popover-max-width`, and option labels
> wrap (they were `nowrap`, so a long one made the menu wider than the viewport). Set
> `--select-menu-item-label-line-clamp: 1` for the old single-line look.

---

## State hooks

| Hook | Where | Meaning |
|---|---|---|
| `.normal` / `.underlined` | `.select-menu` root | The `inputVariant` prop. `underlined` removes the trigger's top and side borders and its corner radius, matching `InputSelect`'s underlined variant. |
| `.select-menu-trigger[aria-expanded="true"]` | trigger | Menu open (flips the chevron vertically). Works with and without the Popover API. |
| `.select-menu-popover:popover-open` | popover | Menu open, Popover API browsers. |
| `.select-menu-popover-open` | popover | Menu open, browsers without the Popover API (Safari 16 and older). Style both open hooks in **separate rules**: a selector list containing `:popover-open` is dropped whole where it's unsupported. |
| `[data-placement="top"]` | popover | Flipped above the trigger, browsers without CSS anchor positioning only. |

> Changed 2026-10-05: the chevron hook moved from `:has(.select-menu-popover:popover-open)` on the
> root to the trigger's `aria-expanded`, so it also works without the Popover API.

---

## Global theming

Create `assets/styles/setup/07.components/select-menu.css` in the consuming app and set tokens
on `:root`. This applies to every `SelectMenu` across the site.

```css
/* assets/styles/setup/07.components/select-menu.css */
:root {
  --select-menu-trigger-border-radius: 999rem;
  --select-menu-trigger-surface: var(--brand-surface);
  --select-menu-trigger-border: var(--brand-border);

  --select-menu-popover-surface: var(--brand-surface);
  --select-menu-popover-border: var(--brand-border);
  --select-menu-popover-shadow: 0 0.8rem 2.4rem rgba(0, 0, 0, 0.15);

  --select-menu-item-surface-hover: var(--brand-surface-subtle);
  --select-menu-item-check-color: var(--brand-accent);
}
```

---

## Local overrides

Set the tokens above on an element you own (a page or section class, or a class added with
`:style-class-passthrough`): they inherit down into the component. Keep the block **unlayered** (no
`@layer` wrapper) so it beats the library's `@layer components`. If your own file uses
`<style scoped>`, tokens set on your element still work, but selectors that reach inside the component need
`:deep()`. Patterns and examples: `.claude/skills/component-local-style-override.md`.

### One instance

```vue
<SelectMenu
  v-model="language"
  :options="languageOptions"
  label="Language"
  :style-class-passthrough="['compact-switcher']"
/>
```

```css
.select-menu.compact-switcher {
  --select-menu-trigger-min-height: 3.2rem;
  --select-menu-trigger-padding-inline: 0.8rem;
  --select-menu-trigger-border-radius: 50%;
}
```

---

## Trigger content variants

`showIcon` / `showLabel` / `showChevron` control what renders in the trigger — combine them for
the three common shapes:

| Variant | Props |
|---|---|
| Icon-only (e.g. flag switcher in a tight header) | `:show-label="false" :show-chevron="false"` |
| Text + chevron (e.g. a category filter with no per-option icons) | `:show-icon="false"` (default `showLabel`/`showChevron`) |
| Icon + text + chevron (full select) | Defaults — no overrides needed |
| Filter: category icon + text + count/dot + chevron | `trigger-icon="lucide:list" indicator="count"` (or `"dot"`) |

### Stable trigger width

In single-select the trigger text changes with the selection, so by default the trigger resizes
("Active" to "Archived"). Set `reserve-label-width` to size it to the longest option label (or
placeholder) instead: hidden copies of each label (`.select-menu-trigger-label-sizer`) share a grid
cell with the visible text (`.select-menu-trigger-label-text`), and the root label span gets
`.select-menu-trigger-label-reserved`. No effect with `multiple`. If only some options have an
`icon`, the trigger can still change width when the icon appears; give them all an icon, or use
`triggerIcon`.

### Filter icon and indicator

`triggerIcon` sets a fixed leading icon (a category icon for a filter). It shows in both modes;
in single-select a selected option's own icon replaces it. `showIcon` hides either.

`indicator` adds a marker after the label, visible only while something is selected. With nothing
selected it stays in the layout but hidden (`.select-menu-trigger-indicator-empty`, `visibility:
hidden`), so the trigger doesn't change width as the filter is set and cleared. The count badge's
`--select-menu-trigger-count-min-width` fits two digits, so it only grows at 100+:

- `count`: a badge with the number selected. Meant for `multiple`.
- `dot`: a status dot. Meant for single-select, to flag that the filter is active.

Give options a `dotColor` (any CSS colour) to colour the dot per status: the trigger dot takes the
selected option's colour, and options with a `dotColor` and no `icon` show the same dot in the
list. The per-option colour beats `--select-menu-trigger-dot-color`, which stays the fallback
(and the only colour in `multiple` mode, where there's no single selected option). Pass a global
status token, e.g. `dotColor: "var(--status-success)"`, so the colours stay in step with every other
status indicator (see `.claude/skills/theming-status-tokens.md`).

The indicator is `aria-hidden`; instead the trigger's accessible name becomes
`"<label>, <selectedCountLabel>"` (default `"{count} selected"`, override it for translation).

---

## Single-select vs multi-select

By default `SelectMenu` is single-select: `v-model` is `string | number | undefined`, the selected
option shows a checkmark, and picking one closes the popover.

Set `multiple` for a checkbox-per-option multi-select instead: `v-model` becomes
`(string | number)[]`, every option shows a checkbox (checked/unchecked), and picking an option
toggles it in the array without closing the popover — so several can be picked in one open/close
cycle. By default the trigger text stays fixed on `placeholder`/`label` as a static category tag
(e.g. `"Services required"`) regardless of how many options are checked, since a comma-joined list
of checked options would grow unpredictably long. Set `showSelectionInTrigger` to opt into that
comma-joined list instead (falling back to `placeholder`/`label` when nothing is checked). No
option icon is shown in the trigger in multi-select mode, since there's no single selected option
to represent; a fixed `triggerIcon` still shows.

```vue
<script setup lang="ts">
const treatments = ref<string[]>([]);
const treatmentOptions = [
  { value: "trim", label: "Trim" },
  { value: "layers", label: "Layers" },
  { value: "restyle", label: "Restyle" },
  { value: "straightening", label: "Straightening" },
];
</script>

<template>
  <SelectMenu v-model="treatments" :options="treatmentOptions" label="Services required" multiple />

  <!-- Trigger updates to "Layers, Restyle" etc. as options are checked -->
  <SelectMenu
    v-model="treatments"
    :options="treatmentOptions"
    label="Services required"
    multiple
    show-selection-in-trigger
  />
</template>
```

For several independent single-select filter categories (rather than one multi-select category),
place multiple single-select `SelectMenu` instances side by side instead — see the "Filter Bar"
story.

---

## Notes

- **Popover API + CSS anchor positioning, with fallbacks** — same mechanism as `ActionMenu`, via the
  shared `useAnchoredPopover` composable. Without anchor positioning (e.g. Safari 17–18), the
  popover is placed with `position: fixed` from the trigger's measured position, re-measured on
  scroll and resize. Without the Popover API (Safari 16 and older), the menu also opens and
  closes in JS, with outside-click and Escape dismissal. In that mode it isn't in the top layer, so
  `--select-menu-popover-z-index` matters, and an ancestor with `transform`, `filter` or
  `contain` becomes its containing block and can misplace it.
- **Popover left-aligns with the trigger** by default (`left: anchor(left)`), unlike `ActionMenu`
  which right-aligns — matches native `<select>` dropdown behaviour. Flips above the trigger near
  the bottom of the viewport, and right-aligns when there's no room to the right
  (`position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline`). The inline flip needs
  CSS anchor positioning; the JS fallback only flips above/below.
- **Chevron flip** (`scaleY(-1)`, was `rotate(180deg)` until 2026-10-07) is driven by the trigger's `aria-expanded`, which tracks the open state in
  every browser.
