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
| `offset` | `number \| (() => number)` | `0` | Pixels subtracted from the final scroll position. Pass a getter function to read a sticky element's height at scroll time rather than at composable init. |

### Returns

| Name | Type | Description |
|---|---|---|
| `handleNavClick` | `(event: MouseEvent, href: string) => void` | Attach to click handlers. No-ops silently for non-`#` hrefs — safe on all links. |
| `scrollToAnchor` | `(hash: string) => void` | Scroll programmatically. Accepts `"#section"` or `"section"`. Respects motion preference and offset. |

---

## Usage patterns

### 1. TabNavigation with anchor links (no extra code needed)

`TabNavigation` has `useAnchorScroll` wired up internally. Pass anchor hrefs in
`navItemData.main` and smooth scrolling works automatically.

```ts
const navItemData = {
  main: [
    { text: "About",    href: "#about" },
    { text: "Services", href: "#services" },
    { text: "Contact",  href: "#contact" },
    { text: "Blog",     href: "/blog" },  // route — NuxtLink handles as normal
  ],
};
```

```vue
<TabNavigation :nav-item-data="navItemData" />
```

No offset is applied here. If your site header is fixed/sticky and obscures section headings,
use pattern 2 below to build a custom nav with an explicit offset.

---

### 2. Sticky section nav with dynamic offset

The most common single-page pattern: a sticky bar at the top of the content area, where
each link scrolls to a section below it. Pass a getter for `offset` so the bar's live height
is read at scroll time — this stays correct if the bar resizes (e.g. on viewport changes).

```ts
const stickyNavRef = ref<HTMLElement | null>(null);

const { handleNavClick } = useAnchorScroll({
  offset: () => stickyNavRef.value?.offsetHeight ?? 0,
});
```

```vue
<nav ref="stickyNavRef" class="sticky-section-nav">
  <a href="#overview" @click="(e) => handleNavClick(e, '#overview')">Overview</a>
  <a href="#pricing"  @click="(e) => handleNavClick(e, '#pricing')">Pricing</a>
  <a href="#contact"  @click="(e) => handleNavClick(e, '#contact')">Contact</a>
</nav>

<section id="overview">…</section>
<section id="pricing">…</section>
<section id="contact">…</section>
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
const { handleNavClick } = useAnchorScroll({ offset: 24 }); // fixed header height
```

```vue
<aside class="terms-sidebar">
  <nav>
    <a v-for="section in termsSections" :key="section.id"
       :href="`#${section.id}`"
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

Without `offset`, the composable calls `el.scrollIntoView({ behavior, block: "start" })` —
the element's top edge aligns with the viewport top.

With `offset`, it uses `window.scrollTo` with a calculated position:

```
top = el.getBoundingClientRect().top + window.scrollY - offset
```

This shifts the final resting position downward by `offset` pixels, so a sticky bar of that
height does not overlap the section heading.

**Use a getter when the bar can resize:**

```ts
// ✅ Read height at click time
const { handleNavClick } = useAnchorScroll({
  offset: () => navRef.value?.offsetHeight ?? 0,
});

// ✗ Captured at init — stale if the bar changes height later
const { handleNavClick } = useAnchorScroll({
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

---

## Notes

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
