<template>
  <component :is="tag" class="glass-panel" :class="[elementClasses]">
    <slot name="default"></slot>
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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
.glass-panel {
  --_bg: var(--glass-panel-bg);
  --_border-color: var(--glass-panel-border-color);
  --_shadow: var(--glass-panel-shadow);
  --_highlight: var(--glass-panel-highlight);

  position: relative;
  overflow: hidden;
  border-radius: 1rem;

  background: var(--_bg);
  border: 1px solid var(--_border-color);
  box-shadow: var(--_shadow);
  backdrop-filter: blur(14px) saturate(180%);

  /* Angled specular highlight — simulates light catching the top edge */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      var(--_highlight) 0%,
      transparent 55%
    );
    pointer-events: none;
  }
}
}
</style>
