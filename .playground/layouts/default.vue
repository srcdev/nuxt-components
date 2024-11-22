<template>
  <div>
    <LayoutRow tag="header" variant="full" :styleClassPassthrough="['header']">
      <template #default>
        <LayoutRow tag="div" variant="popout">
          <template #default>
            <h1 class="heading-1">Nuxt Component Library</h1>
            <nav>
              <ul>
                <li><NuxtLink to="/" class="link-normal">Home</NuxtLink></li>
                <li><NuxtLink to="/ui/layout-row" class="link-normal">Layout Row</NuxtLink></li>
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

<script setup lang="ts"></script>
<style lang="css">
.header {
  ul {
    display: flex;
    gap: 1rem;
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
