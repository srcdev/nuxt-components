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
    type: String as PropType<InputMode>,
    default: "text",
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
    default: "default",
  },
  inputVariant: {
    type: String as PropType<InputVariant>,
    default: "normal",
  },
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
