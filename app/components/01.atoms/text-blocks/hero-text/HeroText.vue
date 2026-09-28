<template>
  <component :is="tag" :id="id" class="hero-text" :class="[elementClasses, ...componentClasses]">
    <Icon v-if="props.icon" :name="props.icon" class="hero-text__icon" />
    <span v-for="(item, index) in normalisedContent" :key="index" :class="['text-block-' + index, item.styleClass]">
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

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const normalisedContent = computed(() =>
  props.textContent.map((item, index) => ({
    ...item,
    text: item.text.trim() + (index < props.textContent.length - 1 ? " " : ""),
  }))
);
</script>

<style lang="css">
@layer components {
  .hero-text {
    font-family: var(--hero-text-font-family, "Playfair Display");
    font-weight: 400;
    font-variation-settings:
      "wght" 400,
      "ital" 1;
    line-height: 1;

    margin: var(--hero-text-margin, 0);

    &.axis-horizontal {
      flex-direction: row;
      gap: var(--hero-text-horizontal-gap, 0.5ch);
    }
    &.axis-vertical {
      display: flex;
      gap: var(--hero-text-vertical-gap, 0.4em);
      flex-direction: column;
    }

    .hero-text__icon {
      aspect-ratio: 1;
      color: var(--hero-text-icon-colour, var(--colour-text-accent));
    }

    &.display {
      font-size: var(--hero-text-display, clamp(4.8rem, 4vw + 2rem, 9.6rem));
    }

    &.title {
      font-size: var(--hero-text-title, clamp(3.6rem, 4vw + 2rem, 4.8rem));
    }

    &.heading {
      font-size: var(--hero-text-heading, clamp(2.8rem, 4vw + 2rem, 3rem));
    }

    &.subheading {
      font-size: var(--hero-text-subheading, 2.4rem);

      .hero-text__icon {
        font-size: 0.75em;
      }
    }

    &.label {
      font-size: var(--hero-text-label, 1.75rem);
    }

    .accent {
      --_hero-text-accent-offset: var(--hero-text-accent-offset, 0.2em);

      background-clip: text;
      background-image: var(--hero-text-bg-img, linear-gradient(135deg, #c2a770, #b4747e, #d1bd94));
      font-style: italic;
      color: transparent;
      padding-bottom: var(--_hero-text-accent-offset);
      margin-bottom: calc(var(--_hero-text-accent-offset) * -1);
    }
  }
}
</style>
