<template>
  <label
    :for="id"
    class="input-checkbox-radio-button"
    :class="elementClasses"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : undefined"
    :data-options-layout="optionsLayout"
    :data-direction="direction"
    :data-pill="isPill ? '' : undefined"
  >
    <InputCheckboxRadio
      :id
      v-model="modelValue"
      :is-button="true"
      :type
      :name
      :required
      :multiple-options
      :true-value
      :false-value
      :field-has-error
      :theme
      :input-variant
      :aria-describedby
      :display-as-disc
    >
      <template #checkedIcon>
        <slot name="checkedIcon"></slot>
      </template>
    </InputCheckboxRadio>
    <div class="input-checkbox-radio-button-label">
      <slot name="labelContent">{{ label }}</slot>
    </div>
    <div class="input-checkbox-radio-button-icon">
      <slot name="itemIcon">
        <Icon :name="itemIcon" class="icon" aria-hidden="true" focusable="false" />
      </slot>
    </div>
  </label>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant, OptionsLayout } from "~/types/forms/types.forms";

interface Props {
  id: string;
  type: "checkbox" | "radio";
  name: string;
  label?: string;
  required?: boolean;
  theme?: FormUiTheme;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  ariaDescribedby?: string;
  displayAsDisc?: boolean;
  multipleOptions?: boolean;
  optionsLayout?: OptionsLayout;
  direction?: "row" | "row-reverse";
  isPill?: boolean;
  inputVariant?: InputUiVariant;
  itemIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  required: false,
  theme: "default",
  fieldHasError: false,
  styleClassPassthrough: () => [],
  trueValue: true,
  falseValue: false,
  ariaDescribedby: "",
  displayAsDisc: false,
  multipleOptions: false,
  optionsLayout: "equal-widths",
  direction: "row",
  isPill: false,
  inputVariant: "normal",
  itemIcon: "material-symbols:add-2",
});

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>({ required: true });

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
  .input-checkbox-radio-button {
    --_white-space: wrap;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--input-checkbox-button-gap, 1rem);
    padding-block: var(--input-checkbox-button-padding-block, 0.4rem);
    padding-inline: var(--input-checkbox-button-padding-inline, 1.2rem);
    user-select: none;

    background-color: var(--input-checkbox-button-surface, var(--theme-input-surface));
    border: var(--form-element-border-width) solid var(--input-checkbox-button-border, var(--theme-border));
    border-radius: var(--input-checkbox-button-border-radius, 0.4rem);
    outline: var(--form-element-outline-width) solid transparent;

    transition: all var(--input-checkbox-transition-duration, var(--theme-form-transition-duration)) ease-in-out;

    &[data-direction="row-reverse"] {
      flex-direction: row-reverse;
    }

    &[data-pill] {
      border-radius: var(--input-checkbox-button-border-radius-pill, 100vw);
    }

    &[data-options-layout="inline"] {
      --_white-space: nowrap;
    }

    &:hover {
      background-color: var(--input-checkbox-button-surface-hover, var(--theme-input-surface-hover));
      outline-color: var(--input-checkbox-button-ring-hover, var(--theme-ring));
      outline-offset: var(--form-element-outline-offset-focus);
      cursor: pointer;
    }

    &:has(.input-checkbox-radio-input:focus-visible) {
      background-color: var(--input-checkbox-button-surface-focus, var(--theme-surface-subtle));
      outline-color: var(--input-checkbox-button-ring-focus, var(--theme-border-focus));
      outline-offset: var(--form-element-outline-offset-focus);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    .input-checkbox-radio-button-label {
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      width: 100%;
      color: var(--input-checkbox-button-label-color, var(--theme-text));
      font-size: var(--input-font-size);
      /* justify-content centres the block; text-align centres each wrapped line within it */
      text-align: center;
      padding-block: var(--input-checkbox-button-label-padding-block, 0.8rem);
      padding-inline: var(--input-checkbox-button-label-padding-inline, 0.8rem);
      white-space: var(--_white-space);
      cursor: pointer;
    }

    .input-checkbox-radio-button-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--input-checkbox-button-icon-color, var(--theme-text));

      .icon {
        font-size: var(--input-checkbox-decorator-icon-size);
      }
    }

    .input-checkbox-radio {
      --_icon-size: calc(var(--input-checked-icon-size) - 0.8rem);

      width: calc(var(--input-checked-icon-size) - 0.6rem);
      height: calc(var(--input-checked-icon-size) - 0.6rem);

      .input-checkbox-radio-input {
        width: calc(var(--input-checked-icon-size) - 0.6rem);
        height: calc(var(--input-checked-icon-size) - 0.6rem);
      }
    }
  }
}
</style>
