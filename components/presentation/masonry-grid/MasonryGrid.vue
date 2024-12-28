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
    outline: 0.1rem solid #cdcdcd;
    padding: 1.2rem;
    margin-block-end: 1.2rem;
  }
}
</style>
