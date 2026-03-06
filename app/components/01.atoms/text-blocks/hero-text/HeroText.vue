<template>
  <component :is="tag" :id="id" class="hero-text" :class="[elementClasses, ...componentClasses]">
    <span v-for="(item, index) in textContent" :key="index" :class="['text-block-' + index, item.styleClass]">
      {{ item.text }}
    </span>
  </component>
</template>

<script setup lang="ts">
import type { TextConfig } from "~/types/components/hero-text";

interface Props {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  id?: string;
  axis?: "horizontal" | "vertical";
  fontSize?: "display" | "title" | "heading" | "subheading" | "label";
  textContent: TextConfig[];
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  axis: "horizontal",
  fontSize: "title",
  styleClassPassthrough: () => [],
});

const componentClasses = computed(() => {
  return [props.fontSize, `axis-${props.axis}`];
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .hero-text {
    display: flex;
    gap: 0.2rem;

    font-family: "Playfair Display";
    font-weight: 400;
    font-variation-settings:
      "wght" 400,
      "ital" 1;
    line-height: 1;

    margin: 0;

    &.axis-horizontal {
      flex-direction: row;
      gap: 0.5ch;
    }
    &.axis-vertical {
      flex-direction: column;
    }

    &.display {
      font-size: var(--hero-text-display);
    }

    &.title {
      font-size: var(--hero-text-title);
    }

    &.heading {
      font-size: var(--hero-text-heading);
    }

    &.subheading {
      font-size: var(--hero-text-subheading);
    }

    &.label {
      font-size: var(--hero-text-label);
    }

    .accent {
      font-style: italic;
      color: var(--colour-text-accent);
    }
  }
}
</style>
