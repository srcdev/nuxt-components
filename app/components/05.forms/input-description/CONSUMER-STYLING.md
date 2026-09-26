# InputDescription — Consumer Styling Guide

`InputDescription` is the help text rendered between the label and the control by every `*Field`
wrapper (`InputTextWithLabel`, `InputNumberField`, `InputSelectWithLabel`,
`InputTextareaWithLabel`, `InputRangeDefault`, `InputTextAsNumberWithLabel`, `SingleCheckbox`,
`MultipleCheckboxes`, `MultipleRadiobuttons`) when you pass it a `descriptionText` or
`descriptionHtml` slot. With neither slot it renders nothing.

## Public token API

Every token is consumed as `var(--input-description-*, {default})` and none is declared on the
element itself, so set them on any ancestor (or `:root`) and they inherit down.

### Panel (root `.input-description`)

| Token | Default | Controls |
|---|---|---|
| `--input-description-color` | `inherit` | Text colour of both slots |
| `--input-description-background-color` | `transparent` | Background |
| `--input-description-margin-block` | `0` | Block margin (space from the label and control) |
| `--input-description-margin-inline` | `0` | Inline margin |
| `--input-description-padding-block` | `0` | Block padding |
| `--input-description-padding-inline` | `0` | Inline padding |
| `--input-description-border` | `0` | Border shorthand, e.g. `0.1rem solid var(--theme-border)` |
| `--input-description-border-radius` | `0` | Corner radius |
| `--input-description-outline` | `0` | Outline shorthand |
| `--input-description-outline-offset` | `0` | Outline offset |

These match `FormFieldset`'s `--form-fieldset-*` panel tokens.

### Slots (`.input-description-html` and `.input-description-text`)

| Token | Default | Controls |
|---|---|---|
| `--input-description-slot-margin-block-start` | `0.4rem` | Space above each slot's wrapper |
| `--input-description-slot-margin-block-end` | `0.8rem` | Space below each slot's wrapper |
| `--input-description-slot-margin-inline` | `0` | Inline margin of each slot's wrapper |
| `--input-description-font-size` | `var(--step-4)` | Font size of the `descriptionText` paragraph |
| `--input-description-line-height` | `var(--step-4)` | Line height of the `descriptionText` paragraph. The default equals the font size, which is tight for wrapping text, so `1.5` is a good override for long descriptions |

With default (unpadded) panel tokens, the slot margins collapse through the root, so they are what
spaces the description from the label and control. Beyond these the `descriptionHtml` wrapper
sets nothing: style your own markup inside it directly.

No private tokens.

> **Changed 2026-09-26**: the text colour used to read `--form-description-color`, which nothing
> ever declared, so it always inherited. Use `--input-description-color` instead.

---

## State hooks

| Attribute on `.input-description` | When |
|---|---|
| `data-input-variant="normal" \| "outlined" \| "underlined"` | Always, mirrors the field's `input-variant` (not passed by `InputRangeDefault`, which has no variants, so it stays `normal` there) |
| `data-invalid` | The field has an error |

Inner elements: `.input-description-html` (div), `.input-description-text` (p).

---

## Global theming

Every field's description at once, from an app-level stylesheet (e.g. `app/assets/styles/main.css`):

```css
:where(html) {
  --input-description-color: var(--theme-input-placeholder);
  --input-description-line-height: 1.5;
}
```

---

## Local overrides

Set the tokens on an element you own that wraps the field(s): they inherit down into the
description. Keep these blocks **unlayered** (no `@layer ...` wrapper) so they beat the library's
`@layer components` styles. Full background in `.claude/skills/component-local-style-override.md`.

### Page or section

```vue
<template>
  <div class="contact-page-content">
    <InputTextWithLabel v-model="email" name="email" label="Email">
      <template #descriptionText>We'll only use this for your booking confirmation</template>
    </InputTextWithLabel>
  </div>
</template>

<style>
.contact-page-content {
  --input-description-font-size: 1.4rem;
  --input-description-slot-margin-block-end: 1.2rem;

  .input-description[data-invalid] {
    --input-description-color: var(--theme-error-border);
  }
}
</style>
```

### One field

The wrappers don't forward `style-class-passthrough` to the description, but a plain `class` on
the wrapper itself lands on its root element, which is an ancestor of the description:

```vue
<InputTextWithLabel class="email-field" v-model="email" name="email" label="Email">
  <template #descriptionText>We'll only use this for your booking confirmation</template>
</InputTextWithLabel>

<style>
.email-field {
  --input-description-color: var(--theme-accent);
}
</style>
```

### If your page or component uses `<style scoped>`

This library's components use plain (unscoped) styles, so this only matters when the overriding
file in **your** app is scoped. Vue then adds your file's scope attribute to every selector, and
the description's elements don't carry it.

Tokens set on your own element still work, because your element carries the attribute and custom
properties inherit down. Selectors that reach **into** the description
(`.input-description[data-invalid]`, `.input-description-text`) won't match. Wrap them in
`:deep()`, or use an unscoped `<style>` block as in the examples above:

```vue
<style scoped>
.contact-page-content {
  --input-description-font-size: 1.4rem; /* works as-is */

  :deep(.input-description[data-invalid]) {
    --input-description-color: var(--theme-error-border);
  }
}
</style>
```

---

## Recipe: panel / callout

Once the root has padding or a border, the slot margins no longer collapse through it and would
show as uneven space inside the panel. Zero them and space the panel with the root margins:

```css
.booking-form {
  --input-description-background-color: var(--theme-surface-subtle);
  --input-description-border: 0.1rem solid var(--theme-border);
  --input-description-border-radius: 0.6rem;
  --input-description-margin-block: 0.4rem 0.8rem;
  --input-description-padding-block: 0.8rem;
  --input-description-padding-inline: 1.2rem;
  --input-description-slot-margin-block-start: 0;
  --input-description-slot-margin-block-end: 0;

  /* only needed when a field uses both slots */
  .input-description-html + .input-description-text {
    margin-block-start: 0.4rem;
  }
}
```

---

## Class passthrough

`:style-class-passthrough` (string or string array) adds classes to the root
`.input-description` element. It's only reachable when you render `InputDescription` directly in
a custom field wrapper: the library's own wrappers pass `input-text-description` (no styles
attached) and don't forward yours. Use a `class` on the wrapper instead (see **One field** above).
