# useAnchorScroll Composable

## Overview

`useAnchorScroll` intercepts `#hash` link clicks and smooth-scrolls to the target element.
Routes and external links pass through untouched, so the same handler is safe to attach to
every navigation link without conditional logic in the template.

Respects `prefers-reduced-motion` — when the user opts out of motion, `handleNavClick` returns
early without calling `preventDefault`, leaving the browser's native anchor jump intact.

**Ships inside the `srcdev-nuxt-components` layer** (`app/composables/useAnchorScroll.ts`).
Auto-imported by Nuxt — **do not create a local copy**.

---

## API reference

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `offset` | `number &#124; (() => number)` | `0` | Pixels subtracted from the final scroll position. Pass a getter function to read a sticky element's height at scroll time rather than at composable init. |
| `offsetElement` | `Ref<HTMLElement &#124; null>` | — | Convenience alternative to `offset`. Reads `element.offsetHeight` at scroll time. Takes priority over `offset` when both are supplied. |

### Returns

| Name | Type | Description |
|---|---|---|
| `handleNavClick` | `(event: MouseEvent, href: string) => void` | Attach to click handlers. No-ops silently for non-`#` hrefs — safe on all links. |
| `scrollToAnchor` | `(hash: string) => void` | Scroll programmatically. Accepts `"#section"` or `"section"`. Respects motion preference and offset. |
| `activeHash` | `Ref<string>` | Reactive ref tracking the currently active hash. Starts `""` on server and after hydration is set from `window.location.hash`. Updated on every `handleNavClick` call. Use this to drive `is-active` classes — **do not use `route.hash`**, which is not updated by `history.pushState`. |

---

## Active state

`activeHash` is the correct way to drive active-state styling on anchor nav links.

**Why not `route.hash`?** `handleNavClick` calls `history.pushState` directly (to avoid triggering Vue Router's scroll behaviour). `pushState` does not update Vue Router's reactive `route.hash`, so `route.hash` stays stale after clicks.

**Hydration safety:** `activeHash` is initialised to `""` on both server and client so the SSR-rendered HTML always matches the pre-mount client vdom. The real hash is applied in `onMounted`, after hydration, to avoid mismatches.

**Default active item:** `activeHash` is empty until `onMounted` fires. If no hash is in the URL, set a default in the component's own `onMounted` (which runs after the composable's `onMounted`):

```ts
const { handleNavClick, activeHash } = useAnchorScroll({ offset: 64 });

onMounted(() => {
  // Default to first section when no hash is in the URL
  if (!activeHash.value && sections[0]) activeHash.value = `#${sections[0].id}`;
});
```

### Binding active state in a template

```vue
<a
  v-for="section in sections"
  :key="section.id"
  :href="`#${section.id}`"
  :class="{ 'is-active': `#${section.id}` === activeHash }"
  @click="(e) => handleNavClick(e, `#${section.id}`)"
>{{ section.label }}</a>
```

### Active state in TabNavigation

`TabNavigation` handles `activeHash` internally for hash nav items. No extra work needed —
just pass anchor hrefs in `navItemData` and the active indicator moves automatically on click
and on initial load (defaulting to the first hash item when the URL has no hash).

---

## Usage patterns

### 1. TabNavigation with a sticky site header

`TabNavigation` accepts an `anchorScrollOffset` prop that is passed directly to `useAnchorScroll`.
Pass a getter so the live header height is read at scroll time — this stays correct if the
header resizes on different viewports.

```vue
<header ref="headerRef">
  <TabNavigation
    :nav-item-data="navItemData"
    :anchor-scroll-offset="() => headerRef?.offsetHeight ?? 0"
  />
</header>
```

```ts
const headerRef = ref<HTMLElement | null>(null);

const navItemData = {
  main: [
    { text: "About",    href: "#about" },
    { text: "Services", href: "#services" },
    { text: "Contact",  href: "#contact" },
    { text: "Blog",     href: "/blog" },  // route — NuxtLink handles as normal
  ],
};
```

**CSS alternative** — if you want all anchor links site-wide to respect the sticky header
(not just the ones inside `TabNavigation`), add `scroll-padding-top` to `html` instead and
skip the prop:

```css
/* ─ app/assets/styles/setup/01.config/_head.css ─ */
html {
  scroll-padding-top: var(--sticky-header-height, 64px);
}
```

```css
/* ─ app/assets/styles/main.css ─ */
:root {
  --sticky-header-height: 64px; /* adjust to match actual header height */
}
```

`scrollIntoView` respects `scroll-padding-top`, so this works with the no-offset code path.

---

### 2. Sticky section nav with dynamic offset (using offsetElement)

The `offsetElement` option is the clearest way to derive an offset from an element ref.
It reads `offsetHeight` at scroll time, so resize changes are always captured.

```ts
const stickyNavRef = ref<HTMLElement | null>(null);

const { handleNavClick, activeHash } = useAnchorScroll({ offsetElement: stickyNavRef });

