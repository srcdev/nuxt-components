<template>
  <label
    :for="id"
    class="input-checkbox-radio-with-label"
    :data-size="size"
    :class="[elementClasses, optionsLayout, { error: fieldHasError }]"
  >
    <InputCheckboxRadioCore
      :id
      v-model="modelValue"
      :type
      :name
      :required
      :size
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

    <div v-if="slots.labelContent" class="input-checkbox-radio-label body-normal">
      <slot name="labelContent"></slot>
    </div>
    <div v-else class="input-checkbox-radio-label body-normal-semibold">{{ label }}</div>
  </label>
</template>

<script setup lang="ts">
import type { BaseCheckboxRadioProps } from "~/types/forms/types.forms";

interface Props extends Omit<BaseCheckboxRadioProps, "id"> {
  label: string;
  optionsLayout?: string;
}

const props = defineProps<Props>();

const slots = useSlots();
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough || []);

const modelValue = defineModel<(string | number | boolean)[] | string | number | boolean | undefined>();
const id = useId();
</script>

<style lang="css">
.input-checkbox-radio-with-label {
  --_white-space: wrap;

  display: flex;
  align-items: center;

  transition: all var(--theme-form-transition-duration) ease-in-out;

  &.inline {
    --_white-space: nowrap;
  }

  .input-checkbox-radio-label {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    margin-block: 0.8rem;
    padding-inline: 0.8rem;
    white-space: var(--_white-space);

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
