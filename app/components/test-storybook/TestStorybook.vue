<template>
  <div class="test-storybook" :class="[elementClasses]" :data-testid="props.dataTestid">
    <LayoutRow tag="div" variant="full-width" :style-class-passthrough="['mbe-20']">
      <h1>Test Storybook Component</h1>
      <slot v-if="slots.titleSlot" name="titleSlot"></slot>
      <div class="test-storybook__content">
        <p>
          <code>&lt;Icon name="mdi:star"&gt;</code>
          NuxtIcon test
        </p>
        <Icon name="mdi:star" style="width: 48px; height: 48px; color: orange" />
      </div>
    </LayoutRow>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dataTestid: {
    type: String,
    default: "test-storybook",
  },
  styleClassPassthrough: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const slots = useSlots()
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.test-storybook {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px;
  text-align: center;
  .test-storybook__content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;
    border: 1px solid #ccc;
    padding: 16px;
    margin-top: 12px;
  }
}
</style>
