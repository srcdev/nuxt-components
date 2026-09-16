<template>
  <component
    :is="tag"
    class="ui-block-decorated"
    :class="[
      { [`ui-block-decorated-border-${borderStrength}`]: borderStrength > 0 },
      { [`ui-block-decorated-shadow-${shadowStrength}`]: shadowStrength > 0 },
      { [`ui-block-decorated-inner-shadow-${innerShadowStrength}`]: innerShadowStrength > 0 },
      elementClasses,
    ]"
  >
    <slot name="default"></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "p" | "span" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav" | "ul" | "ol";
  borderStrength?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  shadowStrength?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  innerShadowStrength?: 0 | 1 | 2 | 3 | 4;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  borderStrength: 0,
  shadowStrength: 0,
  innerShadowStrength: 0,
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
  .ui-block-decorated {
    /*
    * Border strength classes
    */
    &.ui-block-decorated-border-1 {
      border: var(--ui-block-decorated-border-1, 1px solid var(--theme-border));
    }
    &.ui-block-decorated-border-2 {
      border: var(--ui-block-decorated-border-2, 2px solid var(--theme-border));
    }
    &.ui-block-decorated-border-3 {
      border: var(--ui-block-decorated-border-3, 3px solid var(--theme-border));
    }
    &.ui-block-decorated-border-4 {
      border: var(--ui-block-decorated-border-4, 4px solid var(--theme-border));
    }
    &.ui-block-decorated-border-5 {
      border: var(--ui-block-decorated-border-5, 5px solid var(--theme-border));
    }
    &.ui-block-decorated-border-6 {
      border: var(--ui-block-decorated-border-6, 6px solid var(--theme-border));
    }

    /*
    * Shadow strength classes
    */
    &.ui-block-decorated-shadow-1 {
      box-shadow: var(--ui-block-decorated-shadow-1, 0 1px 2px rgba(0, 0, 0, 0.08));
    }
    &.ui-block-decorated-shadow-2 {
      box-shadow: var(--ui-block-decorated-shadow-2, 0 2px 4px rgba(0, 0, 0, 0.1));
    }
    &.ui-block-decorated-shadow-3 {
      box-shadow: var(--ui-block-decorated-shadow-3, 0 4px 8px rgba(0, 0, 0, 0.12));
    }
    &.ui-block-decorated-shadow-4 {
      box-shadow: var(--ui-block-decorated-shadow-4, 0 8px 16px rgba(0, 0, 0, 0.14));
    }
    &.ui-block-decorated-shadow-5 {
      box-shadow: var(--ui-block-decorated-shadow-5, 0 16px 24px rgba(0, 0, 0, 0.16));
    }
    &.ui-block-decorated-shadow-6 {
      box-shadow: var(--ui-block-decorated-shadow-6, 0 24px 32px rgba(0, 0, 0, 0.18));
    }

    /*
    * Inner shadow strength classes
    * Could use substring match [class*="ui-block-decorated-inner-shadow"] but not as performant
    */

    &.ui-block-decorated-inner-shadow-1,
    &.ui-block-decorated-inner-shadow-2,
    &.ui-block-decorated-inner-shadow-3,
    &.ui-block-decorated-inner-shadow-4 {
      position: relative;
      isolation: isolate;
    }

    &.ui-block-decorated-inner-shadow-1::before,
    &.ui-block-decorated-inner-shadow-2::before,
    &.ui-block-decorated-inner-shadow-3::before,
    &.ui-block-decorated-inner-shadow-4::before {
      content: "";
      display: block;
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      z-index: 2;
    }

    &.ui-block-decorated-inner-shadow-1::before {
      box-shadow:
        var(--ui-block-decorated-inner-shadow-1, inset 0 1px 2px rgba(0, 0, 0, 0.08)),
        var(--ui-block-decorated-inner-shadow-highlight, inset 0 1px 0 rgba(255, 255, 255, 0.15));
    }

    &.ui-block-decorated-inner-shadow-2::before {
      box-shadow:
        var(--ui-block-decorated-inner-shadow-2, inset 0 2px 4px rgba(0, 0, 0, 0.1)),
        var(--ui-block-decorated-inner-shadow-highlight, inset 0 1px 0 rgba(255, 255, 255, 0.15));
    }

    &.ui-block-decorated-inner-shadow-3::before {
      box-shadow:
        var(--ui-block-decorated-inner-shadow-3, inset 0 4px 6px rgba(0, 0, 0, 0.12)),
        var(--ui-block-decorated-inner-shadow-highlight, inset 0 1px 0 rgba(255, 255, 255, 0.15));
    }

    &.ui-block-decorated-inner-shadow-4::before {
      box-shadow:
        var(--ui-block-decorated-inner-shadow-4, inset 0 6px 8px rgba(0, 0, 0, 0.14)),
        var(--ui-block-decorated-inner-shadow-highlight, inset 0 1px 0 rgba(255, 255, 255, 0.15));
    }
  }
}
</style>
