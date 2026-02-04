<template>
  <div class="display-accordian" :class="[elementClasses]">
    <ExpandingPanel
      v-for="(item, key) in itemCount"
      :key="key"
      :name
      :animation-duration="animationDuration"
      icon-size="medium"
      :style-class-passthrough="['accordian-item']"
    >
      <template #summary>
        <slot :name="`accordian-${key}-summary`"></slot>
      </template>
      <template #icon>
        <slot :name="`accordian-${key}-icon`"></slot>
      </template>
      <template #content>
        <slot :name="`accordian-${key}-content`"></slot>
      </template>
    </ExpandingPanel>
  </div>
</template>

<script setup lang="ts">
// import type { PropType } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: null,
  },
  itemCount: {
    type: Number as PropType<number>,
    default: 0,
  },
  animationDuration: {
    type: Number,
    default: 300,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const animationDurationStr = computed(() => `${props.animationDuration}ms`);
</script>

<style lang="css">
.display-accordian {
  max-width: 600px;
  margin: 0 auto;

  .accordian-item {
    &.expanding-panel {
      transition:
        margin-block-end v-bind(animationDurationStr) ease-in-out,
        border-radius v-bind(animationDurationStr) ease-in-out;
    }
  }
}
</style>
