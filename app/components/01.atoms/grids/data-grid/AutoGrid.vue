<template>
  <component :is="tag" class="auto-grid" :class="[elementClasses, { 'is-responsive': isResponsive }]" :aria-labelledby="ariaLabelledby">
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
const { ariaLabelledby } = useAriaLabelledById(props.tag);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);
</script>

<style lang="css">
@layer components {
  .auto-grid {
    --auto-grid-min-col-size-small: 250px;
    --auto-grid-min-col-size-default: 300px;
    --auto-grid-min-col-size-large: 350px;
    --auto-grid-gap: 1rem;

    display: grid;
    gap: var(--auto-grid-gap);

    &:not(.is-responsive) {
      grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-default), 100%), 1fr));
    }

    &.is-responsive {
      grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-small), 100%), 1fr));

      @container (width >= 768px) {
        grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-default), 100%), 1fr));
      }

      @container (width >= 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min-col-size-large), 100%), 1fr));
      }
    }
  }
}
</style>
