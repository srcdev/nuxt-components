<template>
  <div class="input-number-wrapper" :data-theme="formTheme" :data-size="size">
    <div v-if="slots.left" class="slot left">
      <slot name="left"></slot>
    </div>

    <div class="input-number-container">
      <input
        :id
        ref="inputField"
        v-model="modelValue"
        type="number"
        :name
        :required
        :min
        :max
        :step
        :class="[
          elementClasses,
          'input-number-core',
          `input-number--${theme}`,
          `input-number--${size}`,
          `input-number--${weight}`,
        ]"
        inputmode="numeric"
        pattern="[0-9]+"
      />
    </div>
    <div v-if="slots.right" class="slot right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormTheme, FormSize, FormWeight } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  theme?: FormTheme;
  size?: FormSize;
  weight?: FormWeight;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  required: false,
  theme: "primary",
  size: "medium",
  weight: "wght-400",
  fieldHasError: false,
  styleClassPassthrough: () => [],
});

const slots = useSlots();

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<number | readonly number[]>();

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const minLength = computed(() => `${props.max.toString().length + 1}em`);
</script>

<style lang="css">
.input-number-wrapper {
  --_focus-box-shadow: var(--box-shadow-off);
  --_min-width: v-bind(minLength);

  display: flex;
  align-items: center;

  width: fit-content;

  background-color: var(--theme-button-surface);
  border-radius: var(--form-element-border-width);
  border: var(--form-element-border-width) solid var(--theme-input-border);
  outline: var(--form-element-outline-width) solid var(--theme-form-input-outline);
  box-shadow: var(--_focus-box-shadow);

  .slot {
    display: inline-block;

    .icon {
      font-weight: 900;
    }
  }

  &.has-left-slot {
    .left-slot {
      display: flex;
      align-items: center;
    }
  }

  &.has-right-slot {
    .right-slot {
      display: flex;
      align-items: center;
    }
  }

  .input-number-core {
    touch-action: manipulation;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;

    background-color: var(--theme-input-surface);
    color: var(--theme-form-input-text-color-normal);
    font-family: var(--font-family);
    font-size: var(--form-element-font-size);
    line-height: var(--form-element-line-height);

    padding-inline: var(--form-text-padding-inline);
    padding-block-start: var(--form-element-padding-block-start);
    padding-block-end: var(--form-element-padding-block-end);
    text-align: center;
    min-width: var(--_min-width);

    &:focus-visible {
      --_focus-box-shadow: var(--box-shadow-on);
    }

    &::placeholder,
    &::-webkit-input-placeholder {
      font-family: var(--font-family);
      font-size: var(--font-size);
      font-style: italic;
      font-weight: 400;
    }
  }

  &:has(.has-left-button),
  &:has(.has-right-button) {
    .slot {
      .input-button-core {
        border: initial;
        border-radius: 0;
        outline: initial;
        box-shadow: unset;
      }
    }

    .left-slot {
      margin-inline-end: 0;
      border-right: 2px solid var(--theme-button-surface-hover);
    }

    .right-slot {
      margin-inline-end: 0;
      border-left: 2px solid var(--theme-button-surface-hover);
    }
  }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
