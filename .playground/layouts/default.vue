<template>
  <div>
    <LayoutRow tag="div" variant="full" :style-class-passthrough="['header', 'mbe-40']">
      <template #default>
        <header class="responsive-header">
          <h1><a href="/">Logo</a></h1>
          <ResponsiveHeader :responsive-nav-links :gap-between-first-and-second-nav="12" />
        </header>
      </template>
    </LayoutRow>
    <LayoutRow tag="main" variant="full">
      <template #default>
        <slot name="content"></slot>
      </template>
    </LayoutRow>
  </div>
</template>

<script setup lang="ts">

const responsiveNavLinks = {
  firstNav: [
    { name: 'Home', path: '/' },
    {
      name: 'Components',
      childLinksTitle: 'UI Components',
      childLinks: [
      { name: 'Animated SVG Text', path: '/ui/animated-svg-text' },
      { name: 'Slider Gallery', path: '/ui/slider-gallery' },
      { name: 'Container Glow', path: '/ui/container-glow' },
      { name: 'Accordian', path: '/ui/accordian' },
      { name: 'Details', path: '/ui/display-details' },
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
  ],
  secondNav: [
    { name: 'Some other link', path: '/' },
    {
      name: 'Help',
      childLinksTitle: 'Find Help',
      childLinks: [
        { name: 'FAQs', path: '#' },
        { name: 'Contact Us', path: '#' },
        { name: 'Logout', path: '#' },
      ],
    },
    {
      name: 'Account',
      childLinksTitle: 'Manage Your Account',
      childLinks: [
        { name: 'Your Profile', path: '#' },
        { name: 'Settings', path: '#' },
        { name: 'Logout', path: '#' },
      ],
    },
  ],
}
</script>
<style lang="css">
.header {
  .responsive-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    align-items: center;
    padding-block: 12px;
    padding-inline: 24px;

    /* Make sure always on top of page content */
    position: relative;
    z-index: 999999;

    width: 100%;

    h1 {
      text-wrap-mode: nowrap;
    }
  }
}</style>
