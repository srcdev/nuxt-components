<template>
  <label
    :for="id"
    class="input-checkbox-radio-with-label"
    :class="[elementClasses, optionsLayout, { error: fieldHasError }]"
  >
    <InputCheckboxRadioCore
      :id
      v-model="modelValue"
      :type
      :name
      :required
      :true-value="trueValue"
      :false-value="falseValue"
      :field-has-error="fieldHasError"
      :theme
      :input-variant
      :aria-describedby="ariaDescribedby"
      :display-as-disc="displayAsDisc"
    >
      <template #checkedIcon>
        <slot name="checkedIcon"></slot>
      </template>
    </InputCheckboxRadioCore>

    <div v-if="slots.labelContent" class="input-checkbox-radio-label body-normal">
      <slot name="labelContent"></slot>
    </div>
    <div v-else class="input-checkbox-radio-label body-normal-semibold">{{ label }}</div>
  </label>
</template>

<script setup lang="ts">
import type { InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  type: "checkbox" | "radio";
  name: string;
  required?: boolean;
  theme?: "default" | "success" | "error" | "warning";
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  trueValue?: string | number | boolean;
  falseValue?: string | number | boolean;
  ariaDescribedby?: string;
  displayAsDisc?: boolean;
  multipleOptions?: boolean;
  label: string;
  optionsLayout?: string;
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
  optionsLayout: "equal-widths",
  inputVariant: "normal",
});

const slots = useSlots();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough || []);

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const id = useId();
</script>

<style lang="css">
@layer components {
.input-checkbox-radio-with-label {
  --_white-space: wrap;

  display: flex;
  align-items: center;
  gap: var(--input-checked-icon-gap);
  min-height: var(--input-min-height);

  transition: all var(--theme-form-transition-duration) ease-in-out;

  &.inline {
    --_white-space: nowrap;
  }

  .input-checkbox-radio-label {
    display: flex;
    flex: 1;
    align-items: center;
    padding-block: var(--input-checkbox-label-padding-block);
    padding-inline: var(--input-checkbox-label-padding-inline);
    /* white-space: nowrap; */

    &:hover {
      cursor: pointer;
    }
  }
}
}
</style>
