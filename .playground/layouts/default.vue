<template>
  <div>
    <LayoutRow tag="header" variant="full" :styleClassPassthrough="['header']">
      <template #default>
        <LayoutRow tag="div" variant="popout">
          <template #default>
            <h1 class="heading-1">Nuxt Component Library</h1>
            <DeepExpandingMenuOld :navLinks />
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

<script setup lang="ts">
interface INavLink {
  name: string;
  path?: string;
  isExternal?: boolean;
  childLinks?: INavLink[];
  childLinksTitle?: string;
}

const navLinks = <INavLink[]>[
  { name: 'Home', path: '/' },
  {
    name: 'Components',
    childLinksTitle: 'UI Components',
    childLinks: [
      { name: 'Container Glow', path: '/ui/container-glow' },
      { name: 'Accordian', path: '/ui/accordian' },
      { name: 'Dialogs', path: '/ui/dialog' },
      { name: 'Tabs X', path: '/ui/tabs' },
      { name: 'Tabs Y', path: '/ui/tabs-y' },
      { name: 'Prompts', path: '/ui/display-prompt' },
      { name: 'Rotating Carousel', path: '/ui/rotating-carousel' },
      { name: 'Clipped Panels', path: '/ui/clipped-panels' },
    ],
  },
  {
    name: 'Layouts',
    childLinksTitle: 'UI Layouts',
    childLinks: [
      { name: 'Layout Row', path: '/ui/layout-row' },
      { name: 'Layout Grid A', path: '/ui/layout-grid-a' },
      { name: 'Layout Grid B', path: '/ui/layout-grid-b' },
      { name: 'Simple Grid', path: '/ui/simple-grid' },
      { name: 'Masonry Grid Simple', path: '/ui/masonry-grid' },
      { name: 'Masonry Grid Sorted', path: '/ui/masonry-grid-sorted' },
      { name: 'Masonry Grid Ordered', path: '/ui/masonry-grid-ordered' },
      { name: 'Masonry Columns', path: '/ui/masonry-columns' },
    ],
  },
  { name: 'About', path: '/' },
];
</script>
<style lang="css">
.header {
}
</style>
