<template>
  <component :is="tag" class="glass-panel" :class="elementClasses" :aria-labelledby="ariaLabelledby">
    <slot name="default" :heading-id="headingId"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main" | "header" | "footer";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { headingId, ariaLabelledby } = useAriaLabelledById(() => props.tag);
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
  .glass-panel {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-radius: var(--glass-panel-border-radius, 1rem);
    background: var(--glass-panel-bg, rgba(255, 255, 255, 0.55));
    border: var(--glass-panel-border-width, 1px) solid var(--glass-panel-border-color, rgba(255, 255, 255, 0.8));
    box-shadow: var(--glass-panel-shadow, 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04));
    backdrop-filter: var(--glass-panel-backdrop-filter, blur(14px) saturate(180%));

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      z-index: -1;
      background: linear-gradient(
        var(--glass-panel-highlight-angle, 135deg),
        var(--glass-panel-highlight, rgba(255, 255, 255, 0.9)) 0%,
        transparent var(--glass-panel-highlight-stop, 55%)
      );
      pointer-events: none;
    }
  }
}
</style>
