<template>
  <component :is="tag" class="auto-grid" :class="[elementClasses]" :data-responsive="isResponsive ? '' : undefined">
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

    > * {
      min-inline-size: 0;
    }

    &:not([data-responsive]) {
      grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-default, 300px), 100%), 1fr));
    }

    &[data-responsive] {
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
