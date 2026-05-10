<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="content" :style-class-passthrough="['mbe-4']">
          <h1 class="page-heading-1">useAnchorScroll</h1>
          <p class="page-body-medium">
            Intercepts <code class="inline-code">#hash</code> link clicks and smooth-scrolls to
            the target element. Routes and external links pass through to NuxtLink unchanged.
            Respects <code class="inline-code">prefers-reduced-motion</code> — when the user opts
            out of motion, the default browser anchor jump is preserved with no custom scroll code
            involved.
          </p>
          <p class="page-body-medium">
            This page demonstrates the composable directly: the sticky bar below uses
            <code class="inline-code">useAnchorScroll</code> with a dynamic offset so section
            headings always land just below the bar after scrolling.
          </p>
        </LayoutRow>

        <div ref="stickyNavRef" class="anchor-scroll-sticky-nav">
          <LayoutRow tag="div" variant="content">
            <nav aria-label="Page sections">
              <ul class="anchor-nav-list">
                <li v-for="section in sections" :key="section.id">
                  <a
                    :href="`#${section.id}`"
                    class="anchor-nav-link"
                    @click="(e) => handleNavClick(e, `#${section.id}`)"
                  >{{ section.label }}</a>
                </li>
              </ul>
            </nav>
          </LayoutRow>
        </div>

        <section id="overview" class="anchor-demo-section">
          <LayoutRow tag="div" variant="content">
            <h2 class="page-heading-2">Overview</h2>
            <p class="page-body-medium">
              Single-page and anchor-linked layouts need a bridge between
              <code class="inline-code">NuxtLink</code> (which handles routes) and the browser's
              native anchor scrolling (which has no smooth-scroll guarantee).
              <code class="inline-code">useAnchorScroll</code> fills that gap.
            </p>
            <p class="page-body-medium">
              Pass any <code class="inline-code">#hash</code> href to
              <code class="inline-code">handleNavClick</code> — it prevents the default jump,
              pushes the hash into the URL, and scrolls to the matching element. Every other href
              (routes, external URLs) is a no-op, so the same handler is safe to attach to all
              navigation links without conditional logic in the template.
            </p>
            <p class="page-body-medium">
              An optional <code class="inline-code">offset</code> shifts the final scroll position
              upward — useful when a sticky bar would otherwise obscure the section heading. Pass a
              number for a fixed bar height or a getter function to read the bar's live height at
              scroll time.
            </p>
          </LayoutRow>
        </section>

        <section id="api" class="anchor-demo-section">
          <LayoutRow tag="div" variant="content">
            <h2 class="page-heading-2">API</h2>

            <h3 class="page-heading-3">Options</h3>
            <div class="api-table-wrapper">
              <table class="api-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="inline-code">offset</code></td>
                    <td><code class="inline-code">number | (() =&gt; number)</code></td>
                    <td><code class="inline-code">0</code></td>
                    <td>
                      Pixels subtracted from the scroll-to position. Pass a getter to read a sticky
                      element's height at scroll time rather than at composable init.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 class="page-heading-3">Returns</h3>
            <div class="api-table-wrapper">
              <table class="api-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code class="inline-code">handleNavClick</code></td>
                    <td><code class="inline-code">(event: MouseEvent, href: string) =&gt; void</code></td>
                    <td>
                      Attach to click handlers. No-ops silently for non-anchor hrefs so it is safe
                      on all links.
                    </td>
                  </tr>
                  <tr>
                    <td><code class="inline-code">scrollToAnchor</code></td>
                    <td><code class="inline-code">(hash: string) =&gt; void</code></td>
                    <td>
                      Programmatically scroll to a hash string (with or without the leading
                      <code class="inline-code">#</code>). Respects the same motion preference and
                      offset.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </LayoutRow>
        </section>

        <section id="usage" class="anchor-demo-section">
          <LayoutRow tag="div" variant="content">
            <h2 class="page-heading-2">Usage</h2>

            <h3 class="page-heading-3">In TabNavigation</h3>
            <p class="page-body-medium">
              <code class="inline-code">TabNavigation</code> already has
              <code class="inline-code">useAnchorScroll</code> wired up internally. Pass anchor
              hrefs in <code class="inline-code">navItemData</code> and it works automatically.
            </p>
            <pre class="demo-code">const navItemData = {
  main: [
    { text: "About",    href: "#about" },
    { text: "Services", href: "#services" },
    { text: "Contact",  href: "#contact" },
    { text: "Blog",     href: "/blog" },      // route — handled by NuxtLink as normal
  ],
};
</pre>
            <pre class="demo-code">&lt;TabNavigation :nav-item-data="navItemData" /&gt;
</pre>

            <h3 class="page-heading-3">Standalone (this page)</h3>
            <p class="page-body-medium">
              For custom anchor navs — like a sticky section bar or a terms-page sidebar — call
              the composable directly. Pass a getter for
              <code class="inline-code">offset</code> so it reads the element height at scroll
              time rather than on mount.
            </p>
            <pre class="demo-code">const stickyNavRef = ref&lt;HTMLElement | null&gt;(null);

const { handleNavClick } = useAnchorScroll({
  offset: () =&gt; stickyNavRef.value?.offsetHeight ?? 0,
});
</pre>
            <pre class="demo-code">&lt;div ref="stickyNavRef" class="sticky-nav"&gt;
  &lt;a href="#overview" @click="(e) =&gt; handleNavClick(e, '#overview')"&gt;Overview&lt;/a&gt;
  &lt;a href="#api"      @click="(e) =&gt; handleNavClick(e, '#api')"&gt;API&lt;/a&gt;
&lt;/div&gt;
</pre>

            <h3 class="page-heading-3">Programmatic scroll</h3>
            <p class="page-body-medium">
              Use <code class="inline-code">scrollToAnchor</code> when you need to scroll without
              a click event — for example, after a form submission or on route entry.
            </p>
            <pre class="demo-code">const { scrollToAnchor } = useAnchorScroll({ offset: 64 });

onMounted(() =&gt; {
  if (route.hash) scrollToAnchor(route.hash);
});
</pre>
          </LayoutRow>
        </section>

        <section id="motion" class="anchor-demo-section">
          <LayoutRow tag="div" variant="content">
            <h2 class="page-heading-2">Reduced Motion</h2>
            <p class="page-body-medium">
              When <code class="inline-code">prefers-reduced-motion: reduce</code> is active,
              <code class="inline-code">handleNavClick</code> returns early without calling
              <code class="inline-code">preventDefault</code>. The browser or Vue Router handles
              the anchor navigation natively — an instant jump with no custom scroll code
              involved. No special configuration needed.
            </p>
            <p class="page-body-medium">
              To test: open your OS accessibility settings, enable Reduce Motion, then click
              a section link in the bar above. The page will jump immediately instead of
              scrolling.
            </p>
            <p class="page-body-medium">
              <code class="inline-code">scrollToAnchor</code> respects the same preference:
              it uses <code class="inline-code">behavior: "instant"</code> when reduced motion
              is detected, so programmatic scrolls are equally accessible.
            </p>
          </LayoutRow>
        </section>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const stickyNavRef = ref<HTMLElement | null>(null);

const sections = [
  { id: "overview", label: "Overview" },
  { id: "api", label: "API" },
  { id: "usage", label: "Usage" },
  { id: "motion", label: "Reduced Motion" },
];

const { handleNavClick } = useAnchorScroll({
  offset: () => stickyNavRef.value?.offsetHeight ?? 0,
});
</script>

<style lang="css">
.anchor-scroll-sticky-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: var(--page-bg, #000);
  border-block-end: 1px solid oklch(100% 0 0 / 10%);
}

.anchor-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 2rem;
  padding-block: 1.2rem;
}

