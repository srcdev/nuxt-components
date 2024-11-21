<template>
  <div class="page-layout">
    <slot name="content"></slot>
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
body {
  margin: 0;
  overflow-x: hidden;
}
.page-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
