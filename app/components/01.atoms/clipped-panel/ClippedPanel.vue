<template>
  <component :is="tag" class="clipped-panel" :class="[variant, elementClasses]">
    <slot name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  variant?: "circle-cutout" | "rectangle" | "square";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  variant: "square",
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
.clipped-panel {
  --_outline-colour: var(--clipped-panel-outline-colour, light-dark(hsl(0, 29%, 3%), hsl(0, 0%, 92%)));

  background-color: var(--clipped-panel-background-colour, light-dark(hsl(0, 0%, 96%), hsl(0, 0%, 12%)));
  color: var(--_outline-colour);
  outline: var(--clipped-panel-outline-width, 1px) solid var(--_outline-colour);

  aspect-ratio: 1;

  /*
   * clip-path: path(...) coordinates are fixed to each variant's exact
   * pixel width below — CSS custom properties cannot be interpolated into
   * a path() string, so these shapes cannot be resized via tokens. See
   * CONSUMER-STYLING.md.
   */
  &.rectangle {
    clip-path: path(
      "M 10, 50 L 140, 50 A 10, 10, 0, 0, 0 150, 40 L 150, 10 A 10, 10, 0, 0, 1 160, 0 L 290, 0 A 10, 10, 0, 0, 1 300, 10 L 300, 190 A 10, 10, 0, 0, 1 290, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 60 A 10, 10, 0, 0, 1 10, 50 Z"
    );
    width: 300px;
  }
  &.square {
    clip-path: path(
      "M 10, 50 L 90, 50 A 10, 10, 0, 0, 0 100, 40 L 100, 10 A 10, 10, 0, 0, 1 110, 0 L 190, 0 A 10, 10, 0, 0, 1 200, 10 L 200, 190 A 10, 10, 0, 0, 1 190, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 60 A 10, 10, 0, 0, 1 10, 50 Z"
    );
    width: 200px;
  }
  &.circle-cutout {
    /* 200x200 rounded square (10px corners) with a 50px-radius circular notch bitten out of the top-right corner. */
    clip-path: path(
      "M 10, 0 L 150, 0 A 50, 50, 0, 0, 0 200, 50 L 200, 190 A 10, 10, 0, 0, 1 190, 200 L 10, 200 A 10, 10, 0, 0, 1 0, 190 L 0, 10 A 10, 10, 0, 0, 1 10, 0 Z"
    );
    width: 200px;
  }
}
}
</style>
