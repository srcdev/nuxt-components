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
| `--select-menu-trigger-border` | `var(--theme-border)` | Trigger border colour (rest state) |
| `--select-menu-trigger-border-focus` | `var(--theme-border-focus)` | Trigger border colour on hover/focus |
| `--select-menu-trigger-border-radius` | `0.5rem` | Trigger corner rounding |
| `--select-menu-trigger-surface` | `var(--theme-input-surface)` | Trigger background |
| `--select-menu-trigger-text-color` | `var(--theme-text)` | Trigger label text colour |
| `--select-menu-trigger-font-size` | `1.6rem` | Trigger label font size |
| `--select-menu-trigger-outline-width` | `0.2rem` | Focus-visible outline width (trigger and items) |
| `--select-menu-trigger-icon-size` | `2rem` | Selected option's icon size in the trigger |
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
| `--select-menu-popover-max-height` | `32rem` | Maximum popover height before scrolling |
| `--select-menu-popover-shadow` | `0 0.4rem 1.6rem rgb(0 0 0 / 12%)` | Popover drop shadow |
| `--select-menu-transition-duration` | `200ms` | Open/close fade and chevron-rotate duration |

### Options

| Token | Default | Controls |
|---|---|---|
| `--select-menu-item-gap` | `0.8rem` | Gap between checkmark / icon / label in a row |
| `--select-menu-item-padding-block` | `1rem` | Option row vertical padding |
| `--select-menu-item-padding-inline` | `1.2rem` | Option row horizontal padding |
| `--select-menu-item-text-color` | `var(--theme-text)` | Option label colour |
| `--select-menu-item-font-size` | `1.5rem` | Option label font size |
| `--select-menu-item-surface-hover` | `var(--theme-input-surface-hover)` | Option row background on hover/focus |
| `--select-menu-item-check-size` | `1.6rem` | Checkmark icon box size |
| `--select-menu-item-check-color` | `currentcolor` | Checkmark icon colour |
| `--select-menu-item-icon-size` | `1.8rem` | Per-option icon size |

---

## Global theming — recommended approach

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

## Per-instance overrides via styleClassPassthrough

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
comma-joined list instead (falling back to `placeholder`/`label` when nothing is checked). The
trigger icon is not shown in multi-select mode (`showIcon` has no effect), since there's no single
selected option to represent.

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

- **Popover API + CSS anchor positioning** — same mechanism as `ActionMenu`. Broadly supported
  (Chrome 114+, Firefox 125+, Safari 17+). No polyfill is included.
- **Popover left-aligns with the trigger** by default (`left: anchor(left)`), unlike `ActionMenu`
  which right-aligns — matches native `<select>` dropdown behaviour. Flips above the trigger near
  the bottom of the viewport (`position-try-fallbacks: flip-block`).
- **Chevron rotation** is pure CSS via `:has(.select-menu-popover:popover-open)` — no JS state
  needed for the visual, though `isOpen` is still tracked internally to drive `aria-expanded`.
