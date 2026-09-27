<template>
  <component :is="tag" class="auto-grid" :class="[elementClasses, { 'is-responsive': isResponsive }]">
    <slot v-for="(_, name) in $slots" :key="name" :name="name"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  isResponsive?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  isResponsive: false,
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
  .auto-grid {
    display: grid;
    gap: var(--auto-grid-gap, 1rem);

    &:not(.is-responsive) {
      grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-default, 300px), 100%), 1fr));
    }

    &.is-responsive {
      grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-small, 250px), 100%), 1fr));

      @container (width >= 768px) {
        grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-default, 300px), 100%), 1fr));
      }

      @container (width >= 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-large, 350px), 100%), 1fr));
      }
    }
  }
}
</style>
