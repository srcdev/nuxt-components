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
interface Props {
  name?: string;
  itemCount?: number;
  animationDuration?: number;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  itemCount: 0,
  animationDuration: 300,
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const animationDurationStr = computed(() => `${props.animationDuration}ms`);
</script>

<style lang="css">
@layer components {
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
}
</style>
