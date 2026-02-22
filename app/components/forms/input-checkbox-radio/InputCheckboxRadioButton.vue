<template>
  <label
    :for="id"
    class="input-checkbox-radio-options-button"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :class="[elementClasses, optionsLayout, { error: fieldHasError }, { lozenge: displayAsLozenge }]"
  >
    <InputCheckboxRadioCore
      :id
      v-model="modelValue"
      :is-button="true"
      :type
      :name
      :required
      :true-value="trueValue"
      :false-value="falseValue"
      :field-has-error="fieldHasError"
      :theme
      :aria-describedby="ariaDescribedby"
      :display-as-disc="displayAsDisc"
    >
      <template #checkedIcon>
        <slot name="checkedIcon"></slot>
      </template>
    </InputCheckboxRadioCore>
    <div v-if="slots.labelContent" class="input-checkbox-radio-options-button-label">
      <slot name="labelContent"></slot>
    </div>
    <div v-else class="input-checkbox-radio-options-button-label">{{ label }}</div>
    <div class="decorator-icon">
      <slot name="itemIcon">
        <Icon name="material-symbols:add-2" class="icon" aria-hidden="true" focusable="false" />
      </slot>
    </div>
  </label>
</template>

<script setup lang="ts">
import type { BaseCheckboxRadioProps, FormUiTheme } from "~/types/forms/types.forms";

interface Props extends BaseCheckboxRadioProps {
  label: string;
  optionsLayout?: string;
  direction?: "row" | "row-reverse";
  displayAsLozenge?: boolean;
  ariaDescribedby?: string;
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  theme: "default" as FormUiTheme,
  fieldHasError: false,
  styleClassPassthrough: () => [],
  trueValue: true,
  falseValue: false,
  ariaDescribedby: "",
  displayAsDisc: false,
  multipleOptions: false,
  optionsLayout: "equal-widths",
  direction: "row",
  displayAsLozenge: false,
});

const slots = useSlots();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough || []);

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();

const flexDirection = ref(props.direction);
</script>

<style lang="css">
.input-checkbox-radio-options-button {
  --_white-space: wrap;

  display: flex;
  flex-direction: v-bind(flexDirection);
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 0.4rem;
  transition: all 0.2s ease-in-out;

  &.lozenge {
    border-radius: 100vw;
  }

  &.inline {
    --_white-space: nowrap;
  }
  background-color: var(--theme-input-surface);
  border: var(--form-element-border-width) solid var(--theme-input-border);
  outline: var(--form-element-outline-width) solid var(--theme-input-outline);

  box-shadow: 0.1rem 0.1rem 0.8rem 0.1rem transparent;

  &:hover {
    background-color: var(--theme-input-surface-hover);
    border-color: var(--theme-input-border);
    outline-color: var(--theme-input-outline-hover);
    outline-offset: var(--form-element-outline-offset-focus);
    cursor: pointer;
  }

  &:has(.input-checkbox-radio-core:focus-visible) {
    background-color: var(--theme-input-surface-focus);
    outline-color: var(--theme-input-outline-focus);
    outline-offset: var(--form-element-outline-offset-focus);
  }

  padding-block: 0.4rem;
  padding-inline: 1.2rem;
  gap: 1rem;

  .input-checkbox-radio-options-button-label {
    display: flex;
    flex-grow: 1;
    color: var(--theme-checkbox-label-text-color);
    font-size: var(--input-font-size);
    width: 100%;
    min-height: var(--input-element-line-height);
    align-items: center;
    justify-content: center;
    padding-block: 0.8rem;
    padding-inline: 0.8rem;
    white-space: var(--_white-space);

    &:hover {
      cursor: pointer;
    }
  }

  .decorator-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-checkbox-decorator-color);

    .icon {
      height: var(--input-checkbox-decorator-icon-size);
      width: var(--input-checkbox-decorator-icon-size);
    }
  }

  .input-checkbox-radio-wrapper {
    width: calc(var(--input-checked-icon-size) - 0.6rem);
    height: calc(var(--input-checked-icon-size) - 0.6rem);

    .input-checked-icon-slot {
      .input-checked-icon-checked {
        width: calc(var(--input-checked-icon-size) - 0.8rem);
        height: calc(var(--input-checked-icon-size) - 0.8rem);
      }
    }

    .input-checkbox-radio-core {
      width: calc(var(--input-checked-icon-size) - 0.6rem);
      height: calc(var(--input-checked-icon-size) - 0.6rem);
    }
  }
}
</style>
