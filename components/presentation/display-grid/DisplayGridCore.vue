<template>
  <div :class="[elementClasses]">
    <slot v-for="item in gridData" :key="item.id" :name="item.id"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  gridData: {
    type: Object,
    default: {},
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const gridData = toRef(() => props.gridData);
</script>
