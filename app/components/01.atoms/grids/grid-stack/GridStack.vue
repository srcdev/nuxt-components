<template>
  <component :is="tag" class="grid-stack" :class="[elementClasses]">
    <div v-for="(_, name) in $slots" :key="name" class="grid-stack__layer">
      <slot :name="name"></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .grid-stack {
    display: grid;
    grid-template-areas: "stack";
    grid-template-rows: 100%;

    .grid-stack__layer {
      grid-area: stack;
    }
  }
}
</style>
