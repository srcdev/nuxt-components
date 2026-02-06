<template>
  <div>
    <div
      class="input-text-with-label"
      :data-theme="formTheme"
      :class="[elementClasses, inputVariant, { dirty: isDirty }, { active: isActive }]"
    >
      <InputLabel
        :id
        :for="id"
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
        :id
        v-model="modelValue"
        v-model:is-dirty="isDirty"
        v-model:is-active="isActive"
        :type
        :inputmode
        :maxlength
        :name
        :placeholder
        :label
        :error-message
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

      <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="false" :input-variant />
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
import type { FormTheme, FormSize, InputVariant, InputMode } from "~/types/forms/types.forms";

interface Props {
  maxlength?: number;
  type: "text" | "email" | "password" | "number" | "tel" | "url";
  inputmode?: InputMode;
  name: string;
  placeholder?: string;
  label: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  size?: FormSize;
  inputVariant?: InputVariant;
}

const props = withDefaults(defineProps<Props>(), {
  maxlength: 255,
  inputmode: "text",
  placeholder: "",
  fieldHasError: false,
  required: false,
  styleClassPassthrough: () => [],
  theme: "primary",
  size: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const formTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const id = `${props.name}-${useId()}`;
const errorId = `${id}-error-message`;
const ariaDescribedby = computed(() => {
  const ariaDescribedbyId = slots.descriptionText || slots.descriptionHtml ? `${id}-description` : undefined;
  return props.fieldHasError ? errorId : ariaDescribedbyId;
});

const modelValue = defineModel<string>();
const isActive = ref<boolean>(false);
const isDirty = ref<boolean>(false);

const { elementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

const testDirty = () => {
  const watchValue = modelValue.value ?? "";

  if (!isDirty.value && typeof watchValue === "string" && watchValue.length > 0) {
    isDirty.value = true;
  }
};

onMounted(() => {
  testDirty();
});

watch(
  () => modelValue.value,
  () => {
    testDirty();
  }
);
</script>
