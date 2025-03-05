<template>
  <div>
    <LayoutRow tag="header" variant="full" :styleClassPassthrough="['header']">
      <template #default>
        <LayoutRow tag="div" variant="popout">
          <template #default>
            <h1 class="heading-1">Nuxt Component Library</h1>
            <nav>
              <ul>
                <li v-for="link in navLinks" :key="link.name">
                  <NuxtLink :to="link.path" class="link-normal">{{ link.name }}</NuxtLink>
                </li>
              </ul>
            </nav>
          </template>
        </LayoutRow>
      </template>
    </LayoutRow>
    <LayoutRow tag="div" variant="full">
      <template #default>
        <slot name="content"></slot>
      </template>
    </LayoutRow>
  </div>
</template>

<!-- <script type="module" lang="ts">
import polyfill from '@oddbird/css-anchor-positioning/fn';
if (import.meta.client && !('anchorName' in document.documentElement.style)) {
  polyfill({
    elements: undefined,
    excludeInlineStyles: false,
    useAnimationFrame: false,
  });
}
</script> -->

<script setup lang="ts">
interface INavLink {
  name: string;
  path: string;
}

const navLinks = <INavLink[]>[
  { name: 'Home', path: '/' },
  { name: 'Container Glow', path: '/ui/container-glow' },
  { name: 'Accordian', path: '/ui/accordian' },
  { name: 'Layout Row', path: '/ui/layout-row' },
  { name: 'Layout Grid A', path: '/ui/layout-grid-a' },
  { name: 'Layout Grid B', path: '/ui/layout-grid-b' },
  { name: 'Dialogs', path: '/ui/dialog' },
  { name: 'Tabs X', path: '/ui/tabs' },
  { name: 'Tabs Y', path: '/ui/tabs-y' },
  { name: 'Prompts', path: '/ui/display-prompt' },
  { name: 'Simple Grid', path: '/ui/simple-grid' },
  { name: 'Masonry Grid Simple', path: '/ui/masonry-grid' },
  { name: 'Masonry Grid Sorted', path: '/ui/masonry-grid-sorted' },
  { name: 'Masonry Grid Ordered', path: '/ui/masonry-grid-ordered' },
  { name: 'Rotating Carousel', path: '/ui/rotating-carousel' },
];
</script>
<style lang="css">
.header {
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      padding: 0;

      .link-normal {
        display: inline-block;
        padding: 0.8rem 1.6rem;
      }
    }
  }
}
</style>
