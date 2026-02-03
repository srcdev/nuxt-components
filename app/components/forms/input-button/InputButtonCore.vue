<template>
  <button
    :type
    :readonly
    :aria-disabled="readonly"
    :data-testid="dataTestid || undefined"
    :data-theme="theme"
    :data-size="size"
    class="input-button-core"
    :class="buttonClasses"
  >
    <span v-if="showFancyEffect" class="fancy"></span>
    <template v-if="hasLeftSlot">
      <span class="btn-icon left">
        <slot name="left"></slot>
      </span>
    </template>
    <span class="btn-text" :class="[weight, { 'sr-only': hasIconOnlySlot }]">{{ buttonText }}</span>
    <template v-if="hasRightSlot">
      <span class="btn-icon right">
        <slot name="right"></slot>
      </span>
    </template>
    <template v-if="hasIconOnlySlot">
      <span class="btn-icon icon-only">
        <slot name="iconOnly"></slot>
      </span>
    </template>
  </button>
</template>

<script setup lang="ts">
import type { BaseButtonProps } from "~/types/forms/types.forms"

interface Props extends BaseButtonProps {
  type?: "submit" | "button" | "reset"
}

const props = withDefaults(defineProps<Props>(), {
  size: "default",
  weight: "wght-400",
  theme: "primary",
  type: "button",
  dataTestid: "",
  styleClassPassthrough: () => [],
  useEffect: false,
  effect: "fancy",
  isPending: false,
  readonly: false,
})

const slots = useSlots()

// Cache slot computations for better performance
const hasLeftSlot = computed(() => Boolean(slots.left && !slots.iconOnly))
const hasRightSlot = computed(() => Boolean(slots.right && !slots.iconOnly))
const hasIconOnlySlot = computed(() => Boolean(slots.iconOnly))
const showFancyEffect = computed(() => props.useEffect && props.effect === "fancy")

// Combine all button classes into a single computed
const buttonClasses = computed(() => [
  `btn-${props.type}`,
  props.useEffect && props.effect !== "fancy" ? props.effect : "",
  elementClasses.value,
  { "icon-only": hasIconOnlySlot.value },
])

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)
</script>

<style lang="css">
.input-button-core {
  touch-action: manipulation;
  align-items: center;
  display: flex;
  gap: var(--form-button-icon-gap);
  justify-content: center;
  border-radius: var(--form-input-border-radius);
  font-family: var(--font-family);

  padding-inline: var(--form-button-padding-inline);
  padding-block-start: var(--form-element-padding-block-start);
  padding-block-end: var(--form-element-padding-block-end);

  transition: all var(--theme-form-transition-duration) ease-in-out;

  box-shadow: var(--box-shadow-off);
  background-color: var(--theme-button-surface);
  border: var(--form-element-border-width) solid var(--theme-button-border);
  color: var(--theme-button-text);
  outline: var(--form-element-outline-width) solid var(--theme-button-outline);
  outline-offset: 0rem;

  /*
  * States
  **/
  &:hover {
    background-color: var(--theme-button-surface-hover);
    border-color: var(--theme-button-border-hover);
    color: var(--theme-button-text-hover);
    outline-color: var(--theme-button-outline-hover);
    outline-offset: var(--form-element-outline-offset-focus);
    cursor: pointer;
  }

  &:focus-visible {
    background-color: var(--theme-button-surface-hover);
    border-color: var(--theme-button-border-hover);
    color: var(--theme-button-text-focus);
    outline-color: var(--theme-button-outline-focus);
    outline-offset: var(--form-element-outline-offset-focus);
  }

  &[readonly] {
    opacity: 0.5;
    &:hover,
    &:focus-visible {
      cursor: not-allowed;
    }
  }

  &.icon-only {
    aspect-ratio: 1;
    height: var(--form-icon-only-button-size);
    width: var(--form-icon-only-button-size);
    margin: 0;
    padding: 0;
  }

  .btn-text {
    display: inline-block;
    white-space: nowrap;
    font-size: var(--form-element-font-size);
    line-height: var(--form-element-line-height);
  }

  .btn-icon {
    display: flex;
    .icon {
      aspect-ratio: 1;
      display: inline-block;
      height: var(--form-icon-size);
      width: var(--form-icon-size);
    }
  }
}
</style>
