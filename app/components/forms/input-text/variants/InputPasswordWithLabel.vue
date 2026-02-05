<template>
  <InputTextWithLabel
    v-model="modelValue"
    :type="inputType"
    :maxlength
    :name
    :placeholder
    :label
    :error-message
    :field-has-error
    :required
    :style-class-passthrough
    :theme
    :size
    :input-variant
  >
    <template #right>
      <InputButtonCore
        type="button"
        :is-pending="false"
        :button-text
        :theme="buttonTheme"
        :size
        @click.stop.prevent="toggleDisplayPassword"
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
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms";

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
    type: String as PropType<FormTheme>,
    default: "primary",
  },
  size: {
    type: String as PropType<FormSize>,
    default: "medium",
  },
  inputVariant: {
    type: String as PropType<InputVariant>,
    default: "normal",
  },
});

const buttonTheme = computed(() => {
  return props.inputVariant === "underlined" ? "input-action-underlined" : "input-action";
});

const modelValue = defineModel<string>();

const { updateElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const inputType = computed<"text" | "password">(() => {
  return displayPassword.value ? "text" : "password";
});

const displayPassword = ref(false);
const buttonText = computed(() => {
  return displayPassword.value ? "Hide password" : "Show password";
});
const toggleDisplayPassword = () => {
  displayPassword.value = !displayPassword.value;
};

updateElementClasses(["has-right-button"]);
</script>
