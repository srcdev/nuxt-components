<template>
  <div
    class="input-number-wrapper"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :data-input-variant="inputVariant"
    :data-has-left-slot="slots.left ? '' : undefined"
    :data-has-right-slot="slots.right ? '' : undefined"
  >
    <div v-if="slots.left" class="input-number-slot input-number-slot-left">
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
        :class="['input-number', `input-number--${weight}`, elementClasses]"
        :inputmode
        :aria-describedby
      />
    </div>
    <div v-if="slots.right" class="input-number-slot input-number-slot-right">
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

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const decimalPlaces = (value: number) => (String(value).split(".")[1] ?? "").length;

const minLength = computed(() => {
  const longest = Math.max(String(props.min).length, String(props.max).length) + decimalPlaces(props.step);
  return `${Math.min(longest + 1, 12)}em`;
});

const inputmode = computed(() => {
  if (props.min < 0) return undefined;
  return Number.isInteger(props.step) ? "numeric" : "decimal";
});
</script>

<style lang="css">
@layer components {
  .input-number-wrapper {
    --_min-width: v-bind(minLength);

    /* Public --input-number-* tokens, inline-fallback to the shared --theme-* tokens (see
     theming-component-token-pattern.md) — overriding one here doesn't touch every other themed
     input/control that also reads --theme-input-surface/--theme-border. Mirrors InputText's
     token shape so a native number input and the text-based InputTextAsNumberField variant
     look and behave the same way (see input-number.md's "Fixed 2026-09-22" note). */
    --_surface: var(--input-number-surface, var(--theme-input-surface));
    --_border: var(--input-number-border, var(--theme-border));
    --_border-focus: var(--input-number-border-focus, var(--theme-border-focus));

    display: flex;
    align-items: center;

    width: fit-content;
    max-inline-size: 100%;

    background-color: var(--_surface);
    overflow: hidden;
    transition: all var(--theme-form-transition-duration) ease-in-out;
    position: relative;
    z-index: 2;

    &[data-input-variant="normal"] {
      border: var(--form-element-border-width) solid var(--_border);
      border-radius: var(--form-input-border-radius);
      outline: var(--form-element-outline-width) solid transparent;

      &:has(input:hover, button:hover) {
        outline: var(--form-element-outline-width-focus) solid
          var(--input-number-border-hover, var(--theme-border-focus));
        outline-offset: var(--form-element-outline-offset-focus);
      }

      &:has(input:focus-visible, button:focus-visible) {
        outline: var(--form-element-outline-width-focus) solid var(--_border-focus);
        outline-offset: var(--form-element-outline-offset-focus);
      }
    }

    &[data-input-variant="underlined"] {
      border-bottom: var(--form-element-border-bottom-width-underlined) solid var(--_border);
    }

    .input-number-slot {
      display: flex;
      align-items: center;
      flex-shrink: 0;

      .icon {
        font-weight: 900;
      }

      .input-button {
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

    .input-number-container {
      min-inline-size: 0;
    }

    .input-number-slot-left .input-button {
      border-right: var(--form-element-border-width) solid var(--_border);
    }

    .input-number-slot-right .input-button {
      border-left: var(--form-element-border-width) solid var(--_border);
    }

    .input-number {
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