onMounted(() => {
  if (!activeHash.value && sections[0]) activeHash.value = `#${sections[0].id}`;
});
```

```vue
<nav ref="stickyNavRef" class="sticky-section-nav">
  <a
    v-for="section in sections"
    :key="section.id"
    :href="`#${section.id}`"
    :class="{ 'is-active': `#${section.id}` === activeHash }"
    @click="(e) => handleNavClick(e, `#${section.id}`)"
  >{{ section.label }}</a>
</nav>

<section v-for="section in sections" :key="section.id" :id="section.id">…</section>
```

CSS to make the nav sticky:

```css
.sticky-section-nav {
  position: sticky;
  top: 0;
  z-index: 5;
}
```

---

### 3. Terms / long-form page with sidebar nav

Same pattern as above — useful for terms, privacy policy, or documentation pages where a
sidebar links to in-document sections.

```ts
const { handleNavClick, activeHash } = useAnchorScroll({ offset: 24 }); // fixed header height
```

```vue
<aside class="terms-sidebar">
  <nav>
    <a v-for="section in termsSections" :key="section.id"
       :href="`#${section.id}`"
       :class="{ 'is-active': `#${section.id}` === activeHash }"
       @click="(e) => handleNavClick(e, `#${section.id}`)">
      {{ section.title }}
    </a>
  </nav>
</aside>

<article>
  <section v-for="section in termsSections" :key="section.id" :id="section.id">
    <h2>{{ section.title }}</h2>
    <p>{{ section.body }}</p>
  </section>
</article>
```

---

### 4. Programmatic scroll (no click event)

Use `scrollToAnchor` to scroll without a click — after a form submission, on route entry, or
from any imperative call.

```ts
const { scrollToAnchor } = useAnchorScroll({ offset: 64 });
```

```ts
// Scroll to a section after successful form submit
const handleSubmit = async () => {
  await submitForm();
  scrollToAnchor("#confirmation");
};
```

```ts
// Scroll to the current URL hash on mount
const route = useRoute();

onMounted(() => {
  if (route.hash) scrollToAnchor(route.hash);
});
```

---

## How offset works

Without `offset` or `offsetElement`, the composable calls `el.scrollIntoView({ behavior, block: "start" })` —
the element's top edge aligns with the viewport top.

With an offset, it uses `window.scrollTo` with a calculated position:

```
top = el.getBoundingClientRect().top + window.scrollY - offset
```

This shifts the final resting position downward by `offset` pixels, so a sticky bar of that
height does not overlap the section heading.

**`offsetElement` vs `offset` getter:**

```ts
// ✅ offsetElement — reads offsetHeight at click time, no boilerplate
const { handleNavClick, activeHash } = useAnchorScroll({ offsetElement: navRef });

// ✅ offset getter — equivalent, useful when the offset is derived from more than one element
const { handleNavClick, activeHash } = useAnchorScroll({
  offset: () => navRef.value?.offsetHeight ?? 0,
});

// ✗ Static offset — stale if the bar changes height later
const { handleNavClick, activeHash } = useAnchorScroll({
  offset: navRef.value?.offsetHeight ?? 0,
});
```

---

## Reduced motion behaviour

When `window.matchMedia("(prefers-reduced-motion: reduce)").matches` is `true`:

- **`handleNavClick`** — returns early without calling `preventDefault`. The browser or Vue
  Router handles the anchor jump natively (instant, no scroll animation).
- **`scrollToAnchor`** — uses `behavior: "instant"` instead of `"smooth"`.

No configuration needed — the check happens at call time, so toggling the OS preference mid-session
takes effect immediately on the next click.

> **Debugging tip:** If clicks produce an instant jump instead of smooth scroll, check whether
> "Reduce Motion" is enabled in your OS accessibility settings (macOS: System Preferences →
> Accessibility → Display → Reduce Motion). This is intentional behaviour, not a bug.

---

## Notes

- **`activeHash` vs `route.hash`** — always use `activeHash` for active-state classes. `route.hash`
  is not updated by `history.pushState` and will be stale after clicks.
- **Hydration mismatches** — `activeHash` is always `""` at render time; the real value is set in
  `onMounted`. Never initialise it from `window.location.hash` in setup — that causes a server/client
  class mismatch.
- **`history.pushState`** — `handleNavClick` pushes the hash into the URL so the back button and
  deep links work correctly. This runs after `preventDefault` stops Vue Router from navigating,
  so the URL stays in sync without triggering a router scroll.
- **Non-existent targets** — if no element matches the hash, `scrollToAnchor` silently returns.
  No error is thrown, so attaching the handler to all links is safe even when some are routes or
  the target section isn't on the current page.
- **SSR** — both `handleNavClick` and `scrollToAnchor` guard with `import.meta.server` and return
  early. No special SSR setup is needed.
- **Multiple instances** — each call to `useAnchorScroll` is independent. You can run a sticky
  section nav alongside a `TabNavigation` on the same page with different offsets.
