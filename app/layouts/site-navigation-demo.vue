<template>
  <div class="site-nav-demo-layout">
    <header class="site-nav-demo-header">
      <NuxtLink to="/" class="site-nav-demo-logo">SiteNav Demo</NuxtLink>
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

/* Shared demo page styles */
.snav-demo-page {
  h1,
  h2,
  h3 {
    margin-block-end: 1.6rem;
  }
  h2 {
    margin-block-start: 4rem;
  }
  > p {
    margin-block-end: 2.4rem;
    line-height: 1.6;
  }
  ul {
    padding-inline-start: 2rem;
    margin-block-end: 2.4rem;
    line-height: 2;
  }
}

.snav-demo-hero {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 1;
  object-fit: cover;
  border-radius: 0.8rem;
  display: block;
  margin-block-end: 2.4rem;
}

.snav-demo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;

  &--wide {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    &--wide {
      grid-template-columns: 1fr;
    }
  }
}

.snav-demo-img {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 0.4rem;
  display: block;
}

.snav-demo-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.2rem;
  align-items: start;
  margin-block-end: 4rem;

  &__text {
    h2,
    h3 {
      margin-block-start: 2.4rem;
    }
    p {
      line-height: 1.6;
      margin-block-end: 1.6rem;
    }
  }

  &__img {
    width: 100%;
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 0.4rem;
    display: block;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
}

.snav-demo-services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.4rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
}

.snav-demo-service-card {
  border-radius: 0.8rem;
  overflow: hidden;
  background: oklch(100% 0 0 / 5%);

  &__body {
    padding: 1.6rem;
    h3 {
      margin-block-end: 0.8rem;
    }
    p {
      font-size: 1.4rem;
      line-height: 1.6;
      opacity: 0.8;
    }
  }
}
</style>
