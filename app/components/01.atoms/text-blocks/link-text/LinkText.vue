<template>
  <NuxtLink class="link-text" :class="elementClasses" :to="to" :external="external" :target="target">
    <span v-if="hasLeftSlot" class="link-text__icon link-text__icon--left">
      <slot name="left"></slot>
    </span>
    <span class="link-text__label">{{ linkText }}</span>
    <span v-if="hasRightSlot" class="link-text__icon link-text__icon--right">
      <slot name="right"></slot>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string;
  linkText: string;
  external?: boolean;
  target?: string;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  external: false,
  target: undefined,
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const hasLeftSlot = computed(() => Boolean(slots.left));
const hasRightSlot = computed(() => Boolean(slots.right));

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
@layer components {
  .link-text {
    display: inline-grid;
    grid-auto-flow: column;
    align-items: center;
    gap: var(--link-text-gap, 0.4em);
    color: var(--link-text-colour, currentColor);
    font-size: var(--link-text-font-size, inherit);
    text-decoration: var(--link-text-decoration, underline);
    text-underline-offset: var(--link-text-underline-offset, 0.2em);
    transition: color var(--control-transition-duration, 200ms) var(--control-transition-ease, ease);

    &:hover,
    &:focus-visible {
      color: var(--link-text-colour-hover, currentColor);
      text-decoration: var(--link-text-decoration-hover, none);
    }

    &:focus-visible {
      outline: 2px solid var(--link-text-colour, currentColor);
      outline-offset: 3px;
      border-radius: 2px;
    }

    .link-text__icon {
      display: flex;
      align-items: center;
    }
  }
}
</style>
