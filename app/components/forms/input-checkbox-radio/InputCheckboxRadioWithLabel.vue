<template>
  <label
    :for="id"
    class="input-checkbox-radio-with-label"
    :data-size="size"
    :class="[elementClasses, optionsLayout, { error: fieldHasError }]"
  >
    <InputCheckboxRadioCore
      :type
      :id
      :name
      :required
      v-model="modelValue"
      :size
      :trueValue
      :falseValue
      :fieldHasError
      :theme
      :ariaDescribedby
      :displayAsDisc
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
import propValidators from "../c12/prop-validators"

const props = defineProps({
  type: {
    type: String as PropType<"checkbox" | "radio">,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  optionsLayout: {
    type: String as PropType<string>,
    default: "equal-widths",
    validator(value: string) {
      return propValidators.optionsLayout.includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  theme: {
    type: String as PropType<string>,
    default: "primary",
    validator(value: string) {
      return propValidators.theme.includes(value)
    },
  },
  ariaDescribedby: {
    type: String,
    default: null,
  },
  displayAsDisc: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()
const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const modelValue = defineModel()
const id = useId()
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
