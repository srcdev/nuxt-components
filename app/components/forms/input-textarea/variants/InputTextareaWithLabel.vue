<template>
  <div>
    <div
      class="input-textarea-with-label"
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
        :style-class-passthrough="['input-textarea-label']"
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

      <InputTextareaCore
        :id
        v-model="modelValue"
        v-model:is-dirty="isDirty"
        v-model:is-active="isActive"
        :maxlength
        :name
        :placeholder
        :label
        :field-has-error
        :required
        :style-class-passthrough
        :theme
        :size
        :input-variant
        :aria-describedby
      >
        <template v-if="slots.left" #left>
          <slot name="left"></slot>
        </template>
        <template v-if="slots.right" #right>
          <slot name="right"></slot>
        </template>
      </InputTextareaCore>
      <InputError :id :error-message :show-error="fieldHasError" :is-detached="false" :input-variant />
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
import type { FormTheme, FormSize, InputVariant } from "~/types/forms/types.forms";
const props = defineProps({
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

const modelValue = defineModel<string | number | readonly string[] | null | undefined>();
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
