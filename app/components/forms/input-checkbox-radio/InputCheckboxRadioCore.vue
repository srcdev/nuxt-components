<template>
  <div class="input-checkbox-radio-wrapper" :data-theme="formTheme" :data-size="size" :class="wrapperClasses">
    <div class="input-checked-icon-slot">
      <slot name="checkedIcon">
        <Icon :name="defaultIcon" class="input-checked-icon-checked" />
      </slot>
    </div>

    <input
      :id
      ref="inputField"
      v-model="modelValue"
      :type
      :true-value="trueValue"
      :false-value="falseValue"
      :name
      :required="required && !multipleOptions"
      :value="trueValue"
      class="input-checkbox-radio-core"
      :class="inputClasses"
      :aria-checked="isChecked"
      :aria-describedby="ariaDescribedby"
      :aria-invalid="fieldHasError"
    />
  </div>
</template>

<script setup lang="ts">
import type { BaseCheckboxRadioProps } from "~/types/forms/types.forms";

interface Props extends BaseCheckboxRadioProps {
  isButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  size: "default",
  theme: "primary",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  trueValue: true,
  falseValue: false,
  ariaDescribedby: "",
  displayAsDisc: false,
  multipleOptions: false,
  isButton: false,
});

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough || []);

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();

const inputField = ref<HTMLInputElement | null>(null);

const defaultIcon = computed(() => {
  return props.type === "checkbox" ? "material-symbols:check-small" : "material-symbols:circle";
});

// Cache array check for performance
const isModelValueArray = computed(() => Array.isArray(modelValue.value));

const isChecked = computed(() => {
  if (!props.trueValue) return false;

  if (isModelValueArray.value) {
    return (modelValue.value as (string | number | boolean)[])?.includes(props.trueValue) || false;
  } else {
    return modelValue.value === props.trueValue;
  }
});

// Consolidated class computations
const wrapperClasses = computed(() => [
  props.type,
  props.size,
  elementClasses.value,
  {
    error: props.fieldHasError,
    button: props.isButton,
    "display-as-disc": props.displayAsDisc,
  },
]);

const inputClasses = computed(() => [
  props.size,
  {
    error: props.fieldHasError,
    "is-button": props.isButton,
  },
]);
</script>

<style lang="css">
.input-checkbox-radio-wrapper {
  display: grid;
  grid-template-areas: "element-stack";
  place-content: center;

  background-color: var(--theme-checkbox-symbol-surface);
  border: 0.1rem solid var(--theme-input-border);
  outline: var(--form-element-outline-width) solid var(--theme-input-outline);
  box-shadow: var(--_box-shadow);

  height: var(--input-checked-element-size);
  width: var(--input-checked-element-size);

  transition: all var(--theme-form-transition-duration) ease-in-out;

  &.checkbox {
    border-radius: var(--form-input-border-radius);
    &.button {
      &.display-as-disc {
        border-radius: 50%;
      }
    }
  }

  &.radio {
    border-radius: 50%;
  }

  &:has(.input-checkbox-radio-core:checked) {
    .input-checked-icon-slot {
      opacity: 1;

      .input-checked-icon-checked,
      .icon {
        color: var(--theme-checkbox-symbol-color);
      }
    }
  }

  /* focus-visible */
  &:not(.button):has(.input-checkbox-radio-core:focus-visible) {
    outline: var(--theme-focus-visible-outline);
  }

  .input-checked-icon-slot {
    grid-area: element-stack;
    display: grid;
    place-content: center;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    .input-checked-icon-checked,
    .icon {
      color: var(--theme-checkbox-symbol-color);
      height: var(--input-checked-icon-size);
      width: var(--input-checked-icon-size);
      box-shadow: var(--_box-shadow);
    }
  }

  .input-checkbox-radio-core {
    touch-action: manipulation;
    grid-area: element-stack;
    appearance: none;
    margin: 0;
    overflow: hidden;
    opacity: 0;

    height: var(--input-checked-element-size);
    width: var(--input-checked-element-size);

    &:hover {
      cursor: pointer;
    }

    &:not(.is-button) {
      &:focus-visible {
        border: var(--input-checkbox-radio-wrapper-border-on);
        outline: var(--input-checkbox-radio-wrapper-outline-on);
        box-shadow: var(--input-checkbox-radio-wrapper-box-shadow-on);
      }
    }
  }
}
</style>
