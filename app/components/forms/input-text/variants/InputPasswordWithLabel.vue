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
    :input-variant
  >
    <template #descriptionHtml>
      <slot name="descriptionHtml"></slot>
    </template>
    <template #descriptionText>
      <slot name="descriptionText"></slot>
    </template>

    <template #right>
      <InputButtonCore
        type="button"
        :is-pending="false"
        :button-text
        :theme="theme"
        variant="inline"
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
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  type?: "text" | "password";
  maxlength?: number;
  name: string;
  placeholder?: string;
  label: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  type: "password",
  maxlength: 255,
  placeholder: "",
  fieldHasError: false,
  required: false,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
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
