# Component Local Style Override

## Overview

When including a component in a consuming page or component, visual customisation (theming and
geometry) can be applied locally without modifying the component. Two patterns exist depending
on context.

No changes to the layer component are required for either pattern.

---

## Pattern 1 — Page-level scoping (preferred for single-use or section-scoped instances)

The consuming page has a unique wrapper or body class. The `<style>` block is **unscoped** — no
`scoped` attribute — so component class names are targeted directly by nesting within the page
scope. No `:deep()` is needed.

```vue
<!-- In page template or parent component -->
<template>
  <div class="contact-page">
    <div class="hero-section">
      <SocialIconsList :items="socialItems" />
    </div>
  </div>
</template>

<!-- Unscoped style block — no `scoped` attribute -->
<style lang="css">
.contact-page {
  .hero-section {
    .social-icons-list {
      /* Theming */
      --theme-social-icon-size: 3.2rem;
      --theme-social-icon-gap: 2rem;
      color: var(--colour-brand-primary); /* drives currentColor on icons */

      /* Geometry */
      margin-block-start: 1.6rem;

      .social-icon-link {
        border-radius: 0.4rem;
        padding: 0.4rem;
      }
    }
  }
}
</style>
```

**Body class pattern**: Pages often set a unique class via `bodyAttrs.class` in `useHead()`, then
use that as the root scope for all page-specific overrides:

```ts
useHead({ bodyAttrs: { class: "contact-page" } })
```

```css
/* All overrides for the page nested under the body class */
.contact-page {
  .social-icons-list { ... }
  .hero-text { ... }
}
```

---

## Pattern 2 — Per-instance modifier via styleClassPassthrough

Use when the same component appears multiple times on a page and you need to target a specific
instance, or when the consuming file uses `<style scoped>` and needs an anchor class that survives
scoping.

```vue
<CardCore :style-class-passthrough="['featured-card']">
  ...
</CardCore>
```

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
  }
}
</style>
```

The modifier class lands on the component's root element — nested element overrides use the full
path: `.card-core.featured-card .card-row-header { ... }`.

---

## When to offer a scaffold

After placing a component in a consuming page or component, offer a CSS override scaffold. Use the
component's own class name and any `--theme-*` tokens it exposes as commented stubs. Cover theming
(colours, tokens) and geometry (sizes, spacing, borders) — not behaviour (`display`, `pointer-events`,
`z-index`, animations).

---

## What to override

| Category | Examples | Approach |
|---|---|---|
| Theming | icon colour, background, border colour | `--theme-*` tokens where exposed; otherwise direct values |
| Geometry | border-radius, padding, gap, size | Direct property or `--_` private variable |
| Border / outline | width, style, colour | Direct property or `--_` private variable |

**Do not override behaviour** — `display`, `visibility`, `pointer-events`, `z-index`, animations.
Those belong in the component or a structural parent.

---

## CSS custom property targeting

Components expose `--theme-*` public tokens and use `--_` private tokens internally:

```css
/* Component internally: --_icon-size: var(--theme-social-icon-size, 2.4rem) */

/* Override via --theme-* (stable, recommended): */
.social-icons-list {
  --theme-social-icon-size: 3.2rem;
}

/* Override via --_ private token (fragile — may break on component update): */
.social-icons-list {
  &.my-modifier {
    --_icon-size: 3.2rem;
  }
}
```

Prefer `--theme-*` tokens. Only target `--_` private variables when no `--theme-*` equivalent exists.

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
