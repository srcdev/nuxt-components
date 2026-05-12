<template>
  <div>
    <NuxtLayout name="default">
      <template #layout-content>
        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h1 class="page-heading-2">Deep Expanding Menu</h1>
          <p>
            A horizontal navigation menu using the CSS Popover API. Top-level items can be direct links or toggle a
            panel of child links below them.
          </p>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h2 class="page-heading-3 mbe-16">Basic example</h2>
          <div class="demo-surface">
            <DeepExpandingMenu :nav-links="basicLinks" />
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32']">
          <h2 class="page-heading-3 mbe-16">Mixed links and groups</h2>
          <div class="demo-surface">
            <DeepExpandingMenu :nav-links="mixedLinks" />
          </div>
        </LayoutRow>

        <LayoutRow tag="div" variant="popout" :style-class-passthrough="['mbs-32', 'mbe-64']">
          <h2 class="page-heading-3 mbe-16">Many child links</h2>
          <div class="demo-surface">
            <DeepExpandingMenu :nav-links="richLinks" />
          </div>
        </LayoutRow>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { ResponsiveHeaderNavItem } from "~/types/components";

definePageMeta({
  layout: false,
});

useHead({
  title: "Deep Expanding Menu",
  meta: [{ name: "description", content: "Examples of Deep Expanding Menu UI Component" }],
  bodyAttrs: {
    class: "deep-expanding-menu-page",
  },
});

const basicLinks: ResponsiveHeaderNavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "#about" },
  {
    name: "Services",
    childLinksTitle: "Our Services",
    childLinks: [
      { name: "Consulting", path: "#consulting" },
      { name: "Design", path: "#design" },
      { name: "Development", path: "#development" },
    ],
  },
  { name: "Contact", path: "#contact" },
];

const mixedLinks: ResponsiveHeaderNavItem[] = [
  { name: "Home", path: "/" },
  {
    name: "Products",
    childLinksTitle: "Browse Products",
    childLinks: [
      { name: "Electronics", path: "#electronics" },
      { name: "Clothing", path: "#clothing" },
      { name: "Books", path: "#books" },
      { name: "Accessories", path: "#accessories" },
    ],
  },
  {
    name: "Company",
    childLinksTitle: "About Us",
    childLinks: [
      { name: "Our Story", path: "#story" },
      { name: "Team", path: "#team" },
      { name: "Careers", path: "#careers" },
    ],
  },
  { name: "Blog", path: "#blog" },
  { name: "Contact", path: "#contact" },
];

const richLinks: ResponsiveHeaderNavItem[] = [
  {
    name: "Components",
    childLinksTitle: "UI Components",
    childLinks: [
      { name: "Carousel", path: "/ui/carousel-basic" },
      { name: "Accordian", path: "/ui/accordian" },
      { name: "Tabs", path: "/ui/tabs" },
      { name: "Dialogs", path: "/ui/display-dialog" },
      { name: "Tooltips", path: "/ui/tooltips" },
      { name: "Display Toast", path: "/ui/display-toast" },
      { name: "Card Core", path: "/ui/card-core" },
      { name: "Glowing Border", path: "/ui/glowing-border" },
    ],
  },
  {
    name: "Layouts",
    childLinksTitle: "Layout Components",
    childLinks: [
      { name: "Layout Row", path: "/ui/layout-row" },
      { name: "Simple Grid", path: "/ui/simple-grid" },
      { name: "Masonry Grid", path: "/ui/masonry-grid" },
      { name: "Block Decorators", path: "/ui/block-decorators" },
    ],
  },
  {
    name: "Navigation",
    childLinksTitle: "Navigation Components",
    childLinks: [
      { name: "Site Navigation", path: "/ui/navigation/site-navigation" },
      { name: "Nav Horizontal", path: "/ui/navigation/navigation-horizontal" },
      { name: "Deep Expanding Menu", path: "/ui/deep-expanding-menu" },
      { name: "Magnetic Navigation", path: "/ui/magnetic-navigation" },
    ],
  },
];
</script>

<style lang="css">
.demo-surface {
  /* background-color: light-dark(var(--slate-01), var(--slate-09)); */
  /* border: 1px solid light-dark(var(--slate-03), var(--slate-07)); */
  border-radius: 1.2rem;
  padding: 2.4rem;
  overflow: visible;
}
</style>
