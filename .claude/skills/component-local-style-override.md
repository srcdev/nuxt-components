# Component Local Style Override

## Overview

When including a component in a consuming page or component, visual customisation (theming and
geometry) can be applied locally without modifying the component. Two patterns exist depending
on context.

No changes to the layer component are required for either pattern.

The main mechanism is the component's **public tokens** (`--component-name-*`, listed in its
`CONSUMER-STYLING.md`). They're only ever read with a fallback, never declared on the component's
own elements, so setting them on any ancestor you own reaches the component by normal custom
property inheritance. Every compliant `CONSUMER-STYLING.md` has a **Local overrides** section
applying this guide to that component.

> **This library's own component styles are never `scoped`.** Everything below about
> `<style scoped>` concerns the **consumer's** file (a page or component in the app that extends
> this layer), not the library.

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

## Site-wide component defaults (the baseline local overrides build on)

Before any page or instance override, a consuming app usually sets its own **site-wide** values for
a component's public tokens: one file per component under `app/assets/styles/setup/03.theming/`,
each imported from that folder's `index.css` alongside `_default.css` (see
`consumer-styles-structure.md` for the whole `setup/` tree):

```css
/* app/assets/styles/setup/03.theming/_card-core.css */
/* CardCore — site-wide card look. */
:where(html) {
  --card-core-background-color: var(--rose-01);
  --card-core-border: 0.1rem solid var(--rose-03);
  --card-core-border-radius: 1.2rem;
}
```

```css
/* app/assets/styles/setup/03.theming/index.css */
@import "./_default.css";
@import "./_card-core.css";
```

Why `:where(html)` rather than `:root` or `html`:

- `:where()` has **zero specificity**, so this is the weakest possible declaration on `<html>`. Any
  other rule setting the same token on `<html>` wins without a fight: a colour-scheme selector
  (`html[data-color-scheme="dark"] { ... }`), or a page-level `html.checkout-page { ... }`.
  `:root` (0,1,0) would outrank or tie those and force specificity games.
- Page and instance overrides (the patterns below) set the token on a descendant element, so they
  win through inheritance regardless of specificity: the nearest declaration is what the component
  reads.
- Keep these files unlayered, same as everything else here (see the warning above).

Only set tokens the component's current `CONSUMER-STYLING.md` lists. Components that haven't been
through `/migrate-component` yet may still rename tokens when they are, so check a site-defaults
file against the doc after upgrading the layer.

Use this for "every instance on the site should look like this"; use the patterns below for
"this page/section/instance differs from the site default". A component's `CONSUMER-STYLING.md`
**Global theming** section, when it has one, is a starting point for this file.

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
      <CardCore>...</CardCore>
    </div>
  </div>
</template>

<!-- Unscoped style block — no `scoped` attribute -->
<style lang="css">
.contact-page {
  .hero-section {
    /* Public tokens: set on your own element, inherited by the component */
    --card-core-background-color: var(--colour-brand-surface);
    --card-core-border-radius: 1.6rem;

    /* Direct property on the component root, only where no token covers it */
    .card-core {
      margin-block-start: 1.6rem;
    }
  }
}
</style>
```

**Body class pattern**: Pages often set a unique class via `bodyAttrs.class` in `useHead()`, then
use that as the root scope for all page-specific overrides:

```ts
useHead({ bodyAttrs: { class: "contact-page" } });
```

```css
/* All overrides for the page nested under the body class */
.contact-page {
  --card-core-border-radius: 1.6rem;
  .hero-text { ... }
}
```

> \**⚠️ Do not use `bodyAttrs.class` as the scope for a page's *own* local `<style>` overrides if the
> app uses `pageTransition`/`layoutTransition` (see `page-transitions.md`) — it races and breaks
> mid-transition. `unhead` swaps `<body>`'s class the instant the *incoming* route's component sets
> up, which happens as soon as navigation starts — not when the *outgoing* page's leave-transition
> finishes animating. For a real transition duration (not an instant swap), the outgoing page is
> still visible and mid-fade while `<body>` already carries the *new\* page's class. Any selector
> that depends on the old body class as an ancestor (`.contact-page .hero-bg-image { position:
absolute; ... }`) stops matching mid-fade, and the affected element snaps to unstyled/intrinsic
> sizing for the rest of the transition — confirmed via direct DOM/computed-style polling against a
> real `npm run build` + preview, not dev-server guesswork.
>
> Keep `bodyAttrs.class` for its legitimate use — a hook for _persistent_ components (header, nav)
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
instance.

If the component you're rendering is a **wrapper** that doesn't forward `styleClassPassthrough` to
the inner component you want to style (e.g. `InputDescription` inside `InputTextWithLabel`), put a
plain `class` on the wrapper instead. Vue falls it through to the wrapper's root element, which is
an ancestor of the inner component, so tokens set there inherit down. This needs the wrapper to
have a single root element and not set `inheritAttrs: false`.

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
    /* --card-core-background-color: var(--brand-primary); */
    /* --card-core-border: 0.1rem solid var(--brand-secondary); */

    /* Geometry */
    /* --card-core-border-radius: 1.6rem; */
  }
}
</style>
```

