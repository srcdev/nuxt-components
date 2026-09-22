<template>
  <div
    class="input-number-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :class="[inputVariant, { 'has-left-slot': slots.left, 'has-right-slot': slots.right }]"
  >
    <div v-if="slots.left" class="slot left-slot">
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
        :placeholder
        :class="['input-number-core', `input-number--${weight}`, elementClasses]"
        inputmode="numeric"
        pattern="[0-9]+"
        :aria-describedby
      />
    </div>
    <div v-if="slots.right" class="slot right-slot">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, FormWeight, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  id: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  required?: boolean;
  theme?: FormUiTheme;
  weight?: FormWeight;
  inputVariant?: InputUiVariant;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  required: false,
  theme: "default",
  weight: "normal",
  inputVariant: "normal",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  ariaDescribedby: "",
});

const slots = useSlots();

const modelValue = defineModel<number | readonly number[]>({
  required: true,
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);
const minLength = computed(() => `${props.max.toString().length + 1}em`);
</script>

<style lang="css">
@layer components {
  .input-number-wrapper {
    --_min-width: v-bind(minLength);

    /* Public --input-number-* tokens, inline-fallback to the shared --theme-* tokens (see
     theming-component-token-pattern.md) — overriding one here doesn't touch every other themed
     input/control that also reads --theme-input-surface/--theme-border. Mirrors InputTextCore's
     token shape so a native number input and the text-based InputTextAsNumberWithLabel variant
     look and behave the same way (see input-number-core.md's "Fixed 2026-09-22" note). */
    --_surface: var(--input-number-surface, var(--theme-input-surface));
    --_border: var(--input-number-border, var(--theme-border));
    --_border-focus: var(--input-number-border-focus, var(--theme-border-focus));

    display: flex;
    align-items: center;

    width: fit-content;

    background-color: var(--_surface);
    overflow: hidden;
    transition: all var(--theme-form-transition-duration) ease-in-out;
    position: relative;
    z-index: 2;

    &.normal {
      border: var(--form-element-border-width) solid var(--_border);
      border-radius: var(--form-input-border-radius);
      outline: var(--form-element-outline-width) solid transparent;

      &:has(input:hover) {
        outline: var(--form-element-outline-width-focus) solid
          var(--input-number-border-hover, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus);
      }

      &:has(input:focus-visible) {
        outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
        outline-offset: var(--form-element-outline-offset-focus);
      }
    }

    &.underlined {
      border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);
    }

    .slot {
      display: inline-block;

      .icon {
        font-weight: 900;
      }

      .input-button-core {
        background-color: var(--_surface);
        color: var(--input-number-text-color, var(--theme-input-text-color-normal));
        border: none;
        outline: none;
        aspect-ratio: 1;
        border-radius: 0;
        width: var(--input-min-height);

        &:hover {
          background-color: var(--input-number-surface-hover, var(--theme-input-surface-hover));
        }

        &:is(:focus-visible) {
          outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
          outline-offset: -4px;
        }

        &.icon-only {
          .btn-icon {
            margin: 0;
          }
        }
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

    &.has-left-slot .left-slot .input-button-core {
      border-right: var(--form-element-border-width) solid var(--_border);
    }

    &.has-right-slot .right-slot .input-button-core {
      border-left: var(--form-element-border-width) solid var(--_border);
    }

    .input-number-core {
      all: unset;
      touch-action: manipulation;

      color: var(--input-number-text-color, var(--theme-input-text-color-normal));
      font-family: var(--font-family);
      font-size: var(--input-font-size);

      padding-block: var(--input-padding-block);
      padding-inline: var(--input-padding-inline);
      min-height: var(--input-min-height);
      min-width: var(--_min-width);
      text-align: center;

      &::placeholder,
      &::-webkit-input-placeholder {
        color: var(--input-number-placeholder-color, var(--theme-input-placeholder));
        font-size: var(--theme-input-placeholder-font-size);
        font-style: italic;
        line-height: 1;
        font-weight: normal;
      }
    }
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
