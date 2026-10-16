<template>
  <div
    class="input-text-field"
    :class="elementClasses"
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
    :data-dirty="isDirty ? '' : null"
    :data-active="isActive ? '' : null"
  >
    <InputLabel
      :id
      :required
      :input-variant
      :field-has-error
      :style-class-passthrough="['input-text-label']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
      v-if="inputVariant !== 'outlined'"
      :description-id
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

    <InputText
      :id
      v-model="modelValue"
      v-model:is-dirty="isDirty"
      v-model:is-active="isActive"
      :type
      :inputmode
      :maxlength
      :min
      :max
      :name
      :placeholder
      :field-has-error
      :required
      :readonly
      :autocomplete
      :theme
      :aria-describedby="ariaDescribedby() ?? undefined"
      :input-variant
    >
      <template v-if="slots.left" #left>
        <slot name="left"></slot>
      </template>
      <template v-if="slots.right" #right>
        <slot name="right"></slot>
      </template>
    </InputText>

    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="false" :input-variant />

    <InputDescription
      v-if="inputVariant === 'outlined'"
      :description-id
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
import type { InputTypesText, FormUiTheme, InputUiVariant, InputMode } from "~/types/forms/types.forms";

interface Props {
  maxlength?: number;
  min?: string | number;
  max?: string | number;
  type: InputTypesText;
  inputmode?: InputMode;
  name: string;
  placeholder?: string;
  label: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  readonly?: boolean;
  autocomplete?: string;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  maxlength: 255,
  min: undefined,
  max: undefined,
  inputmode: "text",
  placeholder: "",
  fieldHasError: false,
  required: false,
  readonly: false,
  autocomplete: undefined,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<string>({ required: true });
const isActive = ref<boolean>(false);
const isDirty = ref<boolean>(false);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

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

<style lang="css">
@layer components {
  .input-text-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
}
</style>
