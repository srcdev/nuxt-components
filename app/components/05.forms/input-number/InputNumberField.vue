<template>
  <div
    class="input-number-field"
    :data-theme="theme"
    :data-invalid="fieldHasError ? '' : null"
    :data-input-variant="inputVariant"
    :class="elementClasses"
  >
    <InputLabel
      :id
      :required
      :input-variant
      :field-has-error
      :style-class-passthrough="['input-number-label']"
    >
      <template #textLabel>{{ label }}</template>
    </InputLabel>

    <InputDescription
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

    <InputNumber
      :id
      v-model="modelValue"
      :name
      :min
      :max
      :step
      :placeholder
      :theme
      :required
      :weight
      :input-variant
      :field-has-error
      :aria-describedby="ariaDescribedby()"
    >
      <template v-if="slots.left" #left>
        <InputButton
          type="button"
          :readonly="Number(modelValue) <= min"
          :is-pending="false"
          :button-text="stepDownLabel"
          :theme="theme"
          variant="inline"
          @click.stop.prevent="stepBy(-1)"
        >
          <template #iconOnly>
            <slot name="left"></slot>
          </template>
        </InputButton>
      </template>
      <template v-if="slots.right" #right>
        <InputButton
          type="button"
          :readonly="Number(modelValue) >= max"
          :is-pending="false"
          :button-text="stepUpLabel"
          :theme="theme"
          variant="inline"
          @click.stop.prevent="stepBy(1)"
        >
          <template #iconOnly>
            <slot name="right"></slot>
          </template>
        </InputButton>
      </template>
    </InputNumber>
    <InputError :id="errorId" :error-message :show-error="fieldHasError" :is-detached="true" :input-variant />
  </div>
</template>

<script setup lang="ts">
import type { FormUiTheme, FormWeight, InputUiVariant } from "~/types/forms/types.forms";

interface Props {
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  errorMessage: object | string;
  fieldHasError?: boolean;
  required?: boolean;
  theme?: FormUiTheme;
  weight?: FormWeight;
  inputVariant?: InputUiVariant;
  styleClassPassthrough?: string | string[];
  stepDownLabel?: string;
  stepUpLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  placeholder: "",
  fieldHasError: false,
  required: false,
  theme: "default",
  weight: "normal",
  inputVariant: "normal",
  styleClassPassthrough: () => [],
  stepDownLabel: "Step down",
  stepUpLabel: "Step up",
});

const slots = useSlots();
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
const modelValue = defineModel<number | readonly number[]>({
  required: true,
});

const decimalPlaces = (value: number) => (String(value).split(".")[1] ?? "").length;
const clamp = (value: number) => Math.min(Math.max(value, props.min), props.max);

const stepBy = (direction: 1 | -1) => {
  const current = modelValue.value;
  if (typeof current !== "number" || !Number.isFinite(current)) {
    modelValue.value = clamp(0);
    return;
  }
  const stepSize = Math.abs(props.step) || 1;
  const precision = Math.max(decimalPlaces(stepSize), decimalPlaces(current), decimalPlaces(props.min));
  const next = clamp(Number((current + direction * stepSize).toFixed(precision)));
  if (next !== current) modelValue.value = next;
};
</script>

<style lang="css">
@layer components {
  .input-number-field {
    min-inline-size: 0;
    overflow-wrap: anywhere;

    .input-number-label {
      display: block;
      margin-block: 0.8rem;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
