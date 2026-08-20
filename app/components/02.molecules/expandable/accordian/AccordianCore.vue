<template>
  <div class="display-accordian" :class="[elementClasses]">
    <component
      :is="panelComponent"
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
    </component>
  </div>
</template>

<script setup lang="ts">
import ExpandingPanel from "../expanding-panel/ExpandingPanel.vue";
import ExpandingPanelLegacy from "../expanding-panel-legacy/ExpandingPanelLegacy.vue";

interface Props {
  name?: string;
  itemCount?: number;
  animationDuration?: number;
  variant?: "modern" | "legacy";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  itemCount: 0,
  animationDuration: 300,
  variant: "modern",
  styleClassPassthrough: () => [],
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const animationDurationStr = computed(() => `${props.animationDuration}ms`);
const panelComponent = computed(() => (props.variant === "legacy" ? ExpandingPanelLegacy : ExpandingPanel));
</script>

<style lang="css">
@layer components {
  .display-accordian {
    max-width: 600px;
    margin: 0 auto;

    .accordian-item {
      &.expanding-panel,
      &.expanding-panel-legacy {
        transition:
          margin-block-end v-bind(animationDurationStr) ease-in-out,
          border-radius v-bind(animationDurationStr) ease-in-out;
      }
    }
  }
}
</style>
