<template>
  <component :is="tag" class="display-banner" :class="[elementClasses]">
    <div v-if="$slots.canvas" class="canvas">
      <slot name="canvas"></slot>
    </div>
    <div v-if="$slots.content" class="content">
      <slot name="content"></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

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
.display-banner {
  display: grid;
  grid-template-areas: "banner";
  container-type: inline-size;
  min-height: var(--display-banner-min-height, auto);
  overflow: hidden;

  .canvas {
    grid-area: banner;
  }

  .content {
    grid-area: banner;
  }
}
}
</style>