.anchor-nav-link {
  color: var(--slate-02, currentColor);
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  padding-block: 0.4rem;
  border-block-end: 1.5px solid transparent;
  transition: color 200ms ease, border-color 200ms ease;

  &:hover,
  &:focus-visible {
    color: var(--slate-00, currentColor);
    border-block-end-color: currentColor;
    outline: none;
  }
}

.anchor-demo-section {
  min-block-size: 60vh;
  padding-block: 6rem 8rem;
  border-block-end: 1px solid oklch(100% 0 0 / 8%);

  &:last-child {
    border-block-end: none;
  }

  .page-heading-2 {
    margin-block-end: 2rem;
  }

  .page-heading-3 {
    margin-block: 3.2rem 1.2rem;
  }

  .page-body-medium {
    margin-block-end: 1.6rem;
  }
}

.api-table-wrapper {
  overflow-x: auto;
  margin-block: 1.6rem 0;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.4rem;
  line-height: 1.5;

  th,
  td {
    text-align: left;
    padding: 1rem 1.6rem;
    border: 1px solid oklch(100% 0 0 / 12%);
    vertical-align: top;
  }

  th {
    background-color: oklch(100% 0 0 / 4%);
    font-weight: 600;
    color: var(--slate-01, currentColor);
  }

  td {
    color: var(--slate-02, currentColor);
  }
}

.demo-code {
  background-color: oklch(100% 0 0 / 4%);
  border: 1px solid oklch(100% 0 0 / 10%);
  border-radius: 0.6rem;
  padding: 1.8rem 2rem;
  overflow-x: auto;
  font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
  font-size: 1.3rem;
  line-height: 1.65;
  margin-block: 1.2rem 2rem;
  white-space: pre;
  color: var(--slate-01, currentColor);
}

.inline-code {
  font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
  font-size: 0.875em;
  background-color: oklch(100% 0 0 / 8%);
  padding: 0.15em 0.4em;
  border-radius: 0.3rem;
}
</style>
