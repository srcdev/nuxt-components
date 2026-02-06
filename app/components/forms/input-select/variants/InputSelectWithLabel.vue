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
        :id
        :for="id"
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
        :id
        v-model="modelValue"
        v-model:field-data="fieldData"
        v-model:is-dirty="isDirty"
        v-model:is-active="isActive"
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
        :id="errorId"
        :error-message="errorMessage"
        :show-error="fieldHasError"
        :is-detached="false"
        :input-variant
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
import type { FormTheme, FormSize, InputVariant, IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  label: string;
  placeholder?: string;
  errorMessage: object | string;
  required?: boolean;
  fieldHasError?: boolean;
  size?: FormSize;
  styleClassPassthrough?: string | string[];
  theme?: FormTheme;
  inputVariant?: InputVariant;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "input-select-with-label",
  placeholder: "",
  required: false,
  fieldHasError: false,
  size: "medium",
  styleClassPassthrough: () => [],
  theme: "primary",
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

const modelValue = defineModel<string | number | readonly number[]>({ required: true });
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");
const fieldData = defineModel<IFormMultipleOptions>("fieldData");
</script>
