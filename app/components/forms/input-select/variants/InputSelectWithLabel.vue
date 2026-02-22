<template>
  <div>
    <div
      class="input-select-with-label"
      :class="[inputVariant, { dirty: isDirty }, { active: isActive }, { error: fieldHasError }]"
      :data-testid
      :data-theme="theme"
      :data-invalid="fieldHasError ? '' : null"
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
        :id
        :description-id
        :name
        :field-has-error="fieldHasError"
        :style-class-passthrough="['input-text-description']"
      >
        <template #descriptionHtml>
          <slot name="descriptionHtml"></slot>
        </template>
        <template #descriptionText>
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
        :theme="FormUiTheme"
        :aria-describedby
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
import type { FormUiTheme, InputUiVariant, IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  label: string;
  placeholder?: string;
  errorMessage: object | string;
  required?: boolean;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "input-select-with-label",
  placeholder: "",
  required: false,
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const FormUiTheme = computed(() => {
  return props.fieldHasError ? "error" : props.theme;
});

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<string | number | readonly number[]>({ required: true });
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");
const fieldData = defineModel<IFormMultipleOptions>("fieldData");
</script>
