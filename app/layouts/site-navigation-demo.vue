<template>
  <div class="site-nav-demo-layout">
    <header class="site-nav-demo-header">
      <NuxtLink to="/ui/navigation/site-navigation" class="site-nav-demo-logo">SiteNav Demo</NuxtLink>
      <SiteNavigation :nav-item-data="navItemData" nav-align="right" />
    </header>
    <main class="site-nav-demo-main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NavItemData } from "~/types/components/navigation-horizontal.d";

const navItemData: NavItemData = {
  main: [
    { text: "Home", href: "/ui/navigation/site-navigation" },
    { text: "About", href: "/ui/navigation/site-navigation/about" },
    { text: "Services", href: "/ui/navigation/site-navigation/services" },
    { text: "Portfolio", href: "/ui/navigation/site-navigation/portfolio" },
    { text: "Contact", href: "/ui/navigation/site-navigation/contact" },
  ],
};
</script>

<style lang="css">
.site-nav-demo-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  .site-nav-demo-header {
    display: flex;
    align-items: center;
    gap: 2.4rem;
    padding-block: 1.2rem;
    padding-inline: 2.4rem;
    background-color: #0e0e0e;
    border-block-end: 1px solid oklch(100% 0 0 / 10%);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .site-nav-demo-logo {
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--warm-01, #fff);
    text-decoration: none;
    text-wrap: nowrap;
    flex-shrink: 0;
  }

  .site-navigation {
    flex: 1;
    min-width: 0;
  }

  .site-nav-demo-main {
    flex: 1;
    padding: 4rem 2.4rem;
    max-width: 80rem;
    margin-inline: auto;
    width: 100%;
  }
}
</style>
