<template>
  <component
    :is="tag"
    class="card-core"
    :class="[variant, elementClasses, { 'has-dividers': hasDividers }, { 'no-outline': noOutline }]"
  >
    <template v-for="(_, name) in $slots" :key="name">
      <div class="card-row" :class="`card-row-${name}`">
        <slot :name="name"></slot>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "aside" | "main" | "nav";
  hasDividers?: boolean;
  noOutline?: boolean;
  variant?: "solid" | "subtle" | "soft" | "outline";
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  hasDividers: false,
  noOutline: false,
  variant: "solid",
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
  .card-core {
    --_card-background-color: var(--card-core-background-color, transparent);
    --_card-border: var(--card-core-border, 0.2rem solid var(--slate-08));
    --_card-box-shadow: var(--card-core-box-shadow, 0.1rem 0.1rem 0.4rem oklch(from var(--slate-08) l c h / 0.45));

    display: grid;
    grid-auto-flow: row;
    gap: var(--card-core-row-gap, 1rem);
    border-radius: var(--card-core-border-radius, 0.5rem);
    overflow: hidden;
    position: relative;

    background-color: var(--_card-background-color, transparent);
    border: var(--_card-border);
    box-shadow: var(--_card-box-shadow);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background-color: var(--card-core-lower-background-color, transparent);
      background-image: var(--card-core-lower-background-image, none);
      background-position: var(--card-core-lower-background-position, center);
      background-size: cover;
      background-repeat: no-repeat;
      filter: blur(var(--card-core-lower-background-blur, 16px));
      scale: var(--card-core-lower-scale, 1.1);
      z-index: 0;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    &.no-outline {
      --_card-border: 0 solid transparent;
      --_card-box-shadow: none;
    }

    &.solid {
      --_card-background-color: var(--slate-00);
      --_card-border: 0.2rem solid var(--slate-08);
    }

    &.subtle {
      --_card-background-color: color-mix(in oklab, var(--slate-01) 50%, transparent);
      --_card-border: 0.2rem solid var(--slate-08);
    }

    &.soft {
      --_card-background-color: color-mix(in oklab, var(--slate-01) 20%, transparent);
    }

    &.outline {
      --_card-background-color: transparent;
      --_card-border: 0.2rem solid var(--slate-08);
    }

    &.has-dividers {
      .card-row + .card-row {
        border-top: 0.2rem solid var(--slate-08);
      }
    }
  }
}
</style>
