<template>
  <label
    :for="id"
    class="input-checkbox-radio-field"
    :class="elementClasses"
    :data-invalid="fieldHasError ? '' : undefined"
  >
    <InputCheckboxRadio
      :id
      v-model="modelValue"
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

    <div class="input-checkbox-radio-field-label">
      <slot name="labelContent">{{ label }}</slot>
    </div>
  </label>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
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
  inputVariant?: InputUiVariant;
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
  inputVariant: "normal",
});

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>({ required: true });
const id = useId();

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
  .input-checkbox-radio-field {
    display: flex;
    align-items: center;
    gap: var(--input-checked-icon-gap);
    min-height: var(--input-min-height);
    user-select: none;

    .input-checkbox-radio-field-label {
      display: flex;
      flex: 1;
      align-items: center;
      color: var(--input-checkbox-label-color, inherit);
      padding-block: var(--input-checkbox-label-padding-block);
      padding-inline: var(--input-checkbox-label-padding-inline);
      cursor: pointer;
    }
  }
}
</style>
