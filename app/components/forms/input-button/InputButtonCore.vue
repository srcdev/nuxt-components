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
import type { BaseButtonProps } from "~/types/forms/types.forms";

interface Props extends BaseButtonProps {
  type?: "submit" | "button" | "reset";
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
});

const slots = useSlots();

// Cache slot computations for better performance
const hasLeftSlot = computed(() => Boolean(slots.left && !slots.iconOnly));
const hasRightSlot = computed(() => Boolean(slots.right && !slots.iconOnly));
const hasIconOnlySlot = computed(() => Boolean(slots.iconOnly));
const showFancyEffect = computed(() => props.useEffect && props.effect === "fancy");

// Combine all button classes into a single computed
const buttonClasses = computed(() => [
  `btn-${props.type}`,
  props.useEffect && props.effect !== "fancy" ? props.effect : "",
  elementClasses.value,
  { "icon-only": hasIconOnlySlot.value },
]);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
</script>

<style lang="css">
.input-button-core {
  touch-action: manipulation;
  align-items: center;
  display: flex;
  gap: var(--button-icon-gap);
  justify-content: center;
  border-radius: var(--button-border-radius);
  font-family: var(--font-family);

  padding-inline: var(--button-padding-inline);
  padding-block: var(--button-padding-block);

  transition: all var(--control-transition-duration) var(--control-transition-ease);

  box-shadow: var(--box-shadow-off);
  background-color: var(--theme-button-surface);
  border: var(--button-border-width) solid var(--theme-button-border);
  color: var(--theme-button-text);
  outline: var(--button-focus-ring-width) solid transparent;
  outline-offset: 0rem;
  min-height: var(--button-min-height);

  /*
  * States
  **/
  &:hover {
    background-color: var(--theme-button-surface-hover);
    border-color: var(--theme-button-border-hover);
    color: var(--theme-button-text-hover);
    /* UNSURE: outline-color: var(--theme-button-outline-hover); - no equivalent found */
    outline-offset: var(--button-focus-ring-offset);
    cursor: pointer;
  }

  &:focus-visible {
    background-color: var(--theme-button-surface-hover);
    border-color: var(--theme-button-border-hover);
    /* UNSURE: color: var(--theme-button-text-focus); - no equivalent found, using hover color */
    color: var(--theme-button-text-hover);
    outline-color: var(--theme-button-focus-ring);
    outline-offset: var(--button-focus-ring-offset);
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
    border-radius: var(--button-border-radius-icon-only);
    /* CANNOT FIND: height/width for icon-only buttons - keeping original var */
    height: var(--form-icon-only-button-size);
    width: var(--form-icon-only-button-size);
    margin: 0;
    padding: 0;
  }

  .btn-text {
    display: inline-block;
    white-space: nowrap;
    font-size: var(--input-font-size);
    line-height: var(--input-line-height);
  }

  .btn-icon {
    display: flex;
    .icon {
      aspect-ratio: 1;
      display: inline-block;
      height: var(--input-icon-size);
      width: var(--input-icon-size);
    }
  }
}
</style>
