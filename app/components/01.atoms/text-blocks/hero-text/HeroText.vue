<template>
  <component :is="tag" :id="id" class="hero-text" :class="[elementClasses, ...componentClasses]">
    <Icon v-if="props.icon" :name="props.icon" class="hero-text__icon" />
    <span v-for="(item, index) in textContent" :key="index" :class="['text-block-' + index, item.styleClass]">
      {{ trim(item.text, index) }}
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
  icon?: string;
  textContent: TextConfig[];
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  axis: "horizontal",
  fontSize: "title",
  icon: undefined,
  styleClassPassthrough: () => [],
});

const componentClasses = computed(() => {
  return [props.fontSize, `axis-${props.axis}`];
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const trim = (text: string, index: number): string => {
  const space = index < Math.floor(props.textContent.length - 1) ? " " : "";
  return text.trim() + space;
};
</script>

<style lang="css">
@layer components {
  .hero-text {
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
      display: flex;
      gap: 0.2rem;
      flex-direction: column;
    }

    .hero-text__icon {
      aspect-ratio: 1;
      color: var(--colour-text-accent);
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

      .hero-text__icon {
        width: calc(var(--hero-text-subheading) * 0.75) !important;
      }
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
