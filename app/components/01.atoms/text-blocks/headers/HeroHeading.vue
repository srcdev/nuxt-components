<template>
  <component :is="tag" :id="id" class="hero-heading" :class="[elementClasses, ...componentClasses]">
    <span v-for="(item, index) in textContent" :key="index" :class="['text-block-' + index, item.styleClass]">
      {{ item.text }}
    </span>
  </component>
</template>

<script setup lang="ts">
import type { TextConfig } from "~/types/components/hero-heading";

interface Props {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  id?: string;
  axis?: "horizontal" | "vertical";
  fontSize?: "large" | "medium" | "small" | "smaller" | "card-title";
  textContent: TextConfig[];
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  axis: "horizontal",
  fontSize: "medium",
  styleClassPassthrough: () => [],
});

const componentClasses = computed(() => {
  return [props.fontSize, `axis-${props.axis}`];
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.hero-heading {
  display: flex;
  gap: 0.2rem;

  font-weight: 600;
  font-variation-settings: "wght" 600;
  line-height: 1;

  &.axis-horizontal {
    flex-direction: row;
    gap: 0.5ch;
  }
  &.axis-vertical {
    flex-direction: column;
  }

  &.large {
    font-size: var(--hero-header-large);
  }

  &.medium {
    font-size: var(--hero-header-medium);
  }

  &.small {
    font-size: var(--hero-header-small);
  }

  &.smaller {
    font-size: var(--hero-header-smaller);
  }

  &.card-title {
    font-size: var(--hero-header-card-title);
  }

  .accent {
    font-style: italic;
    color: var(--colour-text-accent);
  }
}
</style>
