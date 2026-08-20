# Page Transitions

## Overview

`pageTransition`/`layoutTransition` in `nuxt.config.ts` name the Vue `<Transition>` that wraps
`<NuxtPage>`/`<NuxtLayout>`. Getting the app's template structure wrong here means the whole page —
header, nav, footer included — fades/animates on every navigation, not just the routed content.
This is silent: no build error, no warning, it just looks visually wrong ("the header flickers/
fades too") once a transition actually has a visible duration.

## The anti-pattern

Each page self-wraps its own content in `<NuxtLayout name="default">` and sets
`definePageMeta({ layout: false })` to stop Nuxt's automatic layout wrapping:

```vue
<!-- pages/contact.vue — WRONG -->
<template>
  <div>
    <NuxtLayout name="default">
      <div class="hero">...</div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>
```

This often isn't a deliberate choice — it's commonly left over from a Nuxt 3→4 directory-structure
migration, or copied from a page that had a real reason to opt out of the layout (rare). Once it's
in one page it tends to get copy-pasted to every page.

**Why it's wrong**: `<NuxtLayout name="default">` here is INSIDE the page component's own render
tree. Since `<NuxtPage>` (wrapped in the `pageTransition`) renders the matched page component as
its child, the layout — including the header, nav, and footer defined in `layouts/default.vue` —
becomes part of the transitioning subtree. Every navigation unmounts and remounts the *entire*
layout, and it visually fades/animates along with the page content.

## The correct pattern

Don't set `layout: false`. Don't wrap page content in `<NuxtLayout>` inside the page itself. Let
Nuxt's default `app.vue` (no need to write your own) apply the layout once, persistently, at the
app level:

```vue
<!-- pages/contact.vue — CORRECT -->
<template>
  <div class="contact-page-content">
    <div class="hero">...</div>
  </div>
</template>

<script setup lang="ts">
// no definePageMeta({ layout: false }) needed
</script>
```

`layouts/default.vue` itself needs no changes — it already receives page content via its
`<slot name="default">` (or plain `<slot>`), which is exactly what Nuxt's automatic wrapping
provides.

With this structure, `pageTransition` only ever wraps the page component's own root element
(`.contact-page-content` etc.) — the header/nav/footer live in the persistent `<NuxtLayout>`
*outside* `<NuxtPage>`, so they never unmount, never fade, and stay visually static across every
navigation. Verified via Playwright: with a real transition duration in place, the header DOM node
and its computed `opacity` stay unchanged for the header across the whole navigation, while only
the page-content element's class list cycles through
`page-leave-from` → `page-leave-active`/`page-leave-to` → `page-enter-from`/`page-enter-active` →
`page-enter-to`.

## Migrating an app off the anti-pattern

For every page:

1. Remove `definePageMeta({ layout: false })` (delete the whole call if that was its only option).
2. Remove the `<NuxtLayout name="default">`/`</NuxtLayout>` wrapper tags from the template,
   de-indenting the content that was inside them by one level. Keep the page's own outer element
   (add a scoping class here if it didn't have one — see the body-class warning in
   `component-local-style-override.md`, since this is also the right place to move any
   `bodyAttrs.class`-scoped local `<style>` to).

Verify with `npx tsc --noEmit` (or `nuxt build`) afterward — a stray extra `</NuxtLayout>` or
mismatched brace is easy to leave behind when doing this across many files by hand.

## Giving the transition an actual CSS effect

`pageTransition: { name: "page", mode: "out-in" }` alone does nothing visible — Vue's `<Transition>`
needs matching CSS classes or it's an instant, unanimated swap. A simple fade:

```css
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
```

`mode: "out-in"` fades the old page fully out before the new one fades in — no overlap, no need for
`position: absolute` tricks during the transition.

## See also

- `component-local-style-override.md` — the body-class race this pattern also exposes, and the
  `{name}-page-content` naming convention used above
