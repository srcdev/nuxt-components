<template>
  <div
    class="input-select-field"
    :class="elementClasses"
    :data-testid
    :data-theme="theme"
    :data-input-variant="inputVariant"
    :data-invalid="fieldHasError ? '' : null"
  >
    <InputLabel
      :id
      :required
      :input-variant
      :field-has-error
      :style-class-passthrough="['input-select-label']"
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

    <InputSelect
      :id
      v-model="modelValue"
      v-model:field-data="fieldData"
      v-model:is-dirty="isDirty"
      v-model:is-active="isActive"
      :name
      :placeholder
      :title
      :field-has-error
      :required
      :theme="selectTheme"
      :aria-describedby="ariaDescribedby()"
      :input-variant
    />

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
import type { FormUiTheme, InputUiVariant, IFormMultipleOptions } from "~/types/forms/types.forms";

interface Props {
  dataTestid?: string;
  name: string;
  label: string;
  placeholder?: string;
  title?: string;
  errorMessage: object | string;
  required?: boolean;
  fieldHasError?: boolean;
  styleClassPassthrough?: string | string[];
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
}

const props = withDefaults(defineProps<Props>(), {
  dataTestid: "input-select-field",
  placeholder: "",
  title: "Please select an option",
  required: false,
  fieldHasError: false,
  styleClassPassthrough: () => [],
  theme: "default",
  inputVariant: "normal",
});

const slots = useSlots();

const selectTheme = computed(() => (props.fieldHasError ? "error" : props.theme));

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);

const modelValue = defineModel<string | number | readonly number[]>({ required: true });
const isDirty = defineModel<boolean>("isDirty");
const isActive = defineModel<boolean>("isActive");
const fieldData = defineModel<IFormMultipleOptions>("fieldData", { required: true });
</script>

<style lang="css">
@layer components {
  .input-select-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
}
</style>
