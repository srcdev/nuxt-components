<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <PageRow tag="div" variant="content" :style-class-passthrough="['mbe-4']">
          <h1 class="page-heading-1">Anchor Scroll — TabNavigation</h1>
          <p class="page-body-medium">
            Tests
            <code class="inline-code">TabNavigation</code>
            with anchor hrefs. The nav uses plain
            <code class="inline-code">&lt;a&gt;</code>
            tags for hash links (not
            <code class="inline-code">NuxtLink</code>
            ) to keep Vue Router out of the smooth-scroll path. The
            <code class="inline-code">:anchor-scroll-offset</code>
            prop passes a getter so the sticky bar height is read at scroll time.
          </p>
        </PageRow>

        <div ref="stickyNavRef" class="anchor-tab-nav-sticky">
          <PageRow tag="div" variant="content">
            <TabNavigation
              :nav-item-data="anchorNavData"
              :anchor-scroll-offset="() => stickyNavRef?.offsetHeight ?? 0"
            />
          </PageRow>
        </div>

        <section id="overview" class="anchor-tab-section">
          <PageRow tag="div" variant="content">
            <h2 class="page-heading-2">Overview</h2>
            <p class="page-body-medium">
              This section verifies that clicking the
              <strong>Overview</strong>
              link above scrolls here smoothly, with the heading landing below the sticky nav bar rather than behind it.
            </p>
            <p class="page-body-medium">
              The sticky nav's height is resolved at click time via the getter passed to
              <code class="inline-code">:anchor-scroll-offset</code>
              . Resize the viewport — the offset adjusts automatically.
            </p>
            <p class="page-body-medium">
              Hash links in
              <code class="inline-code">TabNavigation</code>
              render as plain
              <code class="inline-code">&lt;a&gt;</code>
              elements (not
              <code class="inline-code">NuxtLink</code>
              ), which prevents Vue Router from intercepting the click and triggering its own scroll behaviour.
            </p>
          </PageRow>
        </section>

        <section id="api" class="anchor-tab-section">
          <PageRow tag="div" variant="content">
            <h2 class="page-heading-2">API</h2>
            <p class="page-body-medium">
              This section verifies the
              <strong>API</strong>
              link. Confirm the heading lands below the sticky nav after scrolling.
            </p>
            <p class="page-body-medium">
              The
              <code class="inline-code">anchorScrollOffset</code>
              prop on
              <code class="inline-code">TabNavigation</code>
              accepts
              <code class="inline-code">number | (() => number)</code>
              — the same type as the
              <code class="inline-code">offset</code>
              option on
              <code class="inline-code">useAnchorScroll</code>
              directly. It is forwarded verbatim to the composable.
            </p>
            <div class="demo-code">
              const navItemData = { main: [ { text: "Overview", href: "#overview" }, { text: "API", href: "#api" }, {
              text: "Usage", href: "#usage" }, { text: "Motion", href: "#motion" }, ], };
            </div>
            <div class="demo-code">
              &lt;div ref="stickyNavRef"&gt; &lt;TabNavigation :nav-item-data="navItemData" :anchor-scroll-offset="() =>
              stickyNavRef?.offsetHeight ?? 0" /&gt; &lt;/div&gt;
            </div>
          </PageRow>
        </section>

        <section id="usage" class="anchor-tab-section">
          <PageRow tag="div" variant="content">
            <h2 class="page-heading-2">Usage</h2>
            <p class="page-body-medium">
              This section verifies the
              <strong>Usage</strong>
              link. Confirm the heading lands below the sticky nav after scrolling.
            </p>
            <p class="page-body-medium">
              Mixed navigation — routes and anchor hrefs in the same
              <code class="inline-code">navItemData</code>
              — is supported. Route items render as
              <code class="inline-code">NuxtLink</code>
              ; anchor items render as plain
              <code class="inline-code">&lt;a&gt;</code>
              . The handler is a no-op for routes so both types can share the same click binding.
            </p>
            <div class="demo-code">
              const navItemData = { main: [ { text: "About", href: "#about" }, // anchor — plain &lt;a&gt; { text:
              "Services", href: "#services" }, // anchor — plain &lt;a&gt; { text: "Blog", href: "/blog" }, // route —
              NuxtLink { text: "Contact", href: "#contact" }, // anchor — plain &lt;a&gt; ], };
            </div>
          </PageRow>
        </section>

        <section id="motion" class="anchor-tab-section">
          <PageRow tag="div" variant="content">
            <h2 class="page-heading-2">Reduced Motion</h2>
            <p class="page-body-medium">
              This section verifies the
              <strong>Reduced Motion</strong>
              link. With
              <em>Reduce Motion</em>
              enabled in OS accessibility settings, clicks should produce an instant jump rather than a smooth scroll —
              and the offset should still be respected.
            </p>
            <p class="page-body-medium">
              To test on macOS:
              <strong>System Settings → Accessibility → Display → Reduce Motion</strong>
              . Refresh the page after toggling, then click any section link above.
            </p>
          </PageRow>
        </section>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/types/components";

definePageMeta({ layout: false });

const stickyNavRef = ref<HTMLElement | null>(null);

const anchorNavData: NavItemData = {
  main: [
    { text: "Overview", href: "#overview" },
    { text: "API", href: "#api" },
    { text: "Usage", href: "#usage" },
    { text: "Reduced Motion", href: "#motion" },
  ],
};
</script>

<style lang="css">
.anchor-tab-nav-sticky {
  position: sticky;
  top: 0;
  z-index: 5;
  background-color: var(--page-bg, #000);
  border-block-end: 1px solid oklch(100% 0 0 / 10%);
}

.anchor-tab-section {
  min-block-size: 60vh;
  padding-block: 6rem 8rem;
  border-block-end: 1px solid oklch(100% 0 0 / 8%);

  &:last-child {
    border-block-end: none;
  }

  .page-heading-2 {
    margin-block-end: 2rem;
  }

  .page-body-medium {
    margin-block-end: 1.6rem;
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
</style>
