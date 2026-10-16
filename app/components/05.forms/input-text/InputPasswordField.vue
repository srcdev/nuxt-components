<template>
  <InputTextField
    v-model="modelValue"
    class="input-password-field"
    :type="inputType"
    :maxlength
    :name
    :placeholder
    :label
    :error-message
    :field-has-error
    :required
    :autocomplete
    :style-class-passthrough
    :theme
    :input-variant
  >
    <template v-if="slots.descriptionHtml" #descriptionHtml>
      <slot name="descriptionHtml"></slot>
    </template>
    <template v-if="slots.descriptionText" #descriptionText>
      <slot name="descriptionText"></slot>
    </template>

    <template #right>
      <InputButton
        type="button"
        :is-pending="false"
        :button-text
        :theme="theme"
        variant="inline"
        @click.stop.prevent="toggleDisplayPassword"
      >
        <template #iconOnly>
          <Icon v-if="displayPassword" name="radix-icons:eye-none" class="input-password-field-icon" />
          <Icon v-else name="radix-icons:eye-open" class="input-password-field-icon" />
        </template>
      </InputButton>
    </template>
  </InputTextField>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  /** Ignored: the toggle sets the type. Declared so a passed `type` can't override it. */
  type?: "text" | "password";
  maxlength?: number;
  name: string;
  placeholder?: string;
  label: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  autocomplete?: string;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
  showPasswordText?: string;
  hidePasswordText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "password",
  maxlength: 255,
  placeholder: "",
  fieldHasError: false,
  required: false,
  autocomplete: "current-password",
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
  showPasswordText: "Show password",
  hidePasswordText: "Hide password",
});

const slots = useSlots();

const modelValue = defineModel<string>({ required: true });

const displayPassword = ref(false);
const inputType = computed<"text" | "password">(() => (displayPassword.value ? "text" : "password"));
const buttonText = computed(() => (displayPassword.value ? props.hidePasswordText : props.showPasswordText));

const toggleDisplayPassword = () => {
  displayPassword.value = !displayPassword.value;
};
</script>
