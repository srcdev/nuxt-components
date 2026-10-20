<template>
  <div class="accordion-group" :class="elementClasses">
    <component
      :is="panelComponent"
      v-for="index in panelIndexes()"
      :key="index"
      :name
      :animation-duration="animationDuration"
      :style-class-passthrough="['accordion-group-item']"
    >
      <template #summary>
        <slot :name="`item-${index}-summary`"></slot>
      </template>
      <template v-if="slots[`item-${index}-icon`]" #icon>
        <slot :name="`item-${index}-icon`"></slot>
      </template>
      <template #content>
        <slot :name="`item-${index}-content`"></slot>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import ExpandingPanel from "../expanding-panel/ExpandingPanel.vue";
import ExpandingPanelClassic from "../expanding-panel-classic/ExpandingPanelClassic.vue";

interface Props {
  name?: string;
  animationDuration?: number;
  variant?: "modern" | "classic";
  styleClassPassthrough?: string | string[];
}

// "classic" by default: "modern" relies on ::details-content, which WebKit lacks (pitfall #19).
const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  animationDuration: 300,
  variant: "classic",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const SUMMARY_SLOT = /^item-(\d+)-summary$/;

const panelIndexes = () =>
  Object.keys(slots)
    .map((slotName) => SUMMARY_SLOT.exec(slotName)?.[1])
    .filter((index): index is string => index !== undefined)
    .map(Number)
    .sort((a, b) => a - b);

const animationDurationStr = computed(() => `${props.animationDuration}ms`);
const panelComponent = computed(() => (props.variant === "classic" ? ExpandingPanelClassic : ExpandingPanel));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .accordion-group {
    max-inline-size: var(--accordion-group-max-width, 60rem);
    margin-inline: auto;

    .accordion-group-item {
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
