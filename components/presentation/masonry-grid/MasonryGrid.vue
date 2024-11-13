<template>
  <div class="masonry-grid-wrapper">
    <template v-for="item in gridData" :key="item.id">
      <div class="masonry-grid-item">
        <slot :name="item.id"></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  gridData: {
    type: Object,
    default: {},
  },
});

const gridData = toRef(() => props.gridData);
</script>

<style lang="css">
.masonry-grid-wrapper {
  columns: 300px;

  .masonry-grid-item {
    break-inside: avoid;
    outline: 1px solid #cdcdcd;
    padding: 12px;
    margin-block-end: 12px;
  }
}
</style>
