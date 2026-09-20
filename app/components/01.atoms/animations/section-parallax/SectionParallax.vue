<template>
  <component :is="tag" class="section-parallax" :class="[elementClasses]">
    <slot v-if="slots.default" name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside";
  backgroundImage: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const slots = useSlots();

const backgroundImage = computed(() => `url("${props.backgroundImage}")`);

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
  .section-parallax {
    min-height: var(--section-parallax-min-height, 100svh);
    background-image: v-bind(backgroundImage);
    background-position: var(--section-parallax-background-position, center);
    background-repeat: no-repeat;
    background-size: var(--section-parallax-background-size, cover);
    position: relative;

    background-color: var(--section-parallax-background-colour, light-dark(var(--slate-01), var(--slate-08)));
    width: 100%;

    @media (hover: hover) and (pointer: fine) {
      @supports (background-attachment: fixed) {
        background-attachment: fixed;
        min-height: var(--section-parallax-min-height-fixed, 120vh);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      background-attachment: scroll;
      min-height: var(--section-parallax-min-height, 100svh);
    }
  }
}
</style>
