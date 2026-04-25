<template>
  <component :is="tag" class="section-parallax" :class="[elementClasses]">
    <slot v-if="slots.default" name="default"></slot>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return ["div", "section", "article", "aside"].includes(value);
    },
  },
  backgroundImage: {
    type: String,
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
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
  /* Component styles */

  min-height: 120vh;
  background-image: v-bind(backgroundImage);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  background-color: light-dark(var(--slate-01), var(--slate-08));
  width: 100%;

  @media (hover: hover) and (pointer: fine) {
    @supports (background-attachment: fixed) {
      background-attachment: fixed;
      min-height: 120vh;
    }
  }
}
}
</style>
