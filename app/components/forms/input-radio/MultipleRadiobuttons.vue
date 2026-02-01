<template>
  <FormFieldset
    :id
    :name
    :legend
    :fieldHasError
    :required
    :data-testid
    :styleClassPassthrough="['multiple-radiobuttons-fieldset']"
  >
    <template #description>
      <slot name="description"></slot>
    </template>

    <template #content>
      <div class="multiple-radiobuttons-items" :class="[optionsLayout]">
        <template v-for="item in fieldData.data" :key="item.id">
          <InputCheckboxRadioButton
            v-if="isButton"
            type="radio"
            :id="`${name}-${item.value}`"
            :name="`${name}-${item.name}`"
            :required
            :label="item.label"
            :fieldHasError
            v-model="modelValue"
            :true-value="item.value"
            :size
            :optionsLayout
            :theme
            :direction
            :ariaDescribedby
            :display-as-lozenge
          >
            <template #checkedIcon>
              <slot name="checkedIcon"></slot>
            </template>
            <template #itemIcon>
              <slot name="itemIcon">
                <Icon name="material-symbols:add-2" class="icon" />
              </slot>
            </template>
          </InputCheckboxRadioButton>
          <InputCheckboxRadioWithLabel
            v-else
            type="radio"
            :id="`${name}-${item.value}`"
            :name="`${name}-${item.name}`"
            :required
            :label="item.label"
            :fieldHasError
            v-model="modelValue"
            :true-value="item.value"
            :size
            :optionsLayout
            :theme
            :ariaDescribedby
          >
            <template #checkedIcon>
              <slot name="checkedIcon"></slot>
            </template>
          </InputCheckboxRadioWithLabel>
        </template>
      </div>
      <InputError :errorMessage="errorMessage" :showError="fieldHasError" :id="errorId" :isDetached="true" />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import propValidators from "../c12/prop-validators"
import type { IFormMultipleOptions } from "../../../../shared/types/types.forms"

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
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  isButton: {
    type: Boolean,
    default: false,
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
  direction: {
    type: String as PropType<"row" | "row-reverse">,
    default: "row",
    validator(value: string) {
      return ["row", "row-reverse"].includes(value)
    },
  },
  displayAsLozenge: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const id = `${props.name}-input-${useId()}`
const errorId = `${name}-error-message`
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.description ? `${id}-description` : undefined
  return props.fieldHasError ? errorId : ariaDescribedbyId
})

const modelValue = defineModel()
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>
</script>

<style lang="css">
.multiple-radiobuttons-items {
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
