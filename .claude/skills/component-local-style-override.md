# Component Local Style Override

## Overview

When including a component in a page or consuming component, visual customisation can be applied
locally using `styleClassPassthrough` combined with a scoped style block in the consuming file.
This avoids adding one-off props to the component and keeps customisation co-located with the usage.

No changes to the component are required.

---

## Pattern

### 1. Pass a modifier class via styleClassPassthrough

```vue
<CardCore :style-class-passthrough="['featured-card']">
  ...
</CardCore>
```

### 2. Add a style block in the consuming file

Scaffold this block when adding the component. Include a comment so future developers know it
is safe to delete if no overrides are needed.

```vue
<style>
/* ─── CardCore local overrides ─────────────────────────────────────
   Customise the appearance of this instance via CSS custom properties or
   direct overrides. Delete this block if no overrides are needed.
   Colours, borders, geometry only — do not override behaviour (display, pointer-events, etc.)
   ─────────────────────────────────────────────────────────────────────────── */
.card-core {
  &.featured-card {
    /* Colours */
    /* --_background-color: var(--brand-primary); */
    /* --_border-color: var(--brand-secondary); */

    /* Geometry */
    /* border-radius: 1.6rem; */

    /* Border / outline */
    /* --_border-width: 0.3rem; */
  }
}
</style>
```

---

## What to override

| Category | Examples | Approach |
|---|---|---|
| Colours | backgrounds, borders, text | CSS custom properties if the component exposes them, otherwise direct values |
| Geometry | border-radius, padding, gap | Direct property or `--_` private variable |
| Border / outline | width, style, colour | Direct property or `--_` private variable |

**Do not override behaviour** — `display`, `visibility`, `pointer-events`, `z-index`, animations.
Those belong in the component or a structural parent, not a style modifier.

---

## CSS custom property targeting

Components use `--_` prefixed private custom properties internally. These can be targeted via
a modifier class at higher specificity:

```css
/* Component internally defines: */
.my-component {
  --_background-color: white;
  background-color: var(--_background-color);
}

/* Consumer overrides via modifier: */
.my-component {
  &.my-modifier {
    --_background-color: var(--brand-surface); /* CSS token */
    /* or */
    --_background-color: #f5f0eb;              /* direct value */
  }
}
```

Note: `--_` properties are component-internal. If the component is updated and renames them,
the override will silently stop working. For shared/themeable overrides, prefer components that
expose `--theme-*` public variables instead.

---

## When to use this vs other approaches

| Situation | Approach |
|---|---|
| One-off visual tweak for a specific page/context | Local style override (this skill) |
| Consistent appearance across all instances site-wide | Default theme (`theming-override-default.md`) |
| Variant that belongs in the component itself | Add a `variant` prop value to the component |
| Structural layout change | Wrapper element or parent component |

### Component type guide

**Local overrides are appropriate for:**

- Display/content components — cards, panels, hero sections, media blocks
- Layout wrappers used in a specific visual context (e.g. a grid section with a tinted background)
- Any component whose appearance legitimately varies per page or usage context

**Keep styling global (theme/config) for:**

- Form elements and interactive controls — inputs, buttons, toggles, checkboxes
- Typography components used for consistency across the site
- Anything where visual inconsistency between instances would be a bug

The test: *should all instances of this component look the same?* If yes → theme. If instances are expected to look different → local override.

---

## Notes

- `styleClassPassthrough` accepts a string or array — pass an array when combining multiple modifiers.
- The modifier class lands on the component's root element, so nested element overrides need the
  full selector path: `.card-core.featured-card .card-row-header { ... }`.
- Keep the style block close to the component usage in the template — don't put it in a global stylesheet.
