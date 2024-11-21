<template>
  <div class="page-layout">
    <slot name="content"></slot>
  </div>
</template>

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
