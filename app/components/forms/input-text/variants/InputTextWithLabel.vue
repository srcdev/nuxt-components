<template>
  <div>
    <div
      class="input-text-with-label"
      :data-theme="formTheme"
      :class="[elementClasses, inputVariant, { dirty: isDirty }, { active: isActive }]"
    >
      <InputLabel
        :for="id"
        :id
        :theme
        :name
        :input-variant
        :field-has-error
        :style-class-passthrough="['input-text-label']"
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

      <InputTextCore
        v-model="modelValue"
        v-model:isDirty="isDirty"
        v-model:isActive="isActive"
        :type
        :inputmode
        :maxlength
        :id
        :name
        :placeholder
        :label
        :errorMessage
        :field-has-error
        :required
        :style-class-passthrough
        :theme
        :aria-describedby
        :size
        :input-variant
      >
        <template v-if="slots.left" #left>
          <slot name="left"></slot>
        </template>
        <template v-if="slots.right" #right>
          <slot name="right"></slot>
        </template>
      </InputTextCore>

      <InputError :errorMessage :showError="fieldHasError" :id="errorId" :isDetached="false" :inputVariant />
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
const props = defineProps({
  maxlength: {
    type: Number,
    default: 255,
  },
  type: {
    type: String as PropType<"text" | "email" | "password" | "number" | "tel" | "url">,
    required: true,
  },
  inputmode: {
    type: String as PropType<"text" | "email" | "tel" | "url" | "search" | "numeric" | "none" | "decimal">,
    default: "text",
    validator(value: string) {
      return propValidators.inputMode.includes(value)
    },
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: [Object, String],
    required: true,
  },
  fieldHasError: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
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
  size: {
    type: String as PropType<string>,
    default: "default",
    validator(value: string) {
      return propValidators.size.includes(value)
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

const modelValue = defineModel()
const isActive = ref<boolean>(false)
const isDirty = ref<boolean>(false)

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const testDirty = () => {
  const watchValue = modelValue.value ?? ""

  if (!isDirty.value && typeof watchValue === "string" && watchValue.length > 0) {
    isDirty.value = true
  }
}

onMounted(() => {
  testDirty()
})

watch(
  () => modelValue.value,
  () => {
    testDirty()
  }
)
</script>
