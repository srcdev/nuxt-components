# Component Local Style Override

## Overview

When including a component in a consuming page or component, visual customisation (theming and
geometry) can be applied locally without modifying the component. Two patterns exist depending
on context.

No changes to the layer component are required for either pattern.

> **⚠️ Never wrap consumer-app override `<style>` blocks in a named `@layer`** (e.g.
> `@layer consumer`), even though library components wrap their own styles in `@layer components`
> and it's tempting to mirror that. Cascade layer priority is fixed by whichever layer name is
> first referenced anywhere in the document, not by its position in the library's master
> `@layer reset, colours, theming, form-tokens, typography, a11y, components, utilities, consumer;`
> statement. Nuxt/Nitro inlines many small per-component/per-page CSS chunks as `<style>` tags
> directly in `<head>` for SSR performance — if an inlined page/component chunk declares its own
> `@layer` before the library's main stylesheet (carrying that master statement) loads via its
> `<link>`, layer order gets scrambled and the library's own layers can silently win instead, with
> no build error (confirmed against a real `npm run build` + preview, not just `nuxt dev`). Keep
> override `<style>` blocks unlayered — unlayered CSS always beats every named layer regardless of
> document order, which is what makes both patterns below work reliably.

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

> **⚠️ Do not use `bodyAttrs.class` as the scope for a page's *own* local `<style>` overrides if the
> app uses `pageTransition`/`layoutTransition` (see `page-transitions.md`) — it races and breaks
> mid-transition. `unhead` swaps `<body>`'s class the instant the *incoming* route's component sets
> up, which happens as soon as navigation starts — not when the *outgoing* page's leave-transition
> finishes animating. For a real transition duration (not an instant swap), the outgoing page is
> still visible and mid-fade while `<body>` already carries the *new* page's class. Any selector
> that depends on the old body class as an ancestor (`.contact-page .hero-bg-image { position:
> absolute; ... }`) stops matching mid-fade, and the affected element snaps to unstyled/intrinsic
> sizing for the rest of the transition — confirmed via direct DOM/computed-style polling against a
> real `npm run build` + preview, not dev-server guesswork.
>
> Keep `bodyAttrs.class` for its legitimate use — a hook for *persistent* components (header, nav)
> that live outside the transitioning page to react to "which page is active." For a page's own
> local overrides, put a matching class directly on the page's own template root instead, so the
> scope lives on the exact element that's fading and can never desync from what's rendered:
>
> ```vue
> <template>
>   <div class="contact-page-content">
>     <div class="hero-section">...</div>
>   </div>
> </template>
> <style lang="css">
> .contact-page-content {
>   .hero-section { ... }
> }
> </style>
> ```
>
> Naming convention: `{name}-page-content` alongside the existing `{name}-page` body class keeps
> the two purposes visually distinct.

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
