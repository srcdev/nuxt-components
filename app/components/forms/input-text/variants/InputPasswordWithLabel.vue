<template>
  <InputTextWithLabel
    v-model="modelValue"
    :type="inputType"
    :maxlength
    :name
    :placeholder
    :label
    :errorMessage
    :fieldHasError
    :required
    :styleClassPassthrough
    :theme
    :size
    :inputVariant
  >
    <template #right>
      <InputButtonCore
        type="button"
        @click.stop.prevent="toggleDisplayPassword"
        :is-pending="false"
        :buttonText
        :theme="buttonTheme"
        :size
        @focusin="updateFocus(name, true)"
        @focusout="updateFocus(name, false)"
      >
        <template #iconOnly>
          <Icon v-if="displayPassword" name="radix-icons:eye-none" class="icon" />
          <Icon v-else name="radix-icons:eye-open" class="icon" />
        </template>
      </InputButtonCore>
    </template>
  </InputTextWithLabel>
</template>

<script setup lang="ts">
import propValidators from "../../c12/prop-validators"

const props = defineProps({
  type: {
    type: String as PropType<"text" | "password">,
    default: "password",
  },
  maxlength: {
    type: Number,
    default: 255,
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
    default: "medium",
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

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme
})

const buttonTheme = computed(() => {
  return props.inputVariant === "underlined" ? "input-action-underlined" : "input-action"
})

const modelValue = defineModel()

const { elementClasses, updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

const updateFocus = (name: string, isFocused: boolean) => {
  // console.log('updateFocus', name, isFocused);
  // modelValue.value.focusedField = isFocused ? name : '';
}

const inputType = ref<"text" | "password">(props.type)

const displayPassword = ref(false)
const buttonText = computed(() => {
  inputType.value = displayPassword.value ? "text" : "password"
  return displayPassword.value ? "Hide password" : "Show password"
})
const toggleDisplayPassword = () => {
  displayPassword.value = !displayPassword.value
}

updateElementClasses(["has-right-button"])
</script>