The modifier class lands on the component's root element — nested element overrides use the full
path: `.card-core.featured-card .card-row-header { ... }`.

---

## Consumer files using `<style scoped>`

Vue adds the consuming file's scope attribute (`[data-v-xxxx]`) to the last compound selector of
every rule in a scoped block. Your own template elements carry that attribute; the library
component's elements don't. So:

| Override                                                                                                                                | In a consumer's scoped block                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Public token set on **your own** element (`.contact-page { --card-core-border-radius: 1.6rem; }`)                                       | Works unchanged: your element matches, and the token inherits into the component |
| Class/attribute on the component's **root** passed from your template (`:style-class-passthrough`, or `class` fallthrough)              | Works: Vue also puts your scope attribute on a child component's root element    |
| Anything **inside** the component (`.card-core-header`, `.input-description[data-invalid]` when the description is nested in a wrapper) | Doesn't match. Wrap it in `:deep()`, or move it to an unscoped `<style>` block   |

```vue
<style scoped>
.contact-page {
  --input-description-font-size: 1.4rem; /* works as-is */

  :deep(.input-description[data-invalid]) {
    --input-description-color: var(--theme-error-border);
  }
}
</style>
```

Prefer tokens on your own element wherever one exists: it works the same in scoped and unscoped
files and doesn't depend on the component's internal class names.

---

## When to offer a scaffold

After placing a component in a consuming page or component, offer a CSS override scaffold. Use the
component's own class name and the public `--component-name-*` tokens listed in its
`CONSUMER-STYLING.md` as commented stubs. Cover theming
(colours, tokens) and geometry (sizes, spacing, borders) — not behaviour (`display`, `pointer-events`,
`z-index`, animations).

---

## What to override

| Category         | Examples                               | Approach                                                   |
| ---------------- | -------------------------------------- | ---------------------------------------------------------- |
| Theming          | icon colour, background, border colour | The component's public tokens; otherwise a direct property |
| Geometry         | border-radius, padding, gap, size      | The component's public tokens; otherwise a direct property |
| Border / outline | width, style, colour                   | The component's public tokens; otherwise a direct property |

**Do not override behaviour** — `display`, `visibility`, `pointer-events`, `z-index`, animations.
Those belong in the component or a structural parent.

---

## CSS custom property targeting

Components expose **public** tokens named after the component (`--card-core-border-radius`,
`--input-description-color`) and may use **private** `--_` tokens internally:

```css
/* Public token (stable API, recommended): set on any ancestor you own */
.contact-page {
  --card-core-border-radius: 1.6rem;
}
```

Private `--_` tokens are internal implementation detail and can change or disappear in any
release. Don't override them. If a value you need has no public token, that's a gap in the
component: raise it (or fix it in the library) rather than depending on the private name.

Some older, not-yet-migrated components still read global `--theme-*` tokens directly instead of
their own component tokens (see CLAUDE.md pitfall #14). Those work as ancestor overrides too, but
they're shared by every component reading them, so scope the override tightly.

---

## When to use this vs other approaches

| Situation                                            | Approach                                      |
| ---------------------------------------------------- | --------------------------------------------- |
| One-off visual tweak for a specific page/context     | Local style override (this skill)             |
| Consistent appearance across all instances site-wide | Default theme (`theming-override-default.md`) |
| Variant that belongs in the component itself         | Add a `variant` prop value to the component   |
| Structural layout change                             | Wrapper element or parent component           |

### Component type guide

**Local overrides are appropriate for:**

- Display/content components — cards, panels, hero sections, media blocks
- Layout wrappers used in a specific visual context (e.g. a grid section with a tinted background)
- Any component whose appearance legitimately varies per page or usage context

**Usually better themed globally:**

- Form elements and interactive controls — inputs, buttons, toggles, checkboxes
- Typography components used for consistency across the site
- Anything where visual inconsistency between instances would be a bug

These all expose the same public tokens, so a local override is still available when a context
genuinely calls for it (e.g. a form on a dark hero section). The point is the default, not a ban.

The test: _should all instances of this component look the same?_ If yes → theme. If instances are expected to look different → local override.
