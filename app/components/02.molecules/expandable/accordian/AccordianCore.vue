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
import ExpandingPanelClassic from "../expanding-panel-classic/ExpandingPanelClassic.vue";

interface Props {
  name?: string;
  itemCount?: number;
  animationDuration?: number;
  variant?: "modern" | "classic";
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
const panelComponent = computed(() => (props.variant === "classic" ? ExpandingPanelClassic : ExpandingPanel));
</script>

<style lang="css">
@layer components {
  .display-accordian {
    max-width: 600px;
    margin: 0 auto;

    .accordian-item {
      &.expanding-panel,
      &.expanding-panel-classic {
        transition:
          margin-block-end v-bind(animationDurationStr) ease-in-out,
          border-radius v-bind(animationDurationStr) ease-in-out;
      }
    }
  }
}
</style>
