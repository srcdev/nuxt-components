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

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .grid-stack {
    display: grid;
    grid-template-areas: "stack";

    .grid-stack__layer {
      grid-area: stack;
    }
  }
}
</style>
