<template>
  <button
    :type
    :readonly
    :aria-disabled="readonly"
    :data-testid
    :data-theme="theme"
    :data-size="size"
    class="input-button-core"
    :class="[`btn-${type}`, effectClass, elementClasses, { 'icon-only': slots.iconOnly }]"
  >
    <span v-if="useEffect && effect == 'fancy'" class="fancy"></span>
    <template v-if="slots.left && !slots.iconOnly">
      <span class="btn-icon left">
        <slot name="left"></slot>
      </span>
    </template>
    <span class="btn-text" :class="[weight, { 'sr-only': slots.iconOnly }]">{{ buttonText }}</span>
    <template v-if="slots.right && !slots.iconOnly">
      <span class="btn-icon right">
        <slot name="right"></slot>
      </span>
    </template>
    <template v-if="slots.iconOnly">
      <span class="btn-icon icon-only">
        <slot name="iconOnly"></slot>
      </span>
    </template>
  </button>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"

const props = defineProps({
  size: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  weight: {
    type: String as PropType<string>,
    default: "wght-400",
    validator(value: string) {
      return propValidators.weight.includes(value)
    },
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  type: {
    type: String as PropType<"submit" | "button" | "reset">,
    default: "button",
    validator(value: string) {
      return propValidators.inputTypesButton.includes(value)
    },
  },
  buttonText: {
    type: String,
    required: true,
  },
  dataTestid: {
    type: String,
    default: "",
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  useEffect: {
    type: Boolean,
    default: false,
  },
  effect: {
    type: String as PropType<string>,
    default: "fancy",
    validator(value: string) {
      return ["fancy", "pulse"].includes(value)
    },
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const type = toRef(() => props.type)
const effectClass = computed(() => {
  if (props.useEffect) {
    return props.effect === "fancy" ? "" : props.effect
  } else {
    return ""
  }
})

const slots = useSlots()

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
  }

  &:focus-visible {
    background-color: var(--theme-button-surface-hover);
    border-color: var(--theme-button-border-hover);
    color: var(--theme-button-text-focus);
    outline-color: var(--theme-button-outline-focus);
    outline-offset: var(--form-element-outline-offset-focus);
  }

  &:hover {
    cursor: pointer;
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
