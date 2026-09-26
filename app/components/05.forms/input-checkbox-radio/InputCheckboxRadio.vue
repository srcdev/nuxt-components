<template>
  <div
    class="input-checkbox-radio"
    :class="elementClasses"
    :data-type="type"
    :data-input-variant="inputVariant"
    :data-theme="theme"
    :data-button="isButton ? '' : undefined"
    :data-display-as-disc="displayAsDisc ? '' : undefined"
    :data-invalid="fieldHasError ? '' : undefined"
  >
    <div class="input-checkbox-radio-icon-slot">
      <slot name="checkedIcon">
        <Icon :name="defaultIcon" class="input-checkbox-radio-icon" />
      </slot>
    </div>

    <!-- v-model binds its checkbox/radio handler once at creation, so a type change needs a fresh input -->
    <input
      :id
      :key="type"
      v-model="modelValue"
      :type
      :true-value="trueValue"
      :false-value="falseValue"
      :name
      :required="required && !multipleOptions"
      :value="trueValue"
      class="input-checkbox-radio-input"
      :aria-describedby="ariaDescribedby || undefined"
      :aria-invalid="fieldHasError ? 'true' : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  type: "checkbox" | "radio";
  id: string;
  name: string;
  required?: boolean;
  theme?: FormUiTheme;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  ariaDescribedby?: string;
  displayAsDisc?: boolean;
  multipleOptions?: boolean;
  isButton?: boolean;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  theme: "default",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  trueValue: true,
  falseValue: false,
  ariaDescribedby: "",
  displayAsDisc: false,
  multipleOptions: false,
  isButton: false,
  inputVariant: "normal",
});

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>({
  required: true,
});

const defaultIcon = computed(() => (props.type === "checkbox" ? "material-symbols:check-small" : "material-symbols:circle"));

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
  .input-checkbox-radio {
    --_transition-duration: var(--input-checkbox-transition-duration, var(--theme-form-transition-duration));

    display: grid;
    grid-template-areas: "element-stack";
    place-content: center;

    background-color: var(--input-checkbox-surface, var(--theme-checkbox-symbol-surface));
    border: 0.1rem solid var(--input-checkbox-border, var(--theme-border));
    border-radius: var(--form-input-border-radius);
    outline: var(--form-element-outline-width) solid transparent;

    height: var(--input-checked-element-size);
    width: var(--input-checked-element-size);

    transition: all var(--_transition-duration) ease-in-out;

    &[data-type="checkbox"][data-input-variant="underlined"] {
      border-radius: 0;
    }

    &[data-type="radio"],
    &[data-type="checkbox"][data-button][data-display-as-disc] {
      border-radius: 100vw;
    }

    &:not([data-button]):has(input:focus-visible) {
      outline: var(--form-element-outline-width-focus) solid var(--input-checkbox-border-focus, var(--theme-border-focus));
      outline-offset: var(--form-element-outline-offset-focus);
    }

    .input-checkbox-radio-icon-slot {
      grid-area: element-stack;
      display: grid;
      place-content: center;
      opacity: 0;
      transition: opacity var(--_transition-duration) ease-in-out;

      .input-checkbox-radio-icon,
      .icon {
        color: var(--input-checkbox-icon-color, var(--theme-text));
        font-size: var(--_icon-size, var(--input-checked-icon-size));
      }
    }

    &:has(input:checked) .input-checkbox-radio-icon-slot {
      opacity: 1;
    }

    .input-checkbox-radio-input {
      touch-action: manipulation;
      grid-area: element-stack;
      appearance: none;
      margin: 0;
      overflow: hidden;
      opacity: 0;
      cursor: pointer;

      height: var(--input-checked-element-size);
      width: var(--input-checked-element-size);
    }

    @media (prefers-reduced-motion: reduce) {
      &,
      .input-checkbox-radio-icon-slot {
        transition: none;
      }
    }
  }
}
</style>
