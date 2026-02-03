<template>
  <div>
    <div
      class="input-select-with-label"
      :class="[inputVariant, { dirty: isDirty }, { active: isActive }, { error: fieldHasError }]"
      :data-testid
      :data-theme="formTheme"
      :data-size="size"
    >
      <InputLabel
        :for="id"
        :id
        :theme
        :name
        :input-variant
        :field-has-error
        :style-class-passthrough="['input-select-label']"
      >
        <template #textLabel>{{ label }}</template>
      </InputLabel>

      <InputDescription
        v-if="inputVariant !== 'outlined'"
        :id
        :name
        :input-variant
        :field-has-error="fieldHasError"
        :style-class-passthrough="['input-text-description']"
      >
        <template v-if="slots.descriptionHtml" #descriptionHtml>
          <slot name="descriptionHtml"></slot>
        </template>
        <template v-if="slots.descriptionText" #descriptionText>
          <slot name="descriptionText"></slot>
        </template>
      </InputDescription>

      <InputSelectCore
        v-model="modelValue"
        v-model:fieldData="fieldData"
        v-model:isDirty="isDirty"
        v-model:isActive="isActive"
        :id
        :name
        :placeholder
        :field-has-error
        :required
        :style-class-passthrough
        :theme="formTheme"
        :aria-describedby
        :size
        :input-variant
      />

      <InputError
        :errorMessage="errorMessage"
        :showError="fieldHasError"
        :id="errorId"
        :isDetached="false"
        :inputVariant
      />
    </div>
    <InputDescription
      v-if="inputVariant === 'outlined'"
      :id
      :name
      :input-variant
      :field-has-error="fieldHasError"
      :style-class-passthrough="['input-text-description']"
    >
      <template v-if="slots.descriptionHtml" #descriptionHtml>
        <slot name="descriptionHtml"></slot>
      </template>
      <template v-if="slots.descriptionText" #descriptionText>
        <slot name="descriptionText"></slot>
      </template>
    </InputDescription>
  </div>
</template>

<script setup lang="ts">
import propValidators from "../../c12/prop-validators"
import type { IFormMultipleOptions } from "../../../../types/forms/types.forms"

const props = defineProps({
  dataTestid: {
    type: String,
    default: "input-select-with-label",
  },
  name: {
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
  size: {
    type: String as PropType<string>,
    default: "medium",
    validator(value: string) {
      return propValidators.size.includes(value)
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
  inputVariant: {
    type: String as PropType<string>,
    default: "normal",
    validator(value: string) {
      return propValidators.inputVariant.includes(value)
    },
  },
})

const slots = useSlots()

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const id = `${props.name}-${useId()}`
const errorId = `${id}-error-message`
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.descriptionText || slots.descriptionHtml ? `${id}-description` : undefined
  return props.fieldHasError ? errorId : ariaDescribedbyId
})

const modelValue = defineModel({ required: true })
const isDirty = defineModel("isDirty")
const isActive = defineModel("isActive")
const fieldData = defineModel("fieldData") as Ref<IFormMultipleOptions>
</script>
