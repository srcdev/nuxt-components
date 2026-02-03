<template>
  <FormFieldset
    :id
    :name
    :legend
    :fieldHasError
    :required
    :data-testid
    :styleClassPassthrough="['single-checkbox-fieldset']"
  >
    <template #description>
      <slot name="description"></slot>
    </template>

    <template #content>
      <div class="single-checkbox-items" :class="[optionsLayout]">
        <InputCheckboxRadioWithLabel
          type="checkbox"
          :name
          :required
          :label
          :fieldHasError
          v-model="modelValue"
          :trueValue
          :falseValue
          :size
          :theme
          :ariaDescribedby
        >
          <template #checkedIcon>
            <slot name="checkedIcon"></slot>
          </template>
          <template v-if="slots.labelContent" #labelContent>
            <slot name="labelContent"></slot>
          </template>
        </InputCheckboxRadioWithLabel>
      </div>
      <InputError
        :errorMessage
        :showError="fieldHasError"
        :id="errorId"
        :isDetached="true"
        :styleClassPassthrough="elementClasses"
      />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"

const props = defineProps({
  dataTestid: {
    type: String,
    default: "multiple-radio-buttons",
  },
  name: {
    type: String,
    required: true,
  },
  legend: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  errorMessage: {
    type: [Object, String],
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
  multipleOptions: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
    },
  },
  trueValue: {
    type: [String, Number, Boolean],
    default: true,
  },
  falseValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  optionsLayout: {
    type: String as PropType<string>,
    default: "equal-widths",
    validator(value: string) {
      return propValidators.optionsLayout.includes(value)
    },
  },
  equalCols: {
    type: Boolean,
    default: true,
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
})

const slots = useSlots()

const modelValue = defineModel()

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

// const inputErrorStyles = ref(styleClassPassthroughRef.value)

const id = `${props.name}-input-${useId()}`
const errorId = `${name}-error-message`
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${name}-description` : undefined
  return props.fieldHasError ? errorId : ariaDescribedbyId
})

watchEffect(() => {
  if (!slots.description && props.fieldHasError) {
    updateElementClasses(["mbs-12"])
  }
})
</script>

<style lang="css">
.single-checkbox-items {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.2rem;

  &.inline {
    flex-direction: row;
    flex-wrap: wrap;
  }

  &.block {
    flex-direction: column;
  }

  &.equal-widths {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
</style>
