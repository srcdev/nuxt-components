<template>
  <FormFieldset
    :id="`${id}-fieldset`"
    :name
    :legend="label"
    :field-has-error
    :required
    :style-class-passthrough="['input-otp-field', elementClasses]"
    :data-invalid="fieldHasError ? '' : null"
    :data-theme="theme"
  >
    <template #content>
      <InputDescription
        :description-id
        :input-variant
        :field-has-error="fieldHasError"
        :style-class-passthrough="['input-otp-description']"
      >
        <template v-if="slots.descriptionHtml" #descriptionHtml>
          <slot name="descriptionHtml"></slot>
        </template>
        <template v-if="slots.descriptionText" #descriptionText>
          <slot name="descriptionText"></slot>
        </template>
      </InputDescription>

      <InputOtp
        :id
        v-model="modelValue"
        :name
        :length
        :autofocus
        :required
        :digit-label
        :field-has-error
        :theme
        :input-variant
        :aria-describedby="ariaDescribedby() ?? ''"
        @complete="emit('complete', $event)"
      />

      <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" :input-variant />
    </template>
  </FormFieldset>
</template>

<script setup lang="ts">
import type { FormUiTheme, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  name: string;
  label: string;
  length?: number;
  autofocus?: boolean;
  required?: boolean;
  digitLabel?: string;
  errorMessage?: object | string;
  fieldHasError?: boolean;
  theme?: FormUiTheme;
  inputVariant?: InputUiVariant;
  styleClassPassthrough?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  autofocus: false,
  required: false,
  digitLabel: "Digit {index} of {length}",
  errorMessage: "",
  fieldHasError: false,
  theme: "default",
  inputVariant: "normal",
  styleClassPassthrough: () => [],
});

const emit = defineEmits<{ complete: [code: string] }>();

const modelValue = defineModel<string>({ required: true });

const slots = useSlots();
const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => resetElementClasses(props.styleClassPassthrough)
);

const { id, errorId, descriptionId, ariaDescribedby } = useAriaDescribedById(
  props.name,
  toRef(props, "fieldHasError"),
  slots
);
</script>

<style lang="css">
@layer components {
  .input-otp-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;

    .input-otp {
      margin-block-end: var(--input-otp-field-gap, 0.8rem);
    }
  }
}
</style>
